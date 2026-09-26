import { useState } from 'react';
import { fmtDate, fmtDuration, fmtEthDays, shortAddress } from '@/app/lib/format';
import { setPayoutAddress, usePayoutAddress } from '@/app/lib/payout';
import { useActive, usePosition } from '@/app/lib/useActive';
import { useSignRequest } from '@/app/lib/useSignRequest';
import { checkZcashAddress } from '@/app/lib/zcash';
import { IconEye, IconShield } from '@/app/ui/icons';
import { Badge, Card, CardTitle, Empty, Field, inputClass, PageHeader, Progress, Row, Stat, SubmitButton } from '@/app/ui/kit';
import { epochEnd, epochStart, PROTOCOL } from '@/lib/protocol';

function AddressVerdict({ value }: { value: string }) {
  if (!value.trim()) return null;
  const c = checkZcashAddress(value);
  if (!c.ok) return null;
  return c.shielded ? (
    <Badge tone="gold">
      <IconShield size={14} /> {c.label}
    </Badge>
  ) : (
    <Badge tone="blue">
      <IconEye size={14} /> {c.label}
    </Badge>
  );
}

export default function Rewards() {
  const { address, isConnected } = useActive();
  const { position, epochWeight, epoch, now } = usePosition();
  const { sign, pending } = useSignRequest();
  const saved = usePayoutAddress(address);

  const closed = Array.from({ length: epoch }, (_, i) => epoch - 1 - i);
  const [selected, setSelected] = useState<number | ''>(closed[0] ?? '');
  const [zaddr, setZaddr] = useState('');
  const [touched, setTouched] = useState(false);
  const [remember, setRemember] = useState(true);

  const target = zaddr || saved;
  const check = checkZcashAddress(target);
  const epochClaimed = selected !== '' && position.claims.has(selected);
  const addrError = (touched || zaddr) && !check.ok ? check.error : null;

  const start = epochStart(epoch);
  const end = epochEnd(epoch);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setTouched(true);
    if (selected === '' || !check.ok || epochClaimed) return;
    const ok = await sign(
      'Claim',
      { epoch: selected, zcashAddress: target.trim(), addressType: check.type },
      {
        title: `Epoch ${selected} claim signed`,
        body: `ZEC will be paid to ${shortAddress(target.trim(), 8, 6)} once allocations are settled.`,
      },
    );
    if (ok && remember && address) setPayoutAddress(address, target.trim());
    if (ok) setZaddr('');
  }

  return (
    <>
      <PageHeader eyebrow="Rewards" title="Your ZEC, epoch by epoch">
        Every {PROTOCOL.epochLength / 86_400} days the pool pays out in ZEC, split by the weight each wallet built. Claim a closed epoch to a
        transparent or shielded Zcash address.
      </PageHeader>

      <div className="grid gap-[16px] xl:grid-cols-[1fr_420px]">
        <div className="flex min-w-0 flex-col gap-[16px]">
          <Card>
            <div className="flex flex-wrap items-start justify-between gap-[16px]">
              <Stat label="Current epoch" value={`Epoch ${epoch}`} hint={`${fmtDate(start, false)} to ${fmtDate(end, false)}`} />
              <Stat label="Closes in" value={fmtDuration(end - now)} />
              <Stat label="Your weight so far" value={fmtEthDays(epochWeight)} accent />
            </div>
            <div className="mt-[20px]">
              <Progress value={(now - start) / PROTOCOL.epochLength} />
            </div>
          </Card>

        </div>

        <Card>
          <CardTitle>Claim ZEC</CardTitle>
          {closed.length === 0 ? (
            <Empty title="Nothing to claim yet">The first claim opens when epoch 0 closes.</Empty>
          ) : (
            <form onSubmit={submit} className="flex flex-col gap-[16px]">
              <Field label="Epoch" htmlFor="claim-epoch" error={epochClaimed ? 'You already signed a claim for this epoch.' : null}>
                <select
                  id="claim-epoch"
                  value={selected}
                  onChange={(e) => setSelected(e.target.value === '' ? '' : Number(e.target.value))}
                  className={`${inputClass} appearance-none`}
                >
                  {closed.map((e) => (
                    <option key={e} value={e}>
                      Epoch {e} · closed {fmtDate(epochEnd(e), false)}
                    </option>
                  ))}
                </select>
              </Field>
              <Field
                label="Zcash payout address"
                htmlFor="claim-zaddr"
                error={addrError}
                aside={<AddressVerdict value={target} />}
                hint={saved && !zaddr ? `Using your saved address ${shortAddress(saved, 8, 6)}.` : 'Starts with t1, t3, tex1, zs1 or u1.'}
              >
                <input
                  id="claim-zaddr"
                  className={`${inputClass} font-mono text-[1.4rem]`}
                  placeholder={saved || 'u1… or zs1… or t1…'}
                  spellCheck={false}
                  autoComplete="off"
                  value={zaddr}
                  aria-invalid={!!addrError}
                  onChange={(e) => setZaddr(e.target.value)}
                  onBlur={() => setTouched(true)}
                />
              </Field>
              <label className="t-small flex items-center gap-[10px] text-soft">
                <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} className="h-[16px] w-[16px] accent-[var(--gold)]" />
                Save as my default payout address
              </label>
              {check.ok && (
                <div className="rounded-[14px] border border-white/10 bg-bg p-[14px]">
                  <Row label="Pays to">{shortAddress(target.trim(), 10, 8)}</Row>
                  <Row label="Privacy">{check.shielded ? 'Amount and receiver encrypted' : 'Public on the Zcash chain'}</Row>
                </div>
              )}
              <SubmitButton pending={pending === 'Claim'} disabled={epochClaimed || selected === ''}>
                {isConnected ? 'Claim and approve' : 'Connect wallet to claim'}
              </SubmitButton>
              <p className="t-small text-muted">You sign with the wallet that earned the reward. The Zcash address is part of what you approve.</p>
            </form>
          )}
        </Card>
      </div>
    </>
  );
}
