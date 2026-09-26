type P = { className?: string; size?: number };

const Svg = ({ size = 20, className, children }: P & { children: React.ReactNode }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 20 20"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden
  >
    {children}
  </svg>
);

export const IconOverview = (p: P) => (
  <Svg {...p}>
    <rect x="3" y="3" width="6" height="6" rx="1.5" />
    <rect x="11" y="3" width="6" height="6" rx="1.5" />
    <rect x="3" y="11" width="6" height="6" rx="1.5" />
    <rect x="11" y="11" width="6" height="6" rx="1.5" />
  </Svg>
);

export const IconLaunch = (p: P) => (
  <Svg {...p}>
    <path d="M4 16 16 4M8 4h8v8" />
    <path d="M4 12v4h4" />
  </Svg>
);

export const IconPool = (p: P) => (
  <Svg {...p}>
    <ellipse cx="10" cy="5.5" rx="6" ry="2.5" />
    <path d="M4 5.5v4.5c0 1.4 2.7 2.5 6 2.5s6-1.1 6-2.5V5.5" />
    <path d="M4 10v4.5c0 1.4 2.7 2.5 6 2.5s6-1.1 6-2.5V10" />
  </Svg>
);

export const IconRewards = (p: P) => (
  <Svg {...p}>
    <circle cx="10" cy="10" r="7" />
    <path d="M7.5 7.5h5v2.3l-5 3v.2h5" />
  </Svg>
);

export const IconVote = (p: P) => (
  <Svg {...p}>
    <path d="M3 12h14v5H3z" />
    <path d="M6 12V4h8v8" />
    <path d="m8 8 1.5 1.5L12.5 6.5" />
  </Svg>
);

export const IconWallet = (p: P) => (
  <Svg {...p}>
    <rect x="2.5" y="5" width="15" height="11.5" rx="2.5" />
    <path d="M5.5 5 12 2.5l1.3 2.5M17.5 9h-3.3a1.6 1.6 0 0 0 0 3.2h3.3" />
  </Svg>
);

export const IconActivity = (p: P) => (
  <Svg {...p}>
    <path d="M7 5h10M7 10h10M7 15h10" />
    <path d="m2.8 5 .9.9L5.2 4.2M2.8 10l.9.9 1.5-1.7M2.8 15l.9.9 1.5-1.7" />
  </Svg>
);

export const IconApply = (p: P) => (
  <Svg {...p}>
    <rect x="3" y="3" width="14" height="14" rx="3" />
    <path d="M10 6.5v7M6.5 10h7" />
  </Svg>
);

export const IconDocs = (p: P) => (
  <Svg {...p}>
    <path d="M5 2.5h7l3.5 3.5v11.5H5z" />
    <path d="M12 2.5V6h3.5M7.5 10h5M7.5 13h5" />
  </Svg>
);

export const IconHome = (p: P) => (
  <Svg {...p}>
    <path d="M3 9.5 10 3.5l7 6V17H3z" />
    <path d="M8 17v-4.5h4V17" />
  </Svg>
);

export const IconCopy = (p: P) => (
  <Svg {...p}>
    <rect x="7" y="7" width="10" height="10" rx="2" />
    <path d="M13 7V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2" />
  </Svg>
);

export const IconCheck = (p: P) => (
  <Svg {...p}>
    <path d="m4 10.5 4 4 8-9" />
  </Svg>
);

export const IconShield = (p: P) => (
  <Svg {...p}>
    <path d="M10 2.5 16 5v4.5c0 3.8-2.6 6.4-6 8-3.4-1.6-6-4.2-6-8V5z" />
    <path d="m7.3 10 1.9 1.9 3.6-3.8" />
  </Svg>
);

export const IconEye = (p: P) => (
  <Svg {...p}>
    <path d="M1.8 10S5 4.5 10 4.5 18.2 10 18.2 10 15 15.5 10 15.5 1.8 10 1.8 10Z" />
    <circle cx="10" cy="10" r="2.5" />
  </Svg>
);

export const IconClock = (p: P) => (
  <Svg {...p}>
    <circle cx="10" cy="10" r="7" />
    <path d="M10 6v4l2.5 2" />
  </Svg>
);

export const IconLink = (p: P) => (
  <Svg {...p}>
    <path d="M11 3.5h5.5V9M16.5 3.5 9 11" />
    <path d="M14 11.5v3a2 2 0 0 1-2 2H5.5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h3" />
  </Svg>
);

export const IconSign = (p: P) => (
  <Svg {...p}>
    <path d="M3 15.5c2-3 3.5-4.5 5-4.5s.5 3 2 3 2.5-2 4-2 1.5 1 3 1" />
    <path d="M12.5 3.5l3 3L8 14H5v-3z" />
  </Svg>
);
