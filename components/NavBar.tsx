'use client';

export default function NavBar() {
  return (
    <nav className="site-nav">
      <a className="nav-logo" href="#" aria-label="Pocket Atlas — home">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/assets/logo.svg" alt="Pocket Atlas" />
      </a>
      <ul className="nav-links">
        <li>
          <a href="#locale-cascade">How it works</a>
        </li>
        <li>
          <a href="#try-it">Demo</a>
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
      <button
        type="button"
        className="btn-primary"
        onClick={() => {
          document.getElementById('try-it')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }}
      >
        Try it now
      </button>
    </nav>
  );
}
