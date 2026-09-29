import { useSyncExternalStore } from 'react';

// Default Zcash payout address per wallet, kept in this browser only.
const KEY = 'zecpad:payout:v1';
const listeners = new Set<() => void>();
let cache: Record<string, string> | null = null;

function read(): Record<string, string> {
  if (cache) return cache;
  try {
    cache = JSON.parse(localStorage.getItem(KEY) ?? '{}') as Record<string, string>;
  } catch {
    cache = {};
  }
  return cache;
}

function subscribe(l: () => void) {
  listeners.add(l);
  return () => listeners.delete(l);
}

export function setPayoutAddress(account: string, zcashAddress: string) {
  const next = { ...read(), [account.toLowerCase()]: zcashAddress };
  cache = next;
  try {
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    /* blocked storage: keep for this session */
  }
  listeners.forEach((l) => l());
}

export function usePayoutAddress(account?: string) {
  const all = useSyncExternalStore(subscribe, read, read);
  return account ? (all[account.toLowerCase()] ?? '') : '';
}
