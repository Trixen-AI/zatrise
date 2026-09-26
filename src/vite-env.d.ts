/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_REOWN_PROJECT_ID?: string;
  readonly VITE_RPC_URL_MAINNET?: string;
  readonly VITE_RPC_URL_TESTNET?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
