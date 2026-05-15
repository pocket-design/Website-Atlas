import type { ReactNode } from 'react';

const TESTIMONIALS: { name: string; locale: string; avatarBg: string; initials: string; quote: ReactNode }[] = [
  {
    name: 'Kathrin Corpataux',
    locale: 'Germany',
    avatarBg: '#C8B99A',
    initials: 'KC',
    quote: <>The cultural audit caught the small things I would have flattened in translation. Its substitution prompts helped me rebuild scenes around American rhythms without losing <strong>the story&apos;s quiet German interiority</strong>.</>,
  },
  {
    name: 'Priya Venkataraman',
    locale: 'India',
    avatarBg: '#B5C4B1',
    initials: 'PV',
    quote: <><strong>Atlas</strong> understood that my protagonist&apos;s relationship with her mother in law carries entirely different weight in an Indian context versus a Western one. It <strong>rebuilt those scenes from the inside out</strong>.</>,
  },
  {
    name: 'Yuki Tanaka',
    locale: 'Japan',
    avatarBg: '#A8BDD1',
    initials: 'YT',
    quote: <>Honorifics, gifting scenes, the weight of silence between characters. <strong>Atlas</strong> mapped all of it onto equivalents that English readers would <strong>feel rather than just read</strong>.</>,
  },
  {
    name: 'Sophie Laurent',
    locale: 'France',
    avatarBg: '#C4B5C8',
    initials: 'SL',
    quote: <>In French romance, restraint is everything. <strong>Atlas</strong> knows that. The English version it produced <strong>never overexplained what should be left unspoken</strong>, and the audience retention data proved it.</>,
  },
];

function AuthorBlock({ t, avatarBg }: { t: typeof TESTIMONIALS[0]; avatarBg: string }) {
  return (
    <div className="t-author-block">
      <div className="testimonial-card__avatar" style={{ background: avatarBg }} aria-hidden="true">
        {t.initials}
      </div>
      <div className="testimonial-card__meta">
        <strong className="testimonial-card__name">{t.name}</strong>
        <span className="testimonial-card__locale">Writer from {t.locale}</span>
      </div>
    </div>
  );
}

export default function Testimonials() {
  return (
    <section id="testimonials" className="testimonials">
      <div className="section-header">
        <h2 className="t-h3">What the writers from around the world say about Atlas.</h2>
      </div>
      <div className="testimonials-rows">
        {TESTIMONIALS.map((t, i) => {
          const isEven = i % 2 === 0;
          return (
            <article key={i} className={`t-row ${isEven ? 't-row--a' : 't-row--b'}`}>
              {isEven ? (
                <>
                  <div className="t-row__author">
                    <AuthorBlock t={t} avatarBg={t.avatarBg} />
                  </div>
                  <div className="t-row__quote">
                    <blockquote className="t-quote">&ldquo;{t.quote}&rdquo;</blockquote>
                  </div>
                </>
              ) : (
                <>
                  <div className="t-row__quote">
                    <blockquote className="t-quote">&ldquo;{t.quote}&rdquo;</blockquote>
                  </div>
                  <div className="t-row__author">
                    <AuthorBlock t={t} avatarBg={t.avatarBg} />
                  </div>
                </>
              )}
            </article>
          );
        })}
      </div>
      <div className="testimonials-cta">
        <a href="/playground" className="btn-brand">Try your story</a>
        <p className="social-proof-text">Atlas is free to try.</p>
      </div>
    </section>
  );
}
