'use client';

import { useEffect, useState } from 'react';
import { HeroAdapter } from '@/components/AdaptationFlow';
import HeroBg from '@/components/HeroBg';

/**
 * Staggered hero entrance. Keep `NAV_DELAY_MS` in sync with globals
 * `.site-nav.hero-entrance--nav { --he-nav-delay }` fallback.
 */
const T1_MS = 190;
const T1_STAGGER_MS = 44;

const T2_BASE_MS = 100;
const T2_LINE_STAGGER_MS = 52;
const T2_LINE_MS = 245;

const TITLE_LINES = [
  'Incredibly powerful story',
  'adaptation engine for writers',
] as const;

const ADAPT_GAP_MS = 64;
const ADAPT_MS = 260;
const NAV_GAP_MS = 52;

const lastTitleMotionEndMs =
  T2_BASE_MS + (TITLE_LINES.length - 1) * T2_LINE_STAGGER_MS + T2_LINE_MS;
const ADAPT_ENTRANCE_DELAY_MS = lastTitleMotionEndMs + ADAPT_GAP_MS;
const NAV_DELAY_MS = ADAPT_ENTRANCE_DELAY_MS + ADAPT_MS + NAV_GAP_MS;

export default function HeroSection() {
  const [showTypewriter, setShowTypewriter] = useState(false);

  useEffect(() => {
    document.documentElement.style.setProperty(
      '--he-nav-delay',
      `${NAV_DELAY_MS}ms`,
    );
    return () => {
      document.documentElement.style.removeProperty('--he-nav-delay');
    };
  }, []);

  useEffect(() => {
    const reduce =
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (reduce) {
      setShowTypewriter(true);
      return;
    }
    const id = window.setTimeout(
      () => setShowTypewriter(true),
      ADAPT_ENTRANCE_DELAY_MS,
    );
    return () => window.clearTimeout(id);
  }, []);

  return (
    <section className="hero">
      {/*
        HeroBg must stay a direct child of .hero (not inside .hero-entrance).
        A transformed ancestor would become the containing block for the
        absolutely positioned bg, so it would only cover the eyebrow strip.
      */}
      <HeroBg />
      <div className="hero-t1">
        <div
          className="hero-eyebrow hero-entrance hero-entrance-rise-eyebrow"
          style={{
            ['--he-dur' as string]: `${T1_MS}ms`,
            ['--he-delay' as string]: '0ms',
            ['--he-stagger' as string]: '0ms',
          }}
        >
          Meet Atlas by Pocket
        </div>
        <div
          className="hero-divider hero-entrance hero-entrance-rise"
          aria-hidden="true"
          style={{
            ['--he-dur' as string]: `${T1_MS}ms`,
            ['--he-delay' as string]: '0ms',
            ['--he-stagger' as string]: `${T1_STAGGER_MS}ms`,
          }}
        >
          <svg
            className="hero-divider-ornament"
            viewBox="0 0 220 18"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            preserveAspectRatio="xMidYMid meet"
          >
            <circle cx="4" cy="9" r="1.4" fill="currentColor" stroke="none" />
            <circle cx="216" cy="9" r="1.4" fill="currentColor" stroke="none" />
            <line x1="10" y1="9" x2="92" y2="9" strokeWidth="1" />
            <line x1="128" y1="9" x2="210" y2="9" strokeWidth="1" />
            <circle cx="98" cy="9" r="1.1" fill="currentColor" stroke="none" />
            <circle cx="122" cy="9" r="1.1" fill="currentColor" stroke="none" />
            <path
              d="M110 3 L 117 9 L 110 15 L 103 9 Z"
              fill="currentColor"
              stroke="none"
            />
          </svg>
        </div>
      </div>
      <div className="hero-t2">
        <h1 className="t-hero hero-title">
          {TITLE_LINES.map((line, i) => (
            <span
              key={line}
              className="hero-title-line hero-entrance hero-entrance-rise"
              style={{
                ['--he-dur' as string]: `${T2_LINE_MS}ms`,
                ['--he-delay' as string]: `${T2_BASE_MS}ms`,
                ['--he-stagger' as string]: `${i * T2_LINE_STAGGER_MS}ms`,
              }}
            >
              {line}
            </span>
          ))}
        </h1>
        <div
          className={
            showTypewriter
              ? 'hero-adapt-slot hero-adapt-entrance hero-entrance hero-entrance-rise'
              : 'hero-adapt-slot hero-adapt-slot--prerun'
          }
          style={
            showTypewriter
              ? {
                  ['--he-dur' as string]: `${ADAPT_MS}ms`,
                  ['--he-delay' as string]: `${ADAPT_ENTRANCE_DELAY_MS}ms`,
                  ['--he-stagger' as string]: '0ms',
                }
              : undefined
          }
          aria-hidden={!showTypewriter}
        >
          <HeroAdapter paused={!showTypewriter} />
        </div>
      </div>
    </section>
  );
}
