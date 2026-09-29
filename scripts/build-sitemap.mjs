// Writes public/sitemap.xml from the site's public routes and every docs page slug.
// Runs before each build, so a new docs page is listed automatically.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SITE = 'https://zecpad.org';
const docs = fs.readFileSync(path.join(root, 'src/docs/content.tsx'), 'utf8');
const slugs = [...docs.matchAll(/slug: '([^']*)'/g)].map((m) => m[1]);

const pages = [
  { loc: '/', priority: '1.0', changefreq: 'weekly' },
  { loc: '/app', priority: '0.9', changefreq: 'daily' },
  { loc: '/app/launches', priority: '0.9', changefreq: 'daily' },
  { loc: '/app/create', priority: '0.7', changefreq: 'monthly' },
  { loc: '/app/stake', priority: '0.7', changefreq: 'monthly' },
  { loc: '/app/rewards', priority: '0.7', changefreq: 'weekly' },
  { loc: '/app/govern', priority: '0.6', changefreq: 'weekly' },
  ...slugs.map((s) => ({ loc: s ? `/docs/${s}` : '/docs', priority: s ? '0.6' : '0.8', changefreq: 'monthly' })),
];

const today = new Date().toISOString().slice(0, 10);
const xml =
  '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
  pages
    .map((p) => `  <url><loc>${SITE}${p.loc}</loc><lastmod>${today}</lastmod><changefreq>${p.changefreq}</changefreq><priority>${p.priority}</priority></url>`)
    .join('\n') +
  '\n</urlset>\n';

fs.writeFileSync(path.join(root, 'public/sitemap.xml'), xml);
console.log(`sitemap: ${pages.length} urls`);
