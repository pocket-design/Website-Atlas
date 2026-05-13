'use client';

import { useRef, useCallback, useState } from 'react';

const MAGNETS = [
  { src: '/assets/magnet-1.png', x: -20, y: -30, angle: -12 },
  { src: '/assets/magnet-2.png', x: 820, y: -25, angle: 6 },
  { src: '/assets/magnet-3.png', x: 200, y: 140, angle: -5 },
  { src: '/assets/magnet-4.png', x: 500, y: 145, angle: 14 },
  { src: '/assets/magnet-5.png', x: 750, y: 130, angle: -9 },
];

interface MagnetState {
  x: number;
  y: number;
  angle: number;
}

export default function DraggableMagnets() {
  const [positions, setPositions] = useState<MagnetState[]>(
    MAGNETS.map(m => ({ x: m.x, y: m.y, angle: m.angle }))
  );
  const [dragging, setDragging] = useState<number | null>(null);
  const dragOffset = useRef({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const handlePointerDown = useCallback((e: React.PointerEvent, idx: number) => {
    e.preventDefault();
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    const container = containerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    dragOffset.current = {
      x: e.clientX - rect.left - positions[idx].x,
      y: e.clientY - rect.top - positions[idx].y,
    };
    setDragging(idx);
  }, [positions]);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (dragging === null) return;
    const container = containerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    const newX = e.clientX - rect.left - dragOffset.current.x;
    const newY = e.clientY - rect.top - dragOffset.current.y;
    setPositions(prev => prev.map((p, i) =>
      i === dragging ? { ...p, x: newX, y: newY } : p
    ));
  }, [dragging]);

  const handlePointerUp = useCallback(() => {
    setDragging(null);
  }, []);

  return (
    <div
      ref={containerRef}
      className="magnets-container"
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
    >
      {MAGNETS.map((m, i) => (
        <img
          key={i}
          src={m.src}
          alt=""
          className={`magnet magnet-scattered${dragging === i ? ' is-dragging' : ''}`}
          style={{
            left: positions[i].x,
            top: positions[i].y,
            transform: `rotate(${positions[i].angle}deg)`,
            zIndex: dragging === i ? 10 : 2,
          }}
          onPointerDown={(e) => handlePointerDown(e, i)}
          draggable={false}
        />
      ))}
    </div>
  );
}
