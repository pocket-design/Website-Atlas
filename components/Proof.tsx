/**
 * Proof — "Battle-tested at global scale." section.
 *
 * Ported from the hardik branch (originally inline JSX in app/page.tsx
 * lines 188–235). Lifted into its own component to match main's
 * one-component-per-section pattern.
 *
 * Layout:
 *   • Top hero card: big 50% stat + 3 supporting bullet stats
 *   • Bottom row: 3 metric items (Stories adapted / Locale-pairs / Consistency)
 *
 * Numbers animate from 0 on scroll-into-view via <CountUp>.
 */

import CountUp from '@/components/CountUp';

const TICK = (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
    <path
      d="M2.5 7.5L5.5 10.5L11.5 3.5"
      stroke="#22c55e"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default function Proof() {
  return (
    <section id="proof" className="proof-section">
      <div className="section-header">
        <h2 className="t-h3">Battle-tested at global scale.</h2>
      </div>

      {/* TOP — full-width hero card */}
      <div className="proof-grid">
        <div className="proof-card proof-card-hero">
          <div className="proof-hero-left">
            <span className="proof-hero-number">
              <CountUp end={50} />
              <span className="proof-hero-pct">%</span>
            </span>
            <span className="proof-hero-label">better retention</span>
          </div>

          <div className="proof-hero-right">
            <h3 className="t-h4">
              Adaptation performs significantly better than translation
            </h3>
            <p className="t-body-sm">
              Atlas rebuilds the cultural fabric so stories feel native.
              Higher engagement, longer listen times, growing revenue.
            </p>
            <ul className="proof-hero-stats">
              <li>
                {TICK}
                <strong>600+</strong> AI-adapted shows across drama, romance,
                crime, fantasy
              </li>
              <li>
                {TICK}
                <strong>8</strong> language markets live including US, UK,
                Europe, LATAM, India
              </li>
              <li>
                {TICK}
                <strong>$20.5M+</strong> lifetime revenue from adapted content
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* BOTTOM — 3 metric columns */}
      <div className="proof-metrics-row">
        <div className="proof-metric-item">
          <div className="proof-stat">
            <CountUp end={10000} suffix="+" />
          </div>
          <h3 className="t-h4">Stories adapted</h3>
          <p className="t-body-sm">
            From short fiction to 200-chapter epics. Every genre, every length.
          </p>
        </div>

        <div className="proof-metric-item">
          <div className="proof-stat">
            <CountUp end={14} />
          </div>
          <h3 className="t-h4">Locale-pairs supported</h3>
          <p className="t-body-sm">
            Deep cultural intelligence, not just language swaps.
          </p>
        </div>

        <div className="proof-metric-item">
          <div className="proof-stat">
            <CountUp end={99.2} suffix="%" decimals={1} />
          </div>
          <h3 className="t-h4">Consistency score</h3>
          <p className="t-body-sm">
            Names, relationships, and references stay coherent across every
            chapter.
          </p>
        </div>
      </div>
    </section>
  );
}
