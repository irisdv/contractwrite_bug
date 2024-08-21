import "@/styles/globals.css";
import { getConnectors } from "@/utils/connectorWrapper";
import { Chain, mainnet } from "@starknet-react/chains";
import { jsonRpcProvider, StarknetConfig } from "@starknet-react/core";
import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  const chains = [mainnet];
  const providers = jsonRpcProvider({
    rpc: (_chain: Chain) => ({
      nodeUrl: process.env.NEXT_PUBLIC_RPC_URL as string,
    }),
  });
  return (
    <StarknetConfig
      chains={chains}
      provider={providers}
      connectors={getConnectors()}
      autoConnect
    >
      <Component {...pageProps} />
    </StarknetConfig>
  );
}
