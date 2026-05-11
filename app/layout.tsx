import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import 'dialkit/styles.css';
import DialkitRoot from '@/components/DialkitRoot';

// Display family — Season Collection variable font.
// Axes: wght 300–900, SERF 0–100 (sans→serif), slnt -11–0.
// Default SERF=65 nudges slightly toward serif from the Mix midpoint (50).
const seasonMix = localFont({
  src: '../public/fonts/season-mix/SeasonCollectionVF.woff2',
  variable: '--font-season-mix',
  display: 'swap',
});

// Mallory MP (MicroPlus) — no longer loaded separately.
// All Mallory usage is Mallory MP Compact (see --ff-sans below).

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
  title: 'Atlas by Pocket',
  description:
    'Atlas is the AI adaptation engine by Pocket that adapts your story to resonate with readers in 100+ locales worldwide.',
  keywords: [
    'Atlas',
    'Pocket FM',
    'story adaptation',
    'AI localization',
    'global storytelling',
    'content adaptation',
    'writers platform',
    'audio series',
    'cultural adaptation',
  ],
  authors: [{ name: 'Pocket Entertainment Pvt Ltd' }],
  creator: 'Pocket Entertainment Pvt Ltd',
  publisher: 'Pocket Entertainment Pvt Ltd',
  metadataBase: new URL('https://atlas.pocketfm.com'),
  openGraph: {
    title: 'Atlas by Pocket',
    description:
      'The AI adaptation engine that takes your story global. Write once, reach readers in 100+ locales.',
    url: 'https://atlas.pocketfm.com',
    siteName: 'Atlas by Pocket',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Atlas by Pocket',
    description:
      'The AI adaptation engine that takes your story global. Write once, reach readers in 100+ locales.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/icon.png',
    apple: '/icon.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${seasonMix.variable} ${malloryMPCompact.variable}`}
    >
      <body>
        {children}
        <DialkitRoot />
      </body>
    </html>
  );
}
