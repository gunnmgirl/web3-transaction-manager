"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import { BiconomyProvider } from "@biconomy/use-aa";
import { config } from "app/wagmiConfig";
import { RainbowKitProvider, darkTheme } from "@rainbow-me/rainbowkit";
import { BUNDELER_URL } from "./constants";
import "@rainbow-me/rainbowkit/styles.css";

const queryClient = new QueryClient();

export const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider theme={darkTheme()}>
          <BiconomyProvider
            config={{
              biconomyPaymasterApiKey:
                process.env.NEXT_PUBLIC_BICONOMY_PAYMASTER_API_KEY ?? "",
              bundlerUrl: BUNDELER_URL,
            }}
            queryClient={queryClient}
          >
            {children}
          </BiconomyProvider>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};
