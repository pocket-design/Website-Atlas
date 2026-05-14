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
import DraggableMagnets from '@/components/DraggableMagnets';
import Testimonials from '@/components/Testimonials';
import BentoHeroRow from '@/components/BentoHeroRow';

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
        <div className="hero-copy-wrap">
          <div className="hero-puff" aria-hidden="true" />
          <div className="hero-eyebrow">Take your story global with Atlas</div>
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
        </div>
        <HeroAdapter />
      </section>

      {/* FOLD 2 — Cascade: one English passage, five locales */}
      <section id="locale-cascade" className="cascade">
        <LocaleCascade />
      </section>

      {/* FOLD — HAVE YOUR OWN STORY */}
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
            <span className="locale-flag fi fi-us" /> English <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 8h10M9 4l4 4-4 4" /></svg> <span className="locale-flag fi fi-in" /> Hindi
          </a>
          <a href="/playground?from=en&to=de" className="btn btn-secondary story-cta-btn">
            <span className="locale-flag fi fi-us" /> English <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 8h10M9 4l4 4-4 4" /></svg> <span className="locale-flag fi fi-de" /> German
          </a>
          <a href="/playground?from=en&to=es" className="btn btn-secondary story-cta-btn">
            <span className="locale-flag fi fi-us" /> English <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 8h10M9 4l4 4-4 4" /></svg> <span className="locale-flag fi fi-es" /> Spanish
          </a>
        </div>
      </section>

      {/* FOLD — BENTO */}

      <section id="how-it-works" className="bento">
        <div className="section-header">
          <BentoHeader />
        </div>

        <BentoHeroRow />
        <div className="bento-grid">
          <div className="bcell span-3">
            <BentoGraphic scene="triage" />
            <h3 className="t-h4">Fully genre-aware</h3>
            <p className="t-body-sm">
              Atlas reads your genre and adapts accordingly. Humor lands differently in comedy, tension builds differently in suspense, intimacy shifts in romance. <strong>A romance adapts differently from a thriller.</strong>
            </p>
          </div>
          <div className="bcell span-3">
            <BentoGraphic scene="graph" />
            <h3 className="t-h4">Deep knowledge of dependencies</h3>
            <p className="t-body-sm">
              Every story is a web of interconnected decisions. Atlas maps them and resolves each one in the right order. <strong>One change cascades correctly across the entire story.</strong>
            </p>
          </div>
        </div>
      </section>

      {/* FOLD — BLOCKBUSTERS */}
      <section id="writers" className="story-cta">
        <StoryCTAHeader />

        <div className="show-grid">
          {/* My Vampire System — 21.3M playtime */}
          <div className="show-card">
            <a className="show-card-thumb-wrap" href="https://pocketfm.com/show/a2fa57d4cb8267b2645f2b588c39951fbf65093a" target="_blank" rel="noopener">
              <img src="/thumbnails/shows/my-vampire-system.webp" alt="" className="show-card-thumb" />
              <span className="show-thumb-play" aria-hidden="true">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polygon points="5 3 19 12 5 21 5 3" /></svg>
              </span>
            </a>
            <div className="show-card-info">
              <h3 className="t-h4">My Vampire System</h3>
              <div className="show-tags">
                <span className="show-tag">Urban fantasy</span>
                <span className="show-tag">Vampires</span>
                <span className="show-tag">Power system</span>
              </div>
              <div className="show-stats">
                <span className="show-stat"><strong>2.1M</strong> listeners</span>
                <span className="show-stat-sep">·</span>
                <span className="show-stat"><strong>21.3M</strong> minutes played</span>
              </div>
            </div>
          </div>
          <div className="show-card show-card-adaptations">
            <a className="show-adapt-thumb" href="https://pocketfm.com/show/68f1083ce00e4ab5ec119818e92ac62e7c8e20c9" target="_blank" rel="noopener">
              <img src="/thumbnails/shows/my-vampire-system-es.webp" alt="El Código Del Vampiro" />
              <span className="show-adapt-pill"><span className="locale-flag fi fi-es" />Spanish</span>
              <span className="show-thumb-play" aria-hidden="true">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polygon points="5 3 19 12 5 21 5 3" /></svg>
              </span>
            </a>
            <a className="show-adapt-thumb" href="https://pocketfm.com/show/1b10e970f5837102b1d99e6e5fa98427372a5a41" target="_blank" rel="noopener">
              <img src="/thumbnails/shows/my-vampire-system-de.webp" alt="Das Vampirsystem" />
              <span className="show-adapt-pill"><span className="locale-flag fi fi-de" />German</span>
              <span className="show-thumb-play" aria-hidden="true">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polygon points="5 3 19 12 5 21 5 3" /></svg>
              </span>
            </a>
            <a className="show-adapt-thumb" href="https://pocketfm.com/show/d84923d9659f6241e8a6943e096ea74c16dc5abd" target="_blank" rel="noopener">
              <img src="/thumbnails/shows/my-vampire-system-fr.jpg" alt="Code Vampire" />
              <span className="show-adapt-pill"><span className="locale-flag fi fi-fr" />French</span>
              <span className="show-thumb-play" aria-hidden="true">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polygon points="5 3 19 12 5 21 5 3" /></svg>
              </span>
            </a>
          </div>

          {/* The Alpha's Bride — 14.6M playtime */}
          <div className="show-card">
            <a className="show-card-thumb-wrap" href="https://pocketfm.com/show/cbc35fa13bbe154873ec97f78f2b4cf4b66c7d31" target="_blank" rel="noopener">
              <img src="/thumbnails/shows/alphas-bride.webp" alt="" className="show-card-thumb" />
              <span className="show-thumb-play" aria-hidden="true">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polygon points="5 3 19 12 5 21 5 3" /></svg>
              </span>
            </a>
            <div className="show-card-info">
              <h3 className="t-h4">The Alpha&apos;s Bride</h3>
              <div className="show-tags">
                <span className="show-tag">Werewolf</span>
                <span className="show-tag">Romance</span>
                <span className="show-tag">Paranormal</span>
              </div>
              <div className="show-stats">
                <span className="show-stat"><strong>1.5M</strong> listeners</span>
                <span className="show-stat-sep">·</span>
                <span className="show-stat"><strong>14.6M</strong> minutes played</span>
              </div>
            </div>
          </div>
          <div className="show-card show-card-adaptations">
            <a className="show-adapt-thumb" href="https://pocketfm.com/show/3a195b6ec3953f6a70aae829d7b99b59eff91c9a" target="_blank" rel="noopener">
              <img src="/thumbnails/shows/alphas-bride-es.webp" alt="Una Luna Para Un Alfa" />
              <span className="show-adapt-pill"><span className="locale-flag fi fi-es" />Spanish</span>
              <span className="show-thumb-play" aria-hidden="true">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polygon points="5 3 19 12 5 21 5 3" /></svg>
              </span>
            </a>
            <a className="show-adapt-thumb" href="https://pocketfm.com/show/84528b8da9e2a026d4a04b73f0a744f2f01d5b1b" target="_blank" rel="noopener">
              <img src="/thumbnails/shows/alphas-bride-de.webp" alt="Vom Alpha Begehrt" />
              <span className="show-adapt-pill"><span className="locale-flag fi fi-de" />German</span>
              <span className="show-thumb-play" aria-hidden="true">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polygon points="5 3 19 12 5 21 5 3" /></svg>
              </span>
            </a>
            <a className="show-adapt-thumb" href="https://pocketfm.com/show/66b9c77ce99c2c1ff3060e9dc11e0245a9489e37" target="_blank" rel="noopener">
              <img src="/thumbnails/shows/alphas-bride-fr.jpg" alt="La Fiancée De l'Alpha" />
              <span className="show-adapt-pill"><span className="locale-flag fi fi-fr" />French</span>
              <span className="show-thumb-play" aria-hidden="true">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polygon points="5 3 19 12 5 21 5 3" /></svg>
              </span>
            </a>
          </div>

          {/* Saving Nora — 10.1M playtime */}
          <div className="show-card">
            <a className="show-card-thumb-wrap" href="https://pocketfm.com/show/33adb096b04ecd6b23ce9341160b199f2d489311" target="_blank" rel="noopener">
              <img src="/thumbnails/shows/saving-nora.webp" alt="" className="show-card-thumb" />
              <span className="show-thumb-play" aria-hidden="true">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polygon points="5 3 19 12 5 21 5 3" /></svg>
              </span>
            </a>
            <div className="show-card-info">
              <h3 className="t-h4">Saving Nora</h3>
              <div className="show-tags">
                <span className="show-tag">Family drama</span>
                <span className="show-tag">Slow burn</span>
                <span className="show-tag">Emotional</span>
              </div>
              <div className="show-stats">
                <span className="show-stat"><strong>1.4M</strong> listeners</span>
                <span className="show-stat-sep">·</span>
                <span className="show-stat"><strong>10.1M</strong> minutes played</span>
              </div>
            </div>
          </div>
          <div className="show-card show-card-adaptations">
            <a className="show-adapt-thumb" href="https://pocketfm.com/show/1f1318b281496d1abc92e811bb7052a1d821a20a" target="_blank" rel="noopener">
              <img src="/thumbnails/shows/saving-nora-es.webp" alt="Salvando a Nora" />
              <span className="show-adapt-pill"><span className="locale-flag fi fi-es" />Spanish</span>
              <span className="show-thumb-play" aria-hidden="true">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polygon points="5 3 19 12 5 21 5 3" /></svg>
              </span>
            </a>
            <a className="show-adapt-thumb" href="https://pocketfm.com/show/ce504962514be83e34b3b2c024473452d1eab47b" target="_blank" rel="noopener">
              <img src="/thumbnails/shows/saving-nora-de.webp" alt="Noras Geheimnis" />
              <span className="show-adapt-pill"><span className="locale-flag fi fi-de" />German</span>
              <span className="show-thumb-play" aria-hidden="true">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polygon points="5 3 19 12 5 21 5 3" /></svg>
              </span>
            </a>
            <a className="show-adapt-thumb" href="https://pocketfm.com/show/c5239b008e0cfb68b98a55da191e17dd019c4616" target="_blank" rel="noopener">
              <img src="/thumbnails/shows/saving-nora-fr.webp" alt="Le Secret De Nora" />
              <span className="show-adapt-pill"><span className="locale-flag fi fi-fr" />French</span>
              <span className="show-thumb-play" aria-hidden="true">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polygon points="5 3 19 12 5 21 5 3" /></svg>
              </span>
            </a>
          </div>

          {/* The Duke's Masked Bride — 7.9M playtime */}
          <div className="show-card">
            <a className="show-card-thumb-wrap" href="https://pocketfm.com/show/cd532605283eb73524e7a93c4f887f670a980c19" target="_blank" rel="noopener">
              <img src="/thumbnails/shows/dukes-masked-bride.webp" alt="" className="show-card-thumb" />
              <span className="show-thumb-play" aria-hidden="true">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polygon points="5 3 19 12 5 21 5 3" /></svg>
              </span>
            </a>
            <div className="show-card-info">
              <h3 className="t-h4">The Duke&apos;s Masked Bride</h3>
              <div className="show-tags">
                <span className="show-tag">Regency</span>
                <span className="show-tag">Romance</span>
                <span className="show-tag">Historical</span>
              </div>
              <div className="show-stats">
                <span className="show-stat"><strong>1.1M</strong> listeners</span>
                <span className="show-stat-sep">·</span>
                <span className="show-stat"><strong>7.9M</strong> minutes played</span>
              </div>
            </div>
          </div>
          <div className="show-card show-card-adaptations">
            <a className="show-adapt-thumb" href="https://pocketfm.com/show/dc3db01aaede9859b679931f15a6444a9b7743f6" target="_blank" rel="noopener">
              <img src="/thumbnails/shows/dukes-masked-bride-es.webp" alt="La Novia Enmascarada Del Marqués" />
              <span className="show-adapt-pill"><span className="locale-flag fi fi-es" />Spanish</span>
              <span className="show-thumb-play" aria-hidden="true">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polygon points="5 3 19 12 5 21 5 3" /></svg>
              </span>
            </a>
            <a className="show-adapt-thumb" href="https://pocketfm.com/show/f2850c5f071ff8b74eadaf90c05bf1d3036775ee" target="_blank" rel="noopener">
              <img src="/thumbnails/shows/dukes-masked-bride-de.webp" alt="Die maskierte Schönheit" />
              <span className="show-adapt-pill"><span className="locale-flag fi fi-de" />German</span>
              <span className="show-thumb-play" aria-hidden="true">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polygon points="5 3 19 12 5 21 5 3" /></svg>
              </span>
            </a>
            <a className="show-adapt-thumb" href="https://pocketfm.com/show/95e72b715f476626585302cefa3204714880ef81" target="_blank" rel="noopener">
              <img src="/thumbnails/shows/dukes-masked-bride-fr.png" alt="Beauté Masquée" />
              <span className="show-adapt-pill"><span className="locale-flag fi fi-fr" />French</span>
              <span className="show-thumb-play" aria-hidden="true">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polygon points="5 3 19 12 5 21 5 3" /></svg>
              </span>
            </a>
          </div>
        </div>

        <button type="button" className="btn-brand story-cta-btn">Try your story</button>

        <div className="social-proof">
          <p className="social-proof-text">Atlas is free to try.</p>
        </div>
      </section>

      {/* FOLD — BATTLE-TESTED */}
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
              </ul>
            </div>
          </div>
        </div>

        <div className="proof-metrics-row">
          <div className="proof-metric-item">
            <div className="proof-stat"><CountUp end={10000} suffix="+" /></div>
            <h3 className="t-h4">Stories adapted</h3>
            <p className="t-body-sm">
              From short fiction to 200-chapter epics. Every genre, every length.
            </p>
          </div>
          <div className="proof-metric-item">
            <div className="proof-stat"><CountUp end={14} /></div>
            <h3 className="t-h4">Locale-pairs supported</h3>
            <p className="t-body-sm">
              Deep cultural intelligence, not just language swaps.
            </p>
          </div>
          <div className="proof-metric-item">
            <div className="proof-stat"><CountUp end={99.2} suffix="%" decimals={1} /></div>
            <h3 className="t-h4">Consistency score</h3>
            <p className="t-body-sm">
              Names, relationships, and references stay coherent across every chapter.
            </p>
          </div>
        </div>
      </section>

      {/* FOLD — TESTIMONIALS */}
      <Testimonials />

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
