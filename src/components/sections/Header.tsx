import { useEffect, useState } from 'react';
import { Logo } from '@/components/brand/Logo';
import { ArrowUpRight, ChevronDown, Close, External, Menu } from '@/components/ui/icons';
import { NAV, type NavLink } from '@/data/content';
import { SmartLink } from '@/components/ui/SmartLink';
import { resolveHref } from '@/lib/links';

function SubLink({ link }: { link: NavLink }) {
  const ext = link.external;
  return (
    <li className="flex h-[34px] w-full cursor-pointer items-center rounded-[8px] hover:bg-white/5">
      <SmartLink href={resolveHref(link)} external={ext} className="flex h-full flex-1 items-center gap-[16px] px-[10px]">
        <span className="t-small-m text-white">{link.label}</span>
        {ext && <External className="text-muted" />}
      </SmartLink>
    </li>
  );
}

function Dropdown({ children, width, left = 0 }: { children: React.ReactNode; width: number; left?: number }) {
  return (
    <div
      className="invisible absolute top-[48px] py-[8px] opacity-0 transition-opacity duration-300 group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100"
      style={{ width, left }}
    >
      <div className="animate-[dropIn_.3s_ease-out] rounded-[16px] border border-white/10 bg-bg p-[10px]">
        <ul className="flex flex-col">{children}</ul>
      </div>
    </div>
  );
}

function Divider() {
  return <span className="h-[16px] w-px bg-white/15" aria-hidden />;
}

/** Pill that opens the ZecPad app. */
function LaunchAppButton() {
  return (
    <SmartLink
      href="/app"
      className="group flex items-center gap-[8px] whitespace-nowrap rounded-full border border-gold bg-gold-deep px-[16px] py-[8px] transition-colors duration-150 hover:bg-gold-hover"
    >
      <span className="t-small-m text-gold">Launch app</span>
      <ArrowUpRight size={12} className="stroke-[var(--gold)]" />
    </SmartLink>
  );
}

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 0);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className="fixed inset-x-0 top-0 z-[100] flex w-full border-b border-white/10 bg-surface transition-all lg:border-b-0 lg:bg-transparent"
      style={scrolled ? { backgroundColor: 'rgba(30, 27, 22, 0.8)' } : undefined}
    >
      <div className="flex w-full flex-col py-[16px] pl-[20px] pr-[10px] sm:mx-auto lg:max-w-[1400px] lg:flex-row lg:px-[20px] lg:py-[19px]">
        <div className="relative z-20 flex w-full items-center justify-between">
          <div className="flex grow-0 basis-auto lg:basis-[420px]">
            <a href="#top" aria-label="ZecPad home" className="flex">
              <Logo height={36} className="hidden lg:block" />
              <Logo height={30} className="lg:hidden" />
            </a>
          </div>

          <nav
            aria-label="Main"
            className="mx-[24px] hidden shrink-0 grow-0 rounded-full border border-white/10 px-[24px] backdrop-blur-[6px] lg:flex"
            style={{ background: 'var(--nav-glass)' }}
          >
            <ul className="flex h-[48px] items-center">
              {NAV.map((item, i) => (
                <li key={item.label} className="flex h-full items-center">
                  {i > 0 && <Divider />}
                  {item.children ? (
                    <div className="group relative flex h-full items-center">
                      <button
                        type="button"
                        className="flex h-full items-center gap-[8px] px-[16px]"
                        aria-haspopup="true"
                      >
                        <span className="t-body-m text-white">{item.label}</span>
                        <ChevronDown className="text-white transition-transform group-hover:rotate-180" />
                      </button>
                      <Dropdown width={item.width ?? 160} left={0}>
                        {item.children.map((c) => (
                          <SubLink key={c.label} link={c} />
                        ))}
                      </Dropdown>
                    </div>
                  ) : (
                    <SmartLink
                      href={item.href ?? '#'}
                      className={`t-body-m ${i === 0 ? 'pr-[16px] text-gold' : 'pl-[16px] text-white'}`}
                    >
                      {item.label}
                    </SmartLink>
                  )}
                </li>
              ))}
            </ul>
          </nav>

          <div className="hidden basis-[420px] items-center justify-end gap-[16px] lg:flex">
            <LaunchAppButton />
          </div>

          <div className="flex items-center gap-[8px] lg:hidden">
            <LaunchAppButton />
            <button
              type="button"
              className="flex h-[40px] w-[40px] items-center justify-center"
              aria-label={open ? 'Close menu' : 'Open menu'}
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
            >
              {open ? <Close /> : <Menu />}
            </button>
          </div>
        </div>
      </div>

      {open && (
        <nav aria-label="Mobile" className="fixed inset-x-0 bottom-0 top-[72px] overflow-y-auto bg-surface lg:hidden">
          <ul className="flex flex-col py-[8px]">
            {NAV.map((item) =>
              item.children ? (
                <li key={item.label}>
                  <details className="group">
                    <summary className="flex cursor-pointer list-none items-center justify-between px-[20px] py-[15.5px]">
                      <span className="t-body-m">{item.label}</span>
                      <ChevronDown className="mr-[8px] transition-transform group-open:rotate-180" />
                    </summary>
                    <ul className="flex flex-col bg-bg px-[10px] py-[4px]">
                      {item.children.map((c) => (
                        <SubLink key={c.label} link={c} />
                      ))}
                    </ul>
                  </details>
                </li>
              ) : (
                <li key={item.label}>
                  <SmartLink href={item.href ?? '#'} onClick={() => setOpen(false)} className="t-body-m block px-[20px] py-[15.5px]">
                    {item.label}
                  </SmartLink>
                </li>
              ),
            )}
          </ul>
        </nav>
      )}
    </header>
  );
}
