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
    img.src = '/assets/hero-newyork.jpg';
  }, []);

  return (
    <div className="hero-bg-wrap" aria-hidden="true">
      <div ref={imgsRef} className="hero-bg-imgs hero-imgs-hidden">
        <div
          className="hero-bg-img"
          style={{ backgroundImage: `url(/assets/hero-newyork.jpg)` }}
        />
      </div>
      <div className="hero-bg-fade hero-bg-fade-bottom" />
    </div>
  );
}
