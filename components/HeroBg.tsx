'use client';

import { useEffect, useRef } from 'react';

export default function HeroBg() {
  const imgsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      requestAnimationFrame(() => requestAnimationFrame(() => {
        imgsRef.current?.classList.remove('hero-imgs-hidden');
      }));
    };
    img.src = '/assets/brazil-bg.webp';
  }, []);

  return (
    <div className="hero-bg-wrap" aria-hidden="true">
      <div ref={imgsRef} className="hero-bg-imgs hero-imgs-hidden">
        <div
          className="hero-bg-img"
          style={{ backgroundImage: `url(/assets/brazil-bg.webp)` }}
        />
      </div>
      <div className="hero-bg-fade hero-bg-fade-bottom" />
    </div>
  );
}
