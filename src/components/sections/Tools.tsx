import { useRef } from 'react';
import { ContourIsland } from '@/components/art/ContourIsland';
import { ArrowUpRight } from '@/components/ui/icons';
import { SmartLink } from '@/components/ui/SmartLink';
import { TOOLS } from '@/data/content';
import { useReveal } from '@/hooks/useReveal';
import { gsap, MOTION_OK, useGSAP } from '@/lib/gsap';

type Slot = {
  pos: string;
  pill: string;
  tags: { pos: string; depth: number }[];
};

// Placement on the 1440 grid (measured), each word with its pill and floating tags.
const SLOTS: Slot[] = [
  { pos: 'left-[18%] top-[318px]', pill: 'bottom-[-20px] right-[-59px]', tags: [{ pos: 'bottom-[27px] left-[-105px]', depth: 0.6 }, { pos: 'bottom-[-13px] left-[-45px]', depth: -0.9 }] },
  { pos: 'left-[0.2%] top-[542px]', pill: 'left-[111px] top-[5px]', tags: [{ pos: 'bottom-[-43px] left-[129px]', depth: -0.5 }, { pos: 'bottom-[-97px] left-[38px]', depth: 0.8 }] },
  { pos: 'right-[30%] top-[442px]', pill: 'bottom-[-20px] left-[-46px]', tags: [{ pos: 'right-[-169px] top-[-29px]', depth: 0.5 }, { pos: 'right-[-223px] top-0', depth: -0.7 }] },
  { pos: 'right-[15%] top-[657px]', pill: 'bottom-[-22px] right-[-42px]', tags: [{ pos: 'right-[-100px] top-[-10px]', depth: -1 }] },
  { pos: 'left-[25%] top-[763px]', pill: 'bottom-[-24px] left-[-14px]', tags: [] },
];

function Pill({ label, dot }: { label: string; dot: string }) {
  return (
    <span className="tool-pill flex flex-row items-center gap-[8px] whitespace-nowrap rounded-full border border-white bg-black px-[12px] py-[8px] transition-colors lg:px-[16px]">
      <span className="tool-dot h-[15px] w-[15px] rounded-full transition-colors" style={{ backgroundColor: dot }} />
      <span className="text-[1.6rem] font-medium leading-140 tracking-[-0.18px] lg:text-[1.8rem]">{label}</span>
      <ArrowUpRight className="stroke-white" />
    </span>
  );
}

export function Tools() {
  const section = useRef<HTMLElement>(null);
  const wrap = useRef<HTMLDivElement>(null);
  useReveal(wrap);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(`(min-width: 1024px) and ${MOTION_OK}`, () => {
        // words drift up as the section passes
        gsap.to('.tool-item', {
          y: -80,
          ease: 'none',
          scrollTrigger: { trigger: section.current, start: 'top bottom', end: 'top -300px', scrub: 1 },
        });
        // tags lean toward the pointer, each at its own depth
        const tags = gsap.utils.toArray<HTMLElement>('.tool-tag');
        const onMove = (e: PointerEvent) => {
          const r = section.current!.getBoundingClientRect();
          const nx = (e.clientX - r.left) / r.width - 0.5;
          const ny = (e.clientY - r.top) / r.height - 0.5;
          tags.forEach((t) => {
            const d = Number(t.dataset.depth);
            gsap.to(t, {
              x: nx * 90 * d,
              y: ny * 90 * d,
              rotateY: nx * 4 * d,
              rotateX: -ny * 4 * d,
              transformPerspective: 800,
              duration: 1.2,
              ease: 'power2.out',
            });
          });
        };
        section.current!.addEventListener('pointermove', onMove);
        return () => section.current?.removeEventListener('pointermove', onMove);
      });
      return () => mm.revert();
    },
    { scope: section },
  );

  return (
    <section ref={section} id="launches" className="relative z-10 mx-auto w-full max-w-[1440px] bg-bg lg:flex lg:h-screen lg:min-h-[1080px] lg:flex-col lg:justify-center">
      <div ref={wrap} className="relative flex w-full flex-col overflow-x-hidden px-[20px] pb-[160px] will-change-transform lg:py-[140px]">
        <div className="mb-[40px] flex w-full flex-row justify-between lg:mb-0">
          <div className="static flex flex-col lg:absolute lg:left-[20px] lg:top-[100px]">
            <p className="t-eyebrow mb-[8px] lg:mb-[12px]">{TOOLS.eyebrow}</p>
            <h2 className="t-h1 mb-[24px] lg:mb-[32px]">{TOOLS.title}</h2>
            <div>
              <SmartLink href={TOOLS.ctaHref} className="btn btn-ghost">
                {TOOLS.cta}
                <ArrowUpRight />
              </SmartLink>
            </div>
          </div>
          {/* right rail decoration */}
          <div className="absolute right-[40px] top-[100px] hidden lg:flex" aria-hidden>
            <div className="absolute right-0 top-0 flex flex-col items-end">
              <svg width="136" height="105" viewBox="0 0 136 105" fill="none" className="mr-[20px]">
                <ellipse cx="68" cy="52" rx="64" ry="26" transform="rotate(-32 68 52)" stroke="#fff" strokeWidth="1.2" />
                <circle cx="104" cy="22" r="7" fill="var(--gold)" />
                <path d="M68 38c.6 7 4.8 11.2 11.8 11.8-7 .6-11.2 4.8-11.8 11.8-.6-7-4.8-11.2-11.8-11.8 7-.6 11.2-4.8 11.8-11.8Z" fill="#fff" />
              </svg>
              <svg width="24" height="66" viewBox="0 0 24 66" fill="none" className="mr-[20px]">
                {[4, 24, 44].map((y, i) => (
                  <path key={y} d={`M3 ${y + 16}l9-10 9 10`} stroke="#fff" strokeOpacity={1 - i * 0.3} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
                ))}
              </svg>
              <div className="mr-[32px] mt-[24px] h-[320px] w-px bg-white" />
            </div>
          </div>
        </div>

        {/* desktop: words around the island */}
        <div className="relative mx-auto hidden w-full max-w-[900px] items-center justify-center lg:flex">
          <div className="relative m-auto block aspect-[900/792] w-full">
            <ContourIsland className="absolute inset-0 h-full w-full" />
          </div>
        </div>
        {TOOLS.items.map((item, i) => {
          const slot = SLOTS[i];
          return (
            <div key={item.name} className={`absolute hidden lg:flex ${slot.pos}`}>
              <div className="tool-item group relative flex h-[106px] flex-row will-change-transform">
                <SmartLink href={item.href} className="flex">
                  <span className="font-urbanist text-[9.6rem] font-extrabold leading-120 tracking-[1.92px] text-white">{item.name}</span>
                  <span className={`absolute ${slot.pill} [&_.tool-pill]:group-hover:border-gold [&_.tool-pill]:group-hover:bg-[#b07f1e] [&_.tool-dot]:group-hover:!bg-white`}>
                    <Pill label={item.pill} dot={item.dot} />
                  </span>
                </SmartLink>
                {item.tags.map((t, k) => (
                  <div key={t} className={`tool-tag absolute will-change-transform ${slot.tags[k].pos}`} data-depth={slot.tags[k].depth}>
                    <p className="whitespace-nowrap text-[1.4rem] leading-130 tracking-[-0.14px] text-white/30">{t}</p>
                  </div>
                ))}
              </div>
            </div>
          );
        })}

        {/* mobile: stacked words over the island */}
        <div className="relative flex w-full flex-col items-center gap-[12px] lg:hidden">
          <ContourIsland className="absolute left-0 top-1/2 -z-10 w-full -translate-y-1/2" />
          {TOOLS.items.map((item) => (
            <SmartLink key={item.name} href={item.href} className="relative z-10 flex flex-col items-center px-[32px]">
              <span className="font-urbanist text-[6.5rem] font-extrabold leading-120 tracking-[1.92px]">{item.name}</span>
              <span className="-mt-[14px] scale-75">
                <Pill label={item.pill} dot={item.dot} />
              </span>
            </SmartLink>
          ))}
        </div>
      </div>
    </section>
  );
}
