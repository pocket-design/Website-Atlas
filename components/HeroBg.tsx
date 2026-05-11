'use client';

import { useEffect, useRef, useState } from 'react';
import { CITY_IMAGES, CITY_IMAGES_V2, V2_CYCLE_ORDER } from './HeroBgDialKit';
import type { HeroCity, HeroMode } from './HeroBgDialKit';

const MAX_DELAY_MS  = 700;
const FADE_DURATION = 380;

type Snapshot = { x: number; y: number; t: number };

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

function preloadV2(): Promise<void> {
  return Promise.all(
    V2_CYCLE_ORDER.map(city =>
      new Promise<void>(res => {
        const img = new Image();
        img.onload = img.onerror = () => res();
        img.src = CITY_IMAGES_V2[city].src;
      })
    )
  ).then(() => {});
}

type Props = {
  mode:             HeroMode;
  city:             HeroCity;
  radiusRef:        React.RefObject<number>;
  lagRef:           React.RefObject<number>;
  cycleIntervalRef: React.RefObject<number>;
  pauseOnHover:     boolean;
};

export default function HeroBg({ mode, city, radiusRef, lagRef, cycleIntervalRef, pauseOnHover }: Props) {
  const wrapRef    = useRef<HTMLDivElement>(null);
  const imgsRef    = useRef<HTMLDivElement>(null);
  const lineartRef = useRef<HTMLImageElement>(null);

  // V1 state
  const displayedCityRef = useRef<HeroCity>(city);
  const [displayedCity, setDisplayedCity] = useState<HeroCity>(city);

  // V2 state
  const [v2Index, setV2Index] = useState(0);

  // ── Preload all assets on mount ──────────────────────────────────────────
  useEffect(() => {
    (Object.keys(CITY_IMAGES) as HeroCity[]).forEach(preloadCity);
    preloadV2();
  }, []);

  // ── Hide container when mode switches; new mode handles reveal ───────────
  useEffect(() => {
    imgsRef.current?.classList.add('hero-imgs-hidden');
  }, [mode]);

  // ── V1: page-load entrance ───────────────────────────────────────────────
  useEffect(() => {
    if (mode !== 'v1') return;
    const el = imgsRef.current;
    if (!el) return;
    preloadCity(displayedCityRef.current).then(() => {
      requestAnimationFrame(() => requestAnimationFrame(() => {
        el.classList.remove('hero-imgs-hidden');
      }));
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode]); // re-entrance whenever mode switches to v1

  // ── V1: city crossfade ───────────────────────────────────────────────────
  useEffect(() => {
    if (mode !== 'v1') return;
    if (city === displayedCityRef.current) return;
    const el = imgsRef.current;
    if (!el) return;

    let cancelled = false;
    el.classList.add('hero-imgs-hidden');

    Promise.all([
      preloadCity(city),
      new Promise<void>(res => setTimeout(res, FADE_DURATION)),
    ]).then(() => {
      if (cancelled) return;
      displayedCityRef.current = city;
      setDisplayedCity(city);
      requestAnimationFrame(() => requestAnimationFrame(() => {
        if (cancelled) return;
        el.classList.remove('hero-imgs-hidden');
      }));
    });

    return () => { cancelled = true; };
  }, [mode, city]);

  // ── V1: reset lineart mask on city change ────────────────────────────────
  useEffect(() => {
    const el = lineartRef.current;
    if (!el) return;
    el.style.removeProperty('-webkit-mask-image');
    el.style.removeProperty('mask-image');
  }, [displayedCity]);

  // ── V2: auto-cycle timer ─────────────────────────────────────────────────
  useEffect(() => {
    if (mode !== 'v2') return;
    const wrap = wrapRef.current;
    if (!wrap) return;

    let cancelled  = false;
    let isHovering = false;
    let timeoutId: ReturnType<typeof setTimeout>;

    const onEnter = () => { isHovering = true; };
    const onLeave = () => { isHovering = false; };
    wrap.addEventListener('mouseenter', onEnter);
    wrap.addEventListener('mouseleave', onLeave);

    const scheduleNext = () => {
      timeoutId = setTimeout(advance, cycleIntervalRef.current * 1000);
    };

    const advance = () => {
      if (cancelled) return;
      const el = imgsRef.current;
      if (!el || (pauseOnHover && isHovering)) {
        scheduleNext();
        return;
      }
      el.classList.add('hero-imgs-hidden');
      setTimeout(() => {
        if (cancelled) return;
        setV2Index(i => (i + 1) % V2_CYCLE_ORDER.length);
        requestAnimationFrame(() => requestAnimationFrame(() => {
          if (cancelled) return;
          el.classList.remove('hero-imgs-hidden');
          scheduleNext();
        }));
      }, FADE_DURATION);
    };

    // Entrance: preload all V2 images then reveal
    preloadV2().then(() => {
      if (cancelled) return;
      const el = imgsRef.current;
      if (!el) return;
      requestAnimationFrame(() => requestAnimationFrame(() => {
        if (cancelled) return;
        el.classList.remove('hero-imgs-hidden');
        scheduleNext();
      }));
    });

    return () => {
      cancelled = true;
      clearTimeout(timeoutId);
      wrap.removeEventListener('mouseenter', onEnter);
      wrap.removeEventListener('mouseleave', onLeave);
    };
  }, [mode, pauseOnHover, cycleIntervalRef]);

  // ── V1: hover reveal RAF loop ────────────────────────────────────────────
  useEffect(() => {
    if (mode !== 'v1') return;
    const wrap = wrapRef.current;
    if (!wrap) return;

    let targetX = -9999, targetY = -9999;
    let isInside = false;
    const history: Snapshot[] = [];
    let rafId: number;

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
          showFull(el);
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
  }, [mode, radiusRef, lagRef]);

  const v1Imgs   = CITY_IMAGES[displayedCity];
  const v2ImgSrc = CITY_IMAGES_V2[V2_CYCLE_ORDER[v2Index]].src;

  return (
    <div ref={wrapRef} className="hero-bg-wrap" aria-hidden="true">
      <div ref={imgsRef} className="hero-bg-imgs hero-imgs-hidden">

        {mode === 'v1' ? (
          <>
            <img
              src={v1Imgs.realistic}
              alt=""
              className="hero-bg-img hero-bg-realistic"
              draggable={false}
            />
            <img
              ref={lineartRef}
              src={v1Imgs.lineart}
              alt=""
              className="hero-bg-img hero-bg-lineart"
              draggable={false}
            />
          </>
        ) : (
          <img
            src={v2ImgSrc}
            alt=""
            className="hero-bg-img hero-bg-v2"
            draggable={false}
          />
        )}

      </div>

      <div className="hero-bg-fade hero-bg-fade-top"    />
      <div className="hero-bg-fade hero-bg-fade-bottom" />
    </div>
  );
}
