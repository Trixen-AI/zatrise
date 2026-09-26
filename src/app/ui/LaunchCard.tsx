import { Link } from 'react-router';
import { hardCapWei, type Launch, launchStatus } from '@/app/data/launches';
import { fmtDuration, fmtEth, fmtNumber } from '@/app/lib/format';
import { useLogo } from '@/app/lib/logos';
import { Badge } from './kit';

export function StatusBadge({ launch, now }: { launch: Launch; now: number }) {
  const s = launchStatus(launch, now);
  if (s === 'live') return <Badge tone="gold">● Live</Badge>;
  if (s === 'upcoming') return <Badge tone="blue">Upcoming</Badge>;
  return <Badge>Closed</Badge>;
}

function windowText(launch: Launch, now: number) {
  const s = launchStatus(launch, now);
  if (s === 'live') return `Ends in ${fmtDuration(launch.end - now)}`;
  if (s === 'upcoming') return `Opens in ${fmtDuration(launch.start - now)}`;
  return 'Sale closed';
}

/** The launch logo, or a monogram tile when no logo is available. */
export function LaunchMark({ launch, size = 48 }: { launch: Launch; size?: number }) {
  const logo = useLogo(launch.logoHash);
  if (logo) {
    return <img src={logo} alt={`${launch.name} logo`} width={size} height={size} className="shrink-0 rounded-[14px] border border-white/15 object-cover" style={{ width: size, height: size }} />;
  }
  return (
    <span
      className="flex shrink-0 items-center justify-center rounded-[14px] border border-gold/40 bg-gold-deep font-urbanist font-extrabold text-gold"
      style={{ width: size, height: size, fontSize: size * 0.36 }}
      aria-hidden
    >
      {launch.symbol.slice(0, 2)}
    </span>
  );
}

export function LaunchCard({ launch, now, committed }: { launch: Launch; now: number; committed?: bigint }) {
  return (
    <Link
      to={`/app/launches/${launch.id}`}
      className="group flex flex-col gap-[18px] rounded-[20px] border-[1.2px] border-white/15 bg-surface p-[20px] transition-colors hover:border-gold/60 lg:p-[24px]"
    >
      <div className="flex items-start justify-between gap-[12px]">
        <div className="flex min-w-0 items-center gap-[14px]">
          <LaunchMark launch={launch} />
          <div className="min-w-0">
            <p className="truncate text-[2rem] font-semibold leading-120">{launch.name}</p>
            <p className="t-small flex flex-wrap items-center gap-x-[6px] text-muted">
              {launch.symbol} · {launch.category}
            </p>
          </div>
        </div>
        <StatusBadge launch={launch} now={now} />
      </div>
      <p className="t-body min-h-[44px] text-soft">{launch.tagline}</p>
      <div className="grid grid-cols-2 gap-[12px] border-t border-white/10 pt-[16px]">
        <div>
          <p className="t-small text-muted">Price</p>
          <p className="t-body-sb">{fmtNumber(launch.price, 6)} ETH</p>
        </div>
        <div>
          <p className="t-small text-muted">Hard cap</p>
          <p className="t-body-sb">{fmtEth(hardCapWei(launch), 2)}</p>
        </div>
      </div>
      <div className="flex items-center justify-between gap-[12px]">
        <p className="t-small text-muted-2">{windowText(launch, now)}</p>
        {committed && committed > 0n ? <Badge tone="green">You: {fmtEth(committed, 4)}</Badge> : <span className="t-small-m text-gold group-hover:underline">View sale →</span>}
      </div>
    </Link>
  );
}
