import type { ReactNode } from 'react';

const TESTIMONIALS: { name: string; locale: string; flag: string; avatar: string; quote: ReactNode }[] = [
  {
    name: 'Daniele Grassetti',
    locale: 'Italy',
    flag: 'fi-it',
    avatar: '/assets/testimonials/daniele-grassetti.png',
    quote: <><strong>Atlas</strong> significantly accelerated and refined the DE→IT adaptation process. The Italian dialogue feels natural, the pacing is improved, and the tone and intent of the German original are well preserved. It saves a considerable amount of time <strong>without compromising quality</strong>.</>,
  },
  {
    name: 'Blaine Axel Knight',
    locale: 'United States',
    flag: 'fi-us',
    avatar: '/assets/testimonials/blaine-axel-knight.png',
    quote: <><strong>Atlas</strong> handled cultural references, character dynamics, and setting changes thoughtfully while preserving the core story. What would normally require extensive rewriting and research became a <strong>much more streamlined process</strong>.</>,
  },
  {
    name: 'Mallika',
    locale: 'India',
    flag: 'fi-in',
    avatar: '/assets/testimonials/mallika.png',
    quote: <>The standout feature was its adaptation capability. It transformed my Korean script into an American setting, handling names, locations, and cultural nuances that would have otherwise required <strong>considerable manual effort</strong>.</>,
  },
  {
    name: 'Francis Nief',
    locale: 'France',
    flag: 'fi-fr',
    avatar: '/assets/testimonials/francis-nief.png',
    quote: <><strong>Atlas</strong> helped me quickly access precise information about the show&apos;s complex universe, making the French localization richer and more coherent. It supported the process <strong>without limiting creativity</strong>.</>,
  },
];

function AuthorBlock({ t }: { t: typeof TESTIMONIALS[0] }) {
  return (
    <div className="t-author-block">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="testimonial-card__avatar" src={t.avatar} alt={t.name} />
      <div className="testimonial-card__meta">
        <strong className="testimonial-card__name">{t.name}</strong>
        <span className="testimonial-card__locale">
          <span className={`locale-flag fi ${t.flag}`} aria-hidden="true" /> Writer from {t.locale}
        </span>
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
                    <AuthorBlock t={t} />
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
                    <AuthorBlock t={t} />
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
