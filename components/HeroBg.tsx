'use client';

import { useEffect, useRef } from 'react';
import { CITY_IMAGES } from './HeroBgDialKit';
import type { HeroCity } from './HeroBgDialKit';

type Props = {
  city:      HeroCity;
  radiusRef: React.RefObject<number>;
};

export default function HeroBg({ city, radiusRef }: Props) {
  const wrapRef    = useRef<HTMLDivElement>(null);
  const lineartRef = useRef<HTMLImageElement>(null);

  // Reset mask whenever city changes so the new lineart starts fully visible
  useEffect(() => {
    const el = lineartRef.current;
    if (!el) return;
    el.style.setProperty('-webkit-mask-image', 'none');
    el.style.setProperty('mask-image',         'none');
  }, [city]);

  // Window-level mousemove — immune to pointer-events settings on children
  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;

    const hide = () => {
      const el = lineartRef.current;
      if (!el) return;
      el.style.setProperty('-webkit-mask-image',
        'radial-gradient(circle 0px at center, transparent 100%)');
      el.style.setProperty('mask-image',
        'radial-gradient(circle 0px at center, transparent 100%)');
    };

    const onMove = (e: MouseEvent) => {
      const el = lineartRef.current;
      if (!el) return;
      const rect = wrap.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      if (x < 0 || y < 0 || x > rect.width || y > rect.height) {
        hide();
        return;
      }

      const r = radiusRef.current ?? 260;
      const mask = `radial-gradient(circle ${r}px at ${x}px ${y}px,
        transparent 0%,
        transparent 30%,
        black       70%,
        black       100%)`;
      el.style.setProperty('-webkit-mask-image', mask);
      el.style.setProperty('mask-image',         mask);
    };

    hide();
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, [radiusRef]);

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
        key={city}               /* remount on city change to clear any stale mask */
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
