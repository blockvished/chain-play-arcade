import { flowTestnet } from "wagmi/chains"

export const CONTRACT_ADDRESSES = {
  [flowTestnet.id]: {
    GameHub: "0x05CaE15c24b3Fcd9374998e6fB59aE893395A6B9", 
  },
} as const

export const RPC_URLS = {
    [flowTestnet.id]: "https://testnet.evm.nodes.onflow.org"
} as const

export const DEFAULT_CHAIN = flowTestnet
