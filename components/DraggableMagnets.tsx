'use client';

import { useRef, useCallback, useState, useEffect } from 'react';

type Coord = number | string;

const MAGNETS: Array<{
  src: string;
  x: Coord;
  y: Coord;
  angle: number;
  delay: number;
  duration: number;
}> = [
  { src: '/assets/magnet-1.png', x: 160, y: -55, angle: -8, delay: 0,   duration: 6.2 },
  { src: '/assets/magnet-2.png', x: 510, y: -65, angle: 5,  delay: 3.4, duration: 7.1 },
  { src: '/assets/magnet-3.png', x: 860, y: -50, angle: -3, delay: 1.6, duration: 5.6 },
  { src: '/assets/magnet-4.png', x: 40,  y: 150, angle: 6,  delay: 4.8, duration: 6.8 },
  { src: '/assets/magnet-5.png', x: 960, y: 160, angle: -5, delay: 2.2, duration: 5.9 },
];

export default function DraggableMagnets() {
  const [positions, setPositions] = useState<Array<{ x: Coord; y: Coord }>>(
    MAGNETS.map(m => ({ x: m.x, y: m.y }))
  );
  const [dragging, setDragging] = useState<number | null>(null);
  const [inView, setInView] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const dragStart = useRef({ x: 0, y: 0, px: 0, py: 0 });

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { rootMargin: '200px' }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const handlePointerDown = useCallback((e: React.PointerEvent, idx: number) => {
    e.preventDefault();
    const target = e.currentTarget as HTMLElement;
    target.setPointerCapture(e.pointerId);
    dragStart.current = {
      x: e.clientX,
      y: e.clientY,
      px: target.offsetLeft,
      py: target.offsetTop,
    };
    setDragging(idx);
  }, []);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (dragging === null) return;
    const dx = e.clientX - dragStart.current.x;
    const dy = e.clientY - dragStart.current.y;
    setPositions(prev => prev.map((p, i) =>
      i === dragging ? { x: dragStart.current.px + dx, y: dragStart.current.py + dy } : p
    ));
  }, [dragging]);

  const handlePointerUp = useCallback(() => {
    setDragging(null);
  }, []);

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
        const tiltDir = m.angle >= 0 ? 1 : -1;
        const rotation = m.angle + (isDragging ? tiltDir * 7 : 0);
        return (
          <div
            key={i}
            className={`magnet-scattered${isDragging ? ' is-dragging' : ''}`}
            style={{
              left: positions[i].x,
              top: positions[i].y,
              transform: `rotate(${rotation}deg)${isDragging ? ' scale(1.05)' : ''}`,
              zIndex: isDragging ? 10 : 2,
              ['--shimmer-delay' as string]: `${m.delay}s`,
              ['--shimmer-duration' as string]: `${m.duration}s`,
            }}
            onPointerDown={(e) => handlePointerDown(e, i)}
          >
            <img src={m.src} alt="" draggable={false} />
            <span
              className="magnet-sheen"
              style={{
                WebkitMaskImage: `url(${m.src})`,
                maskImage: `url(${m.src})`,
              }}
            />
            <span
              className="magnet-shimmer"
              style={{
                WebkitMaskImage: `url(${m.src})`,
                maskImage: `url(${m.src})`,
              }}
            />
          </div>
        );
      })}
    </div>
  );
}
