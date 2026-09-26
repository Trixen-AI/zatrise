import { useSyncExternalStore } from 'react';

// One shared 1-second clock for every countdown on the page.
let now = Math.floor(Date.now() / 1000);
const listeners = new Set<() => void>();
let timer: number | undefined;

function subscribe(l: () => void) {
  listeners.add(l);
  if (timer === undefined) {
    timer = window.setInterval(() => {
      now = Math.floor(Date.now() / 1000);
      listeners.forEach((fn) => fn());
    }, 1000);
  }
  return () => {
    listeners.delete(l);
    if (listeners.size === 0 && timer !== undefined) {
      window.clearInterval(timer);
      timer = undefined;
    }
  };
}

/** Current unix time in seconds, ticking once per second. */
export function useNow() {
  return useSyncExternalStore(
    subscribe,
    () => now,
    () => now,
  );
}
