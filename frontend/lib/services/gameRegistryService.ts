import { ethers } from "ethers"
import { GameRegistryABI, type GameDefinition } from "@/lib/contracts/GameRegistryABI"
import { CONTRACT_ADDRESSES, RPC_URLS, DEFAULT_CHAIN } from "@/lib/contracts/config"

export class GameRegistryService {
  private contract: ethers.Contract
  private provider: ethers.JsonRpcProvider

  constructor(chainId: number = DEFAULT_CHAIN.id) {
    const rpcUrl = RPC_URLS[chainId as keyof typeof RPC_URLS]
    if (!rpcUrl) {
      throw new Error(`RPC URL not found for chain ${chainId}`)
    }

    const contractAddress = CONTRACT_ADDRESSES[chainId as keyof typeof CONTRACT_ADDRESSES]?.GameHub
    if (!contractAddress) {
      throw new Error(`GameHub contract address not configured for chain ${chainId}`)
    }

    this.provider = new ethers.JsonRpcProvider(rpcUrl)
    this.contract = new ethers.Contract(contractAddress, GameRegistryABI, this.provider)
  }

  /**
   * Get all games from the GameRegistry contract
   */
  async getAllGames(): Promise<GameDefinition[]> {
    try {
      const games = await this.contract.getAllGames()
      
      if (!games || games.length === 0) {
        console.warn("No games found in contract")
        return []
      }

      return games.map((game: any) => ({
        id: game.id,
        name: game.name || "Unnamed Game",
        image: game.image || "/placeholder.jpg",
        description: game.description || "No description available",
      }))
    } catch (error) {
      console.error("Error fetching games from contract:", error)
      
      // Provide more specific error messages
      if (error instanceof Error) {
        if (error.message.includes("network")) {
          throw new Error("Network error: Unable to connect to blockchain")
        }
        if (error.message.includes("contract")) {
          throw new Error("Contract error: Invalid contract address or ABI")
        }
        if (error.message.includes("gas")) {
          throw new Error("Transaction error: Insufficient gas or network congestion")
        }
      }
      
      throw new Error("Failed to fetch games from blockchain")
    }
  }

  /**
   * Get a specific game definition by ID
   */
  async getGameDefinition(gameId: bigint): Promise<GameDefinition> {
    try {
      const game = await this.contract.getGameDefinition(gameId)
      return {
        id: game.id,
        name: game.name,
        image: game.image,
        description: game.description,
      }
    } catch (error) {
      console.error(`Error fetching game ${gameId} from contract:`, error)
      throw new Error(`Failed to fetch game ${gameId} from blockchain`)
    }
  }

  /**
   * Get the next game count
   */
  async getNextGameCount(): Promise<bigint> {
    try {
      return await this.contract.nextGameCount()
    } catch (error) {
      console.error("Error fetching next game count:", error)
      throw new Error("Failed to fetch game count from blockchain")
    }
  }

  /**
   * Get the contract owner
   */
  async getOwner(): Promise<string> {
    try {
      return await this.contract.owner()
    } catch (error) {
      console.error("Error fetching contract owner:", error)
      throw new Error("Failed to fetch contract owner from blockchain")
    }
  }
}

// Singleton instance
let gameRegistryService: GameRegistryService | null = null

export const getGameRegistryService = (chainId?: number): GameRegistryService => {
  if (!gameRegistryService) {
    gameRegistryService = new GameRegistryService(chainId)
  }
  return gameRegistryService
}
