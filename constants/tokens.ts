export interface Token {
  name: string
  symbol: string
  mint: string
  decimals: number
  logoURI: string
  totalSupply?: number
}

// Token addresses for different networks
// Using real Solana token mint addresses
export const GOLD_MINT_ADDRESS = {
  "mainnet-beta": "APkBg8kzMBpVKxvgrw67vkd5KuGWqSu2GVb19eK4pump", // GOLD token on mainnet
  devnet: "APkBg8kzMBpVKxvgrw67vkd5KuGWqSu2GVb19eK4pump", // GOLD token on devnet
  testnet: "APkBg8kzMBpVKxvgrw67vkd5KuGWqSu2GVb19eK4pump", // GOLD token on testnet
}

// Solana token
export const SOL_TOKEN: Token = {
  name: "Solana",
  symbol: "SOL",
  mint: "So11111111111111111111111111111111111111112",
  decimals: 9,
  logoURI: "/solana-logo.png",
}

// GOLDIUM token with real Contract Address
export const GOLD_TOKEN: Token = {
  name: "Goldium",
  symbol: "GOLD",
  mint: "APkBg8kzMBpVKxvgrw67vkd5KuGWqSu2GVb19eK4pump", // Real GOLDIUM CA
  decimals: 9,
  logoURI: "/tokens/gold.png",
  totalSupply: 1000000000 // 1B GOLD total distribution
}

// Function to get the correct token for the current network
export function getGoldTokenForNetwork(network: string): Token {
  return GOLD_TOKEN
}

// Only SOL and GOLD tokens are available for swap
export const AVAILABLE_TOKENS: Token[] = [SOL_TOKEN, GOLD_TOKEN]

// Staking program ID
export const STAKING_PROGRAM_ID = "GStKMnqHM6uJiVKGiznWSJQNuDtcMiNMM2WgaTJgr5P9"

// Faucet program ID
export const FAUCET_PROGRAM_ID = "FaucGo1dTkH8CjDXSFpZ7kVToKDnNXpKNYPfMJjJwHjR"

// Liquidity pool IDs
export const LIQUIDITY_POOLS = {
  GOLD_SOL: "GS1dsoPnAEuBnuXvzjVrAyJRxJhiR9Jbs3VaX7JJKnY",
}
