'use client';

import { useEffect, useRef } from 'react';
import { CITY_IMAGES } from './HeroBgDialKit';
import type { HeroCity } from './HeroBgDialKit';

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

  // RAF lerp loop — smooth cursor-following reveal
  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;

    // Target = where the real mouse is
    // Current = lagged position that chases the target
    let targetX = -9999, targetY = -9999;
    let currentX = -9999, currentY = -9999;
    let isInside = false;
    let rafId: number;

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
      const inside = x >= 0 && y >= 0 && x <= rect.width && y <= rect.height;

      if (inside) {
        // Snap current to entry point so it doesn't trail in from off-screen
        if (!isInside) { currentX = x; currentY = y; }
        targetX = x;
        targetY = y;
      }
      isInside = inside;
    };

    const tick = () => {
      const el = lineartRef.current;
      if (el) {
        if (!isInside) {
          hide(el);
          // Reset so next entry snaps immediately
          currentX = -9999; currentY = -9999;
        } else {
          // lerp factor: delay 0 → factor 1.0 (instant), delay 0.92 → factor 0.08 (very slow)
          const delay  = lagRef.current  ?? 0;
          const factor = 1 - delay;

          currentX += (targetX - currentX) * factor;
          currentY += (targetY - currentY) * factor;

          const r = radiusRef.current ?? 260;
          const mask = `radial-gradient(circle ${r}px at ${currentX}px ${currentY}px,
            transparent 0%,
            transparent 30%,
            black       70%,
            black       100%)`;
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

      {/* realistic — always fully visible, sits below */}
      <img
        src={imgs.realistic}
        alt=""
        className="hero-bg-img hero-bg-realistic"
        draggable={false}
      />

      {/* line-art — cursor punches a feathered hole through it */}
      <img
        key={city}
        ref={lineartRef}
        src={imgs.lineart}
        alt=""
        className="hero-bg-img hero-bg-lineart"
        draggable={false}
      />

      {/* feathering gradient overlays */}
      <div className="hero-bg-fade hero-bg-fade-top"    />
      <div className="hero-bg-fade hero-bg-fade-bottom" />
    </div>
  );
}
