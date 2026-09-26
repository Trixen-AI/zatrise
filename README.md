# Zatrise

The first launchpad powered by a Zcash reward economy, built on Robinhood Chain.

This repo holds three connected parts:

| Route | What it is |
| --- | --- |
| `/` | Marketing site |
| `/docs/*` | Product docs |
| `/app/*` | The Zatrise app (dashboard) |

Stack: Vite, React 19, TypeScript, Tailwind CSS 3, GSAP (landing page), React Router 7, Reown AppKit + wagmi + viem (wallet), TanStack Query.

## Setup

```bash
cp .env.example .env      # then set VITE_REOWN_PROJECT_ID (https://dashboard.reown.com)
npm install
npm run dev               # http://localhost:5173
npm run build             # production build in dist/
npm run lint
npm run brand             # rebuild the logo files from scripts/build-brand.mjs
npm run seo-assets        # rebuild the share image and app icons
```

Without `VITE_REOWN_PROJECT_ID`, browser wallets still connect, but WalletConnect (mobile wallets, QR) does not, and the connect modal shows "Project ID Missing".


## Deploy on Vercel

`vercel.json` already sets the Vite build, the SPA fallback (so `/app/...` and `/docs/...` load on refresh), long-lived caching for hashed assets, security headers, and a `www.zatrise.xyz` to `zatrise.xyz` redirect.

1. Import the GitHub repo in Vercel. Framework, build command (`npm run build`) and output (`dist`) are picked up from `vercel.json`.
2. Add the environment variables (Project Settings > Environment Variables, for Production and Preview):

   | Variable | Required | Value |
   | --- | --- | --- |
   | `VITE_REOWN_PROJECT_ID` | Yes | Your project ID from dashboard.reown.com |
   | `VITE_RPC_URL_MAINNET` | No | Custom Robinhood Chain RPC (e.g. Alchemy). Empty uses the public RPC |
   | `VITE_RPC_URL_TESTNET` | No | Custom Robinhood Chain Testnet RPC. Empty uses the public RPC |

   `VITE_` variables are baked in at build time, so redeploy after changing them.
3. Add the domains `zatrise.xyz` and `www.zatrise.xyz` (Project Settings > Domains) and set the DNS records Vercel shows.
4. In the Reown dashboard, add `zatrise.xyz` (and the `*.vercel.app` preview URL if you test there) to the project's allowed domains. Without it, WalletConnect refuses connections in production.

SEO: `index.html` holds the default title, description, canonical URL, Open Graph and X card tags and JSON-LD; each route updates its own title, description and canonical (`src/lib/seo.ts`). `public/sitemap.xml` is regenerated from the docs pages on every build, and `public/robots.txt` points to it. Rebuild the share image and icons with `npm run seo-assets`.

## The app

The app follows the product loop: commit to launches, stake in zPool, claim ZEC, vote in zVote.

| Page | Path | What the user does |
| --- | --- | --- |
| Overview | `/app` | Balance, stake, epoch weight and countdown, live sales, recent activity |
| Launches | `/app/launches`, `/app/launches/:id` | Browse sales, commit ETH (checked against real balance and the 5% wallet cap), claim tokens after close |
| Launch a token | `/app/create` | Teams set token name, symbol, supply and sale terms, upload a 500 x 500 logo; Zatrise deploys the token and opens the sale |
| zPool | `/app/stake` | Stake and unstake ETH, weight in ETH-days, 7-day lockup |
| Rewards | `/app/rewards` | Current epoch, claim a closed epoch to a transparent or shielded Zcash address (checksum-validated) |
| Governance | `/app/govern`, `/app/govern/:id` | Vote with staked weight, draft proposals |
| Wallet | `/app/wallet` | Real balances on both Robinhood Chain networks, ERC-20 tokens and transactions (Blockscout) |
| Activity | `/app/activity` | Every signed request, re-verifiable, exportable as JSON |

### How approvals work

Every action is an EIP-712 typed request (`src/app/lib/requests.ts`, domain `Zatrise` v1) that the user approves in their wallet. Signing does not move funds. Signed requests are stored per wallet in the browser (`localStorage`, key `zatrise:requests:v1`) and drive the user's position (stake, weight, commitments, votes, claims). When protocol contracts exist, `useSignRequest` is the single place to swap signatures for contract writes.

### Real data sources

- Balances and token reads: Robinhood Chain RPC through wagmi/viem (`src/app/config/wallet.ts`; optional RPC overrides in `.env`).
- Tokens, transactions, counters, ETH price: Blockscout API v2 (`src/app/lib/blockscout.ts`).
- Epochs: computed from the genesis parameters in `src/lib/protocol.ts`.

## Where things live

| What | File |
| --- | --- |
| Site copy | `src/data/content.ts` |
| Docs pages | `src/docs/content.tsx` |
| Protocol parameters (fee, cap, epoch, lockup) | `src/lib/protocol.ts` |
| Launch registry (curated listings, empty) | `src/app/data/launches.ts` |
| zVote proposals | `src/app/data/proposals.ts` |
| Social links (X) | `src/data/social.ts` |
| Design tokens | `src/styles/tokens.css` |
| Routes | `src/router.tsx` |

## Before going live

- Set `VITE_REOWN_PROJECT_ID`.
- Launches created in the app are stored in the creator's browser (requests in `zatrise:requests:v1`, logos in `zatrise:logos:v1`), so other visitors do not see them until a shared backend or the launchpad contracts are connected. Curated listings can be added to `src/app/data/launches.ts`.
- The hero figures (100% ZEC rewards, 7-day epoch, 5% wallet cap) are the genesis parameters in `src/lib/protocol.ts`.
- Third-party logo sources:
  - Robinhood Chain: https://cdn.robinhood.com/robinhood_chain/brand_assets/robinhood-chain-brand-assets-v1.zip
  - Zcash: https://z.cash/press/ (Primary-Logo-White.svg)
  - Arbitrum: https://arbitrum.io/brand-kit (logo_full_color_white.svg)
  - X: https://about.x.com/en/who-we-are/brand-toolkit (x-logo.zip)
