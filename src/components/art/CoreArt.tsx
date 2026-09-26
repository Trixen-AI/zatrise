import { useId } from 'react';
import { Mark } from '@/components/brand/Logo';

type Variant = 'dots' | 'meridian' | 'mesh';
const LINE = 'rgba(233, 227, 213, 0.45)';

/** Wireframe sphere on a 200x200 grid, three textures so each system reads differently. */
export function Sphere({ variant, className, label }: { variant: Variant; className?: string; label?: string }) {
  const id = useId();
  const R = 98;
  return (
    <svg viewBox="0 0 200 200" className={className} fill="none" aria-hidden>
      <defs>
        <radialGradient id={`${id}-f`} cx="0.36" cy="0.3" r="0.8">
          <stop offset="0" stopColor="#3a3326" />
          <stop offset="1" stopColor="#17140f" />
        </radialGradient>
        <clipPath id={`${id}-c`}>
          <circle cx="100" cy="100" r={R} />
        </clipPath>
      </defs>
      <circle cx="100" cy="100" r={R} fill={`url(#${id}-f)`} stroke={LINE} strokeWidth="1" />
      <g clipPath={`url(#${id}-c)`} stroke={LINE} strokeWidth="0.6">
        {variant === 'meridian' && (
          <>
            {Array.from({ length: 9 }, (_, i) => (
              <ellipse key={i} cx="100" cy="100" rx={Math.abs(Math.cos(((i + 0.5) / 9) * Math.PI)) * R} ry={R} />
            ))}
            {Array.from({ length: 9 }, (_, i) => {
              const y = -R + ((i + 1) * 2 * R) / 10;
              return <ellipse key={`p${i}`} cx="100" cy={100 + y} rx={Math.sqrt(R * R - y * y)} ry={Math.sqrt(R * R - y * y) * 0.18} />;
            })}
            <path d="M58 52l16 6-10 4z" fill="var(--gold)" stroke="none" opacity="0.7" />
          </>
        )}
        {variant === 'dots' &&
          Array.from({ length: 15 }, (_, row) => {
            const y = -R + ((row + 1) * 2 * R) / 16;
            const half = Math.sqrt(R * R - y * y);
            const n = Math.max(3, Math.round(half / 7));
            return Array.from({ length: n }, (_, k) => {
              const x = -half + ((k + 0.5) * 2 * half) / n;
              const z = Math.sqrt(Math.max(0, R * R - x * x - y * y)) / R;
              return <circle key={`${row}-${k}`} cx={100 + x} cy={100 + y} r={0.7 + z * 1.1} fill={LINE} stroke="none" opacity={0.35 + z * 0.6} />;
            });
          })}
        {variant === 'mesh' && (
          <>
            {Array.from({ length: 7 }, (_, i) => {
              const a = (i / 7) * Math.PI;
              return <path key={i} d={`M${100 + Math.cos(a) * R} ${100 + Math.sin(a) * R}L${100 - Math.cos(a) * R} ${100 - Math.sin(a) * R}`} />;
            })}
            {[30, 58, 84].map((r) => (
              <polygon
                key={r}
                points={Array.from({ length: 7 }, (_, i) => {
                  const a = (i / 7) * Math.PI * 2 + r / 40;
                  return `${100 + Math.cos(a) * r},${100 + Math.sin(a) * r}`;
                }).join(' ')}
              />
            ))}
            <ellipse cx="72" cy="160" rx="24" ry="8" strokeDasharray="2 3" />
          </>
        )}
      </g>
      {label && (
        <text x="100" y="100" dy="0.35em" textAnchor="middle" fill="#fff" fontFamily="Outfit" fontWeight="700" fontSize="34" letterSpacing="-0.5">
          {label}
        </text>
      )}
    </svg>
  );
}

/** Small satellite used around each system. */
export function Moon({ className }: { className?: string }) {
  return <Sphere variant="meridian" className={className} />;
}

/** Gold core coin carrying the Zatrise mark. */
export function CoreCoin({ className }: { className?: string }) {
  return (
    <div className={`relative ${className ?? ''}`}>
      <svg viewBox="0 0 140 140" className="absolute inset-0 h-full w-full" aria-hidden>
        <defs>
          <radialGradient id="coin-g" cx="0.4" cy="0.35" r="0.75">
            <stop offset="0" stopColor="#ffd88a" />
            <stop offset="1" stopColor="#b5801c" />
          </radialGradient>
        </defs>
        <circle cx="70" cy="70" r="68" fill="url(#coin-g)" />
        {Array.from({ length: 60 }, (_, i) => {
          const a = (i / 60) * Math.PI * 2;
          return (
            <path
              key={i}
              d={`M${70 + Math.cos(a) * 62} ${70 + Math.sin(a) * 62}L${70 + Math.cos(a) * 67} ${70 + Math.sin(a) * 67}`}
              stroke="#8a5f12"
              strokeWidth="1.2"
            />
          );
        })}
        <circle cx="70" cy="70" r="58" fill="none" stroke="#8a5f12" strokeWidth="1" />
      </svg>
      <Mark size={56} tile="transparent" ink="#3b2a0b" className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" />
    </div>
  );
}

/** Full-width disc under the three systems: a tilted coin face with a reeded rim and orbit tracks. */
export function LoopDisc({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 1920 780" className={className} fill="none" preserveAspectRatio="xMidYMid meet" aria-hidden>
      <defs>
        <radialGradient id="disc-g" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#f5b83d" stopOpacity="0.18" />
          <stop offset="1" stopColor="#f5b83d" stopOpacity="0.04" />
        </radialGradient>
      </defs>
      <g transform="rotate(-9 930 403)">
        <ellipse cx="930" cy="403" rx="930" ry="250" stroke="rgba(245,184,61,0.55)" />
        <ellipse cx="900" cy="410" rx="620" ry="160" fill="url(#disc-g)" stroke="rgba(245,184,61,0.4)" />
        {[500, 400, 300, 200, 110].map((rx, i) => (
          <ellipse key={rx} cx={900 + i * 12} cy="410" rx={rx} ry={rx * 0.25} stroke="rgba(245,184,61,0.35)" strokeDasharray={i % 2 ? '4 8' : undefined} />
        ))}
        {Array.from({ length: 96 }, (_, i) => {
          const a = (i / 96) * Math.PI * 2;
          const x1 = 900 + Math.cos(a) * 620;
          const y1 = 410 + Math.sin(a) * 160;
          const x2 = 900 + Math.cos(a) * 640;
          const y2 = 410 + Math.sin(a) * 166;
          return <path key={i} d={`M${x1} ${y1}L${x2} ${y2}`} stroke="rgba(245,184,61,0.45)" />;
        })}
        <path d="M120 560L1760 250" stroke="rgba(245,184,61,0.25)" />
        <path d="M600 160L1240 660" stroke="rgba(245,184,61,0.2)" />
      </g>
    </svg>
  );
}

/** The loop itself: launch -> pool -> vote -> launch, on the 1400x716 content grid. */
export function LoopArrows({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 1400 716" className={className} fill="none" aria-hidden>
      <defs>
        <marker id="loop-head" viewBox="0 0 12 12" refX="9" refY="6" markerWidth="12" markerHeight="12" orient="auto-start-reverse">
          <path d="M2 1.5 9.5 6 2 10.5" stroke="#fff" strokeWidth="1.4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </marker>
      </defs>
      <g stroke="#fff" strokeWidth="1.8" strokeLinecap="round" markerEnd="url(#loop-head)">
        <path d="M250 262C520 150 880 96 1176 128" />
        <path d="M1302 296C1284 372 1226 430 1150 458" />
        <path d="M936 578C700 690 300 704 196 520" />
      </g>
      <path d="M430 468C640 420 880 380 1070 330" stroke="var(--gold)" strokeWidth="1.2" strokeDasharray="6 8" />
    </svg>
  );
}
