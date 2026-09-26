import { type ReactNode, useState } from 'react';
import { IconCheck, IconCopy } from './icons';

export function Card({ children, className = '', as: Tag = 'section' }: { children: ReactNode; className?: string; as?: 'section' | 'div' | 'article' }) {
  return <Tag className={`rounded-[20px] border-[1.2px] border-white/15 bg-surface p-[20px] lg:p-[28px] ${className}`}>{children}</Tag>;
}

export function CardTitle({ children, action }: { children: ReactNode; action?: ReactNode }) {
  return (
    <div className="mb-[16px] flex items-center justify-between gap-[12px]">
      <h2 className="text-[1.8rem] font-semibold leading-130">{children}</h2>
      {action}
    </div>
  );
}

export function PageHeader({ eyebrow, title, children, actions }: { eyebrow: string; title: string; children?: ReactNode; actions?: ReactNode }) {
  return (
    <div className="mb-[28px] flex flex-col gap-[16px] lg:mb-[36px] lg:flex-row lg:items-end lg:justify-between">
      <div className="flex max-w-[720px] flex-col gap-[6px]">
        <p className="t-eyebrow text-[1.6rem] lg:text-[1.8rem]">{eyebrow}</p>
        <h1 className="text-[3.2rem] font-bold leading-120 tracking-[-0.4px] lg:text-[4rem]">{title}</h1>
        {children && <p className="t-body mt-[4px] text-muted-2">{children}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-[12px]">{actions}</div>}
    </div>
  );
}

export function Stat({ label, value, hint, accent }: { label: string; value: ReactNode; hint?: ReactNode; accent?: boolean }) {
  return (
    <div className="flex min-w-0 flex-col gap-[6px]">
      <p className="t-small text-muted">{label}</p>
      <p className={`truncate text-[2.6rem] font-semibold leading-120 tracking-[-0.3px] ${accent ? 'text-gold' : 'text-white'}`}>{value}</p>
      {hint && <div className="t-small text-muted-2">{hint}</div>}
    </div>
  );
}

type Tone = 'gold' | 'green' | 'blue' | 'muted' | 'red';
const TONES: Record<Tone, string> = {
  gold: 'border-gold/50 bg-gold-deep text-gold',
  green: 'border-[#62d6a8]/40 bg-[#62d6a8]/10 text-[#8ee6c2]',
  blue: 'border-[#8fb8ff]/40 bg-[#8fb8ff]/10 text-[#b3cfff]',
  muted: 'border-white/15 bg-white/5 text-muted-2',
  red: 'border-[#ff5f7e]/40 bg-[#ff5f7e]/10 text-[#ff9aae]',
};

export function Badge({ tone = 'muted', children }: { tone?: Tone; children: ReactNode }) {
  return (
    <span className={`inline-flex items-center gap-[6px] whitespace-nowrap rounded-full border px-[10px] py-[3px] text-[1.3rem] font-medium ${TONES[tone]}`}>
      {children}
    </span>
  );
}

export function Field({
  label,
  hint,
  error,
  children,
  htmlFor,
  aside,
}: {
  label: string;
  hint?: ReactNode;
  error?: string | null;
  children: ReactNode;
  htmlFor: string;
  aside?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-[8px]">
      <div className="flex items-center justify-between gap-[12px]">
        <label htmlFor={htmlFor} className="t-small-m text-soft">
          {label}
        </label>
        {aside}
      </div>
      {children}
      {error ? (
        <p className="t-small text-[#ff9aae]" role="alert">
          {error}
        </p>
      ) : (
        hint && <p className="t-small text-muted">{hint}</p>
      )}
    </div>
  );
}

export const inputClass =
  'w-full rounded-[12px] border-[1.2px] border-line bg-bg px-[16px] py-[12px] text-[1.6rem] text-white outline-none transition-colors placeholder:text-muted focus:border-gold aria-[invalid=true]:border-[#ff5f7e]';

export function AmountInput({
  id,
  value,
  onChange,
  onMax,
  unit = 'ETH',
  invalid,
}: {
  id: string;
  value: string;
  onChange: (v: string) => void;
  onMax?: () => void;
  unit?: string;
  invalid?: boolean;
}) {
  return (
    <div className="relative flex items-center">
      <input
        id={id}
        inputMode="decimal"
        autoComplete="off"
        placeholder="0.0"
        value={value}
        aria-invalid={invalid}
        onChange={(e) => {
          const v = e.target.value.replace(',', '.');
          if (/^\d*\.?\d{0,18}$/.test(v)) onChange(v);
        }}
        className={`${inputClass} pr-[120px] text-[2.2rem] font-semibold`}
      />
      <div className="absolute right-[12px] flex items-center gap-[8px]">
        {onMax && (
          <button type="button" onClick={onMax} className="rounded-full border border-gold/60 px-[10px] py-[2px] text-[1.2rem] font-semibold text-gold hover:bg-gold-deep">
            MAX
          </button>
        )}
        <span className="t-body-m text-muted-2">{unit}</span>
      </div>
    </div>
  );
}

export function SubmitButton({ pending, disabled, children, className = '' }: { pending?: boolean; disabled?: boolean; children: ReactNode; className?: string }) {
  return (
    <button type="submit" disabled={disabled || pending} className={`btn btn-primary w-full disabled:cursor-not-allowed disabled:opacity-50 ${className}`}>
      {pending ? (
        <>
          <span className="h-[16px] w-[16px] animate-spin rounded-full border-2 border-gold border-t-transparent" aria-hidden />
          Approve in your wallet…
        </>
      ) : (
        children
      )}
    </button>
  );
}

export function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-[16px] py-[10px] [&+&]:border-t [&+&]:border-white/10">
      <span className="t-small text-muted">{label}</span>
      <span className="t-body-m text-right">{children}</span>
    </div>
  );
}

export function Empty({ title, children, action }: { title: string; children?: ReactNode; action?: ReactNode }) {
  return (
    <div className="flex flex-col items-center gap-[10px] rounded-[16px] border border-dashed border-line-2 px-[20px] py-[36px] text-center">
      <p className="t-body-sb">{title}</p>
      {children && <p className="t-small max-w-[420px] text-muted">{children}</p>}
      {action}
    </div>
  );
}

export function Progress({ value }: { value: number }) {
  const pct = Math.max(0, Math.min(100, value * 100));
  return (
    <div className="h-[8px] w-full overflow-hidden rounded-full bg-white/10" role="progressbar" aria-valuenow={Math.round(pct)} aria-valuemin={0} aria-valuemax={100}>
      <div className="h-full rounded-full bg-gold transition-[width] duration-500" style={{ width: `${pct}%` }} />
    </div>
  );
}

export function CopyButton({ text, label = 'Copy' }: { text: string; label?: string }) {
  const [done, setDone] = useState(false);
  return (
    <button
      type="button"
      aria-label={label}
      onClick={() => {
        navigator.clipboard?.writeText(text).then(() => {
          setDone(true);
          window.setTimeout(() => setDone(false), 1400);
        });
      }}
      className="inline-flex h-[28px] w-[28px] items-center justify-center rounded-[8px] text-muted-2 hover:bg-white/5 hover:text-white"
    >
      {done ? <IconCheck size={16} className="text-gold" /> : <IconCopy size={16} />}
    </button>
  );
}

export function Tabs<T extends string>({ value, onChange, items }: { value: T; onChange: (v: T) => void; items: { value: T; label: string; count?: number }[] }) {
  return (
    <div role="tablist" className="inline-flex flex-wrap gap-[6px] rounded-full border border-white/10 bg-surface p-[4px]">
      {items.map((it) => (
        <button
          key={it.value}
          role="tab"
          type="button"
          aria-selected={value === it.value}
          onClick={() => onChange(it.value)}
          className={`rounded-full px-[14px] py-[6px] text-[1.4rem] font-medium transition-colors ${
            value === it.value ? 'bg-gold-deep text-gold' : 'text-soft hover:text-white'
          }`}
        >
          {it.label}
          {it.count !== undefined && <span className="ml-[6px] text-muted">{it.count}</span>}
        </button>
      ))}
    </div>
  );
}
