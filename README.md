# Atlas by Pocket

Atlas is the marketing site and interactive demo for Pocket's AI story adaptation engine. The site explains what Atlas does, demonstrates the adaptation pipeline with real locale-specific prose, and provides an interactive `/try` page where users can paste a story and see it adapted across multiple target locales.

Production URL: **https://atlas.pocketfm.com**


## What this repo contains

The project is a static Next.js site (exported HTML/CSS/JS, no server runtime) with two routes:

**`/` (Landing page)** showcases the adaptation engine through an animated hero with a demo story that types itself out, a cascade of four locale cards with highlighted adaptation differences (names, places, food, family terms, everyday objects), interactive category pills, a bento grid explaining how the engine works, social proof stats, and a story CTA section with a thumbnail grid.

**`/try` (Adaptation demo)** is a split-pane interface where the left side accepts source text and the right side displays adapted output in up to three target locales. It includes locale switcher dropdowns, a loading state with a square-grid loader, word/character counts, a download button, and a "Change mappings" modal for editing individual adaptation mappings per locale.


## Tech stack

| Layer | Choice |
|---|---|
| Framework | Next.js 15 (App Router) with `output: 'export'` for static site generation |
| UI | React 19, TypeScript 5 |
| Styling | Single global CSS file with design tokens (CSS custom properties) |
| Fonts | Season Collection VF (display), Mallory MP Compact (body/UI) via `next/font/local` |
| Icons | `flag-icons` for country flags, inline SVGs for UI icons |
| Illustrations | `roughjs` for hand-drawn underline effects |
| Hosting | Vercel (static deploy from `hardik` branch) |


## Project structure

```
app/
  layout.tsx            Root layout: font loading, metadata, global CSS import
  globals.css           All styling: design tokens, component styles, responsive rules
  page.tsx              Landing page route (/, server component)
  try/
    page.tsx            Adaptation demo route (/try, client component)

components/
  NavBar.tsx            Fixed glass navigation bar, configurable center label and CTA
  AdaptationFlow.tsx    Core cascade demo: HeroAdapter, LocaleCascade, LocaleCard,
                        CascadeBranches, SquareLoader, highlight/tooltip system
  HeroBg.tsx            Hero background image with progressive unblur on load
  InteractiveGlobe.tsx  SVG wireframe globe with mouse tracking and idle rotation
  BentoGraphic.tsx      Canvas-drawn illustrations for the "how it works" bento grid
  BentoHeader.tsx       Intersection-triggered section heading with roughjs underline
  StoryCTAHeader.tsx    Same pattern for the story CTA section heading
  RoughUnderline.tsx    roughjs hand-drawn underline with stroke-draw animation
  CountUp.tsx           Animated number counter triggered on scroll intersection
  ThumbnailGrid.tsx     12x2 grid of story thumbnails with pixel-morph transition
  TryItSection.tsx      Earlier try-it block (currently commented out on landing page)
  TranslationWindow.tsx Simpler EN to DE/FR/ES translation demo (not active)

lib/
  locales.ts            Shared locale metadata, source locales, default keys, demo story
  hooks.ts              Reusable hooks: useClickOutside, useIntersectionVisible

public/
  assets/               Hero background, locale city photos, line art, logos, avatars
  thumbnails/           50 story cover thumbnails for the ThumbnailGrid
  fonts/
    season-mix/         Season Collection variable font (woff2)
    mallory-mp-compact/ Mallory MP Compact Book (400) and Bold (700)
    mallory-mp/         Mallory MP Book and Bold (not loaded, kept for reference)
  icon.png              Favicon and apple touch icon
  robots.txt            Search engine directives
  sitemap.xml           Sitemap for crawlers
```


## Design system

All visual decisions are governed by a token system defined in `:root` of `globals.css` and documented in `STYLEGUIDE.md`. The tokens cover:

**Color** uses three families: Ink (near-black neutrals for text), Vellum (cream surfaces giving the page its editorial warmth), and Scarlet (brand red for CTAs and highlights). Semantic aliases like `--text-primary`, `--surface-card`, and `--surface-divider` map to these families so components never reference raw hex values.

**Typography** has three tiers. Display tier uses Season Collection VF for headings with `font-variation-settings: "SERF" 65` for a subtle serif character. Body tier uses Mallory MP Compact for reading text. UI tier uses Mallory MP Compact at `line-height: 1` with trim-height centering for buttons, labels, and navigation. Ten font-size tokens (`--fs-xs` through `--fs-display`) cover all sizes.

**Spacing** follows an 8px grid with tokens from `--sp-half` (4px) through `--sp-20` (160px). Container widths are `--container` (1200px) and `--container-narrow` (720px).

**Radii** enforce concentric nesting: outer radius equals inner radius plus padding. Cards use `--r-card` (14px), inner card elements use `--r-card-inner` (8px), buttons use `--r-pill` (32px).

**Motion** uses `--ease` (cubic-bezier 0.22, 1, 0.36, 1) for all transitions, with six duration tokens from `--dur-instant` (120ms) to `--dur-slowest` (800ms). Every button has a `scale(0.95)` spring bounce on press.

**Shadows** are layered (never single-stop) and defined as named tokens from `--shadow-xs` to `--shadow-xl`.


## Locale data architecture

Locale metadata lives in `lib/locales.ts` as a single source of truth. It exports:

`ALL_LOCALES` contains eight target locales (German, Portuguese BR, Japanese, Swahili, French, Hindi, Spanish, Korean), each with a `code`, `countryCode` (for flag-icons), `name` (display label like "German"), and `region` (country name like "Germany").

`SOURCE_LOCALES` prepends English to the list above, used for source language selection.

`DEFAULT_LOCALE_KEYS` is `['de', 'br', 'jp', 'ke']`, the four locales shown in the landing page cascade.

`DEMO_STORY` is the Maya/corner-store passage used in the hero typing animation.

The rich per-locale adaptation data (segmented text with highlight buckets and city images) lives in `components/AdaptationFlow.tsx` because it is tightly coupled to the cascade's highlight and tooltip system.


## The `/try` page for engineering integration

The `/try` page at `app/try/page.tsx` is where the engineering team will wire up the actual Atlas adaptation API. Here is how the current placeholder flow works and where to make changes:

**Source input** is a standard `<textarea>` bound to `source` state. The source locale is selectable via a dropdown defaulting to English with an "(auto)" label.

**Target locale selection** uses up to three locale switcher dropdowns in the right pane header. Each dropdown filters out already-selected locales. An "Add locale" button appears when fewer than three are selected. The selected locale codes are stored in `selectedLocales` state.

**The `handleAdapt` function** (around line 380) is the placeholder that needs to be replaced with a real API call. Currently it does a `setTimeout` of 3 seconds and fills `results` (a `Record<string, string>` mapping locale code to adapted text) with placeholder text. To integrate:

1. Replace the `setTimeout` block with a fetch call to the Atlas adaptation API
2. Send `source` (the input text), the source locale code, and `selectedLocales` (array of target locale codes)
3. Populate the `results` state with the API response, keyed by locale code
4. The UI automatically handles loading state (`isAdapting`), tab switching between locale results, word/character counts, and the transition from beige empty state to white result pane

**The "Change mappings" modal** (`TweakModal` component) currently uses hardcoded `DEMO_MAPPINGS` showing example entity mappings per locale (character names, places, food, family terms). To integrate:

1. After adaptation, the API should return both the adapted text and the entity mappings it used
2. Store these mappings in state and pass them to `TweakModal` instead of `DEMO_MAPPINGS`
3. When the user edits a mapping and clicks "Update", send the modified mappings back to the API for re-adaptation
4. The modal supports adding/removing locales via tabs and deleting individual mappings (minimum three must remain)

**The "Regenerate" button** appears after the first adaptation, allowing re-adaptation with the same or modified source text. It calls the same `handleAdapt` function.

**The download button** exports the currently visible locale's adapted text as a `.txt` file. No backend changes needed.


## Running locally

```
npm install
npm run dev
```

The dev server starts at `http://localhost:3000`. The `/try` page is at `http://localhost:3000/try`.

For a production build:

```
npm run build
```

This generates a static export in the `out/` directory. The `output: 'export'` setting in `next.config.ts` means no Node.js server is needed to serve the built site.


## Deployment

The site deploys automatically to Vercel when changes are pushed to the `hardik` branch. The static export is served directly from Vercel's edge network.


## Files the engineering team should focus on

| File | What to do |
|---|---|
| `app/try/page.tsx` | Replace `handleAdapt` placeholder with real API calls. Replace `DEMO_MAPPINGS` with API-returned mappings. |
| `lib/locales.ts` | Add or modify supported locales here. All UI across both pages will pick up changes automatically. |
| `components/AdaptationFlow.tsx` | The landing page cascade uses hardcoded adapted passages in `ALL_LOCALES`. If the landing page should use live API data instead, replace the `segments` arrays with API responses. |
| `app/globals.css` | All styling. Follows the token system in `STYLEGUIDE.md`. |
| `STYLEGUIDE.md` | The design system source of truth. Read this before making visual changes. |
