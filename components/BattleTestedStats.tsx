'use client';

/**
 * BattleTestedStats — scroll-driven stacked card section.
 * Each card slides up from below and lands on the stack as you scroll,
 * with previous cards peeking from behind at a slight upward offset.
 *
 * Styling: all tokens from globals.css (design-system.md).
 * Animation: Framer Motion useScroll + useTransform (motion/react).
 *
 * Falls back to a simple vertical stack on:
 *  - viewport width < 768 px
 *  - prefers-reduced-motion
 *  - server-side render (avoids hydration mismatch)
 */

import { useRef, useState, useEffect } from 'react';
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
} from 'motion/react';

// ── Card data ─────────────────────────────────────────────────────────────────
interface StatCard {
  id: string;
  number: string;
  numberAriaLabel: string;
  label: string;
  subheading?: string;
  description: string;
  bullets?: string[];
}

const CARDS: StatCard[] = [
  {
    id: 'bts-0',
    number: '50%',
    numberAriaLabel: '50 percent',
    label: 'better retention',
    subheading: 'Adaptation performs significantly better than translation',
    description:
      'Atlas rebuilds the cultural fabric so stories feel native. Higher engagement, longer listen times, growing revenue.',
  },
  {
    id: 'bts-1',
    number: '10,000+',
    numberAriaLabel: '10,000 plus',
    label: 'Stories adapted',
    description: 'From short fiction to 200-chapter epics. Every genre, every length.',
  },
  {
    id: 'bts-2',
    number: '50+',
    numberAriaLabel: '50 plus',
    label: 'Locales supported',
    description: 'Deep cultural intelligence, not just language swaps.',
  },
  {
    id: 'bts-3',
    number: '99.2%',
    numberAriaLabel: '99.2 percent',
    label: 'Consistency score',
    description:
      'Names, relationships, and references stay coherent across every chapter.',
  },
];

// ── Scroll-range constants ────────────────────────────────────────────────────
// scrollYProgress 0→1 over the bts__scroll-space div.
// Card 0 is already visible at p=0; subsequent cards enter during their range.
//                   [card enters start, enters end, pushed-back by next card start]
const RANGES = [
  { in: [0, 0] as [number, number],         pushAt: 0.22 },  // card 0: already visible
  { in: [0.22, 0.40] as [number, number],   pushAt: 0.47 },  // card 1
  { in: [0.47, 0.65] as [number, number],   pushAt: 0.72 },  // card 2
  { in: [0.72, 0.88] as [number, number],   pushAt: 1.10 },  // card 3: never pushed
] as const;

// Per-depth peek offsets (px) and scale multipliers
const PEEK = [0, -32, -60, -84] as const;
const SCALE = [1, 0.97, 0.94, 0.92] as const;

// linear-interpolation helper, clamped to [0, 1]
function lerp(a: number, b: number, t: number) {
  return a + (b - a) * Math.max(0, Math.min(1, t));
}

// ── Main component ────────────────────────────────────────────────────────────
export default function BattleTestedStats() {
  const scrollSpaceRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  // Mount-gated to prevent SSR/hydration mismatch on section height
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    setMounted(true);
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // useScroll targets the tall scroll-space div so progress 0 = sticky-inner
  // starts sticking and progress 1 = last card fully settled.
  const { scrollYProgress } = useScroll({
    target: scrollSpaceRef,
    offset: ['start start', 'end end'],
  });

  // ── Per-card y transforms (function form avoids window.innerHeight on SSR) ──
  // Each card's y is computed from scrollYProgress:
  //   vh    = off-screen below (enters from here)
  //   0     = active (centered in sticky viewport)
  //   -N    = peeking (shifted up, shows behind the active card)

  const y0 = useTransform(scrollYProgress, (p) => {
    const vh = typeof window !== 'undefined' ? window.innerHeight : 900;
    // Card 0 starts visible; moves to peek positions as later cards enter
    if (p < RANGES[0].pushAt)                             return 0;
    if (p < RANGES[1].in[1])                              return lerp(0, PEEK[1], (p - RANGES[0].pushAt) / (RANGES[1].in[1] - RANGES[0].pushAt));
    if (p < RANGES[1].pushAt)                             return PEEK[1];
    if (p < RANGES[2].in[1])                              return lerp(PEEK[1], PEEK[2], (p - RANGES[1].pushAt) / (RANGES[2].in[1] - RANGES[1].pushAt));
    if (p < RANGES[2].pushAt)                             return PEEK[2];
    if (p < RANGES[3].in[1])                              return lerp(PEEK[2], PEEK[3], (p - RANGES[2].pushAt) / (RANGES[3].in[1] - RANGES[2].pushAt));
    return PEEK[3];
    void vh; // suppress unused-var warning; value used only via closure for type safety
  });

  const y1 = useTransform(scrollYProgress, (p) => {
    const vh = typeof window !== 'undefined' ? window.innerHeight : 900;
    if (p < RANGES[1].in[0])                              return vh;
    if (p < RANGES[1].in[1])                              return lerp(vh, 0, (p - RANGES[1].in[0]) / (RANGES[1].in[1] - RANGES[1].in[0]));
    if (p < RANGES[1].pushAt)                             return 0;
    if (p < RANGES[2].in[1])                              return lerp(0, PEEK[1], (p - RANGES[1].pushAt) / (RANGES[2].in[1] - RANGES[1].pushAt));
    if (p < RANGES[2].pushAt)                             return PEEK[1];
    if (p < RANGES[3].in[1])                              return lerp(PEEK[1], PEEK[2], (p - RANGES[2].pushAt) / (RANGES[3].in[1] - RANGES[2].pushAt));
    return PEEK[2];
    void vh;
  });

  const y2 = useTransform(scrollYProgress, (p) => {
    const vh = typeof window !== 'undefined' ? window.innerHeight : 900;
    if (p < RANGES[2].in[0])                              return vh;
    if (p < RANGES[2].in[1])                              return lerp(vh, 0, (p - RANGES[2].in[0]) / (RANGES[2].in[1] - RANGES[2].in[0]));
    if (p < RANGES[2].pushAt)                             return 0;
    if (p < RANGES[3].in[1])                              return lerp(0, PEEK[1], (p - RANGES[2].pushAt) / (RANGES[3].in[1] - RANGES[2].pushAt));
    return PEEK[1];
    void vh;
  });

  const y3 = useTransform(scrollYProgress, (p) => {
    const vh = typeof window !== 'undefined' ? window.innerHeight : 900;
    if (p < RANGES[3].in[0])                              return vh;
    if (p < RANGES[3].in[1])                              return lerp(vh, 0, (p - RANGES[3].in[0]) / (RANGES[3].in[1] - RANGES[3].in[0]));
    return 0;
    void vh;
  });

  // Scale transforms (static arrays are fine here — no window access needed)
  const s0 = useTransform(scrollYProgress, [0, RANGES[1].in[1], RANGES[2].in[1], RANGES[3].in[1]], [SCALE[0], SCALE[1], SCALE[2], SCALE[3]]);
  const s1 = useTransform(scrollYProgress, [0, RANGES[1].in[1], RANGES[2].in[1], RANGES[3].in[1]], [SCALE[0], SCALE[0], SCALE[1], SCALE[2]]);
  const s2 = useTransform(scrollYProgress, [0, RANGES[2].in[1], RANGES[3].in[1]],                  [SCALE[0], SCALE[0], SCALE[1]]);
  const s3 = useTransform(scrollYProgress, [0, 1],                                                  [SCALE[0], SCALE[0]]);

  // No opacity or blur on any card — all cards stay fully visible
  const op0 = useTransform(scrollYProgress, [0, 1], [1, 1]);
  const op1 = useTransform(scrollYProgress, [0, 1], [1, 1]);
  const op2 = useTransform(scrollYProgress, [0, 1], [1, 1]);
  const op3 = useTransform(scrollYProgress, [0, 1], [1, 1]);

  const bl0 = useTransform(scrollYProgress, [0, 1], ['blur(0px)', 'blur(0px)']);
  const bl1 = useTransform(scrollYProgress, [0, 1], ['blur(0px)', 'blur(0px)']);
  const bl2 = useTransform(scrollYProgress, [0, 1], ['blur(0px)', 'blur(0px)']);
  const bl3 = useTransform(scrollYProgress, [0, 1], ['blur(0px)', 'blur(0px)']);

  const ys      = [y0, y1, y2, y3] as const;
  const scales  = [s0, s1, s2, s3] as const;
  const opacities = [op0, op1, op2, op3] as const;
  const blurs   = [bl0, bl1, bl2, bl3] as const;

  // Use simple stacked layout when: SSR, mobile, or reduced-motion preferred
  const simple = !mounted || isMobile || !!prefersReducedMotion;

  // ── Simple vertical stack (mobile / reduced-motion / SSR) ──────────────────
  if (simple) {
    return (
      <section className="bts bts--simple">
        <div className="bts__simple-inner">
          <h2 className="t-h2 bts__section-heading">
            Battle-tested at global scale.
          </h2>
          <div className="bts__simple-cards">
            {CARDS.map((card) => (
              <Card key={card.id} card={card} />
            ))}
          </div>
        </div>
      </section>
    );
  }

  // ── Scroll-stack version ───────────────────────────────────────────────────
  return (
    <section className="bts">
      {/* Tall div provides the scroll distance; heading lives inside the sticky
          inner so it stays visible alongside the first card. */}
      <div ref={scrollSpaceRef} className="bts__scroll-space">
        <div className="bts__sticky-inner">
          {/* Heading + card stack grouped so they center as a unit */}
          <h2 className="t-h2 bts__sticky-heading">
            Battle-tested at global scale.
          </h2>

          <div className="bts__card-area">
            {CARDS.map((card, i) => (
              <motion.div
                key={card.id}
                className="bts__card-track"
                style={{
                  y: ys[i],
                  scale: scales[i],
                  opacity: opacities[i],
                  filter: blurs[i],
                  zIndex: i + 1,
                }}
              >
                <Card card={card} />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Card sub-component ────────────────────────────────────────────────────────
function Card({ card }: { card: StatCard }) {
  return (
    <article className="bts-card">
      {/* Big stat number + label */}
      <div className="bts-card__kpi">
        <span
          className="bts-card__number"
          aria-label={card.numberAriaLabel}
        >
          {card.number}
        </span>
        <h3 className="t-h4 bts-card__label">{card.label}</h3>
      </div>

      {card.subheading && (
        /* Explanatory prose → t-subheading (Mallory 18px), not a heading */
        <p className="t-subheading bts-card__subheading">{card.subheading}</p>
      )}

      <p className="t-body-sm bts-card__desc">{card.description}</p>

      {card.bullets && (
        <ul className="bts-card__bullets" aria-label="Key metrics">
          {card.bullets.map((text, i) => (
            <li key={i} className="bts-card__bullet">
              {/* Check mark using design system scarlet */}
              <span className="bts-card__check" aria-hidden="true">✓</span>
              <span>
                <BulletText text={text} />
              </span>
            </li>
          ))}
        </ul>
      )}
    </article>
  );
}

// Bolds the leading metric token in each bullet string
function BulletText({ text }: { text: string }) {
  // Match a leading numeric / dollar metric token (e.g. "600+", "$20.5M+", "36")
  const match = text.match(/^(\$?[\d,.]+[+%A-Z]*)\s+(.*)/s);
  if (match) {
    return (
      <>
        <strong>{match[1]}</strong>{' '}
        {match[2]}
      </>
    );
  }
  return <>{text}</>;
}
