'use client';

import { useEffect, useRef } from 'react';
import rough from 'roughjs';

interface RoughUnderlineProps {
  trigger?: boolean;
  color?: string;
  strokeWidth?: number;
  roughness?: number;
  delay?: number;
  className?: string;
  children: React.ReactNode;
}

export default function RoughUnderline({
  trigger = true,
  color = 'var(--scarlet)',
  strokeWidth = 2.5,
  roughness = 1.5,
  delay = 0,
  className = '',
  children,
}: RoughUnderlineProps) {
  const wrapperRef = useRef<HTMLSpanElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const drawnRef = useRef(false);

  useEffect(() => {
    if (!trigger || drawnRef.current) return;
    if (!wrapperRef.current || !svgRef.current) return;

    const draw = () => {
      const wrapper = wrapperRef.current!;
      const svg = svgRef.current!;
      const { width } = wrapper.getBoundingClientRect();

      svg.setAttribute('width', String(width));
      svg.setAttribute('height', '12');
      svg.setAttribute('viewBox', `0 0 ${width} 12`);
      svg.innerHTML = '';

      const rc = rough.svg(svg);
      const line = rc.line(2, 8, width - 2, 7, {
        stroke: color,
        strokeWidth,
        roughness,
        bowing: 1.5,
      });

      svg.appendChild(line);

      const elements = Array.from(svg.querySelectorAll('path, line')) as SVGGeometryElement[];
      const strokeDuration = 0.5;
      const staggerDelay = 0.15;

      elements.forEach((el) => {
        const length = el.getTotalLength();
        el.style.strokeDasharray = String(length);
        el.style.strokeDashoffset = String(length);
      });

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          elements.forEach((el, i) => {
            el.style.transition = `stroke-dashoffset ${strokeDuration}s cubic-bezier(0.4, 0, 0.2, 1) ${i * staggerDelay}s`;
            el.style.strokeDashoffset = '0';
          });
        });
      });

      drawnRef.current = true;
    };

    if (delay > 0) {
      const t = setTimeout(draw, delay);
      return () => clearTimeout(t);
    } else {
      draw();
    }
  }, [trigger, color, strokeWidth, roughness, delay]);

  return (
    <span ref={wrapperRef} className={`rough-underline ${className}`}>
      {children}
      <svg ref={svgRef} className="rough-underline-svg" aria-hidden="true" />
    </span>
  );
}
