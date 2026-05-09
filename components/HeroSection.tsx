'use client';

import { useEffect, useRef, useState } from 'react';
import { HeroAdapter, LocaleCascade } from './AdaptationFlow';
import HeroBackground from './HeroBackground';
import RoughUnderline from './RoughUnderline';

// Scroll inside the morph section is split into two phases:
//   raw 0.00 → 0.20: centering (--hero-progress 0→1)
//   raw 0.20 → 1.00: pills phase (--hero-pill-progress 0→1)
// Centering finishes BEFORE the first pill ever activates so
// the cards are fully parked at viewport center while the
// user reads through the pills.
const CENTER_PHASE_END = 0.20;

// Pill-phase progress → which bucket is active. -1 means
// pills are visible but nothing is highlighted yet (gives
// the user a beat to scan the four pills before the cycle
// starts walking through them). Each selected pill holds for
// 15% of the pill phase so the highlight is comfortable to
// read at normal scroll speed.
function bucketFromPillProgress(p: number): number {
  if (p < 0.40) return -1;
  if (p < 0.55) return 0; // Names
  if (p < 0.70) return 1; // Places
  if (p < 0.85) return 2; // Food & drink
  return 3;               // Family terms
}

export default function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);
  const [pillsSlot, setPillsSlot] = useState<HTMLDivElement | null>(null);
  const [scrollBucket, setScrollBucket] = useState<number>(-1);
  const lastBucketRef = useRef<number>(-1);

  useEffect(() => {
    const section = sectionRef.current;
    const pin = pinRef.current;
    const right = rightRef.current;
    if (!section || !pin || !right) return;

    const measureShift = () => {
      // Recover the natural (untransformed) center by
      // subtracting the current shift contribution from the
      // measured center — avoids briefly toggling progress to
      // 0, which would flash the right column off-center on
      // any layout change (e.g. a pill click that repaints
      // a highlight and triggers ResizeObserver).
      const progress =
        parseFloat(section.style.getPropertyValue('--hero-progress')) || 0;
      const currentShiftX =
        parseFloat(section.style.getPropertyValue('--hero-right-shift-x')) || 0;
      const currentShiftY =
        parseFloat(section.style.getPropertyValue('--hero-right-shift-y')) || 0;
      const rightRect = right.getBoundingClientRect();
      const naturalCenterX =
        rightRect.left + rightRect.width / 2 - progress * currentShiftX;
      const naturalCenterY =
        rightRect.top + rightRect.height / 2 - progress * currentShiftY;
      const pinRect = pin.getBoundingClientRect();
      const targetX = pinRect.left + pinRect.width / 2;
      const targetY = pinRect.top + pinRect.height / 2;
      section.style.setProperty(
        '--hero-right-shift-x',
        `${targetX - naturalCenterX}px`,
      );
      section.style.setProperty(
        '--hero-right-shift-y',
        `${targetY - naturalCenterY}px`,
      );
    };

    let raf = 0;
    const update = () => {
      raf = 0;
      const rect = section.getBoundingClientRect();
      const total = section.offsetHeight - window.innerHeight;
      const scrolled = Math.min(Math.max(-rect.top, 0), Math.max(total, 0));
      const raw = total > 0 ? scrolled / total : 0;
      const centerProgress = Math.min(1, raw / CENTER_PHASE_END);
      const pillProgress =
        raw <= CENTER_PHASE_END
          ? 0
          : Math.min(1, (raw - CENTER_PHASE_END) / (1 - CENTER_PHASE_END));
      section.style.setProperty('--hero-progress', String(centerProgress));
      section.style.setProperty('--hero-pill-progress', String(pillProgress));
      const bucket = bucketFromPillProgress(pillProgress);
      if (bucket !== lastBucketRef.current) {
        lastBucketRef.current = bucket;
        setScrollBucket(bucket);
      }
    };

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    const onResize = () => {
      measureShift();
      update();
    };

    measureShift();
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);
    const ro = new ResizeObserver(() => {
      measureShift();
      update();
    });
    ro.observe(section);
    // .hero-right grows as LocaleCascade lays out (cards,
    // images, font swaps); without observing it directly the
    // shift gets locked to the initial empty-column reading.
    ro.observe(right);
    const stage = pin.querySelector<HTMLDivElement>('.hero-stage');
    if (stage) ro.observe(stage);

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      ro.disconnect();
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="locale-cascade"
      className="hero hero--morph"
    >
      <div ref={pinRef} className="hero-pin">
        <HeroBackground />
        <div className="hero-stage">
          <div className="hero-text">
            <h1 className="t-hero hero-title">
              Incredibly powerful story adaptation engine for{' '}
              <RoughUnderline delay={3000}>writers</RoughUnderline>
            </h1>
            <p className="hero-subhead">
              Atlas adapts your stories naturally for global audiences—preserving tone,
              meaning, and cultural nuance.
            </p>
            <a href="#" className="btn-brand hero-cta">Start writing</a>
          </div>
          <div ref={rightRef} className="hero-right">
            <HeroAdapter />
            <LocaleCascade
              pillsContainer={pillsSlot}
              scrollBucket={scrollBucket}
            />
          </div>
        </div>
        {/* Pills are portaled here so they live outside the
            centered hero-right transform AND outside the
            container-width stage, freeing them to sit at the
            true viewport edges instead of being squeezed up
            against the cards. */}
        <div ref={setPillsSlot} className="hero-pills-slot" />
      </div>
    </section>
  );
}
