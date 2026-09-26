import { fmtEth, fmtNumber, shortAddress } from './format';
import type { SignedRequest } from './requests';
import { formatEther, formatUnits } from 'viem';

/** One-line, human description of a signed request. */
export function describeRequest(r: SignedRequest) {
  const m = r.message;
  switch (r.kind) {
    case 'Stake':
      return `Stake ${fmtEth(BigInt(m.amount))} in zPool`;
    case 'Unstake':
      return `Unstake ${fmtEth(BigInt(m.amount))} from zPool`;
    case 'Commit':
      return `Commit ${fmtEth(BigInt(m.amount))} to ${m.launchId}`;
    case 'TokenClaim':
      return `Claim ${fmtNumber(Number(formatUnits(BigInt(m.tokens), 18)), 2)} tokens from ${m.launchId}`;
    case 'Claim':
      return `Claim epoch ${m.epoch} ZEC to ${shortAddress(m.zcashAddress, 8, 6)} (${m.addressType})`;
    case 'Vote':
      return `Vote ${m.support} on ${m.proposalId} with ${fmtNumber(Number(formatEther(BigInt(m.weight))), 4)} ETH`;
    case 'Proposal':
      return `Propose: ${m.title}`;
    case 'CreateLaunch':
      return `Launch ${m.projectName}: deploy ${m.tokenSymbol}, sell ${fmtNumber(Number(formatUnits(BigInt(m.tokensForSale), 18)), 0)} for up to ${fmtEth(BigInt(m.hardCap), 4)}`;
  }
}
