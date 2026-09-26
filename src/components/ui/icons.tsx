type P = { className?: string; size?: number };

export const ChevronDown = ({ className, size = 16 }: P) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none" className={className} aria-hidden>
    <path d="m3.5 6 4.5 4.5L12.5 6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const ChevronRight = ({ className }: P) => (
  <svg width="16" height="17" viewBox="0 0 16 17" fill="none" className={className} aria-hidden>
    <path d="m6 4.5 4 4-4 4" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/** 14px north-east arrow used on links and pills. */
export const ArrowUpRight = ({ className, size = 14 }: P) => (
  <svg width={size} height={size} viewBox="0 0 14 14" fill="none" className={className} aria-hidden>
    <path d="M2.5 11.5 11.5 2.5M4.5 2.5h7v7" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const ArrowDownLeft = ({ className, size = 20 }: P) => (
  <svg width={size} height={size} viewBox="0 0 20 20" fill="none" className={className} aria-hidden>
    <path d="M16 4 4 16M4 7v9h9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const ArrowRight = ({ className, size = 42 }: P) => (
  <svg width={size} height={size} viewBox="0 0 42 42" fill="none" className={className} aria-hidden>
    <path d="M9 21h24M24 12l9 9-9 9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const External = ({ className }: P) => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className={className} aria-hidden>
    <g stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9.5 2.5h4v4M13.5 2.5 8 8" />
      <path d="M12 9.5v2.5a1.5 1.5 0 0 1-1.5 1.5h-6A1.5 1.5 0 0 1 3 12V6a1.5 1.5 0 0 1 1.5-1.5H7" />
    </g>
  </svg>
);

export const Menu = ({ className }: P) => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className={className} aria-hidden>
    <path d="M3 5h14M3 10h14M3 15h14" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" />
  </svg>
);

export const Close = ({ className }: P) => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className={className} aria-hidden>
    <path d="m5 5 10 10M15 5 5 15" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" />
  </svg>
);

/** Four-point spark used before the Core popover titles. */
export const Spark = ({ className, size = 24, color = 'currentColor' }: P & { color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" className={className} aria-hidden>
    <path d="M12 1.5c.7 5.6 4.9 9.8 10.5 10.5-5.6.7-9.8 4.9-10.5 10.5C11.3 16.9 7.1 12.7 1.5 12 7.1 11.3 11.3 7.1 12 1.5Z" fill={color} />
  </svg>
);
