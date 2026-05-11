'use client';

export default function NavBar({ className }: { className?: string }) {
  return (
    <nav className={['site-nav', className].filter(Boolean).join(' ')}>
      <a className="nav-logo" href="#" aria-label="Pocket Atlas — home">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/assets/logo.svg" alt="Pocket Atlas" />
      </a>
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
          <a href="#writers">Writers</a>
        </li>
      </ul>
      <a href="/try" className="btn-primary">
        Try it now
      </a>
    </nav>
  );
}
