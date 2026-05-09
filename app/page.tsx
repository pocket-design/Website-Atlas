import Image from 'next/image';
import { HeroAdapter, LocaleCascade } from '@/components/AdaptationFlow';
import BentoGraphic from '@/components/BentoGraphic';
import InteractiveGlobe from '@/components/InteractiveGlobe';
import ThumbnailGrid from '@/components/ThumbnailGrid';

export default function Home() {
  return (
    <>
      {/* Page-top atmosphere — painted background sits behind
          the nav and the hero so the entire top of the page
          shares one continuous artwork. */}
      <div className="page-bg" aria-hidden="true">
        {/* eslint-disable-next-line jsx-a11y/alt-text */}
        <Image
          src="/assets/atlas-background.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          quality={88}
          style={{ objectFit: 'cover', objectPosition: 'center top' }}
        />
      </div>

      {/* NAV */}
      <nav className="site-nav">
        <a className="nav-logo" href="#" aria-label="Pocket Atlas — home">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/assets/logo.svg" alt="Pocket Atlas" />
        </a>
        <ul className="nav-links">
          <li>
            <a href="#locale-cascade">Locales</a>
          </li>
          <li>
            <a href="#how-it-works">How it works</a>
          </li>
          <li>
            <a href="#proof">Proof</a>
          </li>
          <li>
            <a href="#writers">Writers</a>
          </li>
        </ul>
        <button type="button" className="btn-primary">
          Start writing
        </button>
      </nav>

      {/* FOLD 1 — HERO */}
      <section className="hero">
        <div className="hero-eyebrow">Meet the all-new Atlas</div>
        <div className="hero-divider" aria-hidden="true">
          <svg
            className="hero-divider-ornament"
            viewBox="0 0 220 18"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            preserveAspectRatio="xMidYMid meet"
          >
            {/* Outer terminal dots — left and right, equal */}
            <circle cx="4"   cy="9" r="1.4" fill="currentColor" stroke="none" />
            <circle cx="216" cy="9" r="1.4" fill="currentColor" stroke="none" />

            {/* Hairline strokes — mirrored exactly across the
                vertical axis x=110 */}
            <line x1="10"  y1="9" x2="92"  y2="9" strokeWidth="1" />
            <line x1="128" y1="9" x2="210" y2="9" strokeWidth="1" />

            {/* Inner punctuation dots flanking the medallion */}
            <circle cx="98"  cy="9" r="1.1" fill="currentColor" stroke="none" />
            <circle cx="122" cy="9" r="1.1" fill="currentColor" stroke="none" />

            {/* Center diamond medallion — symmetric around x=110 */}
            <path
              d="M110 3 L 117 9 L 110 15 L 103 9 Z"
              fill="currentColor"
              stroke="none"
            />
          </svg>
        </div>
        <h1 className="t-hero hero-title">
          Incredibly powerful story adaptation engine for writers
        </h1>
        <HeroAdapter />
      </section>

      {/* FOLD 2 — Cascade: one English passage, five locales */}
      <section id="locale-cascade" className="cascade">
        <InteractiveGlobe />
        <LocaleCascade />
      </section>

      {/* FOLD 2 — BENTO */}
      <section id="how-it-works" className="bento">
        <div className="section-header">
          <h2 className="t-h2">You write the story once.<br />Atlas adapts it to the world.</h2>
        </div>

        <div className="bento-grid">
          <div className="bcell wide">
            <BentoGraphic scene="network" />
            <h3 className="t-h3">Adapts culture, not just words</h3>
            <p className="t-body-sm">
              Atlas doesn&apos;t translate. It transposes. Names, food, humor, places, and idioms
              are reimagined for each locale so your story feels like it was written there.
            </p>
          </div>
          <div className="bcell">
            <BentoGraphic scene="orbit" />
            <h3 className="t-h3">Remembers everything</h3>
            <p className="t-body-sm">
              A knowledge graph tracks every character, place, and relationship across your entire
              story. Chapter 40 stays consistent with chapter 1, automatically.
            </p>
          </div>
          <div className="bcell">
            <BentoGraphic scene="wave" />
            <h3 className="t-h3">Smart decisions, not blind swaps</h3>
            <p className="t-body-sm">
              A three-tier triage decides what to keep authentic, what to find an analogy for,
              and what to fully reimagine. Nothing feels forced.
            </p>
          </div>
          <div className="bcell">
            <BentoGraphic scene="cascade" />
            <h3 className="t-h3">Understands your story like a reader would</h3>
            <p className="t-body-sm">
              Atlas reads for genre, tone, pacing, and voice before touching a single word.
              It strategizes a localization plan the way a human editor would, then executes
              it at machine speed across every locale simultaneously.
            </p>
          </div>
          <div className="bcell">
            <BentoGraphic scene="wave" />
            <h3 className="t-h3">One click, every market</h3>
            <p className="t-body-sm">
              Hit publish once. Atlas adapts your story to dozens of locales in seconds,
              giving you global reach without a global team.
            </p>
          </div>
        </div>
      </section>

      {/* FOLD 3 — BATTLE-TESTED */}
      <section id="proof" className="proof-section">
        <div className="section-header">
          <h2 className="t-h2">Battle-tested at the global scale.</h2>
        </div>

        <div className="proof-grid">
          <div className="proof-card">
            <div className="proof-stat">10,000+</div>
            <h3 className="t-h4">Stories adapted</h3>
            <p className="t-body-sm">
              From short fiction to 200-chapter epics. Every genre, every length, every narrative structure refined through Atlas.
            </p>
          </div>
          <div className="proof-card">
            <div className="proof-stat">50+</div>
            <h3 className="t-h4">Locales supported</h3>
            <p className="t-body-sm">
              Each with deep cultural intelligence. Not just language swaps, but full cultural transposition tuned by region.
            </p>
          </div>
          <div className="proof-card">
            <div className="proof-stat">99.2%</div>
            <h3 className="t-h4">Consistency score</h3>
            <p className="t-body-sm">
              Entity names, relationships, and references stay coherent across every chapter and every locale, verified end to end.
            </p>
          </div>
        </div>
      </section>

      {/* FOLD 4 — HAVE A STORY */}
      <section id="writers" className="story-cta">
        <h2 className="t-h2">Have a story?<br />Write it on Pocket.</h2>

        <ThumbnailGrid />

        <div className="story-cta-grid">
          <div className="story-cta-cell">
            <svg className="story-cta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
            </svg>
            <h3 className="t-h4">Write freely</h3>
            <p className="t-body-sm">
              Just write. Our AI editor handles the rest.
            </p>
          </div>
          <div className="story-cta-cell">
            <svg className="story-cta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
            </svg>
            <h3 className="t-h4">Go global instantly</h3>
            <p className="t-body-sm">
              One tap. Atlas adapts your story for dozens of locales.
            </p>
          </div>
          <div className="story-cta-cell">
            <svg className="story-cta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
            <h3 className="t-h4">Reach millions</h3>
            <p className="t-body-sm">
              Global distribution puts your work in front of new readers everywhere.
            </p>
          </div>
          <div className="story-cta-cell">
            <svg className="story-cta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
            <h3 className="t-h4">Earn from day one</h3>
            <p className="t-body-sm">
              Every locale is a new revenue stream. Earn automatically.
            </p>
          </div>
        </div>

        <a href="#" className="btn-brand story-cta-btn">Start writing</a>
      </section>

      {/* FOLD 4 — FINAL CTA */}
      {/* FOOTER */}
      <footer>
        <div className="footer-inner">
          <div className="footer-brand">
            <div className="footer-brand-top">
              <div className="footer-logo" aria-label="Pocket Atlas">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/assets/logo.svg" alt="Pocket Atlas" />
              </div>
              <p className="footer-byline">Home of the world&apos;s stories.</p>
            </div>
          </div>

          <nav className="footer-nav">
            <div className="footer-col">
              <h4 className="footer-col-title">Product</h4>
              <a href="https://pocketfm.com">Pocket FM</a>
              <a href="https://www.pocket-fm-writers.com/write">For Writers</a>
              <a href="https://pocketfm.com/pricing">Pricing</a>
              <a href="https://pocketfm.com/affiliate-program">Affiliates</a>
            </div>
            <div className="footer-col">
              <h4 className="footer-col-title">Company</h4>
              <a href="https://pocketfm.com/about-us">About</a>
              <a href="https://www.linkedin.com/company/pocket-fm">LinkedIn</a>
              <a href="https://jobs.weekday.works/pocket-fm-careers-at-pocket-fm">Careers</a>
            </div>
            <div className="footer-col">
              <h4 className="footer-col-title">Resources</h4>
              <a href="https://pocketfm.com/subscription-terms-of-use">Subscriptions</a>
              <a href="https://pocketfm.com/security-advice-policy">Security</a>
              <a href="mailto:security@pocketfm.com">Contact</a>
            </div>
            <div className="footer-col">
              <h4 className="footer-col-title">Legal</h4>
              <a href="https://pocketfm.com/us/privacy-policy">Privacy Policy</a>
              <a href="https://pocketfm.com/us/terms-and-conditions">Terms</a>
              <a href="https://pocketfm.com/personnel-privacy-policy">Personnel Privacy</a>
            </div>
          </nav>
        </div>

        <div className="footer-bottom">
          <p>&copy; 2026 Pocket Entertainment Pvt Ltd</p>
        </div>
      </footer>

    </>
  );
}
