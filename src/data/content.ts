// All site copy lives here. In-app paths ("/app/...", "/docs/...") route without a reload.

export type NavLink = { label: string; href: string; external?: boolean };
export type NavItem = { label: string; href?: string; children?: NavLink[]; width?: number };

export const NAV: NavItem[] = [
  { label: 'Home', href: '#top' },
  {
    label: 'Launches',
    width: 176,
    children: [
      { label: 'Live launches', href: '/app/launches' },
      { label: 'Upcoming', href: '/app/launches?filter=upcoming' },
      { label: 'Launch a token', href: '/app/create' },
    ],
  },
  {
    label: 'Rewards',
    width: 200,
    children: [
      { label: 'zPool', href: '/app/stake' },
      { label: 'Claim ZEC', href: '/app/rewards' },
      { label: 'Epoch calendar', href: '/app/rewards' },
      { label: 'How rewards work', href: '/docs/rewards' },
      { label: 'Docs', href: '/docs' },
    ],
  },
  {
    label: 'Community',
    width: 160,
    children: [
      { label: 'Governance', href: '/app/govern' },
      { label: 'X', href: 'x', external: true },
    ],
  },
  { label: 'Docs', href: '/docs' },
];

export const HERO = {
  eyebrow: 'The first launchpad powered by a Zcash reward economy',
  title: 'Every launch pays out in ZEC',
  primary: 'Explore launches',
  primaryHref: '/app/launches',
  secondary: 'How rewards work',
  secondaryHref: '/docs/how-it-works',
  footnote: '*Genesis parameters. Holders can change them by vote.',
  stats: [
    { prefix: 'ZEC', value: '100%', label: 'Of rewards paid in ZEC', minW: 281 },
    { value: '7', suffix: 'd', label: 'Length of one reward epoch', minW: 266 },
    { prefix: 'MAX', value: '5%', label: 'Of any sale one wallet can hold' },
  ] as { prefix?: string; value: string; suffix?: string; label: string; minW?: number }[],
};

export const FEATURES = {
  eyebrow: 'How it works',
  title: ['ONE POOL OF ZEC,', 'FED BY EVERY LAUNCH'],
  cards: [
    {
      num: '01',
      title: '{ Settled on Robinhood Chain }',
      body: 'Sales, vesting and claims run as contracts on Robinhood Chain, an Ethereum layer 2. The EVM wallet you already use signs every step.',
    },
    {
      num: '02',
      title: '{ PAID IN ZEC }',
      body: 'No farm token printed to fake a yield. A fixed cut of every raise flows into one ZEC pool, and that pool pays out each epoch.',
    },
    {
      num: '03',
      title: '{ STAKE, COMMIT, EARN }',
      body: 'Stake to build weight, commit to the launches you rate, and take your share of the pool when the epoch closes.',
    },
    {
      num: '04',
      title: ['{ Claim in the clear,', 'or claim shielded }'],
      body: 'Send payouts to a transparent address, or to a shielded Zcash address when you would rather keep them private.',
    },
  ],
};

export const CORE = {
  eyebrow: 'Core',
  title: 'THE REWARD LOOP',
  systems: [
    {
      key: 'launch',
      name: 'zLaunch',
      body: 'Where teams run their token sale. Each launch sets its own terms on Robinhood Chain, and a fixed share of every raise is routed to zPool.',
    },
    {
      key: 'pool',
      name: 'zPool',
      body: 'The ZEC reward pool. It fills from launch fees and pays out when each epoch closes, split by the weight stakers and committers have built.',
    },
    {
      key: 'vote',
      name: 'zVote',
      body: 'Holders decide the fee split, the epoch length and the listing rules. Every change is proposed, voted on and executed on chain.',
    },
  ],
};

export const TOOLS = {
  eyebrow: 'Tools',
  title: 'WHAT YOU CAN DO',
  cta: 'Open the app',
  ctaHref: '/app',
  items: [
    { name: 'Stake', href: '/app/stake', pill: 'Build weight', dot: 'var(--dot-1)', tags: ['# Epochs', '# Lockups'] },
    { name: 'Launches', href: '/app/launches', pill: 'Live sales', dot: 'var(--dot-2)', tags: ['# Upcoming', '# Past raises'] },
    { name: 'Claim', href: '/app/rewards', pill: 'ZEC payouts', dot: 'var(--dot-3)', tags: ['# Shielded', '# Transparent'] },
    { name: 'Commit', href: '/app/launches', pill: 'Back a launch', dot: 'var(--dot-4)', tags: ['# Allocation'] },
    { name: 'Govern', href: '/app/govern', pill: 'Set the rules', dot: 'var(--dot-5)', tags: [] as string[] },
  ],
};

export const STACK = {
  eyebrow: 'Built with',
  title: ['THE NETWORKS UNDER', 'EVERY LAUNCH'],
};

export const COMMUNITY = {
  eyebrow: 'Rewards & Community',
  title: 'JOIN THE LOOP',
  big: 'Rewards',
  actions: [
    { label: 'Stake on zPool', word: 'Stake', glyph: 'stack', href: '/app/stake' },
    { label: 'Commit to a launch', word: 'Commit', glyph: 'arc', href: '/app/launches' },
    { label: 'Claim your ZEC', word: 'Claim', glyph: 'drop', href: '/app/rewards' },
    { label: 'Read the docs', word: 'Docs', glyph: 'page', href: '/docs' },
  ] as { label: string; word: string; glyph: 'stack' | 'arc' | 'drop' | 'page'; href: string }[],
  join: 'Join the community',
  circle: ['ZecPad', 'community'],
  x: { title: 'X', label: 'Follow on X' },
};

export const FOOTER = {
  tagline: ['Every launch pays', 'out in ZEC_'],
  columns: [
    {
      title: 'Launch',
      links: [
        { label: 'Live launches', href: '/app/launches' },
        { label: 'Launch a token', href: '/app/create' },
        { label: 'Staking', href: '/app/stake' },
        { label: 'Claim ZEC', href: '/app/rewards' },
        { label: 'Launch app', href: '/app' },
      ],
    },
    {
      title: 'Resources',
      links: [
        { label: 'Docs', href: '/docs' },
        { label: 'Getting started', href: '/docs/getting-started' },
        { label: 'Parameters', href: '/docs/parameters' },
        { label: 'FAQ', href: '/docs/faq' },
        { label: 'Brand kit', href: '/brand/logo.svg', external: true },
      ],
    },
    {
      title: 'Community',
      links: [
        { label: 'Governance', href: '/app/govern' },
        { label: 'X', href: 'x', external: true },
      ],
    },
    {
      title: 'About',
      links: [
        { label: 'What is ZecPad', href: '/docs' },
        { label: 'How it works', href: '/docs/how-it-works' },
        { label: 'Security', href: '/docs/signatures' },
        { label: 'Contact', href: 'x', external: true },
      ],
    },
  ] as { title: string; links: NavLink[] }[],
  copyright: '© 2026 ZecPad. All rights reserved.',
};

