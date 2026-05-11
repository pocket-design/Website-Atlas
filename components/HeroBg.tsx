'use client';

/**
 * Two-layer hero background:
 *  - Bottom: realistic full-colour image
 *  - Top:    line-art image (fades out on hover → reveals realistic)
 * Both layers share the same feathered gradient mask (transparent at
 * top & bottom so they blend into the page background seamlessly).
 */
export default function HeroBg() {
  return (
    <div className="hero-bg-wrap" aria-hidden="true">
      {/* ── realistic layer (bottom) ── */}
      <img
        src="/assets/hero-realistic.jpg"
        alt=""
        className="hero-bg-img hero-bg-realistic"
        draggable={false}
      />
      {/* ── line-art layer (top, fades on hover) ── */}
      <img
        src="/assets/hero-lineart.jpg"
        alt=""
        className="hero-bg-img hero-bg-lineart"
        draggable={false}
      />
    </div>
  );
}
