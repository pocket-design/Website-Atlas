import HeroBgWithDialKit from '@/components/HeroBgWithDialKit';
import HeroAdapter from '@/components/HeroAdapter';
import { LocaleCascade, CascadeBranches } from '@/components/LocaleCascade';
import RevealOnScroll from '@/components/RevealOnScroll';
import NavBar from '@/components/NavBar';
import AtlasBento from '@/components/AtlasBento';
import Proof from '@/components/Proof';
import Testimonials from '@/components/Testimonials';
import DraggableMagnets from '@/components/DraggableMagnets';

export default function Home() {
  return (
    <>
      {/* NAV */}
      <NavBar />

      {/* FOLD 1 — HERO + nested LOCALE CASCADE
           The cascade is nested inside .hero so its branches and locale
           cards render over the dial-kit hero background (which lives at
           the top 100vh of .hero via .hero-bg-wrap). The cascade content
           that extends past 100vh transitions onto the body's vellum bg. */}
      <section className="hero">
        <HeroBgWithDialKit />
        <div className="hero-eyebrow">Take your story global with Atlas</div>
        <h1 className="t-display hero-title">
          Incredibly powerful story adaptation engine for writers
        </h1>
        <HeroAdapter />
        {/* 12px below adapt-flow */}
        <CascadeBranches />
        {/* 12px below cascade branches */}
        <section id="locale-cascade" className="cascade">
          <div className="cascade__wrap">
            <LocaleCascade />
          </div>
        </section>
      </section>

      {/* FOLD — HAVE YOUR OWN STORY (ported from hardik) */}
      <section className="story-cta-section">
        <div className="section-header">
          <h2 className="t-h3">Have your own story?</h2>
        </div>

        <div className="story-bento-wrap">
          <div className="story-bento-grid">
            <div className="story-bento-cell">
              <h3 className="t-h4">Paste your story</h3>
              <p className="t-body-sm">Drop in your prose. Short fiction, a full chapter, or an entire season of scripts. Any length, any genre.</p>
            </div>
            <div className="story-bento-cell">
              <h3 className="t-h4">Pick your locales</h3>
              <p className="t-body-sm">Choose from 14 locale-pairs. Each carries deep cultural intelligence built from thousands of adapted stories.</p>
            </div>
            <div className="story-bento-cell">
              <h3 className="t-h4">Atlas adapts it</h3>
              <p className="t-body-sm">Names, places, food, idioms, humor. Every cultural thread is rebuilt so the story feels native to its new audience.</p>
            </div>
            <div className="story-bento-cell">
              <h3 className="t-h4">Tweak and ship</h3>
              <p className="t-body-sm">Review the adaptation, adjust any mappings, then export. Your story is ready for a new market.</p>
            </div>
            <DraggableMagnets />
          </div>
        </div>

        <div className="story-cta-action">
          <a href="/playground?from=en&to=in" className="btn btn-secondary story-cta-btn">
            <span className="locale-flag fi fi-us" /> English
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M3 8h10M9 4l4 4-4 4" /></svg>
            <span className="locale-flag fi fi-in" /> Hindi
          </a>
          <a href="/playground?from=en&to=de" className="btn btn-secondary story-cta-btn">
            <span className="locale-flag fi fi-us" /> English
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M3 8h10M9 4l4 4-4 4" /></svg>
            <span className="locale-flag fi fi-de" /> German
          </a>
          <a href="/playground?from=en&to=es" className="btn btn-secondary story-cta-btn">
            <span className="locale-flag fi fi-us" /> English
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M3 8h10M9 4l4 4-4 4" /></svg>
            <span className="locale-flag fi fi-es" /> Spanish
          </a>
        </div>
      </section>

      {/* FOLD 2 — ATLAS BENTO (feature cards) */}
      <AtlasBento />

      {/* FOLD 3 — PROOF (ported from hardik) */}
      <Proof />

      {/* FOLD 4 — TESTIMONIALS */}
      <Testimonials />

      {/* FOLD 5 — FINAL CTA */}
      <section className="final-cta">
        <h2 className="t-h3">
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

      {/* FOOTER — multi-column dark band ported from hardik */}
      <footer>
        <div className="footer-inner">
          <div className="footer-brand">
            <div className="footer-brand-top">
              <div className="footer-logo" aria-label="Pocket">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/assets/pocket-logo.svg" alt="Pocket" />
              </div>
              <p className="footer-byline">
                Home of the world&apos;s stories.
              </p>
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
              <a href="https://jobs.weekday.works/pocket-fm-careers-at-pocket-fm">
                Careers
              </a>
            </div>
            <div className="footer-col">
              <h4 className="footer-col-title">Resources</h4>
              <a href="https://pocketfm.com/subscription-terms-of-use">
                Subscriptions
              </a>
              <a href="https://pocketfm.com/security-advice-policy">Security</a>
              <a href="mailto:security@pocketfm.com">Contact</a>
            </div>
            <div className="footer-col">
              <h4 className="footer-col-title">Legal</h4>
              <a href="https://pocketfm.com/us/privacy-policy">Privacy Policy</a>
              <a href="https://pocketfm.com/us/terms-and-conditions">Terms</a>
              <a href="https://pocketfm.com/personnel-privacy-policy">
                Personnel Privacy
              </a>
            </div>
          </nav>
        </div>

        <div className="footer-bottom">
          <span>Pocket Entertainment Pvt Ltd.</span>
          <span>&copy; 2026 All rights reserved.</span>
        </div>
      </footer>

      <RevealOnScroll />
    </>
  );
}
