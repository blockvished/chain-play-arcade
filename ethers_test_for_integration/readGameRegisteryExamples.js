import {
  getContract,
  getOwner,
  nextGameCount,
  getAllGames,
  getGameDefinition
} from "./readGameRegistery.js";

const rpcUrl = "https://testnet.evm.nodes.onflow.org";
const contractAddress = "0xFd860D2FDeE44Bc6810251b6E7369CD3119C8527";

async function main() {
  const contract = getContract(rpcUrl, contractAddress);

  console.log("📌 Contract owner:", await getOwner(contract));

  const count = await nextGameCount(contract);
  console.log("📌 Next game count:", count.toString());

  const games = await getAllGames(contract);
  console.log("📌 All games:", games);

  if (count > 0n) {
    const game = await getGameDefinition(contract, 1); // example: gameId = 1
    console.log("📌 Game #1:", game);
  }
}

main().catch(console.error);
