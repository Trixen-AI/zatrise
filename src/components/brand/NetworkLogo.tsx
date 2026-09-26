import arbitrum from '@/assets/logos/arbitrum-full-color-white.svg?raw';
import robinhoodChain from '@/assets/logos/robinhood-chain-white.svg?raw';
import zcash from '@/assets/logos/zcash-primary-white.svg?raw';

// Official logos, stored byte-for-byte and only resized here.
// robinhood-chain-white.svg     https://cdn.robinhood.com/robinhood_chain/brand_assets/robinhood-chain-brand-assets-v1.zip
//                               (Robinhood Chain Logo/Robinhood_Chain_Logo_White.svg)
// zcash-primary-white.svg       https://z.cash/wp-content/uploads/2023/12/Primary-Logo-White.svg (z.cash/press)
// arbitrum-full-color-white.svg https://arbitrum.io/brandkit/logo_full_color_white.svg (arbitrum.io/brand-kit)
const LOGOS = {
  'robinhood-chain': { svg: robinhoodChain, label: 'Robinhood Chain' },
  zcash: { svg: zcash, label: 'Zcash' },
  arbitrum: { svg: arbitrum, label: 'Arbitrum' },
} as const;

export type NetworkKey = keyof typeof LOGOS;

export function NetworkLogo({ name, className }: { name: NetworkKey; className?: string }) {
  const logo = LOGOS[name];
  return (
    <span
      role="img"
      aria-label={logo.label}
      className={`flex items-center justify-center [&>svg]:h-full [&>svg]:w-full ${className ?? ''}`}
      dangerouslySetInnerHTML={{ __html: logo.svg }}
    />
  );
}

/** Inline an official social mark (raw SVG string) at a given size. */
export function RawMark({ svg, className, label }: { svg: string; className?: string; label?: string }) {
  return (
    <span
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      className={`inline-flex [&>svg]:h-full [&>svg]:w-full ${className ?? ''}`}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
