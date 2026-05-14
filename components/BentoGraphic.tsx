'use client';

import { useEffect, useRef } from 'react';
import { MULTILINGUAL_CHARS, pickChar } from '@/lib/chars';

export type SceneName = 'network' | 'orbit' | 'wave' | 'cascade';

type SceneState = Record<string, unknown>;

type SceneFn = (
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  t: number,
  s: SceneState,
) => void;

const FONT_BODY = '12px var(--font-mallory-compact), system-ui, sans-serif';
const FONT_SMALL = '11px var(--font-mallory-compact), system-ui, sans-serif';

const scenes: Record<SceneName, SceneFn> = {
  /* Multilingual nodes drifting and connecting. */
  network(ctx, w, h, _t, s) {
    type Pt = { x: number; y: number; char: string; vx: number; vy: number };
    const state = s as { points?: Pt[] };
    if (!state.points) {
      state.points = Array.from({ length: 14 }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        char: pickChar(),
        vx: (Math.random() - 0.5) * 0.18,
        vy: (Math.random() - 0.5) * 0.14,
      }));
    }
    const pts = state.points!;
    for (const p of pts) {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 8 || p.x > w - 8) p.vx *= -1;
      if (p.y < 12 || p.y > h - 12) p.vy *= -1;
    }
    ctx.lineWidth = 1;
    const maxD = Math.min(w, h) * 0.55;
    for (let i = 0; i < pts.length; i++) {
      for (let j = i + 1; j < pts.length; j++) {
        const a = pts[i];
        const b = pts[j];
        const d = Math.hypot(a.x - b.x, a.y - b.y);
        if (d < maxD) {
          const al = (1 - d / maxD) * 0.22;
          ctx.strokeStyle = 'rgba(28,28,28,' + al.toFixed(3) + ')';
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }
    ctx.font = FONT_BODY;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = 'rgba(28,28,28,0.55)';
    for (const p of pts) ctx.fillText(p.char, p.x, p.y);
  },

  /* Concentric rings of characters orbiting at varied speeds. */
  orbit(ctx, w, h, t, s) {
    type Ring = { r: number; count: number; speed: number; chars: string[] };
    const state = s as { rings?: Ring[] };
    const cx = w / 2;
    const cy = h / 2;
    if (!state.rings) {
      state.rings = (
        [
          { r: h * 0.2, count: 6, speed: 0.36 },
          { r: h * 0.34, count: 10, speed: -0.22 },
          { r: h * 0.46, count: 14, speed: 0.13 },
        ] as const
      ).map((r) => ({
        ...r,
        chars: Array.from({ length: r.count }, pickChar),
      }));
    }
    ctx.strokeStyle = 'rgba(28,28,28,0.10)';
    ctx.lineWidth = 1;
    for (const r of state.rings!) {
      ctx.beginPath();
      ctx.arc(cx, cy, r.r, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.font = FONT_SMALL;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = 'rgba(28,28,28,0.5)';
    for (const r of state.rings!) {
      for (let i = 0; i < r.count; i++) {
        const a = (i / r.count) * Math.PI * 2 + t * r.speed;
        ctx.fillText(r.chars[i], cx + Math.cos(a) * r.r, cy + Math.sin(a) * r.r);
      }
    }
  },

  /* Two phase-shifted sine waves with characters riding the crest. */
  wave(ctx, w, h, t, s) {
    type C = { x: number; char: string; v: number };
    const state = s as { chars?: C[] };
    const midY = h / 2;
    const amp = h * 0.28;
    const freq = 0.045;
    ctx.lineWidth = 1;
    for (let pass = 0; pass < 2; pass++) {
      const a = pass === 0 ? amp : amp * 0.7;
      ctx.strokeStyle = pass === 0 ? 'rgba(28,28,28,0.18)' : 'rgba(28,28,28,0.10)';
      ctx.beginPath();
      for (let x = 0; x <= w; x += 2) {
        const y = midY + Math.sin(x * freq + t * 1.3 + pass * Math.PI) * a;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
    }
    if (!state.chars) {
      state.chars = Array.from({ length: 10 }, () => ({
        x: Math.random() * w,
        char: pickChar(),
        v: 0.4 + Math.random() * 0.3,
      }));
    }
    ctx.font = FONT_BODY;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = 'rgba(28,28,28,0.55)';
    for (const c of state.chars!) {
      c.x += c.v;
      if (c.x > w + 12) {
        c.x = -12;
        c.char = pickChar();
      }
      const y = midY + Math.sin(c.x * freq + t * 1.3) * amp;
      ctx.fillText(c.char, c.x, y);
    }
  },

  /* Vertical columns of characters cascading like quiet rain. */
  cascade(ctx, w, h, _t, s) {
    type Col = { x: number; offset: number; v: number; chars: string[] };
    const state = s as { cols?: Col[]; w?: number };
    if (!state.cols || state.w !== w) {
      const numCols = Math.max(4, Math.floor(w / 22));
      const spacing = w / numCols;
      const cols: Col[] = Array.from({ length: numCols }, (_, i) => ({
        x: spacing * 0.5 + i * spacing,
        offset: Math.random() * h,
        v: 0.25 + Math.random() * 0.45,
        chars: Array.from({ length: 7 }, pickChar),
      }));
      state.w = w;
      state.cols = cols;
    }
    ctx.font = FONT_SMALL;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    const charSpacing = 14;
    for (const col of state.cols!) {
      col.offset += col.v;
      for (let i = 0; i < col.chars.length; i++) {
        const y = ((col.offset + i * charSpacing) % (h + 28)) - 14;
        const fadeIn = Math.min(1, y / 18);
        const fadeOut = Math.min(1, (h - y) / 18);
        const a = Math.max(0, Math.min(fadeIn, fadeOut)) * 0.55;
        ctx.fillStyle = 'rgba(28,28,28,' + a.toFixed(3) + ')';
        ctx.fillText(col.chars[i], col.x, y);
      }
    }
  },
};

// Touch the import so tree-shaking keeps the symbol used somewhere.
void MULTILINGUAL_CHARS.length;

export default function BentoGraphic({ scene }: { scene: SceneName }) {
  const ref = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const sceneFn = scenes[scene];
    if (!sceneFn) return;

    const dpr = window.devicePixelRatio || 1;
    let W = 0;
    let H = 0;
    let raf = 0;
    let inView = false;
    const state: SceneState = {};
    const t0 = performance.now();

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;
      canvas.width = Math.floor(rect.width * dpr);
      canvas.height = Math.floor(rect.height * dpr);
      W = rect.width;
      H = rect.height;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      // Reset scene state so position arrays match new size
      for (const k of Object.keys(state)) delete state[k];
    };

    const tick = () => {
      if (!inView) {
        raf = 0;
        return;
      }
      const t = (performance.now() - t0) / 1000;
      ctx.clearRect(0, 0, W, H);
      sceneFn(ctx, W, H, t, state);
      raf = requestAnimationFrame(tick);
    };

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting && !inView) {
            inView = true;
            if (W === 0) resize();
            if (!raf) tick();
          } else if (!e.isIntersecting && inView) {
            inView = false;
          }
        }
      },
      { rootMargin: '60px' },
    );
    io.observe(canvas);

    let ro: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined') {
      ro = new ResizeObserver(resize);
      ro.observe(canvas);
    } else {
      window.addEventListener('resize', resize);
    }

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      if (ro) ro.disconnect();
      else window.removeEventListener('resize', resize);
    };
  }, [scene]);

  return <canvas ref={ref} className="bcell-graphic" aria-hidden="true" />;
}
