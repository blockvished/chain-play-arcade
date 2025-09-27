"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { AdminGuard } from "@/components/admin-guard"
import { Navigation } from "@/components/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Shield, Gamepad2, Loader2 } from "lucide-react"
import { useGameRegistryService } from "@/lib/hooks/useGameRegistryService"
import { useAccount, useConnect, useDisconnect } from "wagmi"

export default function CreateTournamentPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [formData, setFormData] = useState({
    gameId: "",
    eventName: "",
    durationMinutes: "",
    minStakeAmt: "",
    winnersCount: 1,
    activate: true
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [txHash, setTxHash] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [gameId, setGameId] = useState<string | null>(null)

  const { createGameEvent, isServiceReady } = useGameRegistryService()
  const { address, isConnected } = useAccount()
  const { connect, connectors } = useConnect()
  const { disconnect } = useDisconnect()

  useEffect(() => {
    const id = searchParams.get('id')
    if (id) {
      setGameId(id)
      setFormData(prev => ({ ...prev, gameId: id }))
      console.log("🎮 Game ID from URL:", id)
    }
  }, [searchParams])

  const handleInputChange = (field: string, value: string | number | boolean) => {
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
        throw new Error("Please connect your wallet to create game events")
      }
      
      if (!isServiceReady) {
        throw new Error("Blockchain service is not ready. Please wait a moment and try again.")
      }

      console.log("🚀 Creating game event:", formData)
      const hash = await createGameEvent(
        parseInt(formData.gameId),
        formData.eventName,
        parseInt(formData.durationMinutes),
        formData.minStakeAmt,
        formData.winnersCount,
        formData.activate
      )
      setTxHash(hash)
      console.log("✅ Game event created successfully!")
      
      // Redirect to admin page after success
      setTimeout(() => {
        router.push("/admin")
      }, 2000)
    } catch (err) {
      console.error("❌ Error creating game event:", err)
      setError(err instanceof Error ? err.message : "Failed to create game event")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    router.push("/admin")
  }

  return (
    <AdminGuard>
      <div className="min-h-screen bg-background">
        <Navigation />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
              <span>Admin</span>
              <span>/</span>
              <span>Tournaments</span>
              <span>/</span>
              <span>Create</span>
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Create Game Event</h1>
            <p className="text-muted-foreground">
              Create a new game event with custom settings, duration, and prize pool. This will create a tournament that players can join.
              {gameId && (
                <span className="block mt-2 text-orange-400">
                  🎮 Creating event for Game ID: {gameId}
                </span>
              )}
            </p>
          </div>

          {/* Success Message */}
          {txHash && (
            <Card className="mb-6 border-green-500/20 bg-green-500/5">
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 text-green-400">
                  <Gamepad2 className="h-5 w-5" />
                  <span className="font-medium">Game Event Created Successfully!</span>
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
                  <span className="font-medium">Error Creating Game Event</span>
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

          {/* Create Game Event Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-orange-400">
                <Gamepad2 className="h-5 w-5 mr-2" />
                Game Event Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="gameId">Game ID</Label>
                  <Input
                    id="gameId"
                    type="number"

                    placeholder="e.g., 1, 2, 3"
                    value={formData.gameId}
                    required
                    disabled={true}
                  />
                  <p className="text-sm text-muted-foreground">
                    The ID of the game definition to use for this event
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="eventName">Event Name</Label>
                  <Input
                    id="eventName"
                    type="text"
                    placeholder="e.g., Chess Championship, Memory Challenge"
                    value={formData.eventName}
                    onChange={(e) => handleInputChange("eventName", e.target.value)}
                    required
                    disabled={isSubmitting}
                  />
                  <p className="text-sm text-muted-foreground">
                    The name of the tournament/event
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="durationMinutes">Duration (Minutes)</Label>
                  <Input
                    id="durationMinutes"
                    type="number"
                    placeholder="e.g., 60, 120, 180"
                    value={formData.durationMinutes}
                    onChange={(e) => handleInputChange("durationMinutes", e.target.value)}
                    required
                    disabled={isSubmitting}
                  />
                  <p className="text-sm text-muted-foreground">
                    How long the tournament will last in minutes
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="minStakeAmt">Minimum Stake Amount (FLOW)</Label>
                  <Input
                    id="minStakeAmt"
                    type="number"
                    step="0.001"
                    placeholder="e.g., 0.1, 0.5, 1.0"
                    value={formData.minStakeAmt}
                    onChange={(e) => handleInputChange("minStakeAmt", e.target.value)}
                    required
                    disabled={isSubmitting}
                  />
                  <p className="text-sm text-muted-foreground">
                    Minimum amount players need to stake to join (in FLOW)
                  </p>
                </div>

                <div className="space-y-2">
                  <Label>Winners Count</Label>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant={formData.winnersCount === 1 ? "default" : "outline"}
                      onClick={() => handleInputChange("winnersCount", 1)}
                      disabled={isSubmitting}
                      className="flex-1"
                    >
                      1 Winner
                    </Button>
                    <Button
                      type="button"
                      variant={formData.winnersCount === 3 ? "default" : "outline"}
                      onClick={() => handleInputChange("winnersCount", 3)}
                      disabled={isSubmitting}
                      className="flex-1"
                    >
                      3 Winners
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Number of winners for this tournament
                  </p>
                </div>

                <div className="space-y-2">
                  <Label>Activate Event</Label>
                  <div className="flex gap-4">
                    <label className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name="activate"
                        checked={formData.activate === true}
                        onChange={() => handleInputChange("activate", true)}
                        disabled={isSubmitting}
                        className="text-orange-600"
                      />
                      <span className="text-sm">Yes (Start immediately)</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name="activate"
                        checked={formData.activate === false}
                        onChange={() => handleInputChange("activate", false)}
                        disabled={isSubmitting}
                        className="text-orange-600"
                      />
                      <span className="text-sm">No (Start later)</span>
                    </label>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Whether to activate the event immediately or start it later
                  </p>
                </div>

                <div className="flex gap-4 pt-4">
                  <Button
                    type="submit"
                    disabled={isSubmitting || !isConnected || !formData.gameId || !formData.eventName || !formData.durationMinutes || !formData.minStakeAmt}
                    className="flex-1 bg-orange-600 hover:bg-orange-700"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Creating Event...
                      </>
                    ) : (
                      <>
                        <Gamepad2 className="h-4 w-4 mr-2" />
                        Create Game Event
                      </>
                    )}
                  </Button>
                  <Button type="button" variant="outline" onClick={handleCancel} disabled={isSubmitting}>
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </main>
      </div>
    </AdminGuard>
  )
}
