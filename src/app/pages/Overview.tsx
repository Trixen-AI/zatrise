import { useAppKit } from '@reown/appkit/react';
import { Link } from 'react-router';
import { formatEther } from 'viem';
import { launchStatus } from '@/app/data/launches';
import { txUrl, useTransactions } from '@/app/lib/blockscout';
import { describeRequest } from '@/app/lib/describe';
import { fmtAgo, fmtDuration, fmtEth, fmtEthDays, fmtNumber, shortAddress } from '@/app/lib/format';
import { useActive, usePosition } from '@/app/lib/useActive';
import { useLaunches } from '@/app/lib/useLaunches';
import { IconLaunch, IconPool, IconRewards, IconVote } from '@/app/ui/icons';
import { Card, CardTitle, Empty, PageHeader, Progress, Stat } from '@/app/ui/kit';
import { LaunchCard } from '@/app/ui/LaunchCard';
import { epochEnd, epochStart, PROTOCOL } from '@/lib/protocol';

const ACTIONS = [
  { to: '/app/stake', title: 'Stake ETH', body: 'Build weight in zPool', icon: IconPool },
  { to: '/app/launches', title: 'Commit to a launch', body: 'Back a live sale', icon: IconLaunch },
  { to: '/app/rewards', title: 'Claim ZEC', body: 'Clear or shielded payout', icon: IconRewards },
  { to: '/app/govern', title: 'Vote', body: 'Set the loop parameters', icon: IconVote },
];

export default function Overview() {
  const { address, chainId, isConnected, balance } = useActive();
  const { position, epochWeight, epoch, now, requests } = usePosition();
  const { open } = useAppKit();
  const txs = useTransactions(chainId, address);
  const launches = useLaunches();
  const live = launches.filter((l) => launchStatus(l, now) === 'live');
  const start = epochStart(epoch);
  const end = epochEnd(epoch);

  return (
    <>
      <PageHeader
        eyebrow="Overview"
        title={isConnected ? 'Your loop at a glance' : 'Welcome to ZecPad'}
        actions={
          isConnected ? (
            <Link to="/app/launches" className="btn btn-primary">
              Explore launches
            </Link>
          ) : (
            <button type="button" onClick={() => open()} className="btn btn-primary">
              Connect wallet
            </button>
          )
        }
      >
        {isConnected
          ? `Connected as ${shortAddress(address)} on ${chainId === 46630 ? 'Robinhood Chain Testnet' : 'Robinhood Chain'}.`
          : 'Connect a wallet on Robinhood Chain to stake, commit to launches and claim your ZEC.'}
      </PageHeader>

      <div className="grid gap-[16px] sm:grid-cols-2 xl:grid-cols-4">
        <Card>
          <Stat label="Wallet balance" value={isConnected ? (balance !== undefined ? fmtEth(balance) : '…') : '0 ETH'} hint="Read live from Robinhood Chain" />
        </Card>
        <Card>
          <Stat label="Staked in zPool" value={fmtEth(position.staked)} hint={position.staked > 0n ? `Unlocks ${now >= position.unlockAt ? 'now' : `in ${fmtDuration(position.unlockAt - now)}`}` : 'Stake to start building weight'} />
        </Card>
        <Card>
          <Stat label={`Weight in epoch ${epoch}`} value={fmtEthDays(epochWeight)} accent hint="Stake x time since the epoch opened" />
        </Card>
        <Card>
          <Stat label={`Epoch ${epoch} closes in`} value={fmtDuration(end - now)} hint={<Progress value={(now - start) / PROTOCOL.epochLength} />} />
        </Card>
      </div>

      <div className="mt-[16px] grid gap-[16px] xl:grid-cols-[1fr_360px]">
        <Card>
          <CardTitle action={<Link to="/app/launches" className="t-small-m text-gold hover:underline">All launches →</Link>}>Live now</CardTitle>
          {live.length ? (
            <div className="grid gap-[16px] md:grid-cols-2">
              {live.map((l) => (
                <LaunchCard key={l.id} launch={l} now={now} committed={position.commitments.get(l.id)} />
              ))}
            </div>
          ) : (
            <Empty title="No sale is live right now" action={<Link to="/app/create" className="btn btn-ghost">Launch a token</Link>}>
              Live sales appear here as soon as they open.
            </Empty>
          )}
        </Card>
        <Card>
          <CardTitle>Do next</CardTitle>
          <div className="flex flex-col gap-[10px]">
            {ACTIONS.map(({ to, title, body, icon: Icon }) => (
              <Link key={to} to={to} className="flex items-center gap-[14px] rounded-[14px] border border-white/10 bg-bg p-[14px] transition-colors hover:border-gold/60">
                <span className="flex h-[40px] w-[40px] items-center justify-center rounded-[12px] bg-gold-deep text-gold">
                  <Icon />
                </span>
                <span className="flex flex-col">
                  <span className="t-body-sb">{title}</span>
                  <span className="t-small text-muted">{body}</span>
                </span>
              </Link>
            ))}
          </div>
        </Card>
      </div>

      <div className="mt-[16px] grid gap-[16px] xl:grid-cols-2">
        <Card>
          <CardTitle action={<Link to="/app/activity" className="t-small-m text-gold hover:underline">All requests →</Link>}>Your signed requests</CardTitle>
          {requests.length ? (
            <ul className="flex flex-col">
              {requests.slice(0, 5).map((r) => (
                <li key={r.id} className="flex items-center justify-between gap-[12px] border-t border-white/10 py-[12px] first:border-t-0">
                  <span className="t-body truncate">{describeRequest(r)}</span>
                  <span className="t-small shrink-0 text-muted">{fmtAgo(Math.floor(r.createdAt / 1000), now)}</span>
                </li>
              ))}
            </ul>
          ) : (
            <Empty title="Nothing signed yet">Stake, commit or claim and each approval you sign shows up here.</Empty>
          )}
        </Card>
        <Card>
          <CardTitle action={<Link to="/app/wallet" className="t-small-m text-gold hover:underline">Wallet →</Link>}>Onchain activity</CardTitle>
          {!isConnected ? (
            <Empty title="Connect to see your transactions">Pulled live from the Robinhood Chain explorer.</Empty>
          ) : txs.isLoading ? (
            <p className="t-small text-muted">Loading transactions…</p>
          ) : txs.isError ? (
            <p className="t-small text-[#ff9aae]">The explorer did not respond. Try again in a moment.</p>
          ) : txs.data?.length ? (
            <ul className="flex flex-col">
              {txs.data.slice(0, 5).map((t) => (
                <li key={t.hash} className="flex items-center justify-between gap-[12px] border-t border-white/10 py-[12px] first:border-t-0">
                  <a href={txUrl(chainId, t.hash)} target="_blank" rel="noopener noreferrer" className="t-body truncate hover:text-gold">
                    {t.method ?? 'Transfer'} · {shortAddress(t.hash, 8, 6)}
                  </a>
                  <span className="t-small shrink-0 text-muted">
                    {fmtNumber(Number(formatEther(BigInt(t.value))), 4)} ETH · {fmtAgo(Math.floor(new Date(t.timestamp).getTime() / 1000), now)}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <Empty title="No transactions on this network yet">Fund this wallet on Robinhood Chain to get started.</Empty>
          )}
        </Card>
      </div>
    </>
  );
}
