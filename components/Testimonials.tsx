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
  storyName?: string;
}

const TESTIMONIALS: Testimonial[] = [
  {
    id: 'tm-1',
    name: 'Daniele Grassetti',
    storyName: 'MVS',
    role: '',
    initials: 'DG',
    avatarBg: '#C8B99A',
    quote:
      'Copilot Adaptation has significantly accelerated and refined the DE→IT adaptation process. The Italian dialogue feels natural, the pacing is improved, and the tone and intent of the German original are well preserved. The tool also captures cultural nuances and character voices effectively, reducing the need for manual rewriting and research. It saves a considerable amount of time without compromising quality.',
  },
  {
    id: 'tm-2',
    name: 'Blaine Axel Knight',
    storyName: 'Heir of the Dragon',
    role: '',
    initials: 'BK',
    avatarBg: '#B5C4B1',
    quote:
      'Using Copilot Adaptation made the scripting process much more efficient. It helped refine dialogue, improve pacing, and make the writing feel more polished and natural. What stood out most was its ability to adapt my Chinese series for an English-speaking audience. It handled cultural references, character dynamics, and setting changes thoughtfully while preserving the core story. What would normally require extensive rewriting and research became a much more streamlined process, saving significant time while maintaining creative quality.',
  },
  {
    id: 'tm-3',
    name: 'Mallika',
    storyName: 'The World I Created',
    role: '',
    initials: 'MA',
    avatarBg: '#D4A59A',
    quote:
      'The tool was a great help in getting the script to a polished state faster. It refined the language effectively, tightening the writing and adding the right dramatic weight where needed. The standout feature was its adaptation capability. It transformed my Korean script into an American setting, handling names, locations, and cultural nuances that would have otherwise required considerable manual effort.',
  },
  {
    id: 'tm-4',
    name: 'Madhukar',
    storyName: 'Trillionaire Ex Husband Revenge',
    role: '',
    initials: 'MD',
    avatarBg: '#C9C2A8',
    quote:
      'Our team had a smooth experience using this tool. It helped transform an American setting into a story that connects well with Indian audiences. The localization made scenes more engaging and relatable. The writing quality is strong and well dramatized, giving our writers a solid base that requires only minor edits. Most importantly, it significantly improved our speed. Earlier, we could complete one episode a day; now we produce 10 to 15 episodes daily.',
  },
  {
    id: 'tm-5',
    name: 'Kanakavalliy',
    storyName: 'Sarvashakthi dev',
    role: '',
    initials: 'KA',
    avatarBg: '#DBCFB4',
    quote:
      'Our team had a seamless experience using this tool. It played a key role in transforming our drafts into authentic Tamil narratives that resonate with our audience. The localization made scenes more engaging and relatable. The writing quality is strong and nearly ready to use, requiring only minor adjustments and saving our writers valuable time.',
  },
  {
    id: 'tm-6',
    name: 'Preksha Shah',
    storyName: 'Hidden Saintess',
    role: '',
    initials: 'PS',
    avatarBg: '#A8BDD1',
    quote:
      'My experience with Copilot Adaptation has been very positive. The localization felt consistent throughout, with natural dialogue and improved readability. There were fewer errors compared to the usual process, which reduced the need for manual corrections and repetitive edits. This made the workflow smoother and allowed me to focus more on storytelling. Overall, it saved time without compromising quality.',
  },
  {
    id: 'tm-7',
    name: 'Francis Nief',
    storyName: 'Code Vampire',
    role: '',
    initials: 'FN',
    avatarBg: '#C9B5C4',
    quote:
      'My experience using Copilot was smooth and engaging. The AI helped me quickly access precise information about the show’s complex universe, making the French localization richer and more coherent. It supported the process without limiting creativity, allowing me to focus on rewriting while easily navigating detailed story elements.',
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
        <h2 className="t-h3 testimonials__heading">
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
              <blockquote className="testimonial-card__quote">
                {t.quote}
              </blockquote>
              <div className="testimonial-card__footer">
                <div
                  className="testimonial-card__avatar"
                  style={{ background: t.avatarBg }}
                  aria-hidden="true"
                >
                  {t.initials}
                </div>
                <div className="testimonial-card__meta">
                  <strong className="testimonial-card__name">{t.name}</strong>
                  {t.storyName ? (
                    <span className="testimonial-card__story">{t.storyName}</span>
                  ) : null}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
