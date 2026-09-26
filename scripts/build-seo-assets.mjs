// Builds the social share image and app icons from the brand geometry.
// - public/brand/og-image.png   1200 x 630 (Open Graph / X card)
// - public/apple-touch-icon.png 180 x 180
// - public/icon-192.png, public/icon-512.png (web app manifest)
// - public/favicon-32.png
// Text is outlined from Outfit (opentype.js), so the image never depends on installed fonts.
// Run: npm run seo-assets
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import opentype from 'opentype.js';
import { Resvg } from '@resvg/resvg-js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const GOLD = '#F5B83D';
const INK = '#15130F';
const SOFT = '#E9E3D5';
const MUTED = '#8E8676';

const load = (w) => {
  const buf = fs.readFileSync(path.join(root, `node_modules/@fontsource/outfit/files/outfit-latin-${w}-normal.woff`));
  return opentype.parse(buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength));
};
const fonts = { 500: load(500), 600: load(600), 700: load(700) };

/** Outlined text as an SVG path; letter-by-letter so no GSUB lookups are needed. */
function text(str, { weight = 600, size, x, y, tracking = 0, fill }) {
  const font = fonts[weight];
  const out = new opentype.Path();
  let cx = x;
  const glyphs = [...str].map((c) => font.charToGlyph(c));
  glyphs.forEach((g, i) => {
    out.extend(g.getPath(cx, y, size));
    let adv = (g.advanceWidth / font.unitsPerEm) * size;
    if (i < glyphs.length - 1) adv += (font.getKerningValue(g, glyphs[i + 1]) / font.unitsPerEm) * size;
    cx += adv + tracking * size;
  });
  return `<path fill="${fill}" d="${out.toPathData(2)}"/>`;
}

const geometry = fs.readFileSync(path.join(root, 'src/components/brand/brand-geometry.ts'), 'utf8');
const grab = (name) => JSON.parse(geometry.match(new RegExp(`export const ${name} = (\\{.*?\\}) as const;`))[1]);
const MARK = grab('MARK');
const WORD = grab('WORDMARK');
const LOCKUP = grab('LOCKUP');

const markSvg = (tile, ink) =>
  `<rect width="${MARK.size}" height="${MARK.size}" rx="${MARK.radius}" fill="${tile}"/>` +
  `<g fill="none" stroke="${ink}" stroke-width="${MARK.stroke}" stroke-linecap="round" stroke-linejoin="round">` +
  MARK.glyph.map((d) => `<path d="${d}"/>`).join('') +
  `</g>`;

const lockup = (x, y, scale) =>
  `<g transform="translate(${x} ${y}) scale(${scale})">${markSvg(GOLD, INK)}` +
  `<path transform="translate(${MARK.size + LOCKUP.gap} ${LOCKUP.wordY}) scale(${LOCKUP.wordScale})" fill="#fff" d="${WORD.d}"/></g>`;

// ---------- Open Graph image ----------
const rings = Array.from({ length: 9 }, (_, i) => {
  const r = 150 + i * 46;
  return `<circle cx="1020" cy="330" r="${r}" fill="none" stroke="${GOLD}" stroke-opacity="${(0.34 - i * 0.032).toFixed(3)}" stroke-width="${i % 3 === 0 ? 2 : 1}"/>`;
}).join('');

const og = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <radialGradient id="glow" cx="0.85" cy="0.52" r="0.55">
      <stop offset="0" stop-color="${GOLD}" stop-opacity="0.32"/>
      <stop offset="1" stop-color="${GOLD}" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="1200" height="630" fill="${INK}"/>
  <rect width="1200" height="630" fill="url(#glow)"/>
  ${rings}
  <circle cx="1020" cy="330" r="120" fill="#1e1b16" stroke="${GOLD}" stroke-opacity="0.6"/>
  <g transform="translate(960 270) scale(3)">${markSvg(GOLD, INK)}</g>
  ${lockup(80, 72, 1.5)}
  ${text('Every launch pays', { weight: 700, size: 84, x: 76, y: 290, tracking: -0.012, fill: '#fff' })}
  ${text('out in ZEC', { weight: 700, size: 84, x: 76, y: 384, tracking: -0.012, fill: GOLD })}
  ${text('The first launchpad powered by a Zcash reward economy', { weight: 500, size: 28, x: 80, y: 456, fill: SOFT })}
  <rect x="80" y="518" width="1040" height="1" fill="#ffffff" fill-opacity="0.12"/>
  ${text('zatrise.xyz', { weight: 600, size: 26, x: 80, y: 570, fill: '#fff' })}
  ${text('Built on Robinhood Chain', { weight: 500, size: 24, x: 820, y: 570, fill: MUTED })}
</svg>`;

const write = (rel, svg, width) => {
  const png = new Resvg(svg, { fitTo: { mode: 'width', value: width } }).render().asPng();
  fs.mkdirSync(path.dirname(path.join(root, rel)), { recursive: true });
  fs.writeFileSync(path.join(root, rel), png);
};

write('public/brand/og-image.png', og, 1200);

// ---------- icons: mark on the brand background, ~12% padding ----------
const icon = (bg) => {
  const pad = 6;
  const size = MARK.size + pad * 2;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}">${bg ? `<rect width="${size}" height="${size}" fill="${INK}"/>` : ''}<g transform="translate(${pad} ${pad})">${markSvg(GOLD, INK)}</g></svg>`;
};
write('public/apple-touch-icon.png', icon(true), 180);
write('public/icon-192.png', icon(true), 192);
write('public/icon-512.png', icon(true), 512);
write('public/favicon-32.png', `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${MARK.size} ${MARK.size}">${markSvg(GOLD, INK)}</svg>`, 32);

console.log('seo assets built');
