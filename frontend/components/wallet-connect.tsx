"use client"

import { ConnectKitButton } from "connectkit"
import { Button } from "@/components/ui/button"

export function WalletConnect() {
  return (
    <ConnectKitButton.Custom>
      {({ isConnected, show, truncatedAddress, ensName }) => {
        return (
          <Button onClick={show} variant={isConnected ? "secondary" : "default"} className="font-medium">
            {isConnected ? (ensName ?? truncatedAddress) : "Connect Wallet"}
          </Button>
        )
      }}
    </ConnectKitButton.Custom>
  )
}
