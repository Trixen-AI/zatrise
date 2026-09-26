import { useState } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router';
import { Logo } from '@/components/brand/Logo';
import { ArrowUpRight, Close, Menu } from '@/components/ui/icons';
import { DOC_GROUPS, DOCS } from './content';

function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <nav aria-label="Docs" className="flex flex-col gap-[28px]">
      {DOC_GROUPS.map((group) => (
        <div key={group} className="flex flex-col gap-[6px]">
          <p className="px-[12px] text-[1.3rem] font-semibold uppercase tracking-[1px] text-muted">{group}</p>
          <ul className="flex flex-col">
            {DOCS.filter((d) => d.group === group).map((d) => (
              <li key={d.slug}>
                <NavLink
                  to={d.slug ? `/docs/${d.slug}` : '/docs'}
                  end
                  onClick={onNavigate}
                  className={({ isActive }) =>
                    `block rounded-[10px] px-[12px] py-[8px] text-[1.5rem] transition-colors ${
                      isActive ? 'bg-gold-deep font-semibold text-gold' : 'text-soft hover:bg-white/5 hover:text-white'
                    }`
                  }
                >
                  {d.title}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </nav>
  );
}

export default function DocsLayout() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  return (
    <div className="min-h-screen overflow-x-clip bg-bg">
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[rgba(21,19,15,0.85)] backdrop-blur-[8px]">
        <div className="mx-auto flex h-[64px] max-w-[1400px] items-center justify-between gap-[8px] px-[16px] sm:h-[72px] sm:px-[20px]">
          <div className="flex min-w-0 items-center gap-[10px] sm:gap-[16px]">
            <Link to="/" aria-label="Zatrise home" className="shrink-0">
              <Logo height={26} className="sm:hidden" />
              <Logo height={32} className="hidden sm:block" />
            </Link>
            <span className="h-[18px] w-px shrink-0 bg-white/15" aria-hidden />
            <Link to="/docs" className="text-[1.6rem] font-semibold text-soft sm:text-[1.8rem]">
              Docs
            </Link>
          </div>
          <div className="flex shrink-0 items-center gap-[6px] sm:gap-[12px]">
            <Link to="/" className="t-small-m hidden text-soft hover:text-white sm:block">
              Website
            </Link>
            <Link
              to="/app"
              className="flex items-center gap-[6px] whitespace-nowrap rounded-full border border-gold bg-gold-deep px-[12px] py-[6px] transition-colors hover:bg-gold-hover sm:gap-[8px] sm:px-[16px] sm:py-[8px]"
            >
              <span className="text-[1.3rem] font-medium leading-130 text-gold sm:text-[1.4rem]">Launch app</span>
              <ArrowUpRight size={12} className="hidden stroke-[var(--gold)] sm:block" />
            </Link>
            <button
              type="button"
              className="flex h-[36px] w-[36px] items-center justify-center sm:h-[40px] sm:w-[40px] lg:hidden"
              aria-label={open ? 'Close docs menu' : 'Open docs menu'}
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
            >
              {open ? <Close /> : <Menu />}
            </button>
          </div>
        </div>
      </header>

      {open && (
        <div className="fixed inset-x-0 bottom-0 top-[64px] z-40 overflow-y-auto bg-surface p-[20px] sm:top-[72px] lg:hidden">
          <Sidebar onNavigate={() => setOpen(false)} />
        </div>
      )}

      <div className="mx-auto flex max-w-[1400px] gap-[48px] px-[16px] sm:px-[20px]">
        <aside className="sticky top-[72px] hidden h-[calc(100vh-72px)] w-[260px] shrink-0 overflow-y-auto py-[40px] lg:block">
          <Sidebar />
        </aside>
        <main key={pathname} className="min-w-0 flex-1 py-[40px] lg:py-[56px]">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
