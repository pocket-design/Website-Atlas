'use client';

import { useEffect, useRef, useState } from 'react';

const TOTAL_THUMBS = 50;
const THUMBNAILS: string[] = Array.from(
  { length: TOTAL_THUMBS },
  (_, i) => `/thumbnails/thumb-${String(i + 1).padStart(2, '0')}.jpg`
);

const GRID_SIZE = 12;

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function ThumbnailGrid() {
  const [slots, setSlots] = useState<string[]>(THUMBNAILS.slice(0, GRID_SIZE));
  const [activeSlot, setActiveSlot] = useState(-1);
  const [phase, setPhase] = useState<'idle' | 'out' | 'in'>('idle');
  const slotsRef = useRef(slots);
  slotsRef.current = slots;
  const initialized = useRef(false);

  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true;
      setSlots(shuffle(THUMBNAILS).slice(0, GRID_SIZE));
    }
  }, []);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;

    const cycle = () => {
      const slotIdx = Math.floor(Math.random() * GRID_SIZE);
      setActiveSlot(slotIdx);
      setPhase('out');

      setTimeout(() => {
        setSlots((prev) => {
          const next = [...prev];
          const currentlyVisible = new Set(prev);
          const available = THUMBNAILS.filter((t) => !currentlyVisible.has(t));
          const pool = available.length > 0 ? available : THUMBNAILS.filter((t) => t !== prev[slotIdx]);
          next[slotIdx] = pool[Math.floor(Math.random() * pool.length)];
          return next;
        });
        setPhase('in');

        setTimeout(() => {
          setActiveSlot(-1);
          setPhase('idle');
        }, 600);
      }, 600);

      timeout = setTimeout(cycle, 3000);
    };

    timeout = setTimeout(cycle, 1500);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className="thumb-grid" aria-hidden="true">
      {slots.map((src, i) => (
        <div
          key={i}
          className={
            'thumb-cell' +
            (activeSlot === i && phase === 'out' ? ' thumb-out' : '') +
            (activeSlot === i && phase === 'in' ? ' thumb-in' : '')
          }
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={src} alt="" />
        </div>
      ))}
    </div>
  );
}
