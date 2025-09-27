"use client"

import { useEffect, useState } from "react"
import { useTournamentStore } from "@/lib/store"
import { getGameHubService } from "@/lib/services/gameHubService"
import type { GameEvent } from "@/lib/contracts/GameHubABI"
import type { GameEventTournament } from "@/lib/store"

// Utility function to convert GameEvent to GameEventTournament
const convertToGameEventTournament = (gameEvent: GameEvent, index: number): GameEventTournament => {
  // Convert wei to ETH

  const weiToEth = (wei: bigint) => {
    return (Number(wei) / 1e18).toFixed(4)
  }

  // Convert timestamp to Date
  const timestampToDate = (timestamp: bigint) => {
    return new Date(Number(timestamp) * 1000)
  }

  // Determine status based on current time and event times
  const now = Date.now()
  const startTime = timestampToDate(gameEvent.startTime)
  const endTime = timestampToDate(gameEvent.endTime)
  
  let status: "upcoming" | "active" | "ended"
  if (now < startTime.getTime()) {
    status = "upcoming"
  } else if (now > endTime.getTime()) {
    status = "ended"
  } else {
    status = "active"
  }

  return {
    id: index.toString(),
    active: gameEvent.active,
    eventName: gameEvent.eventName,
    startTime,
    endTime,
    eventId: gameEvent.eventId,
    referencedGameId: gameEvent.referencedGameId.toString(),
    durationMinutes: Number(gameEvent.durationMinutes),
    minStakeAmt: weiToEth(gameEvent.minStakeAmt),
    pooledAmt: weiToEth(gameEvent.pooledAmt),
    scoresFinalized: gameEvent.scoresFinalized,
    playersCount: Number(gameEvent.playersCount),
    winnersCount: Number(gameEvent.winnersCount),
    joined: gameEvent.joined,
  }
}

export const useGameEvents = (playerAddr?: string) => {
  const { setGameEvents, setLoading, setError, isLoading, error } = useTournamentStore()
  const [isInitialized, setIsInitialized] = useState(false)

  const fetchGameEvents = async () => {
    try {
      setLoading(true)
      setError(null)

      console.log("🔄 Fetching game events from GameHub...")
      
      const gameHubService = getGameHubService()
      
      console.log("📊 Getting game event count...")
      const count = await gameHubService.getGameEventCount()
      console.log("📊 Game event count:", count.toString())
      
      if (Number(count) === 0) {
        console.log("⚠️ No game events found")
        setGameEvents([])
        setIsInitialized(true)
        return
      }

      const gameEvents = await gameHubService.getAllGameEvents(playerAddr)
      console.log("📊 Raw game events:", gameEvents)

      // Convert GameEvents to GameEventTournaments
      const gameEventTournaments = gameEvents.map((gameEvent, index) =>
        convertToGameEventTournament(gameEvent, index)
      )

      console.log("📊 Converted tournaments:", gameEventTournaments)
      setGameEvents(gameEventTournaments)
      setIsInitialized(true)
      
      // Clear any previous errors on successful fetch
      if (error) {
        setError(null)
      }
    } catch (err) {
      console.error("❌ Failed to fetch game events:", err)
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch game events from blockchain"
      setError(errorMessage)
      setIsInitialized(false)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!isInitialized) {
      fetchGameEvents()
    }
  }, [isInitialized, playerAddr])

  const refetch = () => {
    setIsInitialized(false)
  }

  return {
    fetchGameEvents,
    refetch,
    isLoading,
    error,
  }
}
