"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { X, Circle, RotateCcw, Wifi, WifiOff } from "lucide-react"
import { gameApiService, boardUtils } from "@/lib/api/gameApi"
import { useRouter, useSearchParams } from "next/navigation"
import { ethers } from "ethers"
import { GameHubABI, type GameEvent } from "@/lib/contracts/GameHubABI"

// Define your ABI
type Player = "X" | "O" | null
type Board = Player[]

interface TicTacToeProps {
  onScoreUpdate: (score: number) => void
  onGameEnd: (won: boolean) => void
  tournamentId?: string
  gameId?: string
}

export function TicTacToe({ onScoreUpdate, onGameEnd, tournamentId, gameId: propGameId }: TicTacToeProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const [board, setBoard] = useState<Board>(Array(16).fill(null))
  const [isPlayerTurn, setIsPlayerTurn] = useState(true)
  const [gameStatus, setGameStatus] = useState<"playing" | "won" | "lost" | "draw">("playing")
  const [score, setScore] = useState(0)
  const [gamesPlayed, setGamesPlayed] = useState(0)
  const [totalMoves, setTotalMoves] = useState(0)
  const [gameId, setGameId] = useState("")
  const [isOnline, setIsOnline] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [gameMessage, setGameMessage] = useState("")
  const [gamePoints, setGamePoints] = useState(0)
  const [gameData, setGameData] = useState<any>(null)

  // Upload turnLog to Walrus
  const uploadTurnLogToWalrus = async (turnLog: any[]) => {
    let walrusCID = null;
    try {
      const publisherUrl = "https://publisher.walrus-testnet.walrus.space/v1/blobs";
      const encoder = new TextEncoder();
      const res = await fetch(publisherUrl, {
        method: "PUT",
        body: encoder.encode(JSON.stringify(turnLog)),
        headers: {
          "Content-Type": "application/octet-stream",
        },
      });

      if (!res.ok) throw new Error(`Upload failed: ${res.status} ${res.statusText}`);

      const result = await res.json();
      walrusCID = result.newlyCreated.blobObject.blobId;

      console.log("Turn log uploaded to Walrus:", walrusCID);
      
      // Upload game state to contract after Walrus upload
      if (walrusCID && gameData && tournamentId) {
        const playerAddress = wallet.address;
        const winner = gameData.winner || "none";
        await uploadGameState(tournamentId, playerAddress, gamePoints, winner, walrusCID);
      }
      
      return walrusCID;
    } catch (err) {
      console.error("Failed to upload turnLog:", err);
      return null;
    }
  };
  // 1. Setup provider + wallet (private key must be admin/owner account)
  const provider = new ethers.JsonRpcProvider("https://testnet.evm.nodes.onflow.org", {
    name: "flow-testnet",
    chainId: 545
  }); 
  const privateKey = process.env.NEXT_PUBLIC_PRIVATE_KEY;
  if (!privateKey) {
    throw new Error("Private key is not defined in environment variables");
  }
  const wallet = new ethers.Wallet(privateKey, provider);
  
  // 2. Connect contract with proper contract address
  const contractAddress = "0x05CaE15c24b3Fcd9374998e6fB59aE893395A6B9"; // GameHub contract address
  const gameHub = new ethers.Contract(contractAddress, GameHubABI, wallet);
  // 3. Upload game state to contract
  async function uploadGameState(gameEventId: string, player: string, score: number, winner: string, cid: string) {
    try {
      // Convert score to uint256 compatible value (handle negative scores)
      const uint256Score = score < 0 ? 0 : Math.abs(score);
      
      const tx = await gameHub.uploadPlayerGameState(
        gameEventId,
        player,
        uint256Score,
        winner,
        cid,
        { gasLimit: 500_000 }  // adjust if needed
      );
      console.log("Tx sent:", tx.hash);
      console.log("Score converted from", score, "to", uint256Score);
  
      const receipt = await tx.wait();
      console.log("Tx confirmed:", receipt, receipt.transactionHash);
    } catch (err) {
      console.error("Error uploading game state:", err);
    }
  }
  // Initialize game with API
  const initializeGame = async () => {
    if (!propGameId) {
      console.error("No gameId provided in URL parameters")
      setIsOnline(false)
      return
    }

    setGameId(propGameId)
    setIsLoading(true)

    try {
      const response = await gameApiService.initializeGame(propGameId, "tic-tac-toe", tournamentId)
      if (response.success) {
        setIsOnline(true)
        console.log("Game initialized successfully:", response.message)
      } else {
        console.error("Failed to initialize game:", response.error)
        setIsOnline(false)
      }
    } catch (error) {
      console.error("Error initializing game:", error)
      setIsOnline(false)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCellClick = async (index: number) => {
    if (board[index] || !isPlayerTurn || gameStatus !== "playing" || isLoading) return

    setIsLoading(true)
    setIsPlayerTurn(false)

    try {
      const { row, col } = boardUtils.indexToCoords(index)
      
      console.log("Sending move to API:", { gameId, row, col })
      const response = await gameApiService.makeMove(gameId, row, col)

      if (response.success && response.game) {
        const gameData = response.game
        
        // Store gameData in state
        setGameData(gameData)
        
        // Update board with API response (2D array converted to 1D for UI)
        const newBoard = boardUtils.board2DTo1D(gameData.board)
        setBoard(newBoard)
        setTotalMoves(gameData.moveCount)

        // Update game message and points from API response
        setGameMessage(gameData.message || "")
        setGamePoints(gameData.points?.totalPoints || 0)

        // Check game status from API
        const pointsToAdd = gameData.points?.totalPoints || 0
        if (gameData.status === "won") {
          setGameStatus("won")
          const newScore = score + pointsToAdd
          setScore(newScore)
          onScoreUpdate(newScore)
          onGameEnd(true)
        } else if (gameData.status === "lost") {
          setGameStatus("lost")
          const newScore = score + pointsToAdd
          setScore(newScore)
          onScoreUpdate(newScore)
          onGameEnd(false)
        } else if (gameData.status === "draw") {
          setGameStatus("draw")
          const newScore = score + pointsToAdd
          setScore(newScore)
          onScoreUpdate(newScore)
        } else {
          // Game is still playing, enable player turn
          setIsPlayerTurn(true)
        }

        console.log("Game response:", {
          status: gameData.status,
          winner: gameData.winner,
          message: gameData.message,
          aiMove: gameData.aiMove,
          points: gameData.points
        })
      } else {
        console.error("API move failed:", response.error)
        // Revert player turn on API failure
        setIsPlayerTurn(true)
      }
    } catch (error) {
      console.error("Error making API move:", error)
      setIsPlayerTurn(true)
    } finally {
      setIsLoading(false)
    }
  }

  // Initialize game when component mounts
  useEffect(() => {
    initializeGame()
  }, [])

  // End game when game status changes
  useEffect(() => {
    if (gameStatus === "won" || gameStatus === "lost" || gameStatus === "draw") {
      gameApiService.endGame(gameId, score)
    }
  }, [gameStatus, gameId, score])

  // Upload turnLog to Walrus when gameData has turnLog
  useEffect(() => {
    if (gameData && gameData.turnLog && Array.isArray(gameData.turnLog)) {
      console.log("GameData with turnLog received, uploading to Walrus...")
      uploadTurnLogToWalrus(gameData.turnLog)
    }
  }, [gameData])

  const resetGame = () => {
    // Generate new game ID
    const newGameId = Date.now().toString() + Math.random().toString(36).substr(2, 9)
    
    // Update URL with new gameId
    const currentParams = new URLSearchParams(searchParams.toString())
    currentParams.set('gameId', newGameId)
    
    // Navigate to new URL with updated gameId
    router.replace(`?${currentParams.toString()}`, { scroll: false })
    
    // Reset game state
    setBoard(Array(16).fill(null))
    setIsPlayerTurn(true)
    setGameStatus("playing")
    setTotalMoves(0)
    setGamesPlayed((prev) => prev + 1)
    setGameMessage("")
    setGamePoints(0)
    setGameData(null)
    setGameId(newGameId)
    
    // Initialize new game
    initializeGameWithId(newGameId)
  }

  // Helper function to initialize game with specific ID
  const initializeGameWithId = async (newGameId: string) => {
    setIsLoading(true)
    setGameId(newGameId)

    try {
      const response = await gameApiService.initializeGame(newGameId, "tic-tac-toe", tournamentId)
      if (response.success) {
        setIsOnline(true)
        console.log("New game initialized successfully:", response.message)
      } else {
        console.error("Failed to initialize new game:", response.error)
        setIsOnline(false)
      }
    } catch (error) {
      console.error("Error initializing new game:", error)
      setIsOnline(false)
    } finally {
      setIsLoading(false)
    }
  }

  const renderCell = (index: number) => {
    const value = board[index]
    return (
      <Button
        key={index}
        variant="outline"
        className="h-20 w-20 text-2xl font-bold bg-card hover:bg-accent border-border"
        onClick={() => handleCellClick(index)}
        disabled={!!value || !isPlayerTurn || gameStatus !== "playing" || isLoading}
      >
        {value === "X" && <X className="h-8 w-8 text-blue-400" />}
        {value === "O" && <Circle className="h-8 w-8 text-red-400" />}
      </Button>
    )
  }

  return (
    <div className="flex flex-col items-center space-y-6">
      {/* Game Status */}
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-4 flex-wrap">
          <Badge variant={gameStatus === "playing" ? "default" : "secondary"}>
            {isLoading && "Loading..."}
            {!isLoading && gameStatus === "playing" && (isPlayerTurn ? "Your Turn" : "AI Thinking...")}
            {gameStatus !== "playing" && gameMessage}
          </Badge>
          <Badge variant="outline">Moves: {totalMoves}</Badge>
          
          {gameStatus !== "playing" && gamePoints !== 0 && (
            <Badge variant={gamePoints > 0 ? "default" : "destructive"}>
              Points: {gamePoints > 0 ? "+" : ""}{gamePoints}
            </Badge>
          )}

        </div>
      </div>

      <div className="grid grid-cols-4 gap-2 p-4 bg-muted/20 rounded-lg">
        {Array.from({ length: 16 }, (_, index) => renderCell(index))}
      </div>

      {gameStatus !== "playing" && (
        <div className="text-center space-y-4">
         
          <Button onClick={resetGame} className="game-glow">
            <RotateCcw className="h-4 w-4 mr-2" />
            Play Again
          </Button>
        </div>
      )}

      
    </div>
  )
}
