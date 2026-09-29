import { formatEther, formatUnits, parseEther, parseUnits } from 'viem';
import type { SignedRequest } from '@/app/lib/requests';

// Listing registry: sales ZecPad lists directly. Empty until the first approved listing.
// Launches that teams create in the app (/app/create) are added to this list at runtime.

export type Launch = {
  id: string;
  name: string;
  symbol: string;
  tagline: string;
  description: string;
  category: string;
  /** ETH per token */
  price: number;
  /** whole tokens */
  tokensForSale: number;
  /** unix seconds */
  start: number;
  end: number;
  website?: string;
  xHandle?: string;
  tokenName?: string;
  totalSupply?: number;
  logoHash?: string;
  creator?: string;
  /** exact amounts in wei (18 decimals) when known */
  hardCapWei?: bigint;
  tokensForSaleWei?: bigint;
};

export const LAUNCHES: Launch[] = [];

export const CATEGORIES = ['DeFi', 'Payments', 'Gaming', 'Infrastructure', 'Social', 'AI', 'Real-world assets', 'Other'];

export type LaunchStatus = 'live' | 'upcoming' | 'closed';

export function launchStatus(l: Launch, now: number): LaunchStatus {
  if (now < l.start) return 'upcoming';
  if (now >= l.end) return 'closed';
  return 'live';
}

export const hardCapWei = (l: Launch) => l.hardCapWei ?? parseEther((l.price * l.tokensForSale).toFixed(18));
export const saleWei = (l: Launch) => l.tokensForSaleWei ?? parseUnits(String(l.tokensForSale), 18);

/** Tokens (18 decimals) bought with `wei` at the sale's fixed price. */
export function tokensFor(l: Launch, wei: bigint) {
  const cap = hardCapWei(l);
  return cap > 0n ? (wei * saleWei(l)) / cap : 0n;
}

/** A launch created in the app, rebuilt from the creator's signed request. */
export function launchFromRequest(r: SignedRequest): Launch {
  const m = r.message;
  const cap = BigInt(m.hardCap);
  const sale = BigInt(m.tokensForSale);
  const saleTokens = Number(formatUnits(sale, 18));
  return {
    id: m.launchId,
    name: m.projectName,
    symbol: m.tokenSymbol,
    tokenName: m.tokenName,
    tagline: m.tagline,
    description: m.description,
    category: m.category,
    price: saleTokens > 0 ? Number(formatEther(cap)) / saleTokens : 0,
    tokensForSale: saleTokens,
    totalSupply: Number(formatUnits(BigInt(m.totalSupply), 18)),
    start: Number(m.startTime),
    end: Number(m.endTime),
    website: m.website,
    xHandle: m.xHandle,
    logoHash: m.logoHash,
    creator: r.account,
    hardCapWei: cap,
    tokensForSaleWei: sale,
  };
}
