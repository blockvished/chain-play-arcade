"use client"

import type React from "react"

import { useAdmin } from "@/hooks/use-admin"
import { useAccount } from "wagmi"
import { Card, CardContent } from "@/components/ui/card"
import { WalletConnect } from "@/components/wallet-connect"
import { Shield, AlertTriangle } from "lucide-react"

interface AdminGuardProps {
  children: React.ReactNode
}


export function AdminGuard({ children }: AdminGuardProps) {
  const { isConnected } = useAccount()
  const { isAdmin } = useAdmin()

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center space-y-4">
            <Shield className="h-12 w-12 mx-auto text-muted-foreground" />
            <h2 className="text-2xl font-bold text-foreground">Admin Access Required</h2>
            <p className="text-muted-foreground">Please connect your wallet to access admin features.</p>
            <WalletConnect />
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center space-y-4">
            <AlertTriangle className="h-12 w-12 mx-auto text-red-400" />
            <h2 className="text-2xl font-bold text-foreground">Access Denied</h2>
            <p className="text-muted-foreground">
              You don't have admin privileges. Only authorized wallets can access this area.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return <>{children}</>
}
