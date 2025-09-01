'use client'

import { useWallet } from '@solana/wallet-adapter-react'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { useWalletBalance } from '@/components/providers/WalletContextProvider'
import { getSolBalance, getTokenBalance } from '@/services/tokenService'
import { useNetwork } from '@/components/providers/NetworkContextProvider'
import { GOLD_MINT_ADDRESS } from '@/services/tokenService'

// Create a client-only wallet button to prevent hydration issues
const ClientWalletButton = dynamic(
  () => Promise.resolve(({ className, children }: { className: string; children?: React.ReactNode }) => (
    <WalletMultiButton className={className}>
      {children}
    </WalletMultiButton>
  )),
  { ssr: false }
)

export function ConnectWalletButton() {
  const { connected, publicKey } = useWallet()
  const { connection, network, isConnectionHealthy } = useNetwork()
  const [solBalance, setSolBalance] = useState<number>(0)
  const [goldBalance, setGoldBalance] = useState<number>(0)
  const [isLoadingBalances, setIsLoadingBalances] = useState(false)
  const [balanceError, setBalanceError] = useState<string | null>(null)
  const [lastFetchTime, setLastFetchTime] = useState<Date | null>(null)

  // Fetch real wallet balances
  const fetchBalances = async () => {
    if (!publicKey || !connected) {
      console.log('[fetchBalances] Wallet not connected, clearing balances')
      setSolBalance(0)
      setGoldBalance(0)
      setLastFetchTime(null)
      return
    }
    
    if (!connection) {
      console.error('[fetchBalances] No connection available')
      setBalanceError('No connection available')
      return
    }
    
    console.log(`[fetchBalances] Starting balance fetch for wallet: ${publicKey.toString()}`)
    console.log(`[fetchBalances] Network: ${network}, Connection healthy: ${isConnectionHealthy}`)
    console.log(`[fetchBalances] Connection endpoint: ${connection.rpcEndpoint}`)
    
    setIsLoadingBalances(true)
    setBalanceError(null)
    
    let hasAnySuccess = false
    
    try {
      // Get SOL balance with retry logic
      let solBal = 0
      try {
        console.log('[fetchBalances] Fetching SOL balance...')
        solBal = await getSolBalance(connection, publicKey)
        setSolBalance(solBal)
        hasAnySuccess = true
        console.log(`[fetchBalances] SOL balance SUCCESS: ${solBal}`)
      } catch (solError) {
        console.error('[fetchBalances] Error fetching SOL balance:', solError)
        setSolBalance(0)
        setBalanceError(`SOL fetch failed: ${solError.message}`)
      }
      
      // Get GOLD balance with fallback for different networks
      let goldBal = 0
      try {
        const goldMintAddress = GOLD_MINT_ADDRESS[network] || GOLD_MINT_ADDRESS['mainnet-beta']
        console.log(`[fetchBalances] Fetching GOLD balance for mint: ${goldMintAddress}`)
        goldBal = await getTokenBalance(connection, publicKey, goldMintAddress)
        setGoldBalance(goldBal)
        hasAnySuccess = true
        console.log(`[fetchBalances] GOLD balance SUCCESS: ${goldBal}`)
      } catch (goldError) {
        console.warn('[fetchBalances] Error fetching GOLD balance:', goldError)
        // Try with mainnet address as fallback
        try {
          console.log('[fetchBalances] Trying GOLD balance with mainnet fallback...')
          goldBal = await getTokenBalance(connection, publicKey, GOLD_MINT_ADDRESS['mainnet-beta'])
          setGoldBalance(goldBal)
          hasAnySuccess = true
          console.log(`[fetchBalances] GOLD balance (fallback) SUCCESS: ${goldBal}`)
        } catch (fallbackError) {
          console.warn('[fetchBalances] Error fetching GOLD balance with fallback:', fallbackError)
          setGoldBalance(0)
        }
      }
      
      if (hasAnySuccess) {
        setLastFetchTime(new Date())
        console.log('[fetchBalances] Balance fetch completed successfully')
        // Clear error if we had any success
        if (balanceError && (solBal > 0 || goldBal > 0)) {
          setBalanceError(null)
        }
      } else {
        console.error('[fetchBalances] No balances could be fetched')
        if (!balanceError) {
          setBalanceError('Unable to fetch any balances')
        }
      }
      
    } catch (error) {
      console.error('[fetchBalances] Unexpected error during balance fetch:', error)
      setBalanceError(`Fetch error: ${error.message}`)
      setSolBalance(0)
      setGoldBalance(0)
    } finally {
      setIsLoadingBalances(false)
      console.log('[fetchBalances] Balance fetch process completed')
    }
  }

  useEffect(() => {
    if (connected && publicKey) {
      fetchBalances()
      // Refresh balances every 30 seconds when connected
      const interval = setInterval(fetchBalances, 30000)
      return () => clearInterval(interval)
    } else {
      setSolBalance(0)
      setGoldBalance(0)
      setBalanceError(null)
    }
  }, [connected, publicKey, network])

  return (
    <div className="flex items-center relative">
      <ClientWalletButton className="!bg-gradient-to-r !from-yellow-400 !via-yellow-500 !to-amber-600 !text-black !font-bold !px-8 !py-3 !rounded-xl !shadow-xl !shadow-yellow-500/20 hover:!from-yellow-300 hover:!via-yellow-400 hover:!to-amber-500 hover:!shadow-yellow-400/30 !transition-all !duration-100 !transform hover:!scale-102 !border-2 !border-yellow-300/50 hover:!border-yellow-200 !z-50">
        {connected && publicKey && (
          <div className="flex flex-col items-start ml-2">
            <div className="text-xs opacity-80">
              SOL: {isLoadingBalances ? '...' : balanceError ? 'Error' : solBalance.toFixed(4)}
            </div>
            <div className="text-xs opacity-80">
              GOLD: {isLoadingBalances ? '...' : balanceError ? 'Error' : goldBalance.toFixed(2)}
            </div>
            <div className="text-xs opacity-60 flex items-center gap-1">
              <div className={`w-2 h-2 rounded-full ${isConnectionHealthy ? 'bg-green-400' : 'bg-red-400'}`}></div>
              {network}
            </div>
            {balanceError && (
              <div className="text-xs text-red-400 opacity-60">
                {balanceError}
              </div>
            )}
            {lastFetchTime && (
              <div className="text-xs opacity-40">
                Last: {lastFetchTime.toLocaleTimeString()}
              </div>
            )}
          </div>
        )}
      </ClientWalletButton>
    </div>
  )
}

export default ConnectWalletButton