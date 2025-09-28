export const GameHubABI = [
  {
      "type": "constructor",
      "inputs": [
          {
              "name": "initialAdmin",
              "type": "address",
              "internalType": "address"
          }
      ],
      "stateMutability": "nonpayable"
  },
  {
      "type": "receive",
      "stateMutability": "payable"
  },
  {
      "type": "function",
      "name": "LEADERBOARD_SIZE",
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
      "name": "activateGame",
      "inputs": [
          {
              "name": "gameEventId",
              "type": "uint256",
              "internalType": "uint256"
          }
      ],
      "outputs": [],
      "stateMutability": "nonpayable"
  },
  {
      "type": "function",
      "name": "admin",
      "inputs": [],
      "outputs": [
          {
              "name": "",
              "type": "address",
              "internalType": "address"
          }
      ],
      "stateMutability": "view"
  },
  {
      "type": "function",
      "name": "adminWithdraw",
      "inputs": [
          {
              "name": "to",
              "type": "address",
              "internalType": "address payable"
          },
          {
              "name": "amount",
              "type": "uint256",
              "internalType": "uint256"
          }
      ],
      "outputs": [],
      "stateMutability": "nonpayable"
  },
  {
      "type": "function",
      "name": "adminWithdrawAllowances",
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
      "name": "claimPrize",
      "inputs": [],
      "outputs": [],
      "stateMutability": "nonpayable"
  },
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
      "name": "createGameEvent",
      "inputs": [
          {
              "name": "gameId",
              "type": "uint256",
              "internalType": "uint256"
          },
          {
              "name": "eventName",
              "type": "string",
              "internalType": "string"
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
              "name": "winnersCount",
              "type": "uint256",
              "internalType": "uint256"
          },
          {
              "name": "activate",
              "type": "bool",
              "internalType": "bool"
          }
      ],
      "outputs": [],
      "stateMutability": "nonpayable"
  },
  {
      "type": "function",
      "name": "finalizeScores",
      "inputs": [
          {
              "name": "gameEventId",
              "type": "uint256",
              "internalType": "uint256"
          },
          {
              "name": "players",
              "type": "address[]",
              "internalType": "address[]"
          },
          {
              "name": "finalScores",
              "type": "uint256[]",
              "internalType": "uint256[]"
          },
          {
              "name": "noWinner",
              "type": "bool",
              "internalType": "bool"
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
      "name": "gameStates",
      "inputs": [
          {
              "name": "gameEventId",
              "type": "uint256",
              "internalType": "uint256"
          },
          {
              "name": "",
              "type": "address",
              "internalType": "address"
          },
          {
              "name": "",
              "type": "uint256",
              "internalType": "uint256"
          }
      ],
      "outputs": [
          {
              "name": "score",
              "type": "uint256",
              "internalType": "uint256"
          },
          {
              "name": "cid",
              "type": "string",
              "internalType": "string"
          },
          {
              "name": "winner",
              "type": "bool",
              "internalType": "bool"
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
  },
  {
      "type": "function",
      "name": "getAllGames",
      "inputs": [],
      "outputs": [
          {
              "name": "",
              "type": "tuple[]",
              "internalType": "struct GameRegistry.GameDefinition[]",
              "components": [
                  {
                      "name": "id",
                      "type": "uint256",
                      "internalType": "uint256"
                  },
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
              ]
          }
      ],
      "stateMutability": "view"
  },
  {
      "type": "function",
      "name": "getGameDefinition",
      "inputs": [
          {
              "name": "gameId",
              "type": "uint256",
              "internalType": "uint256"
          }
      ],
      "outputs": [
          {
              "name": "",
              "type": "tuple",
              "internalType": "struct GameRegistry.GameDefinition",
              "components": [
                  {
                      "name": "id",
                      "type": "uint256",
                      "internalType": "uint256"
                  },
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
              ]
          }
      ],
      "stateMutability": "view"
  },
  {
      "type": "function",
      "name": "isActive",
      "inputs": [
          {
              "name": "gameEventId",
              "type": "uint256",
              "internalType": "uint256"
          }
      ],
      "outputs": [
          {
              "name": "",
              "type": "bool",
              "internalType": "bool"
          }
      ],
      "stateMutability": "view"
  },
  {
      "type": "function",
      "name": "joinGame",
      "inputs": [
          {
              "name": "gameEventId",
              "type": "uint256",
              "internalType": "uint256"
          }
      ],
      "outputs": [],
      "stateMutability": "payable"
  },
  {
      "type": "function",
      "name": "joined",
      "inputs": [
          {
              "name": "gameEventId",
              "type": "uint256",
              "internalType": "uint256"
          },
          {
              "name": "",
              "type": "address",
              "internalType": "address"
          }
      ],
      "outputs": [
          {
              "name": "",
              "type": "bool",
              "internalType": "bool"
          }
      ],
      "stateMutability": "view"
  },
  {
      "type": "function",
      "name": "nextGameCount",
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
      "name": "owner",
      "inputs": [],
      "outputs": [
          {
              "name": "",
              "type": "address",
              "internalType": "address"
          }
      ],
      "stateMutability": "view"
  },
  {
      "type": "function",
      "name": "rankOfWinner",
      "inputs": [
          {
              "name": "",
              "type": "address",
              "internalType": "address"
          }
      ],
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
      "name": "renounceOwnership",
      "inputs": [],
      "outputs": [],
      "stateMutability": "nonpayable"
  },
  {
      "type": "function",
      "name": "scores",
      "inputs": [
          {
              "name": "gameEventId",
              "type": "uint256",
              "internalType": "uint256"
          },
          {
              "name": "",
              "type": "address",
              "internalType": "address"
          }
      ],
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
      "name": "setAdmin",
      "inputs": [
          {
              "name": "newAdmin",
              "type": "address",
              "internalType": "address"
          }
      ],
      "outputs": [],
      "stateMutability": "nonpayable"
  },
  {
      "type": "function",
      "name": "svgNft",
      "inputs": [],
      "outputs": [
          {
              "name": "",
              "type": "address",
              "internalType": "contract SVGNFT"
          }
      ],
      "stateMutability": "view"
  },
  {
      "type": "function",
      "name": "topPlayers",
      "inputs": [
          {
              "name": "gameEventId",
              "type": "uint256",
              "internalType": "uint256"
          },
          {
              "name": "",
              "type": "uint256",
              "internalType": "uint256"
          }
      ],
      "outputs": [
          {
              "name": "",
              "type": "address",
              "internalType": "address"
          }
      ],
      "stateMutability": "view"
  },
  {
      "type": "function",
      "name": "transferOwnership",
      "inputs": [
          {
              "name": "newOwner",
              "type": "address",
              "internalType": "address"
          }
      ],
      "outputs": [],
      "stateMutability": "nonpayable"
  },
  {
      "type": "function",
      "name": "uploadPlayerGameState",
      "inputs": [
          {
              "name": "gameEventId",
              "type": "uint256",
              "internalType": "uint256"
          },
          {
              "name": "player",
              "type": "address",
              "internalType": "address"
          },
          {
              "name": "score",
              "type": "uint256",
              "internalType": "uint256"
          },
          {
              "name": "winner",
              "type": "bool",
              "internalType": "bool"
          },
          {
              "name": "cid",
              "type": "string",
              "internalType": "string"
          }
      ],
      "outputs": [],
      "stateMutability": "nonpayable"
  },
  {
      "type": "function",
      "name": "winnerWithdrawAllowances",
      "inputs": [
          {
              "name": "",
              "type": "address",
              "internalType": "address"
          }
      ],
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
      "type": "event",
      "name": "AdminChanged",
      "inputs": [
          {
              "name": "newAdmin",
              "type": "address",
              "indexed": false,
              "internalType": "address"
          }
      ],
      "anonymous": false
  },
  {
      "type": "event",
      "name": "AdminWithdraw",
      "inputs": [
          {
              "name": "to",
              "type": "address",
              "indexed": false,
              "internalType": "address"
          },
          {
              "name": "amount",
              "type": "uint256",
              "indexed": false,
              "internalType": "uint256"
          }
      ],
      "anonymous": false
  },
  {
      "type": "event",
      "name": "GameCreated",
      "inputs": [
          {
              "name": "gameEventId",
              "type": "uint256",
              "indexed": false,
              "internalType": "uint256"
          },
          {
              "name": "referencedGameId",
              "type": "uint256",
              "indexed": false,
              "internalType": "uint256"
          },
          {
              "name": "eventName",
              "type": "string",
              "indexed": false,
              "internalType": "string"
          },
          {
              "name": "startTime",
              "type": "uint256",
              "indexed": false,
              "internalType": "uint256"
          },
          {
              "name": "endTime",
              "type": "uint256",
              "indexed": false,
              "internalType": "uint256"
          },
          {
              "name": "active",
              "type": "bool",
              "indexed": false,
              "internalType": "bool"
          },
          {
              "name": "durationMinutes",
              "type": "uint256",
              "indexed": false,
              "internalType": "uint256"
          },
          {
              "name": "minStakeAmount",
              "type": "uint256",
              "indexed": false,
              "internalType": "uint256"
          }
      ],
      "anonymous": false
  },
  {
      "type": "event",
      "name": "GameDefinitionCreated",
      "inputs": [
          {
              "name": "gameId",
              "type": "uint256",
              "indexed": true,
              "internalType": "uint256"
          },
          {
              "name": "name",
              "type": "string",
              "indexed": false,
              "internalType": "string"
          },
          {
              "name": "image",
              "type": "string",
              "indexed": false,
              "internalType": "string"
          }
      ],
      "anonymous": false
  },
  {
      "type": "event",
      "name": "GameImageUpdated",
      "inputs": [
          {
              "name": "gameId",
              "type": "uint256",
              "indexed": true,
              "internalType": "uint256"
          },
          {
              "name": "newImage",
              "type": "string",
              "indexed": false,
              "internalType": "string"
          }
      ],
      "anonymous": false
  },
  {
      "type": "event",
      "name": "OwnershipTransferred",
      "inputs": [
          {
              "name": "previousOwner",
              "type": "address",
              "indexed": true,
              "internalType": "address"
          },
          {
              "name": "newOwner",
              "type": "address",
              "indexed": true,
              "internalType": "address"
          }
      ],
      "anonymous": false
  },
  {
      "type": "event",
      "name": "PlayerJoined",
      "inputs": [
          {
              "name": "gameEventId",
              "type": "uint256",
              "indexed": false,
              "internalType": "uint256"
          },
          {
              "name": "player",
              "type": "address",
              "indexed": false,
              "internalType": "address"
          },
          {
              "name": "pooledAmt",
              "type": "uint256",
              "indexed": false,
              "internalType": "uint256"
          },
          {
              "name": "playersCount",
              "type": "uint256",
              "indexed": false,
              "internalType": "uint256"
          }
      ],
      "anonymous": false
  },
  {
      "type": "event",
      "name": "PrizeClaimed",
      "inputs": [
          {
              "name": "winner",
              "type": "address",
              "indexed": false,
              "internalType": "address"
          },
          {
              "name": "amount",
              "type": "uint256",
              "indexed": false,
              "internalType": "uint256"
          }
      ],
      "anonymous": false
  },
  {
      "type": "event",
      "name": "ScoresFinalized",
      "inputs": [
          {
              "name": "gameEventId",
              "type": "uint256",
              "indexed": false,
              "internalType": "uint256"
          }
      ],
      "anonymous": false
  },
  {
      "type": "error",
      "name": "AdminWithdrawLimitExceeded",
      "inputs": []
  },
  {
      "type": "error",
      "name": "AlreadyJoined",
      "inputs": [
          {
              "name": "gameEventId",
              "type": "uint256",
              "internalType": "uint256"
          },
          {
              "name": "player",
              "type": "address",
              "internalType": "address"
          }
      ]
  },
  {
      "type": "error",
      "name": "ArrayLengthMismatch",
      "inputs": []
  },
  {
      "type": "error",
      "name": "GameAlreadyActive",
      "inputs": []
  },
  {
      "type": "error",
      "name": "GameEnded",
      "inputs": [
          {
              "name": "gameEventId",
              "type": "uint256",
              "internalType": "uint256"
          }
      ]
  },
  {
      "type": "error",
      "name": "GameEndedOR_Already_Active",
      "inputs": [
          {
              "name": "gameEventId",
              "type": "uint256",
              "internalType": "uint256"
          }
      ]
  },
  {
      "type": "error",
      "name": "GameInactive",
      "inputs": []
  },
  {
      "type": "error",
      "name": "GameNotFound",
      "inputs": []
  },
  {
      "type": "error",
      "name": "GameStillRunning",
      "inputs": [
          {
              "name": "gameEventId",
              "type": "uint256",
              "internalType": "uint256"
          }
      ]
  },
  {
      "type": "error",
      "name": "IncorrectStake",
      "inputs": [
          {
              "name": "amountRequired",
              "type": "uint256",
              "internalType": "uint256"
          },
          {
              "name": "amoutSent",
              "type": "uint256",
              "internalType": "uint256"
          }
      ]
  },
  {
      "type": "error",
      "name": "NotAdmin",
      "inputs": []
  },
  {
      "type": "error",
      "name": "OwnableInvalidOwner",
      "inputs": [
          {
              "name": "owner",
              "type": "address",
              "internalType": "address"
          }
      ]
  },
  {
      "type": "error",
      "name": "OwnableUnauthorizedAccount",
      "inputs": [
          {
              "name": "account",
              "type": "address",
              "internalType": "address"
          }
      ]
  },
  {
      "type": "error",
      "name": "PlayerNotJoined",
      "inputs": []
  },
  {
      "type": "error",
      "name": "ScoresAlreadyFinalized",
      "inputs": [
          {
              "name": "gameEventId",
              "type": "uint256",
              "internalType": "uint256"
          }
      ]
  },
  {
      "type": "error",
      "name": "WinnerCountNot_1_or_3",
      "inputs": []
  }
] as const

export type GameEvent = {
  active: boolean
  eventName: string
  startTime: bigint
  endTime: bigint
  referencedGameId: bigint
  durationMinutes: bigint
  eventId: number
  minStakeAmt: bigint
  pooledAmt: bigint
  scoresFinalized: boolean
  playersCount: bigint
  winnersCount: bigint
  joined?: boolean
}


