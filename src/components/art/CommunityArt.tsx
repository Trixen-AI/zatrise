/** Large faded glyphs behind the action cards, and the gold panels of the community grid. Original artwork. */

type Glyph = 'stack' | 'arc' | 'drop' | 'page';

export function ActionGlyph({ glyph, className }: { glyph: Glyph; className?: string }) {
  const c = 'rgba(233, 227, 213, 0.09)';
  return (
    <svg viewBox="0 0 260 320" className={className} fill="none" aria-hidden preserveAspectRatio="xMidYMid slice">
      {glyph === 'stack' &&
        [0, 1, 2, 3].map((i) => (
          <g key={i} transform={`translate(0 ${-i * 58})`}>
            <ellipse cx="150" cy="270" rx="120" ry="38" fill={c} />
            <rect x="30" y="232" width="240" height="38" fill={c} />
          </g>
        ))}
      {glyph === 'arc' && (
        <>
          <path d="M-20 330C40 140 170 60 300 40" stroke={c} strokeWidth="58" strokeLinecap="round" />
          <path d="M210 10l90 30-60 76" stroke={c} strokeWidth="58" strokeLinecap="round" strokeLinejoin="round" />
        </>
      )}
      {glyph === 'drop' && (
        <path d="M150 20C210 110 270 170 270 230a120 120 0 0 1-240 0c0-60 60-120 120-210Z" fill={c} />
      )}
      {glyph === 'page' && (
        <>
          <path d="M60 30h130l70 70v240H60z" fill={c} />
          <path d="M190 30v70h70" fill="rgba(233,227,213,0.06)" />
        </>
      )}
    </svg>
  );
}


/** Soft ribbon lines layered over the gold panels. */
export function Ribbons({ className, tone = 'rgba(255,255,255,0.28)' }: { className?: string; tone?: string }) {
  return (
    <svg viewBox="0 0 400 400" className={className} fill="none" preserveAspectRatio="none" aria-hidden>
      {Array.from({ length: 9 }, (_, i) => (
        <path key={i} d={`M-40 ${320 - i * 26}C80 ${220 - i * 30} 220 ${420 - i * 24} 440 ${120 - i * 28}`} stroke={tone} strokeWidth={i % 3 === 0 ? 2 : 1} />
      ))}
    </svg>
  );
}
