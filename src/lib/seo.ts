import { useEffect } from 'react';

export const SITE_URL = 'https://zecpad.org';
const DEFAULT_TITLE = 'ZecPad | The first launchpad powered by a Zcash reward economy';
const DEFAULT_DESCRIPTION =
  'ZecPad is the first launchpad powered by a Zcash reward economy. Launch tokens on Robinhood Chain, stake and commit to sales, and earn your share of a ZEC reward pool every epoch.';

function setMeta(selector: string, attr: 'content' | 'href', value: string) {
  document.head.querySelector(selector)?.setAttribute(attr, value);
}

/** Per-page title, description and canonical URL (plus the matching Open Graph and X tags). */
export function useSeo({ title, description, path }: { title?: string; description?: string; path: string }) {
  useEffect(() => {
    const fullTitle = title ? `${title} | ZecPad` : DEFAULT_TITLE;
    const desc = description ?? DEFAULT_DESCRIPTION;
    const url = `${SITE_URL}${path === '/' ? '/' : path}`;
    document.title = fullTitle;
    setMeta('meta[name="description"]', 'content', desc);
    setMeta('link[rel="canonical"]', 'href', url);
    setMeta('meta[property="og:url"]', 'content', url);
    setMeta('meta[property="og:title"]', 'content', fullTitle);
    setMeta('meta[property="og:description"]', 'content', desc);
    setMeta('meta[name="twitter:title"]', 'content', fullTitle);
    setMeta('meta[name="twitter:description"]', 'content', desc);
  }, [title, description, path]);
}
