import { ethers } from "ethers"
import { GameHubABI, type GameEvent } from "@/lib/contracts/GameHubABI"
import { CONTRACT_ADDRESSES, RPC_URLS, DEFAULT_CHAIN } from "@/lib/contracts/config"

export class GameHubService {
  private contract: ethers.Contract
  private provider: ethers.JsonRpcProvider

  constructor(chainId: number = DEFAULT_CHAIN.id) {
    console.log("🏗️ Initializing GameHubService with chainId:", chainId)
    
    const rpcUrl = RPC_URLS[chainId as keyof typeof RPC_URLS]
    if (!rpcUrl) {
      throw new Error(`RPC URL not found for chain ${chainId}`)
    }
    console.log("🌐 RPC URL:", rpcUrl)

    const contractAddress = CONTRACT_ADDRESSES[chainId as keyof typeof CONTRACT_ADDRESSES]?.GameHub
    if (!contractAddress) {
      throw new Error(`GameHub contract address not configured for chain ${chainId}`)
    }
    console.log("📄 Contract address:", contractAddress)

    this.provider = new ethers.JsonRpcProvider(rpcUrl)
    this.contract = new ethers.Contract(contractAddress, GameHubABI, this.provider)
    console.log("✅ GameHubService initialized successfully")
  }

  /**
   * Get the total count of game events
   */
  async getGameEventCount(): Promise<bigint> {
    try {
      console.log("🔗 Calling gameEventCount() on contract:", this.contract.target)
      const count = await this.contract.gameEventCount()
      console.log("🔗 gameEventCount() result:", count.toString())
      return count
    } catch (error) {
      console.error("❌ Error fetching game event count:", error)
      throw new Error("Failed to fetch game event count from blockchain")
    }
  }

  /**
   * Get a specific game event by ID
   */
  async getGameEvent(gameEventId: bigint): Promise<GameEvent> {
    try {
      console.log(`🔗 Calling gamesEvents(${gameEventId}) on contract`)
      const event = await this.contract.gamesEvents(gameEventId)
      console.log(`🔗 gamesEvents(${gameEventId}) result:`, event)
      
      return {
        active: event.active,
        eventName: event.eventName,
        startTime: event.startTime,
        endTime: event.endTime,
        referencedGameId: event.referencedGameId,
        durationMinutes: event.durationMinutes,
        minStakeAmt: event.minStakeAmt,
        pooledAmt: event.pooledAmt,
        scoresFinalized: event.scoresFinalized,
        playersCount: event.playersCount,
        winnersCount: event.winnersCount,
      }
    } catch (error) {
      console.error(`❌ Error fetching game event ${gameEventId}:`, error)
      throw new Error(`Failed to fetch game event ${gameEventId} from blockchain`)
    }
  }

  /**
   * Get all game events by looping through all event IDs
   */
  async getAllGameEvents(): Promise<GameEvent[]> {
    try {
      const count = await this.getGameEventCount()
      const events: GameEvent[] = []

      for (let i = 1; i < Number(count); i++) {
        try {
          const event = await this.getGameEvent(BigInt(i))
          events.push(event)
        } catch (error) {
          console.warn(`Failed to fetch game event ${i}:`, error)
        }
      }

      return events
    } catch (error) {
      console.error("Error fetching all game events:", error)
      throw new Error("Failed to fetch game events from blockchain")
    }
  }
}

let gameHubService: GameHubService | null = null

export const getGameHubService = (chainId?: number): GameHubService => {
  if (!gameHubService) {
    gameHubService = new GameHubService(chainId)
  }
  return gameHubService
}
