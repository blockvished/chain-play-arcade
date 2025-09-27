import { ethers } from "ethers";
import { abi } from "./GameHubABI.js";

// contract with provider (read-only)
export function getReadContract(rpcUrl, contractAddress) {
  const provider = new ethers.JsonRpcProvider(rpcUrl);
  return new ethers.Contract(contractAddress, abi, provider);
}

// -------------------- Read Functions --------------------

// Who is the admin
export async function getAdmin(contract) {
  return await contract.admin();
}

// Owner of contract
export async function getOwner(contract) {
  return await contract.owner();
}

// Get leaderboard size constant
export async function getLeaderboardSize(contract) {
  return await contract.LEADERBOARD_SIZE();
}

// Get total games registered
export async function getAllGames(contract) {
  return await contract.getAllGames();
}

// Get a game definition by ID
export async function getGameDefinition(contract, gameId) {
  return await contract.getGameDefinition(gameId);
}

// Check if game event is active
export async function isActive(contract, gameEventId) {
  return await contract.isActive(gameEventId);
}

// Get event details
export async function getGameEvent(contract, gameEventId) {
  return await contract.gamesEvents(gameEventId);
}
