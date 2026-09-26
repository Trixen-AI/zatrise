import { type ReactNode, useCallback, useMemo, useState } from 'react';
import { ToastContext, type ToastTone as Tone } from './toastContext';

type Toast = { id: number; tone: Tone; title: string; body?: string };
let seq = 0;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<Toast[]>([]);

  const push = useCallback((tone: Tone, title: string, body?: string) => {
    const id = ++seq;
    setItems((cur) => [...cur.slice(-2), { id, tone, title, body }]);
    window.setTimeout(() => setItems((cur) => cur.filter((t) => t.id !== id)), 5200);
  }, []);

  const api = useMemo(() => ({ push }), [push]);

  return (
    <ToastContext.Provider value={api}>
      {children}
      <div aria-live="polite" className="pointer-events-none fixed bottom-[20px] right-[20px] z-[150] flex w-[calc(100%-40px)] max-w-[380px] flex-col gap-[10px]">
        {items.map((t) => (
          <div
            key={t.id}
            className={`pointer-events-auto animate-[dropIn_.25s_ease-out] rounded-[16px] border bg-surface-2 p-[16px] shadow-[0_12px_32px_rgba(0,0,0,0.45)] ${
              t.tone === 'success' ? 'border-gold/60' : t.tone === 'error' ? 'border-[#ff5f7e]/60' : 'border-white/15'
            }`}
          >
            <p className={`t-body-sb ${t.tone === 'success' ? 'text-gold' : t.tone === 'error' ? 'text-[#ff9aae]' : 'text-white'}`}>{t.title}</p>
            {t.body && <p className="t-small mt-[4px] text-soft">{t.body}</p>}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
