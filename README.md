# Atlas by Pocket

Atlas is the marketing site and interactive demo for Pocket's AI story adaptation engine. The site explains what Atlas does, demonstrates the adaptation pipeline with real locale-specific prose, and provides an interactive `/playground` page where users can paste a story and see it adapted across multiple target locales.

Production URL: **https://atlas.pocketfm.com**


## What this repo contains

The project is a static Next.js site (exported HTML/CSS/JS, no server runtime) with two routes:

**`/` (Landing page)** showcases the adaptation engine through:
- An animated hero with a demo story, rotating background photos, and locale CTA buttons
- A cascade of four locale cards with highlighted adaptation differences (names, places, food, family terms)
- A bento grid explaining the six pillars of how the engine works
- A blockbusters section showing real Pocket shows adapted across Spanish, German, and French, with vinyl-spin hover animation
- Social proof metrics (listeners, revenue, minutes played)
- Testimonials from writers around the world in an alternating author/quote layout
- A "Have your own story" section with draggable magnet words and playground CTA

**`/playground` (Adaptation demo)** is a split-pane interface where the left side accepts source text and the right side displays adapted output in up to three target locales. It includes locale switcher dropdowns, a loading state with a square-grid loader, word/character counts, a download button, and a "Change mappings" modal for editing individual adaptation mappings per locale.


## Tech stack

| Layer | Choice |
|---|---|
| Framework | Next.js 15 (App Router) with `output: 'export'` for static site generation |
| UI | React 19, TypeScript 5 |
| Styling | Single global CSS file with design tokens (CSS custom properties) |
| Fonts | Season Collection VF (display), Mallory MP Compact (body/UI) via `next/font/local` |
| Icons | `flag-icons` for country flags, Feather Icons SVG for play button, inline SVGs for UI icons |
| Illustrations | `roughjs` for hand-drawn underline effects |
| Hosting | Vercel (static deploy from `hardik` branch) |


## Project structure

```
app/
  layout.tsx            Root layout: font loading, metadata, global CSS import
  globals.css           All styling: design tokens, component styles, responsive rules
  page.tsx              Landing page route (/, server component)
  playground/
    page.tsx            Adaptation demo route (/playground, client component)

components/
  NavBar.tsx            Fixed glass navigation bar with section links and CTA
  AdaptationFlow.tsx    Core cascade demo: HeroAdapter, LocaleCascade, LocaleCard,
                        CascadeBranches, SquareLoader, highlight/tooltip system
  HeroBg.tsx            Hero background image rotation with per-image CSS class support
  BentoHeroRow.tsx      First bento row layout (transposition card + stacked cards)
  BentoGraphic.tsx      Canvas-drawn illustrations for the "how it works" bento grid
  BentoHeader.tsx       Intersection-triggered section heading with roughjs underline
  StoryCTAHeader.tsx    Heading for the blockbusters section
  ShowsSection.tsx      Adapted-show grid with vinyl-spin hover (data-driven from SHOWS array)
  DraggableMagnets.tsx  Draggable fridge-magnet words in the "Have your own story" section
  Testimonials.tsx      Writer quotes in alternating author-left/quote-right layout
  CountUp.tsx           Animated number counter triggered on scroll intersection
  RoughUnderline.tsx    roughjs hand-drawn underline with stroke-draw animation
  InteractiveGlobe.tsx  SVG wireframe globe (not currently mounted on the landing page)
  TryItSection.tsx      Earlier try-it block (not currently mounted on the landing page)
  TranslationWindow.tsx Simpler EN→locale translation demo (not currently mounted)

lib/
  locales.ts            Shared locale metadata, source locales, default keys, demo story
  hooks.ts              Reusable hooks: useClickOutside, useIntersectionVisible

public/
  assets/               Hero backgrounds (AI-generated, desaturated via CSS), locale city
                        photos, bento illustration images, logos, avatars
  thumbnails/shows/     Show cover art for the blockbusters section (webp/jpg/png)
  fonts/
    season-mix/         Season Collection variable font (woff2)
    mallory-mp-compact/ Mallory MP Compact Book (400) and Bold (700)
    mallory-mp/         Mallory MP Book and Bold (not loaded, kept for reference)
  icon.png              Favicon and apple touch icon
  robots.txt            Search engine directives
  sitemap.xml           Sitemap for crawlers
```


## Design system

All visual decisions are governed by a token system defined in `:root` of `globals.css` and documented in `styleguide.md`. The tokens cover:

**Color** uses three families: Ink (near-black neutrals for text), Vellum (cream surfaces giving the page its editorial warmth), and Scarlet (brand red for CTAs and highlights). Semantic aliases like `--text-primary`, `--surface-card`, and `--surface-divider` map to these families so components never reference raw hex values. A `--color-success` token covers the green checkmarks in the proof section.

**Typography** has three tiers. Display tier uses Season Collection VF for headings with `font-variation-settings: "SERF" 65` for a subtle serif character. Body tier uses Mallory MP Compact for reading text. UI tier uses Mallory MP Compact at `line-height: 1` with trim-height centering for buttons, labels, and navigation. Ten font-size tokens (`--fs-xs` through `--fs-2xl`) cover all sizes.

**Spacing** follows an 8px grid with tokens from `--sp-half` (4px) through `--sp-20` (160px). Container widths are `--container` (1200px) and `--container-narrow` (720px).

**Radii** enforce concentric nesting: outer radius equals inner radius plus padding. Cards use `--r-card` (14px), inner card elements use `--r-card-inner` (8px), buttons use `--r-pill` (32px).

**Motion** uses `--ease` (cubic-bezier 0.22, 1, 0.36, 1) and `--ease-spring` (cubic-bezier 0.34, 1.56, 0.64, 1) for all transitions. Every button has a `scale(0.95)` spring bounce on press. Entrance fade animations are currently disabled — the page renders static on load.

**Shadows** are layered (never single-stop) and defined as named tokens from `--shadow-xs` to `--shadow-xl`.


## Locale data architecture

Locale metadata lives in `lib/locales.ts` as a single source of truth. It exports:

`ALL_LOCALES` contains eight target locales (German, Portuguese BR, Japanese, Swahili, French, Hindi, Spanish, Korean), each with a `code`, `countryCode` (for flag-icons), `name` (display label like "German"), and `region` (country name like "Germany").

`SOURCE_LOCALES` prepends English to the list above, used for source language selection.

`DEFAULT_LOCALE_KEYS` is `['de', 'br', 'jp', 'ke']`, the four locales shown in the landing page cascade.

`DEMO_STORY` is the Maya/corner-store passage used in the hero typing animation.

The rich per-locale adaptation data (segmented text with highlight buckets and city images) lives in `components/AdaptationFlow.tsx` because it is tightly coupled to the cascade's highlight and tooltip system.


## The `/playground` page for engineering integration

The `/playground` page at `app/playground/page.tsx` is where the engineering team will wire up the actual Atlas adaptation API. Here is how the current placeholder flow works and where to make changes:

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

The dev server starts at `http://localhost:3000`. The `/playground` page is at `http://localhost:3000/playground`.

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
| `app/playground/page.tsx` | Replace `handleAdapt` placeholder with real API calls. Replace `DEMO_MAPPINGS` with API-returned mappings. |
| `lib/locales.ts` | Add or modify supported locales here. All UI across both pages will pick up changes automatically. |
| `components/AdaptationFlow.tsx` | The landing page cascade uses hardcoded adapted passages in `ALL_LOCALES`. If the landing page should use live API data instead, replace the `segments` arrays with API responses. |
| `components/ShowsSection.tsx` | Update the `SHOWS` array with new show data, thumbnail paths, and stats as new titles are adapted. |
| `app/globals.css` | All styling. Follows the token system in `styleguide.md`. |
| `styleguide.md` | The design system source of truth. Read this before making visual changes. |
