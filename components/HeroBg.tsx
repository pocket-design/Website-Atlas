'use client';

import { useEffect, useRef, useState } from 'react';
import { CITY_IMAGES } from './HeroBgDialKit';
import type { HeroCity } from './HeroBgDialKit';

const MAX_DELAY_MS  = 700;
const FADE_DURATION = 380; // ms per half of the crossfade

type Snapshot = { x: number; y: number; t: number };

/** Resolves once both images for a city are in the browser cache. */
function preloadCity(city: HeroCity): Promise<void> {
  const { lineart, realistic } = CITY_IMAGES[city];
  const load = (src: string) =>
    new Promise<void>(res => {
      const img = new Image();
      img.onload = img.onerror = () => res();
      img.src = src;
    });
  return Promise.all([load(lineart), load(realistic)]).then(() => {});
}

type Props = {
  city:      HeroCity;
  radiusRef: React.RefObject<number>;
  lagRef:    React.RefObject<number>;
};

export default function HeroBg({ city, radiusRef, lagRef }: Props) {
  const wrapRef    = useRef<HTMLDivElement>(null);
  const imgsRef    = useRef<HTMLDivElement>(null);
  const lineartRef = useRef<HTMLImageElement>(null);

  // Track displayed city in both state (for re-render) and ref (for effects)
  const displayedCityRef = useRef<HeroCity>(city);
  const [displayedCity, setDisplayedCity] = useState<HeroCity>(city);

  // ── Preload every city on mount so switching feels instant ───────────────
  useEffect(() => {
    (Object.keys(CITY_IMAGES) as HeroCity[]).forEach(preloadCity);
  }, []);

  // ── Page-load entrance ───────────────────────────────────────────────────
  useEffect(() => {
    const el = imgsRef.current;
    if (!el) return;
    // Wait for initial city images then blur→sharp reveal
    preloadCity(displayedCityRef.current).then(() => {
      requestAnimationFrame(() => requestAnimationFrame(() => {
        el.classList.remove('hero-imgs-hidden');
      }));
    });
  }, []); // intentionally runs once on mount

  // ── City crossfade ───────────────────────────────────────────────────────
  // Depends ONLY on `city` — NOT on `displayedCity`.
  // If we included displayedCity, React would re-run the cleanup when
  // setDisplayedCity fires inside the .then(), setting cancelled=true before
  // the rAFs that remove hero-imgs-hidden get a chance to run.
  useEffect(() => {
    if (city === displayedCityRef.current) return;
    const el = imgsRef.current;
    if (!el) return;

    let cancelled = false;

    // 1. Fade + blur OUT
    el.classList.add('hero-imgs-hidden');

    // 2. Preload new images AND wait for fade-out — whichever takes longer
    Promise.all([
      preloadCity(city),
      new Promise<void>(res => setTimeout(res, FADE_DURATION)),
    ]).then(() => {
      if (cancelled) return;

      // 3. Swap sources while invisible (images are now cached)
      displayedCityRef.current = city;
      setDisplayedCity(city);

      // 4. One paint cycle, then blur→sharp IN
      requestAnimationFrame(() => requestAnimationFrame(() => {
        if (cancelled) return;
        el.classList.remove('hero-imgs-hidden');
      }));
    });

    return () => { cancelled = true; };
  }, [city]); // ← city only — see note above

  // ── Reset lineart mask when displayed city changes ───────────────────────
  useEffect(() => {
    const el = lineartRef.current;
    if (!el) return;
    el.style.removeProperty('-webkit-mask-image');
    el.style.removeProperty('mask-image');
  }, [displayedCity]);

  // ── Time-based delay reveal (RAF loop) ───────────────────────────────────
  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;

    let targetX = -9999, targetY = -9999;
    let isInside = false;
    const history: Snapshot[] = [];
    let rafId: number;

    // When cursor leaves: restore lineart to fully visible (no mask).
    // We punch a hole only while hovering — lineart covers everything by default.
    const showFull = (el: HTMLImageElement) => {
      el.style.removeProperty('-webkit-mask-image');
      el.style.removeProperty('mask-image');
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
          showFull(el); // lineart fully visible — realistic hidden beneath
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

      {/* fading container — starts hidden for page-load entrance */}
      <div ref={imgsRef} className="hero-bg-imgs hero-imgs-hidden">
        <img
          src={imgs.realistic}
          alt=""
          className="hero-bg-img hero-bg-realistic"
          draggable={false}
        />
        {/* No key here — same element persists, only src changes */}
        <img
          ref={lineartRef}
          src={imgs.lineart}
          alt=""
          className="hero-bg-img hero-bg-lineart"
          draggable={false}
        />
      </div>

      {/* feathering overlays — outside the fading container, always visible */}
      <div className="hero-bg-fade hero-bg-fade-top"    />
      <div className="hero-bg-fade hero-bg-fade-bottom" />
    </div>
  );
}
