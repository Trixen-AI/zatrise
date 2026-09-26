import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { parseEther, parseUnits } from 'viem';
import { CATEGORIES, launchFromRequest } from '@/app/data/launches';
import { fmtDate, fmtEth, fmtNumber } from '@/app/lib/format';
import { saveLogo } from '@/app/lib/logos';
import { useActive, usePosition } from '@/app/lib/useActive';
import { useLaunches } from '@/app/lib/useLaunches';
import { useNow } from '@/app/lib/useNow';
import { useSignRequest } from '@/app/lib/useSignRequest';
import { Badge, Card, CardTitle, Empty, Field, inputClass, PageHeader, Row, SubmitButton } from '@/app/ui/kit';
import { LaunchMark } from '@/app/ui/LaunchCard';
import { type LogoFile, LogoUpload } from '@/app/ui/LogoUpload';
import { bpsToPercent, PROTOCOL } from '@/lib/protocol';

const MAX_DAYS = 30;
const MAX_SUPPLY = 1_000_000_000_000;
const toUnix = (v: string) => (v ? Math.floor(new Date(v).getTime() / 1000) : 0);
const num = (v: string) => (v.trim() === '' ? NaN : Number(v));

const EMPTY_FORM = {
  projectName: '',
  tokenName: '',
  tokenSymbol: '',
  totalSupply: '',
  tokensForSale: '',
  hardCap: '',
  category: CATEGORIES[0],
  tagline: '',
  start: '',
  end: '',
  website: '',
  xHandle: '',
  description: '',
};

function slugId(symbol: string, taken: Set<string>) {
  let id = '';
  do id = `${symbol.toLowerCase()}-${Math.random().toString(36).slice(2, 6)}`;
  while (taken.has(id));
  return id;
}

export default function Create() {
  const navigate = useNavigate();
  const { chainId, isConnected } = useActive();
  const { requests } = usePosition();
  const launches = useLaunches();
  const now = useNow();
  const { sign, pending } = useSignRequest();
  const mine = requests.filter((r) => r.kind === 'CreateLaunch').map(launchFromRequest);

  const [f, setF] = useState(EMPTY_FORM);
  const [logo, setLogo] = useState<LogoFile | null>(null);
  const [tried, setTried] = useState(false);
  const set = (k: keyof typeof EMPTY_FORM) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setF((s) => ({ ...s, [k]: k === 'tokenSymbol' ? e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '') : e.target.value }));

  const supply = num(f.totalSupply);
  const forSale = num(f.tokensForSale);
  const cap = num(f.hardCap);
  const start = toUnix(f.start);
  const end = toUnix(f.end);
  const price = forSale > 0 && cap > 0 ? cap / forSale : 0;

  const errors: Record<string, string | null> = {
    projectName: f.projectName.trim().length < 2 ? 'Enter the project name.' : null,
    tokenName: f.tokenName.trim().length < 2 ? 'Enter the token name.' : f.tokenName.trim().length > 40 ? 'Keep the token name under 40 characters.' : null,
    tokenSymbol: !/^[A-Z0-9]{2,8}$/.test(f.tokenSymbol) ? 'Use 2 to 8 letters or digits.' : null,
    totalSupply: !(supply > 0) || !Number.isInteger(supply) ? 'Enter a whole number above zero.' : supply > MAX_SUPPLY ? 'That supply is too large.' : null,
    tokensForSale: !(forSale > 0) || !Number.isInteger(forSale) ? 'Enter a whole number above zero.' : supply > 0 && forSale > supply ? 'You cannot sell more than the total supply.' : null,
    hardCap: !(cap > 0) ? 'Enter the hard cap in ETH.' : null,
    tagline: f.tagline.trim().length < 8 ? 'Write a one-line pitch (at least 8 characters).' : f.tagline.trim().length > 90 ? 'Keep it under 90 characters.' : null,
    start: !start ? 'Pick when the sale opens.' : start < now ? 'The sale must open in the future.' : null,
    end: !end ? 'Pick when the sale closes.' : end <= start ? 'The sale must close after it opens.' : end - start > MAX_DAYS * 86_400 ? `A sale can run at most ${MAX_DAYS} days.` : null,
    website: !/^https:\/\/[^\s.]+\.[^\s]+$/.test(f.website.trim()) ? 'Use a full https:// link.' : null,
    xHandle: !/^@?[A-Za-z0-9_]{1,15}$/.test(f.xHandle.trim()) ? 'Enter an X handle, e.g. @yourproject.' : null,
    description: f.description.trim().length < 60 ? 'Describe the project in at least 60 characters.' : null,
    logo: !logo ? 'Upload a 500 × 500 logo.' : null,
  };
  const invalid = Object.values(errors).some(Boolean);
  const err = (k: keyof typeof errors) => (tried ? errors[k] : null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setTried(true);
    if (invalid || !logo) {
      document.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus();
      return;
    }
    const launchId = slugId(f.tokenSymbol, new Set(launches.map((l) => l.id)));
    const ok = await sign(
      'CreateLaunch',
      {
        launchId,
        projectName: f.projectName.trim(),
        tokenName: f.tokenName.trim(),
        tokenSymbol: f.tokenSymbol,
        totalSupply: parseUnits(f.totalSupply, 18),
        tokensForSale: parseUnits(f.tokensForSale, 18),
        hardCap: parseEther(f.hardCap),
        startTime: BigInt(start),
        endTime: BigInt(end),
        category: f.category,
        tagline: f.tagline.trim(),
        description: f.description.trim(),
        website: f.website.trim(),
        xHandle: f.xHandle.trim().replace(/^@/, ''),
        logoHash: logo.hash,
      },
      { title: `${f.projectName.trim()} is launching`, body: `${f.tokenSymbol} sale opens ${fmtDate(start)}.` },
    );
    if (ok) {
      saveLogo(logo.hash, logo.dataUrl);
      setF(EMPTY_FORM);
      setLogo(null);
      setTried(false);
      navigate(`/app/launches/${launchId}`);
    }
  }

  return (
    <>
      <PageHeader eyebrow="For teams" title="Launch a token">
        Zatrise deploys your token on {chainId === 46630 ? 'Robinhood Chain Testnet' : 'Robinhood Chain'} and opens a fixed-price sale. When
        it closes, {bpsToPercent(PROTOCOL.feeBps)} of the raise funds the ZEC reward pool and the rest goes to your wallet.
      </PageHeader>

      <div className="grid gap-[16px] xl:grid-cols-[1fr_380px]">
        <form onSubmit={submit} noValidate className="flex min-w-0 flex-col gap-[16px]">
          <Card>
            <CardTitle>Project</CardTitle>
            <div className="flex flex-col gap-[18px]">
              <div className="grid gap-[18px] md:grid-cols-2">
                <Field label="Project name" htmlFor="c-name" error={err('projectName')}>
                  <input id="c-name" className={inputClass} value={f.projectName} onChange={set('projectName')} placeholder="Your project" aria-invalid={!!err('projectName')} />
                </Field>
                <Field label="Category" htmlFor="c-cat">
                  <select id="c-cat" className={`${inputClass} appearance-none`} value={f.category} onChange={set('category')}>
                    {CATEGORIES.map((c) => (
                      <option key={c}>{c}</option>
                    ))}
                  </select>
                </Field>
              </div>
              <Field label="Logo" htmlFor="c-logo">
                <LogoUpload id="c-logo" value={logo} onChange={setLogo} error={err('logo')} />
              </Field>
              <Field label="One-line pitch" htmlFor="c-tagline" error={err('tagline')} hint={`${f.tagline.trim().length}/90`}>
                <input id="c-tagline" className={inputClass} value={f.tagline} onChange={set('tagline')} placeholder="What it does, in one line" aria-invalid={!!err('tagline')} />
              </Field>
              <Field label="What are you building?" htmlFor="c-desc" error={err('description')} hint={`${f.description.trim().length} characters`}>
                <textarea id="c-desc" rows={5} className={`${inputClass} resize-none`} value={f.description} onChange={set('description')} placeholder="What the project does, what the raise pays for, and who is on the team." aria-invalid={!!err('description')} />
              </Field>
              <div className="grid gap-[18px] md:grid-cols-2">
                <Field label="Website" htmlFor="c-web" error={err('website')}>
                  <input id="c-web" type="url" className={inputClass} value={f.website} onChange={set('website')} placeholder="https://" aria-invalid={!!err('website')} />
                </Field>
                <Field label="X handle" htmlFor="c-x" error={err('xHandle')}>
                  <input id="c-x" className={inputClass} value={f.xHandle} onChange={set('xHandle')} placeholder="@yourproject" aria-invalid={!!err('xHandle')} />
                </Field>
              </div>
            </div>
          </Card>

          <Card>
            <CardTitle>Token</CardTitle>
            <div className="grid gap-[18px] md:grid-cols-2">
              <Field label="Token name" htmlFor="c-tname" error={err('tokenName')}>
                <input id="c-tname" className={inputClass} value={f.tokenName} onChange={set('tokenName')} placeholder="Your Token" aria-invalid={!!err('tokenName')} />
              </Field>
              <Field label="Symbol" htmlFor="c-sym" error={err('tokenSymbol')}>
                <input id="c-sym" className={`${inputClass} uppercase`} value={f.tokenSymbol} onChange={set('tokenSymbol')} placeholder="TKN" maxLength={8} aria-invalid={!!err('tokenSymbol')} />
              </Field>
              <Field label="Total supply" htmlFor="c-supply" error={err('totalSupply')} hint={supply > 0 ? `${fmtNumber(supply, 0)} tokens, 18 decimals` : undefined}>
                <input id="c-supply" inputMode="numeric" className={inputClass} value={f.totalSupply} onChange={set('totalSupply')} placeholder="100000000" aria-invalid={!!err('totalSupply')} />
              </Field>
              <Field
                label="Tokens for sale"
                htmlFor="c-sale"
                error={err('tokensForSale')}
                hint={supply > 0 && forSale > 0 && forSale <= supply ? `${fmtNumber((forSale / supply) * 100, 2)}% of supply. The rest goes to your wallet.` : undefined}
              >
                <input id="c-sale" inputMode="numeric" className={inputClass} value={f.tokensForSale} onChange={set('tokensForSale')} placeholder="10000000" aria-invalid={!!err('tokensForSale')} />
              </Field>
            </div>
          </Card>

          <Card>
            <CardTitle>Sale</CardTitle>
            <div className="grid gap-[18px] md:grid-cols-2">
              <Field label="Hard cap (ETH)" htmlFor="c-cap" error={err('hardCap')} hint={price > 0 ? `Price: ${fmtNumber(price, 10)} ETH per token` : undefined}>
                <input id="c-cap" inputMode="decimal" className={inputClass} value={f.hardCap} onChange={set('hardCap')} placeholder="250" aria-invalid={!!err('hardCap')} />
              </Field>
              <Field label="Per-wallet cap" htmlFor="c-wcap" hint="Set by zVote">
                <input id="c-wcap" className={`${inputClass} text-muted-2`} value={cap > 0 ? `${fmtNumber((cap * PROTOCOL.walletCapBps) / 10_000, 6)} ETH (${bpsToPercent(PROTOCOL.walletCapBps)})` : bpsToPercent(PROTOCOL.walletCapBps)} readOnly />
              </Field>
              <Field label="Sale opens" htmlFor="c-start" error={err('start')}>
                <input id="c-start" type="datetime-local" className={`${inputClass} [color-scheme:dark]`} value={f.start} onChange={set('start')} aria-invalid={!!err('start')} />
              </Field>
              <Field label="Sale closes" htmlFor="c-end" error={err('end')} hint={`At most ${MAX_DAYS} days`}>
                <input id="c-end" type="datetime-local" className={`${inputClass} [color-scheme:dark]`} value={f.end} onChange={set('end')} aria-invalid={!!err('end')} />
              </Field>
            </div>
          </Card>

          <SubmitButton pending={pending === 'CreateLaunch'}>{isConnected ? 'Deploy token and open sale' : 'Connect wallet to launch'}</SubmitButton>
          <p className="t-small text-muted">You approve the launch in your wallet. The wallet you sign with owns the token's unsold supply and receives the raise.</p>
        </form>

        <div className="flex flex-col gap-[16px]">
          <Card>
            <CardTitle>Preview</CardTitle>
            <div className="flex items-center gap-[14px]">
              {logo ? (
                <img src={logo.dataUrl} alt="" className="h-[56px] w-[56px] rounded-[14px] border border-white/15 object-cover" />
              ) : (
                <span className="flex h-[56px] w-[56px] items-center justify-center rounded-[14px] border border-gold/40 bg-gold-deep font-urbanist text-[2rem] font-extrabold text-gold">
                  {(f.tokenSymbol || '?').slice(0, 2)}
                </span>
              )}
              <div className="min-w-0">
                <p className="truncate text-[2rem] font-semibold leading-120">{f.projectName.trim() || 'Your project'}</p>
                <p className="t-small text-muted">
                  {f.tokenSymbol || 'TKN'} · {f.category}
                </p>
              </div>
            </div>
            <p className="t-body mt-[14px] text-soft">{f.tagline.trim() || 'Your one-line pitch shows here.'}</p>
          </Card>
          <Card>
            <CardTitle>What Zatrise deploys</CardTitle>
            <Row label="Token">{f.tokenName.trim() || '-'} ({f.tokenSymbol || '-'})</Row>
            <Row label="Standard">ERC-20, 18 decimals</Row>
            <Row label="Minted">{supply > 0 ? fmtNumber(supply, 0) : '-'}</Row>
            <Row label="Held by the sale">{forSale > 0 ? fmtNumber(forSale, 0) : '-'}</Row>
            <Row label="To your wallet">{supply > 0 && forSale > 0 && forSale <= supply ? fmtNumber(supply - forSale, 0) : '-'}</Row>
          </Card>
          <Card>
            <CardTitle>Sale economics</CardTitle>
            <Row label="Price">{price > 0 ? `${fmtNumber(price, 10)} ETH` : '-'}</Row>
            <Row label="Fee to zPool">{bpsToPercent(PROTOCOL.feeBps)} of the raise</Row>
            <Row label="You receive">{cap > 0 ? `up to ${fmtNumber(cap * (1 - PROTOCOL.feeBps / 10_000), 4)} ETH` : '-'}</Row>
            <Row label="Unsold tokens">Returned to you</Row>
          </Card>
          <Card>
            <CardTitle>Your launches</CardTitle>
            {mine.length ? (
              <ul className="flex flex-col gap-[10px]">
                {mine.map((l) => (
                  <li key={l.id}>
                    <Link to={`/app/launches/${l.id}`} className="flex items-center gap-[12px] rounded-[14px] border border-white/10 bg-bg p-[12px] transition-colors hover:border-gold/60">
                      <LaunchMark launch={l} size={40} />
                      <div className="min-w-0 flex-1">
                        <p className="t-body-sb truncate">{l.name}</p>
                        <p className="t-small text-muted">
                          {l.symbol} · {fmtEth(l.hardCapWei ?? 0n, 2)} cap
                        </p>
                      </div>
                      <Badge tone={now < l.start ? 'blue' : now < l.end ? 'gold' : 'muted'}>{now < l.start ? 'Upcoming' : now < l.end ? 'Live' : 'Closed'}</Badge>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <Empty title="No launches yet" />
            )}
          </Card>
        </div>
      </div>
    </>
  );
}
