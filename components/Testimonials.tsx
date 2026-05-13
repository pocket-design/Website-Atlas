'use client';

/**
 * Testimonials — infinite horizontal ticker of writer testimonials.
 *
 * Scroll is driven by requestAnimationFrame for pixel-level speed control,
 * which lets us ease-in (decelerate) on mouse-enter and ease-out (accelerate)
 * on mouse-leave — something CSS animation-play-state can't do.
 *
 * Typography:
 *   Name       → Season Mix 400   (--ff-display, t-h4)
 *   Role       → Mallory 400      (--ff-sans)
 *   Quote      → Mallory 400      (--ff-sans)
 */

import { useRef, useEffect } from 'react';

// ── Data ──────────────────────────────────────────────────────────────────────
interface Testimonial {
  id: string;
  name: string;
  role: string;
  initials: string;
  avatarBg: string;
  quote: string;
  listenHref?: string;
}

const TESTIMONIALS: Testimonial[] = [
  {
    id: 'tm-1',
    name: 'Kathrin Corpataux',
    role: 'Indie novelist, Germany',
    initials: 'KC',
    avatarBg: '#C8B99A',
    quote:
      'The cultural audit caught the small things I would have flattened in translation. Its substitution prompts helped me rebuild scenes around American rhythms without losing the story\'s quiet German interiority.',
    listenHref: '#',
  },
  {
    id: 'tm-2',
    name: 'Priya Venkataraman',
    role: 'Serial fiction writer, India',
    initials: 'PV',
    avatarBg: '#B5C4B1',
    quote:
      'Atlas understood that my protagonist\'s relationship with her mother-in-law carries entirely different weight in an Indian context versus a Western one. It rebuilt those scenes from the inside out.',
    listenHref: '#',
  },
  {
    id: 'tm-3',
    name: 'Marco Delgado',
    role: 'Podcast novelist, Mexico',
    initials: 'MD',
    avatarBg: '#D4A59A',
    quote:
      'I was afraid of losing the voice I\'d spent three years building. Atlas kept my narrator\'s sardonic tone intact while swapping every reference that would have confused a Brazilian audience.',
    listenHref: '#',
  },
  {
    id: 'tm-4',
    name: 'Yuki Tanaka',
    role: 'Light novel author, Japan',
    initials: 'YT',
    avatarBg: '#A8BDD1',
    quote:
      'Honorifics, gift-giving scenes, the weight of silence between characters — Atlas mapped all of it onto equivalents that English readers would feel rather than just read.',
    listenHref: '#',
  },
  {
    id: 'tm-5',
    name: 'Amara Osei',
    role: 'Storyteller, Ghana',
    initials: 'AO',
    avatarBg: '#C9C2A8',
    quote:
      'My story was written in Twi-inflected English. Atlas translated that cadence — not just the words but the oral rhythm underneath — into Spanish without making it feel like a textbook.',
    listenHref: '#',
  },
  {
    id: 'tm-6',
    name: 'Sophie Laurent',
    role: 'Romance author, France',
    initials: 'SL',
    avatarBg: '#C4B5C8',
    quote:
      'In French romance, restraint is everything. Atlas knows that. The English version it produced never over-explained what should be left unspoken, and the audience retention data proved it.',
    listenHref: '#',
  },
  {
    id: 'tm-7',
    name: 'Rajesh Mehta',
    role: 'Tamil fiction writer, India',
    initials: 'RM',
    avatarBg: '#B8C9A3',
    quote:
      'The caste dynamics in my story are structural, not ornamental. Atlas flagged every scene where a direct adaptation would have erased that structure and proposed culturally honest alternatives.',
    listenHref: '#',
  },
  {
    id: 'tm-8',
    name: 'Elena Vasquez',
    role: 'Audio drama creator, Colombia',
    initials: 'EV',
    avatarBg: '#D1B8A8',
    quote:
      'Six months into Spanish adaptation, a colleague asked which version came first. Nobody could tell. That\'s the bar, and Atlas cleared it for every one of my twelve episodes.',
    listenHref: '#',
  },
];

// ── Component ─────────────────────────────────────────────────────────────────
export default function Testimonials() {
  const doubled = [...TESTIMONIALS, ...TESTIMONIALS];

  const trackRef   = useRef<HTMLDivElement>(null);
  // Mutable scroll state — updated every RAF, never causes re-renders
  const state = useRef({ pos: 0, speed: 1, target: 1, lastTime: 0 });

  // pixels per second at full speed — tune for desired pace
  const PX_PER_SEC = 160;

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let raf: number;
    const s = state.current;
    s.lastTime = performance.now();

    function tick(now: number) {
      const dt = Math.min((now - s.lastTime) / 1000, 0.1); // cap delta at 100 ms
      s.lastTime = now;

      // Exponential approach to target: creates natural ease-in / ease-out
      // Factor 4 → half-life ≈ 0.17 s; feels like a comfortable deceleration
      s.speed += (s.target - s.speed) * (1 - Math.exp(-dt * 4));

      if (trackRef.current) {
        const halfWidth = trackRef.current.scrollWidth / 2;
        s.pos = (s.pos + PX_PER_SEC * s.speed * dt) % halfWidth;
        trackRef.current.style.transform = `translateX(-${s.pos}px)`;
      }

      raf = requestAnimationFrame(tick);
    }

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const handleMouseEnter = () => { state.current.target = 0; };
  const handleMouseLeave = () => { state.current.target = 1; };

  return (
    <section className="testimonials" aria-label="Writer testimonials">
      {/* Section heading */}
      <div className="testimonials__header">
        <h2 className="t-h2 testimonials__heading">
          Trusted by authors who write for global audiences.
        </h2>
      </div>

      {/* Ticker */}
      <div
        className="testimonials__viewport"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        aria-live="off"
      >
        <div ref={trackRef} className="testimonials__track">
          {doubled.map((t, i) => (
            <article
              key={`${t.id}-${i}`}
              className="testimonial-card"
              aria-label={`Testimonial from ${t.name}`}
            >
              {/* Left: avatar + attribution */}
              <div className="testimonial-card__left">
                <div
                  className="testimonial-card__avatar"
                  style={{ background: t.avatarBg }}
                  aria-hidden="true"
                >
                  {t.initials}
                </div>
                {/* Season Mix for the name */}
                <strong className="t-h4 testimonial-card__name">{t.name}</strong>
                {/* Mallory 400 for the role */}
                <span className="testimonial-card__role">{t.role}</span>
                {t.listenHref && (
                  <a
                    href={t.listenHref}
                    className="testimonial-card__listen"
                    tabIndex={-1}
                    aria-hidden="true"
                  >
                    Listen to story&nbsp;▶
                  </a>
                )}
              </div>

              {/* Right: quote — Mallory 400 */}
              <div className="testimonial-card__right">
                <blockquote className="testimonial-card__quote">
                  {t.quote}
                </blockquote>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
