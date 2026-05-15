'use client';

import { useEffect, useRef, useState } from 'react';

const HERO_IMAGES = [
  { src: '/assets/hero-japan.jpg', cls: 'hero-bg-img--japan' },
  { src: '/assets/hero-newyork.jpg', cls: 'hero-bg-img--newyork' },
  { src: '/assets/hero-egypt.jpg', cls: '' },
];

const CYCLE_MS = 5000;

export default function HeroBg() {
  const imgsRef = useRef<HTMLDivElement>(null);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    HERO_IMAGES.forEach(({ src }) => {
      const img = new Image();
      img.src = src;
    });

    requestAnimationFrame(() => requestAnimationFrame(() => {
      imgsRef.current?.classList.remove('hero-imgs-hidden');
    }));
  }, []);

  useEffect(() => {
    const id = setInterval(() => {
      setCurrent(i => (i + 1) % HERO_IMAGES.length);
    }, CYCLE_MS);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="hero-bg-wrap" aria-hidden="true">
      <div ref={imgsRef} className="hero-bg-imgs hero-imgs-hidden">
        {HERO_IMAGES.map(({ src, cls }, i) => (
          <div
            key={src}
            className={`hero-bg-img${cls ? ` ${cls}` : ''}${i === current ? ' is-active' : ''}`}
            style={{ backgroundImage: `url(${src})` }}
          />
        ))}
      </div>
      <div className="hero-bg-fade hero-bg-fade-bottom" />
    </div>
  );
}
