import { useRef } from 'react';
import { NetworkLogo } from '@/components/brand/NetworkLogo';
import { STACK } from '@/data/content';
import { useReveal } from '@/hooks/useReveal';

function VDivider({ className = '' }: { className?: string }) {
  return <div className={`flex h-[1.5px] w-[80px] bg-line-2 md:h-[80px] md:w-px ${className}`} aria-hidden />;
}

export function Stack() {
  const box = useRef<HTMLDivElement>(null);
  useReveal(box);

  return (
    <section className="relative z-10 mx-auto flex w-full max-w-[1440px] flex-col overflow-hidden bg-bg lg:h-screen lg:min-h-[1080px] lg:justify-center">
      <div ref={box} className="relative flex flex-col gap-[40px] px-[20px] pb-[160px] will-change-transform lg:gap-[85px] lg:pb-[140px] lg:pt-[100px]">
        <div className="flex flex-col items-center justify-center gap-[8px] lg:gap-[12px]">
          <p className="t-eyebrow">{STACK.eyebrow}</p>
          <h2 className="break-words text-center font-outfit text-[3.2rem] font-semibold leading-130 tracking-[-0.32px] text-white lg:text-[4rem] lg:leading-140 lg:tracking-[-0.4px]">
            {STACK.title[0]}
            <br />
            {STACK.title[1]}
          </h2>
        </div>

        <div className="flex w-full px-[40px] lg:px-0">
          <div
            className="flex w-full items-center justify-center rounded-[16px] bg-surface px-[40px] py-[80px] lg:h-[450px] lg:px-[80px] lg:py-[103px]"
            style={{ border: '1.2px solid rgba(255, 255, 255, 0.15)' }}
          >
            <div className="flex w-full flex-col items-center justify-center gap-[50px] lg:max-w-[1200px] lg:gap-[80px]">
              <div className="flex w-full flex-col items-center justify-center gap-[50px] md:flex-row lg:gap-[60px]">
                <div className="flex aspect-[314/80] w-full max-w-[177px] md:max-w-[314px]">
                  <NetworkLogo name="robinhood-chain" className="h-full w-full" />
                </div>
                <VDivider />
                {/* the official Zcash file ships with generous clear space, so it is sized up inside its slot */}
                <div className="relative flex aspect-[311/80] w-full max-w-[155px] md:max-w-[311px]">
                  <NetworkLogo name="zcash" className="absolute left-1/2 top-1/2 h-[185%] w-[185%] -translate-x-1/2 -translate-y-1/2" />
                </div>
              </div>
              <div className="flex h-[1.5px] w-[80px] bg-line-2 md:hidden" aria-hidden />
              <div className="flex w-full items-center justify-center">
                <div className="flex aspect-[335/70] w-full max-w-[174px] md:max-w-[335px]">
                  <NetworkLogo name="arbitrum" className="h-full w-full" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
