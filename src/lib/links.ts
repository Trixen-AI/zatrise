import type { NavLink } from '@/data/content';
import { socialHref, type SocialKey } from '@/data/social';

/** Resolve social keys (e.g. "x") to hrefs through the single social list. */
export function resolveHref(link: NavLink) {
  return (socialHref(link.href as SocialKey) ?? link.href) || '#';
}
