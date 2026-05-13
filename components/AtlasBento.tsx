'use client';

/**
 * AtlasBento — 6-card bento feature section.
 * Layout: 4-col × 3-row grid with varied card shapes.
 *   Card 1 — 2 col × 2 row  (large landscape, has image)
 *   Card 2 — 1 col × 1 row  (square)
 *   Card 3 — 1 col × 2 row  (tall portrait)
 *   Card 4 — 1 col × 1 row  (square)
 *   Card 5 — 2 col × 1 row  (wide rectangle)
 *   Card 6 — 2 col × 1 row  (wide rectangle)
 * No click/expand. No tilt. Pure static bento.
 */

// ── Card data ─────────────────────────────────────────────────────────────────
interface BentoCard {
  id: string;
  heading: string;
  body: string;
  gridColumn: string;
  gridRow: string;
  bg: string;
  img?: string;
}

const CARDS: BentoCard[] = [
  {
    id: 'atlas-bento-1',
    heading: 'Full cultural transposition, not translation',
    body: 'Names become culturally native. A corner store becomes a Späti in Berlin, a konbini in Tokyo, a duka in Nairobi. Food, humor, family dynamics and street-level details are rebuilt from scratch. Readers never sense a foreign origin.',
    gridColumn: '1 / 3',
    gridRow: '1 / 3',
    bg: 'linear-gradient(145deg, #FF8C3A 0%, #F51D00 45%, #1C1C1C 100%)',
    img: '/assets/bento-cultural-transposition.png',
  },
  {
    id: 'atlas-bento-2',
    heading: 'Supports insanely long prose',
    body: 'Thousands of words, hundreds of episodes, entire seasons. Atlas stays perfectly consistent from first page to last.',
    gridColumn: '3 / 4',
    gridRow: '1 / 2',
    bg: 'linear-gradient(145deg, #1C1C1C 0%, #383838 100%)',
    img: '/assets/bento-long-prose.png',
  },
  {
    id: 'atlas-bento-3',
    heading: 'Strategy-first architecture',
    body: 'Before changing a single word, Atlas generates a full strategy: tone, naming rules, geographic mappings. One document governs every downstream decision.',
    gridColumn: '4 / 5',
    gridRow: '1 / 3',
    bg: 'linear-gradient(145deg, #92400E 0%, #D97706 100%)',
    img: '/assets/bento-strategy-first.png',
  },
  {
    id: 'atlas-bento-4',
    heading: 'Fully genre-aware',
    body: 'Atlas reads your genre and adapts accordingly. Humor lands differently in comedy, tension builds differently in suspense, intimacy shifts in romance.',
    gridColumn: '3 / 4',
    gridRow: '2 / 3',
    bg: 'linear-gradient(145deg, #374151 0%, #111827 100%)',
  },
  {
    id: 'atlas-bento-5',
    heading: 'Self-healing validation',
    body: 'A verification pass flags conflicts and cultural mixing. Only broken items are surgically regenerated.',
    gridColumn: '1 / 3',
    gridRow: '3 / 4',
    bg: 'linear-gradient(145deg, #7C2D12 0%, #F51D00 100%)',
  },
  {
    id: 'atlas-bento-6',
    heading: 'Deep knowledge of dependencies',
    body: "Every story is a web of interconnected decisions. A character's workplace, title, nickname — Atlas maps all dependencies and resolves them in the right order.",
    gridColumn: '3 / 5',
    gridRow: '3 / 4',
    bg: 'linear-gradient(145deg, #1C1C1C 0%, #B71500 100%)',
  },
];

// ── Blur layer config ─────────────────────────────────────────────────────────
const BLUR_LAYERS = [
  ['atlas-bento__blur atlas-bento__blur--wide',   '65%', '2px' ],
  ['atlas-bento__blur atlas-bento__blur--mid',    '44%', '8px' ],
  ['atlas-bento__blur atlas-bento__blur--tight',  '28%', '20px'],
] as const;

// ── Main component ────────────────────────────────────────────────────────────
export default function AtlasBento() {
  return (
    <section className="atlas-bento">
      <div className="atlas-bento__header">
        <h2 className="t-h2 atlas-bento__section-heading">
          Atlas adapts your story better than any general-purpose LLMs.
        </h2>
      </div>

      <div className="atlas-bento__wrap">
        <div className="atlas-bento__grid">
          {CARDS.map((card) => (
            <div
              key={card.id}
              className="atlas-bento__card"
              style={{ gridColumn: card.gridColumn, gridRow: card.gridRow }}
            >
              {/* Background */}
              {card.img ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  className="atlas-bento__bg atlas-bento__bg--img"
                  src={card.img}
                  alt=""
                  aria-hidden="true"
                />
              ) : (
                <div
                  className="atlas-bento__bg"
                  style={{ background: card.bg }}
                  aria-hidden="true"
                />
              )}

              {/* Progressive blur layers */}
              {BLUR_LAYERS.map(([cls]) => (
                <div key={cls} className={cls} aria-hidden="true" />
              ))}

              {/* Vignette */}
              <div className="atlas-bento__vignette" aria-hidden="true" />

              {/* Text */}
              <div className="atlas-bento__content">
                <h3 className="t-h4 atlas-bento__heading">{card.heading}</h3>
                <p className="t-body-sm atlas-bento__body">{card.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
