import xSvg from '@/assets/social/x.svg?raw';

// Community profiles, used by the header menu, the community card and the footer.
// Add an entry here to show another platform everywhere at once.
export type SocialKey = 'x';

export const SOCIAL: { key: SocialKey; label: string; href: string }[] = [
  { key: 'x', label: 'X', href: 'https://x.com/ZecPadX' },
];

export const socialHref = (key: SocialKey) => SOCIAL.find((s) => s.key === key)?.href;

// Official mark, stored byte-for-byte:
// x.svg  https://about.x.com/content/dam/about-twitter/x/brand-toolkit/x-logo.zip (logo.svg)
export const SOCIAL_MARKS: Record<SocialKey, string> = {
  x: xSvg,
};
