'use client';

import { useEffect, useRef } from 'react';
import { feature } from 'topojson-client';
import type { Topology } from 'topojson-specification';
import { MULTILINGUAL_CHARS } from '@/lib/chars';
import type { GlobeConfig } from './GlobeDialKit';
import { DEFAULT_CONFIG } from './GlobeDialKit';

// ── City pairs [lat1, lon1, lat2, lon2] in degrees ────────────────────────
const CITY_PAIRS: [number, number, number, number][] = [
  [40.71, -74.01,  51.51,  -0.13],
  [51.51,  -0.13,  28.61,  77.21],
  [28.61,  77.21,  35.69, 139.69],
  [35.69, 139.69, -33.87, 151.21],
  [-33.87, 151.21, -23.55, -46.63],
  [-23.55, -46.63,  6.52,   3.38],
  [6.52,    3.38,  55.75,  37.62],
  [55.75,  37.62,  39.91, 116.39],
  [39.91, 116.39,   1.35, 103.82],
  [1.35,  103.82,  48.85,   2.35],
  [48.85,   2.35,  19.43, -99.13],
  [19.43, -99.13,  34.05,-118.24],
  [34.05,-118.24,  41.88, -87.63],
  [41.88, -87.63, -34.61, -58.38],
  [-34.61, -58.38, 33.89,  35.50],
  [33.89,  35.50,  30.06,  31.25],
  [30.06,  31.25,  -1.29,  36.82],
  [-1.29,  36.82,  14.69, -17.44],
  [14.69, -17.44,  52.52,  13.40],
  [52.52,  13.40,  43.65, -79.38],
  [43.65, -79.38,  25.20,  55.27],
  [25.20,  55.27,  13.75, 100.52],
  [13.75, 100.52,  22.39, 114.11],
  [22.39, 114.11,  37.57, 126.98],
];

// Pre-assigned characters per arc so they don't flicker
const ARC_CHARS = CITY_PAIRS.map(() =>
  Array.from({ length: 60 }, () =>
    MULTILINGUAL_CHARS[(Math.random() * MULTILINGUAL_CHARS.length) | 0]
  )
);

// Per-arc mutable animation state
const makeArcMeta = () =>
  CITY_PAIRS.map((_, i) => ({
    progress: i / CITY_PAIRS.length,
    baseSpeed: 0.0016 + Math.random() * 0.001,
    baseTail:  0.28   + Math.random() * 0.08,
  }));

function degToRad(d: number) { return (d * Math.PI) / 180; }

function slerp(
  lat1: number, lon1: number,
  lat2: number, lon2: number,
  t: number
): [number, number] {
  const x1 = Math.cos(lat1)*Math.cos(lon1), y1 = Math.cos(lat1)*Math.sin(lon1), z1 = Math.sin(lat1);
  const x2 = Math.cos(lat2)*Math.cos(lon2), y2 = Math.cos(lat2)*Math.sin(lon2), z2 = Math.sin(lat2);
  const dot = Math.max(-1, Math.min(1, x1*x2+y1*y2+z1*z2));
  const omega = Math.acos(dot);
  if (omega < 0.0001) return [lat1, lon1];
  const s = Math.sin(omega);
  const a = Math.sin((1-t)*omega)/s, b = Math.sin(t*omega)/s;
  return [Math.asin(Math.max(-1, Math.min(1, a*z1+b*z2))), Math.atan2(a*y1+b*y2, a*x1+b*x2)];
}

type Props = { configRef: React.RefObject<GlobeConfig> };

export default function Globe({ configRef }: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const hero = canvas.parentElement as HTMLElement | null;
    if (!hero) return;

    let W = 0, H = 0;
    const dpr = window.devicePixelRatio || 1;
    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width  = Math.max(1, Math.floor(rect.width  * dpr));
      canvas.height = Math.max(1, Math.floor(rect.height * dpr));
      W = rect.width; H = rect.height;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener('resize', resize);

    // ── World map ────────────────────────────────────────────────────────
    type Ring = [number, number][];
    let countryRings: Ring[] = [];
    fetch('/assets/countries-110m.json')
      .then(r => r.json())
      .then((topo: Topology) => {
        const col = feature(topo, topo.objects.countries as Parameters<typeof feature>[1]);
        const feats = 'features' in col ? col.features : [];
        for (const f of feats) {
          const g = f.geometry; if (!g) continue;
          if (g.type === 'Polygon') {
            for (const ring of g.coordinates) countryRings.push(ring as Ring);
          } else if (g.type === 'MultiPolygon') {
            for (const poly of g.coordinates)
              for (const ring of poly) countryRings.push(ring as Ring);
          }
        }
      }).catch(() => {});

    // ── Mouse ────────────────────────────────────────────────────────────
    let mouseX = -9999, mouseY = -9999;
    const onMove  = (e: MouseEvent) => { const r = canvas.getBoundingClientRect(); mouseX = e.clientX-r.left; mouseY = e.clientY-r.top; };
    const onLeave = () => { mouseX = -9999; mouseY = -9999; };
    hero.addEventListener('mousemove', onMove);
    hero.addEventListener('mouseleave', onLeave);

    // ── Grid ─────────────────────────────────────────────────────────────
    const latSteps = 18, lonSteps = 36;
    const gridPoints = [];
    for (let i = 0; i <= latSteps; i++) {
      const lat = Math.PI * (i / latSteps - 0.5);
      for (let j = 0; j < lonSteps; j++)
        gridPoints.push({ lat, lon: (2 * Math.PI * j) / lonSteps });
    }

    // ── Arc state ────────────────────────────────────────────────────────
    const arcMeta = makeArcMeta();
    let rot = 0;

    // ── Reduce motion ────────────────────────────────────────────────────
    const reduceMotion =
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // ── Draw loop ─────────────────────────────────────────────────────────
    let raf = 0;
    const tick = () => {
      const cfg: GlobeConfig = configRef.current ?? DEFAULT_CONFIG;

      rot += reduceMotion ? 0 : cfg.rotSpeed;

      ctx.clearRect(0, 0, W, H);
      const R  = Math.min(W * 0.52, H * 0.95);
      const cx = W * 0.5, cy = H * 0.96;
      if (R < 60) { raf = requestAnimationFrame(tick); return; }

      // Current tilt from config
      const tiltRad = degToRad(cfg.tilt);
      const cosTilt = Math.cos(tiltRad), sinTilt = Math.sin(tiltRad);

      const project = (latRad: number, lonRad: number, r: number) => {
        const cl = Math.cos(latRad);
        const x3 = cl * Math.cos(lonRad + rot);
        const y3 = Math.sin(latRad);
        const z3 = cl * Math.sin(lonRad + rot);
        return {
          x: cx + (x3*cosTilt - y3*sinTilt) * r,
          y: cy + (x3*sinTilt + y3*cosTilt) * r,
          z: z3,
        };
      };

      // ── Project grid ────────────────────────────────────────────────
      type P3 = { x: number; y: number; z: number };
      const gp: P3[] = gridPoints.map(p => project(p.lat, p.lon, R));

      // ── Wireframe ───────────────────────────────────────────────────
      if (cfg.showWireframe) {
        ctx.lineWidth = 0.6;
        for (let i = 0; i <= latSteps; i++) {
          for (let j = 0; j < lonSteps; j++) {
            const a = gp[i*lonSteps+j], b = gp[i*lonSteps+((j+1)%lonSteps)];
            const alpha = Math.max(0, ((a.z+b.z)*0.5+1)*0.5) * cfg.wireOpacity;
            ctx.strokeStyle = `rgba(28,28,28,${alpha.toFixed(3)})`;
            ctx.beginPath(); ctx.moveTo(a.x,a.y); ctx.lineTo(b.x,b.y); ctx.stroke();
          }
        }
        for (let j = 0; j < lonSteps; j++) {
          for (let i = 0; i < latSteps; i++) {
            const a = gp[i*lonSteps+j], b = gp[(i+1)*lonSteps+j];
            const alpha = Math.max(0, ((a.z+b.z)*0.5+1)*0.5) * cfg.wireOpacity;
            ctx.strokeStyle = `rgba(28,28,28,${alpha.toFixed(3)})`;
            ctx.beginPath(); ctx.moveTo(a.x,a.y); ctx.lineTo(b.x,b.y); ctx.stroke();
          }
        }
      }

      // ── Country outlines ────────────────────────────────────────────
      if (cfg.showOutlines && countryRings.length > 0) {
        ctx.lineWidth = 0.8;
        for (const ring of countryRings) {
          if (ring.length < 2) continue;
          ctx.beginPath();
          let prevVis = false;
          for (let i = 0; i < ring.length; i++) {
            const { x, y, z } = project(degToRad(ring[i][1]), degToRad(ring[i][0]), R);
            const vis = z > -0.08;
            if (i === 0) ctx.moveTo(x, y);
            else if (vis || prevVis) ctx.lineTo(x, y);
            else ctx.moveTo(x, y);
            prevVis = vis;
          }
          const s0 = project(degToRad(ring[0][1]), degToRad(ring[0][0]), R);
          const depth = Math.max(0, (s0.z+1)*0.5);
          ctx.strokeStyle = `rgba(60,60,60,${(depth * cfg.outlineOpacity).toFixed(3)})`;
          ctx.stroke();
        }
      }

      // ── Arcs as multilingual characters ─────────────────────────────
      if (cfg.showArcs) {
        const STEPS = 48;
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';

        for (let i = 0; i < Math.min(cfg.arcCount, CITY_PAIRS.length); i++) {
          const [la1d, lo1d, la2d, lo2d] = CITY_PAIRS[i];
          const meta  = arcMeta[i];
          const chars = ARC_CHARS[i];

          meta.progress += meta.baseSpeed * cfg.arcSpeedMult;
          const tailLen = meta.baseTail * (cfg.tailLen / 0.32);
          if (meta.progress > 1 + tailLen) meta.progress = -tailLen * 0.3;

          const head = Math.min(1, Math.max(0, meta.progress));
          const tail = Math.min(1, Math.max(0, meta.progress - tailLen));
          if (head <= tail) continue;

          const lat1 = degToRad(la1d), lon1 = degToRad(lo1d);
          const lat2 = degToRad(la2d), lon2 = degToRad(lo2d);

          for (let s = 0; s <= STEPS; s++) {
            const t = tail + (s / STEPS) * (head - tail);
            const [la, lo] = slerp(lat1, lon1, lat2, lon2, t);
            const lift = 1.014 + 0.022 * Math.sin(Math.PI * t);
            const { x, y, z } = project(la, lo, R * lift);
            if (z < -0.10) continue;

            const depth   = Math.max(0, (z+1)*0.5);
            const frac    = s / STEPS;
            const opacity = frac * frac * 0.92 * depth;
            if (opacity < 0.02) continue;

            const size = Math.round(cfg.charSizeMin + frac * (cfg.charSizeMax - cfg.charSizeMin));
            ctx.font = `${size}px var(--font-mallory-narrow), system-ui, sans-serif`;
            const g = Math.round(20 + frac * 20);
            ctx.fillStyle = `rgba(220,${g},10,${opacity.toFixed(3)})`;
            ctx.fillText(chars[(i * 7 + s) % chars.length], x, y);
          }

          // Head dot
          const [hla, hlo] = slerp(lat1, lon1, lat2, lon2, head);
          const hp = project(hla, hlo, R * 1.016);
          if (hp.z > -0.05) {
            const depth = Math.max(0, (hp.z+1)*0.5);
            ctx.save();
            ctx.shadowColor = 'rgba(255,40,0,0.9)'; ctx.shadowBlur = 8;
            ctx.fillStyle = `rgba(255,50,15,${(0.95*depth).toFixed(3)})`;
            ctx.beginPath(); ctx.arc(hp.x, hp.y, 2.5, 0, Math.PI*2); ctx.fill();
            ctx.restore();
          }
        }
      }

      // ── Scarlet hover glow ───────────────────────────────────────────
      if (mouseX > -1000) {
        const hR  = cfg.hoverRadius;
        const hR2 = hR * hR;
        ctx.save();
        ctx.shadowColor = 'rgba(245,29,0,0.6)'; ctx.shadowBlur = 18; ctx.lineWidth = 1.4;
        for (let i = 0; i <= latSteps; i++) {
          for (let j = 0; j < lonSteps; j++) {
            const a = gp[i*lonSteps+j], b = gp[i*lonSteps+((j+1)%lonSteps)];
            const d2 = ((a.x+b.x)/2-mouseX)**2+((a.y+b.y)/2-mouseY)**2;
            if (d2 > hR2) continue;
            const t = 1-Math.sqrt(d2)/hR, depth = Math.max(0, ((a.z+b.z)*0.5+1)*0.5);
            ctx.strokeStyle = `rgba(245,29,0,${(t*t*0.9*depth).toFixed(3)})`;
            ctx.beginPath(); ctx.moveTo(a.x,a.y); ctx.lineTo(b.x,b.y); ctx.stroke();
          }
        }
        for (let j = 0; j < lonSteps; j++) {
          for (let i = 0; i < latSteps; i++) {
            const a = gp[i*lonSteps+j], b = gp[(i+1)*lonSteps+j];
            const d2 = ((a.x+b.x)/2-mouseX)**2+((a.y+b.y)/2-mouseY)**2;
            if (d2 > hR2) continue;
            const t = 1-Math.sqrt(d2)/hR, depth = Math.max(0, ((a.z+b.z)*0.5+1)*0.5);
            ctx.strokeStyle = `rgba(245,29,0,${(t*t*0.9*depth).toFixed(3)})`;
            ctx.beginPath(); ctx.moveTo(a.x,a.y); ctx.lineTo(b.x,b.y); ctx.stroke();
          }
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
  }, [configRef]);

  return <canvas ref={canvasRef} className="globe-bg" aria-hidden="true" />;
}
