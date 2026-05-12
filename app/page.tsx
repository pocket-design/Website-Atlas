import { HeroAdapter, LocaleCascade } from '@/components/AdaptationFlow';
import BentoGraphic from '@/components/BentoGraphic';
import InteractiveGlobe from '@/components/InteractiveGlobe';
import BentoHeader from '@/components/BentoHeader';
import StoryCTAHeader from '@/components/StoryCTAHeader';
import RoughUnderline from '@/components/RoughUnderline';
import CountUp from '@/components/CountUp';
import NavBar from '@/components/NavBar';
import TryItSection from '@/components/TryItSection';
import HeroBg from '@/components/HeroBg';

export default function Home() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Atlas by Pocket',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web',
    description:
      'AI-powered story adaptation engine that adapts narratives for 100+ global locales while preserving emotional impact and cultural relevance.',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    creator: {
      '@type': 'Organization',
      name: 'Pocket Entertainment Pvt Ltd',
      url: 'https://pocketfm.com',
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />


      {/* NAV */}
      <NavBar />

      {/* FOLD 1 — HERO */}
      <section className="hero">
        <HeroBg />
        <div className="hero-eyebrow">Meet Atlas by Pocket</div>
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

      {/* FOLD — TRY IT (hidden for now, will become /try page) */}
      {/* <section id="try-it" className="try-it">
        <div className="section-header tryit-header">
          <h2 className="t-h3">Write it <RoughUnderline>once</RoughUnderline>,<br />adapt it for the world.</h2>
          <p className="tryit-desc">Paste your prose, pick a locale. Atlas adapts it in seconds.<br />Battle-tested over millions of words.</p>
        </div>
        <TryItSection />
      </section> */}

      {/* FOLD — BENTO */}
      <section id="how-it-works" className="bento">
        <div className="section-header">
          <BentoHeader />
        </div>

        <div className="bento-grid">
          <div className="bcell span-4">
            <BentoGraphic scene="transpose" />
            <h3 className="t-h4">Full cultural transposition, not translation</h3>
            <p className="t-body-sm">
              Names become culturally native. A corner store becomes a Späti in Berlin, a konbini in Tokyo, a duka in Nairobi. Food, humor, family dynamics, and street-level details are rebuilt from scratch. <strong>Readers never sense a foreign origin.</strong>
            </p>
          </div>
          <div className="bcell span-2">
            <BentoGraphic scene="knowledge" />
            <h3 className="t-h4">Supports insanely long prose</h3>
            <p className="t-body-sm">
              Thousands of words, hundreds of episodes, entire seasons. <strong>Atlas stays perfectly consistent from first page to last.</strong>
            </p>
          </div>
          <div className="bcell span-3">
            <BentoGraphic scene="strategy" />
            <h3 className="t-h4">Strategy-first architecture</h3>
            <p className="t-body-sm">
              Before changing a single word, Atlas generates a full strategy: tone, naming rules, geographic mappings. <strong>One document governs every downstream decision.</strong>
            </p>
          </div>
          <div className="bcell span-3">
            <BentoGraphic scene="triage" />
            <h3 className="t-h4">Fully genre-aware</h3>
            <p className="t-body-sm">
              Atlas reads your genre and adapts accordingly. Humor lands differently in comedy, tension builds differently in suspense, intimacy shifts in romance. <strong>A romance adapts differently from a thriller.</strong>
            </p>
          </div>
          <div className="bcell" style={{gridColumn: 'span 2'}}>
            <BentoGraphic scene="validation" />
            <h3 className="t-h4">Self-healing validation</h3>
            <p className="t-body-sm">
              A verification pass flags conflicts and cultural mixing. <strong>Only broken items are surgically regenerated.</strong>
            </p>
          </div>
          <div className="bcell" style={{gridColumn: 'span 4'}}>
            <BentoGraphic scene="graph" />
            <h3 className="t-h4">Deep knowledge of dependencies</h3>
            <p className="t-body-sm">
              Every story is a web of interconnected decisions. A character's workplace depends on their city, their title depends on local hierarchy, their nickname depends on their name. Atlas maps these dependencies and resolves them in the right order. <strong>One change cascades correctly across the entire story.</strong>
            </p>
          </div>
        </div>
      </section>

      {/* FOLD 3 — BATTLE-TESTED */}
      <section id="proof" className="proof-section">
        <div className="section-header">
          <h2 className="t-h3">Battle-tested at global scale.</h2>
        </div>

        <div className="proof-grid">
          <div className="proof-card proof-card-hero">
            <div className="proof-hero-left">
              <span className="proof-hero-number"><CountUp end={50} /><span className="proof-hero-pct">%</span></span>
              <span className="proof-hero-label">better retention</span>
            </div>
            <div className="proof-hero-right">
              <h3 className="t-h4">Adaptation performs significantly better than translation</h3>
              <p className="t-body-sm">Atlas rebuilds the cultural fabric so stories feel native. Higher engagement, longer listen times, growing revenue.</p>
              <ul className="proof-hero-stats">
                <li><svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2.5 7.5L5.5 10.5L11.5 3.5" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg><strong>600+</strong> AI-adapted shows across drama, romance, crime, fantasy</li>
                <li><svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2.5 7.5L5.5 10.5L11.5 3.5" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg><strong>8</strong> language markets live including US, UK, Europe, LATAM, India</li>
                <li><svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2.5 7.5L5.5 10.5L11.5 3.5" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg><strong>$20.5M+</strong> lifetime revenue from adapted content</li>
                <li><svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2.5 7.5L5.5 10.5L11.5 3.5" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg><strong>36 shows in 4 months</strong> scaled for Germany alone after launch</li>
              </ul>
            </div>
          </div>
          <div className="proof-card">
            <div className="proof-stat"><CountUp end={10000} suffix="+" /></div>
            <h3 className="t-h4">Stories adapted</h3>
            <p className="t-body-sm">
              From short fiction to 200-chapter epics. Every genre, every length.
            </p>
          </div>
          <div className="proof-card">
            <div className="proof-stat"><CountUp end={14} /></div>
            <h3 className="t-h4">Locale-pairs supported</h3>
            <p className="t-body-sm">
              Deep cultural intelligence, not just language swaps.
            </p>
          </div>
          <div className="proof-card">
            <div className="proof-stat"><CountUp end={99.2} suffix="%" decimals={1} /></div>
            <h3 className="t-h4">Consistency score</h3>
            <p className="t-body-sm">
              Names, relationships, and references stay coherent across every chapter.
            </p>
          </div>
        </div>
      </section>

      {/* FOLD 4 — HAVE A STORY */}
      <section id="writers" className="story-cta">
        <StoryCTAHeader />

        <div className="show-grid">
          <div className="show-card">
            <img src="/thumbnails/thumb-01.jpg" alt="" className="show-card-thumb" />
            <div className="show-card-info">
              <h3 className="t-h4">A Deal With The Duke</h3>
              <span className="show-card-sub">Adapted from English to 3 locales</span>
              <p className="t-body-sm">A regency romance that became a cultural phenomenon. 562M plays and $28M earned across all locales.</p>
            </div>
          </div>
          <div className="show-card show-card-adaptations">
            <div className="show-adapt-thumb">
              <img src="/thumbnails/thumb-01.jpg" alt="" />
              <span className="show-adapt-pill"><span className="locale-flag fi fi-de" />German</span>
            </div>
            <div className="show-adapt-thumb">
              <img src="/thumbnails/thumb-01.jpg" alt="" />
              <span className="show-adapt-pill"><span className="locale-flag fi fi-fr" />French</span>
            </div>
            <div className="show-adapt-thumb">
              <img src="/thumbnails/thumb-01.jpg" alt="" />
              <span className="show-adapt-pill"><span className="locale-flag fi fi-es" />Spanish</span>
            </div>
          </div>
          <div className="show-card">
            <img src="/thumbnails/thumb-03.jpg" alt="" className="show-card-thumb" />
            <div className="show-card-info">
              <h3 className="t-h4">Badge of Vengeance</h3>
              <span className="show-card-sub">Adapted from English to 2 locales</span>
              <p className="t-body-sm">A crime thriller spanning 200+ episodes with region-specific plot adaptations. 340M plays and $19M earned.</p>
            </div>
          </div>
          <div className="show-card show-card-adaptations">
            <div className="show-adapt-thumb">
              <img src="/thumbnails/thumb-03.jpg" alt="" />
              <span className="show-adapt-pill"><span className="locale-flag fi fi-in" />Hindi</span>
            </div>
            <div className="show-adapt-thumb">
              <img src="/thumbnails/thumb-03.jpg" alt="" />
              <span className="show-adapt-pill"><span className="locale-flag fi fi-br" />Portuguese</span>
            </div>
          </div>
          <div className="show-card">
            <img src="/thumbnails/thumb-14.jpg" alt="" className="show-card-thumb" />
            <div className="show-card-info">
              <h3 className="t-h4">The House That Lived</h3>
              <span className="show-card-sub">Adapted from English to 3 locales</span>
              <p className="t-body-sm">Fantasy horror with mythology rebuilt from scratch for each locale. 410M plays and $22M earned globally.</p>
            </div>
          </div>
          <div className="show-card show-card-adaptations">
            <div className="show-adapt-thumb">
              <img src="/thumbnails/thumb-14.jpg" alt="" />
              <span className="show-adapt-pill"><span className="locale-flag fi fi-jp" />Japanese</span>
            </div>
            <div className="show-adapt-thumb">
              <img src="/thumbnails/thumb-14.jpg" alt="" />
              <span className="show-adapt-pill"><span className="locale-flag fi fi-ke" />Swahili</span>
            </div>
            <div className="show-adapt-thumb">
              <img src="/thumbnails/thumb-14.jpg" alt="" />
              <span className="show-adapt-pill"><span className="locale-flag fi fi-it" />Italian</span>
            </div>
          </div>
          <div className="show-card">
            <img src="/thumbnails/thumb-18.jpg" alt="" className="show-card-thumb" />
            <div className="show-card-info">
              <h3 className="t-h4">Beneath a Broken Sky</h3>
              <span className="show-card-sub">Adapted from English to 2 locales</span>
              <p className="t-body-sm">Epic fantasy spanning 300+ chapters with world-building adapted for local audiences. 470M plays and $25M earned.</p>
            </div>
          </div>
          <div className="show-card show-card-adaptations">
            <div className="show-adapt-thumb">
              <img src="/thumbnails/thumb-18.jpg" alt="" />
              <span className="show-adapt-pill"><span className="locale-flag fi fi-de" />German</span>
            </div>
            <div className="show-adapt-thumb">
              <img src="/thumbnails/thumb-18.jpg" alt="" />
              <span className="show-adapt-pill"><span className="locale-flag fi fi-fr" />French</span>
            </div>
          </div>
        </div>

        <button type="button" className="btn-brand story-cta-btn">Try your story</button>

        <div className="social-proof">
          <p className="social-proof-text">Atlas is free to try.</p>
        </div>
      </section>

      {/* FOLD 4 — FINAL CTA */}
      {/* FOOTER */}
      <footer>
        <div className="footer-inner">
          <div className="footer-brand">
            <div className="footer-brand-top">
              <div className="footer-logo" aria-label="Pocket">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/assets/pocket-logo.svg" alt="Pocket" />
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
          <span>Pocket Entertainment Pvt Ltd.</span>
          <span>&copy; 2026 All rights reserved.</span>
        </div>
      </footer>

    </>
  );
}
