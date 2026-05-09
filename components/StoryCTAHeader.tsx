'use client';

import { useEffect, useRef, useState } from 'react';
import RoughUnderline from './RoughUnderline';

export default function StoryCTAHeader() {
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
    <h2 ref={ref} className="t-h3">
      Blockbusters on Pocket<br />
      have gone global <RoughUnderline trigger={visible} delay={400}>through Atlas</RoughUnderline>.
    </h2>
  );
}
