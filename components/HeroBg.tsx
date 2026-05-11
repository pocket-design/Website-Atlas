'use client';

import { useEffect, useRef } from 'react';

// Reveal circle radius in px — increase for a wider window
const RADIUS = 260;

export default function HeroBg() {
  const wrapRef      = useRef<HTMLDivElement>(null);
  const realisticRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const img  = realisticRef.current;
    if (!wrap || !img) return;

    // Listen on the whole hero section so the reveal works even when
    // the cursor is over the text / translation-window above the images
    const section = wrap.closest('section') ?? wrap;

    const onMove = (e: MouseEvent) => {
      const rect = wrap.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      // Radial gradient: opaque at centre, feathers out to transparent
      const mask = `radial-gradient(circle ${RADIUS}px at ${x}px ${y}px, black 30%, transparent 100%)`;
      img.style.webkitMaskImage = mask;
      img.style.maskImage        = mask;
    };

    const onLeave = () => {
      img.style.webkitMaskImage = 'radial-gradient(circle 0px at center, transparent 100%)';
      img.style.maskImage        = 'radial-gradient(circle 0px at center, transparent 100%)';
    };

    section.addEventListener('mousemove',  onMove  as EventListener);
    section.addEventListener('mouseleave', onLeave as EventListener);

    return () => {
      section.removeEventListener('mousemove',  onMove  as EventListener);
      section.removeEventListener('mouseleave', onLeave as EventListener);
    };
  }, []);

  return (
    <div ref={wrapRef} className="hero-bg-wrap" aria-hidden="true">

      {/* ── realistic layer (bottom) — revealed by cursor mask ── */}
      <img
        ref={realisticRef}
        src="/assets/hero-realistic.jpg"
        alt=""
        className="hero-bg-img hero-bg-realistic"
        draggable={false}
      />

      {/* ── line-art layer (top) — always visible ── */}
      <img
        src="/assets/hero-lineart.jpg"
        alt=""
        className="hero-bg-img hero-bg-lineart"
        draggable={false}
      />

      {/* ── feathering overlays (painted on top of both images) ── */}
      <div className="hero-bg-fade hero-bg-fade-top"    />
      <div className="hero-bg-fade hero-bg-fade-bottom" />
    </div>
  );
}
