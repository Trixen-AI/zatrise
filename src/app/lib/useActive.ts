import { robinhood } from '@reown/appkit/networks';
import { useMemo } from 'react';
import { useAccount, useBalance } from 'wagmi';
import { SUPPORTED_CHAIN_IDS } from '@/app/config/wallet';
import { epochAt, epochStart } from '@/lib/protocol';
import { derivePosition, useRequests } from './requests';
import { useNow } from './useNow';

/** The connected wallet, the Robinhood Chain network it is on (mainnet when off-network) and its real ETH balance. */
export function useActive() {
  const { address, chainId: walletChain, isConnected } = useAccount();
  const onSupported = walletChain !== undefined && SUPPORTED_CHAIN_IDS.has(walletChain);
  const chainId = onSupported ? walletChain! : robinhood.id;
  const balance = useBalance({ address, chainId, query: { enabled: !!address, refetchInterval: 30_000 } });
  return { address, chainId, isConnected, onSupported, balance: balance.data?.value, balanceLoading: balance.isLoading };
}

/** The user's position on the active network, derived from the requests they signed. */
export function usePosition() {
  const { address, chainId } = useActive();
  const requests = useRequests(address, chainId);
  const now = useNow();
  const epoch = epochAt(now);
  const position = useMemo(() => derivePosition(requests, now), [requests, now]);
  const epochPosition = useMemo(() => derivePosition(requests, now, epochStart(epoch)), [requests, now, epoch]);
  return { requests, position, epochWeight: epochPosition.weightEthSeconds, epoch, now };
}
