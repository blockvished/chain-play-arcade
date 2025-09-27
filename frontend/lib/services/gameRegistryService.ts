import { ethers } from "ethers"
import { GameHubABI, type GameEvent } from "@/lib/contracts/GameHubABI"
import { CONTRACT_ADDRESSES, RPC_URLS, DEFAULT_CHAIN } from "@/lib/contracts/config"

export class GameRegistryService {
  private contract: ethers.Contract
  private provider: ethers.JsonRpcProvider
  private signer: ethers.Signer | null = null

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
    this.contract = new ethers.Contract(contractAddress, GameHubABI, this.provider)
  }

  /**
   * Set the signer for write operations
   */
  setSigner(signer: ethers.Signer) {
    this.signer = signer
    this.contract = this.contract.connect(signer) as ethers.Contract
  }

  /**
   * Check if wallet is connected
   */
  isWalletConnected(): boolean {
    return this.signer !== null
  }

  /**
   * Get the connected wallet address
   */
  async getWalletAddress(): Promise<string> {
    if (!this.signer) {
      throw new Error("Wallet not connected")
    }
    return await this.signer.getAddress()
  }

  /**
   * Get all games from the GameHub contract
   */
  async getAllGames(): Promise<any[]> {
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
  async getGameDefinition(gameId: bigint): Promise<any> {
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

  /**
   * Create a new game definition
   */
  async createGameDefinition(name: string, image: string, description: string): Promise<string> {
    try {
      // Validate wallet connection
      if (!this.isWalletConnected()) {
        throw new Error("Wallet not connected. Please connect your wallet to create game definitions.")
      }

      // Validate inputs
      if (!name.trim()) {
        throw new Error("Game name is required")
      }
      if (!image.trim()) {
        throw new Error("Game image URL is required")
      }
      if (!description.trim()) {
        throw new Error("Game description is required")
      }

      console.log("📤 Creating game definition:", { name, image, description })
      
      // Get wallet address for logging
      const walletAddress = await this.getWalletAddress()
      console.log("👤 Creating from wallet:", walletAddress)

      // Call the contract function
      const tx = await this.contract.createGameDefinition(name, image, description)
      console.log("📤 Transaction sent:", tx.hash)
      
      // Wait for transaction confirmation
      console.log("⏳ Waiting for transaction confirmation...")
      const receipt = await tx.wait()
      console.log("✅ Transaction confirmed in block:", receipt.blockNumber)
      console.log("✅ Game definition created successfully!")
      
      return tx.hash
    } catch (error) {
      console.error("❌ Error creating game definition:", error)
      
      // Provide more specific error messages
      if (error instanceof Error) {
        if (error.message.includes("user rejected")) {
          throw new Error("Transaction was rejected by user")
        }
        if (error.message.includes("insufficient funds")) {
          throw new Error("Insufficient funds for transaction")
        }
        if (error.message.includes("gas")) {
          throw new Error("Transaction failed due to gas issues")
        }
        if (error.message.includes("network")) {
          throw new Error("Network error. Please check your connection")
        }
        throw error
      }
      
      throw new Error("Failed to create game definition on blockchain")
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

/**
 * Initialize the service with a wallet client from wagmi
 */
export const initializeGameRegistryService = async (walletClient: any, chainId?: number): Promise<GameRegistryService> => {
  console.log("🏗️ Initializing GameRegistryService with wallet client...")
  
  const service = getGameRegistryService(chainId)
  if (walletClient) {
    try {
      // Convert wagmi wallet client to ethers signer for Flow testnet
      const targetChainId = chainId || DEFAULT_CHAIN.id
      console.log("🔗 Creating provider for chain:", targetChainId)
      
      const provider = new ethers.BrowserProvider(walletClient, {
        chainId: targetChainId,
        name: DEFAULT_CHAIN.name
      })
      
      console.log("🔑 Getting signer from provider...")
      const signer = await provider.getSigner()
      
      console.log("⚙️ Setting signer on service...")
      service.setSigner(signer)
      
      console.log("✅ Service initialized successfully")
    } catch (err) {
      console.error("❌ Error during service initialization:", err)
      throw err
    }
  } else {
    console.log("⚠️ No wallet client provided")
  }
  return service
}
