"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import type { Tournament, GameEventTournament } from "@/lib/store"
import { Clock, Users, Trophy, Coins } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useAccount, useWalletClient } from "wagmi"
import { ethers } from "ethers"
import { getGameHubService } from "@/lib/services/gameHubService"
import { useTournamentStore } from "@/lib/store"

interface TournamentCardProps {
  tournament: Tournament | GameEventTournament
  onTournamentJoined?: () => void
}

export function TournamentCard({ tournament, onTournamentJoined }: TournamentCardProps) {
  const [isJoining, setIsJoining] = useState(false)
  const { address, isConnected } = useAccount()
  const { data: walletClient } = useWalletClient()
  const { joinTournament, updateJoinedStatus } = useTournamentStore()
  const router = useRouter()

  const getStatusColor = (status: "upcoming" | "active" | "ended") => {
    switch (status) {
      case "active":
        return "bg-green-500/20 text-green-400 border-green-500/30"
      case "upcoming":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30"
      case "ended":
        return "bg-gray-500/20 text-gray-400 border-gray-500/30"
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30"
    }
  }

  const handleJoinTournament = async () => {
    if (!isConnected || !walletClient) {
      alert("Please connect your wallet first")
      return
    }

    if (!('eventId' in tournament)) {
      alert("This tournament type is not supported for blockchain joining yet")
      return
    }

    if ('joined' in tournament && tournament.joined) {
      // router.push(`/tournaments/${tournament.eventId}`)
      const gameId = Date.now().toString() + Math.random().toString(36).substr(2, 9);
      router.push(`/game/tic-tac-toe?tournament=${tournament.eventId}&gameId=${gameId}`)
      return
    }

    setIsJoining(true)
    try {
      const gameHubService = getGameHubService()
      const stakeAmt = ethers.parseEther(tournament.minStakeAmt)
      
      console.log(`Joining game event ${tournament.eventId} with stake ${tournament.minStakeAmt} ETH`)
      
      const provider = new ethers.BrowserProvider(walletClient)
      const signer = await provider.getSigner()
      
      const txHash = await gameHubService.joinGame(
        BigInt(tournament.eventId),
        stakeAmt,
        signer
      )
      
      console.log("Transaction successful:", txHash)
      
      try {
        const gameHubService = getGameHubService()
        const refreshedJoinedStatus = await gameHubService.refreshJoinedStatus(
          tournament.eventId,
          address!
        )
        
        if (refreshedJoinedStatus) {
          updateJoinedStatus(tournament.eventId.toString(), true)
          console.log("✅ Successfully joined tournament!")
        } else {
          console.warn("⚠️ Joined status still false after transaction, may need more time to propagate")
          updateJoinedStatus(tournament.eventId.toString(), true)
        }
      } catch (error) {
        console.error("Error refreshing joined status:", error)
        joinTournament(tournament.eventId.toString())
      }
      
      if (onTournamentJoined) {
        onTournamentJoined()
      }
    } catch (error) {
      console.error("Error joining tournament:", error)
      alert(`Failed to join tournament: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setIsJoining(false)
    }
  }


  const getEventStatus = () => {
    const now = Date.now()
    const startTime = tournament.startTime.getTime()
    const endTime = tournament.endTime.getTime()
    
    if (now < startTime) return "upcoming"
    if (now > endTime) return "ended"
    return "active"
  }

  const getTimeRemaining = () => {
    const now = Date.now()
    const startTime = tournament.startTime.getTime()
    const endTime = tournament.endTime.getTime()
    
    if (now < startTime) {
      const diff = startTime - now
      const hours = Math.floor(diff / (1000 * 60 * 60))
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
      return `Starts in ${hours}h ${minutes}m`
    }
    
    if (now > endTime) {
      return "Ended"
    }
    
    const diff = endTime - now
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    return `${hours}h ${minutes}m left`
  }

  const playerProgress = 'maxPlayers' in tournament && tournament.maxPlayers 
    ? (tournament.currentPlayers / tournament.maxPlayers) * 100 
    : 0

  return (
    <Card className="tournament-card hover:border-primary/50 transition-all duration-200">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg font-semibold text-balance">
              {'eventName' in tournament ? tournament.eventName : tournament.name}
            </CardTitle>
            <div className="flex items-center gap-2 mt-2">
              <Badge className={getStatusColor(getEventStatus())} variant="outline">
                {getEventStatus()}
              </Badge>
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-center text-sm text-muted-foreground">
              <Trophy className="h-4 w-4 mr-1" />
              {'pooledAmt' in tournament ? tournament.pooledAmt : tournament.prizePool} ETH
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center text-muted-foreground">
            <Coins className="h-4 w-4 mr-2" />
            Entry: {'minStakeAmt' in tournament ? tournament.minStakeAmt : tournament.entryFee} ETH
          </div>
          <div className="flex items-center text-muted-foreground">
            <Clock className="h-4 w-4 mr-2" />
            {getTimeRemaining()}
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center text-muted-foreground">
              <Users className="h-4 w-4 mr-2" />
              Players
            </span>
            <span className="text-foreground">
              {'playersCount' in tournament ? tournament.playersCount : tournament.currentPlayers}
            </span>
          </div>
          {'maxPlayers' in tournament && tournament.maxPlayers && (
            <Progress value={playerProgress} className="h-2" />
          )}
        </div>
        <div className="flex gap-2 pt-2">
          {getEventStatus() === "active" && (!('maxPlayers' in tournament) || ('currentPlayers' in tournament ? tournament.currentPlayers : 0) < tournament.maxPlayers) && (
            <Button 
              className="flex-1 game-glow" 
              onClick={handleJoinTournament}
              disabled={isJoining}
            >
              {isJoining ? "Joining..." : ('joined' in tournament && tournament.joined ? "Play" : "Join Tournament")}
            </Button>
          )}
          {getEventStatus() === "upcoming" && (
            <Button variant="secondary" className="flex-1">
              Register
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
