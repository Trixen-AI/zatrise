import { useRef } from 'react';
import { gsap, MOTION_OK, useGSAP } from '@/lib/gsap';

const S = 'rgba(233, 227, 213, 0.55)'; // stroke
const G = 'var(--gold)';

function useLoop(build: (root: HTMLElement | SVGSVGElement) => void) {
  const ref = useRef<SVGSVGElement>(null);
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        if (ref.current) build(ref.current);
      });
      return () => mm.revert();
    },
    { scope: ref },
  );
  return ref;
}

/** 01: a chain of blocks; a gold receipt drops through each one and settles at the bottom. */
export function SettleArt({ className }: { className?: string }) {
  const ref = useLoop(() => {
    const tl = gsap.timeline({ repeat: -1, repeatDelay: 0.4 });
    tl.fromTo('.token', { y: 0, opacity: 0 }, { opacity: 1, duration: 0.3 })
      .to('.token', { y: 236, duration: 2.2, ease: 'power1.inOut' })
      .to('.blk', { stroke: G, duration: 0.25, stagger: 0.5 }, '<0.1')
      .to('.blk', { stroke: S, duration: 0.6, stagger: 0.1 }, '>')
      .to('.base', { attr: { 'stroke-dashoffset': 0 }, duration: 0.6 }, '<')
      .to('.token', { opacity: 0, duration: 0.3 }, '<0.2')
      .to('.base', { attr: { 'stroke-dashoffset': 180 }, duration: 0.01 });
  });
  const blocks = [24, 88, 152, 216];
  return (
    <svg ref={ref} viewBox="0 0 200 325" className={className} fill="none" aria-hidden>
      <path d="M100 8V300" stroke="rgba(233,227,213,0.18)" strokeDasharray="3 6" />
      {blocks.map((y, i) => (
        <g key={y}>
          <rect className="blk" x={42 + i * 2} y={y} width={116 - i * 4} height={44} rx={12} stroke={S} strokeWidth={1.4} />
          <path d={`M${62 + i * 2} ${y + 16}h${40 - i * 3}M${62 + i * 2} ${y + 27}h${64 - i * 4}`} stroke="rgba(233,227,213,0.35)" strokeLinecap="round" />
          <circle cx={138 - i * 2} cy={y + 22} r={4} stroke={S} />
        </g>
      ))}
      <path className="base" d="M20 300H180" stroke={G} strokeWidth={2} strokeLinecap="round" strokeDasharray="180" strokeDashoffset="180" />
      <g className="token">
        <circle cx="100" cy="46" r="9" fill={G} />
        <path d="M96 42.5h7v3.4M103 42.5l-7 7.2M96 49.7h7.2" stroke="var(--bg)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </svg>
  );
}

/** 02 backdrop: dotted rings that spread from the pool at the card's centre. */
export function PoolRings({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 420 500" className={className} fill="none" preserveAspectRatio="xMidYMid slice" aria-hidden>
      {Array.from({ length: 14 }, (_, i) => (
        <ellipse
          key={i}
          cx="210"
          cy="190"
          rx={40 + i * 26}
          ry={14 + i * 9}
          stroke="rgba(233,227,213,0.13)"
          strokeDasharray={i % 2 ? '2 6' : undefined}
        />
      ))}
      {Array.from({ length: 9 }, (_, i) => (
        <ellipse key={`b${i}`} cx="210" cy="420" rx={60 + i * 30} ry={18 + i * 8} stroke="rgba(233,227,213,0.08)" />
      ))}
    </svg>
  );
}

/** 02 centre: a ZEC-style coin that pulses rings outward, one per epoch. */
export function PoolCoin({ className }: { className?: string }) {
  const ref = useLoop(() => {
    gsap.fromTo(
      '.pulse',
      { scale: 0.45, opacity: 0.9, transformOrigin: '50px 50px' },
      { scale: 1.25, opacity: 0, duration: 2.4, ease: 'power2.out', stagger: { each: 0.8, repeat: -1 } },
    );
    gsap.to('.coin', { rotateY: 360, duration: 4, ease: 'none', repeat: -1, transformOrigin: '50px 50px' });
  });
  return (
    <svg ref={ref} viewBox="0 0 100 100" className={className} fill="none" aria-hidden>
      {[0, 1, 2].map((i) => (
        <circle key={i} className="pulse" cx="50" cy="50" r="40" stroke={G} strokeWidth="1.2" />
      ))}
      <g className="coin">
        <circle cx="50" cy="50" r="19" fill="var(--gold-deep)" stroke={G} strokeWidth="2" />
        <path d="M42 42h14.5v8M56.5 42 42 57.5M42 57.5h15" stroke={G} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </svg>
  );
}

/** 03: three meters fill in turn (stake, commit, earn); the last one drops a coin. */
export function LoopMeters({ className }: { className?: string }) {
  const ref = useLoop(() => {
    const tl = gsap.timeline({ repeat: -1, repeatDelay: 0.6 });
    tl.set('.fill', { attr: { width: 0 } })
      .set('.drop', { y: -30, opacity: 0 })
      .to('.fill', { attr: { width: 150 }, duration: 0.9, ease: 'power2.inOut', stagger: 0.7 })
      .to('.drop', { y: 0, opacity: 1, duration: 0.5, ease: 'bounce.out' }, '-=0.2')
      .to('.fill, .drop', { opacity: 0, duration: 0.4 }, '+=1')
      .set('.fill', { opacity: 1 });
  });
  const rows = ['STAKE', 'COMMIT', 'EARN'];
  return (
    <svg ref={ref} viewBox="0 0 260 140" className={className} fill="none" aria-hidden>
      {rows.map((r, i) => (
        <g key={r} transform={`translate(0 ${10 + i * 40})`}>
          <text x="0" y="17" fill="rgba(233,227,213,0.6)" fontSize="11" fontFamily="Outfit" fontWeight="600" letterSpacing="1">
            {r}
          </text>
          <rect x="62" y="6" width="150" height="16" rx="8" stroke={S} />
          <rect className="fill" x="62" y="6" width="0" height="16" rx="8" fill={G} fillOpacity={0.35 + i * 0.25} />
        </g>
      ))}
      <g className="drop">
        <circle cx="238" cy="104" r="12" fill={G} />
        <path d="M233.5 99.5h9v5M242.5 99.5 233.5 109M233.5 109h9.3" stroke="var(--bg)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </svg>
  );
}

/** 04 badge: a small globe of gold meridians behind the card number. */
export function BadgeGlobe({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} fill="none" aria-hidden>
      <circle cx="50" cy="50" r="49" fill="#231e14" stroke={G} strokeOpacity="0.6" />
      {[12, 26, 38].map((rx) => (
        <ellipse key={rx} cx="50" cy="50" rx={rx} ry="49" stroke={G} strokeOpacity="0.35" />
      ))}
      {[18, 34].map((dy) => (
        <g key={dy}>
          <path d={`M${50 - Math.sqrt(49 * 49 - dy * dy)} ${50 - dy}H${50 + Math.sqrt(49 * 49 - dy * dy)}`} stroke={G} strokeOpacity="0.35" />
          <path d={`M${50 - Math.sqrt(49 * 49 - dy * dy)} ${50 + dy}H${50 + Math.sqrt(49 * 49 - dy * dy)}`} stroke={G} strokeOpacity="0.35" />
        </g>
      ))}
      <path d="M1 50h98" stroke={G} strokeOpacity="0.35" />
    </svg>
  );
}

/** Section backdrop: a large wire sphere of meridians and dotted parallels. */
export function WireSphere({ className }: { className?: string }) {
  const R = 400;
  return (
    <svg viewBox="0 0 820 820" className={className} fill="none" aria-hidden>
      <defs>
        <radialGradient id="ws-fade" cx="0.42" cy="0.38" r="0.7">
          <stop offset="0" stopColor="#fff" stopOpacity="0.9" />
          <stop offset="1" stopColor="#fff" stopOpacity="0.15" />
        </radialGradient>
        <mask id="ws-mask">
          <circle cx="410" cy="410" r={R} fill="url(#ws-fade)" />
        </mask>
      </defs>
      <g mask="url(#ws-mask)" stroke="rgba(233,227,213,0.16)">
        <circle cx="410" cy="410" r={R} />
        {Array.from({ length: 12 }, (_, i) => (
          <ellipse key={`m${i}`} cx="410" cy="410" rx={Math.abs(Math.cos((i / 12) * Math.PI)) * R} ry={R} />
        ))}
        {Array.from({ length: 13 }, (_, i) => {
          const y = -R + ((i + 1) * 2 * R) / 14;
          const half = Math.sqrt(R * R - y * y);
          return <path key={`p${i}`} d={`M${410 - half} ${410 + y}H${410 + half}`} strokeDasharray="2 7" />;
        })}
      </g>
    </svg>
  );
}
