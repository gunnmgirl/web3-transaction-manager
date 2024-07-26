import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import {
  mainnet,
  polygon,
  optimism,
  arbitrum,
  base,
  sepolia,
  polygonMumbai,
  lineaTestnet,
  polygonAmoy,
} from "wagmi/chains";

export const config = getDefaultConfig({
  appName: "web3-transaction-manager",
  projectId: process.env.NEXT_PUBLIC_PROJECT_ID ?? "",
  chains: [
    mainnet,
    polygon,
    optimism,
    arbitrum,
    base,
    sepolia,
    polygonMumbai,
    lineaTestnet,
    polygonAmoy,
  ],
  ssr: true,
});
