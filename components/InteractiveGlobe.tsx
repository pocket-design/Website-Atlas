'use client';

import { useEffect, useRef, useState } from 'react';

const PARALLELS = 7;
const MERIDIANS = 12;

function generateGlobePaths(rotX: number, rotY: number): string[] {
  const paths: string[] = [];
  const r = 200;
  const cx = 250;
  const cy = 250;

  // Latitude lines (parallels)
  for (let i = 1; i < PARALLELS; i++) {
    const lat = (i / PARALLELS) * Math.PI - Math.PI / 2;
    const y = cy + r * Math.sin(lat + rotX * 0.3);
    const radiusAtLat = r * Math.cos(lat + rotX * 0.3);
    if (radiusAtLat > 0) {
      paths.push(
        `M ${cx - radiusAtLat} ${y} A ${radiusAtLat} ${radiusAtLat * 0.3} 0 0 1 ${cx + radiusAtLat} ${y}`,
      );
      paths.push(
        `M ${cx - radiusAtLat} ${y} A ${radiusAtLat} ${radiusAtLat * 0.3} 0 0 0 ${cx + radiusAtLat} ${y}`,
      );
    }
  }

  // Longitude lines (meridians)
  for (let i = 0; i < MERIDIANS; i++) {
    const lon = (i / MERIDIANS) * Math.PI + rotY * 0.5;
    const x = cx + r * Math.sin(lon) * 0.95;
    const squeeze = Math.cos(lon);
    const rx = Math.abs(squeeze) * r * 0.15;
    if (rx > 2) {
      paths.push(
        `M ${x} ${cy - r} A ${rx} ${r} 0 0 ${squeeze > 0 ? 1 : 0} ${x} ${cy + r}`,
      );
    }
  }

  return paths;
}

export default function InteractiveGlobe() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const animRef = useRef<number>(0);
  const mouseRef = useRef({ x: 0, y: 0, active: false });

  useEffect(() => {
    let baseRotation = 0;

    const animate = () => {
      baseRotation += 0.003;
      const mouse = mouseRef.current;

      if (mouse.active) {
        setRotation({
          x: mouse.y * 0.4,
          y: baseRotation + mouse.x * 0.6,
        });
      } else {
        setRotation({ x: 0, y: baseRotation });
      }

      animRef.current = requestAnimationFrame(animate);
    };

    animRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animRef.current);
  }, []);

  useEffect(() => {
    const container = containerRef.current?.parentElement;
    if (!container) return;

    const handleMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      mouseRef.current = { x, y, active: true };
    };

    const handleLeave = () => {
      mouseRef.current = { ...mouseRef.current, active: false };
    };

    container.addEventListener('mousemove', handleMove);
    container.addEventListener('mouseleave', handleLeave);
    return () => {
      container.removeEventListener('mousemove', handleMove);
      container.removeEventListener('mouseleave', handleLeave);
    };
  }, []);

  const paths = generateGlobePaths(rotation.x, rotation.y);

  return (
    <div ref={containerRef} className="cascade-globe" aria-hidden="true">
      <svg viewBox="0 0 500 500" fill="none" stroke="currentColor">
        {/* Outer circle */}
        <circle cx="250" cy="250" r="200" strokeWidth="1.2" />
        {/* Grid lines */}
        {paths.map((d, i) => (
          <path key={i} d={d} strokeWidth="0.8" />
        ))}
      </svg>
    </div>
  );
}
