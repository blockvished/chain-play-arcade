import { ethers } from "ethers";
import { abi } from "./GameRegistryABI.js";

export function getContract(rpcUrl, contractAddress) {
  const provider = new ethers.JsonRpcProvider(rpcUrl);
  return new ethers.Contract(contractAddress, abi, provider);
}

// Read functions
export async function getOwner(contract) {
  return await contract.owner();
}

export async function nextGameCount(contract) {
  return await contract.nextGameCount();
}

export async function getAllGames(contract) {
  return await contract.getAllGames();
}

export async function getGameDefinition(contract, gameId) {
  return await contract.getGameDefinition(gameId);
}
