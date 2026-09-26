import { useMemo } from 'react';

/**
 * Tools centrepiece: a gold contour "island" of nested closed lines, like a heat map of ZEC
 * piling up. Paths are generated once from a seeded wave sum, so the artwork is stable.
 */
export function ContourIsland({ className }: { className?: string }) {
  const paths = useMemo(() => {
    const waves = [
      { k: 2, a: 0.16, p: 0.4 },
      { k: 3, a: 0.11, p: 1.9 },
      { k: 5, a: 0.06, p: 0.8 },
      { k: 7, a: 0.035, p: 2.6 },
    ];
    const out: { d: string; o: number; gold: boolean }[] = [];
    const LAYERS = 46;
    for (let L = 0; L < LAYERS; L++) {
      const s = 1 - L / LAYERS; // 1 outer -> 0 inner
      const base = 60 + 330 * s;
      const cx = 450 + (1 - s) * 70;
      const cy = 410 - (1 - s) * 110;
      const pts: string[] = [];
      const STEPS = 120;
      for (let i = 0; i <= STEPS; i++) {
        const t = (i / STEPS) * Math.PI * 2;
        let r = 1;
        for (const w of waves) r += w.a * Math.sin(w.k * t + w.p + (1 - s) * w.k * 0.9);
        const x = cx + Math.cos(t) * base * r * 1.08;
        const y = cy + Math.sin(t) * base * r * 0.9;
        pts.push(`${i === 0 ? 'M' : 'L'}${x.toFixed(1)} ${y.toFixed(1)}`);
      }
      out.push({ d: pts.join('') + 'Z', o: 0.12 + 0.5 * Math.pow(1 - s, 1.4), gold: L % 6 === 0 });
    }
    return out;
  }, []);

  return (
    <svg viewBox="0 0 900 792" className={className} fill="none" aria-hidden>
      <defs>
        <radialGradient id="island-glow" cx="0.56" cy="0.4" r="0.55">
          <stop offset="0" stopColor="#f5b83d" stopOpacity="0.22" />
          <stop offset="1" stopColor="#f5b83d" stopOpacity="0" />
        </radialGradient>
      </defs>
      <ellipse cx="480" cy="360" rx="420" ry="360" fill="url(#island-glow)" />
      {paths.map((p, i) => (
        <path
          key={i}
          d={p.d}
          stroke={p.gold ? 'var(--gold)' : 'rgb(233, 227, 213)'}
          strokeOpacity={p.gold ? Math.min(0.9, p.o + 0.2) : p.o}
          strokeWidth={p.gold ? 1.3 : 0.8}
        />
      ))}
    </svg>
  );
}
