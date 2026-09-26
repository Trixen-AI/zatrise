import { useState } from 'react';
import { Link } from 'react-router';
import { formatEther, parseEther } from 'viem';
import { fmtDate, fmtDuration, fmtEth, fmtEthDays } from '@/app/lib/format';
import { useActive, usePosition } from '@/app/lib/useActive';
import { useSignRequest } from '@/app/lib/useSignRequest';
import { AmountInput, Badge, Card, CardTitle, Field, PageHeader, Row, Stat, SubmitButton, Tabs } from '@/app/ui/kit';
import { PROTOCOL } from '@/lib/protocol';

const GAS_BUFFER = parseEther('0.0005');
const toWei = (v: string) => {
  try {
    return v ? parseEther(v) : 0n;
  } catch {
    return 0n;
  }
};

export default function Stake() {
  const { balance, isConnected } = useActive();
  const { position, epochWeight, epoch, now } = usePosition();
  const { sign, pending } = useSignRequest();
  const [mode, setMode] = useState<'stake' | 'unstake'>('stake');
  const [amount, setAmount] = useState('');

  const value = toWei(amount);
  const locked = position.staked > 0n && now < position.unlockAt;
  const lockupDays = PROTOCOL.lockup / 86_400;

  let error: string | null = null;
  if (amount && value === 0n) error = 'Enter an amount above zero.';
  else if (mode === 'stake' && isConnected && balance !== undefined && value > balance) error = `Your wallet holds ${fmtEth(balance, 6)}.`;
  else if (mode === 'unstake' && value > position.staked) error = `You have ${fmtEth(position.staked, 6)} staked.`;

  const max = () => {
    if (mode === 'stake') {
      const spendable = balance !== undefined && balance > GAS_BUFFER ? balance - GAS_BUFFER : 0n;
      setAmount(spendable > 0n ? formatEther(spendable) : '0');
    } else setAmount(position.staked > 0n ? formatEther(position.staked) : '0');
  };

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (error || value === 0n) return;
    if (mode === 'stake') {
      const ok = await sign(
        'Stake',
        { amount: value, lockupDays },
        { title: `Staked ${fmtEth(value, 6)} in zPool`, body: `Locked until ${fmtDate(Math.floor(Date.now() / 1000) + PROTOCOL.lockup, false)}. Weight starts building now.` },
      );
      if (ok) setAmount('');
    } else {
      if (locked) return;
      const ok = await sign('Unstake', { amount: value }, { title: `Unstaked ${fmtEth(value, 6)}`, body: 'Your weight stops growing on this amount.' });
      if (ok) setAmount('');
    }
  }

  return (
    <>
      <PageHeader eyebrow="zPool" title="Stake ETH, build weight">
        Staked ETH earns weight every second it stays in the pool. Weight decides your share of each epoch's ZEC. A stake locks for {lockupDays} days.
      </PageHeader>

      <div className="grid gap-[16px] sm:grid-cols-3">
        <Card>
          <Stat label="Your stake" value={fmtEth(position.staked)} />
        </Card>
        <Card>
          <Stat label={`Weight in epoch ${epoch}`} value={fmtEthDays(epochWeight)} accent />
        </Card>
        <Card>
          <Stat
            label="Lock"
            value={position.staked === 0n ? 'No stake' : locked ? fmtDuration(position.unlockAt - now) : 'Unlocked'}
            hint={position.staked > 0n ? (locked ? `Unlocks ${fmtDate(position.unlockAt)}` : 'You can unstake any amount') : undefined}
          />
        </Card>
      </div>

      <div className="mt-[16px] grid gap-[16px] xl:grid-cols-[1fr_420px]">
        <Card>
          <CardTitle>How your weight grows</CardTitle>
          <div className="t-body flex flex-col gap-[12px] text-soft">
            <p>Weight is counted in ETH-days. 2 ETH staked for 3 days is 6 ETH-days.</p>
            <p>At the end of the epoch, your share of the ZEC pool is your weight divided by everyone's weight. ETH you commit to launches in the same epoch counts on top.</p>
            <p>
              Your stake is also your voting weight in <Link to="/app/govern" className="text-gold underline">zVote</Link>.
            </p>
          </div>
          <div className="mt-[20px] rounded-[14px] border border-white/10 bg-bg p-[14px]">
            <Row label="Total weight to date">{fmtEthDays(position.weightEthSeconds)}</Row>
            <Row label="Last stake">{position.lastStakeAt ? fmtDate(position.lastStakeAt) : '-'}</Row>
            <Row label="Lockup per stake">{lockupDays} days</Row>
          </div>
        </Card>

        <Card>
          <div className="mb-[18px]">
            <Tabs
              value={mode}
              onChange={(m) => {
                setMode(m);
                setAmount('');
              }}
              items={[
                { value: 'stake', label: 'Stake' },
                { value: 'unstake', label: 'Unstake' },
              ]}
            />
          </div>
          <form onSubmit={submit} className="flex flex-col gap-[16px]">
            <Field
              label={mode === 'stake' ? 'Amount to stake' : 'Amount to unstake'}
              htmlFor="stake-amount"
              error={error}
              aside={
                <span className="t-small text-muted">
                  {mode === 'stake'
                    ? `Balance: ${isConnected ? (balance !== undefined ? fmtEth(balance, 4) : '…') : 'not connected'}`
                    : `Staked: ${fmtEth(position.staked, 4)}`}
                </span>
              }
            >
              <AmountInput id="stake-amount" value={amount} onChange={setAmount} onMax={max} invalid={!!error} />
            </Field>
            {mode === 'stake' ? (
              <div className="rounded-[14px] border border-white/10 bg-bg p-[14px]">
                <Row label="New stake">{fmtEth(position.staked + value, 6)}</Row>
                <Row label="Locked until">{fmtDate(now + PROTOCOL.lockup, false)}</Row>
                <Row label="Weight per day">{value > 0n ? `+${fmtEth(position.staked + value, 4).replace(' ETH', '')} ETH-days` : '-'}</Row>
              </div>
            ) : locked ? (
              <div className="flex items-center gap-[10px] rounded-[14px] border border-white/10 bg-bg p-[14px]">
                <Badge tone="blue">Locked</Badge>
                <span className="t-small text-soft">Unstaking opens in {fmtDuration(position.unlockAt - now)}.</span>
              </div>
            ) : null}
            <SubmitButton pending={pending === 'Stake' || pending === 'Unstake'} disabled={!!error || value === 0n || (mode === 'unstake' && locked)}>
              {!isConnected ? 'Connect wallet to continue' : mode === 'stake' ? 'Stake and approve' : 'Unstake and approve'}
            </SubmitButton>
            <p className="t-small text-muted">Your wallet shows the request in plain words before you approve it.</p>
          </form>
        </Card>
      </div>
    </>
  );
}
