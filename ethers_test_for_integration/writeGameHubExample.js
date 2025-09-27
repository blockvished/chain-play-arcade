import { 
  getWriteContract,
  createGameDefinition,
  createGameEvent,
  joinGame,
  finalizeScores,
  claimPrize
} from "./writeGameHub.js";

const rpcUrl = "https://testnet.evm.nodes.onflow.org";
const contractAddress = "0xFd860D2FDeE44Bc6810251b6E7369CD3119C8527";

// ⚠️ Replace with your PRIVATE KEY (testnet only, never commit to git!)
const privateKey = "pk";// ⚠️ don’t commit real key!

async function main() {
  const contract = getWriteContract(rpcUrl, contractAddress, privateKey);

  // 1. Create a new game definition
  const tx1 = await createGameDefinition(contract, "Chess", "ipfs://chess.png", "Classic chess");
  console.log("GameDef TX:", tx1);

  // 2. Create a game event
  const tx2 = await createGameEvent(contract, 1, "Chess Tournament", 60, ethers.parseEther("0.01"), 1, true);
  console.log("GameEvent TX:", tx2);

  // 3. Join a game event (with stake)
  const tx3 = await joinGame(contract, 1, ethers.parseEther("0.01"));
  console.log("JoinGame TX:", tx3);

  // 4. Finalize scores
  const players = ["0xPlayer1", "0xPlayer2"];
  const scores = [100, 80];
  const tx4 = await finalizeScores(contract, 1, players, scores, false);
  console.log("FinalizeScores TX:", tx4);

  // 5. Claim prize
  const tx5 = await claimPrize(contract);
  console.log("ClaimPrize TX:", tx5);
}

main().catch(console.error);
