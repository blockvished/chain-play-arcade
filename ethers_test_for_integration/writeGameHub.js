import { ethers } from "ethers";
import { abi } from "./gameHubABI.js";

// contract with signer (write access)
export function getWriteContract(rpcUrl, contractAddress, privateKey) {
  const provider = new ethers.JsonRpcProvider(rpcUrl);
  const wallet = new ethers.Wallet(privateKey, provider);
  return new ethers.Contract(contractAddress, abi, wallet);
}

// -------------------- Write Functions --------------------

// Create a game definition
export async function createGameDefinition(contract, name, image, description) {
  const tx = await contract.createGameDefinition(name, image, description);
  console.log("📤 Sent tx:", tx.hash);
  await tx.wait();
  console.log("✅ Game definition created!");
  return tx.hash;
}

// Create a game event
export async function createGameEvent(contract, gameId, eventName, durationMinutes, minStakeAmt, winnersCount, activate) {
  const tx = await contract.createGameEvent(gameId, eventName, durationMinutes, minStakeAmt, winnersCount, activate);
  console.log("📤 Sent tx:", tx.hash);
  await tx.wait();
  console.log("✅ Game event created!");
  return tx.hash;
}

// Join a game (needs ETH value for stake)
export async function joinGame(contract, gameEventId, stakeAmt) {
  const tx = await contract.joinGame(gameEventId, { value: stakeAmt });
  console.log("📤 Sent tx:", tx.hash);
  await tx.wait();
  console.log("✅ Joined game!");
  return tx.hash;
}

// Finalize scores
export async function finalizeScores(contract, gameEventId, players, finalScores, noWinner) {
  const tx = await contract.finalizeScores(gameEventId, players, finalScores, noWinner);
  console.log("📤 Sent tx:", tx.hash);
  await tx.wait();
  console.log("✅ Scores finalized!");
  return tx.hash;
}

// Claim prize
export async function claimPrize(contract) {
  const tx = await contract.claimPrize();
  console.log("📤 Sent tx:", tx.hash);
  await tx.wait();
  console.log("✅ Prize claimed!");
  return tx.hash;
}
