import type { RefObject } from 'react';
import { gsap, MOTION, MOTION_OK, useGSAP } from '@/lib/gsap';

/**
 * Section entrance: the target rises 300px and fades in (1s, power3.out).
 * `onLoad` plays it immediately instead of waiting for the section to reach 60% of the viewport.
 */
export function useReveal(target: RefObject<HTMLElement | null>, opts: { onLoad?: boolean; delay?: number } = {}) {
  useGSAP(() => {
    const el = target.current;
    if (!el) return;
    const mm = gsap.matchMedia();
    mm.add(MOTION_OK, () => {
      gsap.from(el, {
        ...MOTION.reveal,
        delay: opts.delay ?? 0,
        scrollTrigger: opts.onLoad
          ? undefined
          : { trigger: el.parentElement ?? el, start: MOTION.revealStart, once: true },
      });
    });
    return () => mm.revert();
  });
}
