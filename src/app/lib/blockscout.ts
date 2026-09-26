import { useQuery } from '@tanstack/react-query';

// Read-only wallet data from the Robinhood Chain Blockscout explorers (API v2, CORS enabled).
const EXPLORERS: Record<number, string> = {
  4663: 'https://robinhoodchain.blockscout.com',
  46630: 'https://explorer.testnet.chain.robinhood.com',
};

export const explorerUrl = (chainId: number) => EXPLORERS[chainId] ?? EXPLORERS[4663];
export const txUrl = (chainId: number, hash: string) => `${explorerUrl(chainId)}/tx/${hash}`;
export const addressUrl = (chainId: number, address: string) => `${explorerUrl(chainId)}/address/${address}`;

async function get<T>(chainId: number, path: string): Promise<T> {
  const res = await fetch(`${explorerUrl(chainId)}/api/v2${path}`);
  if (res.status === 404) throw new NotIndexed();
  if (!res.ok) throw new Error(`Explorer responded ${res.status}`);
  return res.json() as Promise<T>;
}

/** Blockscout answers 404 for addresses it has never seen on this chain. */
export class NotIndexed extends Error {
  constructor() {
    super('Address not indexed on this network yet');
  }
}

export type TokenBalance = {
  value: string;
  token: {
    address_hash: string;
    name: string | null;
    symbol: string | null;
    decimals: string | null;
    type: string;
    icon_url: string | null;
    exchange_rate: string | null;
  };
};

export type ExplorerTx = {
  hash: string;
  timestamp: string;
  status: 'ok' | 'error' | null;
  method: string | null;
  value: string;
  fee: { value: string } | null;
  from: { hash: string };
  to: { hash: string; name?: string | null } | null;
  transaction_types?: string[];
};

type Counters = { transactions_count: string; token_transfers_count: string; gas_usage_count: string };

const opts = { staleTime: 30_000, retry: (n: number, e: Error) => !(e instanceof NotIndexed) && n < 2 };

export function useTokenBalances(chainId: number, address?: string) {
  return useQuery({
    queryKey: ['bs', 'tokens', chainId, address],
    enabled: !!address,
    queryFn: async () => {
      try {
        const list = await get<TokenBalance[]>(chainId, `/addresses/${address}/token-balances`);
        return list.filter((t) => t.token.type === 'ERC-20');
      } catch (e) {
        if (e instanceof NotIndexed) return [];
        throw e;
      }
    },
    ...opts,
  });
}

export function useTransactions(chainId: number, address?: string) {
  return useQuery({
    queryKey: ['bs', 'txs', chainId, address],
    enabled: !!address,
    queryFn: async () => {
      try {
        const r = await get<{ items: ExplorerTx[] }>(chainId, `/addresses/${address}/transactions`);
        return r.items;
      } catch (e) {
        if (e instanceof NotIndexed) return [];
        throw e;
      }
    },
    ...opts,
  });
}

export function useCounters(chainId: number, address?: string) {
  return useQuery({
    queryKey: ['bs', 'counters', chainId, address],
    enabled: !!address,
    queryFn: async () => {
      try {
        return await get<Counters>(chainId, `/addresses/${address}/counters`);
      } catch (e) {
        if (e instanceof NotIndexed) return { transactions_count: '0', token_transfers_count: '0', gas_usage_count: '0' };
        throw e;
      }
    },
    ...opts,
  });
}

/** ETH/USD rate the explorer reports for the chain's native coin. */
export function useEthPrice(chainId: number) {
  return useQuery({
    queryKey: ['bs', 'stats', chainId],
    queryFn: async () => {
      const s = await get<{ coin_price: string | null }>(chainId, '/stats');
      return s.coin_price ? Number(s.coin_price) : null;
    },
    staleTime: 120_000,
  });
}
