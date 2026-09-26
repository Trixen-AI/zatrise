import { useAppKit } from '@reown/appkit/react';
import { useState } from 'react';
import { useSeo } from '@/lib/seo';
import { Link, NavLink, Outlet, useLocation } from 'react-router';
import { useAccount, useBalance } from 'wagmi';
import { Logo } from '@/components/brand/Logo';
import { Close, Menu } from '@/components/ui/icons';
import { SUPPORTED_CHAIN_IDS } from '@/app/config/wallet';
import { fmtEth, shortAddress } from '@/app/lib/format';
import {
  IconActivity,
  IconApply,
  IconDocs,
  IconHome,
  IconLaunch,
  IconOverview,
  IconPool,
  IconRewards,
  IconVote,
  IconWallet,
} from '@/app/ui/icons';

const NAV = [
  { to: '/app', label: 'Overview', icon: IconOverview, end: true },
  { to: '/app/launches', label: 'Launches', icon: IconLaunch },
  { to: '/app/stake', label: 'zPool', icon: IconPool },
  { to: '/app/rewards', label: 'Rewards', icon: IconRewards },
  { to: '/app/govern', label: 'Governance', icon: IconVote },
  { to: '/app/wallet', label: 'Wallet', icon: IconWallet },
  { to: '/app/activity', label: 'Activity', icon: IconActivity },
];

const PAGE_SEO = [
  { path: '/app', exact: true, title: 'App', description: 'Your Zatrise overview: wallet balance, zPool stake, epoch weight and live launches on Robinhood Chain.' },
  { path: '/app/launches', title: 'Launches', description: 'Fixed-price token sales on Robinhood Chain. Commit ETH, and 5% of every raise funds the ZEC reward pool.' },
  { path: '/app/create', title: 'Launch a token', description: 'Zatrise deploys your ERC-20 on Robinhood Chain and opens a fixed-price sale. Set the terms and upload your logo.' },
  { path: '/app/stake', title: 'zPool staking', description: "Stake ETH in zPool to build weight and earn your share of each epoch's ZEC rewards." },
  { path: '/app/rewards', title: 'ZEC rewards', description: 'Claim your epoch rewards in ZEC to a transparent or shielded Zcash address.' },
  { path: '/app/govern', title: 'Governance', description: 'Vote with your staked ETH on the fee split, epoch length and listing rules.' },
  { path: '/app/wallet', title: 'Wallet', description: 'Your balances, tokens and transactions on Robinhood Chain.' },
  { path: '/app/activity', title: 'Activity', description: 'Every request you signed in Zatrise, verifiable against your address.' },
];

const TEAM_NAV = [{ to: '/app/create', label: 'Launch a token', icon: IconApply }];

function NavItem({ to, label, icon: Icon, end, onClick }: { to: string; label: string; icon: typeof IconOverview; end?: boolean; onClick?: () => void }) {
  return (
    <NavLink
      to={to}
      end={end}
      onClick={onClick}
      className={({ isActive }) =>
        `flex items-center gap-[12px] rounded-[12px] px-[14px] py-[10px] text-[1.5rem] font-medium transition-colors ${
          isActive ? 'bg-gold-deep text-gold' : 'text-soft hover:bg-white/5 hover:text-white'
        }`
      }
    >
      <Icon />
      {label}
    </NavLink>
  );
}

function SideNav({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <div className="flex h-full flex-col gap-[28px]">
      <nav aria-label="App" className="flex flex-col gap-[4px]">
        {NAV.map((n) => (
          <NavItem key={n.to} {...n} onClick={onNavigate} />
        ))}
      </nav>
      <div className="flex flex-col gap-[4px]">
        <p className="px-[14px] pb-[4px] text-[1.2rem] font-semibold uppercase tracking-[1px] text-muted">For teams</p>
        {TEAM_NAV.map((n) => (
          <NavItem key={n.to} {...n} onClick={onNavigate} />
        ))}
      </div>
      <div className="mt-auto flex flex-col gap-[4px] border-t border-white/10 pt-[16px]">
        <Link to="/docs" onClick={onNavigate} className="flex items-center gap-[12px] rounded-[12px] px-[14px] py-[10px] text-[1.5rem] text-soft hover:bg-white/5 hover:text-white">
          <IconDocs />
          Docs
        </Link>
        <Link to="/" onClick={onNavigate} className="flex items-center gap-[12px] rounded-[12px] px-[14px] py-[10px] text-[1.5rem] text-soft hover:bg-white/5 hover:text-white">
          <IconHome />
          Website
        </Link>
      </div>
    </div>
  );
}

function NetworkButton() {
  const { chain, chainId, isConnected } = useAccount();
  const { open } = useAppKit();
  if (!isConnected) return null;
  const supported = chainId !== undefined && SUPPORTED_CHAIN_IDS.has(chainId);
  const name = supported ? (chain?.name ?? 'Robinhood Chain') : 'Wrong network';
  return (
    <button
      type="button"
      onClick={() => open({ view: 'Networks' })}
      className={`hidden items-center gap-[8px] rounded-full border px-[14px] py-[8px] text-[1.4rem] font-medium transition-colors sm:flex ${
        supported ? 'border-white/15 bg-surface text-soft hover:border-line-2' : 'border-[#ff5f7e]/60 bg-[#ff5f7e]/10 text-[#ff9aae]'
      }`}
    >
      <span className={`h-[8px] w-[8px] rounded-full ${supported ? (chain?.testnet ? 'bg-[#8fb8ff]' : 'bg-[#62d6a8]') : 'bg-[#ff5f7e]'}`} aria-hidden />
      {name}
    </button>
  );
}

function AccountButton() {
  const { address, isConnected, chainId } = useAccount();
  const { open } = useAppKit();
  const { data: balance } = useBalance({ address, chainId, query: { enabled: !!address } });

  if (!isConnected || !address) {
    return (
      <button type="button" onClick={() => open()} className="btn btn-primary px-[18px] py-[8px] text-[1.4rem]">
        Connect wallet
      </button>
    );
  }
  return (
    <button
      type="button"
      onClick={() => open({ view: 'Account' })}
      className="flex items-center gap-[10px] rounded-full border border-gold/60 bg-gold-deep py-[4px] pl-[14px] pr-[4px] transition-colors hover:bg-gold-hover"
    >
      <span className="hidden text-[1.4rem] font-semibold text-gold sm:inline">{balance ? fmtEth(balance.value, 4) : '…'}</span>
      <span className="rounded-full bg-bg px-[12px] py-[5px] text-[1.4rem] font-medium text-white">{shortAddress(address)}</span>
    </button>
  );
}

export function DashboardLayout() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  const section = PAGE_SEO.find((p) => (p.exact ? pathname === p.path : pathname.startsWith(p.path))) ?? PAGE_SEO[0];
  useSeo({ title: section.title, description: section.description, path: pathname });

  return (
    <div className="min-h-screen bg-bg">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[260px] flex-col border-r border-white/10 bg-[#18160f] px-[16px] pb-[20px] pt-[22px] lg:flex">
        <Link to="/" aria-label="Zatrise home" className="mb-[32px] px-[10px]">
          <Logo height={34} />
        </Link>
        <SideNav />
      </aside>

      <div className="lg:pl-[260px]">
        <header className="sticky top-0 z-30 border-b border-white/10 bg-[rgba(21,19,15,0.85)] backdrop-blur-[8px]">
          <div className="flex h-[72px] items-center justify-between gap-[12px] px-[20px] lg:px-[36px]">
            <div className="flex items-center gap-[12px] lg:hidden">
              <button
                type="button"
                className="flex h-[40px] w-[40px] items-center justify-center"
                aria-label={open ? 'Close menu' : 'Open menu'}
                aria-expanded={open}
                onClick={() => setOpen((v) => !v)}
              >
                {open ? <Close /> : <Menu />}
              </button>
              <Link to="/app" aria-label="Zatrise app">
                <Logo height={28} />
              </Link>
            </div>
            <p className="t-small hidden text-muted lg:block">Launch on Robinhood Chain. Earn in ZEC.</p>
            <div className="flex items-center gap-[10px]">
              <NetworkButton />
              <AccountButton />
            </div>
          </div>
        </header>

        {open && (
          <div className="fixed inset-x-0 bottom-0 top-[72px] z-40 overflow-y-auto bg-surface px-[16px] py-[20px] lg:hidden">
            <SideNav onNavigate={() => setOpen(false)} />
          </div>
        )}

        <main key={pathname} className="mx-auto w-full max-w-[1280px] px-[20px] py-[28px] lg:px-[36px] lg:py-[40px]">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
