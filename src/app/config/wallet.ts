import { WagmiAdapter } from '@reown/appkit-adapter-wagmi';
import { type AppKitNetwork, robinhood, robinhoodTestnet } from '@reown/appkit/networks';
import { createAppKit } from '@reown/appkit/react';
import { http } from 'wagmi';

export const projectId: string = import.meta.env.VITE_REOWN_PROJECT_ID ?? '';

if (!projectId) {
  console.warn('[zecpad] VITE_REOWN_PROJECT_ID is empty. Copy .env.example to .env and set your Reown project ID.');
}

export const networks: [AppKitNetwork, ...AppKitNetwork[]] = [robinhood, robinhoodTestnet];
export const SUPPORTED_CHAIN_IDS = new Set<number>([robinhood.id, robinhoodTestnet.id]);

// Optional RPC overrides (for a private or local node); defaults are the public Robinhood Chain RPCs.
const rpcMainnet = import.meta.env.VITE_RPC_URL_MAINNET || undefined;
const rpcTestnet = import.meta.env.VITE_RPC_URL_TESTNET || undefined;

export const wagmiAdapter = new WagmiAdapter({
  networks,
  projectId,
  transports: {
    [robinhood.id]: http(rpcMainnet),
    [robinhoodTestnet.id]: http(rpcTestnet),
  },
});

export const wagmiConfig = wagmiAdapter.wagmiConfig;

createAppKit({
  adapters: [wagmiAdapter],
  networks,
  defaultNetwork: robinhood,
  projectId,
  metadata: {
    name: 'ZecPad',
    description: 'The first launchpad powered by a Zcash reward economy, built on Robinhood Chain.',
    url: window.location.origin,
    icons: [`${window.location.origin}/brand/logo-500.png`],
  },
  features: {
    analytics: false,
    email: false,
    socials: false,
    swaps: false,
    onramp: false,
    history: false,
  },
  themeMode: 'dark',
  themeVariables: {
    '--w3m-accent': '#f5b83d',
    '--w3m-color-mix': '#15130f',
    '--w3m-color-mix-strength': 40,
    '--w3m-font-family': 'Outfit, system-ui, sans-serif',
    '--w3m-border-radius-master': '3px',
    '--w3m-z-index': 200,
  },
});
