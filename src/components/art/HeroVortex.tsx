import { useEffect, useRef } from 'react';

/**
 * Hero backdrop: a slow gold vortex around a dark core, drawn on Canvas 2D.
 * Bands of light orbit the core at different speeds, like zats being pulled into the pool.
 * DPR-capped, pauses offscreen and when the tab is hidden, and draws one still frame under reduced motion.
 */
export function HeroVortex({ className }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let w = 0;
    let h = 0;
    let raf = 0;
    let running = false;
    let visible = true;
    const t0 = performance.now();

    // band table: fixed per mount so the motion is stable
    const N = 84;
    const bands = Array.from({ length: N }, (_, i) => {
      const t = i / (N - 1);
      const s = Math.sin(i * 12.9898) * 43758.5453;
      const rnd = s - Math.floor(s);
      return {
        t,
        speed: (0.05 + 0.18 * (1 - t)) * (i % 3 === 0 ? -0.6 : 1),
        phase: rnd * Math.PI * 2,
        len: 0.9 + rnd * 2.2,
        squash: 0.86 + 0.1 * Math.sin(i * 1.7),
        tilt: i * 0.045,
        hot: rnd > 0.82,
      };
    });

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const draw = (now: number) => {
      const time = (now - t0) / 1000;
      const portrait = h > w;
      const cx = w * (portrait ? 0.5 : 0.478);
      const cy = h * (portrait ? 0.46 : 0.52);
      const core = Math.min(w, h) * (portrait ? 0.42 : 0.53);
      const outer = Math.hypot(w, h) * 0.62;

      ctx.globalCompositeOperation = 'source-over';
      ctx.fillStyle = '#15130f';
      ctx.fillRect(0, 0, w, h);

      // warm haze behind the bands
      const haze = ctx.createRadialGradient(cx, cy, core * 0.9, cx, cy, outer);
      haze.addColorStop(0, 'rgba(122, 85, 26, 0.55)');
      haze.addColorStop(0.45, 'rgba(70, 48, 14, 0.35)');
      haze.addColorStop(1, 'rgba(21, 19, 15, 0)');
      ctx.fillStyle = haze;
      ctx.fillRect(0, 0, w, h);

      ctx.globalCompositeOperation = 'lighter';
      ctx.lineCap = 'round';
      for (const b of bands) {
        const r = core * 1.01 + Math.pow(b.t, 1.15) * (outer - core);
        const a0 = b.phase + time * b.speed;
        const near = 1 - b.t;
        ctx.lineWidth = 4 + 38 * near * near + (b.hot ? 6 : 0);
        const alpha = (b.hot ? 0.2 : 0.075) * (0.35 + near);
        ctx.strokeStyle = b.hot ? `rgba(255, 226, 160, ${alpha})` : `rgba(245, 184, 61, ${alpha})`;
        ctx.beginPath();
        ctx.ellipse(cx, cy, r, r * b.squash, b.tilt + time * 0.03, a0, a0 + b.len);
        ctx.stroke();
      }

      // dark core with a crisp rim
      ctx.globalCompositeOperation = 'source-over';
      const rim = ctx.createRadialGradient(cx, cy, core * 0.94, cx, cy, core * 1.035);
      rim.addColorStop(0, 'rgba(21, 19, 15, 1)');
      rim.addColorStop(0.7, 'rgba(21, 19, 15, 0.92)');
      rim.addColorStop(1, 'rgba(21, 19, 15, 0)');
      ctx.fillStyle = rim;
      ctx.beginPath();
      ctx.arc(cx, cy, core * 1.04, 0, Math.PI * 2);
      ctx.fill();

      const inner = ctx.createRadialGradient(cx, cy - core * 0.3, 0, cx, cy, core);
      inner.addColorStop(0, 'rgba(46, 38, 24, 0.9)');
      inner.addColorStop(1, 'rgba(21, 19, 15, 0)');
      ctx.fillStyle = inner;
      ctx.beginPath();
      ctx.arc(cx, cy, core * 0.96, 0, Math.PI * 2);
      ctx.fill();
    };

    const loop = (now: number) => {
      draw(now);
      raf = requestAnimationFrame(loop);
    };
    const start = () => {
      if (running || reduced || !visible || document.hidden) return;
      running = true;
      raf = requestAnimationFrame(loop);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    resize();
    draw(t0 + 4000);

    const ro = new ResizeObserver(() => {
      resize();
      draw(performance.now());
    });
    ro.observe(canvas);
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible) start();
      else stop();
    });
    io.observe(canvas);
    const onVis = () => (document.hidden ? stop() : start());
    document.addEventListener('visibilitychange', onVis);
    start();

    return () => {
      stop();
      ro.disconnect();
      io.disconnect();
      document.removeEventListener('visibilitychange', onVis);
    };
  }, []);

  return <canvas ref={ref} className={className} aria-hidden />;
}
