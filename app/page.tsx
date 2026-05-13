import HeroBgWithDialKit from '@/components/HeroBgWithDialKit';
import HeroAdapter from '@/components/HeroAdapter';
import RevealOnScroll from '@/components/RevealOnScroll';
import NavBar from '@/components/NavBar';
import AtlasBento from '@/components/AtlasBento';
import BattleTestedStats from '@/components/BattleTestedStats';
import Testimonials from '@/components/Testimonials';

export default function Home() {
  return (
    <>
      {/* NAV */}
      <NavBar />

      {/* FOLD 1 — HERO */}
      <section className="hero">
        <HeroBgWithDialKit />
        <div className="hero-eyebrow">Meet Atlas by Pocket</div>
        <h1 className="t-display hero-title">
          Incredibly powerful story adaptation engine for writers
        </h1>
        <HeroAdapter />
      </section>

      {/* FOLD 2 — ATLAS BENTO (feature cards) */}
      <AtlasBento />

      {/* FOLD 3 — STATS */}
      <BattleTestedStats />

      {/* FOLD 4 — TESTIMONIALS */}
      <Testimonials />

      {/* FOLD 5 — FINAL CTA */}
      <section className="final-cta">
        <h2 className="t-h1">
          Bring your story to
          <br />
          Pocket today
        </h2>
        <div className="prompt-box">
          <input
            type="text"
            placeholder="Paste your story or describe what you're building…"
            aria-label="Your story or project description"
          />
          <button type="button" className="prompt-submit">
            Go global →
          </button>
        </div>
      </section>

      {/* FOOTER */}
      <footer>
        <a className="footer-logo" href="#" aria-label="Pocket Atlas — home">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/assets/logo.svg" alt="Pocket Atlas" />
        </a>
        <p className="t-caption" style={{ color: 'var(--text-tertiary)' }}>
          © 2025 Pocket FM. All rights reserved.
        </p>
      </footer>

      <RevealOnScroll />
    </>
  );
}
