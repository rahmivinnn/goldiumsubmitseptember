"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useWallet } from "@solana/wallet-adapter-react"
import { X, AlertCircle, ExternalLink, ChevronRight, Wallet } from "lucide-react"
import { Button } from "@/components/ui/button"
import { detectBrowser, isBrowserSupported } from "@/utils/browser-detection"
import { isWalletInstalled, getRecommendedWallet, getWalletInstallUrl } from "@/utils/wallet-detection"
import { useToast } from "@/components/ui/use-toast"

interface ConnectWalletModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function ConnectWalletModal({ isOpen, onClose }: ConnectWalletModalProps) {
  const { select, connect, connecting, connected, wallets } = useWallet()
  const [selectedWallet, setSelectedWallet] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const browserInfo = detectBrowser()
  const { toast } = useToast()

  // Reset state when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      setSelectedWallet(null)
      setError(null)
    }
  }, [isOpen])

  // Close modal when wallet connects
  useEffect(() => {
    if (connected && isOpen) {
      onClose()
      toast({
        title: "Wallet Connected",
        description: "Your wallet has been connected successfully.",
      })
    }
  }, [connected, isOpen, onClose, toast])

  // Handle wallet selection
  const handleSelectWallet = async (walletName: string) => {
    try {
      setSelectedWallet(walletName)
      setError(null)

      // Find the wallet adapter
      const walletAdapter = wallets.find(w => 
        w.adapter.name.toLowerCase().includes(walletName.toLowerCase())
      )

      if (!walletAdapter) {
        throw new Error(`${walletName} wallet not found`)
      }

      // Check if wallet is installed
      if (walletAdapter.adapter.readyState !== 'Installed') {
        throw new Error(`${walletName} wallet is not installed. Please install it first.`)
      }

      // Select and connect
      select(walletAdapter.adapter.name)
      
      // Wait a bit for selection to complete
      await new Promise(resolve => setTimeout(resolve, 100))
      
      await connect()
    } catch (err: any) {
      console.error("Wallet connection error:", err)
      setError(err.message || "Failed to connect wallet")
      setSelectedWallet(null)
      
      toast({
        title: "Connection Failed",
        description: err.message || "Failed to connect wallet. Please try again.",
        variant: "destructive",
      })
    }
  }

  // Handle retry
  const handleRetry = async () => {
    if (selectedWallet) {
      await handleSelectWallet(selectedWallet)
    }
  }



  // Wallet options based on available adapters
  const walletOptions = wallets.map(wallet => ({
    name: wallet.adapter.name,
    icon: wallet.adapter.icon,
    isAvailable: wallet.adapter.readyState === 'Installed',
    isRecommended: wallet.adapter.name.toLowerCase().includes(getRecommendedWallet()?.toLowerCase() || 'phantom'),
    adapter: wallet.adapter
  }))

  if (!isOpen) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/70">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="relative w-full max-w-md bg-gradient-to-br from-gray-900/95 to-black/95 border border-yellow-500/30 rounded-2xl shadow-2xl shadow-yellow-500/20 overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gold/20">
              <h2 className="text-xl font-bold text-white">Connect Wallet</h2>
              <button
                onClick={onClose}
                className="p-1 rounded-full hover:bg-white/10 transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            {/* Content */}
            <div className="p-4">
              {/* Browser compatibility warning */}
              {!isBrowserSupported() && (
                <div className="mb-4 p-3 bg-amber-500/20 border border-amber-500/30 rounded-lg text-amber-400 text-sm">
                  <div className="flex items-start">
                    <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium">Browser Compatibility Warning</p>
                      <p className="mt-1">
                        Your browser may have limited compatibility with some wallets. For the best experience, we
                        recommend using Chrome, Firefox, or Brave.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Error message */}
              {error && (
                <div className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-red-400 text-sm">
                  <div className="flex items-start">
                    <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium">Connection Error</p>
                      <p className="mt-1">{error}</p>
                      {error.includes("not installed") && selectedWallet && (
                        <a
                          href={getWalletInstallUrl(selectedWallet)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-2 flex items-center text-gold hover:underline"
                        >
                          <span>Install {selectedWallet}</span>
                          <ExternalLink className="w-4 h-4 ml-1" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Wallet options */}
              <div className="space-y-2">
                {walletOptions.map((wallet) => (
                  <button
                    key={wallet.name}
                    onClick={() => handleSelectWallet(wallet.name)}
                    disabled={connecting}
                    className={`w-full flex items-center justify-between p-3 rounded-lg border transition-colors ${
                      wallet.isAvailable ? "border-gold/30 hover:bg-gold/10" : "border-gray-700 text-gray-500"
                    }`}
                  >
                    <div className="flex items-center">
                      <div className="w-8 h-8 mr-3 rounded-full bg-black/50 flex items-center justify-center overflow-hidden">
                        {wallet.icon ? (
                          <img src={wallet.icon} alt={wallet.name} className="w-6 h-6" />
                        ) : (
                          <Wallet className="w-4 h-4" />
                        )}
                      </div>
                      <div className="text-left">
                        <div className="font-medium">
                          {wallet.name}
                          {wallet.isRecommended && <span className="ml-2 text-xs text-gold">Recommended</span>}
                        </div>
                        {!wallet.isAvailable && <div className="text-xs text-gray-500">Not installed</div>}
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-500" />
                  </button>
                ))}
              </div>

              {/* Retry button */}
              {error && (
                <Button
                  onClick={handleRetry}
                  disabled={connecting}
                  className="mt-4 w-full bg-gold hover:bg-gold/90 text-black"
                >
                  {connecting ? "Connecting..." : "Retry Connection"}
                </Button>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-gold/20 text-xs text-gray-500 text-center">
              By connecting your wallet, you agree to our Terms of Service and Privacy Policy.
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
