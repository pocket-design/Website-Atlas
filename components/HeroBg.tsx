'use client';

import { useEffect, useRef } from 'react';

const RADIUS = 260; // reveal circle radius in px

export default function HeroBg() {
  const wrapRef    = useRef<HTMLDivElement>(null);
  const lineartRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const wrap    = wrapRef.current;
    const lineart = lineartRef.current;
    if (!wrap || !lineart) return;

    // Fully opaque by default — no hole yet
    const show = () => {
      lineart.style.setProperty('-webkit-mask-image', 'none');
      lineart.style.setProperty('mask-image',         'none');
    };

    // Cut a feathered hole in the lineart at cursor position,
    // letting the realistic image beneath show through.
    // transparent = hole (reveals realistic), black = keep lineart
    const onMove = (e: MouseEvent) => {
      const rect = wrap.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      if (x < 0 || y < 0 || x > rect.width || y > rect.height) {
        show();
        return;
      }

      const mask = `radial-gradient(circle ${RADIUS}px at ${x}px ${y}px,
        transparent 0%,
        transparent 30%,
        black 70%,
        black 100%)`;
      lineart.style.setProperty('-webkit-mask-image', mask);
      lineart.style.setProperty('mask-image',         mask);
    };

    show();
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  return (
    <div ref={wrapRef} className="hero-bg-wrap" aria-hidden="true">

      {/* realistic — always fully visible, sits below */}
      <img
        src="/assets/hero-realistic.jpg"
        alt=""
        className="hero-bg-img hero-bg-realistic"
        draggable={false}
      />

      {/* line-art — on top, cursor punches a hole through it */}
      <img
        ref={lineartRef}
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
