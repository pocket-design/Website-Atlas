'use client';

import { useEffect, useRef } from 'react';
import { CITY_IMAGES } from './HeroBgDialKit';
import type { HeroCity } from './HeroBgDialKit';

// Maximum delay ceiling in ms (slider at 100% = this many ms behind)
const MAX_DELAY_MS = 700;

type Snapshot = { x: number; y: number; t: number };

type Props = {
  city:      HeroCity;
  radiusRef: React.RefObject<number>;
  lagRef:    React.RefObject<number>;
};

export default function HeroBg({ city, radiusRef, lagRef }: Props) {
  const wrapRef    = useRef<HTMLDivElement>(null);
  const lineartRef = useRef<HTMLImageElement>(null);

  // Reset mask on city change
  useEffect(() => {
    const el = lineartRef.current;
    if (!el) return;
    el.style.setProperty('-webkit-mask-image', 'none');
    el.style.setProperty('mask-image',         'none');
  }, [city]);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;

    // Live cursor target
    let targetX = -9999, targetY = -9999;
    let isInside = false;

    // Ring buffer of cursor snapshots for time-based delay
    const history: Snapshot[] = [];

    const hide = (el: HTMLImageElement) => {
      el.style.setProperty('-webkit-mask-image',
        'radial-gradient(circle 0px at center, transparent 100%)');
      el.style.setProperty('mask-image',
        'radial-gradient(circle 0px at center, transparent 100%)');
    };

    const onMove = (e: MouseEvent) => {
      const rect = wrap.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      isInside = x >= 0 && y >= 0 && x <= rect.width && y <= rect.height;
      if (isInside) { targetX = x; targetY = y; }
    };

    let rafId: number;

    const tick = () => {
      const el = lineartRef.current;
      if (el) {
        if (!isInside) {
          // Clear history so next entry starts fresh (no trailing ghost)
          history.length = 0;
          hide(el);
        } else {
          const now = performance.now();

          // Record current cursor position with timestamp
          history.push({ x: targetX, y: targetY, t: now });

          // Prune entries older than MAX_DELAY_MS + a small buffer
          const cutoff = now - MAX_DELAY_MS - 100;
          while (history.length > 1 && history[0].t < cutoff) history.shift();

          // How far back in time should we look?
          const delay   = lagRef.current ?? 0;        // 0 – 0.92
          const delayMs = delay * MAX_DELAY_MS;        // 0 – 700 ms
          const lookupT = now - delayMs;

          // Interpolate between two snapshots bracketing lookupT
          let px = targetX, py = targetY;

          if (delayMs > 0 && history.length >= 1) {
            if (history[0].t >= lookupT) {
              // All history is newer → use oldest available snapshot
              px = history[0].x;
              py = history[0].y;
            } else {
              // Scan newest → oldest to find the bracket
              for (let i = history.length - 1; i >= 0; i--) {
                if (history[i].t <= lookupT) {
                  if (i < history.length - 1) {
                    // Interpolate between history[i] and history[i+1]
                    const a  = history[i];
                    const b  = history[i + 1];
                    const t  = (lookupT - a.t) / (b.t - a.t);
                    px = a.x + t * (b.x - a.x);
                    py = a.y + t * (b.y - a.y);
                  } else {
                    px = history[i].x;
                    py = history[i].y;
                  }
                  break;
                }
              }
            }
          }

          const r = radiusRef.current ?? 260;
          const mask = `radial-gradient(circle ${r}px at ${px}px ${py}px,
            transparent  0%,
            transparent 30%,
            black       70%,
            black      100%)`;
          el.style.setProperty('-webkit-mask-image', mask);
          el.style.setProperty('mask-image',         mask);
        }
      }
      rafId = requestAnimationFrame(tick);
    };

    window.addEventListener('mousemove', onMove);
    rafId = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(rafId);
    };
  }, [radiusRef, lagRef]);

  const imgs = CITY_IMAGES[city];

  return (
    <div ref={wrapRef} className="hero-bg-wrap" aria-hidden="true">
      <img
        src={imgs.realistic}
        alt=""
        className="hero-bg-img hero-bg-realistic"
        draggable={false}
      />
      <img
        key={city}
        ref={lineartRef}
        src={imgs.lineart}
        alt=""
        className="hero-bg-img hero-bg-lineart"
        draggable={false}
      />
      <div className="hero-bg-fade hero-bg-fade-top"    />
      <div className="hero-bg-fade hero-bg-fade-bottom" />
    </div>
  );
}
