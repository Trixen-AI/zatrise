import { useSyncExternalStore } from 'react';
import { type Address, getAddress, type Hex, verifyTypedData } from 'viem';
import { PROTOCOL } from '@/lib/protocol';

// Every product action is an EIP-712 typed request the user approves in their wallet.
// The wallet shows each field in plain words; nothing is transferred by signing.

export const DOMAIN_NAME = 'ZecPad';
export const DOMAIN_VERSION = '1';

export const domain = (chainId: number) => ({ name: DOMAIN_NAME, version: DOMAIN_VERSION, chainId }) as const;

const base = [
  { name: 'account', type: 'address' },
  { name: 'nonce', type: 'uint256' },
  { name: 'issuedAt', type: 'uint64' },
] as const;

export const TYPES = {
  Stake: [...base, { name: 'amount', type: 'uint256' }, { name: 'lockupDays', type: 'uint16' }],
  Unstake: [...base, { name: 'amount', type: 'uint256' }],
  Commit: [
    ...base,
    { name: 'launchId', type: 'string' },
    { name: 'amount', type: 'uint256' },
    { name: 'tokensOut', type: 'uint256' },
  ],
  TokenClaim: [...base, { name: 'launchId', type: 'string' }, { name: 'tokens', type: 'uint256' }],
  Claim: [
    ...base,
    { name: 'epoch', type: 'uint32' },
    { name: 'zcashAddress', type: 'string' },
    { name: 'addressType', type: 'string' },
  ],
  Vote: [
    ...base,
    { name: 'proposalId', type: 'string' },
    { name: 'support', type: 'string' },
    { name: 'weight', type: 'uint256' },
  ],
  Proposal: [
    ...base,
    { name: 'title', type: 'string' },
    { name: 'parameter', type: 'string' },
    { name: 'proposedValue', type: 'string' },
    { name: 'rationale', type: 'string' },
  ],
  // A team asks ZecPad to deploy its token and open a sale. The logo is bound by its keccak256 hash.
  CreateLaunch: [
    ...base,
    { name: 'launchId', type: 'string' },
    { name: 'projectName', type: 'string' },
    { name: 'tokenName', type: 'string' },
    { name: 'tokenSymbol', type: 'string' },
    { name: 'totalSupply', type: 'uint256' },
    { name: 'tokensForSale', type: 'uint256' },
    { name: 'hardCap', type: 'uint256' },
    { name: 'startTime', type: 'uint64' },
    { name: 'endTime', type: 'uint64' },
    { name: 'category', type: 'string' },
    { name: 'tagline', type: 'string' },
    { name: 'description', type: 'string' },
    { name: 'website', type: 'string' },
    { name: 'xHandle', type: 'string' },
    { name: 'logoHash', type: 'bytes32' },
  ],
} as const;

export type RequestKind = keyof typeof TYPES;

/** Stored form: integers as decimal strings so the record survives JSON. */
export type SignedRequest = {
  id: string;
  kind: RequestKind;
  chainId: number;
  account: Address;
  message: Record<string, string>;
  signature: Hex;
  createdAt: number;
};

// ------------------------------------------------------------------ store
const KEY = 'zecpad:requests:v1';
let cache: SignedRequest[] | null = null;
const listeners = new Set<() => void>();

function read(): SignedRequest[] {
  if (cache) return cache;
  try {
    const raw = localStorage.getItem(KEY);
    // drop records of request kinds this version no longer knows
    cache = raw ? (JSON.parse(raw) as SignedRequest[]).filter((r) => r.kind in TYPES) : [];
  } catch {
    cache = [];
  }
  return cache;
}

function write(next: SignedRequest[]) {
  cache = next;
  try {
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    /* storage full or blocked: keep the in-memory copy for this session */
  }
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  const onStorage = (e: StorageEvent) => {
    if (e.key === KEY) {
      cache = null;
      listener();
    }
  };
  window.addEventListener('storage', onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener('storage', onStorage);
  };
}

const EMPTY: SignedRequest[] = [];

/** All signed requests of one account (newest first), optionally on one chain. */
export function useRequests(account?: string, chainId?: number) {
  const all = useSyncExternalStore(subscribe, read, () => EMPTY);
  if (!account) return EMPTY;
  const lower = account.toLowerCase();
  return all.filter((r) => r.account.toLowerCase() === lower && (chainId === undefined || r.chainId === chainId));
}

/** Every stored request of one kind, from any account (newest first). */
export function useAllRequests(kind: RequestKind) {
  const all = useSyncExternalStore(subscribe, read, () => EMPTY);
  return all.filter((r) => r.kind === kind);
}

export function saveRequest(r: SignedRequest) {
  write([r, ...read()]);
}

export function nextNonce(account: string) {
  const lower = account.toLowerCase();
  return read().filter((r) => r.account.toLowerCase() === lower).length + 1;
}

// ------------------------------------------------------------------ typing helpers
const INT_TYPES = new Set(['uint256', 'uint64', 'uint32', 'uint16', 'uint8']);

/** Rebuild the typed message (bigints) from its stored string form. */
export function toTypedMessage(kind: RequestKind, message: Record<string, string>) {
  const out: Record<string, unknown> = {};
  for (const f of TYPES[kind]) {
    const v = message[f.name];
    if (INT_TYPES.has(f.type)) out[f.name] = BigInt(v);
    else if (f.type === 'address') out[f.name] = getAddress(v);
    else out[f.name] = v;
  }
  return out;
}

export async function verifyRequest(r: SignedRequest) {
  return verifyTypedData({
    address: r.account,
    domain: domain(r.chainId),
    types: { [r.kind]: TYPES[r.kind] },
    primaryType: r.kind,
    message: toTypedMessage(r.kind, r.message),
    signature: r.signature,
  } as Parameters<typeof verifyTypedData>[0]);
}

// ------------------------------------------------------------------ labels
export const KIND_LABEL: Record<RequestKind, string> = {
  Stake: 'Stake',
  Unstake: 'Unstake',
  Commit: 'Commit',
  TokenClaim: 'Token claim',
  Claim: 'ZEC claim',
  Vote: 'Vote',
  Proposal: 'Proposal',
  CreateLaunch: 'Launch created',
};

// ------------------------------------------------------------------ positions derived from requests
export type Position = {
  staked: bigint;
  weightEthSeconds: bigint; // wei-seconds
  unlockAt: number; // unix seconds, 0 when nothing staked
  lastStakeAt: number;
  commitments: Map<string, bigint>;
  votes: Map<string, string>;
  claims: Map<number, SignedRequest>;
  tokenClaims: Set<string>;
};

export function derivePosition(requests: SignedRequest[], now: number, since = 0): Position {
  let staked = 0n;
  let weight = 0n;
  let lastStakeAt = 0;
  const commitments = new Map<string, bigint>();
  const votes = new Map<string, string>();
  const claims = new Map<number, SignedRequest>();
  const tokenClaims = new Set<string>();
  // oldest first so balances evolve in order
  for (const r of [...requests].reverse()) {
    const t = Number(r.message.issuedAt);
    const from = BigInt(Math.max(t, since));
    const elapsed = BigInt(now) > from ? BigInt(now) - from : 0n;
    if (r.kind === 'Stake') {
      const a = BigInt(r.message.amount);
      staked += a;
      weight += a * elapsed;
      lastStakeAt = Math.max(lastStakeAt, t);
    } else if (r.kind === 'Unstake') {
      const a = BigInt(r.message.amount);
      staked -= a;
      weight -= a * elapsed;
    } else if (r.kind === 'Commit') {
      const id = r.message.launchId;
      commitments.set(id, (commitments.get(id) ?? 0n) + BigInt(r.message.amount));
    } else if (r.kind === 'Vote') {
      votes.set(r.message.proposalId, r.message.support);
    } else if (r.kind === 'Claim') {
      claims.set(Number(r.message.epoch), r);
    } else if (r.kind === 'TokenClaim') {
      tokenClaims.add(r.message.launchId);
    }
  }
  if (staked < 0n) staked = 0n;
  if (weight < 0n) weight = 0n;
  const unlockAt = staked > 0n ? lastStakeAt + PROTOCOL.lockup : 0;
  return { staked, weightEthSeconds: weight, unlockAt, lastStakeAt, commitments, votes, claims, tokenClaims };
}

