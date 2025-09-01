"use client";

import { useEffect, useState } from "react";
import { Connection, PublicKey, LAMPORTS_PER_SOL, Transaction, SystemProgram } from "@solana/web3.js";
import { getAssociatedTokenAddress, getAccount } from "@solana/spl-token";
import { useJupiter } from "@jup-ag/react-hook";
import { useWallet } from "@solana/wallet-adapter-react";

// Multiple RPC endpoints for better reliability
const RPC_ENDPOINTS = [
  "https://api.mainnet-beta.solana.com",
  "https://solana-mainnet.g.alchemy.com/v2/demo",
  "https://rpc.ankr.com/solana",
  "https://solana.public-rpc.com"
];

const GOLD_MINT = new PublicKey("So11111111111111111111111111111111111111112"); // placeholder - ganti dengan mint GOLD token yang sebenarnya
const STAKING_CONTRACT = new PublicKey("11111111111111111111111111111111"); // placeholder - ganti dengan contract staking yang sebenarnya

interface SolanaDashboardProps {
  wallet?: any;
}

export default function SolanaDashboard({ wallet: propWallet }: SolanaDashboardProps) {
  const [solBalance, setSolBalance] = useState<number>(0);
  const [goldBalance, setGoldBalance] = useState<number>(0);
  const [txLink, setTxLink] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [sendAmount, setSendAmount] = useState<string>("0.1");
  const [swapAmount, setSwapAmount] = useState<string>("0.1");
  const [stakeAmount, setStakeAmount] = useState<string>("5");
  const [recipientAddress, setRecipientAddress] = useState<string>("");
  const [currentRpcIndex, setCurrentRpcIndex] = useState<number>(0);

  // Use wallet from props or hook
  const walletHook = useWallet();
  const wallet = propWallet || walletHook;

  // Create connection with fallback mechanism
  const createConnection = () => {
    return new Connection(RPC_ENDPOINTS[currentRpcIndex], "confirmed");
  };

  // Try next RPC endpoint if current one fails
  const tryNextRpc = () => {
    const nextIndex = (currentRpcIndex + 1) % RPC_ENDPOINTS.length;
    setCurrentRpcIndex(nextIndex);
    console.log(`Switching to RPC endpoint: ${RPC_ENDPOINTS[nextIndex]}`);
    return new Connection(RPC_ENDPOINTS[nextIndex], "confirmed");
  };

  // 🔹 Load balances with RPC fallback
  const loadBalances = async (retryCount = 0) => {
    if (!wallet?.publicKey) {
      console.log("No wallet connected");
      return;
    }

    const maxRetries = RPC_ENDPOINTS.length;
    let connection = createConnection();

    try {
      setLoading(true);
      setError(null);
      console.log(`Loading balances for: ${wallet.publicKey.toString()} using RPC: ${RPC_ENDPOINTS[currentRpcIndex]}`);

      // SOL Balance
      const sol = await connection.getBalance(wallet.publicKey);
      const solBalanceValue = sol / LAMPORTS_PER_SOL;
      setSolBalance(solBalanceValue);
      console.log("SOL Balance:", solBalanceValue);

      // GOLD Balance
      try {
        const ata = await getAssociatedTokenAddress(GOLD_MINT, wallet.publicKey);
        const account = await getAccount(connection, ata);
        const goldBalanceValue = Number(account.amount) / 1e9; // asumsi 9 desimal
        setGoldBalance(goldBalanceValue);
        console.log("GOLD Balance:", goldBalanceValue);
      } catch (goldError) {
        console.log("GOLD token account not found or error:", goldError);
        setGoldBalance(0);
      }
    } catch (err: any) {
      console.error(`Error loading balances (attempt ${retryCount + 1}):`, err);
      
      // If it's a 403 error or network error, try next RPC
      if ((err.message?.includes('403') || err.message?.includes('Access forbidden') || err.message?.includes('fetch')) && retryCount < maxRetries - 1) {
        console.log(`RPC failed, trying next endpoint...`);
        connection = tryNextRpc();
        return loadBalances(retryCount + 1);
      }
      
      setError(`Failed to load balances: ${err.message || 'Network error'}`);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Send SOL
  const sendSOL = async (to: string, amount: number) => {
    if (!wallet?.publicKey || !wallet?.sendTransaction) {
      setError("Wallet not connected or doesn't support transactions");
      return;
    }

    if (!to || to.trim() === "") {
      setError("Please enter a recipient address");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setTxLink(null);

      const connection = createConnection();
      const toPublicKey = new PublicKey(to);
      const tx = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: wallet.publicKey,
          toPubkey: toPublicKey,
          lamports: amount * LAMPORTS_PER_SOL,
        })
      );

      const signature = await wallet.sendTransaction(tx, connection);
      console.log("Send SOL transaction signature:", signature);
      setTxLink(`https://solscan.io/tx/${signature}`);
      
      // Refresh balances after transaction
      setTimeout(() => {
        loadBalances();
      }, 2000);
    } catch (err) {
      console.error("Error sending SOL:", err);
      setError(`Failed to send SOL: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Swap via Jupiter
  const { exchange } = useJupiter({
    connection,
    cluster: "mainnet-beta",
    userPublicKey: wallet?.publicKey,
  });

  const swapSOLtoGOLD = async (amount: number) => {
    if (!wallet?.publicKey) {
      setError("Wallet not connected");
      return;
    }

    if (!exchange) {
      setError("Jupiter exchange not available");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setTxLink(null);

      const res = await exchange({
        amount: amount * LAMPORTS_PER_SOL,
        inputMint: PublicKey.default, // SOL
        outputMint: GOLD_MINT,
        slippage: 1,
      });

      if (res?.txid) {
        console.log("Swap transaction signature:", res.txid);
        setTxLink(`https://solscan.io/tx/${res.txid}`);
        
        // Refresh balances after transaction
        setTimeout(() => {
          loadBalances();
        }, 2000);
      } else {
        setError("Swap failed - no transaction ID returned");
      }
    } catch (err) {
      console.error("Error swapping SOL to GOLD:", err);
      setError(`Failed to swap: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Stake (contoh sederhana)
  const stakeGOLD = async (amount: number) => {
    if (!wallet?.publicKey || !wallet?.sendTransaction) {
      setError("Wallet not connected or doesn't support transactions");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setTxLink(null);

      // Contoh implementasi staking sederhana
      // Dalam implementasi nyata, ini harus disesuaikan dengan program staking yang sebenarnya
      const tx = new Transaction().add({
        keys: [{ pubkey: wallet.publicKey, isSigner: true, isWritable: true }],
        programId: STAKING_CONTRACT,
        data: Buffer.from([1, ...new Uint8Array(new BigUint64Array([BigInt(amount * 1e9)]).buffer)]),
      });

      const signature = await wallet.sendTransaction(tx, connection);
      console.log("Stake transaction signature:", signature);
      setTxLink(`https://solscan.io/tx/${signature}`);
      
      // Refresh balances after transaction
      setTimeout(() => {
        loadBalances();
      }, 2000);
    } catch (err) {
      console.error("Error staking GOLD:", err);
      setError(`Failed to stake: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (wallet?.publicKey) {
      loadBalances();
    }
  }, [wallet?.publicKey]);

  if (!wallet?.publicKey) {
    return (
      <div className="p-4 bg-black text-white rounded-xl shadow-lg">
        <h2 className="text-xl font-bold mb-2">Solana Wallet Dashboard</h2>
        <p className="text-gray-400">Please connect your wallet to use Solana features</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gradient-to-br from-gray-900 to-black text-white rounded-xl shadow-2xl max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-center bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
        Solana DeFi Dashboard
      </h2>
      
      {/* Wallet Info */}
      <div className="mb-6 p-4 bg-gray-800 rounded-lg">
        <p className="text-sm text-gray-400 mb-2">Connected Wallet:</p>
        <p className="font-mono text-xs break-all">{wallet.publicKey.toString()}</p>
        <div className="mt-3 pt-3 border-t border-gray-700">
          <p className="text-sm text-gray-400 mb-1">RPC Endpoint:</p>
          <p className="font-mono text-xs text-green-400">{RPC_ENDPOINTS[currentRpcIndex]}</p>
        </div>
      </div>

      {/* Balances */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="p-4 bg-blue-900/30 rounded-lg border border-blue-500/20">
          <p className="text-blue-400 text-sm mb-1">SOL Balance</p>
          <p className="text-2xl font-bold">{loading ? "..." : solBalance.toFixed(6)} SOL</p>
        </div>
        <div className="p-4 bg-yellow-900/30 rounded-lg border border-yellow-500/20">
          <p className="text-yellow-400 text-sm mb-1">GOLD Balance</p>
          <p className="text-2xl font-bold">{loading ? "..." : goldBalance.toFixed(6)} GOLD</p>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mb-4 p-3 bg-red-900/30 border border-red-500/20 rounded-lg">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      {/* Actions */}
      <div className="space-y-4">
        {/* Send SOL */}
        <div className="p-4 bg-gray-800 rounded-lg">
          <h3 className="text-lg font-semibold mb-3 text-blue-400">Send SOL</h3>
          <div className="space-y-3">
            <input
              type="text"
              placeholder="Recipient address"
              value={recipientAddress}
              onChange={(e) => setRecipientAddress(e.target.value)}
              className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-400"
            />
            <div className="flex gap-2">
              <input
                type="number"
                step="0.001"
                value={sendAmount}
                onChange={(e) => setSendAmount(e.target.value)}
                className="flex-1 p-2 bg-gray-700 border border-gray-600 rounded text-white"
              />
              <button
                onClick={() => sendSOL(recipientAddress, parseFloat(sendAmount))}
                disabled={loading || !recipientAddress}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg transition-colors"
              >
                {loading ? "Sending..." : "Send SOL"}
              </button>
            </div>
          </div>
        </div>

        {/* Swap SOL to GOLD */}
        <div className="p-4 bg-gray-800 rounded-lg">
          <h3 className="text-lg font-semibold mb-3 text-green-400">Swap SOL → GOLD</h3>
          <div className="flex gap-2">
            <input
              type="number"
              step="0.001"
              value={swapAmount}
              onChange={(e) => setSwapAmount(e.target.value)}
              className="flex-1 p-2 bg-gray-700 border border-gray-600 rounded text-white"
            />
            <button
              onClick={() => swapSOLtoGOLD(parseFloat(swapAmount))}
              disabled={loading}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg transition-colors"
            >
              {loading ? "Swapping..." : "Swap to GOLD"}
            </button>
          </div>
        </div>

        {/* Stake GOLD */}
        <div className="p-4 bg-gray-800 rounded-lg">
          <h3 className="text-lg font-semibold mb-3 text-purple-400">Stake GOLD</h3>
          <div className="flex gap-2">
            <input
              type="number"
              step="0.001"
              value={stakeAmount}
              onChange={(e) => setStakeAmount(e.target.value)}
              className="flex-1 p-2 bg-gray-700 border border-gray-600 rounded text-white"
            />
            <button
              onClick={() => stakeGOLD(parseFloat(stakeAmount))}
              disabled={loading}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg transition-colors"
            >
              {loading ? "Staking..." : "Stake GOLD"}
            </button>
          </div>
        </div>

        {/* Refresh Button */}
        <button
          onClick={loadBalances}
          disabled={loading}
          className="w-full py-2 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:cursor-not-allowed rounded-lg transition-colors"
        >
          {loading ? "Loading..." : "Refresh Balances"}
        </button>
      </div>

      {/* Transaction Link */}
      {txLink && (
        <div className="mt-6 p-4 bg-green-900/30 border border-green-500/20 rounded-lg">
          <p className="text-green-400 mb-2">✅ Transaksi berhasil!</p>
          <a
            href={txLink}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:text-blue-300 underline break-all"
          >
            Lihat di Solscan
          </a>
        </div>
      )}
    </div>
  );
}