import { formatUnits } from 'viem';

export const shortAddress = (a?: string, head = 6, tail = 4) => (a ? `${a.slice(0, head)}…${a.slice(-tail)}` : '');

/** Human number with at most `max` fraction digits, no trailing zeros. */
export function fmtNumber(value: number, max = 4) {
  if (!Number.isFinite(value)) return '0';
  return value.toLocaleString('en-US', { maximumFractionDigits: max });
}

export function fmtUnits(value: bigint, decimals = 18, max = 4) {
  const n = Number(formatUnits(value, decimals));
  if (n > 0 && n < 10 ** -max) return `<${(10 ** -max).toFixed(max)}`;
  return fmtNumber(n, max);
}

export const fmtEth = (wei: bigint, max = 4) => `${fmtUnits(wei, 18, max)} ETH`;

export function fmtDate(unixSeconds: number, withTime = true) {
  return new Date(unixSeconds * 1000).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    ...(withTime ? { hour: '2-digit', minute: '2-digit', timeZone: 'UTC', timeZoneName: 'short' } : { timeZone: 'UTC' }),
  });
}

export function fmtDuration(seconds: number) {
  const s = Math.max(0, Math.floor(seconds));
  const d = Math.floor(s / 86_400);
  const h = Math.floor((s % 86_400) / 3600);
  const m = Math.floor((s % 3600) / 60);
  if (d > 0) return `${d}d ${h}h ${m}m`;
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m ${s % 60}s`;
}

export function fmtAgo(unixSeconds: number, now: number) {
  const s = Math.max(0, now - unixSeconds);
  if (s < 60) return 'just now';
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86_400) return `${Math.floor(s / 3600)}h ago`;
  return `${Math.floor(s / 86_400)}d ago`;
}

/** Weight in wei-seconds shown as ETH-days. */
export const fmtEthDays = (weiSeconds: bigint) => `${fmtUnits(weiSeconds / 86_400n, 18, 3)} ETH-days`;
