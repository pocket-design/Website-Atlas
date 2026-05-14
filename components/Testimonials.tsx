const TESTIMONIALS = [
  {
    name: 'Kathrin Corpataux',
    locale: 'Germany',
    avatarBg: '#C8B99A',
    initials: 'KC',
    quote:
      'The cultural audit caught the small things I would have flattened in translation. Its substitution prompts helped me rebuild scenes around American rhythms without losing the story\'s quiet German interiority.',
  },
  {
    name: 'Priya Venkataraman',
    locale: 'India',
    avatarBg: '#B5C4B1',
    initials: 'PV',
    quote:
      'Atlas understood that my protagonist\'s relationship with her mother-in-law carries entirely different weight in an Indian context versus a Western one. It rebuilt those scenes from the inside out.',
  },
  {
    name: 'Yuki Tanaka',
    locale: 'Japan',
    avatarBg: '#A8BDD1',
    initials: 'YT',
    quote:
      'Honorifics, gift-giving scenes, the weight of silence between characters — Atlas mapped all of it onto equivalents that English readers would feel rather than just read.',
  },
  {
    name: 'Sophie Laurent',
    locale: 'France',
    avatarBg: '#C4B5C8',
    initials: 'SL',
    quote:
      'In French romance, restraint is everything. Atlas knows that. The English version it produced never over-explained what should be left unspoken, and the audience retention data proved it.',
  },
];

export default function Testimonials() {
  return (
    <section id="testimonials" className="testimonials">
      <div className="section-header">
        <h2 className="t-h3">The world writes on Pocket, with Atlas.</h2>
      </div>
      <div className="testimonials-grid">
        {TESTIMONIALS.map((t, i) => (
          <article key={i} className="testimonial-card">
            <blockquote className="testimonial-card__quote">
              &ldquo;{t.quote}&rdquo;
            </blockquote>
            <div className="testimonial-card__author">
              <div
                className="testimonial-card__avatar"
                style={{ background: t.avatarBg }}
                aria-hidden="true"
              >
                {t.initials}
              </div>
              <div className="testimonial-card__meta">
                <strong className="testimonial-card__name">{t.name}</strong>
                <span className="testimonial-card__locale">{t.locale}</span>
              </div>
            </div>
          </article>
        ))}
      </div>
      <div className="testimonials-cta">
        <a href="/playground" className="btn-brand">Try your story</a>
        <p className="social-proof-text">Atlas is free to try.</p>
      </div>
    </section>
  );
}
