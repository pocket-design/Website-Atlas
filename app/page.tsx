import { HeroAdapter, LocaleCascade } from '@/components/AdaptationFlow';
import BentoGraphic from '@/components/BentoGraphic';
import InteractiveGlobe from '@/components/InteractiveGlobe';
import ThumbnailGrid from '@/components/ThumbnailGrid';
import BentoHeader from '@/components/BentoHeader';
import StoryCTAHeader from '@/components/StoryCTAHeader';
import RoughUnderline from '@/components/RoughUnderline';
import CountUp from '@/components/CountUp';
import NavBar from '@/components/NavBar';
import TryItSection from '@/components/TryItSection';

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
          Incredibly powerful story{' '}
          <RoughUnderline delay={3000}>adaptation</RoughUnderline>{' '}
          <RoughUnderline delay={3150}>engine</RoughUnderline>{' '}
          for writers
        </h1>
        <HeroAdapter />
      </section>

      {/* FOLD 2 — Cascade: one English passage, five locales */}
      <section id="locale-cascade" className="cascade">
        <InteractiveGlobe />
        <LocaleCascade />
      </section>

      {/* FOLD — TRY IT */}
      <section id="try-it" className="try-it">
        <div className="section-header">
          <h2 className="t-h3">Write it <RoughUnderline>once</RoughUnderline>,<br />adapt it for the world.</h2>
        </div>
        <TryItSection />
      </section>

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
            <h3 className="t-h4">Knowledge graph memory</h3>
            <p className="t-body-sm">
              Every character and relationship tracked across hundreds of chapters. <strong>Chapter 40 stays consistent with chapter 1.</strong>
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
          <div className="proof-card">
            <div className="proof-stat"><CountUp end={10000} suffix="+" /></div>
            <h3 className="t-h4">Stories adapted</h3>
            <p className="t-body-sm">
              From short fiction to 200-chapter epics. Every genre, every length.
            </p>
          </div>
          <div className="proof-card">
            <div className="proof-stat"><CountUp end={50} suffix="+" /></div>
            <h3 className="t-h4">Locales supported</h3>
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
              Global distribution puts your work in front of new audience everywhere.
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

        <button type="button" className="btn-brand story-cta-btn">Start writing</button>

        <div className="social-proof">
          <div className="avatar-stack">
            <img src="https://randomuser.me/api/portraits/women/44.jpg" alt="" />
            <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="" />
            <img src="https://randomuser.me/api/portraits/women/68.jpg" alt="" />
            <img src="https://randomuser.me/api/portraits/men/75.jpg" alt="" />
            <img src="https://randomuser.me/api/portraits/women/90.jpg" alt="" />
          </div>
          <p className="social-proof-text">Join 50,000+ happy writers on Pocket</p>
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
          <p>&copy; 2026 Pocket Entertainment Pvt Ltd</p>
        </div>
      </footer>

    </>
  );
}
