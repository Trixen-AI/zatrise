import { LOCKUP, MARK, WORDMARK } from './brand-geometry';

type MarkProps = { size?: number; tile?: string; ink?: string; className?: string; title?: string };

/** The ZecPad mark: a Z built from a launch (pad, launch path, ZEC coin), on a gold tile. */
export function Mark({ size = 40, tile = 'var(--gold)', ink = 'var(--bg)', className, title }: MarkProps) {
  return (
    <svg
      viewBox={`0 0 ${MARK.size} ${MARK.size}`}
      width={size}
      height={size}
      className={className}
      role={title ? 'img' : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
    >
      <rect width={MARK.size} height={MARK.size} rx={MARK.radius} fill={tile} />
      <g fill="none" stroke={ink} strokeWidth={MARK.stroke} strokeLinecap="round" strokeLinejoin="round">
        {MARK.glyph.map((d) => (
          <path key={d} d={d} />
        ))}
      </g>
      <circle cx={MARK.coin.cx} cy={MARK.coin.cy} r={MARK.coin.r} fill={ink} />
    </svg>
  );
}

type LogoProps = { height?: number; word?: string; className?: string };

/** Mark + outlined wordmark as one SVG. */
export function Logo({ height = 36, word = '#fff', className }: LogoProps) {
  const width = (LOCKUP.w / LOCKUP.h) * height;
  return (
    <svg viewBox={`0 0 ${LOCKUP.w} ${LOCKUP.h}`} width={width} height={height} className={className} role="img" aria-label="ZecPad">
      <rect width={MARK.size} height={MARK.size} rx={MARK.radius} fill="var(--gold)" />
      <g fill="none" stroke="var(--bg)" strokeWidth={MARK.stroke} strokeLinecap="round" strokeLinejoin="round">
        {MARK.glyph.map((d) => (
          <path key={d} d={d} />
        ))}
      </g>
      <circle cx={MARK.coin.cx} cy={MARK.coin.cy} r={MARK.coin.r} fill="var(--bg)" />
      <path
        transform={`translate(${MARK.size + LOCKUP.gap} ${LOCKUP.wordY}) scale(${LOCKUP.wordScale})`}
        fill={word}
        d={WORDMARK.d}
      />
    </svg>
  );
}

/** Outline-only wordmark used as the large footer backdrop. */
export function WordmarkOutline({ className }: { className?: string }) {
  const pad = 2;
  return (
    <svg
      viewBox={`${-pad} ${-pad} ${WORDMARK.w + pad * 2} ${WORDMARK.h + pad * 2}`}
      className={className}
      preserveAspectRatio="xMidYMin meet"
      aria-hidden
    >
      <path d={WORDMARK.d} fill="none" stroke="var(--line-2)" strokeWidth={0.7} vectorEffect="non-scaling-stroke" />
    </svg>
  );
}
