"use client"

import { useEffect, useState } from "react"
import { Navigation } from "@/components/navigation"
import { TournamentCard } from "@/components/tournament-card"
import { useTournamentStore } from "@/lib/store"
import { dummyTournaments } from "@/lib/dummy-data"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Search, Filter } from "lucide-react"

export default function TournamentsPage() {
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

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-4">All Tournaments</h1>
          <p className="text-muted-foreground text-pretty">
            Browse and join tournaments across different game types and difficulty levels.
          </p>
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

        {/* Tournament Grid */}
        {filteredTournaments.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTournaments.map((tournament) => (
              <TournamentCard key={tournament.id} tournament={tournament} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-muted-foreground mb-4">No tournaments found matching your criteria.</div>
            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm("")
                setStatusFilter("all")
                setGameTypeFilter("all")
              }}
            >
              Clear Filters
            </Button>
          </div>
        )}
      </main>
    </div>
  )
}
