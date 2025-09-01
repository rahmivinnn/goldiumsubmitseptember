"use client"

import { useState, useEffect } from "react"
import SplashScreen from "@/components/SplashScreen"
import PageLayout from "@/components/PageLayout"
import InteractiveFeatures from "@/components/home/InteractiveFeatures"
import ViralHeroSection from "@/components/home/ViralHeroSection"
import DeFiSection from "@/components/home/DeFiSection"
import EducationalSection from "@/components/home/EducationalSection"

export default function Home() {
  const [showSplash, setShowSplash] = useState(true)

  useEffect(() => {
    // Timer untuk splashscreen 10 detik
    const timer = setTimeout(() => {
      setShowSplash(false)
    }, 10000) // 10 detik

    return () => clearTimeout(timer)
  }, [])

  if (showSplash) {
    return <SplashScreen />
  }

  return (
    <PageLayout>
      <ViralHeroSection />
      <InteractiveFeatures />
      <DeFiSection />
      <EducationalSection />
    </PageLayout>
  )
}