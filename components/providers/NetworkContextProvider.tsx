"use client"

import type React from "react"

import { createContext, useContext, useState, useCallback, useMemo, useEffect } from "react"
import { Connection } from "@solana/web3.js"

// Define the network types
export type NetworkType = "mainnet-beta" | "testnet" | "devnet"

// Define the context type
interface NetworkContextType {
  network: NetworkType
  setNetwork: (network: NetworkType) => Promise<void>
  connection: Connection
  isConnectionHealthy: boolean
}

// Create the context
const NetworkContext = createContext<NetworkContextType | undefined>(undefined)

// Custom hook to use the network context
export function useNetwork() {
  const context = useContext(NetworkContext)
  if (!context) {
    throw new Error("useNetwork must be used within a NetworkContextProvider")
  }
  return context
}

// Provider props
interface NetworkContextProviderProps {
  children: React.ReactNode
  defaultNetwork?: NetworkType
}

// Provider component
export function NetworkContextProvider({ children, defaultNetwork = "mainnet-beta" }: NetworkContextProviderProps) {
  const [network, setNetworkState] = useState<NetworkType>(defaultNetwork)
  const [isConnectionHealthy, setIsConnectionHealthy] = useState(true)
  const [connection, setConnection] = useState<Connection | null>(null)

  // Get the RPC URL for the current network
  const getRpcUrl = useCallback((network: NetworkType): string => {
    const rpcUrls = {
      'mainnet-beta': process.env.NEXT_PUBLIC_SOLANA_RPC_URL || 'https://api.mainnet-beta.solana.com',
      'testnet': 'https://api.testnet.solana.com',
      'devnet': 'https://api.devnet.solana.com'
    }
    return rpcUrls[network]
  }, [])

  // Fallback RPC URLs for better reliability
  const getFallbackRpcUrls = useCallback((network: NetworkType): string[] => {
    const fallbackUrls = {
      'mainnet-beta': [
        'https://api.mainnet-beta.solana.com',
        'https://rpc.ankr.com/solana',
        'https://solana-api.projectserum.com',
        'https://mainnet.helius-rpc.com/?api-key=demo'
      ],
      'testnet': [
        'https://api.testnet.solana.com'
      ],
      'devnet': [
        'https://api.devnet.solana.com'
      ]
    }
    return fallbackUrls[network]
  }, [])

  // Create default connection
  const createDefaultConnection = useCallback((targetNetwork: NetworkType) => {
    const rpcUrl = getRpcUrl(targetNetwork)
    return new Connection(rpcUrl, {
      commitment: 'confirmed',
      confirmTransactionInitialTimeout: 60000,
      disableRetryOnRateLimit: false
    })
  }, [getRpcUrl])

  // Create healthy connection with fallback support
  const createHealthyConnection = useCallback(async (targetNetwork: NetworkType) => {
    console.log(`[createHealthyConnection] Creating connection for ${targetNetwork}`)
    const rpcUrl = getRpcUrl(targetNetwork)
    const fallbackUrls = getFallbackRpcUrls(targetNetwork)
    
    // Try primary RPC first
    try {
      console.log(`[createHealthyConnection] Testing primary RPC: ${rpcUrl}`)
      const testConnection = new Connection(rpcUrl, {
        commitment: 'confirmed',
        confirmTransactionInitialTimeout: 60000,
        disableRetryOnRateLimit: false
      })
      
      // Test connection health
      await Promise.race([
        testConnection.getLatestBlockhash(),
        new Promise((_, reject) => setTimeout(() => reject(new Error('Connection timeout')), 5000))
      ])
      
      setConnection(testConnection)
      setIsConnectionHealthy(true)
      console.log(`[createHealthyConnection] SUCCESS: Connected to ${targetNetwork} via ${rpcUrl}`)
      return
    } catch (error) {
      console.warn(`[createHealthyConnection] Primary RPC failed for ${targetNetwork}:`, error)
    }
    
    // Try fallback URLs
    for (const fallbackUrl of fallbackUrls) {
      try {
        console.log(`[createHealthyConnection] Testing fallback RPC: ${fallbackUrl}`)
        const testConnection = new Connection(fallbackUrl, {
          commitment: 'confirmed',
          confirmTransactionInitialTimeout: 60000,
          disableRetryOnRateLimit: false
        })
        
        await Promise.race([
          testConnection.getLatestBlockhash(),
          new Promise((_, reject) => setTimeout(() => reject(new Error('Connection timeout')), 5000))
        ])
        
        setConnection(testConnection)
        setIsConnectionHealthy(true)
        console.log(`[createHealthyConnection] SUCCESS: Connected to ${targetNetwork} via fallback ${fallbackUrl}`)
        return
      } catch (error) {
        console.warn(`[createHealthyConnection] Fallback RPC failed for ${targetNetwork} (${fallbackUrl}):`, error)
      }
    }
    
    // If all fail, use default connection but mark as unhealthy
    console.error(`[createHealthyConnection] All RPC endpoints failed for ${targetNetwork}, using default connection with degraded performance`)
    const defaultConnection = createDefaultConnection(targetNetwork)
    setConnection(defaultConnection)
    setIsConnectionHealthy(false)
  }, [getRpcUrl, getFallbackRpcUrls, createDefaultConnection])

  // Set the network and update the connection
  const setNetwork = useCallback(async (newNetwork: NetworkType) => {
    console.log(`[setNetwork] Switching to network: ${newNetwork}`)
    setNetworkState(newNetwork)
    await createHealthyConnection(newNetwork)
  }, [createHealthyConnection])

  // Initialize connection on mount and when network changes
  useEffect(() => {
    console.log(`[useEffect] Initializing connection for network: ${network}`)
    createHealthyConnection(network)
  }, [network, createHealthyConnection])
  
  // Periodically check connection health
  useEffect(() => {
    if (!connection) return
    
    const healthCheck = async () => {
      try {
        await Promise.race([
          connection.getLatestBlockhash(),
          new Promise((_, reject) => setTimeout(() => reject(new Error('Health check timeout')), 3000))
        ])
        if (!isConnectionHealthy) {
          setIsConnectionHealthy(true)
          console.log('[healthCheck] Connection health restored')
        }
      } catch (error) {
        if (isConnectionHealthy) {
          setIsConnectionHealthy(false)
          console.warn('[healthCheck] Connection health degraded:', error)
          // Try to reconnect
          createHealthyConnection(network)
        }
      }
    }
    
    const interval = setInterval(healthCheck, 30000) // Check every 30 seconds
    return () => clearInterval(interval)
  }, [connection, isConnectionHealthy, network, createHealthyConnection])

  // Context value - only provide if connection exists
  const value = useMemo(() => {
    if (!connection) {
      // Return a default connection while we're initializing
      const defaultConn = createDefaultConnection(network)
      return {
        network,
        setNetwork,
        connection: defaultConn,
        isConnectionHealthy: false,
      }
    }
    
    return {
      network,
      setNetwork,
      connection,
      isConnectionHealthy,
    }
  }, [network, setNetwork, connection, isConnectionHealthy, createDefaultConnection])

  return <NetworkContext.Provider value={value}>{children}</NetworkContext.Provider>
}
