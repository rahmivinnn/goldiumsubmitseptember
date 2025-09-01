"use client"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useWallet } from "@solana/wallet-adapter-react"
import { useWalletModal } from "@solana/wallet-adapter-react-ui"
import WalletDisplay from "@/components/WalletDisplay"
import { Loader2, Wallet, ArrowRight, Zap } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import dynamic from "next/dynamic"
import { isBrowser } from "@/utils/browser"

// Dynamically import the ThreeScene component with SSR disabled
const ThreeScene = dynamic(() => import("@/components/three/ThreeScene"), {
  ssr: false,
  loading: () => <div className="w-full h-screen bg-black" />,
})

export default function HeroSection() {
  const { connected, connecting, publicKey } = useWallet()
  const { setVisible } = useWalletModal()
  const { toast } = useToast()
  const [scrollY, setScrollY] = useState(0)
  const isMounted = useRef(false)
  const router = useRouter()

  // Handle scroll events safely
  useEffect(() => {
    // Set mounted ref
    isMounted.current = true

    // Only run on client side
    if (!isBrowser) return

    // Create scroll handler function
    const handleScroll = () => {
      if (isMounted.current) {
        setScrollY(window.scrollY)
      }
    }

    // Add event listener with passive option for better performance
    window.addEventListener("scroll", handleScroll, { passive: true })

    // Initialize with current scroll position after a small delay
    // to ensure the component is fully mounted
    const initTimer = setTimeout(() => {
      if (isMounted.current) {
        handleScroll()
      }
    }, 0)

    // Clean up
    return () => {
      isMounted.current = false
      window.removeEventListener("scroll", handleScroll)
      clearTimeout(initTimer)
    }
  }, []) // Empty dependency array means this only runs once on mount

  const handleClaimTokens = async () => {
    if (!connected) {
      setVisible(true)
      return
    }

    try {
      // Implement token claiming logic here
      toast({
        title: "Feature Coming Soon",
        description: "Token claiming will be available soon!",
      })
    } catch (error) {
      toast({
        title: "Claim Failed",
        description: "Failed to claim test tokens. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleStakeTokens = async () => {
    if (!connected) {
      setVisible(true)
      return
    }

    try {
      // Implement staking logic here
      toast({
        title: "Feature Coming Soon",
        description: "Token staking will be available soon!",
      })
    } catch (error) {
      toast({
        title: "Staking Failed",
        description: "Failed to stake tokens. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleGetStarted = () => {
    if (connected) {
      router.push('/dashboard')
    } else {
      setVisible(true)
    }
  }

  const handleExploreFeatures = () => {
    router.push('/defi')
  }

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
      {/* 3D Background */}
      <div className="absolute inset-0 z-0">
        <ThreeScene scrollY={scrollY} />
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto"
        >
          {/* Logo */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="flex justify-center mb-6"
          >
            <div className="relative h-24 w-24 md:h-32 md:w-32">
              <Image
                src="/goldium-logo.png"
                alt="Goldium.io"
                width={128}
                height={128}
                className="object-contain"
                priority
              />
            </div>
          </motion.div>

          <h1 className="text-5xl md:text-7xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-yellow-300">
            Goldium.io
          </h1>
          <p className="text-xl md:text-2xl text-amber-100/80 mb-8">
            Experience the future of gaming and finance in one unified ecosystem. GOLDIUM combines immersive 3D worlds, thrilling 2D adventures, and real economic opportunities powered by the GOLD token.
          </p>

          <div className="flex flex-col md:flex-row gap-4 justify-center mb-12">
            {/* Primary CTA - Get Started */}
            <Button
              onClick={handleGetStarted}
              className="bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-black font-medium text-lg py-6 px-8 group"
              size="lg"
              disabled={connecting}
            >
              {connecting ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Connecting...
                </>
              ) : connected ? (
                <>
                  <ArrowRight className="mr-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  Enter Dashboard
                </>
              ) : (
                <>
                  <Wallet className="mr-2 h-5 w-5" />
                  Get Started
                </>
              )}
            </Button>

            {/* Explore Features CTA */}
            <Button
              onClick={handleExploreFeatures}
              className="bg-black/50 border border-amber-500/30 hover:bg-amber-500/10 text-amber-300 font-medium group"
              size="lg"
            >
              <Zap className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" />
              Explore DeFi
            </Button>

            {/* Secondary CTAs */}
            <Button
              onClick={handleClaimTokens}
              className="bg-black/50 border border-amber-500/30 hover:bg-amber-500/10 text-amber-300 font-medium"
              size="lg"
              disabled={isProcessing}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                "Claim 100 GOLD"
              )}
            </Button>

            <Button
              onClick={handleStakeTokens}
              className="bg-black/50 border border-amber-500/30 hover:bg-amber-500/10 text-amber-300 font-medium"
              size="lg"
              disabled={isProcessing}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                "Stake 10 GOLD"
              )}
            </Button>
          </div>
        </motion.div>

        {/* Token Contract Address */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="mt-8"
        >
          <div className="inline-block bg-black/60 backdrop-blur-sm border border-amber-500/20 rounded-lg p-4">
            <div className="flex items-center justify-center gap-2">
              <div className="h-6 w-6 rounded-full bg-amber-500 flex items-center justify-center">
                <span className="text-black font-bold text-xs">G</span>
              </div>
              <span className="text-amber-500 font-medium">GOLD Token Contract Address</span>
            </div>
            <div className="mt-2 bg-gray-900 rounded px-4 py-2 font-mono text-sm text-gray-300">
              ApkBg8kzMBpVKxvgrw67vkd5KuGWqSu2GVb19eK4pump
            </div>
          </div>
        </motion.div>

        {/* Wallet Display for connected users */}
        {connected && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="mt-8 flex justify-center"
          >
            <WalletDisplay showFullDetails={false} />
          </motion.div>
        )}
      </div>

    </section>
  )
}
