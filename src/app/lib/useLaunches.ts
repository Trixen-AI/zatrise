import { useMemo } from 'react';
import { LAUNCHES, launchFromRequest } from '@/app/data/launches';
import { useAllRequests } from './requests';
import { useActive } from './useActive';

/** Registry listings plus launches created in the app on the active network, newest first. */
export function useLaunches() {
  const { chainId } = useActive();
  const created = useAllRequests('CreateLaunch');
  return useMemo(
    () => [...created.filter((r) => r.chainId === chainId).map(launchFromRequest), ...LAUNCHES],
    [created, chainId],
  );
}

export function useLaunch(id?: string) {
  const launches = useLaunches();
  return launches.find((l) => l.id === id);
}
