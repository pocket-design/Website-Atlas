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
  const [slots, setSlots] = useState<string[]>(() => {
    const initial = shuffle(THUMBNAILS).slice(0, GRID_SIZE);
    return initial;
  });
  const [fadingSlot, setFadingSlot] = useState(-1);
  const visibleRef = useRef<Set<string>>(new Set());
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    visibleRef.current = new Set(slots);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const cycle = () => {
      const slotIdx = Math.floor(Math.random() * GRID_SIZE);
      setFadingSlot(slotIdx);

      setTimeout(() => {
        setSlots((prev) => {
          const next = [...prev];
          const currentlyVisible = new Set(prev);
          const available = THUMBNAILS.filter((t) => !currentlyVisible.has(t));
          const pool = available.length > 0 ? available : THUMBNAILS.filter((t) => t !== prev[slotIdx]);
          const newThumb = pool[Math.floor(Math.random() * pool.length)];

          next[slotIdx] = newThumb;
          return next;
        });

        setFadingSlot(-1);
      }, 180);

      timeoutRef.current = setTimeout(cycle, 3000);
    };

    timeoutRef.current = setTimeout(cycle, 1500);
    return () => { if (timeoutRef.current) clearTimeout(timeoutRef.current); };
  }, []);

  return (
    <div className="thumb-grid" aria-hidden="true">
      {slots.map((src, i) => (
        <div key={i} className={'thumb-cell' + (fadingSlot === i ? ' is-fading' : '')}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={src} alt="" />
        </div>
      ))}
    </div>
  );
}
