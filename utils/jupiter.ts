import { type Connection, type PublicKey, Transaction, VersionedTransaction } from "@solana/web3.js"
import type { Token } from "@/constants/tokens"

// Jupiter API endpoints
const JUPITER_QUOTE_API = "https://quote-api.jup.ag/v6/quote"
const JUPITER_SWAP_API = "https://quote-api.jup.ag/v6/swap"

// Quote parameters
interface QuoteParams {
  inputMint: string
  outputMint: string
  amount: string
  slippageBps: number
  onlyDirectRoutes?: boolean
  asLegacyTransaction?: boolean
}

// Swap parameters
interface SwapParams {
  connection: Connection
  wallet: {
    publicKey: PublicKey
    signTransaction?: (tx: Transaction | VersionedTransaction) => Promise<Transaction | VersionedTransaction>
  }
  fromToken: Token
  toToken: Token
  quote: any
  slippageBps: number
}

// Get quote from Jupiter API
export async function getQuote(params: QuoteParams) {
  try {
    // Construct the URL with query parameters
    const url = new URL(JUPITER_QUOTE_API)
    url.searchParams.append("inputMint", params.inputMint)
    url.searchParams.append("outputMint", params.outputMint)
    url.searchParams.append("amount", params.amount)
    url.searchParams.append("slippageBps", params.slippageBps.toString())

    if (params.onlyDirectRoutes) {
      url.searchParams.append("onlyDirectRoutes", "true")
    }

    if (params.asLegacyTransaction) {
      url.searchParams.append("asLegacyTransaction", "true")
    }

    // Fetch quote from Jupiter API
    const response = await fetch(url.toString())

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(`Jupiter API error: ${JSON.stringify(errorData)}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error("Error fetching quote:", error)
    throw error
  }
}

// Execute swap transaction
export async function executeSwap(
  params: SwapParams,
): Promise<{ success: boolean; txId?: string; signature?: string; error?: string }> {
  try {
    const { connection, wallet, quote, slippageBps } = params

    if (!wallet.publicKey) {
      throw new Error("Wallet not connected")
    }

    // Prepare the swap transaction
    const swapRequestBody = {
      quoteResponse: quote,
      userPublicKey: wallet.publicKey.toString(),
      wrapAndUnwrapSol: true,
      feeAccount: null,
      computeUnitPriceMicroLamports: 50, // Adjust priority fee as needed
      asLegacyTransaction: true, // Use legacy transaction for better compatibility
      dynamicComputeUnitLimit: true, // Automatically adjust compute unit limit
      skipUserAccountsCheck: true, // Skip checking if user has all required token accounts
    }

    // Get the swap transaction
    const swapResponse = await fetch(JUPITER_SWAP_API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(swapRequestBody),
    })

    if (!swapResponse.ok) {
      const errorData = await swapResponse.json()
      throw new Error(`Jupiter Swap API error: ${JSON.stringify(errorData)}`)
    }

    const swapData = await swapResponse.json()

    // Sign and send the transaction
    let signedTx
    let signature

    if (swapData.swapTransaction) {
      // Decode and sign the transaction
      const serializedTransaction = Buffer.from(swapData.swapTransaction, "base64")

      try {
        // Try to decode as versioned transaction first
        const tx = VersionedTransaction.deserialize(serializedTransaction)

        // Sign the transaction
        if (wallet.signTransaction) {
          signedTx = await wallet.signTransaction(tx)
          signature = await connection.sendRawTransaction(signedTx.serialize())
        } else {
          throw new Error("Wallet does not support signing transactions")
        }
      } catch (e) {
        // If not a versioned transaction, try legacy transaction
        const tx = Transaction.from(serializedTransaction)

        // Sign the transaction
        if (wallet.signTransaction) {
          signedTx = await wallet.signTransaction(tx)
          signature = await connection.sendRawTransaction(signedTx.serialize())
        } else {
          throw new Error("Wallet does not support signing transactions")
        }
      }

      // Wait for confirmation
      const confirmation = await connection.confirmTransaction(signature, "confirmed")

      if (confirmation.value.err) {
        throw new Error(`Transaction failed: ${confirmation.value.err.toString()}`)
      }

      return {
        success: true,
        txId: signature,
        signature,
      }
    } else {
      throw new Error("No swap transaction returned from Jupiter API")
    }
  } catch (error: any) {
    console.error("Error executing swap:", error)
    return {
      success: false,
      error: error.message || "Failed to execute swap",
    }
  }
}

// Get liquidity pools
export async function getLiquidityPools(mintAddress?: string) {
  // Mock liquidity pools data - Only SOL-GOLD pool
  const pools = [
    {
      id: "pool1",
      name: "GOLD-SOL",
      token1: {
        mint: "APkBg8kzMBpVKxvgrw67vkd5KuGWqSu2GVb19eK4pump",
        symbol: "GOLD",
        logoURI: "/tokens/gold.png",
      },
      token2: {
        mint: "So11111111111111111111111111111111111111112",
        symbol: "SOL",
        logoURI: "/solana-logo.png",
      },
      tvl: 1250000,
      volume24h: 320000,
      apr: 42.5,
    },
  ]
  
  return pools
}
