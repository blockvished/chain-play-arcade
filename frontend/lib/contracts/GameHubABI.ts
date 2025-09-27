export const GameHubABI = [
  {
    "type": "function",
    "name": "createGameDefinition",
    "inputs": [
      {
        "name": "name",
        "type": "string",
        "internalType": "string"
      },
      {
        "name": "image",
        "type": "string",
        "internalType": "string"
      },
      {
        "name": "description",
        "type": "string",
        "internalType": "string"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "gameEventCount",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "gamesEvents",
    "inputs": [
      {
        "name": "gameEventId",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [
      {
        "name": "active",
        "type": "bool",
        "internalType": "bool"
      },
      {
        "name": "eventName",
        "type": "string",
        "internalType": "string"
      },
      {
        "name": "startTime",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "endTime",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "referencedGameId",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "durationMinutes",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "minStakeAmt",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "pooledAmt",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "scoresFinalized",
        "type": "bool",
        "internalType": "bool"
      },
      {
        "name": "playersCount",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "winnersCount",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "view"
  }
] as const

export type GameEvent = {
  active: boolean
  eventName: string
  startTime: bigint
  endTime: bigint
  referencedGameId: bigint
  durationMinutes: bigint
  minStakeAmt: bigint
  pooledAmt: bigint
  scoresFinalized: boolean
  playersCount: bigint
  winnersCount: bigint
}
