'use client';

import { useEffect } from 'react';

/**
 * Mounts once and applies a staggered fade-up reveal to all
 * `.bcell` and `.card` elements as they scroll into view. The
 * inline transition is cleaned up after each element finishes
 * so hover transforms still work.
 */
export default function RevealOnScroll() {
  useEffect(() => {
    const easing = 'cubic-bezier(0.22, 1, 0.36, 1)';
    const els = document.querySelectorAll<HTMLElement>('.bcell, .card');
    if (!els.length) return;

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const el = entry.target as HTMLElement;
          el.style.opacity = '1';
          el.style.transform = 'translateY(0)';
          el.addEventListener(
            'transitionend',
            () => {
              el.style.transition = '';
              el.style.opacity = '';
              el.style.transform = '';
            },
            { once: true },
          );
          io.unobserve(el);
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -32px 0px' },
    );

    els.forEach((el, i) => {
      const delay = i * 70;
      el.style.opacity = '0';
      el.style.transform = 'translateY(16px)';
      el.style.transition = `opacity 0.5s ${easing} ${delay}ms, transform 0.5s ${easing} ${delay}ms`;
      io.observe(el);
    });

    return () => io.disconnect();
  }, []);

  return null;
}
