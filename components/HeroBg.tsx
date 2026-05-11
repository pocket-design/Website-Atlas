'use client';

import { useEffect, useRef } from 'react';

const RADIUS = 260; // reveal circle radius in px

export default function HeroBg() {
  const wrapRef      = useRef<HTMLDivElement>(null);
  const realisticRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const img  = realisticRef.current;
    if (!wrap || !img) return;

    const hide = () => {
      img.style.setProperty('-webkit-mask-image',
        `radial-gradient(circle 0px at center, transparent 100%)`);
      img.style.setProperty('mask-image',
        `radial-gradient(circle 0px at center, transparent 100%)`);
    };

    // Listen on window so pointer-events settings on child elements
    // never block the reveal.
    const onMove = (e: MouseEvent) => {
      const rect = wrap.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Hide when cursor is outside the hero image area
      if (x < 0 || y < 0 || x > rect.width || y > rect.height) {
        hide();
        return;
      }

      const mask =
        `radial-gradient(circle ${RADIUS}px at ${x}px ${y}px, black 30%, transparent 100%)`;
      img.style.setProperty('-webkit-mask-image', mask);
      img.style.setProperty('mask-image',         mask);
    };

    hide(); // start hidden
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  return (
    <div ref={wrapRef} className="hero-bg-wrap" aria-hidden="true">

      {/* realistic — revealed by cursor-radius mask */}
      <img
        ref={realisticRef}
        src="/assets/hero-realistic.jpg"
        alt=""
        className="hero-bg-img hero-bg-realistic"
        draggable={false}
      />

      {/* line-art — always on top */}
      <img
        src="/assets/hero-lineart.jpg"
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
