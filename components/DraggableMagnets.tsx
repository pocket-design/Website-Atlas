'use client';

import { useRef, useCallback, useState, useEffect } from 'react';

// Desktop positions are authored for a 1200px-wide container (design space).
// Mobile positions are fractions (0–1) of the actual container width/height,
// since the grid stacks vertically on small screens and the container is much taller.
const DESIGN_WIDTH   = 1200;
const MOBILE_BP      = 640;

const MAGNETS = [
  { src: '/assets/magnet-1.png', x: 230,  y: -30,  angle: -8, delay: 0,   duration: 6.2, mx: 0.05, my: 0.04, mdx: -24, mdy: -48 },
  { src: '/assets/magnet-2.png', x: 794,  y: -46,  angle:  5, delay: 3.4, duration: 7.1, mx: 0.70, my: 0.18, mdx:   0, mdy:   0 },
  { src: '/assets/magnet-3.png', x: 1130, y: -35,  angle: -3, delay: 1.6, duration: 5.6, mx: 0.62, my: 0.50, mdx:   0, mdy:   0 },
  { src: '/assets/magnet-4.png', x: 10,   y:  148, angle:  6, delay: 4.8, duration: 6.8, mx: 0.04, my: 0.68, mdx:   0, mdy:   0 },
  { src: '/assets/magnet-5.png', x: 1020, y:  146, angle: -5, delay: 2.2, duration: 5.9, mx: 0.48, my: 0.86, mdx: 200, mdy: -56 },
];

function computePositions(w: number, h: number) {
  if (w < MOBILE_BP) {
    return MAGNETS.map(m => ({ x: m.mx * w + m.mdx, y: m.my * h + m.mdy }));
  }
  const s = w / DESIGN_WIDTH;
  return MAGNETS.map(m => ({ x: m.x * s, y: m.y * s }));
}

export default function DraggableMagnets() {
  const [positions, setPositions] = useState(() => computePositions(DESIGN_WIDTH, 300));
  const [dragging, setDragging] = useState<number | null>(null);
  const [inView, setInView]     = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const dragStart    = useRef({ x: 0, y: 0, px: 0, py: 0 });

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const io = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { rootMargin: '200px' }
    );
    io.observe(el);

    const ro = new ResizeObserver(entries => {
      const { width, height } = entries[0].contentRect;
      if (width) setPositions(computePositions(width, height));
    });
    ro.observe(el);

    // Seed with real dimensions on mount
    const { width, height } = el.getBoundingClientRect();
    if (width) setPositions(computePositions(width, height));

    return () => { io.disconnect(); ro.disconnect(); };
  }, []);

  const handlePointerDown = useCallback((e: React.PointerEvent, idx: number) => {
    e.preventDefault();
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    dragStart.current = {
      x: e.clientX,
      y: e.clientY,
      px: positions[idx].x,
      py: positions[idx].y,
    };
    setDragging(idx);
  }, [positions]);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (dragging === null) return;
    const dx = e.clientX - dragStart.current.x;
    const dy = e.clientY - dragStart.current.y;
    setPositions(prev => prev.map((p, i) =>
      i === dragging ? { x: dragStart.current.px + dx, y: dragStart.current.py + dy } : p
    ));
  }, [dragging]);

  const handlePointerUp = useCallback(() => setDragging(null), []);

  return (
    <div
      ref={containerRef}
      className={`magnets-container${inView ? ' is-in-view' : ''}`}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
    >
      {MAGNETS.map((m, i) => {
        const isDragging = dragging === i;
        const tiltDir    = m.angle >= 0 ? 1 : -1;
        const rotation   = m.angle + (isDragging ? tiltDir * 7 : 0);
        return (
          <div
            key={i}
            className={`magnet-scattered${isDragging ? ' is-dragging' : ''}`}
            style={{
              left: positions[i].x,
              top:  positions[i].y,
              transform: `rotate(${rotation}deg)${isDragging ? ' scale(1.05)' : ''}`,
              zIndex: isDragging ? 10 : 2,
              ['--shimmer-delay'    as string]: `${m.delay}s`,
              ['--shimmer-duration' as string]: `${m.duration}s`,
            }}
            onPointerDown={(e) => handlePointerDown(e, i)}
          >
            <img src={m.src} alt="" draggable={false} />
            <span
              className="magnet-sheen"
              style={{ WebkitMaskImage: `url(${m.src})`, maskImage: `url(${m.src})` }}
            />
            <span
              className="magnet-shimmer"
              style={{ WebkitMaskImage: `url(${m.src})`, maskImage: `url(${m.src})` }}
            />
          </div>
        );
      })}
    </div>
  );
}
