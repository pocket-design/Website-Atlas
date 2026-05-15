import type { ReactNode } from 'react';

const TESTIMONIALS: { name: string; locale: string; flag: string; avatar: string; quote: ReactNode }[] = [
  {
    name: 'Daniele Grassetti',
    locale: 'Italy',
    flag: 'fi-it',
    avatar: '/assets/testimonials/daniele-grassetti.png',
    quote: <><strong>Atlas significantly accelerated</strong> and refined the DE→IT adaptation process. The Italian dialogue feels natural, the pacing is improved, and the tone and intent of the German original are well preserved. It saves a considerable amount of time without compromising quality.</>,
  },
  {
    name: 'Blaine Axel Knight',
    locale: 'United States',
    flag: 'fi-us',
    avatar: '/assets/testimonials/blaine-axel-knight.png',
    quote: <><strong>Atlas handled cultural references,</strong> character dynamics, and setting changes thoughtfully while preserving the core story. What would normally require extensive rewriting and research became a much more streamlined process.</>,
  },
  {
    name: 'Mallika',
    locale: 'India',
    flag: 'fi-in',
    avatar: '/assets/testimonials/mallika.png',
    quote: <><strong>Atlas transformed my Korean script</strong> into an American setting, handling names, locations, and cultural nuances that would have otherwise required considerable manual effort. What stood out most was how thoughtfully it preserved the core story.</>,
  },
  {
    name: 'Francis Nief',
    locale: 'France',
    flag: 'fi-fr',
    avatar: '/assets/testimonials/francis-nief.png',
    quote: <><strong>Atlas helped me navigate</strong> the show&apos;s complex universe precisely, making the French localization richer and more coherent. It supported the process without limiting creativity, allowing me to focus entirely on rewriting.</>,
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
        <div className="testimonials-flags">
          {['fi-it', 'fi-us', 'fi-in', 'fi-fr', 'fi-de'].map(flag => (
            <span key={flag} className={`fi ${flag} testimonials-flag`} />
          ))}
        </div>
        <h2 className="t-h3">
          Writers around the world{' '}
          <svg className="testimonials-heart" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
          {' '}Atlas.
        </h2>
      </div>
      <div className="testimonials-rows">
        {TESTIMONIALS.map((t, i) => {
          const isEven = i % 2 !== 0;
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
