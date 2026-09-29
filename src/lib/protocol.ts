// ZecPad genesis parameters. The docs and the dashboard both read from here,
// so a governance change only has to be made once.

const DAY = 86_400;

export const PROTOCOL = {
  /** Epoch 0 starts Monday 7 September 2026, 00:00 UTC. */
  genesis: Date.UTC(2026, 8, 7) / 1000,
  epochLength: 7 * DAY,
  lockup: 7 * DAY,
  /** Share of every raise that funds the ZEC reward pool. */
  feeBps: 500,
  /** Largest share of one sale a single wallet may commit. */
  walletCapBps: 500,
  /** Voting window for a zVote proposal. */
  votingPeriod: 5 * DAY,
  zatsPerZec: 100_000_000,
} as const;

export function epochAt(unixSeconds: number) {
  if (unixSeconds < PROTOCOL.genesis) return 0;
  return Math.floor((unixSeconds - PROTOCOL.genesis) / PROTOCOL.epochLength);
}

export function epochStart(epoch: number) {
  return PROTOCOL.genesis + epoch * PROTOCOL.epochLength;
}

export function epochEnd(epoch: number) {
  return epochStart(epoch + 1);
}

export const bpsToPercent = (bps: number) => `${bps / 100}%`;

export const NETWORKS = [
  {
    name: 'Robinhood Chain',
    chainId: 4663,
    rpc: 'https://rpc.mainnet.chain.robinhood.com',
    explorer: 'https://robinhoodchain.blockscout.com',
    currency: 'ETH',
  },
  {
    name: 'Robinhood Chain Testnet',
    chainId: 46630,
    rpc: 'https://rpc.testnet.chain.robinhood.com',
    explorer: 'https://explorer.testnet.chain.robinhood.com',
    currency: 'ETH',
  },
] as const;
