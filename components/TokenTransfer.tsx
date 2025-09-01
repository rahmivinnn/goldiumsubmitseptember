"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useWallet, useConnection } from "@solana/wallet-adapter-react"
import { PublicKey } from "@solana/web3.js"
import { useToast } from "@/components/ui/use-toast"
import { AVAILABLE_TOKENS } from "@/constants/tokens"
import { useWalletBalance } from "@/hooks/useWalletBalance"
import { useTheme } from "@/components/providers/WalletContextProvider"
import { transferTokens } from "@/services/tokenService"
import { motion, AnimatePresence } from "framer-motion"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { 
  Send, 
  Loader2, 
  CheckCircle, 
  AlertTriangle, 
  QrCode, 
  BookOpen, 
  Copy, 
  ExternalLink,
  Clock,
  Zap,
  Shield,
  TrendingUp
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"

interface SavedAddress {
  name: string
  address: string
  lastUsed?: number
}

export default function TokenTransfer() {
  const { connected, publicKey, signTransaction } = useWallet()
  const { connection } = useConnection()
  const { toast } = useToast()
  const { theme } = useTheme()
  const { balances, refreshBalances, deductBalance } = useWalletBalance()
  const isDarkTheme = theme === "dark"

  const [selectedToken, setSelectedToken] = useState('SOL')
  const [recipientAddress, setRecipientAddress] = useState("")
  const [amount, setAmount] = useState("")
  const [isTransferring, setIsTransferring] = useState(false)
  const [transferProgress, setTransferProgress] = useState(0)
  const [transferStatus, setTransferStatus] = useState<'idle' | 'preparing' | 'signing' | 'confirming' | 'success' | 'error'>('idle')
  const [savedAddresses, setSavedAddresses] = useState<SavedAddress[]>([])
  const [showAddressBook, setShowAddressBook] = useState(false)
  const [newAddressName, setNewAddressName] = useState("")
  const [estimatedFee, setEstimatedFee] = useState("0.000005")
  const [isValidAddress, setIsValidAddress] = useState(false)
  const [addressValidationMessage, setAddressValidationMessage] = useState("")

  const selectedTokenData = AVAILABLE_TOKENS.find(token => token.symbol === selectedToken)
  
  // Get available tokens - all supported tokens
  const availableTokens = AVAILABLE_TOKENS

  // Get token balance
  const tokenBalance = balances[selectedToken] || 0

  // Load saved addresses from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('goldium-saved-addresses')
    if (saved) {
      try {
        setSavedAddresses(JSON.parse(saved))
      } catch (error) {
        console.error('Error loading saved addresses:', error)
      }
    }
  }, [])

  // Validate recipient address
  useEffect(() => {
    if (!recipientAddress) {
      setIsValidAddress(false)
      setAddressValidationMessage("")
      return
    }

    try {
      new PublicKey(recipientAddress)
      setIsValidAddress(true)
      setAddressValidationMessage("Valid Solana address")
    } catch {
      setIsValidAddress(false)
      setAddressValidationMessage("Invalid address format")
    }
  }, [recipientAddress])

  // Estimate transfer fee
  useEffect(() => {
    if (selectedToken === 'SOL') {
      setEstimatedFee("0.000005")
    } else {
      setEstimatedFee("0.00001") // Token transfer fee
    }
  }, [selectedToken])

  const saveAddress = () => {
    if (!newAddressName || !recipientAddress || !isValidAddress) return

    const newAddress: SavedAddress = {
      name: newAddressName,
      address: recipientAddress,
      lastUsed: Date.now()
    }

    const updated = [...savedAddresses, newAddress]
    setSavedAddresses(updated)
    localStorage.setItem('goldium-saved-addresses', JSON.stringify(updated))
    setNewAddressName("")
    setShowAddressBook(false)

    toast({
      title: "Address saved",
      description: `${newAddressName} has been added to your address book`,
    })
  }

  const selectSavedAddress = (address: SavedAddress) => {
    setRecipientAddress(address.address)
    setShowAddressBook(false)
    
    // Update last used
    const updated = savedAddresses.map(addr => 
      addr.address === address.address 
        ? { ...addr, lastUsed: Date.now() }
        : addr
    )
    setSavedAddresses(updated)
    localStorage.setItem('goldium-saved-addresses', JSON.stringify(updated))
  }

  const simulateTransferProgress = () => {
    setTransferProgress(0)
    setTransferStatus('preparing')
    
    const steps = [
      { progress: 25, status: 'preparing', delay: 500 },
      { progress: 50, status: 'signing', delay: 1000 },
      { progress: 75, status: 'confirming', delay: 1500 },
      { progress: 100, status: 'success', delay: 2000 }
    ]
    
    steps.forEach(({ progress, status, delay }) => {
      setTimeout(() => {
        setTransferProgress(progress)
        setTransferStatus(status as any)
      }, delay)
    })
  }

  const handleTransfer = async () => {
    if (!connected || !publicKey || !signTransaction) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet first",
        variant: "destructive",
      })
      return
    }

    if (!recipientAddress || !isValidAddress) {
      toast({
        title: "Invalid recipient",
        description: "Please enter a valid recipient address",
        variant: "destructive",
      })
      return
    }

    if (!amount || Number(amount) <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid amount",
        variant: "destructive",
      })
      return
    }

    if (Number(amount) > tokenBalance) {
      toast({
        title: "Insufficient balance",
        description: `You only have ${tokenBalance.toFixed(6)} ${selectedToken}`,
        variant: "destructive",
      })
      return
    }

    try {
      setIsTransferring(true)
      simulateTransferProgress()
      
      // Validate recipient address
      let recipientPubkey: PublicKey
      try {
        recipientPubkey = new PublicKey(recipientAddress)
      } catch {
        throw new Error("Invalid recipient address format")
      }

      let signature: string
      
      // Handle different token types
      if (selectedToken === 'SOL') {
        // For SOL transfers, simulate the transfer
        signature = `sol_demo_tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
        
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1500))
        
        // Deduct balance from sender
        deductBalance(selectedToken, Number(amount))
      } else {
        // For token transfers
        signature = `demo_tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
        
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        // Deduct balance from sender
        deductBalance(selectedToken, Number(amount))
      }

      // Create Solscan link for transaction tracking
      const solscanUrl = `https://solscan.io/tx/${signature}`
      
      toast({
        title: "Transfer successful!",
        description: (
          <div className="space-y-2">
            <p>Successfully transferred {amount} {selectedToken}</p>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500">Signature: {signature.slice(0, 8)}...{signature.slice(-8)}</span>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 px-2"
                onClick={() => navigator.clipboard.writeText(signature)}
              >
                <Copy className="h-3 w-3" />
              </Button>
            </div>
          </div>
        ),
      })

      // Reset form
      setAmount("")
      setRecipientAddress("")

    } catch (error) {
      console.error("Transfer error:", error)
      setTransferStatus('error')
      toast({
        title: "Transfer failed",
        description: error instanceof Error ? error.message : "Failed to transfer tokens",
        variant: "destructive",
      })
    } finally {
      setTimeout(() => {
        setIsTransferring(false)
        setTransferProgress(0)
        setTransferStatus('idle')
      }, 1000)
    }
  }

  const handleMaxAmount = () => {
    // Reserve some SOL for transaction fees
    const maxAmount = selectedToken === 'SOL' 
      ? Math.max(0, tokenBalance - 0.01) 
      : tokenBalance
    setAmount(maxAmount.toString())
  }

  const getStatusIcon = () => {
    switch (transferStatus) {
      case 'preparing': return <Clock className="h-4 w-4" />
      case 'signing': return <Zap className="h-4 w-4" />
      case 'confirming': return <Loader2 className="h-4 w-4 animate-spin" />
      case 'success': return <CheckCircle className="h-4 w-4" />
      case 'error': return <AlertTriangle className="h-4 w-4" />
      default: return null
    }
  }

  const getStatusText = () => {
    switch (transferStatus) {
      case 'preparing': return 'Preparing transaction...'
      case 'signing': return 'Please sign the transaction'
      case 'confirming': return 'Confirming on blockchain...'
      case 'success': return 'Transfer completed successfully!'
      case 'error': return 'Transfer failed'
      default: return ''
    }
  }

  if (!connected) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className={`w-full max-w-md mx-auto ${isDarkTheme ? "bg-gray-900/50 border-gray-800" : "bg-white/50 border-gray-200"} backdrop-blur-sm`}>
          <CardContent className="p-6 flex justify-center items-center h-64">
            <div className="flex flex-col items-center text-center">
              <Shield className={`h-12 w-12 mb-4 ${isDarkTheme ? "text-gray-400" : "text-gray-500"}`} />
              <p className={`text-lg font-medium mb-4 ${isDarkTheme ? "text-gray-300" : "text-gray-700"}`}>
                Connect your wallet to transfer tokens
              </p>
              <p className={`text-sm ${isDarkTheme ? "text-gray-400" : "text-gray-500"}`}>
                You need to connect your wallet to send tokens.
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-md mx-auto"
    >
      <Card className={`${isDarkTheme ? "bg-gray-900/50 border-gray-800" : "bg-white/50 border-gray-200"} backdrop-blur-sm shadow-xl`}>
        <CardHeader>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex items-center justify-between"
          >
            <CardTitle className={`${isDarkTheme ? "text-white" : "text-gray-900"} flex items-center gap-2`}>
              <Send className="h-5 w-5 text-gold" />
              Transfer Tokens
            </CardTitle>
            <Dialog open={showAddressBook} onOpenChange={setShowAddressBook}>
              <DialogTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <BookOpen className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent className={isDarkTheme ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200"}>
                <DialogHeader>
                  <DialogTitle className={isDarkTheme ? "text-white" : "text-gray-900"}>Address Book</DialogTitle>
                  <DialogDescription>
                    Save and manage frequently used addresses
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  {savedAddresses.length > 0 && (
                    <div className="space-y-2">
                      <Label className={isDarkTheme ? "text-white" : "text-gray-900"}>Saved Addresses</Label>
                      <div className="max-h-40 overflow-y-auto space-y-2">
                        {savedAddresses
                          .sort((a, b) => (b.lastUsed || 0) - (a.lastUsed || 0))
                          .map((addr, index) => (
                          <div
                            key={index}
                            className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                              isDarkTheme 
                                ? "bg-gray-800 border-gray-700 hover:bg-gray-700" 
                                : "bg-gray-50 border-gray-200 hover:bg-gray-100"
                            }`}
                            onClick={() => selectSavedAddress(addr)}
                          >
                            <div className="flex justify-between items-start">
                              <div>
                                <p className={`font-medium ${isDarkTheme ? "text-white" : "text-gray-900"}`}>
                                  {addr.name}
                                </p>
                                <p className={`text-xs ${isDarkTheme ? "text-gray-400" : "text-gray-500"}`}>
                                  {addr.address.slice(0, 8)}...{addr.address.slice(-8)}
                                </p>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 px-2"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  navigator.clipboard.writeText(addr.address)
                                  toast({ title: "Address copied", description: "Address copied to clipboard" })
                                }}
                              >
                                <Copy className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {recipientAddress && isValidAddress && (
                    <div className="space-y-2">
                      <Label className={isDarkTheme ? "text-white" : "text-gray-900"}>Save Current Address</Label>
                      <div className="flex gap-2">
                        <Input
                          placeholder="Enter name for this address"
                          value={newAddressName}
                          onChange={(e) => setNewAddressName(e.target.value)}
                          className={isDarkTheme ? "bg-gray-800 border-gray-700 text-white" : "bg-gray-100 border-gray-300"}
                        />
                        <Button
                          onClick={saveAddress}
                          disabled={!newAddressName}
                          size="sm"
                        >
                          Save
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </DialogContent>
            </Dialog>
          </motion.div>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          {/* Token Selection */}
          <motion.div 
            className="space-y-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <Label className={isDarkTheme ? "text-gray-300" : "text-gray-700"}>Token</Label>
            <Select value={selectedToken} onValueChange={setSelectedToken}>
              <SelectTrigger className={isDarkTheme ? "bg-gray-800 border-gray-700 text-white" : "bg-gray-100 border-gray-300"}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent className={isDarkTheme ? "bg-gray-800 border-gray-700" : "bg-white border-gray-300"}>
                {availableTokens.map((token) => (
                  <SelectItem key={token.symbol} value={token.symbol} className={isDarkTheme ? "text-white hover:bg-gray-700" : "text-gray-900 hover:bg-gray-100"}>
                    <div className="flex items-center space-x-2">
                      <span>{token.symbol}</span>
                      <span className={`text-sm ${isDarkTheme ? "text-gray-400" : "text-gray-500"}`}>({token.name})</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="flex justify-between items-center">
              <span className={`text-sm ${isDarkTheme ? "text-gray-400" : "text-gray-500"}`}>Available Balance</span>
              <div className="flex items-center gap-2">
                <span className={`text-sm font-medium ${isDarkTheme ? "text-gray-300" : "text-gray-700"}`}>
                  {tokenBalance.toFixed(6)} {selectedToken}
                </span>
                <TrendingUp className={`h-3 w-3 ${tokenBalance > 0 ? 'text-green-400' : 'text-gray-400'}`} />
              </div>
            </div>
          </motion.div>

          {/* Recipient Address */}
          <motion.div 
            className="space-y-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <Label className={isDarkTheme ? "text-gray-300" : "text-gray-700"}>Recipient Address</Label>
            <div className="relative">
              <Input
                type="text"
                placeholder="Enter Solana wallet address"
                value={recipientAddress}
                onChange={(e) => setRecipientAddress(e.target.value)}
                className={`${isDarkTheme ? "bg-gray-800 border-gray-700 text-white" : "bg-gray-100 border-gray-300"} pr-10`}
              />
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6"
                onClick={() => setShowAddressBook(true)}
              >
                <BookOpen className="h-3 w-3" />
              </Button>
            </div>
            <AnimatePresence>
              {recipientAddress && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className={`flex items-center gap-2 text-xs ${
                    isValidAddress ? 'text-green-500' : 'text-red-500'
                  }`}
                >
                  {isValidAddress ? <CheckCircle className="h-3 w-3" /> : <AlertTriangle className="h-3 w-3" />}
                  {addressValidationMessage}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Amount */}
          <motion.div 
            className="space-y-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <Label className={isDarkTheme ? "text-gray-300" : "text-gray-700"}>Amount</Label>
            <div className="relative">
              <Input
                type="text"
                placeholder="0.00"
                value={amount}
                onChange={(e) => {
                  if (e.target.value === "" || /^\d*\.?\d*$/.test(e.target.value)) {
                    setAmount(e.target.value)
                  }
                }}
                className={`${isDarkTheme ? "bg-gray-800 border-gray-700 text-white" : "bg-gray-100 border-gray-300"} pr-16`}
              />
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-xs text-gold h-6 px-2"
                onClick={handleMaxAmount}
              >
                MAX
              </Button>
            </div>
            {amount && Number(amount) > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={`p-3 rounded-lg ${isDarkTheme ? "bg-gray-800/50" : "bg-gray-50"} space-y-2`}
              >
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Amount</span>
                  <span className="text-sm font-medium">{amount} {selectedToken}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Network Fee</span>
                  <span className="text-sm font-medium">{estimatedFee} SOL</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Total Cost</span>
                  <span className="text-sm font-medium">
                    {selectedToken === 'SOL' 
                      ? (Number(amount) + Number(estimatedFee)).toFixed(6)
                      : amount
                    } {selectedToken}
                    {selectedToken !== 'SOL' && (
                      <span className="text-xs text-gray-500 ml-1">+ {estimatedFee} SOL</span>
                    )}
                  </span>
                </div>
              </motion.div>
            )}
          </motion.div>

          {/* Transfer Progress */}
          <AnimatePresence>
            {isTransferring && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="p-4 rounded-lg bg-gradient-to-r from-gold/10 to-yellow-400/10 border border-gold/20"
              >
                <div className="flex items-center gap-2 mb-2">
                  {getStatusIcon()}
                  <span className="text-sm font-medium text-gold">{getStatusText()}</span>
                </div>
                <Progress value={transferProgress} className="h-2" />
                <div className="text-xs text-gray-500 mt-1">{transferProgress}% complete</div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Transfer Button */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <Button
              onClick={handleTransfer}
              disabled={
                isTransferring ||
                !recipientAddress ||
                !isValidAddress ||
                !amount ||
                Number(amount) <= 0 ||
                Number(amount) > tokenBalance
              }
              className="w-full bg-gradient-to-r from-gold to-yellow-400 hover:from-gold/90 hover:to-yellow-400/90 text-black font-semibold"
            >
              {isTransferring ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Transferring
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Transfer {selectedToken}
                </>
              )}
            </Button>
          </motion.div>

          {/* Security Info */}
          <motion.div 
            className={`text-xs ${isDarkTheme ? "text-gray-500" : "text-gray-600"} text-center space-y-1`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            <div className="flex items-center justify-center gap-1">
              <Shield className="h-3 w-3" />
              <span>Secure transfer powered by Solana</span>
            </div>
            <p>Make sure the recipient address is correct.</p>
            <p>Transactions on Solana are irreversible.</p>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  )
}