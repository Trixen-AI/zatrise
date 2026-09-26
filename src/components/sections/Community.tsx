import { useRef } from 'react';
import { ActionGlyph, Ribbons } from '@/components/art/CommunityArt';
import { PANEL } from '@/components/art/panels';
import { RawMark } from '@/components/brand/NetworkLogo';
import { ArrowDownLeft, ArrowRight, ArrowUpRight } from '@/components/ui/icons';
import { SmartLink } from '@/components/ui/SmartLink';
import { COMMUNITY } from '@/data/content';
import { SOCIAL_MARKS, socialHref } from '@/data/social';
import { useReveal } from '@/hooks/useReveal';

type Action = (typeof COMMUNITY.actions)[number];

function ActionCard({ action }: { action: Action }) {
  return (
    <SmartLink
      href={action.href}
      className="group relative flex w-[256px] shrink-0 basis-[320px] flex-col justify-between overflow-hidden rounded-[20px] bg-surface-2 p-[20px] lg:w-auto lg:shrink lg:basis-1/2"
      style={{ border: '1.2px solid rgba(255, 255, 255, 0.15)' }}
    >
      <ActionGlyph
        glyph={action.glyph}
        className="absolute inset-0 h-full w-full transition-transform duration-300 group-active:scale-125 lg:group-hover:scale-125"
      />
      <div className="relative flex w-full justify-end">
        <span className="flex flex-row items-center justify-end gap-[8px]">
          <span className="text-[1.6rem] leading-140 text-white">{action.label}</span>
          <ArrowUpRight className="stroke-white" />
        </span>
      </div>
      <span className="absolute bottom-[20px] left-[20px] font-urbanist text-[3.6rem] font-extrabold italic leading-100 tracking-[-0.5px] text-white lg:bottom-[40px] lg:left-[40px]">
        {action.word}
      </span>
    </SmartLink>
  );
}

/** X card: fills the social block under "Join the community". */
function XCard({ title, label, bg }: { title: string; label: string; bg: string }) {
  const mark = SOCIAL_MARKS.x;
  return (
    <div className="group relative flex flex-1 items-center justify-center overflow-hidden">
      <div className="absolute inset-0 transition-transform duration-300 group-active:scale-125 lg:group-hover:scale-125" style={{ background: bg }}>
        <Ribbons className="h-full w-full" tone="rgba(21,19,15,0.12)" />
      </div>
      <a
        href={socialHref('x')}
        target="_blank"
        rel="noopener noreferrer"
        className="relative flex h-full w-full items-center justify-center gap-[14px] p-[30px] text-bg lg:items-start lg:justify-start"
      >
        <span className="flex h-[40px] w-[40px] items-center justify-center rounded-full bg-black p-[9px]">
          <RawMark svg={mark} className="h-full w-full" />
        </span>
        <span className="t-h1 text-bg">{title}</span>
        <span className="absolute bottom-[20px] right-[20px] flex flex-row items-center justify-end gap-[8px]">
          <span className="text-[1.6rem] font-medium leading-140">{label}</span>
          <ArrowUpRight className="stroke-bg" />
        </span>
      </a>
    </div>
  );
}

export function Community() {
  const box = useRef<HTMLDivElement>(null);
  useReveal(box);
  const [a1, a2, a3, a4] = COMMUNITY.actions;

  return (
    <section className="relative z-10 mx-auto flex w-full max-w-[1440px] flex-col overflow-hidden bg-bg lg:h-screen lg:min-h-[1080px] lg:justify-center">
      <div ref={box} className="relative flex flex-col gap-[40px] px-[20px] pb-[160px] will-change-transform lg:gap-[85px] lg:pb-[140px] lg:pt-[100px]">
        <div className="flex flex-col items-center justify-center gap-[8px] lg:gap-[12px]">
          <p className="t-eyebrow">{COMMUNITY.eyebrow}</p>
          <h2 className="text-center font-outfit text-[3.2rem] font-semibold leading-130 tracking-[-0.32px] lg:text-[4rem] lg:leading-140 lg:tracking-[-0.4px]">
            {COMMUNITY.title}
          </h2>
        </div>

        <div className="relative flex w-full flex-col items-center gap-[20px] lg:h-[660px] lg:flex-row lg:items-stretch">
          {/* centre arrow badge */}
          <div
            className="absolute top-1/2 z-10 hidden h-[140px] w-[140px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-bg p-[20px] desktop:flex"
            style={{ left: 'calc(30% - 10px)' }}
            aria-hidden
          >
            <div className="flex h-full w-full items-center justify-center rounded-full bg-gold text-bg">
              <ArrowRight />
            </div>
          </div>
          {/* community badge */}
          <a
            href={socialHref('x')}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute right-[3%] top-[37%] z-10 hidden h-[160px] w-[160px] -translate-y-1/2 items-center justify-center rounded-full desktop:flex"
            style={{ background: 'radial-gradient(circle, #fff 0 60%, rgba(255,255,255,0.55) 61% 100%)' }}
          >
            <span className="flex flex-col items-center text-center text-[1.6rem] font-semibold leading-140 text-gold-hover">
              <span>{COMMUNITY.circle[0]}</span>
              <span>{COMMUNITY.circle[1]}</span>
              <ArrowDownLeft className="mt-[6px]" size={22} />
            </span>
          </a>

          <div className="relative flex basis-1/2 flex-col gap-[20px] lg:flex-row">
            <div
              className="relative hidden basis-[60%] overflow-hidden rounded-[20px] px-[40px] py-[32px] lg:flex"
              style={{ background: PANEL.rewards }}
            >
              <Ribbons className="absolute inset-0 h-full w-full" tone="rgba(255,236,190,0.22)" />
              <p className="relative font-outfit text-[8rem] leading-120 tracking-[-0.8px] text-white">{COMMUNITY.big}</p>
            </div>
            <div className="relative flex basis-[40%] flex-col gap-[20px]">
              <ActionCard action={a1} />
              <ActionCard action={a2} />
            </div>
          </div>

          <div className="relative flex basis-1/2 flex-col gap-[20px] lg:flex-row">
            <div className="relative flex basis-[40%] flex-col-reverse gap-[20px] lg:flex-col">
              <ActionCard action={a3} />
              <ActionCard action={a4} />
            </div>
            <div className="relative flex flex-col overflow-hidden lg:basis-[60%] lg:gap-[20px]">
              <div className="relative hidden w-full basis-[36.3%] overflow-hidden rounded-[20px] px-[40px] py-[20px] text-end lg:flex" style={{ background: PANEL.join }}>
                <Ribbons className="absolute inset-0 h-full w-full" />
                <p className="relative break-words font-outfit text-[6.4rem] font-semibold leading-100 tracking-[-0.64px] text-white">{COMMUNITY.join}</p>
              </div>
              <div className="flex w-full basis-[320px] flex-col rounded-[20px] lg:basis-[60.6%]">
                <div className="flex h-full w-[256px] flex-col overflow-hidden rounded-[20px] lg:w-full">
                  <XCard title={COMMUNITY.x.title} label={COMMUNITY.x.label} bg={PANEL.x} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
