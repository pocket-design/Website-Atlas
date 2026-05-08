import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';

const seasonMix = localFont({
  src: '../public/fonts/SeasonMix-Regular.ttf',
  variable: '--font-season-mix',
  display: 'swap',
});

const malloryNarrow = localFont({
  src: [
    {
      path: '../public/fonts/Mallory-MP-Narrow-Book.ttf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../public/fonts/Mallory-MP-Narrow-Bold.ttf',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--font-mallory-narrow',
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
    <html lang="en" className={`${seasonMix.variable} ${malloryNarrow.variable}`}>
      <body>{children}</body>
    </html>
  );
}
