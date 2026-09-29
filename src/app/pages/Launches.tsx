import { Link, useSearchParams } from 'react-router';
import { launchStatus, type LaunchStatus } from '@/app/data/launches';
import { useLaunches } from '@/app/lib/useLaunches';
import { usePosition } from '@/app/lib/useActive';
import { Empty, PageHeader, Tabs } from '@/app/ui/kit';
import { LaunchCard } from '@/app/ui/LaunchCard';
import { bpsToPercent, PROTOCOL } from '@/lib/protocol';

type Filter = LaunchStatus | 'all' | 'mine';
const FILTERS: Filter[] = ['live', 'upcoming', 'closed', 'mine', 'all'];

export default function Launches() {
  const [params, setParams] = useSearchParams();
  const raw = params.get('filter') as Filter | null;
  const filter: Filter = raw && FILTERS.includes(raw) ? raw : 'live';
  const { position, now } = usePosition();
  const launches = useLaunches();

  const count = (f: Filter) =>
    launches.filter((l) => (f === 'all' ? true : f === 'mine' ? (position.commitments.get(l.id) ?? 0n) > 0n : launchStatus(l, now) === f)).length;
  const list = launches.filter((l) =>
    filter === 'all' ? true : filter === 'mine' ? (position.commitments.get(l.id) ?? 0n) > 0n : launchStatus(l, now) === filter,
  );

  return (
    <>
      <PageHeader
        eyebrow="zLaunch"
        title="Launches"
        actions={
          <Link to="/app/create" className="btn btn-primary">
            Launch a token
          </Link>
        }
      >
        Fixed-price sales on Robinhood Chain. One wallet can commit up to {bpsToPercent(PROTOCOL.walletCapBps)} of a sale, and{' '}
        {bpsToPercent(PROTOCOL.feeBps)} of every raise funds the ZEC reward pool.
      </PageHeader>

      <div className="mb-[20px]">
        <Tabs
          value={filter}
          onChange={(v) => setParams(v === 'live' ? {} : { filter: v }, { replace: true })}
          items={[
            { value: 'live', label: 'Live', count: count('live') },
            { value: 'upcoming', label: 'Upcoming', count: count('upcoming') },
            { value: 'closed', label: 'Closed', count: count('closed') },
            { value: 'mine', label: 'My commitments', count: count('mine') },
            { value: 'all', label: 'All', count: count('all') },
          ]}
        />
      </div>

      {launches.length === 0 ? (
        <Empty title="No launches yet" action={<Link to="/app/create" className="btn btn-primary">Launch a token</Link>}>
          ZecPad deploys your token on Robinhood Chain and opens a fixed-price sale. The first launch will be listed here.
        </Empty>
      ) : list.length ? (
        <div className="grid gap-[16px] md:grid-cols-2 xl:grid-cols-3">
          {list.map((l) => (
            <LaunchCard key={l.id} launch={l} now={now} committed={position.commitments.get(l.id)} />
          ))}
        </div>
      ) : (
        <Empty
          title={filter === 'mine' ? 'You have not committed to a sale yet' : 'Nothing here right now'}
          action={
            filter !== 'live' ? (
              <button type="button" className="btn btn-ghost" onClick={() => setParams({}, { replace: true })}>
                Show live sales
              </button>
            ) : undefined
          }
        >
          {filter === 'mine' ? 'Pick a live sale and commit ETH; it will be listed here.' : 'Check the other tabs for upcoming and closed sales.'}
        </Empty>
      )}
    </>
  );
}
