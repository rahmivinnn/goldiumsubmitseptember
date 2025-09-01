"use client"

import { TokenTransfer } from "@/components/TokenTransfer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function TransferPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">Token Transfer</CardTitle>
            <CardDescription className="text-center">
              Send tokens to any Solana wallet address
            </CardDescription>
          </CardHeader>
          <CardContent>
            <TokenTransfer />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}