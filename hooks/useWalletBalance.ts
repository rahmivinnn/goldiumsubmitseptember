import { useCallback, useEffect, useState } from "react"
import { useConnection, useWallet as useSolanaWallet } from "@solana/wallet-adapter-react"

export const useWalletBalance = () => {
  const { connection } = useConnection()
  const { publicKey, connected } = useSolanaWallet()
  const [balances, setBalances] = useState<{ [key: string]: number }>({})
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchBalances = useCallback(async () => {
    if (!publicKey || !connected) return

    setIsLoading(true)
    setError(null)

    try {
      const solBalance = (await connection.getBalance(publicKey)) / 10 ** 9
      setBalances((prev) => ({ ...prev, SOL: solBalance }))

      setIsLoading(false)
    } catch (error: any) {
      console.error("Failed to fetch balances", error)
      setError(error.message || "Failed to fetch balances")
      setIsLoading(false)
    }
  }, [connection, publicKey, connected])

  useEffect(() => {
    if (publicKey && connected) {
      fetchBalances()
    }
  }, [publicKey, connected, fetchBalances])

  return {
    balances,
    isLoading,
    error,
    refreshBalances: fetchBalances,
    solBalance: balances.SOL || 0,
    goldBalance: balances.GOLD || 0,
    deductBalance: (token: string, amount: number) => {
      setBalances(prev => ({
        ...prev,
        [token]: Math.max(0, (prev[token] || 0) - amount)
      }))
    }
  }
}
