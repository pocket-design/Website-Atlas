'use client';

import { useEffect, useRef, useState } from 'react';
import { CITY_IMAGES } from './HeroBgDialKit';
import type { HeroCity } from './HeroBgDialKit';

const MAX_DELAY_MS  = 700;
const FADE_DURATION = 380; // ms — half of the crossfade (out → swap → in)

type Snapshot = { x: number; y: number; t: number };

type Props = {
  city:      HeroCity;
  radiusRef: React.RefObject<number>;
  lagRef:    React.RefObject<number>;
};

export default function HeroBg({ city, radiusRef, lagRef }: Props) {
  const wrapRef    = useRef<HTMLDivElement>(null);
  const imgsRef    = useRef<HTMLDivElement>(null);   // container that fades
  const lineartRef = useRef<HTMLImageElement>(null);

  // The city currently rendered in the DOM (lags behind prop during fade)
  const [displayedCity, setDisplayedCity] = useState<HeroCity>(city);

  // ── Page-load entrance ───────────────────────────────────────────────────
  // Start hidden (blur + transparent), reveal after first paint
  useEffect(() => {
    const el = imgsRef.current;
    if (!el) return;
    // Force a repaint so the initial hidden class is applied before we remove it
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        el.classList.remove('hero-imgs-hidden');
      });
    });
  }, []);

  // ── City crossfade ───────────────────────────────────────────────────────
  useEffect(() => {
    if (city === displayedCity) return;
    const el = imgsRef.current;
    if (!el) return;

    // 1. Fade + blur OUT
    el.classList.add('hero-imgs-hidden');

    const t1 = setTimeout(() => {
      // 2. Swap the city while invisible — React re-renders the new srcs
      setDisplayedCity(city);
    }, FADE_DURATION);

    const t2 = setTimeout(() => {
      // 3. Fade + un-blur IN
      el.classList.remove('hero-imgs-hidden');
    }, FADE_DURATION + 40); // tiny extra gap so new images are painted first

    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [city, displayedCity]);

  // ── Reset mask when displayed city changes ───────────────────────────────
  useEffect(() => {
    const el = lineartRef.current;
    if (!el) return;
    el.style.setProperty('-webkit-mask-image', 'none');
    el.style.setProperty('mask-image',         'none');
  }, [displayedCity]);

  // ── Time-based delay reveal (RAF loop) ───────────────────────────────────
  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;

    let targetX = -9999, targetY = -9999;
    let isInside = false;
    const history: Snapshot[] = [];
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
      isInside = x >= 0 && y >= 0 && x <= rect.width && y <= rect.height;
      if (isInside) { targetX = x; targetY = y; }
    };

    const tick = () => {
      const el = lineartRef.current;
      if (el) {
        if (!isInside) {
          history.length = 0;
          hide(el);
        } else {
          const now = performance.now();
          history.push({ x: targetX, y: targetY, t: now });

          const cutoff = now - MAX_DELAY_MS - 100;
          while (history.length > 1 && history[0].t < cutoff) history.shift();

          const delay   = lagRef.current ?? 0;
          const delayMs = delay * MAX_DELAY_MS;
          const lookupT = now - delayMs;

          let px = targetX, py = targetY;
          if (delayMs > 0 && history.length >= 1) {
            if (history[0].t >= lookupT) {
              px = history[0].x; py = history[0].y;
            } else {
              for (let i = history.length - 1; i >= 0; i--) {
                if (history[i].t <= lookupT) {
                  if (i < history.length - 1) {
                    const a = history[i], b = history[i + 1];
                    const t = (lookupT - a.t) / (b.t - a.t);
                    px = a.x + t * (b.x - a.x);
                    py = a.y + t * (b.y - a.y);
                  } else {
                    px = history[i].x; py = history[i].y;
                  }
                  break;
                }
              }
            }
          }

          const r    = radiusRef.current ?? 260;
          const mask = `radial-gradient(circle ${r}px at ${px}px ${py}px,
            transparent  0%, transparent 30%, black 70%, black 100%)`;
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

  const imgs = CITY_IMAGES[displayedCity];

  return (
    <div ref={wrapRef} className="hero-bg-wrap" aria-hidden="true">

      {/* ── fading image container — starts hidden for page-load entrance ── */}
      <div ref={imgsRef} className="hero-bg-imgs hero-imgs-hidden">
        <img
          src={imgs.realistic}
          alt=""
          className="hero-bg-img hero-bg-realistic"
          draggable={false}
        />
        <img
          key={displayedCity}
          ref={lineartRef}
          src={imgs.lineart}
          alt=""
          className="hero-bg-img hero-bg-lineart"
          draggable={false}
        />
      </div>

      {/* feathering overlays — always visible, outside the fading container */}
      <div className="hero-bg-fade hero-bg-fade-top"    />
      <div className="hero-bg-fade hero-bg-fade-bottom" />
    </div>
  );
}
