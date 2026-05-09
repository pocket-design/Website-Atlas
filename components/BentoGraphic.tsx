'use client';

import { useEffect, useRef } from 'react';

export type SceneName = 'transpose' | 'knowledge' | 'strategy' | 'triage' | 'validation' | 'graph';

type SceneState = Record<string, unknown>;
type SceneFn = (ctx: CanvasRenderingContext2D, w: number, h: number, t: number, s: SceneState) => void;

const SCARLET = '#F51D00';
const INK = '#1c1c1c';
const INK_LIGHT = '#c4c4c4';
const BLUE = '#3B82F6';
const AMBER = '#F59E0B';
const GREEN = '#10B981';
const PURPLE = '#8B5CF6';
const NODE_R = 4;

function easeInOut(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function drawNode(ctx: CanvasRenderingContext2D, x: number, y: number, r: number, color: string) {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fillStyle = color;
  ctx.fill();
}

function drawEdge(ctx: CanvasRenderingContext2D, x1: number, y1: number, x2: number, y2: number, color: string, width = 1) {
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.stroke();
}

const scenes: Record<SceneName, SceneFn> = {

  transpose(ctx, w, h, _t, s) {
    type Pt = { x: number; y: number; vx: number; vy: number; targetX: number; targetY: number };
    const state = s as { pts?: Pt[]; prevT?: number };
    const mid = w / 2;
    if (!state.pts) {
      state.pts = Array.from({ length: 16 }, () => {
        const x = Math.random() * w;
        const y = Math.random() * h;
        return {
          x, y,
          vx: (Math.random() - 0.5) * 0.6,
          vy: (Math.random() - 0.5) * 0.5,
          targetX: x, targetY: y,
        };
      });
      state.prevT = 0;
    }

    // Smooth movement with momentum dampening
    for (const p of state.pts!) {
      p.x += p.vx;
      p.y += p.vy;
      // Soft boundary bounce with deceleration
      if (p.x < 14) { p.vx = Math.abs(p.vx) * 0.9; p.x = 14; }
      if (p.x > w - 14) { p.vx = -Math.abs(p.vx) * 0.9; p.x = w - 14; }
      if (p.y < 14) { p.vy = Math.abs(p.vy) * 0.9; p.y = 14; }
      if (p.y > h - 14) { p.vy = -Math.abs(p.vy) * 0.9; p.y = h - 14; }
      // Gentle drift variation
      p.vx += (Math.random() - 0.5) * 0.02;
      p.vy += (Math.random() - 0.5) * 0.02;
      p.vx *= 0.995;
      p.vy *= 0.995;
    }

    // Dividing line
    ctx.setLineDash([4, 4]);
    ctx.strokeStyle = INK_LIGHT;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(mid, 0);
    ctx.lineTo(mid, h);
    ctx.stroke();
    ctx.setLineDash([]);

    // Edges
    for (let i = 0; i < state.pts!.length; i++) {
      for (let j = i + 1; j < state.pts!.length; j++) {
        const a = state.pts![i], b = state.pts![j];
        const d = Math.hypot(a.x - b.x, a.y - b.y);
        if (d < w * 0.35) drawEdge(ctx, a.x, a.y, b.x, b.y, INK_LIGHT);
      }
    }

    // Nodes: smooth color transition across the midline
    for (const p of state.pts!) {
      const ratio = Math.min(1, Math.max(0, (p.x - mid + 40) / 80));
      const smoothRatio = easeInOut(ratio);
      const r = Math.floor(lerp(28, 245, smoothRatio));
      const g = Math.floor(lerp(28, 29, smoothRatio));
      const b = Math.floor(lerp(28, 0, smoothRatio));
      drawNode(ctx, p.x, p.y, NODE_R + 1, `rgb(${r},${g},${b})`);
    }
  },

  knowledge(ctx, w, h, t, s) {
    type Pt = { x: number; y: number };
    const state = s as { pts?: Pt[]; edges?: [number, number][]; activeNode?: number; transitionStart?: number };
    if (!state.pts) {
      state.pts = Array.from({ length: 20 }, () => ({
        x: 20 + Math.random() * (w - 40),
        y: 14 + Math.random() * (h - 28),
      }));
      state.edges = [];
      for (let i = 0; i < state.pts.length; i++) {
        for (let j = i + 1; j < state.pts.length; j++) {
          const d = Math.hypot(state.pts[i].x - state.pts[j].x, state.pts[i].y - state.pts[j].y);
          if (d < w * 0.32) state.edges.push([i, j]);
        }
      }
      state.activeNode = 0;
      state.transitionStart = 0;
    }

    // Smooth transition between active nodes every 2s
    const cycleDuration = 2;
    const elapsed = t - (state.transitionStart ?? 0);
    if (elapsed >= cycleDuration) {
      state.activeNode = ((state.activeNode ?? 0) + 1) % state.pts!.length;
      state.transitionStart = t;
    }
    const progress = Math.min(1, elapsed / 0.4);
    const ease = easeInOut(progress);
    const highlight = state.activeNode ?? 0;

    // Edges
    for (const [i, j] of state.edges!) {
      const lit = i === highlight || j === highlight;
      const color = lit ? INK : INK_LIGHT;
      drawEdge(ctx, state.pts![i].x, state.pts![i].y, state.pts![j].x, state.pts![j].y, color);
    }
    // Nodes
    for (let i = 0; i < state.pts!.length; i++) {
      const lit = i === highlight;
      const connected = state.edges!.some(([a, b]) => (a === highlight && b === i) || (b === highlight && a === i));
      if (lit) {
        const r = NODE_R + lerp(0, 2.5, ease);
        drawNode(ctx, state.pts![i].x, state.pts![i].y, r, SCARLET);
      } else if (connected) {
        const r = NODE_R + lerp(0, 1, ease);
        drawNode(ctx, state.pts![i].x, state.pts![i].y, r, INK);
      } else {
        drawNode(ctx, state.pts![i].x, state.pts![i].y, NODE_R, INK_LIGHT);
      }
    }
  },

  strategy(ctx, w, h, t, s) {
    const state = s as { children?: { x: number; y: number; row: number }[] };
    const root = { x: w / 2, y: 24 };
    if (!state.children) {
      const rows = 3;
      const children: { x: number; y: number; row: number }[] = [];
      for (let row = 1; row <= rows; row++) {
        const count = row * 3 + 1;
        const yy = 24 + (h - 48) * (row / rows);
        for (let i = 0; i < count; i++) {
          children.push({ x: 20 + (w - 40) * (i / (count - 1)), y: yy, row });
        }
      }
      state.children = children;
    }

    // Smooth eased pulse wave
    const rawPulse = (t * 0.35) % 1;
    const pulse = easeInOut(rawPulse);
    const pulseY = 24 + pulse * (h - 48);

    // Edges from root with smooth activation
    for (const c of state.children!) {
      const activated = c.y <= pulseY;
      drawEdge(ctx, root.x, root.y, c.x, c.y, activated ? INK : INK_LIGHT);
    }

    // Root node (document icon)
    ctx.fillStyle = SCARLET;
    ctx.beginPath();
    ctx.roundRect(root.x - 8, root.y - 6, 16, 12, 2);
    ctx.fill();

    // Child nodes: smooth scale when pulse hits
    for (const c of state.children!) {
      const dist = Math.abs(c.y - pulseY);
      const proximity = Math.max(0, 1 - dist / 35);
      const eased = easeInOut(proximity);
      const r = NODE_R - 1 + eased * 3;
      const color = proximity > 0.3 ? SCARLET : (c.y < pulseY ? INK : INK_LIGHT);
      drawNode(ctx, c.x, c.y, r, color);
    }
  },

  triage(ctx, w, h, _t, s) {
    type Item = { x: number; y: number; tier: number; speed: number; phase: number };
    const state = s as { items?: Item[] };
    const lanes = [h * 0.25, h * 0.5, h * 0.75];
    const laneColorsSolid = [BLUE, AMBER, SCARLET];
    const laneLabels = ['Preserve', 'Analogize', 'Replace'];

    // Lane lines
    ctx.setLineDash([3, 3]);
    ctx.lineWidth = 1;
    for (let i = 0; i < 3; i++) {
      ctx.strokeStyle = laneColorsSolid[i];
      ctx.beginPath();
      ctx.moveTo(0, lanes[i]);
      ctx.lineTo(w, lanes[i]);
      ctx.stroke();
    }
    ctx.setLineDash([]);

    // Labels
    ctx.font = '10px system-ui, sans-serif';
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'left';
    for (let i = 0; i < 3; i++) {
      ctx.fillStyle = laneColorsSolid[i];
      ctx.fillText(laneLabels[i], 6, lanes[i] - 12);
    }

    if (!state.items) {
      state.items = Array.from({ length: 14 }, () => {
        const tier = Math.floor(Math.random() * 3);
        return {
          x: Math.random() * w,
          y: lanes[tier],
          tier,
          speed: 0.25 + Math.random() * 0.35,
          phase: Math.random() * Math.PI * 2,
        };
      });
    }
    for (const item of state.items!) {
      item.x += item.speed;
      // Gentle sine wave along the lane for organic motion
      item.phase += 0.015;
      item.y = lanes[item.tier] + Math.sin(item.phase) * 3;
      if (item.x > w + 10) {
        item.x = -10;
        item.tier = Math.floor(Math.random() * 3);
        item.y = lanes[item.tier];
        item.phase = Math.random() * Math.PI * 2;
      }
      drawNode(ctx, item.x, item.y, NODE_R, laneColorsSolid[item.tier]);
    }
  },

  validation(ctx, w, h, t, s) {
    type Cell = { x: number; y: number; state: 'ok' | 'error' | 'repairing' | 'repaired'; stateT: number };
    const st = s as { cells?: Cell[]; lastFlag?: number };
    const cols = 6, rows = 4;
    const spacingX = (w - 40) / (cols - 1);
    const spacingY = (h - 30) / (rows - 1);
    if (!st.cells) {
      st.cells = [];
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          st.cells.push({ x: 20 + c * spacingX, y: 15 + r * spacingY, state: 'ok', stateT: 0 });
        }
      }
      st.lastFlag = 0;
    }

    // State machine: flag errors every 4s, repair after 1.5s, settle after 1s more
    const timeSinceFlag = t - (st.lastFlag ?? 0);
    if (timeSinceFlag > 4 && !st.cells!.some(c => c.state !== 'ok')) {
      const idx1 = Math.floor(Math.random() * st.cells!.length);
      let idx2 = idx1;
      while (idx2 === idx1) idx2 = Math.floor(Math.random() * st.cells!.length);
      st.cells![idx1].state = 'error';
      st.cells![idx1].stateT = t;
      st.cells![idx2].state = 'error';
      st.cells![idx2].stateT = t;
      st.lastFlag = t;
    }
    for (const c of st.cells!) {
      const elapsed = t - c.stateT;
      if (c.state === 'error' && elapsed > 1.5) {
        c.state = 'repairing';
        c.stateT = t;
      } else if (c.state === 'repairing' && elapsed > 0.6) {
        c.state = 'repaired';
        c.stateT = t;
      } else if (c.state === 'repaired' && elapsed > 1.2) {
        c.state = 'ok';
        c.stateT = t;
      }
    }

    // Edges between adjacent nodes
    for (let i = 0; i < st.cells!.length; i++) {
      const a = st.cells![i];
      for (let j = i + 1; j < st.cells!.length; j++) {
        const b = st.cells![j];
        const d = Math.hypot(a.x - b.x, a.y - b.y);
        if (d < spacingX * 1.5) drawEdge(ctx, a.x, a.y, b.x, b.y, INK_LIGHT);
      }
    }

    // Nodes with smooth size transition based on state
    for (const c of st.cells!) {
      const elapsed = t - c.stateT;
      let color = INK_LIGHT;
      let r = NODE_R;

      if (c.state === 'error') {
        const pulse = easeInOut(Math.min(1, elapsed / 0.3));
        r = NODE_R + pulse * 2.5;
        color = '#DC2626';
      } else if (c.state === 'repairing') {
        const pulse = easeInOut(Math.min(1, elapsed / 0.3));
        r = NODE_R + 2.5 - pulse * 1;
        color = AMBER;
      } else if (c.state === 'repaired') {
        const shrink = easeInOut(Math.min(1, elapsed / 0.5));
        r = NODE_R + 1.5 - shrink * 1.5;
        color = GREEN;
      }
      drawNode(ctx, c.x, c.y, r, color);
    }
  },

  graph(ctx, w, h, t, s) {
    type ClusterT = { cx: number; cy: number; color: string; nodes: { x: number; y: number }[] };
    const state = s as { clusters?: ClusterT[]; interEdges?: [number, number, number, number][] };
    if (!state.clusters) {
      const colors = [BLUE, GREEN, AMBER, PURPLE, SCARLET];
      const centers = [
        { cx: w * 0.18, cy: h * 0.28 }, { cx: w * 0.48, cy: h * 0.2 },
        { cx: w * 0.8, cy: h * 0.32 }, { cx: w * 0.28, cy: h * 0.75 },
        { cx: w * 0.72, cy: h * 0.72 },
      ];
      state.clusters = centers.map((c, i) => ({
        cx: c.cx, cy: c.cy, color: colors[i],
        nodes: Array.from({ length: 4 + Math.floor(Math.random() * 3) }, () => ({
          x: c.cx + (Math.random() - 0.5) * w * 0.16,
          y: c.cy + (Math.random() - 0.5) * h * 0.24,
        })),
      }));
      state.interEdges = [];
      for (let i = 0; i < state.clusters.length - 1; i++) {
        const a = state.clusters[i], b = state.clusters[i + 1];
        state.interEdges.push([a.cx, a.cy, b.cx, b.cy]);
      }
      // Add a wrap-around edge
      const first = state.clusters[0], last = state.clusters[state.clusters.length - 1];
      state.interEdges.push([last.cx, last.cy, first.cx, first.cy]);
    }

    // Inter-cluster edges with traveling dot (smooth eased)
    const rawPulse = (t * 0.25) % 1;
    const pulse = easeInOut(rawPulse);
    for (const [x1, y1, x2, y2] of state.interEdges!) {
      drawEdge(ctx, x1, y1, x2, y2, INK_LIGHT, 1);
      const px = lerp(x1, x2, pulse);
      const py = lerp(y1, y2, pulse);
      drawNode(ctx, px, py, 3, SCARLET);
    }

    // Intra-cluster edges and nodes
    for (const cluster of state.clusters!) {
      for (let i = 0; i < cluster.nodes.length; i++) {
        for (let j = i + 1; j < cluster.nodes.length; j++) {
          drawEdge(ctx, cluster.nodes[i].x, cluster.nodes[i].y, cluster.nodes[j].x, cluster.nodes[j].y, INK_LIGHT);
        }
      }
      for (const n of cluster.nodes) {
        drawNode(ctx, n.x, n.y, NODE_R, cluster.color);
      }
    }
  },
};

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
      for (const k of Object.keys(state)) delete state[k];
    };

    const tick = () => {
      if (!inView) { raf = 0; return; }
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
