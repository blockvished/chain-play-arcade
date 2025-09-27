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
  async getGameEvent(gameEventId: bigint, playerAddr?: string): Promise<GameEvent> {
    try {
      const event = await this.contract.gamesEvents(gameEventId)
      
      let joined = false
      if (playerAddr) {
        try {
          joined = await this.joined(Number(gameEventId), playerAddr)
        } catch (error) {
          console.warn(`Failed to fetch joined status for player ${playerAddr}:`, error)
          joined = false
        }
      } else {
        console.log(`🔍 No player address provided, joined status will be false`)
      }
      
      return {
        active: event.active,
        eventName: event.eventName,
        startTime: event.startTime,
        endTime: event.endTime,
        eventId: event.eventId,
        referencedGameId: event.referencedGameId,
        durationMinutes: event.durationMinutes,
        minStakeAmt: event.minStakeAmt,
        pooledAmt: event.pooledAmt,
        scoresFinalized: event.scoresFinalized,
        playersCount: event.playersCount,
        winnersCount: event.winnersCount,
        joined,
      }
    } catch (error) {
      console.error(`❌ Error fetching game event ${gameEventId}:`, error)
      throw new Error(`Failed to fetch game event ${gameEventId} from blockchain`)
    }
  }

  /**
   * Get all game events by looping through all event IDs
   */
  async getAllGameEvents(playerAddr?: string): Promise<GameEvent[]> {
    try {
      const count = await this.getGameEventCount()
      const events: GameEvent[] = []

      for (let i = 1; i < Number(count); i++) {
        try {
          console.log(`🔄 Fetching game event ${i}...`)
          const event = await this.getGameEvent(BigInt(i), playerAddr);
          const eventWithId = { ...event, eventId: i };
          events.push(eventWithId);
          console.log(`✅ Game event ${i} fetched with joined status:`, eventWithId.joined, playerAddr);
        } catch (error) {
          console.warn(`Failed to fetch game event ${i}:`, error);
        }
      }

      console.log(`📊 Total events fetched: ${events.length}`)
      return events
    } catch (error) {
      console.error("Error fetching all game events:", error)
      throw new Error("Failed to fetch game events from blockchain")
    }
  }

  /**
   * Check if a player has joined a specific game event
   */
  async joined(gameEventId: number, playerAddr: string): Promise<boolean> {
    try {
      
      const joined = await (this.contract as any).joined(gameEventId, playerAddr)
      
      return joined
    } catch (error) {
      throw new Error(`Failed to check joined status: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  /**
   * Join a game event by paying the stake amount
   */
  async joinGame(gameEventId: bigint, stakeAmt: bigint, signer: ethers.Signer): Promise<string> {
    try {
      
      const contractWithSigner = this.contract.connect(signer)
      
      const tx = await (contractWithSigner as any).joinGame(gameEventId, { value: stakeAmt })
      
      const receipt = await tx.wait()
      console.log("✅ Successfully joined game! Receipt:", receipt)
      
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      return tx.hash
    } catch (error) {
      console.error(`❌ Error joining game event ${gameEventId}:`, error)
      throw new Error(`Failed to join game event: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  /**
   * Refresh the joined status for a specific game event and player
   */
  async refreshJoinedStatus(gameEventId: number, playerAddr: string): Promise<boolean> {
    try {
      console.log(`🔄 Refreshing joined status for game event ${gameEventId} and player ${playerAddr}`)
      const joined = await this.joined(gameEventId, playerAddr)
      console.log(`🔄 Refreshed joined status:`, joined)
      return joined
    } catch (error) {
      console.error(`❌ Error refreshing joined status:`, error)
      return false
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
