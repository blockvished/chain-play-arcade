"use client"

import { useEffect } from "react"
import { Navigation } from "@/components/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { dummyTournaments } from "@/lib/dummy-data"
import { Gamepad2, Trophy, Clock } from "lucide-react"
import Link from "next/link"
import { useTournamentStore } from "@/lib/store"

export default function Dashboard() {
  const { tournaments, setTournaments } = useTournamentStore()

  useEffect(() => {
    // Load dummy data
    setTournaments(dummyTournaments)
  }, [setTournaments])

  
  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4 text-balance">Welcome to ChainPlay Arcade</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">
            Stake, play, and win in fair AI-driven mini-games. Real-time leaderboards, automatic payouts, and
            transparent gameplay.
          </p>
        </div>


        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-gradient-to-br from-green-500/10 to-green-600/5 border-green-500/20">
            <CardHeader>
              <CardTitle className="flex items-center text-green-400">
                <Gamepad2 className="h-5 w-5 mr-2" />
                Play Now
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Join active tournaments and start earning rewards immediately.
              </p>
              <Link href="/tournaments">
                <Button className="w-full bg-green-600 hover:bg-green-700">Browse Tournaments</Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-yellow-500/10 to-yellow-600/5 border-yellow-500/20">
            <CardHeader>
              <CardTitle className="flex items-center text-yellow-400">
                <Trophy className="h-5 w-5 mr-2" />
                Leaderboard
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Check your ranking and see top players across all tournaments.
              </p>
              <Link href="/leaderboard">
                <Button variant="outline" className="w-full border-yellow-500/30 hover:bg-yellow-500/10 bg-transparent">
                  View Rankings
                </Button>
              </Link>
            </CardContent>
          </Card>

        </div>

       
      </main>
    </div>
  )
}
