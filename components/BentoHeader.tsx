'use client';

import { useEffect, useRef, useState } from 'react';
import RoughUnderline from './RoughUnderline';

export default function BentoHeader() {
  const ref = useRef<HTMLHeadingElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { threshold: 0.5 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <h2 ref={ref} className="t-h2">
      You write the story{' '}
      <RoughUnderline trigger={visible} delay={300}>once</RoughUnderline>.<br />
      Atlas adapts it to{' '}
      <RoughUnderline trigger={visible} delay={800}>the world</RoughUnderline>.
    </h2>
  );
}
