import { flowTestnet } from "wagmi/chains"

export const CONTRACT_ADDRESSES = {
  [flowTestnet.id]: {
    GameHub: "0xFd860D2FDeE44Bc6810251b6E7369CD3119C8527", 
  },
} as const

export const RPC_URLS = {
    [flowTestnet.id]: "https://testnet.evm.nodes.onflow.org"
} as const

export const DEFAULT_CHAIN = flowTestnet
