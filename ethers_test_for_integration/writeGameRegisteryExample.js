import {
  getWriteContract,
  createGameDefinition,
  transferOwnership
} from "./writeGameRegistery.js";

const rpcUrl = "https://testnet.evm.nodes.onflow.org";
const contractAddress = "0xFd860D2FDeE44Bc6810251b6E7369CD3119C8527";

// ⚠️ Replace with your PRIVATE KEY (testnet only, never commit to git!)
const privateKey = "3ca3cc6e57ed9a1f65f2a9163231c3daa069a6393186096e43493e3076eebb6c";

async function main() {
  const contract = getWriteContract(rpcUrl, contractAddress, privateKey);

  // Example 1: create a game
  const tx1 = await createGameDefinition(
    contract,
    "Chess",
    "https://example.com/chess.png",
    "Classic chess game on-chain"
  );
  console.log("📌 Tx hash (game created):", tx1);

  // Example 2: transfer ownership
  // const tx2 = await transferOwnership(contract, "0xNewOwnerAddress");
  // console.log("📌 Tx hash (ownership transfer):", tx2);
}

main().catch(console.error);
