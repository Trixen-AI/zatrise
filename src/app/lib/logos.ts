import { useSyncExternalStore } from 'react';

// Launch logos (500 x 500 images as data URLs), keyed by the keccak256 hash that the creator signed.
const KEY = 'zecpad:logos:v1';
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

/** Returns false when the browser has no room left to keep the image. */
export function saveLogo(hash: string, dataUrl: string) {
  const next = { ...read(), [hash]: dataUrl };
  cache = next;
  listeners.forEach((l) => l());
  try {
    localStorage.setItem(KEY, JSON.stringify(next));
    return true;
  } catch {
    return false;
  }
}

export function useLogo(hash?: string) {
  const all = useSyncExternalStore(subscribe, read, read);
  return hash ? all[hash] : undefined;
}
