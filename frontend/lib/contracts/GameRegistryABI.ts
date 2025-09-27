export const GameRegistryABI = [
  {
    "type": "function",
    "name": "nextGameCount",
    "inputs": [],
    "outputs": [{ "name": "", "type": "uint256" }],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getAllGames",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "tuple[]",
        "components": [
          { "name": "id", "type": "uint256" },
          { "name": "name", "type": "string" },
          { "name": "image", "type": "string" },
          { "name": "description", "type": "string" }
        ]
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getGameDefinition",
    "inputs": [{ "name": "gameId", "type": "uint256" }],
    "outputs": [
      {
        "name": "",
        "type": "tuple",
        "components": [
          { "name": "id", "type": "uint256" },
          { "name": "name", "type": "string" },
          { "name": "image", "type": "string" },
          { "name": "description", "type": "string" }
        ]
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "owner",
    "inputs": [],
    "outputs": [{ "name": "", "type": "address" }],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "createGameDefinition",
    "inputs": [
      { "name": "name", "type": "string" },
      { "name": "image", "type": "string" },
      { "name": "description", "type": "string" }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "transferOwnership",
    "inputs": [{ "name": "newOwner", "type": "address" }],
    "outputs": [],
    "stateMutability": "nonpayable"
  }
] as const

export type GameDefinition = {
  id: bigint
  name: string
  image: string
  description: string
}
