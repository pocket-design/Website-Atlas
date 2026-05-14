import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import 'dialkit/styles.css';
import 'flag-icons/css/flag-icons.min.css';
import { DialRoot } from 'dialkit';

// Display family — Season Collection variable font.
// Axes: wght 300–900, SERF 0–100 (sans→serif), slnt -11–0.
const seasonMix = localFont({
  src: '../public/fonts/season-mix/SeasonCollectionVF.woff2',
  variable: '--font-season-mix',
  display: 'swap',
});

// Mallory MP Compact — slightly tighter width than regular Mallory MP,
// used for body copy. Replaces Mallory Narrow on this branch.
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

export const metadata: Metadata = {
  title: 'Pocket Atlas — Go Global',
  description:
    'Reimagine your story across cultures and geographies so it truly belongs everywhere.',
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${seasonMix.variable} ${malloryMPCompact.variable}`}>
      <body>
        {children}
        <DialRoot productionEnabled defaultOpen />
      </body>
    </html>
  );
}
