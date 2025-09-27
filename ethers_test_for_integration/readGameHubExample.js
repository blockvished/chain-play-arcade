import { 
  getReadContract,
  getAdmin,
  getOwner,
  getLeaderboardSize,
  getAllGames,
  getGameDefinition,
  isActive,
  getGameEvent
} from "./readGameHub.js";

const rpcUrl = "https://testnet.evm.nodes.onflow.org";
const contractAddress = "0xFd860D2FDeE44Bc6810251b6E7369CD3119C8527";

async function main() {
  const contract = getReadContract(rpcUrl, contractAddress);

  console.log("Admin:", await getAdmin(contract));
  console.log("Owner:", await getOwner(contract));
  console.log("Leaderboard size:", (await getLeaderboardSize(contract)).toString());

  const games = await getAllGames(contract);
  console.log("Games:", games);

  const gameDef = await getGameDefinition(contract, 1);
  console.log("Game #1:", gameDef);

  const event = await getGameEvent(contract, 1);
  console.log("Event #1:", event);

  console.log("Is event #1 active?", await isActive(contract, 1));
}

main().catch(console.error);
