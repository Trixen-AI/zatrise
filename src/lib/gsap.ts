import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger, useGSAP);

export { gsap, ScrollTrigger, useGSAP };

/** Motion constants measured from the reference. */
export const MOTION = {
  // section entrance: rise 300px and fade in over 1s
  reveal: { y: 300, opacity: 0, duration: 1, ease: 'power3.out' },
  revealStart: 'top 60%',
  // hero pinned for one viewport; title rises out, backdrop zooms 1 -> 2.5 and fades
  heroTitle: { start: 0, end: 600, ease: 'power3.out' },
  heroBackdrop: { start: 100, end: 1000, scale: 2.5, yPercent: -50, ease: 'power3.inOut' },
  scrub: 0.6,
} as const;

export const REDUCED = '(prefers-reduced-motion: reduce)';
export const MOTION_OK = '(prefers-reduced-motion: no-preference)';
