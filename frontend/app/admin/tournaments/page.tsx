"use client"

import { useEffect, useState } from "react"
import { AdminGuard } from "@/components/admin-guard"
import { Navigation } from "@/components/navigation"
import { TournamentCard } from "@/components/tournament-card"
import { useTournamentStore } from "@/lib/store"
import { dummyTournaments } from "@/lib/dummy-data"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, Filter, Plus, Settings, Play, Pause, Square } from "lucide-react"
import Link from "next/link"

export default function AdminTournamentsPage() {
  const { tournaments, setTournaments } = useTournamentStore()
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [gameTypeFilter, setGameTypeFilter] = useState<string>("all")

  useEffect(() => {
    setTournaments(dummyTournaments)
  }, [setTournaments])

  const filteredTournaments = tournaments.filter((tournament) => {
    const matchesSearch = tournament.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || tournament.status === statusFilter
    const matchesGameType = gameTypeFilter === "all" || tournament.gameType === gameTypeFilter
    return matchesSearch && matchesStatus && matchesGameType
  })

  const statusCounts = {
    all: tournaments.length,
    active: tournaments.filter((t) => t.status === "active").length,
    upcoming: tournaments.filter((t) => t.status === "upcoming").length,
    ended: tournaments.filter((t) => t.status === "ended").length,
  }

  const handleTournamentAction = (tournamentId: string, action: "start" | "pause" | "end") => {
    console.log(`${action} tournament ${tournamentId}`)
    // Here you would implement the actual tournament management logic
  }

  return (
    <AdminGuard>
      <div className="min-h-screen bg-background">
        <Navigation />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Tournament Management</h1>
              <p className="text-muted-foreground">Create, edit, and manage all tournaments on the platform.</p>
            </div>
            <Link href="/admin/tournaments/create">
              <Button className="game-glow">
                <Plus className="h-4 w-4 mr-2" />
                Create Tournament
              </Button>
            </Link>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card className="bg-card/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Tournaments</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{tournaments.length}</div>
              </CardContent>
            </Card>
            <Card className="bg-card/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Active Now</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-400">{statusCounts.active}</div>
              </CardContent>
            </Card>
            <Card className="bg-card/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Upcoming</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-400">{statusCounts.upcoming}</div>
              </CardContent>
            </Card>
            <Card className="bg-card/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Players</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-400">
                  {tournaments.reduce((sum, t) => sum + t.currentPlayers, 0)}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search tournaments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status ({statusCounts.all})</SelectItem>
                <SelectItem value="active">Active ({statusCounts.active})</SelectItem>
                <SelectItem value="upcoming">Upcoming ({statusCounts.upcoming})</SelectItem>
                <SelectItem value="ended">Ended ({statusCounts.ended})</SelectItem>
              </SelectContent>
            </Select>

            <Select value={gameTypeFilter} onValueChange={setGameTypeFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by game" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Games</SelectItem>
                <SelectItem value="tic-tac-toe">Tic-Tac-Toe</SelectItem>
                <SelectItem value="simon-says">Simon Says</SelectItem>
                <SelectItem value="memory-match">Memory Match</SelectItem>
                <SelectItem value="number-guess">Number Guess</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Status Badges */}
          <div className="flex flex-wrap gap-2 mb-6">
            <Badge
              variant={statusFilter === "all" ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => setStatusFilter("all")}
            >
              All ({statusCounts.all})
            </Badge>
            <Badge
              variant={statusFilter === "active" ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => setStatusFilter("active")}
            >
              Active ({statusCounts.active})
            </Badge>
            <Badge
              variant={statusFilter === "upcoming" ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => setStatusFilter("upcoming")}
            >
              Upcoming ({statusCounts.upcoming})
            </Badge>
            <Badge
              variant={statusFilter === "ended" ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => setStatusFilter("ended")}
            >
              Ended ({statusCounts.ended})
            </Badge>
          </div>

          {/* Tournament Grid with Admin Actions */}
          {filteredTournaments.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTournaments.map((tournament) => (
                <div key={tournament.id} className="relative">
                  <TournamentCard tournament={tournament} />

                  {/* Admin Action Overlay */}
                  <div className="absolute top-2 right-2 flex gap-1">
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-8 w-8 p-0 bg-background/80 backdrop-blur-sm"
                      onClick={() => console.log(`Edit tournament ${tournament.id}`)}
                    >
                      <Settings className="h-3 w-3" />
                    </Button>

                    {tournament.status === "upcoming" && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-8 w-8 p-0 bg-background/80 backdrop-blur-sm"
                        onClick={() => handleTournamentAction(tournament.id, "start")}
                      >
                        <Play className="h-3 w-3" />
                      </Button>
                    )}

                    {tournament.status === "active" && (
                      <>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 w-8 p-0 bg-background/80 backdrop-blur-sm"
                          onClick={() => handleTournamentAction(tournament.id, "pause")}
                        >
                          <Pause className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 w-8 p-0 bg-background/80 backdrop-blur-sm"
                          onClick={() => handleTournamentAction(tournament.id, "end")}
                        >
                          <Square className="h-3 w-3" />
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-muted-foreground mb-4">No tournaments found matching your criteria.</div>
              <div className="flex gap-3 justify-center">
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchTerm("")
                    setStatusFilter("all")
                    setGameTypeFilter("all")
                  }}
                  className="bg-transparent"
                >
                  Clear Filters
                </Button>
                <Link href="/admin/tournaments/create">
                  <Button className="game-glow">Create Tournament</Button>
                </Link>
              </div>
            </div>
          )}
        </main>
      </div>
    </AdminGuard>
  )
}
