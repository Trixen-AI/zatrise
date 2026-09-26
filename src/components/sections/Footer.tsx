import { Logo, Mark, WordmarkOutline } from '@/components/brand/Logo';
import { ArrowUpRight, External } from '@/components/ui/icons';
import { FOOTER } from '@/data/content';
import { SOCIAL } from '@/data/social';
import { SmartLink } from '@/components/ui/SmartLink';
import { resolveHref } from '@/lib/links';

export function Footer() {
  return (
    <footer className="relative z-10 bg-bg pb-[20px] lg:pb-[80px]">
      <div className="relative mx-auto flex w-full max-w-[1440px] flex-col lg:px-[20px]">
        <div className="relative z-10 flex aspect-[1400/200] w-full overflow-hidden">
          <WordmarkOutline className="absolute left-1/2 top-[10%] w-[72%] -translate-x-1/2" />
        </div>

        <div className="relative z-10 flex w-full flex-col rounded-[24px] bg-surface p-[20px] lg:p-[40px]">
          <div className="flex w-full flex-col gap-[40px] border-b border-b-line pb-[32px] lg:flex-row lg:gap-[82px]">
            <div className="flex flex-col justify-start gap-[16px] border-b border-b-line pb-[40px] lg:gap-[20px] lg:border-b-0 lg:border-r lg:border-r-line lg:pr-[82px]">
              <Mark size={40} />
              <p className="t-h1">
                {FOOTER.tagline[0]}
                <br />
                {FOOTER.tagline[1]}
              </p>
            </div>
            <div className="flex flex-1 flex-row flex-wrap gap-[24px] lg:gap-[32px]">
              {FOOTER.columns.map((col, i) => (
                <div key={col.title} className={`flex flex-col gap-[12px] pb-[20px] ${i === FOOTER.columns.length - 1 ? 'mr-auto lg:mr-0' : ''}`}>
                  <p className="t-eyebrow text-white">{col.title}</p>
                  <ul className="flex flex-col gap-[12px]">
                    {col.links.map((l) => (
                      <li key={l.label} className="flex">
                        <SmartLink
                          href={resolveHref(l)}
                          external={l.external}
                          className="flex flex-row items-center gap-[8px] text-muted transition-colors hover:text-soft"
                        >
                          <span className="t-body">{l.label}</span>
                          {l.external && <External />}
                        </SmartLink>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
              <div className="pb-[20px] lg:ml-auto">
                <button
                  type="button"
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  className="flex flex-row items-center gap-[8px] border-b border-b-white"
                >
                  <span className="t-body">Back to top</span>
                  <ArrowUpRight className="stroke-white" />
                </button>
              </div>
            </div>
          </div>

          <div className="flex w-full flex-col items-center gap-[24px] pt-[40px] lg:flex-row-reverse lg:gap-0">
            <div className="flex flex-1 flex-row">
              <ul className="flex w-full justify-center py-[4px] lg:justify-end">
                {SOCIAL.map((s, i) => (
                  <li
                    key={s.key}
                    className={`${i === 0 ? 'pr-[16px]' : i === SOCIAL.length - 1 ? 'pl-[16px]' : 'px-[16px]'} ${i < SOCIAL.length - 1 ? 'border-r border-r-line' : ''}`}
                  >
                    <a href={s.href} target="_blank" rel="noopener noreferrer" className="t-body transition-colors hover:text-gold">
                      {s.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex flex-1 flex-col items-center gap-[12px] lg:flex-row lg:gap-[16px]">
              <Logo height={25} />
              <p className="t-small text-muted">{FOOTER.copyright}</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
