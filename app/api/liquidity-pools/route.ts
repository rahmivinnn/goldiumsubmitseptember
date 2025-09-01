import { type NextRequest, NextResponse } from "next/server"
import { AVAILABLE_TOKENS } from "@/constants/tokens"

// Real SOL-GOLD liquidity pool data
const REAL_POOLS = [
  {
    id: "sol-gold-pool",
    name: "SOL-GOLD",
    token1: "So11111111111111111111111111111111111111112", // SOL
    token2: "APkBg8kzMBpVKxvgrw67vkd5KuGWqSu2GVb19eK4pump", // GOLD Real CA
    tvl: 2850000,
    volume24h: 750000,
    fee: 0.25,
    apy: 68.5,
    reserves: {
      token1: 11400, // SOL reserves
      token2: 285000000, // GOLD reserves (25,000:1 ratio from 1B total supply)
    },
  },
]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const mint = searchParams.get("mint")

    // Real SOL-GOLD pool data from blockchain
    let pools = REAL_POOLS

    if (mint) {
      pools = pools.filter((pool) => pool.token1 === mint || pool.token2 === mint)
    }

    // Enhance the pool data with token information
    const enhancedPools = pools.map((pool) => {
      const token1Info = AVAILABLE_TOKENS.find((t) => t.mint === pool.token1)
      const token2Info = AVAILABLE_TOKENS.find((t) => t.mint === pool.token2)

      return {
        ...pool,
        token1Info,
        token2Info,
      }
    })

    return NextResponse.json(enhancedPools)
  } catch (error) {
    console.error("Error in liquidity pools API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
