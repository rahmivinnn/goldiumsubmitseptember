"use client"

import { useState, useEffect } from "react"
import { Connection } from "@solana/web3.js"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"
import { CheckCircle, XCircle, AlertCircle, Loader2, ExternalLink } from "lucide-react"
import { validateTokenMint, checkTokenActivity } from "@/services/tokenService"
import { AVAILABLE_TOKENS, GOLD_MINT_ADDRESS } from "@/constants/tokens"
import { useNetwork } from "@/components/providers/NetworkContextProvider"

interface TokenValidationResult {
  address: string
  symbol: string
  name: string
  isValid: boolean
  hasActivity: boolean
  decimals?: number
  supply?: string
  holders?: number
  error?: string
  isLoading: boolean
}

export default function TokenValidator() {
  const { network } = useNetwork()
  const { toast } = useToast()
  const [validationResults, setValidationResults] = useState<TokenValidationResult[]>([])
  const [isValidating, setIsValidating] = useState(false)
  const [connection, setConnection] = useState<Connection | null>(null)

  useEffect(() => {
    // Initialize connection based on network
    const rpcUrl = network === "mainnet-beta" 
      ? "https://api.mainnet-beta.solana.com"
      : network === "devnet"
      ? "https://api.devnet.solana.com"
      : "https://api.testnet.solana.com"
    
    setConnection(new Connection(rpcUrl, "confirmed"))
  }, [network])

  useEffect(() => {
    // Initialize validation results
    const initialResults: TokenValidationResult[] = AVAILABLE_TOKENS.map(token => ({
      address: token?.mint || '',
      symbol: token?.symbol || 'Unknown',
      name: token?.name || 'Unknown Token',
      isValid: false,
      hasActivity: false,
      isLoading: false
    }))

    // Add GOLD token for current network if different
    const goldMintForNetwork = GOLD_MINT_ADDRESS[network as keyof typeof GOLD_MINT_ADDRESS]
    if (goldMintForNetwork && !initialResults.find(r => r.address === goldMintForNetwork)) {
      initialResults.push({
        address: goldMintForNetwork,
        symbol: "GOLD",
        name: `Goldium (${network})`,
        isValid: false,
        hasActivity: false,
        isLoading: false
      })
    }

    // Remove duplicates based on address
    const uniqueResults = initialResults.filter((token, index, self) => 
      index === self.findIndex(t => t.address === token.address)
    )

    setValidationResults(uniqueResults)
  }, [network])

  const validateAllTokens = async () => {
    if (!connection) {
      toast({
        title: "Connection Error",
        description: "No connection to Solana network",
        variant: "destructive"
      })
      return
    }

    setIsValidating(true)
    
    // Set all tokens to loading state
    setValidationResults(prev => prev.map(result => ({ ...result, isLoading: true })))

    const updatedResults: TokenValidationResult[] = []

    for (const result of validationResults) {
      try {
        // Validate token mint
        const validation = await validateTokenMint(connection, result.address)
        
        // Check token activity
        const activity = await checkTokenActivity(connection, result.address)

        updatedResults.push({
          ...result,
          isValid: validation.isValid,
          hasActivity: activity.hasActivity,
          decimals: validation.mintInfo?.decimals,
          supply: validation.mintInfo?.supply,
          holders: activity.holders,
          error: validation.error || activity.error,
          isLoading: false
        })
      } catch (error) {
        updatedResults.push({
          ...result,
          isValid: false,
          hasActivity: false,
          error: error instanceof Error ? error.message : "Unknown error",
          isLoading: false
        })
      }
    }

    setValidationResults(updatedResults)
    setIsValidating(false)

    // Show summary toast
    const validTokens = updatedResults.filter(r => r.isValid).length
    const totalTokens = updatedResults.length
    
    toast({
      title: "Validation Complete",
      description: `${validTokens}/${totalTokens} tokens are valid and detectable`,
      variant: validTokens === totalTokens ? "default" : "destructive"
    })
  }

  const getStatusIcon = (result: TokenValidationResult) => {
    if (result.isLoading) {
      return <Loader2 className="h-4 w-4 animate-spin" />
    }
    if (result.isValid && result.hasActivity) {
      return <CheckCircle className="h-4 w-4 text-green-500" />
    }
    if (result.isValid && !result.hasActivity) {
      return <AlertCircle className="h-4 w-4 text-yellow-500" />
    }
    return <XCircle className="h-4 w-4 text-red-500" />
  }

  const getStatusBadge = (result: TokenValidationResult) => {
    if (result.isLoading) {
      return <Badge variant="secondary">Validating...</Badge>
    }
    if (result.isValid && result.hasActivity) {
      return <Badge variant="default" className="bg-green-500">Valid & Active</Badge>
    }
    if (result.isValid && !result.hasActivity) {
      return <Badge variant="secondary" className="bg-yellow-500">Valid (No Activity)</Badge>
    }
    return <Badge variant="destructive">Invalid</Badge>
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CheckCircle className="h-5 w-5" />
          Token Contract Address Validator
        </CardTitle>
        <CardDescription>
          Verify that all configured token contract addresses are valid and detectable on {network}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center">
          <div className="text-sm text-muted-foreground">
            Network: <Badge variant="outline">{network}</Badge>
          </div>
          <Button 
            onClick={validateAllTokens} 
            disabled={isValidating || !connection}
            className="gap-2"
          >
            {isValidating ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Validating...
              </>
            ) : (
              <>
                <CheckCircle className="h-4 w-4" />
                Validate All Tokens
              </>
            )}
          </Button>
        </div>

        <div className="grid gap-4">
          {validationResults.map((result) => (
            <Card key={result.address} className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {getStatusIcon(result)}
                  <div>
                    <div className="font-medium">{result.name} ({result.symbol})</div>
                    <div className="text-sm text-muted-foreground font-mono">
                      {result.address}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusBadge(result)}
                  <Button
                    variant="ghost"
                    size="sm"
                    asChild
                    className="h-8 w-8 p-0"
                  >
                    <a
                      href={`https://solscan.io/token/${result.address}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="View on Solscan"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </Button>
                </div>
              </div>
              
              {result.isValid && (
                <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                  {result.decimals !== undefined && (
                    <div>
                      <span className="text-muted-foreground">Decimals:</span>
                      <span className="ml-1 font-mono">{result.decimals}</span>
                    </div>
                  )}
                  {result.supply && (
                    <div>
                      <span className="text-muted-foreground">Supply:</span>
                      <span className="ml-1 font-mono">{Number(result.supply).toLocaleString()}</span>
                    </div>
                  )}
                  {result.holders !== undefined && (
                    <div>
                      <span className="text-muted-foreground">Holders:</span>
                      <span className="ml-1 font-mono">{result.holders}</span>
                    </div>
                  )}
                  <div>
                    <span className="text-muted-foreground">Activity:</span>
                    <span className={`ml-1 ${result.hasActivity ? 'text-green-500' : 'text-yellow-500'}`}>
                      {result.hasActivity ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
              )}
              
              {result.error && (
                <div className="mt-2 p-2 bg-red-50 dark:bg-red-900/20 rounded text-sm text-red-600 dark:text-red-400">
                  Error: {result.error}
                </div>
              )}
            </Card>
          ))}
        </div>

        <div className="text-xs text-muted-foreground">
          <p>• <strong>Valid & Active:</strong> Token contract exists and has transaction activity</p>
          <p>• <strong>Valid (No Activity):</strong> Token contract exists but no recent activity detected</p>
          <p>• <strong>Invalid:</strong> Token contract address is not valid or not found</p>
        </div>
      </CardContent>
    </Card>
  )
}