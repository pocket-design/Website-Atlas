import HeroBg from '@/components/HeroBg';
import TranslationWindow from '@/components/TranslationWindow';
import BentoGraphic from '@/components/BentoGraphic';
import RevealOnScroll from '@/components/RevealOnScroll';

export default function Home() {
  return (
    <>
      {/* NAV */}
      <nav>
        <a className="nav-logo" href="#" aria-label="Pocket Atlas — home">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/assets/logo.svg" alt="Pocket Atlas" />
        </a>
        <ul className="nav-links">
          <li>
            <a href="#">Features</a>
          </li>
          <li>
            <a href="#">Stories</a>
          </li>
          <li>
            <a href="#">Pricing</a>
          </li>
          <li>
            <a href="#">Docs</a>
          </li>
        </ul>
        <button type="button" className="btn-primary">
          Go global
        </button>
      </nav>

      {/* FOLD 1 — HERO */}
      <section className="hero">
        <HeroBg />
        <h1 className="t-display hero-title">
          Translation changes words. We change worlds.
        </h1>
        <p className="t-subheading hero-subhead">
          Reimagine your story across cultures and geographies so it truly belongs everywhere.
        </p>
        <TranslationWindow />
      </section>

      {/* FOLD 2 — BENTO */}
      <section className="bento">
        <div className="section-header">
          <div className="t-eyebrow section-eyebrow">What we do</div>
          <h2 className="t-h2">Built for stories that cross borders</h2>
        </div>

        <div className="bento-grid">
          <div className="bcell wide">
            <BentoGraphic scene="network" />
            <h3 className="t-h3">Cultural Intelligence, Not Just Translation</h3>
            <p className="t-body-sm">
              Pocket Atlas goes beyond word-for-word translation. It adapts idioms, cultural
              references, humor, and emotional resonance so your story feels native — no matter
              where it lands.
            </p>
          </div>
          <div className="bcell">
            <BentoGraphic scene="orbit" />
            <div className="bcell-stat">100+</div>
            <h3 className="t-h4">Languages</h3>
            <p className="t-body-sm">Reach listeners across every major market on earth.</p>
          </div>
          <div className="bcell">
            <BentoGraphic scene="wave" />
            <h3 className="t-h4">Instant Adaptation</h3>
            <p className="t-body-sm">
              From English to any locale in seconds, powered by deep narrative AI.
            </p>
          </div>
          <div className="bcell wide">
            <BentoGraphic scene="cascade" />
            <h3 className="t-h3">Story-Aware AI</h3>
            <p className="t-body-sm">
              Unlike generic translation tools, Pocket Atlas understands genre, tone, pacing, and
              character voice — preserving what makes your story uniquely yours across every market.
            </p>
          </div>
        </div>
      </section>

      {/* FOLD 3 — CARDS */}
      <section className="cards-section">
        <div className="section-header">
          <div className="t-eyebrow section-eyebrow">Use cases</div>
          <h2 className="t-h2">One episode, every culture</h2>
        </div>

        <div className="cards-grid">
          <div className="card">
            <div className="card-img c1">🎙️</div>
            <div className="card-body">
              <h3 className="t-h4">Audio Drama</h3>
              <p className="t-body-sm">
                Adapt your podcast or audio drama to resonate with listeners in any language and
                cultural context.
              </p>
            </div>
          </div>
          <div className="card">
            <div className="card-img c2">📚</div>
            <div className="card-body">
              <h3 className="t-h4">Serial Fiction</h3>
              <p className="t-body-sm">
                Publish your serialized stories globally without losing character depth or
                narrative consistency.
              </p>
            </div>
          </div>
          <div className="card">
            <div className="card-img c3">🎬</div>
            <div className="card-body">
              <h3 className="t-h4">Script Adaptation</h3>
              <p className="t-body-sm">
                Turn screenplays and dialogue into culturally fluent scripts ready for international
                production.
              </p>
            </div>
          </div>
          <div className="card">
            <div className="card-img c4">✍️</div>
            <div className="card-body">
              <h3 className="t-h4">Creator Tools</h3>
              <p className="t-body-sm">
                A full suite of writing, editing, and localization tools designed for the modern
                global storyteller.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FOLD 4 — FINAL CTA */}
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
