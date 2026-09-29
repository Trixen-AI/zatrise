import { useState } from 'react';
import { Link } from 'react-router';
import { describeRequest } from '@/app/lib/describe';
import { fmtDate, shortAddress } from '@/app/lib/format';
import { KIND_LABEL, type RequestKind, type SignedRequest, useRequests, verifyRequest } from '@/app/lib/requests';
import { useActive } from '@/app/lib/useActive';
import { Badge, Card, CopyButton, Empty, PageHeader, Tabs } from '@/app/ui/kit';

type Filter = 'all' | RequestKind;
type Verdict = 'checking' | 'valid' | 'invalid';

const NET: Record<number, string> = { 4663: 'Mainnet', 46630: 'Testnet' };

function download(records: SignedRequest[]) {
  const blob = new Blob([JSON.stringify(records, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `zecpad-requests-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export default function Activity() {
  const { address, isConnected } = useActive();
  const requests = useRequests(address);
  const [filter, setFilter] = useState<Filter>('all');
  const [verdicts, setVerdicts] = useState<Record<string, Verdict>>({});

  const kinds = [...new Set(requests.map((r) => r.kind))];
  const list = filter === 'all' ? requests : requests.filter((r) => r.kind === filter);

  async function verify(r: SignedRequest) {
    setVerdicts((v) => ({ ...v, [r.id]: 'checking' }));
    const ok = await verifyRequest(r).catch(() => false);
    setVerdicts((v) => ({ ...v, [r.id]: ok ? 'valid' : 'invalid' }));
  }

  return (
    <>
      <PageHeader
        eyebrow="Activity"
        title="Everything you signed"
        actions={
          requests.length ? (
            <button type="button" className="btn btn-ghost" onClick={() => download(requests)}>
              Export JSON
            </button>
          ) : undefined
        }
      >
        Each approval is an EIP-712 request signed by your wallet. Re-check any signature against your address at any time.
      </PageHeader>

      {!isConnected ? (
        <Empty title="Connect a wallet to see its requests" />
      ) : requests.length === 0 ? (
        <Empty title="No requests yet" action={<Link to="/app/stake" className="btn btn-ghost">Start with zPool</Link>}>
          Stake, commit, claim or vote, and every request you approve is listed here.
        </Empty>
      ) : (
        <>
          <div className="mb-[16px]">
            <Tabs
              value={filter}
              onChange={setFilter}
              items={[{ value: 'all' as Filter, label: 'All', count: requests.length }, ...kinds.map((k) => ({ value: k as Filter, label: KIND_LABEL[k], count: requests.filter((r) => r.kind === k).length }))]}
            />
          </div>
          <Card className="p-0 lg:p-0">
            <ul>
              {list.map((r) => {
                const v = verdicts[r.id];
                return (
                  <li key={r.id} className="flex flex-col gap-[10px] border-t border-white/10 p-[18px] first:border-t-0 lg:flex-row lg:items-center lg:justify-between lg:px-[24px]">
                    <div className="flex min-w-0 flex-col gap-[6px]">
                      <div className="flex flex-wrap items-center gap-[8px]">
                        <Badge tone="gold">{KIND_LABEL[r.kind]}</Badge>
                        <Badge tone={r.chainId === 46630 ? 'blue' : 'green'}>{NET[r.chainId] ?? r.chainId}</Badge>
                        <span className="t-small text-muted">{fmtDate(Math.floor(r.createdAt / 1000))}</span>
                      </div>
                      <p className="t-body-m">{describeRequest(r)}</p>
                      <p className="t-small flex items-center gap-[4px] font-mono text-muted">
                        sig {shortAddress(r.signature, 10, 8)} <CopyButton text={r.signature} label="Copy signature" />
                      </p>
                    </div>
                    <div className="flex shrink-0 items-center gap-[10px]">
                      {v === 'valid' && <Badge tone="green">Signature valid</Badge>}
                      {v === 'invalid' && <Badge tone="red">Signature invalid</Badge>}
                      <button type="button" onClick={() => verify(r)} disabled={v === 'checking'} className="t-small-m rounded-full border border-white/15 px-[14px] py-[7px] text-soft hover:border-gold hover:text-gold disabled:opacity-50">
                        {v === 'checking' ? 'Checking…' : 'Verify'}
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          </Card>
        </>
      )}
    </>
  );
}
