import { useState } from 'react';
import { Link } from 'react-router';
import { PARAMETERS, PROPOSALS } from '@/app/data/proposals';
import { fmtDate, fmtDuration, fmtEth } from '@/app/lib/format';
import { useActive, usePosition } from '@/app/lib/useActive';
import { useSignRequest } from '@/app/lib/useSignRequest';
import { Badge, Card, CardTitle, Empty, Field, inputClass, PageHeader, Stat, SubmitButton } from '@/app/ui/kit';
import { PROTOCOL } from '@/lib/protocol';

const SUPPORT_TONE = { For: 'green', Against: 'red', Abstain: 'muted' } as const;

export default function Govern() {
  const { isConnected } = useActive();
  const { position, requests, now } = usePosition();
  const { sign, pending } = useSignRequest();
  const drafts = requests.filter((r) => r.kind === 'Proposal');

  const [title, setTitle] = useState('');
  const [parameter, setParameter] = useState(PARAMETERS[0]);
  const [proposed, setProposed] = useState('');
  const [rationale, setRationale] = useState('');
  const [tried, setTried] = useState(false);

  const errors = {
    title: title.trim().length < 8 ? 'Give the proposal a title of at least 8 characters.' : null,
    proposed: !proposed.trim() ? 'Say what the new value should be.' : null,
    rationale: rationale.trim().length < 40 ? 'Make the case in at least 40 characters.' : null,
    stake: isConnected && position.staked === 0n ? 'Only stakers can propose. Stake any amount in zPool first.' : null,
  };
  const invalid = Object.values(errors).some(Boolean);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setTried(true);
    if (invalid) return;
    const ok = await sign(
      'Proposal',
      { title: title.trim(), parameter, proposedValue: proposed.trim(), rationale: rationale.trim() },
      { title: 'Proposal signed', body: 'It is listed below as your draft.' },
    );
    if (ok) {
      setTitle('');
      setProposed('');
      setRationale('');
      setTried(false);
    }
  }

  return (
    <>
      <PageHeader eyebrow="zVote" title="Governance">
        Stakers set the numbers that run the loop. Your staked ETH is your voting weight, and each vote stays open for{' '}
        {PROTOCOL.votingPeriod / 86_400} days.
      </PageHeader>

      <div className="grid gap-[16px] sm:grid-cols-3">
        <Card>
          <Stat label="Your voting weight" value={fmtEth(position.staked)} accent hint={position.staked === 0n ? 'Stake in zPool to vote' : 'Equal to your stake'} />
        </Card>
        <Card>
          <Stat label="Votes you cast" value={position.votes.size} />
        </Card>
        <Card>
          <Stat label="Your drafts" value={drafts.length} />
        </Card>
      </div>

      <div className="mt-[16px] grid gap-[16px] xl:grid-cols-[1fr_420px]">
        <Card>
          <CardTitle>Proposals</CardTitle>
          <ul className="flex flex-col gap-[12px]">
            {PROPOSALS.map((p) => {
              const open = now >= p.start && now < p.end;
              const mine = position.votes.get(p.id) as keyof typeof SUPPORT_TONE | undefined;
              return (
                <li key={p.id}>
                  <Link to={`/app/govern/${p.id}`} className="flex flex-col gap-[10px] rounded-[16px] border border-white/10 bg-bg p-[16px] transition-colors hover:border-gold/60">
                    <div className="flex flex-wrap items-center justify-between gap-[8px]">
                      <span className="t-small-m text-muted">{p.id}</span>
                      <div className="flex gap-[8px]">
                        {mine && <Badge tone={SUPPORT_TONE[mine]}>You voted {mine}</Badge>}
                        {open ? <Badge tone="gold">Voting, {fmtDuration(p.end - now)} left</Badge> : now < p.start ? <Badge tone="blue">Opens {fmtDate(p.start, false)}</Badge> : <Badge>Closed</Badge>}
                      </div>
                    </div>
                    <p className="text-[1.8rem] font-semibold leading-130">{p.title}</p>
                    <p className="t-small text-muted-2">
                      {p.parameter}: {p.currentValue} → {p.proposedValue}
                    </p>
                  </Link>
                </li>
              );
            })}
            {drafts.map((d) => (
              <li key={d.id} className="flex flex-col gap-[10px] rounded-[16px] border border-dashed border-line-2 p-[16px]">
                <div className="flex items-center justify-between gap-[8px]">
                  <span className="t-small-m text-muted">Draft by you</span>
                  <Badge tone="blue">Signed {fmtDate(Math.floor(d.createdAt / 1000), false)}</Badge>
                </div>
                <p className="text-[1.8rem] font-semibold leading-130">{d.message.title}</p>
                <p className="t-small text-muted-2">
                  {d.message.parameter} → {d.message.proposedValue}
                </p>
                <p className="t-small text-soft">{d.message.rationale}</p>
              </li>
            ))}
          </ul>
        </Card>

        <Card>
          <CardTitle>New proposal</CardTitle>
          <form onSubmit={submit} className="flex flex-col gap-[16px]">
            <Field label="Title" htmlFor="p-title" error={tried ? errors.title : null}>
              <input id="p-title" className={inputClass} value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Raise the per-wallet cap to 7%" />
            </Field>
            <Field label="Parameter" htmlFor="p-param">
              <select id="p-param" className={`${inputClass} appearance-none`} value={parameter} onChange={(e) => setParameter(e.target.value)}>
                {PARAMETERS.map((p) => (
                  <option key={p}>{p}</option>
                ))}
              </select>
            </Field>
            <Field label="Proposed value" htmlFor="p-value" error={tried ? errors.proposed : null}>
              <input id="p-value" className={inputClass} value={proposed} onChange={(e) => setProposed(e.target.value)} placeholder="7%" />
            </Field>
            <Field label="Why" htmlFor="p-why" error={tried ? errors.rationale : null} hint={`${rationale.trim().length} characters`}>
              <textarea id="p-why" rows={5} className={`${inputClass} resize-none`} value={rationale} onChange={(e) => setRationale(e.target.value)} placeholder="What changes for stakers and for teams, and why now." />
            </Field>
            {tried && errors.stake && (
              <Empty title="Stake first" action={<Link to="/app/stake" className="btn btn-ghost">Go to zPool</Link>}>
                {errors.stake}
              </Empty>
            )}
            <SubmitButton pending={pending === 'Proposal'}>{isConnected ? 'Sign proposal' : 'Connect wallet to propose'}</SubmitButton>
          </form>
        </Card>
      </div>
    </>
  );
}
