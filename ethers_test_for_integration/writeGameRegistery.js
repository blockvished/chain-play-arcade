import { ethers } from "ethers";
import { abi } from "./GameRegistryABI.js";

// Get contract with signer (for write operations)
export function getWriteContract(rpcUrl, contractAddress, privateKey) {
  const provider = new ethers.JsonRpcProvider(rpcUrl);
  const wallet = new ethers.Wallet(privateKey, provider);
  return new ethers.Contract(contractAddress, abi, wallet);
}

// Write functions

// Create new game definition
export async function createGameDefinition(contract, name, image, description) {
  const tx = await contract.createGameDefinition(name, image, description);
  console.log("⏳ Waiting for tx:", tx.hash);
  await tx.wait();
  console.log("✅ Game created!");
  return tx.hash;
}

// Transfer ownership
export async function transferOwnership(contract, newOwner) {
  const tx = await contract.transferOwnership(newOwner);
  console.log("⏳ Waiting for tx:", tx.hash);
  await tx.wait();
  console.log("✅ Ownership transferred!");
  return tx.hash;
}
