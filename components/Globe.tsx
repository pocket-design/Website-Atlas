'use client';

import { useEffect, useRef } from 'react';
import { MULTILINGUAL_CHARS } from '@/lib/chars';

/**
 * Full-width wireframe globe behind the hero.
 *
 * - 18×36 lat/lon segments drawn individually so each fades with depth
 * - Multilingual characters at ~32% of front-facing nodes
 * - Slow Y-rotation, paused for prefers-reduced-motion
 * - Anchored just below the hero so only the top hemisphere shows
 * - Axis tilted 45° to the upper-right
 * - Cursor within ~130px repels nearby points (smoothed offset)
 * - Cursor within ~240px paints a scarlet glow halo with shadowBlur
 *   and grows characters from 11→18px as they near the cursor
 */
export default function Globe() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const hero = canvas.parentElement as HTMLElement | null;
    if (!hero) return;

    let W = 0;
    let H = 0;
    const dpr = window.devicePixelRatio || 1;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = Math.max(1, Math.floor(rect.width * dpr));
      canvas.height = Math.max(1, Math.floor(rect.height * dpr));
      W = rect.width;
      H = rect.height;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener('resize', resize);

    const latSteps = 18;
    const lonSteps = 36;
    type Point = {
      lat: number;
      lon: number;
      char: string;
      showChar: boolean;
      ox: number;
      oy: number;
    };
    const points: Point[] = [];
    for (let i = 0; i <= latSteps; i++) {
      const lat = Math.PI * (i / latSteps - 0.5);
      for (let j = 0; j < lonSteps; j++) {
        const lon = (2 * Math.PI * j) / lonSteps;
        points.push({
          lat,
          lon,
          char: MULTILINGUAL_CHARS[(Math.random() * MULTILINGUAL_CHARS.length) | 0],
          showChar: Math.random() < 0.32 && i > 0 && i < latSteps,
          ox: 0,
          oy: 0,
        });
      }
    }

    const reduceMotion =
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const rotSpeed = reduceMotion ? 0 : 0.0014;
    let rot = 0;

    let mouseX = -9999;
    let mouseY = -9999;
    const onMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
    };
    const onLeave = () => {
      mouseX = -9999;
      mouseY = -9999;
    };
    hero.addEventListener('mousemove', onMove);
    hero.addEventListener('mouseleave', onLeave);

    const repelR = 130;
    const repelMax = 44;
    const hoverR = 240;
    const hoverR2 = hoverR * hoverR;

    const tilt = Math.PI / 4;
    const cosTilt = Math.cos(tilt);
    const sinTilt = Math.sin(tilt);

    const project = (lat: number, lon: number, R: number, cx: number, cy: number) => {
      const cl = Math.cos(lat);
      const x3 = cl * Math.cos(lon + rot);
      const y3 = Math.sin(lat);
      const z3 = cl * Math.sin(lon + rot);
      const x4 = x3 * cosTilt - y3 * sinTilt;
      const y4 = x3 * sinTilt + y3 * cosTilt;
      return { x: cx + x4 * R, y: cy + y4 * R, z: z3 };
    };

    let raf = 0;
    const tick = () => {
      rot += rotSpeed;
      ctx.clearRect(0, 0, W, H);

      const R = Math.min(W * 0.52, H * 0.95);
      const cx = W * 0.5;
      const cy = H * 0.96;
      if (R < 60) {
        raf = requestAnimationFrame(tick);
        return;
      }

      type Proj = { x: number; y: number; z: number };
      const proj: Proj[] = new Array(points.length);
      for (let k = 0; k < points.length; k++) {
        const p = points[k];
        const base = project(p.lat, p.lon, R, cx, cy);

        const dx = base.x - mouseX;
        const dy = base.y - mouseY;
        const d = Math.hypot(dx, dy);

        let tx = 0;
        let ty = 0;
        if (d < repelR && d > 0.001) {
          const t = 1 - d / repelR;
          const f = t * t * repelMax;
          tx = (dx / d) * f;
          ty = (dy / d) * f;
        }
        p.ox += (tx - p.ox) * 0.18;
        p.oy += (ty - p.oy) * 0.18;

        proj[k] = { x: base.x + p.ox, y: base.y + p.oy, z: base.z };
      }

      ctx.lineWidth = 1;
      // Latitude rings
      for (let i = 0; i <= latSteps; i++) {
        for (let j = 0; j < lonSteps; j++) {
          const a = proj[i * lonSteps + j];
          const b = proj[i * lonSteps + ((j + 1) % lonSteps)];
          const az = (a.z + b.z) * 0.5;
          const alpha = ((az + 1) * 0.5) * 0.16;
          ctx.strokeStyle = 'rgba(28,28,28,' + alpha.toFixed(3) + ')';
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
      // Longitude meridians
      for (let j = 0; j < lonSteps; j++) {
        for (let i = 0; i < latSteps; i++) {
          const a = proj[i * lonSteps + j];
          const b = proj[(i + 1) * lonSteps + j];
          const az = (a.z + b.z) * 0.5;
          const alpha = ((az + 1) * 0.5) * 0.16;
          ctx.strokeStyle = 'rgba(28,28,28,' + alpha.toFixed(3) + ')';
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }

      // Front-hemisphere characters
      ctx.font = '11px var(--font-mallory-narrow), system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      for (let k = 0; k < points.length; k++) {
        const p = points[k];
        if (!p.showChar) continue;
        const pp = proj[k];
        if (pp.z < -0.05) continue;
        const alpha = Math.max(0, ((pp.z + 1) * 0.5)) * 0.32;
        ctx.fillStyle = 'rgba(28,28,28,' + alpha.toFixed(3) + ')';
        ctx.fillText(p.char, pp.x, pp.y);
      }

      // Scarlet hover halo
      if (mouseX > -1000) {
        ctx.save();
        ctx.shadowColor = 'rgba(245,29,0,0.55)';
        ctx.shadowBlur = 14;
        ctx.lineWidth = 1.2;

        for (let i = 0; i <= latSteps; i++) {
          for (let j = 0; j < lonSteps; j++) {
            const a = proj[i * lonSteps + j];
            const b = proj[i * lonSteps + ((j + 1) % lonSteps)];
            const mx = (a.x + b.x) * 0.5;
            const my = (a.y + b.y) * 0.5;
            const ddx = mx - mouseX;
            const ddy = my - mouseY;
            const d2 = ddx * ddx + ddy * ddy;
            if (d2 > hoverR2) continue;
            const t = 1 - Math.sqrt(d2) / hoverR;
            const f = t * t;
            const az = (a.z + b.z) * 0.5;
            const depth = Math.max(0, (az + 1) * 0.5);
            ctx.strokeStyle = 'rgba(245,29,0,' + (f * 0.85 * depth).toFixed(3) + ')';
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
        for (let j = 0; j < lonSteps; j++) {
          for (let i = 0; i < latSteps; i++) {
            const a = proj[i * lonSteps + j];
            const b = proj[(i + 1) * lonSteps + j];
            const mx = (a.x + b.x) * 0.5;
            const my = (a.y + b.y) * 0.5;
            const ddx = mx - mouseX;
            const ddy = my - mouseY;
            const d2 = ddx * ddx + ddy * ddy;
            if (d2 > hoverR2) continue;
            const t = 1 - Math.sqrt(d2) / hoverR;
            const f = t * t;
            const az = (a.z + b.z) * 0.5;
            const depth = Math.max(0, (az + 1) * 0.5);
            ctx.strokeStyle = 'rgba(245,29,0,' + (f * 0.85 * depth).toFixed(3) + ')';
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }

        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        let lastFontSize = -1;
        for (let k = 0; k < points.length; k++) {
          const p = points[k];
          if (!p.showChar) continue;
          const pp = proj[k];
          if (pp.z < -0.05) continue;
          const ddx = pp.x - mouseX;
          const ddy = pp.y - mouseY;
          const d2 = ddx * ddx + ddy * ddy;
          if (d2 > hoverR2) continue;
          const t = 1 - Math.sqrt(d2) / hoverR;
          const f = t * t;
          const depth = Math.max(0, (pp.z + 1) * 0.5);

          const size = Math.round(11 + 7 * t);
          if (size !== lastFontSize) {
            ctx.font = size + 'px var(--font-mallory-narrow), system-ui, sans-serif';
            lastFontSize = size;
          }
          ctx.fillStyle = 'rgba(245,29,0,' + (f * 0.95 * depth).toFixed(3) + ')';
          ctx.fillText(p.char, pp.x, pp.y);
        }

        ctx.restore();
      }

      raf = requestAnimationFrame(tick);
    };
    tick();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      hero.removeEventListener('mousemove', onMove);
      hero.removeEventListener('mouseleave', onLeave);
    };
  }, []);

  return <canvas ref={canvasRef} className="globe-bg" aria-hidden="true" />;
}
