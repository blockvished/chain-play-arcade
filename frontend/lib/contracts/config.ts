import { flowTestnet } from "wagmi/chains"

export const CONTRACT_ADDRESSES = {
  [flowTestnet.id]: {
    GameHub: "0x2FD4f932325EF8555597Ae816E352D3854B4f73c", 
  },
} as const

export const RPC_URLS = {
    [flowTestnet.id]: "https://testnet.evm.nodes.onflow.org"
} as const

export const DEFAULT_CHAIN = flowTestnet
