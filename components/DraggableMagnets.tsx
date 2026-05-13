'use client';

import { useRef, useCallback, useState } from 'react';

const MAGNETS = [
  { src: '/assets/magnet-1.png', x: 230, y: -30, angle: -8 },
  { src: '/assets/magnet-2.png', x: 510, y: -25, angle: 5 },
  { src: '/assets/magnet-3.png', x: 790, y: -35, angle: -3 },
  { src: '/assets/magnet-4.png', x: 120, y: 100, angle: 6 },
  { src: '/assets/magnet-5.png', x: 650, y: 95, angle: -5 },
];

export default function DraggableMagnets() {
  const [positions, setPositions] = useState(
    MAGNETS.map(m => ({ x: m.x, y: m.y }))
  );
  const [dragging, setDragging] = useState<number | null>(null);
  const dragStart = useRef({ x: 0, y: 0, px: 0, py: 0 });

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

  const handlePointerUp = useCallback(() => {
    setDragging(null);
  }, []);

  return (
    <div
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
          className={`magnet-scattered${dragging === i ? ' is-dragging' : ''}`}
          style={{
            left: positions[i].x,
            top: positions[i].y,
            transform: `rotate(${m.angle}deg)`,
            zIndex: dragging === i ? 10 : 2,
          }}
          onPointerDown={(e) => handlePointerDown(e, i)}
          draggable={false}
        />
      ))}
    </div>
  );
}
