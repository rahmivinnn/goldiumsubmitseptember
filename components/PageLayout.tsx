import type React from "react"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"

export default function PageLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-black text-white">
      <Navbar />
      <main className="flex-grow pt-20 px-4 md:px-6 lg:px-8">{children}</main>
      <Footer />
    </div>
  )
}
