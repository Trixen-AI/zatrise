import { useRef } from 'react';
import { CoreCoin, LoopArrows, LoopDisc, Moon, Sphere } from '@/components/art/CoreArt';
import { Spark } from '@/components/ui/icons';
import { CORE } from '@/data/content';
import { useReveal } from '@/hooks/useReveal';

const [launch, pool, vote] = CORE.systems;

type MoonSpec = { className: string; rest: string };

/** A hoverable system: sphere + satellites; hovering reveals its description and draws the moons in. */
function System({
  name,
  body,
  variant,
  box,
  sphere,
  moons,
  pop,
  ring,
}: {
  name: string;
  body: string;
  variant: 'dots' | 'meridian' | 'mesh';
  box: string;
  sphere: string;
  moons: MoonSpec[];
  pop: 'left' | 'right';
  ring?: boolean;
}) {
  return (
    <div className={`group absolute ${box}`}>
      <div className="relative h-full w-full cursor-pointer" tabIndex={0} aria-label={`${name}: ${body}`}>
        {ring && (
          <svg viewBox="0 0 383 226" className="pointer-events-none absolute inset-0 h-full w-full" fill="none" aria-hidden>
            <ellipse cx="190" cy="118" rx="186" ry="52" transform="rotate(-14 190 118)" stroke="rgba(233,227,213,0.35)" strokeDasharray="14 10" />
          </svg>
        )}
        <Sphere variant={variant} label={name} className={`relative ${sphere}`} />
        {moons.map((m, i) => (
          <div
            key={i}
            className={`absolute transition-transform duration-700 ease-out group-hover:!translate-x-0 group-hover:!translate-y-0 group-focus-within:!translate-x-0 group-focus-within:!translate-y-0 ${m.className}`}
            style={{ transform: m.rest }}
          >
            <Moon className="h-full w-full" />
          </div>
        ))}
        <div
          className={`pointer-events-none absolute bottom-[calc(100%+24px)] w-[390px] translate-y-[12px] opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:translate-y-0 group-focus-within:opacity-100 ${
            pop === 'left' ? 'left-0 text-left' : 'right-0 text-right'
          }`}
        >
          <div className={`flex items-center gap-[8px] ${pop === 'right' ? 'justify-end' : ''}`}>
            <Spark size={24} color="#fff" />
            <p className="t-h1">{name}</p>
          </div>
          <p className="t-body-m mt-[4px]">{body}</p>
        </div>
      </div>
    </div>
  );
}

function CoreDesktop() {
  return (
    <div className="relative mx-auto hidden w-full max-w-[1920px] desktop:flex">
      <div className="aspect-[1920/780] w-full">
        <LoopDisc className="h-full w-full" />
      </div>
      <div className="absolute left-1/2 top-0 mx-auto flex w-[79%] max-w-[1400px] -translate-x-1/2 translate-y-[-50px]">
        <div className="relative aspect-[1400/716] w-full">
          <LoopArrows className="absolute inset-0 z-20 h-full w-full" />
          <CoreCoin className="absolute left-[42.2%] top-[35.5%] z-10 aspect-square w-[12%]" />

          <System
            name={pool.name}
            body={pool.body}
            variant="meridian"
            box="right-[-40px] top-[32px] w-[18.5%] aspect-square z-30"
            sphere="h-full w-full"
            pop="right"
            moons={[
              { className: 'left-[-32%] top-[15px] w-[24.6%] aspect-square', rest: 'translate(-60%, -20px)' },
              { className: 'left-[-11px] top-[102px] w-[10%] aspect-square', rest: 'translate(-130%, 10px)' },
            ]}
          />
          <System
            name={launch.name}
            body={launch.body}
            variant="dots"
            ring
            box="left-[-70px] top-[36%] w-[34%] aspect-[383/226] z-30"
            sphere="left-[21%] top-0 h-full w-auto aspect-square"
            pop="left"
            moons={[
              { className: 'left-[-40px] top-1/2 w-[18.9%] aspect-square', rest: 'translate(-60px, -60%)' },
              { className: 'left-[15px] top-[9px] w-[10%] aspect-square', rest: 'translate(-20px, -30px)' },
            ]}
          />
          <System
            name={vote.name}
            body={vote.body}
            variant="mesh"
            box="bottom-[9%] right-[18%] w-[20%] aspect-square translate-x-[18%] z-30"
            sphere="h-full w-full"
            pop="right"
            moons={[
              { className: 'bottom-[-60px] right-[-30px] w-[29%] aspect-square', rest: 'translate(40px, 0px)' },
              { className: 'bottom-[-29px] right-[-7px] w-[24%] aspect-square', rest: 'translate(100%, -120%)' },
              { className: 'right-[-35px] top-1/2 w-[14%] aspect-square', rest: 'translate(30px, -50%)' },
            ]}
          />
        </div>
      </div>
    </div>
  );
}

function CoreMobile() {
  const items = [
    { s: launch, variant: 'dots' as const, right: false, w: 'max-w-[335px]' },
    { s: pool, variant: 'meridian' as const, right: true, w: 'max-w-[267px]' },
    { s: vote, variant: 'mesh' as const, right: false, w: 'max-w-[280px]' },
  ];
  return (
    <div className="flex w-full max-w-[1440px] flex-col gap-[40px] px-[20px] desktop:hidden">
      {items.map(({ s, variant, right, w }) => (
        <div key={s.key} className={`flex w-full flex-col gap-[32px] md:flex-row md:items-start md:gap-[80px] ${right ? 'md:flex-row-reverse' : ''}`}>
          <div className={`flex ${right ? 'justify-end' : 'justify-center'} md:w-auto`}>
            <Sphere variant={variant} label={s.name} className={`aspect-square w-full md:w-[267px] ${w}`} />
          </div>
          <div className="flex w-full flex-col gap-[4px]">
            <div className={`flex w-full items-center gap-[8px] ${right ? 'justify-end' : ''}`}>
              <Spark size={24} color="#fff" />
              <p className="t-h1">{s.name}</p>
            </div>
            <p className={`t-body-m ${right ? 'text-end' : ''}`}>{s.body}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export function Core() {
  const box = useRef<HTMLDivElement>(null);
  useReveal(box, { onLoad: true });

  return (
    <section id="loop" className="relative z-10 mb-[160px] flex w-full flex-col bg-bg lg:my-[100px] lg:h-screen lg:min-h-[1080px] lg:justify-center">
      <div className="relative desktop:h-[1080px]">
        <div ref={box} className="relative m-auto w-full will-change-transform">
          <div className="mx-auto max-w-[1440px] px-[20px]">
            <div className="mb-[40px] flex flex-col gap-[8px] lg:mb-[100px] lg:gap-[12px]">
              <p className="t-eyebrow">{CORE.eyebrow}</p>
              <h2 className="t-h0">{CORE.title}</h2>
            </div>
          </div>
          <CoreMobile />
          <CoreDesktop />
        </div>
      </div>
    </section>
  );
}
