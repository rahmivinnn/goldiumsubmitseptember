import type React from "react"
import type { Metadata } from "next"
import { Inter, Sora } from "next/font/google"
import "./globals.css"
import "@solana/wallet-adapter-react-ui/styles.css"
import "../styles/wallet-modal.css"
import "../styles/instant-wallet.css"
import "../styles/responsive-fix.css"
import ClientProviders from "@/components/ClientProviders"
import ClientInitializer from "@/components/ClientInitializer"

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sora",
  display: "swap",
})

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

export const metadata: Metadata = {
  title: "GOLDIUM | Web3 Gaming & DeFi Universe",
  description: "Experience the future of gaming and finance in one unified ecosystem. GOLDIUM combines immersive 3D worlds, thrilling 2D adventures, and real economic opportunities powered by the GOLD token. Own your in-game assets as NFTs, earn rewards through play-to-earn mechanics, and grow your wealth via staking, trading, and DeFi utilities. Whether you're exploring, battling, or investing— GOLDIUM lets you play, earn, and thrive on the blockchain.",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${sora.variable} ${inter.variable} font-sans bg-black text-white`}>
        <ClientProviders>
          <ClientInitializer />
          {children}
        </ClientProviders>
      </body>
    </html>
  )
}
