import { createConfig, http } from "wagmi"
import { mainnet, sepolia } from "wagmi/chains"
import { getDefaultConfig } from "connectkit"

export const config = createConfig(
  getDefaultConfig({
    chains: [mainnet, sepolia],
    transports: {
      [mainnet.id]: http(),
      [sepolia.id]: http(),
    },
    walletConnectProjectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "",
    appName: "ChainPlay Arcade",
    appDescription: "Decentralized AI Gaming Platform",
    appUrl: "https://chainplay-arcade.vercel.app",
    appIcon: "https://chainplay-arcade.vercel.app/icon.png",
  }),
)
