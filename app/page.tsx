import HeroBgWithDialKit from '@/components/HeroBgWithDialKit';
import HeroAdapter from '@/components/HeroAdapter';
import { LocaleCascade, CascadeBranches } from '@/components/LocaleCascade';
import RevealOnScroll from '@/components/RevealOnScroll';
import NavBar from '@/components/NavBar';
import AtlasBento from '@/components/AtlasBento';
import Proof from '@/components/Proof';
import Testimonials from '@/components/Testimonials';

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
        <div className="hero-eyebrow">Meet Atlas by Pocket</div>
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

      {/* FOLD 2 — ATLAS BENTO (feature cards) */}
      <AtlasBento />

      {/* FOLD 3 — PROOF (ported from hardik) */}
      <Proof />

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
