"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { AdminGuard } from "@/components/admin-guard"
import { Navigation } from "@/components/navigation"
import { TournamentForm } from "@/components/tournament-form"
import { useTournamentStore } from "@/lib/store"
import type { Tournament } from "@/lib/store"

export default function CreateTournamentPage() {
  const router = useRouter()
  const { tournaments, setTournaments } = useTournamentStore()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (tournamentData: Omit<Tournament, "id" | "currentPlayers">) => {
    setIsSubmitting(true)

    try {
      // Generate a new ID
      const newId = (tournaments.length + 1).toString()

      const newTournament: Tournament = {
        ...tournamentData,
        id: newId,
        currentPlayers: 0,
      }

      // Add to tournaments list
      setTournaments([...tournaments, newTournament])

      // Redirect to admin tournaments page
      router.push("/admin/tournaments")
    } catch (error) {
      console.error("Error creating tournament:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    router.push("/admin/tournaments")
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
            <h1 className="text-3xl font-bold text-foreground mb-2">Create New Tournament</h1>
            <p className="text-muted-foreground">
              Set up a new tournament with custom rules, prize pools, and game settings.
            </p>
          </div>

          {/* Tournament Form */}
          <div className="flex justify-center">
            <TournamentForm onSubmit={handleSubmit} onCancel={handleCancel} />
          </div>
        </main>
      </div>
    </AdminGuard>
  )
}
