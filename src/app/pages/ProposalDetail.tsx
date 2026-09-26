import { useState } from 'react';
import { Link, useParams } from 'react-router';
import { getProposal } from '@/app/data/proposals';
import { fmtDate, fmtDuration, fmtEth } from '@/app/lib/format';
import { useActive, usePosition } from '@/app/lib/useActive';
import { useSignRequest } from '@/app/lib/useSignRequest';
import { Badge, Card, CardTitle, Empty, PageHeader, Row, SubmitButton } from '@/app/ui/kit';

const OPTIONS = [
  { value: 'For', body: 'Adopt the proposed value.' },
  { value: 'Against', body: 'Keep things as they are.' },
  { value: 'Abstain', body: 'Count my weight toward turnout only.' },
] as const;

export default function ProposalDetail() {
  const { id } = useParams();
  const p = getProposal(id);
  const { isConnected } = useActive();
  const { position, now } = usePosition();
  const { sign, pending } = useSignRequest();
  const [choice, setChoice] = useState<(typeof OPTIONS)[number]['value'] | null>(null);

  if (!p) return <Empty title="Proposal not found" action={<Link to="/app/govern" className="btn btn-ghost">Back to governance</Link>} />;

  const open = now >= p.start && now < p.end;
  const voted = position.votes.get(p.id);
  const noStake = isConnected && position.staked === 0n;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!choice || !open || voted || noStake) return;
    await sign(
      'Vote',
      { proposalId: p!.id, support: choice, weight: position.staked },
      { title: `Voted ${choice} on ${p!.id}`, body: `${fmtEth(position.staked, 4)} of weight counted.` },
    );
  }

  return (
    <>
      <Link to="/app/govern" className="t-small-m mb-[16px] inline-block text-muted hover:text-white">
        ← All proposals
      </Link>
      <PageHeader eyebrow={p.id} title={p.title} />

      <div className="grid gap-[16px] xl:grid-cols-[1fr_400px]">
        <div className="flex flex-col gap-[16px]">
          <Card>
            <CardTitle>Summary</CardTitle>
            <p className="t-body text-soft">{p.summary}</p>
          </Card>
          <Card>
            <CardTitle>Details</CardTitle>
            <Row label="Parameter">{p.parameter}</Row>
            <Row label="Current value">{p.currentValue}</Row>
            <Row label="Proposed value">{p.proposedValue}</Row>
            <Row label="Voting opens">{fmtDate(p.start)}</Row>
            <Row label="Voting closes">{fmtDate(p.end)}</Row>
          </Card>
        </div>

        <Card>
          <CardTitle action={open ? <Badge tone="gold">{fmtDuration(p.end - now)} left</Badge> : <Badge>{now < p.start ? 'Not open' : 'Closed'}</Badge>}>Your vote</CardTitle>
          {voted ? (
            <div className="flex flex-col gap-[10px]">
              <Badge tone="green">You voted {voted}</Badge>
              <p className="t-small text-muted">One vote per wallet per proposal. It is listed on your Activity page.</p>
            </div>
          ) : !open ? (
            <p className="t-body text-muted-2">Voting on this proposal is {now < p.start ? 'not open yet' : 'closed'}.</p>
          ) : (
            <form onSubmit={submit} className="flex flex-col gap-[12px]">
              <fieldset className="flex flex-col gap-[10px]">
                <legend className="sr-only">Choose your vote</legend>
                {OPTIONS.map((o) => (
                  <label
                    key={o.value}
                    className={`flex cursor-pointer items-start gap-[12px] rounded-[14px] border p-[14px] transition-colors ${
                      choice === o.value ? 'border-gold bg-gold-deep/60' : 'border-white/10 bg-bg hover:border-line-2'
                    }`}
                  >
                    <input type="radio" name="vote" value={o.value} checked={choice === o.value} onChange={() => setChoice(o.value)} className="mt-[4px] accent-[var(--gold)]" />
                    <span className="flex flex-col">
                      <span className="t-body-sb">{o.value}</span>
                      <span className="t-small text-muted">{o.body}</span>
                    </span>
                  </label>
                ))}
              </fieldset>
              <Row label="Your weight">{fmtEth(position.staked, 4)}</Row>
              {noStake && (
                <p className="t-small text-[#ff9aae]">
                  You need a stake to vote. <Link to="/app/stake" className="underline">Stake in zPool</Link> first.
                </p>
              )}
              <SubmitButton pending={pending === 'Vote'} disabled={!choice || noStake}>
                {isConnected ? 'Vote and approve' : 'Connect wallet to vote'}
              </SubmitButton>
            </form>
          )}
        </Card>
      </div>
    </>
  );
}
