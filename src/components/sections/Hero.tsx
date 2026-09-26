import { useRef } from 'react';
import { HeroVortex } from '@/components/art/HeroVortex';
import { ChevronRight } from '@/components/ui/icons';
import { SmartLink } from '@/components/ui/SmartLink';
import { HERO } from '@/data/content';
import { gsap, MOTION, MOTION_OK, useGSAP } from '@/lib/gsap';

export function Hero() {
  const section = useRef<HTMLElement>(null);
  const backdrop = useRef<HTMLDivElement>(null);
  const title = useRef<HTMLDivElement>(null);
  const links = useRef<HTMLDivElement>(null);
  const overlay = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(`(min-width: 1024px) and ${MOTION_OK}`, () => {
        // pinned for one viewport; the next section slides over it
        gsap.timeline({
          scrollTrigger: { trigger: section.current, start: 'top top', end: '+=100%', pin: true, pinSpacing: false },
        });
        const t = MOTION.heroTitle;
        gsap.to(title.current, {
          yPercent: -100,
          opacity: 0,
          ease: t.ease,
          scrollTrigger: { start: t.start, end: t.end, scrub: MOTION.scrub },
        });
        gsap.to([links.current, overlay.current], {
          opacity: 0,
          ease: t.ease,
          scrollTrigger: { start: t.start, end: t.end, scrub: MOTION.scrub },
        });
        const b = MOTION.heroBackdrop;
        gsap.to(backdrop.current, {
          scale: b.scale,
          yPercent: b.yPercent,
          opacity: 0,
          ease: b.ease,
          scrollTrigger: { start: b.start, end: b.end, scrub: MOTION.scrub },
        });
      });
      return () => mm.revert();
    },
    { scope: section },
  );

  return (
    <section
      ref={section}
      id="top"
      className="relative flex w-full flex-col items-start justify-start overflow-hidden lg:min-h-screen lg:items-center lg:justify-center lg:pb-[40px] lg:pt-[88px]"
    >
      <div ref={backdrop} className="absolute inset-0 z-0 flex h-[calc(100vh-72px)] w-full will-change-transform lg:h-full">
        <HeroVortex className="h-full w-full" />
      </div>

      <div className="z-10 flex h-[calc(100vh-72px)] w-full flex-col items-center justify-center gap-[32px] px-[20px] py-[40px] lg:h-auto lg:p-0">
        <div
          ref={title}
          className="flex w-full flex-col items-center justify-center gap-[8px] will-change-transform lg:max-w-[1016px] lg:gap-[12px] lg:text-center"
        >
          <p className="t-eyebrow text-center text-[1.8rem] lg:text-[2.4rem]">{HERO.eyebrow}</p>
          <h1 className="break-words text-center font-outfit text-[4.8rem] font-bold leading-120 tracking-[-0.48px] text-white lg:text-[clamp(5.6rem,min(7vw,11vh),10rem)] lg:tracking-[-1px]">
            {HERO.title}
          </h1>
        </div>
        <div ref={links} className="flex w-full flex-col items-center gap-[16px] will-change-transform lg:flex-row lg:justify-center lg:gap-[20px]">
          <SmartLink href={HERO.primaryHref} className="btn btn-primary">
            {HERO.primary}
            <ChevronRight />
          </SmartLink>
          <SmartLink href={HERO.secondaryHref} className="btn btn-ghost btn-hero">
            {HERO.secondary}
            <ChevronRight />
          </SmartLink>
        </div>
      </div>

      <div
        ref={overlay}
        className="relative z-10 flex w-full flex-col-reverse items-start gap-[16px] px-[20px] pt-[40px] lg:max-w-[1036px] lg:flex-col lg:gap-[20px] lg:px-[10px] lg:pt-[clamp(32px,13.3vh,120px)]"
      >
        <p className="t-small text-muted-2">{HERO.footnote}</p>
        <div className="flex w-full flex-col gap-[32px] lg:flex-row">
          {HERO.stats.map((s) => (
            <div
              key={s.label}
              className="flex flex-col gap-[4px] overflow-hidden rounded-[16px] px-[32px] py-[24px] backdrop-blur-[12px] lg:flex-1 lg:[&:not(:last-child)]:flex-none"
              style={{
                minWidth: s.minW,
                background:
                  'radial-gradient(50% 71.86% at 50% 0px, rgba(245, 184, 61, 0.06) 0px, rgba(245, 184, 61, 0) 100%), rgba(0, 0, 0, 0.2)',
                border: '1.5px solid rgba(255, 255, 255, 0.2)',
              }}
            >
              <div className="flex flex-row items-center justify-center gap-[8px]">
                {s.prefix && <span className="t-h1 font-semibold">{s.prefix}</span>}
                <span className="font-outfit text-[6.4rem] leading-120 tracking-[-0.64px] text-white">{s.value}</span>
                {s.suffix && <span className="t-h1 font-semibold">{s.suffix}</span>}
              </div>
              <p className="t-body-m text-center">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
