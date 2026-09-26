import { sha256 } from 'viem';

// Zcash mainnet address validation for reward payouts.
// Transparent (t1 / t3) use base58check; Sapling (zs1) uses bech32; Unified (u1) and TEX (tex1) use bech32m.

export type ZcashAddressType = 'transparent' | 'tex' | 'sapling' | 'unified';

export type ZcashCheck =
  | { ok: true; type: ZcashAddressType; shielded: boolean; label: string }
  | { ok: false; error: string };

const B58 = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
const B32 = 'qpzry9x8gf2tvdw0s3jn54khce6mua7l';
const BECH32 = 1;
const BECH32M = 0x2bc830a3;

function base58Decode(s: string): Uint8Array | null {
  let n = 0n;
  for (const c of s) {
    const v = B58.indexOf(c);
    if (v < 0) return null;
    n = n * 58n + BigInt(v);
  }
  const bytes: number[] = [];
  while (n > 0n) {
    bytes.unshift(Number(n & 0xffn));
    n >>= 8n;
  }
  for (const c of s) {
    if (c !== '1') break;
    bytes.unshift(0);
  }
  return Uint8Array.from(bytes);
}

function polymod(values: number[]) {
  const GEN = [0x3b6a57b2, 0x26508e6d, 0x1ea119fa, 0x3d4233dd, 0x2a1462b3];
  let chk = 1;
  for (const v of values) {
    const top = chk >>> 25;
    chk = ((chk & 0x1ffffff) << 5) ^ v;
    for (let i = 0; i < 5; i++) if ((top >>> i) & 1) chk ^= GEN[i];
  }
  return chk >>> 0;
}

/** Returns the human-readable part when the bech32/bech32m checksum is valid. */
function bech32Hrp(addr: string, constant: number): string | null {
  const sep = addr.lastIndexOf('1');
  if (sep < 1 || addr.length - sep - 1 < 6) return null;
  const hrp = addr.slice(0, sep);
  const data: number[] = [];
  for (const c of addr.slice(sep + 1)) {
    const v = B32.indexOf(c);
    if (v < 0) return null;
    data.push(v);
  }
  const expanded = [...[...hrp].map((c) => c.charCodeAt(0) >> 5), 0, ...[...hrp].map((c) => c.charCodeAt(0) & 31)];
  return polymod([...expanded, ...data]) === constant ? hrp : null;
}

export function checkZcashAddress(input: string): ZcashCheck {
  const raw = input.trim();
  if (!raw) return { ok: false, error: 'Enter a Zcash address.' };
  if (/^(tm|ztestsapling|utest|textest)/i.test(raw)) {
    return { ok: false, error: 'That is a Zcash testnet address. Rewards are paid on Zcash mainnet.' };
  }

  // transparent: t1 (P2PKH) or t3 (P2SH)
  if (raw.startsWith('t1') || raw.startsWith('t3')) {
    const bytes = base58Decode(raw);
    if (!bytes || bytes.length !== 26) return { ok: false, error: 'This transparent address has the wrong length.' };
    const payload = bytes.slice(0, 22);
    const sum = sha256(sha256(payload, 'bytes'), 'bytes').slice(0, 4);
    const valid = sum.every((b, i) => b === bytes[22 + i]);
    const version = (bytes[0] << 8) | bytes[1];
    if (!valid || (version !== 0x1cb8 && version !== 0x1cbd)) {
      return { ok: false, error: 'Checksum failed. Check the address for a typo.' };
    }
    return { ok: true, type: 'transparent', shielded: false, label: 'Transparent address' };
  }

  if (raw !== raw.toLowerCase() && raw !== raw.toUpperCase()) {
    return { ok: false, error: 'Shielded addresses cannot mix upper and lower case.' };
  }
  const addr = raw.toLowerCase();

  if (addr.startsWith('zs1')) {
    if (addr.length !== 78) return { ok: false, error: 'A Sapling address is 78 characters long.' };
    if (bech32Hrp(addr, BECH32) !== 'zs') return { ok: false, error: 'Checksum failed. Check the address for a typo.' };
    return { ok: true, type: 'sapling', shielded: true, label: 'Shielded Sapling address' };
  }
  if (addr.startsWith('u1')) {
    if (bech32Hrp(addr, BECH32M) !== 'u') return { ok: false, error: 'Checksum failed. Check the address for a typo.' };
    return { ok: true, type: 'unified', shielded: true, label: 'Unified address' };
  }
  if (addr.startsWith('tex1')) {
    if (bech32Hrp(addr, BECH32M) !== 'tex') return { ok: false, error: 'Checksum failed. Check the address for a typo.' };
    return { ok: true, type: 'tex', shielded: false, label: 'Transparent (TEX) address' };
  }
  return { ok: false, error: 'Use a Zcash address that starts with t1, t3, tex1, zs1 or u1.' };
}
