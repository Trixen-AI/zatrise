import { useRef } from 'react';
import { BadgeGlobe, LoopMeters, PoolCoin, PoolRings, SettleArt, WireSphere } from '@/components/art/FeatureArt';
import { FEATURES } from '@/data/content';
import { useReveal } from '@/hooks/useReveal';

const [c1, c2, c3, c4] = FEATURES.cards;

function CardHead({ num, title }: { num: string; title: string }) {
  return (
    <div className="flex flex-row items-center gap-[24px]">
      <p className="t-card-num">{num}</p>
      <p className="t-card-title">{title}</p>
    </div>
  );
}

export function Features() {
  const box = useRef<HTMLDivElement>(null);
  useReveal(box, { onLoad: true });

  return (
    <section id="how" className="relative z-10 flex w-full flex-col overflow-hidden bg-bg lg:m-auto lg:h-screen lg:min-h-[1080px] lg:max-w-[1440px] lg:justify-center">
      <div ref={box} className="relative flex w-full flex-col px-[20px] pb-[160px] will-change-transform lg:h-[1080px] lg:py-[100px]">
        <div className="absolute left-[40px] top-[140px] hidden w-[58.5%] lg:flex">
          <div className="relative m-auto aspect-square w-full max-w-[820px]">
            <WireSphere className="absolute inset-0 h-full w-full" />
          </div>
        </div>

        <div className="flex w-full flex-col gap-[8px] text-end lg:gap-[12px]">
          <p className="t-eyebrow">{FEATURES.eyebrow}</p>
          <h2 className="t-h1 break-words font-semibold lg:text-[4.8rem] lg:font-bold lg:leading-120 lg:tracking-normal">
            {FEATURES.title[0]} <br />
            {FEATURES.title[1]}
          </h2>
        </div>

        <div className="relative mt-[40px] flex h-full w-full flex-col gap-[40px] lg:mt-[221px] lg:flex-row lg:gap-0">
          {/* 01 */}
          <article className="glass-card relative flex min-h-[600px] w-full flex-col lg:absolute lg:left-0 lg:top-[-280px] lg:h-[600px] lg:w-[420px]">
            <div className="relative flex h-full flex-col gap-[20px] p-[20px] lg:p-[32px]">
              <CardHead num={c1.num} title={c1.title as string} />
              <p className="t-body text-soft">{c1.body}</p>
              <SettleArt className="absolute bottom-[20px] left-[20px] h-[325px] w-[200px] lg:bottom-[32px] lg:left-[32px]" />
            </div>
          </article>

          {/* 02 */}
          <article
            className="relative flex min-h-[500px] w-full flex-col rounded-[20px] border-[1.2px] border-white/15 backdrop-blur-[4px] lg:absolute lg:bottom-0 lg:right-[46.5%] lg:h-[500px] lg:w-[420px]"
            style={{ background: 'var(--bg)' }}
          >
            <PoolRings className="absolute inset-0 h-full w-full rounded-[20px]" />
            <div className="relative flex h-full w-full flex-col justify-between p-[20px] lg:p-[32px]">
              <div className="relative z-10 mb-[20px] flex flex-col items-center justify-center gap-[32px] lg:mb-0">
                <div className="w-full">
                  <CardHead num={c2.num} title={c2.title as string} />
                </div>
                <PoolCoin className="h-[100px] w-[100px]" />
              </div>
              <p className="t-body relative text-soft">{c2.body}</p>
            </div>
          </article>

          {/* 03 */}
          <article className="glass-card relative flex min-h-[460px] w-full flex-col lg:absolute lg:right-[17%] lg:top-[-120px] lg:h-[460px] lg:w-[480px]">
            <div className="relative flex h-full flex-col gap-[20px] p-[20px] lg:p-[32px]">
              <div className="mb-[20px] lg:mb-0">
                <CardHead num={c3.num} title={c3.title as string} />
              </div>
              <p className="t-body text-soft">{c3.body}</p>
              <LoopMeters className="absolute bottom-[20px] left-[20px] h-[140px] w-[260px] lg:bottom-[32px] lg:left-[32px]" />
            </div>
          </article>

          {/* 04 */}
          <article className="glass-card relative mt-[50px] flex min-h-[320px] w-full flex-col lg:absolute lg:bottom-0 lg:right-0 lg:mt-0 lg:h-[320px] lg:w-[385px]">
            <div className="relative flex h-full flex-col justify-between p-[20px] lg:p-[32px]">
              <div className="mb-[20px] mt-[40px] flex flex-col lg:mb-0">
                <p className="t-card-title">{(c4.title as string[])[0]}</p>
                <p className="t-card-title ml-[24px]">{(c4.title as string[])[1]}</p>
              </div>
              <p className="t-body text-soft">{c4.body}</p>
              <div className="absolute right-[32px] top-[-50px] z-10 flex h-[100px] w-[100px] items-center justify-center overflow-hidden rounded-full">
                <BadgeGlobe className="absolute inset-0 h-full w-full" />
                <p className="t-card-num relative">{c4.num}</p>
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
