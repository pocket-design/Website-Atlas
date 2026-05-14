'use client';

interface NavBarProps {
  centerLabel?: string;
  ctaLabel?: string;
  ctaHref?: string;
  signInLabel?: string;
  signInHref?: string;
}

export default function NavBar({
  centerLabel,
  ctaLabel = 'Try it now',
  ctaHref = '/playground',
  signInLabel = 'Sign in',
  signInHref = '/signin',
}: NavBarProps) {
  return (
    <nav className="site-nav">
      <a className="nav-logo" href="/" aria-label="Pocket Atlas — home">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/assets/logo.svg" alt="Pocket Atlas" />
      </a>
      {centerLabel ? (
        <span className="nav-center-label">{centerLabel}</span>
      ) : (
        <ul className="nav-links">
          <li>
            <a href="#locale-cascade">How it works</a>
          </li>
          <li>
            <a href="#how-it-works">Features</a>
          </li>
          <li>
            <a href="#proof">Proof</a>
          </li>
          <li>
            <a href="#writers">Adapted shows</a>
          </li>
        </ul>
      )}
      <div className="nav-actions">
        <a href={signInHref} className="btn-secondary nav-signin">
          {signInLabel}
        </a>
        <a href={ctaHref} className="btn-primary">
          {ctaLabel}
        </a>
      </div>
    </nav>
  );
}
