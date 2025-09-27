import { ethers } from "ethers"
import { GameHubABI, type GameEvent } from "@/lib/contracts/GameHubABI"
import { GameRegistryABI, type GameDefinition } from "@/lib/contracts/GameRegistryABI"
import { CONTRACT_ADDRESSES, RPC_URLS, DEFAULT_CHAIN } from "@/lib/contracts/config"

export class GameRegistryService {
  private contract: ethers.Contract
  private gameRegistryContract: ethers.Contract
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
    this.gameRegistryContract = new ethers.Contract(contractAddress, GameRegistryABI, this.provider)
  }

  setSigner(signer: ethers.Signer) {
    this.signer = signer
    this.contract = this.contract.connect(signer) as ethers.Contract
    this.gameRegistryContract = this.gameRegistryContract.connect(signer) as ethers.Contract
  }

  isWalletConnected(): boolean {
    return this.signer !== null
  }

  async getWalletAddress(): Promise<string> {
    if (!this.signer) {
      throw new Error("Wallet not connected")
    }
    return await this.signer.getAddress()
  }

  // Add debugging methods
  async debugContractState(): Promise<any> {
    try {
      console.log("🔍 Debugging contract state...")
      
      // Check if contract is deployed
      const code = await this.provider.getCode(this.contract.target as string)
      console.log("📜 Contract code length:", code.length)
      
      if (code === "0x") {
        throw new Error("Contract not deployed at this address")
      }

      const results = {
        deployed: true,
        codeLength: code.length,
        availableFunctions: [] as string[],
        owner: null,
        nextGameCount: null,
        hasOwner: false,
        hasNextGameCount: false
      }

      // Check what functions are available by testing them
      console.log("🔍 Testing available contract functions...")

      // Test for owner function
      try {
        const owner = await this.contract.owner()
        console.log("👤 Contract owner:", owner)
        results.owner = owner
        results.hasOwner = true
        results.availableFunctions.push("owner()")
      } catch (err) {
        console.warn("⚠️ No owner() function available")
        results.hasOwner = false
      }

      // Test for nextGameCount function
      try {
        const nextGameCount = await this.contract.nextGameCount()
        console.log("🎯 Next game count:", nextGameCount.toString())
        results.nextGameCount = nextGameCount.toString()
        results.hasNextGameCount = true
        results.availableFunctions.push("nextGameCount()")
      } catch (err) {
        console.warn("⚠️ Could not get next game count:", err)
        results.hasNextGameCount = false
      }

      // Test other common functions
      const functionsToTest = [
        "getAllGames",
        "getGameDefinition",
        "createGameDefinition"
      ]

      for (const funcName of functionsToTest) {
        try {
          // Just check if the function exists (don't call it)
          if (this.contract[funcName]) {
            results.availableFunctions.push(`${funcName}()`)
            console.log(`✅ Function available: ${funcName}`)
          }
        } catch (err) {
          console.warn(`⚠️ Function not available: ${funcName}`)
        }
      }

      console.log("📋 Available functions:", results.availableFunctions)
      return results
    } catch (error) {
      console.error("❌ Contract debug failed:", error)
      throw error
    }
  }

  async checkPermissions(): Promise<boolean> {
    try {
      if (!this.signer) {
        console.log("❌ No signer available")
        return false
      }

      const walletAddress = await this.getWalletAddress()
      console.log("🔑 Wallet address:", walletAddress)

      try {
        const owner = await this.contract.owner()
        console.log("👤 Contract owner:", owner)
        const isOwner = walletAddress.toLowerCase() === owner.toLowerCase()
        console.log("🔐 Is wallet owner?", isOwner)
        
        if (!isOwner) {
          console.log("🚨 OWNERSHIP ISSUE FOUND:")
          console.log(`   Contract Owner: ${owner}`)
          console.log(`   Your Wallet:    ${walletAddress}`)
          console.log("   You need to be the contract owner to create game definitions!")
        }
        
        return isOwner
      } catch (err) {
        console.error("⚠️ Could not check owner permissions:", err)
        return false
      }
    } catch (error) {
      console.error("❌ Permission check failed:", error)
      return false
    }
  }

  async estimateCreateGameGas(name: string, image: string, description: string): Promise<bigint> {
    try {
      console.log("⛽ Estimating gas for createGameDefinition...")
      
      if (!this.signer) {
        throw new Error("Wallet not connected")
      }

      const gasEstimate = await this.contract.createGameDefinition.estimateGas(
        name, 
        image, 
        description
      )
      
      console.log("⛽ Gas estimate:", gasEstimate.toString())
      return gasEstimate
    } catch (error) {
      console.error("❌ Gas estimation failed:", error)
      throw error
    }
  }

  async createGameDefinition(name: string, image: string, description: string): Promise<string> {
    try {
      // Enhanced validation
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

      console.log("🔍 Starting enhanced debugging...")
      
      // Debug contract state
      await this.debugContractState()
      
      // Check permissions
      const hasPermission = await this.checkPermissions()
      console.log("🔐 Has permission:", hasPermission)
      
      // Get wallet info
      const walletAddress = await this.getWalletAddress()
      console.log("👤 Creating from wallet:", walletAddress)

      // Check wallet balance
      const balance = await this.provider.getBalance(walletAddress)
      console.log("💰 Wallet balance:", ethers.formatEther(balance), "FLOW")

      if (balance === BigInt(0)) {
        throw new Error("Insufficient balance. You need FLOW tokens to pay for gas.")
      }

      console.log("📤 Creating game definition:", { name, image, description })

      // Try gas estimation first
      try {
        await this.estimateCreateGameGas(name, image, description)
      } catch (gasError) {
        console.error("⛽ Gas estimation failed:", gasError)
        throw new Error(`Transaction will fail: ${gasError instanceof Error ? gasError.message : 'Gas estimation failed'}`)
      }

      // Call the contract function with explicit gas settings
      const tx = await this.contract.createGameDefinition(name, image, description, {
        gasLimit: 500000, // Set a reasonable gas limit
      })
      
      console.log("📤 Transaction sent:", tx.hash)
      
      // Wait for transaction confirmation
      console.log("⏳ Waiting for transaction confirmation...")
      const receipt = await tx.wait()
      console.log("✅ Transaction confirmed in block:", receipt.blockNumber)
      console.log("✅ Game definition created successfully!")
      
      return tx.hash
    } catch (error) {
      console.error("❌ Error creating game definition:", error)
      
      // Enhanced error handling
      if (error instanceof Error) {
        if (error.message.includes("user rejected")) {
          throw new Error("Transaction was rejected by user")
        }
        if (error.message.includes("insufficient funds")) {
          throw new Error("Insufficient funds for transaction")
        }
        if (error.message.includes("gas")) {
          throw new Error("Transaction failed due to gas issues. The contract may have reverted.")
        }
        if (error.message.includes("network")) {
          throw new Error("Network error. Please check your connection")
        }
        if (error.message.includes("missing revert data")) {
          throw new Error("Contract execution failed. Check if you have permission to create games or if the contract is properly deployed.")
        }
        if (error.message.includes("CALL_EXCEPTION")) {
          throw new Error("Contract call failed. This usually means the function reverted or you don't have the required permissions.")
        }
        throw error
      }
      
      throw new Error("Failed to create game definition on blockchain")
    }
  }

  /**
   * Create a new game event
   */
  async createGameEvent(
    gameId: number,
    eventName: string,
    durationMinutes: number,
    minStakeAmt: string,
    winnersCount: number,
    activate: boolean
  ): Promise<string> {
    try {
      // Validate wallet connection
      if (!this.isWalletConnected()) {
        throw new Error("Wallet not connected. Please connect your wallet to create game events.")
      }

      // Validate inputs
      if (!eventName.trim()) {
        throw new Error("Event name is required")
      }
      if (durationMinutes <= 0) {
        throw new Error("Duration must be greater than 0")
      }
      if (!minStakeAmt || parseFloat(minStakeAmt) <= 0) {
        throw new Error("Minimum stake amount must be greater than 0")
      }
      if (winnersCount !== 1 && winnersCount !== 3) {
        throw new Error("Winners count must be 1 or 3")
      }

      console.log("📤 Creating game event:", { gameId, eventName, durationMinutes, minStakeAmt, winnersCount, activate })
      
      // Get wallet address for logging
      const walletAddress = await this.getWalletAddress()
      console.log("👤 Creating from wallet:", walletAddress)

      // Convert minStakeAmt to wei
      const minStakeWei = ethers.parseEther(minStakeAmt)

      // Call the contract function
      const tx = await this.contract.createGameEvent(
        gameId,
        eventName,
        durationMinutes,
        minStakeWei,
        winnersCount,
        activate
      )
      console.log("📤 Transaction sent:", tx.hash)
      
      // Wait for transaction confirmation
      console.log("⏳ Waiting for transaction confirmation...")
      const receipt = await tx.wait()
      console.log("✅ Transaction confirmed in block:", receipt.blockNumber)
      console.log("✅ Game event created successfully!")
      
      return tx.hash
    } catch (error) {
      console.error("❌ Error creating game event:", error)
      
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
      
      throw new Error("Failed to create game event on blockchain")
    }
  }

  // Existing methods remain the same
  async getAllGames(): Promise<any[]> {
    try {
      const games = await this.gameRegistryContract.getAllGames()
      
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

  async getNextGameCount(): Promise<bigint> {
    try {
      return await this.contract.nextGameCount()
    } catch (error) {
      console.error("Error fetching next game count:", error)
      throw new Error("Failed to fetch game count from blockchain")
    }
  }

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

export const initializeGameRegistryService = async (walletClient: any, chainId?: number): Promise<GameRegistryService> => {
  console.log("🏗️ Initializing GameRegistryService with wallet client...")
  
  const service = getGameRegistryService(chainId)
  if (walletClient) {
    try {
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
      
      // Run initial debugging
      try {
        await service.debugContractState()
      } catch (debugError) {
        console.warn("⚠️ Initial debug check failed:", debugError)
      }
      
    } catch (err) {
      console.error("❌ Error during service initialization:", err)
      throw err
    }
  } else {
    console.log("⚠️ No wallet client provided")
  }
  return service
}