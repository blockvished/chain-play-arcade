"use client"

import { useState, useCallback } from "react"
import { gameApiService, boardUtils } from "@/lib/api/gameApi"
import { GameMoveRequest, GameMoveResponse, GameInitResponse } from "@/lib/api/types"

export interface UseGameApiState {
  isLoading: boolean
  error: string | null
  isConnected: boolean
}

export interface UseGameApiActions {
  initializeGame: (gameId: string, gameType: string, tournamentId?: string) => Promise<GameInitResponse>
  makeMove: (gameId: string, row: number, col: number) => Promise<GameMoveResponse>
  getGameStatus: (gameId: string) => Promise<GameMoveResponse>
  endGame: (gameId: string, finalScore: number) => Promise<{ success: boolean; message?: string; error?: string }>
  clearError: () => void
}

export const useGameApi = (): UseGameApiState & UseGameApiActions => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isConnected, setIsConnected] = useState(false)

  const handleApiCall = useCallback(async <T>(
    apiCall: () => Promise<T>,
    setLoading: boolean = true
  ): Promise<T> => {
    if (setLoading) setIsLoading(true)
    setError(null)

    try {
      const result = await apiCall()
      setIsConnected(true)
      return result
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred"
      setError(errorMessage)
      setIsConnected(false)
      throw err
    } finally {
      if (setLoading) setIsLoading(false)
    }
  }, [])

  const initializeGame = useCallback(async (
    gameId: string, 
    gameType: string, 
    tournamentId?: string
  ): Promise<GameInitResponse> => {
    return handleApiCall(() => gameApiService.initializeGame(gameId, gameType, tournamentId))
  }, [handleApiCall])

  const makeMove = useCallback(async (gameId: string, row: number, col: number): Promise<GameMoveResponse> => {
    return handleApiCall(() => gameApiService.makeMove(gameId, row, col))
  }, [handleApiCall])

  const getGameStatus = useCallback(async (gameId: string): Promise<GameMoveResponse> => {
    return handleApiCall(() => gameApiService.getGameStatus(gameId))
  }, [handleApiCall])

  const endGame = useCallback(async (
    gameId: string, 
    finalScore: number
  ): Promise<{ success: boolean; message?: string; error?: string }> => {
    return handleApiCall(() => gameApiService.endGame(gameId, finalScore))
  }, [handleApiCall])

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  return {
    // State
    isLoading,
    error,
    isConnected,
    
    // Actions
    initializeGame,
    makeMove,
    getGameStatus,
    endGame,
    clearError,
  }
}

// Export utility functions for the hook
export { boardUtils }
