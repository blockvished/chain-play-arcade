"use client"

import type React from "react"

import { WagmiProvider } from "wagmi"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ConnectKitProvider } from "connectkit"
import { config } from "@/lib/wagmi"
import { useState } from "react"

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient())

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <ConnectKitProvider
          theme="midnight"
          mode="dark"
          customTheme={{
            "--ck-font-family": "var(--font-geist-sans)",
            "--ck-border-radius": "8px",
            "--ck-primary-button-background": "oklch(0.7 0.15 160)",
            "--ck-primary-button-hover-background": "oklch(0.65 0.15 160)",
          }}
        >
          {children}
        </ConnectKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}
