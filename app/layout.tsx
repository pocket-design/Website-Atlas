import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';

// Display family — Season Mix (Regular 400, Medium 500).
const seasonMix = localFont({
  src: [
    {
      path: '../public/fonts/season-mix/SeasonMix-Regular.ttf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../public/fonts/season-mix/SeasonMix-Medium.ttf',
      weight: '500',
      style: 'normal',
    },
  ],
  variable: '--font-season-mix',
  display: 'swap',
});

// Mallory MP (MicroPlus) — Frere-Jones's screen-optimized cut
// of Mallory regular. Used for UI: buttons, nav, eyebrows.
const malloryMP = localFont({
  src: [
    {
      path: '../public/fonts/mallory-mp/Mallory-MP-Book.ttf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../public/fonts/mallory-mp/Mallory-MP-Bold.ttf',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--font-mallory',
  display: 'swap',
});

// Mallory MP Compact — slightly tighter width, ideal for body
// copy where we want more characters per line at the same size.
const malloryMPCompact = localFont({
  src: [
    {
      path: '../public/fonts/mallory-mp-compact/Mallory-MP-Compact-Book.ttf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../public/fonts/mallory-mp-compact/Mallory-MP-Compact-Bold.ttf',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--font-mallory-compact',
  display: 'swap',
});

// Mallory Narrow is intentionally NOT loaded — see styleguide §2.

export const metadata: Metadata = {
  title: 'Atlas by Pocket — story adaptation engine for writers',
  description:
    "The world's first story adaptation engine for writers — built by Pocket. Translate words, transpose worlds.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${seasonMix.variable} ${malloryMP.variable} ${malloryMPCompact.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
