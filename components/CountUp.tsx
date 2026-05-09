'use client';

import { useEffect, useRef, useState } from 'react';

interface CountUpProps {
  end: number;
  suffix?: string;
  decimals?: number;
  duration?: number;
}

export default function CountUp({ end, suffix = '', decimals = 0, duration = 1200 }: CountUpProps) {
  const [value, setValue] = useState<number | null>(null);
  const ref = useRef<HTMLSpanElement>(null);
  const startedRef = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !startedRef.current) {
          startedRef.current = true;
          observer.disconnect();
          const start = performance.now();

          const step = (now: number) => {
            const t = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - t, 3);
            setValue(eased * end);
            if (t < 1) requestAnimationFrame(step);
            else setValue(end);
          };
          requestAnimationFrame(step);
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [end, duration]);

  const formatValue = (v: number | null) => {
    if (v === null) return `0${suffix}`;
    if (decimals > 0) return `${v.toFixed(decimals)}${suffix}`;
    const rounded = Math.round(v);
    return `${rounded.toLocaleString()}${suffix}`;
  };

  return <span ref={ref}>{formatValue(value)}</span>;
}
