"use client"

import { useState, useEffect } from "react"
import { useAccount, useWalletClient } from "wagmi"
import { initializeGameRegistryService } from "@/lib/services/gameRegistryService"

export const useGameRegistryService = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [service, setService] = useState<any>(null)
  
  const { isConnected } = useAccount()
  const { data: walletClient } = useWalletClient()

  useEffect(() => {
    const initService = async () => {
      console.log("🔄 Initializing service...", { walletClient: !!walletClient, isConnected })
      
      if (walletClient && isConnected) {
        try {
          console.log("📡 Wallet client available, initializing service...")
          const gameRegistryService = await initializeGameRegistryService(walletClient)
          setService(gameRegistryService)
          console.log("✅ GameRegistryService initialized with wallet client")
        } catch (err) {
          console.error("❌ Failed to initialize GameRegistryService:", err)
          setError("Failed to initialize blockchain service")
        }
      } else {
        console.log("⏳ Waiting for wallet client or connection...")
        setService(null)
      }
    }

    initService()
  }, [walletClient, isConnected])

  const createGameDefinition = async (name: string, image: string, description: string): Promise<string> => {
    try {
      setIsLoading(true)
      setError(null)

      // Check if wallet is connected
      if (!isConnected) {
        throw new Error("Wallet not connected. Please connect your wallet to create game definitions.")
      }

      // Check if service is initialized
      if (!service) {
        throw new Error("Blockchain service not initialized. Please try again.")
      }

      console.log("🏗️ Creating game definition with service...")
      console.log("📤 Calling createGameDefinition contract function...")
      console.log("📋 Game details:", { name, image, description })
      
      // Call the real contract function
      const txHash = await service.createGameDefinition(name, image, description)
      
      console.log("✅ Game definition created successfully!")
      return txHash
    } catch (err) {
      console.error("❌ Error in createGameDefinition:", err)
      const errorMessage = err instanceof Error ? err.message : "Failed to create game definition"
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  return {
    createGameDefinition,
    isLoading,
    error,
    isServiceReady: !!service && isConnected,
  }
}
