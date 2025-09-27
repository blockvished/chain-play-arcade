"use client"

import { useState } from "react"
import { AdminGuard } from "@/components/admin-guard"
import { Navigation } from "@/components/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Shield, ArrowLeft, Gamepad2, Loader2 } from "lucide-react"
import Link from "next/link"
import { useGameRegistryService } from "@/lib/hooks/useGameRegistryService"
import { useAccount, useConnect, useDisconnect } from "wagmi"
import { getGameRegistryService } from "@/lib/services/gameRegistryService"

export default function CreateGamePage() {
  const [formData, setFormData] = useState({
    name: "",
    image: "",
    description: ""
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [txHash, setTxHash] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const { createGameDefinition, isServiceReady } = useGameRegistryService()
  const { address, isConnected } = useAccount()
  const { connect, connectors } = useConnect()
  const { disconnect } = useDisconnect()

  // Debug logging
  console.log("🔍 Create Game Page State:", { isConnected, isServiceReady, address })

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)
    setTxHash(null)

    try {
      // Check wallet connection and service readiness
      if (!isConnected) {
        throw new Error("Please connect your wallet to create game definitions")
      }
      
      if (!isServiceReady) {
        throw new Error("Blockchain service is not ready. Please wait a moment and try again.")
      }

      console.log("🚀 Creating game definition:", formData)
      const hash = await createGameDefinition(formData.name, formData.image, formData.description)
      setTxHash(hash)
      console.log("✅ Game definition created successfully!")
      
      // Reset form
      setFormData({
        name: "",
        image: "",
        description: ""
      })
    } catch (err) {
      console.error("❌ Error creating game definition:", err)
      setError(err instanceof Error ? err.message : "Failed to create game definition")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AdminGuard>
      <div className="min-h-screen bg-background">
        <Navigation />

        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <Link href="/admin">
                <Button variant="ghost" size="sm" className="flex items-center gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Back to Admin
                </Button>
              </Link>
            </div>
            <div className="flex items-center gap-3 mb-4">
              <Gamepad2 className="h-8 w-8 text-orange-400" />
              <h1 className="text-3xl font-bold text-foreground">Create Game Definition</h1>
              <Badge variant="destructive" className="bg-red-500/20 text-red-400 border-red-500/30">
                Admin Only
              </Badge>
            </div>
            <p className="text-muted-foreground text-pretty">
              Add a new game definition to the blockchain registry. This will create a new game type that can be used in tournaments.
            </p>
          </div>

          {/* Success Message */}
          {txHash && (
            <Card className="mb-6 border-green-500/20 bg-green-500/5">
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 text-green-400">
                  <Gamepad2 className="h-5 w-5" />
                  <span className="font-medium">Game Definition Created Successfully!</span>
                </div>
                <p className="text-sm text-green-300 mt-2">
                  Transaction Hash: <code className="bg-green-500/20 px-2 py-1 rounded text-xs">{txHash}</code>
                </p>
              </CardContent>
            </Card>
          )}

          {/* Error Message */}
          {error && (
            <Card className="mb-6 border-red-500/20 bg-red-500/5">
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 text-red-400">
                  <Shield className="h-5 w-5" />
                  <span className="font-medium">Error Creating Game Definition</span>
                </div>
                <p className="text-sm text-red-300 mt-2">{error}</p>
              </CardContent>
            </Card>
          )}

          {/* Wallet Connection Status */}
          <Card className="mb-6">
            <CardContent className="pt-6">
              {isConnected ? (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    <div className="flex flex-col">
                      <span className="font-medium text-green-400">Wallet Connected</span>
                      {isServiceReady ? (
                        <span className="text-xs text-green-300">Blockchain service ready</span>
                      ) : (
                        <span className="text-xs text-yellow-300">Initializing blockchain service...</span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">
                      {address?.slice(0, 6)}...{address?.slice(-4)}
                    </span>
                    <Button variant="outline" size="sm" onClick={() => disconnect()}>
                      Disconnect
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-red-400">
                    <Shield className="h-5 w-5" />
                    <span className="font-medium">Wallet Not Connected</span>
                  </div>
                  <Button 
                    onClick={() => connect({ connector: connectors[0] })}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Connect Wallet
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Create Game Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-orange-400">
                <Gamepad2 className="h-5 w-5 mr-2" />
                Game Definition Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Game Name</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="e.g., Chess Tournament, Memory Challenge"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    required
                    disabled={isSubmitting}
                  />
                  <p className="text-sm text-muted-foreground">
                    The name of the game that will appear in tournaments
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="image">Image URL</Label>
                  <Input
                    id="image"
                    type="url"
                    placeholder="https://example.com/game-image.jpg"
                    value={formData.image}
                    onChange={(e) => handleInputChange("image", e.target.value)}
                    required
                    disabled={isSubmitting}
                  />
                  <p className="text-sm text-muted-foreground">
                    URL to the game's image/icon
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe the game rules, objectives, and how to play..."
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    required
                    disabled={isSubmitting}
                    rows={4}
                  />
                  <p className="text-sm text-muted-foreground">
                    Detailed description of the game and its rules
                  </p>
                </div>

                <div className="flex gap-4 pt-4">
                  <Button
                    type="submit"
                    disabled={isSubmitting || !isConnected || !formData.name || !formData.image || !formData.description}
                    className="flex-1 bg-orange-600 hover:bg-orange-700"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Creating Game...
                      </>
                    ) : (
                      <>
                        <Gamepad2 className="h-4 w-4 mr-2" />
                        Create Game Definition
                      </>
                    )}
                  </Button>
                  <Link href="/admin">
                    <Button type="button" variant="outline" disabled={isSubmitting}>
                      Cancel
                    </Button>
                  </Link>
                </div>
              </form>
            </CardContent>
          </Card>
        </main>
      </div>
    </AdminGuard>
  )
}
