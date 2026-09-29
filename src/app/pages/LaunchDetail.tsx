import { useState } from 'react';
import { Link, useParams } from 'react-router';
import { formatEther, parseEther } from 'viem';
import { hardCapWei, launchStatus, tokensFor } from '@/app/data/launches';
import { fmtDate, fmtDuration, fmtEth, fmtNumber, shortAddress } from '@/app/lib/format';
import { useLaunch } from '@/app/lib/useLaunches';
import { useActive, usePosition } from '@/app/lib/useActive';
import { useSignRequest } from '@/app/lib/useSignRequest';
import { AmountInput, Badge, Card, CardTitle, Empty, Field, PageHeader, Progress, Row, SubmitButton } from '@/app/ui/kit';
import { LaunchMark, StatusBadge } from '@/app/ui/LaunchCard';
import { bpsToPercent, PROTOCOL } from '@/lib/protocol';

// Keep a little ETH back for gas when the user presses MAX.
const GAS_BUFFER = parseEther('0.0005');

function parseAmount(v: string) {
  try {
    return v ? parseEther(v) : 0n;
  } catch {
    return 0n;
  }
}

export default function LaunchDetail() {
  const { id } = useParams();
  const launch = useLaunch(id);
  const { address, balance, isConnected } = useActive();
  const { position, now } = usePosition();
  const { sign, pending } = useSignRequest();
  const [amount, setAmount] = useState('');

  if (!launch) {
    return <Empty title="Launch not found" action={<Link to="/app/launches" className="btn btn-ghost">Back to launches</Link>} />;
  }

  const status = launchStatus(launch, now);
  const cap = hardCapWei(launch);
  const walletCap = (cap * BigInt(PROTOCOL.walletCapBps)) / 10_000n;
  const committed = position.commitments.get(launch.id) ?? 0n;
  const remaining = walletCap > committed ? walletCap - committed : 0n;
  const value = parseAmount(amount);
  const tokensOut = tokensFor(launch, value);
  const myTokens = tokensFor(launch, committed);
  const mine = !!address && launch.creator?.toLowerCase() === address.toLowerCase();
  const claimedTokens = position.tokenClaims.has(launch.id);

  let error: string | null = null;
  if (amount && value === 0n) error = 'Enter an amount above zero.';
  else if (value > remaining) error = `That is over your cap. You can commit ${fmtEth(remaining, 6)} more to this sale.`;
  else if (isConnected && balance !== undefined && value > balance) error = `Your wallet holds ${fmtEth(balance, 6)}.`;

  const max = () => {
    const spendable = balance !== undefined && balance > GAS_BUFFER ? balance - GAS_BUFFER : 0n;
    const m = isConnected ? (spendable < remaining ? spendable : remaining) : remaining;
    setAmount(m > 0n ? formatEther(m) : '0');
  };

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (status !== 'live' || error || value === 0n) return;
    const ok = await sign(
      'Commit',
      { launchId: launch!.id, amount: value, tokensOut },
      { title: `Committed ${fmtEth(value, 6)} to ${launch!.name}`, body: `${fmtNumber(Number(formatEther(tokensOut)), 2)} ${launch!.symbol} reserved at the sale price.` },
    );
    if (ok) setAmount('');
  }

  async function claimTokens() {
    await sign(
      'TokenClaim',
      { launchId: launch!.id, tokens: myTokens },
      { title: `${launch!.symbol} claim signed`, body: `${fmtNumber(Number(formatEther(myTokens)), 2)} ${launch!.symbol} to your wallet.` },
    );
  }

  return (
    <>
      <Link to="/app/launches" className="t-small-m mb-[16px] inline-block text-muted hover:text-white">
        ← All launches
      </Link>
      <PageHeader eyebrow={launch.category} title={launch.name}>
        {launch.tagline}
      </PageHeader>

      <div className="grid gap-[16px] xl:grid-cols-[1fr_400px]">
        <div className="flex flex-col gap-[16px]">
          <Card>
            <div className="mb-[20px] flex flex-wrap items-center gap-[14px]">
              <LaunchMark launch={launch} size={56} />
              <div className="flex flex-col gap-[6px]">
                <p className="text-[2.2rem] font-semibold leading-120">
                  {launch.name} <span className="text-muted">({launch.symbol})</span>
                </p>
                <div className="flex flex-wrap gap-[8px]">
                  <StatusBadge launch={launch} now={now} />
                  {mine && <Badge tone="green">Created by you</Badge>}
                </div>
              </div>
            </div>
            <p className="t-body text-soft">{launch.description}</p>
            {(launch.website || launch.xHandle) && (
              <div className="mt-[16px] flex flex-wrap gap-[10px]">
                {launch.website && (
                  <a href={launch.website} target="_blank" rel="noopener noreferrer" className="t-small-m rounded-full border border-white/15 px-[12px] py-[6px] text-soft hover:border-gold hover:text-gold">
                    Website ↗
                  </a>
                )}
                {launch.xHandle && (
                  <a href={`https://x.com/${launch.xHandle}`} target="_blank" rel="noopener noreferrer" className="t-small-m rounded-full border border-white/15 px-[12px] py-[6px] text-soft hover:border-gold hover:text-gold">
                    @{launch.xHandle} ↗
                  </a>
                )}
              </div>
            )}
          </Card>

          {launch.tokenName && (
            <Card>
              <CardTitle>Token</CardTitle>
              <Row label="Name">{launch.tokenName}</Row>
              <Row label="Symbol">{launch.symbol}</Row>
              <Row label="Standard">ERC-20, 18 decimals, deployed by ZecPad</Row>
              {launch.totalSupply !== undefined && (
                <Row label="Total supply">
                  {fmtNumber(launch.totalSupply, 0)} {launch.symbol}
                </Row>
              )}
              {launch.creator && <Row label="Creator">{shortAddress(launch.creator)}</Row>}
            </Card>
          )}

          <Card>
            <CardTitle>Sale terms</CardTitle>
            <Row label="Price">{fmtNumber(launch.price, 8)} ETH per {launch.symbol}</Row>
            <Row label="Tokens for sale">
              {fmtNumber(launch.tokensForSale, 0)} {launch.symbol}
            </Row>
            <Row label="Hard cap">{fmtEth(cap, 4)}</Row>
            <Row label={`Per-wallet cap (${bpsToPercent(PROTOCOL.walletCapBps)})`}>{fmtEth(walletCap, 4)}</Row>
            <Row label="Opens">{fmtDate(launch.start)}</Row>
            <Row label="Closes">{fmtDate(launch.end)}</Row>
            <Row label="To zPool at close">{bpsToPercent(PROTOCOL.feeBps)} of the raise</Row>
          </Card>
        </div>

        <div className="flex flex-col gap-[16px]">
          <Card>
            <CardTitle>{status === 'closed' ? 'Your allocation' : 'Commit ETH'}</CardTitle>
            <div className="mb-[18px] flex flex-col gap-[8px]">
              <div className="flex justify-between">
                <span className="t-small text-muted">Your commitment</span>
                <span className="t-small-m">
                  {fmtEth(committed, 6)} / {fmtEth(walletCap, 4)}
                </span>
              </div>
              <Progress value={walletCap > 0n ? Number((committed * 10_000n) / walletCap) / 10_000 : 0} />
            </div>

            {status === 'closed' ? (
              committed > 0n ? (
                <div className="flex flex-col gap-[14px]">
                  <Row label="Tokens owed">
                    {fmtNumber(Number(formatEther(myTokens)), 2)} {launch.symbol}
                  </Row>
                  <button type="button" onClick={claimTokens} disabled={claimedTokens || pending === 'TokenClaim'} className="btn btn-primary w-full disabled:opacity-50">
                    {claimedTokens ? 'Claim signed' : pending === 'TokenClaim' ? 'Approve in your wallet…' : `Claim ${launch.symbol}`}
                  </button>
                </div>
              ) : (
                <p className="t-body text-muted-2">This sale closed on {fmtDate(launch.end, false)}. You did not commit to it.</p>
              )
            ) : (
              <form onSubmit={submit} className="flex flex-col gap-[16px]">
                <Field
                  label="Amount"
                  htmlFor="commit-amount"
                  error={error}
                  aside={
                    <span className="t-small text-muted">
                      Balance: {isConnected ? (balance !== undefined ? fmtEth(balance, 4) : '…') : 'not connected'}
                    </span>
                  }
                  hint={`You can commit ${fmtEth(remaining, 6)} more to this sale.`}
                >
                  <AmountInput id="commit-amount" value={amount} onChange={setAmount} onMax={max} invalid={!!error} />
                </Field>
                <div className="rounded-[14px] border border-white/10 bg-bg p-[14px]">
                  <Row label="You receive">
                    {fmtNumber(Number(formatEther(tokensOut)), 2)} {launch.symbol}
                  </Row>
                  <Row label="Adds to epoch weight">{value > 0n ? `${fmtNumber(Number(formatEther(value)), 6)} ETH committed` : '-'}</Row>
                </div>
                {status === 'upcoming' ? (
                  <button type="button" disabled className="btn btn-ghost w-full opacity-60">
                    Opens in {fmtDuration(launch.start - now)}
                  </button>
                ) : (
                  <SubmitButton pending={pending === 'Commit'} disabled={!!error || value === 0n}>
                    {isConnected ? 'Commit and approve' : 'Connect wallet to commit'}
                  </SubmitButton>
                )}
                <p className="t-small text-muted">Your wallet asks you to approve a signed commit request. Tokens are claimable when the sale closes.</p>
              </form>
            )}
          </Card>
        </div>
      </div>
    </>
  );
}
