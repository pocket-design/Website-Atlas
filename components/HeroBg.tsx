'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useDialKit } from 'dialkit';

const HERO_BOTTOM_VIDEO_SRC = '/assets/hero-top-output_3167491_0.mp4';

export default function HeroBg() {
  const imgsRef = useRef<HTMLDivElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const introDoneRef = useRef(false);
  const introRequestedRef = useRef(false);
  const imageReadyRef = useRef(false);
  const introRunningRef = useRef(false);
  const introCompleteRef = useRef(false);
  const replayIntroRef = useRef<(() => void) | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [baseVideoVisible, setBaseVideoVisible] = useState(false);

  const dial = useDialKit(
    'Hero BG',
    useMemo(
      () => ({
        intro: {
          enabled: true,
          durationMs: [3000, 200, 6000] as [number, number, number],
          feather: [140, 10, 320] as [number, number, number],
          maxRadius: [1300, 300, 2200] as [number, number, number],
          play: { type: 'action', label: 'Play intro' },
        },
        hoverEnabled: true,
        parallax: {
          enabled: true,
          strength: [0.55, 0, 1.5, 0.01] as [number, number, number, number],
          layerSpread: [0.22, 0, 0.65, 0.01] as [number, number, number, number],
          maxPx: [140, 0, 420] as [number, number, number],
          scaleEnabled: true,
          scaleStrength: [0.06, 0, 0.25, 0.005] as [number, number, number, number],
          scaleMax: [0.14, 0, 0.6, 0.01] as [number, number, number, number],
        },
        reveal: {
          radius: [180, 40, 520] as [number, number, number],
          feather: [110, 10, 280] as [number, number, number],
          topOpacity: [1, 0, 1, 0.01] as [number, number, number, number],
          idleOpacity: [0, 0, 1, 0.01] as [number, number, number, number],
          // Unused (mask tracks pointer 1:1); kept so existing Dialkit presets don’t break.
          follow: [1, 0, 1, 0.01] as [number, number, number, number],
        },
        base: {
          source: {
            type: 'select',
            options: [
              { value: 'image', label: 'Bottom: PNG (layer B)' },
              { value: 'video', label: 'Bottom: MP4 video' },
            ],
            default: 'video',
          },
        },
      }),
      [],
    ),
    {
      onAction: (path) => {
        if (path === 'intro.play') replayIntroRef.current?.();
      },
    },
  );

  useEffect(() => {
    if (dial.base.source !== 'video') {
      setBaseVideoVisible(false);
      return;
    }
    const reduce =
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (reduce) {
      introCompleteRef.current = true;
      setBaseVideoVisible(true);
      return;
    }
    if (!dial.intro.enabled) {
      introCompleteRef.current = true;
    }
    // Do not force false here — a cached decode can fire loadeddata before this
    // effect runs; resetting would leave opacity stuck at 0 forever.
  }, [dial.base.source, dial.intro.enabled]);

  useEffect(() => {
    const el = wrapRef.current;
    const img = new Image();
    img.onload = () => {
      imageReadyRef.current = true;
      requestAnimationFrame(() =>
        requestAnimationFrame(() => {
          imgsRef.current?.classList.remove('hero-imgs-hidden');
        }),
      );

      if (!el) return;

      // Pre-intro state holds until the typewriter starts.
      if (dial.intro.enabled) {
        introDoneRef.current = false;
        el.classList.add('hero-bg-preintro');
      } else {
        introDoneRef.current = true;
        el.classList.remove('hero-bg-preintro');
      }

      // If typewriter already started, kick intro now that image is ready.
      if (dial.intro.enabled && introRequestedRef.current) {
        window.dispatchEvent(new CustomEvent('hero-bg-intro-start'));
      }
    };
    img.src = '/assets/hero-variant-chatgpt-2.png';
  }, [dial.intro.durationMs, dial.intro.enabled, dial.intro.feather, dial.intro.maxRadius]);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;

    const startIntro = () => {
      if (!dial.intro.enabled) return;
      if (introRunningRef.current) return;
      if (!imageReadyRef.current) return; // wait for bg to be ready
      if (!introRequestedRef.current) return; // wait for typewriter signal

      introRunningRef.current = true;
      introDoneRef.current = false;

      el.classList.remove('hero-bg-hovering');
      el.classList.remove('hero-bg-preintro');
      el.classList.add('hero-bg-intro');

      // Center anchor for intro reveal.
      el.style.setProperty('--hero-mx', '50%');
      el.style.setProperty('--hero-my', '44%');
      el.style.setProperty('--hero-intro-r', '0px');
      el.style.setProperty('--hero-intro-f', `${dial.intro.feather}px`);

      const duration = Math.max(1, dial.intro.durationMs);
      const maxR = dial.intro.maxRadius;
      const start = performance.now();
      // Strong ease-out: fast bloom, slow finish.
      const easeOutQuint = (t: number) => 1 - Math.pow(1 - t, 5);

      const tick = (now: number) => {
        const t = Math.min(1, (now - start) / duration);
        const e = easeOutQuint(t);
        el.style.setProperty('--hero-intro-r', `${(e * maxR).toFixed(2)}px`);
        if (t < 1) {
          requestAnimationFrame(tick);
          return;
        }

        introCompleteRef.current = true;

        if (dial.base.source === 'video') {
          // Cross-fade: rewind the video to frame 0 so the fade-in starts from
          // the same image as the poster/BG2 PNG, then ease both layers across
          // each other. Avoids the "video appears mid-motion" snap.
          const v = videoRef.current;
          if (v) {
            try {
              v.currentTime = 0;
            } catch {}
            const playPromise = v.play();
            if (playPromise && typeof playPromise.catch === 'function') {
              playPromise.catch(() => {});
            }
          }
          el.classList.add('hero-bg-outro');
          setBaseVideoVisible(true);
          window.setTimeout(() => {
            el.classList.remove('hero-bg-intro');
            el.classList.remove('hero-bg-outro');
            introDoneRef.current = true;
            introRunningRef.current = false;
          }, 2100);
          return;
        }

        el.classList.remove('hero-bg-intro');
        introDoneRef.current = true;
        introRunningRef.current = false;
      };

      requestAnimationFrame(tick);
    };

    // Expose a replay function for Dialkit action button.
    replayIntroRef.current = () => {
      // Allow replay regardless of typewriter, but keep image readiness + "one at a time" guard.
      introRequestedRef.current = true;
      startIntro();
    };

    const onStart = () => {
      introRequestedRef.current = true;
      startIntro();
    };
    window.addEventListener('hero-bg-intro-start', onStart as EventListener);
    // If a prior request happened, record it and try.
    if ((window as any).__heroBgIntroStartRequested) {
      introRequestedRef.current = true;
      startIntro();
    }
    return () => {
      window.removeEventListener('hero-bg-intro-start', onStart as EventListener);
      if (replayIntroRef.current) replayIntroRef.current = null;
    };
  }, [dial.intro.durationMs, dial.intro.enabled, dial.intro.feather, dial.intro.maxRadius]);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;

    // Track pointer events on the whole hero section (bg layer has pointer-events:none).
    const hero = el.closest('.hero') as HTMLElement | null;
    if (!hero) return;
    // Default center so the mask looks intentional even before first move.
    el.style.setProperty('--hero-mx', '50%');
    el.style.setProperty('--hero-my', '44%');
    el.style.setProperty('--hero-parallax-base', '0px');
    el.style.setProperty('--hero-parallax-top', '0px');
    el.style.setProperty('--hero-scale-base', '1');
    el.style.setProperty('--hero-scale-top', '1');

    const applyPointer = (e: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      const nx = Math.min(1, Math.max(0, x));
      const ny = Math.min(1, Math.max(0, y));
      el.style.setProperty('--hero-mx', `${(nx * 100).toFixed(3)}%`);
      el.style.setProperty('--hero-my', `${(ny * 100).toFixed(3)}%`);
    };

    const onEnter = (ev: Event) => {
      if (!dial.hoverEnabled) return;
      el.classList.add('hero-bg-hovering');
      applyPointer(ev as PointerEvent);
    };

    const onLeave = () => {
      el.classList.remove('hero-bg-hovering');
    };

    const onMove = (e: PointerEvent) => {
      if (!dial.hoverEnabled) return;
      applyPointer(e);
    };

    hero.addEventListener('pointerenter', onEnter);
    hero.addEventListener('pointerleave', onLeave);
    hero.addEventListener('pointermove', onMove);
    return () => {
      hero.removeEventListener('pointerenter', onEnter);
      hero.removeEventListener('pointerleave', onLeave);
      hero.removeEventListener('pointermove', onMove);
    };
  }, [dial.hoverEnabled]);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;

    const hero = el.closest('.hero') as HTMLElement | null;
    if (!hero) return;

    let ticking = false;

    const update = () => {
      ticking = false;
      if (!dial.parallax.enabled) {
        el.style.setProperty('--hero-parallax-base', '0px');
        el.style.setProperty('--hero-parallax-top', '0px');
        el.style.setProperty('--hero-scale-base', '1');
        el.style.setProperty('--hero-scale-top', '1');
        return;
      }

      const rect = hero.getBoundingClientRect();
      const heroTop = rect.top;
      const heroH = Math.max(1, rect.height);

      // 0 when hero top at viewport top; negative as you scroll down.
      const progress = -heroTop / heroH;
      const clamped = Math.min(2.0, Math.max(-0.25, progress));

      // Make it obvious: map progress to a larger pixel travel.
      // Using heroH keeps the feel consistent across screen sizes.
      const travelPx = heroH * 0.45 * dial.parallax.strength;
      const base = Math.max(
        -dial.parallax.maxPx,
        Math.min(dial.parallax.maxPx, clamped * travelPx),
      );

      const spread = dial.parallax.layerSpread;
      const basePx = base * (1 - spread);
      const topPx = base * (1 + spread);

      el.style.setProperty('--hero-parallax-base', `${basePx.toFixed(2)}px`);
      el.style.setProperty('--hero-parallax-top', `${topPx.toFixed(2)}px`);

      // Scroll-anchored scale (zoom in as you scroll down).
      if (!dial.parallax.scaleEnabled) {
        el.style.setProperty('--hero-scale-base', '1');
        el.style.setProperty('--hero-scale-top', '1');
        return;
      }

      const raw = Math.max(
        0,
        Math.min(dial.parallax.scaleMax, clamped * dial.parallax.scaleStrength),
      );
      const baseS = 1 + raw * (1 - spread * 0.7);
      const topS = 1 + raw * (1 + spread * 0.7);
      el.style.setProperty('--hero-scale-base', baseS.toFixed(4));
      el.style.setProperty('--hero-scale-top', topS.toFixed(4));
    };

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [
    dial.parallax.enabled,
    dial.parallax.layerSpread,
    dial.parallax.maxPx,
    dial.parallax.scaleEnabled,
    dial.parallax.scaleMax,
    dial.parallax.scaleStrength,
    dial.parallax.strength,
  ]);

  return (
    <div
      ref={wrapRef}
      className="hero-bg-wrap"
      aria-hidden="true"
      style={
        {
          // Background image sources (used via CSS vars).
          ['--hero-bg-a' as any]: `url(/assets/hero-variant-chatgpt-1.png)`,
          ['--hero-bg-b' as any]: `url(/assets/hero-variant-chatgpt-2.png)`,
          // Used by CSS mask (see globals.css updates).
          ['--hero-reveal-r' as any]: `${dial.reveal.radius}px`,
          ['--hero-reveal-f' as any]: `${dial.reveal.feather}px`,
          ['--hero-top-o' as any]: dial.reveal.topOpacity,
          ['--hero-idle-o' as any]: dial.reveal.idleOpacity,
        } as React.CSSProperties
      }
    >
      <div ref={imgsRef} className="hero-bg-imgs hero-imgs-hidden">
        {/* BG2 bottom layer (base) — image or full-bleed video */}
        <div
          className={
            'hero-bg-img hero-bg-img-base' +
            (dial.base.source === 'video' ? ' hero-bg-img-base--video' : '')
          }
        >
          {dial.base.source === 'video' ? (
            <video
              key={HERO_BOTTOM_VIDEO_SRC}
              ref={videoRef}
              className={
                'hero-bg-video' + (baseVideoVisible ? ' hero-bg-video--visible' : '')
              }
              src={HERO_BOTTOM_VIDEO_SRC}
              poster="/assets/hero-variant-chatgpt-2.png"
              muted
              playsInline
              loop
              preload="auto"
              onLoadedData={() => {
                const v = videoRef.current;
                if (v) {
                  try {
                    v.currentTime = 0;
                  } catch {}
                  v.pause();
                }
                if (!introCompleteRef.current) return;
                requestAnimationFrame(() => setBaseVideoVisible(true));
              }}
              onCanPlay={() => {
                if (!introCompleteRef.current) return;
                requestAnimationFrame(() => setBaseVideoVisible(true));
              }}
              onError={() => setBaseVideoVisible(true)}
            />
          ) : null}
        </div>

        {/* BG1 top layer (masked hover / intro bloom) */}
        <div className="hero-bg-img hero-bg-img-top" />
      </div>
      <div className="hero-bg-fade hero-bg-fade-bottom" />
    </div>
  );
}
