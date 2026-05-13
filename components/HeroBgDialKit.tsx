// Data & types used by HeroBg.tsx and HeroBgWithDialKit.tsx.
// The panel UI is now provided by dialkit 1.2.0 via useDialKit() in
// HeroBgWithDialKit.tsx — no hand-rolled controls needed here.

export type HeroCity = 'egypt' | 'japan' | 'newyork';
export type HeroMode = 'v1' | 'v2';

// V1 — lineart + illustrated pairs for hover-reveal effect
// illustrated = top layer (visible by default); lineart = bottom (revealed on hover)
export const CITY_IMAGES: Record<HeroCity, { lineart: string; realistic: string; label: string; icon: string }> = {
  egypt:   { lineart: '/assets/lineart-egypt.jpg',   realistic: '/assets/hero-egypt.jpg',   label: 'Egypt',    icon: '🏛️' },
  japan:   { lineart: '/assets/lineart-japan.jpg',   realistic: '/assets/hero-japan.jpg',   label: 'Japan',    icon: '⛩️' },
  newyork: { lineart: '/assets/lineart-newyork.jpg', realistic: '/assets/hero-newyork.jpg', label: 'New York', icon: '🗽' },
};

// V2 — full illustrations that cycle automatically
export const CITY_IMAGES_V2: Record<HeroCity, { src: string; label: string; icon: string }> = {
  egypt:   { src: '/assets/hero-v2-egypt.jpg',   label: 'Egypt',    icon: '🏛️' },
  japan:   { src: '/assets/hero-v2-japan.jpg',   label: 'Japan',    icon: '⛩️' },
  newyork: { src: '/assets/hero-v2-newyork.jpg', label: 'New York', icon: '🗽' },
};

export const V2_CYCLE_ORDER: HeroCity[] = ['egypt', 'japan', 'newyork'];
