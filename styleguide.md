# Atlas — Design Styleguide

**This file is the source of truth.** All CSS in `app/globals.css`, all component styling, and all type/spacing/color decisions in this codebase must derive from values defined here. If a token is added or changed in CSS, it gets added or changed here first.

The page is also reviewed against the [`make-interfaces-feel-better`](https://github.com/jakubkrehel/make-interfaces-feel-better) skill principles (concentric radii, optical alignment, scale on press, trim-height, etc.) — those rules apply on top of this styleguide.

---

## 1. Color tokens

Three families: **Ink** (near-black neutrals), **Vellum** (cream surfaces and warm neutrals), **Scarlet** (brand accent). No greys, no blue-tinted neutrals — the warmth of Vellum is what makes the page editorial rather than generic-tech.

### Ink (text, dark surfaces)
| Token | Hex | Usage |
| --- | --- | --- |
| `--ink-shade-2` | `#0D0D0D` | Darkest — primary button active |
| `--ink-shade-1` | `#151515` | — |
| `--ink` | `#1C1C1C` | Primary text, dark surfaces |
| `--ink-tint-1` | `#333333` | Primary button hover |
| `--ink-tint-2` | `#4A4A4A` | Secondary text (`--text-secondary`) |
| `--ink-tint-3` | `#636363` | Tertiary text (`--text-tertiary`) |
| `--ink-tint-4` | `#7A7A7A` | — |
| `--ink-tint-5` | `#999999` | Muted / placeholder (`--text-muted`) |
| `--ink-tint-6` | `#B3B3B3` | — |
| `--ink-tint-7` | `#CCCCCC` | — |
| `--ink-tint-8` | `#E0E0E0` | Lightest disabled text on dark |

### Vellum (page surface, light neutrals)
| Token | Hex | Usage |
| --- | --- | --- |
| `--vellum-tint-7` | `#FEFEFD` | Card / inner-input white |
| `--vellum-tint-3` | `#FBFBF6` | Subtle surface tint, locale-card eyebrow strip |
| `--vellum` | `#F4F3EB` | Page background |
| `--vellum-shade-half` | `#ECEBE4` | **Default hairline** — barely-there divider on white and beige |
| `--vellum-shade-1` | `#DAD9D2` | Alt surface, hover/focus border |
| `--vellum-shade-2` | `#BBBAB4` | SVG branch strokes (where lines must read against page) |
| `--vellum-shade-3` | `#9C9B96` | Image-card label color (decorative) — **not used as a border** |
| `--vellum-shade-4` | `#7D7C78` | — |

**Border philosophy:** dividers and card outlines should be *indicative*, not loud. Every border in normal state uses `--surface-divider` (`--vellum-shade-half`). Only on hover/focus does the border deepen, and only to `--surface-divider-hover` (`--vellum-shade-1`) — never deeper. Anything darker than that reads as a heavy outline against vellum and breaks the editorial feel.

### Scarlet (brand)
| Token | Hex | Usage |
| --- | --- | --- |
| `--scarlet-tint-1` | `#ff3318` | Gradient highlight stop above `--scarlet` (top of brand buttons) |
| `--scarlet-tint-7` | `#FDE2DF` | Tinted accent surface |
| `--scarlet` | `#F51D00` | Primary CTAs, brand emphasis |
| `--scarlet-shade-1` | `#D61900` | Scarlet hover |
| `--scarlet-shade-2` | `#B71500` | Scarlet active |

### Utility colors
| Token | Hex | Usage |
| --- | --- | --- |
| `--white` | `#ffffff` | Pure white — top stop of secondary button gradient |
| `--color-success` | `#22c55e` | Checkmarks, success indicators |

### Button gradient stops
These form the `btn-secondary` (white pill) and `try-icon-btn` gradient ladder. Use only via token, never raw hex.

| Token | Hex | Stop |
| --- | --- | --- |
| `--btn-bg-top` | `#ffffff` | Rest state top |
| `--btn-bg-mid` | `#f7f7f5` | Rest state bottom / hover top |
| `--btn-bg-bottom` | `#f0f0ec` | Hover bottom / active top |
| `--btn-bg-active` | `#eaeae6` | Active bottom |

### Semantic aliases
| Token | Maps to | Usage |
| --- | --- | --- |
| `--text-primary` | `--ink` | Body and heading text |
| `--text-secondary` | `--ink-tint-2` | Secondary body, sub-headlines |
| `--text-tertiary` | `--ink-tint-3` | Eyebrows, captions, placeholder |
| `--text-muted` | `--ink-tint-5` | Empty states, placeholders |
| `--text-on-dark` | `--vellum` | Text on ink surfaces |
| `--surface-page` | `--vellum` | Page background |
| `--surface-card` | `--vellum-tint-7` | Card / panel surface |
| `--surface-alt` | `--vellum-shade-1` | Alt section background |
| `--surface-divider` | `--vellum-shade-half` | Default hairlines |
| `--surface-divider-hover` | `--vellum-shade-1` | Hairlines on hover/focus |
| `--surface-inverse` | `--ink` | Dark fold background (footer) |

---

## 2. Typography

### Families

| Family | CSS variable | Role | Files |
| --- | --- | --- | --- |
| **Season Collection VF** | `--ff-display` | All display text (hero, headings, eyebrows in display register). Variable font with axes: `wght` 300–900, `SERF` 0–100 (sans→serif), `slnt` -11–0. Set to `SERF 65` for a slight serif lean past the Mix midpoint. | `public/fonts/season-mix/SeasonCollectionVF.woff2` |
| **Mallory MP Compact** | `--ff-sans` / `--ff-sans-compact` | ALL non-display text across the entire page: buttons, nav, body, labels, eyebrows, cards, footer. No exceptions. Both variables resolve to the same Mallory MP Compact font. | `public/fonts/mallory-mp-compact/Mallory-MP-Compact-Book.ttf` (400), `Mallory-MP-Compact-Bold.ttf` (700) |

**Mallory Narrow, Mallory Regular, and non-compact Mallory MP are all forbidden** in this codebase. Only Mallory MP Compact is used site-wide for all non-display text. No exceptions.

### Variable font axis settings

All display-tier text uses:
```css
font-variation-settings: "SERF" 65, "slnt" 0;
```
- `SERF 0` = pure sans, `50` = mix (midpoint), `100` = full serif. We use **65** for a subtle serif character.
- Weight is controlled via standard `font-weight` (maps to `wght` axis automatically).

### Type scale — the canonical system

The scale has three tiers. Each token has a fixed identity and a single job. Don't invent new sizes inline — if you need something not in the scale, add it here first, then to globals.css.

#### Display tier — Season Collection VF (`--ff-display`)

Headings and editorial display. Always uses `text-wrap: balance` so multi-line breaks fall naturally. All display text uses `font-weight: 500` (Medium) and `font-variation-settings: "SERF" 65, "slnt" 0`. Letter-spacing is currently set to `0` across all sizes (negative spacing disabled for testing).

| Token | Size | Line-height | Letter-spacing | Use |
| --- | --- | --- | --- | --- |
| `t-hero` | `clamp(56px, 7.5vw, 96px)` | `1.05` | `0` | The largest line on the page. **Reserved.** One per page, max — used by the page's primary headline. |
| `t-display` | `clamp(40px, 5.4vw, 56px)` | `1.07` | `0` | Section openers below the hero. The "next biggest" tier after the hero headline. |
| `t-h1` | `clamp(36px, 4.5vw, 48px)` | `1.10` | `0` | Large feature opener. |
| `t-h2` | `clamp(28px, 3.4vw, 36px)` | `1.30` | `0` | Section h2s ("Built for stories that cross borders"). |
| `t-h3` | `clamp(22px, 2.4vw, 28px)` | `1.35` | `0` | Bento-cell titles, mid-level headings. |
| `t-h4` | `20px` | `1.40` | `0` | Card titles, in-card headings, show card names. |

#### Body tier — Mallory MP Compact (`--ff-sans-compact`)

Reading text. `text-wrap: pretty` to avoid orphans. Normal line-height (1.50–1.65) — never trimmed. Bold (700) only when emphasizing a noun within prose; otherwise weight 400.

| Token | Size | Line-height | Letter-spacing | Use |
| --- | --- | --- | --- | --- |
| `t-lead` | `20px` | `1.50` | `0` | Opening paragraph after a heading. Substantial enough to anchor a fold. |
| `t-subheading` | `18px` | `1.50` | `0` | Hero sub-headlines (when used), section subheads, prominent sub-copy. |
| `t-body` | `16px` | `1.55` | `0` | Default body copy. The story-passage textarea uses this size. |
| `t-body-sm` | `14px` | `1.55` | `0.003em` | Card body, locale-card story text, secondary copy. |
| `t-body-xs` | `12px` | `1.50` | `0.005em` | Micro copy: footnotes, legal, dense data. Use sparingly. |

#### UI tier — Mallory MP Compact (`--ff-sans`), trimmed

Buttons, eyebrows, nav, labels — anywhere a label sits in a fixed-height container. Always `line-height: 1` so glyphs sit centered. Vertical centering is handled by `min-height` + flex centering on the parent, not by line-height padding. Bold (700) by default for visual weight at small sizes. All button and nav text also uses `text-box-trim: both; text-box-edge: cap alphabetic` for optical centering.

| Token | Size | Line-height | Letter-spacing | Weight | Use |
| --- | --- | --- | --- | --- | --- |
| `t-label-lg` | `14px` | `1` | `0.005em` | 700 | Larger button text, prominent CTAs. |
| `t-label` | `14px` | `1` | `0.005em` | 700 | Default button, locale-card eyebrow strip, secondary CTAs. Same size as body text (`t-body-sm`). |
| `t-nav` | `14px` | `1` | `0` | 400 | Nav links. Regular weight (400) — not bold — so they read as navigational, not buttons. |
| `t-eyebrow` | `12px` | `1` | `0.08em` | 700 | Section eyebrows, locale-card "GERMANY" labels. **ALL CAPS** (set via `text-transform`). |
| `t-caption` | `11px` | `1.4` | `0.02em` | 400 | Footer copy, footnotes. The only UI-tier token that doesn't trim, because it appears in flowing footer copy. |

### Page-specific overrides

The hero composition uses two custom sizes that bridge the scale rather than land exactly on a token. Both are documented here so future changes stay in sync.

| Class | Family | Size | Line-height | Letter-spacing | Notes |
| --- | --- | --- | --- | --- | --- |
| `.hero-eyebrow` | display | `clamp(32px, 4vw, 44px)` | `1.12` | `-0.02em` | Sits between `t-h2` and `t-h1`. Carries the "Meet Atlas by Pocket" announcement. Color: `--text-primary` (full ink). |
| `.hero-title` | display | `clamp(48px, 6vw, 76px)` | `1.06` | `-0.032em` | Sits between `t-display` and `t-hero`. The actual headline ("The world's first…"). Smaller than `t-hero` so the eyebrow + title read as a balanced pair, not one line dwarfing the other. |

Both `.hero-eyebrow` and `.hero-title` carry a layered white text-shadow for legibility over the painted hero atmosphere — see §6.6.

### Pairing rules

- **Hero stack:** `.hero-eyebrow` (announcement label) → `.hero-title` (headline) → `t-body` story textarea. No `t-subheading` between — the headline IS the subhead in this composition.
- **Section stack:** `t-eyebrow` (section label, scarlet) → `t-h2` (section headline) → optional `t-lead` (opening paragraph) → bento/cards/etc.
- **Card stack:** `t-eyebrow` or `t-label` strip → image → `t-h4` title → `t-body-sm` body.

Never stack two tokens of the same tier directly (e.g. two `t-h2`s adjacent). The hierarchy collapses.

### Trim-height rule

**All non-body Mallory text uses `line-height: 1`** with vertical padding chosen so the visible glyph sits centered in its container. This applies to every UI-tier token (`t-label-lg`, `t-label`, `t-nav`, `t-eyebrow`). The reason: Mallory rendered at non-body sizes with the default browser line-height adds top/bottom space that floats the glyph above the optical center of buttons, eyebrow strips, and tabs. Setting `line-height: 1` collapses that gap; matched padding on the parent restores breathing room.

**Body text (Mallory Compact) keeps a normal line-height** (1.50–1.65). Trim is for UI labels, not paragraphs.

For elements that need a fixed visible height (buttons, eyebrow strips), enforce it via `min-height` so the trim-height change doesn't shrink the click target. Buttons must hit the **40px minimum** specified in §6.

Additionally, all buttons and nav links apply `text-box-trim: both; text-box-edge: cap alphabetic` for CSS-native optical centering (supported in Chrome 133+, Safari 18.2+).

### Testimonial quote sizes

Testimonials use larger sizes than the standard body scale to give quotes editorial weight:

| Element | Token | Notes |
| --- | --- | --- |
| Quote text | `var(--fs-xl)` (20px) | Mallory Compact, normal weight. Render with `text-wrap: pretty`. |
| Author name | `var(--fs-lg)` (18px) | Mallory Compact, bold (700). |
| Author locale | `var(--fs-base)` (14px) | Mallory Compact, normal weight, `--text-secondary`. |

---

## 3. Spacing

Pure 8px grid with half-step (4px) and quarter steps where needed.

| Token | px |
| --- | --- |
| `--sp-half` | 4 |
| `--sp-1` | 8 |
| `--sp-1-5` | 12 |
| `--sp-2` | 16 |
| `--sp-2-5` | 20 |
| `--sp-3` | 24 |
| `--sp-4` | 32 |
| `--sp-5` | 40 |
| `--sp-6` | 48 |
| `--sp-8` | 64 |
| `--sp-10` | 80 |
| `--sp-12` | 96 |
| `--sp-15` | 120 |
| `--sp-20` | 160 |
| `--sp-section` | 64 |

`--sp-section` is the **mandatory vertical rhythm token** for gaps between page folds/sections. Every top-level `<section>` must use `padding: var(--sp-section) var(--sp-8)` (or `padding-top` / `padding-bottom` separately). Never hardcode section padding inline or use a different spacing token for fold gaps.

### Containers

| Token | px | Usage |
| --- | --- | --- |
| `--container` | 1200 | Default max-width for full-bleed sections |
| `--container-narrow` | 720 | Story box, focused reading containers |

### Section padding

All sections use `var(--sp-section)` (64px) for top and bottom padding. Horizontal padding is `var(--sp-8)` (64px). Exceptions are documented below — these are the only sections allowed to deviate:

| Section | Padding | Reason |
| --- | --- | --- |
| **Default (all sections)** | `var(--sp-section) var(--sp-8)` | Standard rhythm between folds |
| Hero | `calc(var(--sp-8) + 120px) var(--sp-8) var(--sp-2-5)` | Extra top for nav clearance, tight bottom because cascade follows immediately |
| Cascade | `0 0 var(--sp-8)` | No top padding — visually continuous with hero |
| Footer | `var(--sp-section) var(--sp-8) 0` | No bottom padding — footer bottom handled internally |

---

## 4. Radii

Concentric rule (from the polish skill): **outer radius = inner radius + padding**. Mismatched nested radii is the most common thing that makes interfaces feel off.

| Token | px | Usage |
| --- | --- | --- |
| `--r-btn` | 4 | Square buttons (rare — pill is default) |
| `--r-input` | 4 | Square inputs |
| `--r-tag` | 4 | Tags, chips, show genre tags |
| `--r-sm` | 6 | Small utility elements (dropdowns, tooltips) |
| `--r-xs` | 2 | Hairline UI chips |
| `--r-card-inner` | **8** | Nested elements inside cards — image frames, inner thumbnails, anything that floats with padding inside a card surface. |
| `--r-input-inner` | 10 | Inner white surface inside `--r-input-outer` (with `sp-1` padding → concentric: 16 = 10 + 8 ✓) |
| `--r-card` | **14** | Cards, locale-cascade wrapper, bento cells, show cards, testimonial quote cards. Softened from the original 6px so cards read as friendly editorial blocks rather than crisp tech-product boxes. |
| `--r-input-outer` | 16 | Outer adapter input box (vellum-shaded outer) — story box stays close to its original radius; do not soften this one |
| `--r-pill` | 32 | Pill buttons |
| `--r-full` | 9999 | Fully rounded (avatar circles, locale flag pills) |

**Card radius rule:** every card-level surface on the page uses `--r-card` (14px). The story box at the top of the hero is the *one* exception — it uses `--r-input-outer` (16px) because its concentric inner element requires that math. Don't soften the story box; do soften everything else.

---

## 5. Motion

### Easing

| Token | Curve | Usage |
| --- | --- | --- |
| `--ease` | `cubic-bezier(0.22, 1, 0.36, 1)` | All interactive transitions |
| `--ease-spring` | `cubic-bezier(0.34, 1.56, 0.64, 1)` | Spring-bounce release on button `:active` |

### CSS transition durations (interactive states only)

| Use | ms |
| --- | --- |
| Color/border hover | 120 (`--dur-instant`) |
| Border + shadow hover | 160 (`--dur-fast`) |
| Transform / lift on hover | 250 (`--dur-slow`) |
| Branch draw-in (keyframe) | 900 |
| Show card vinyl spin (keyframe) | 1800, infinite |

> **Note:** On-load entrance fade/translate animations are currently **disabled** across the entire page. The page renders static on load. The branch draw-in (`stroke-dashoffset` animation) in `AdaptationFlow.tsx` is the only active keyframe sequence tied to a specific user interaction (locale pill selection).

### Scale on press (spring bounce)

Every interactive button shrinks to `transform: scale(0.95)` on `:active` with a spring overshoot easing on release (`200ms cubic-bezier(0.34, 1.56, 0.64, 1)`). This creates a satisfying press-and-bounce feel. Applied universally to `btn-primary`, `btn-brand`, `btn-global`, `btn-secondary`.

### `will-change`

Only on `transform`, `opacity`, `filter`. Never `will-change: all`. Only add when first-frame stutter is observable.

### `prefers-reduced-motion`

New animations must respect `prefers-reduced-motion`. Set duration to `0` or skip the keyframe entirely.

---

## 6. Component patterns

### 6.1 Buttons

**Primary scarlet pill** (`btn-global`, `btn-brand`):
- Family `--ff-sans`, weight 700, size 14px, line-height 1 (trimmed), letter-spacing 0.005em
- Background `linear-gradient(to bottom, var(--scarlet-tint-1), var(--scarlet))`, color `--vellum`, no border
- Padding `10px var(--sp-3)`, border-radius `var(--r-pill)`, min-height **40px**
- Hover → `--scarlet-shade-1`, active → `--scarlet-shade-2` + `scale(0.96)`

**Secondary white pill** (`btn-secondary`):
- Same type spec as primary (14px, 700, line-height 1, trimmed)
- Background `linear-gradient(to bottom, var(--btn-bg-top), var(--btn-bg-mid))` — subtle top-to-bottom gradient for depth
- Color `--ink`, 1px border `--surface-divider`
- Padding `10px var(--sp-2-5)`, border-radius `var(--r-pill)`, min-height **40px**
- Hover → gradient `var(--btn-bg-mid) → var(--btn-bg-bottom)`, border `--surface-divider-hover`
- Active → gradient `var(--btn-bg-bottom) → var(--btn-bg-active)` + `scale(0.95)` with spring bounce

**Ink primary pill** (`btn-primary`, e.g. nav "Go global"):
- Same shape as primary scarlet, swap background to `--ink`, hover `--ink-tint-1`, active `--ink-shade-2`

### 6.2 Adapter input box (hero)

The signature double-border that introduces the cascade.

```
─ outer (r=16, vellum-shade-1 border, padding sp-1) ─────────
│  ┌─ inner (r=10, surface-divider border) ──────────────┐  │
│  │   textarea — t-body, padding sp-3                   │  │
│  └─────────────────────────────────────────────────────┘  │
│  ┌─ buttons row, padding sp-1-5 sp-1 sp-half sp-1 ──────┐ │
│  │  [Demo story]                   [Take this global →] │  │
│  └─────────────────────────────────────────────────────┘  │
─────────────────────────────────────────────────────────────
```

Concentric radii: 16 = 10 + 6 (close enough to 8 — acceptable since the inner stroke visually splits the difference).

Outer max-width **`--container-narrow` (720px)** — the story passage should feel like a focused reading surface, not an enterprise form.

Hover/focus state: outer border deepens to `--vellum-shade-3`, shadow lifts (1+2 / 8+24 layered).

**Mobile:** `max-height: 200px` on the textarea with `overflow-y: auto` to ensure the CTA button stays visible in the viewport.

### 6.3 Bento cards (the universal card pattern)

**This is the ONE card style used everywhere on the page.** Testimonials, features, proof stats — all use the same card. Never invent a new card style.

```css
.any-card {
  background: var(--surface-card);
  border: var(--border-hairline);
  border-radius: var(--r-card);
  padding: var(--sp-4);
  box-shadow: none;
}
```

Properties (all mandatory, no exceptions):
- Background: `var(--surface-card)` (white)
- Border: `var(--border-hairline)` (1px solid `--surface-divider`)
- Radius: `var(--r-card)` (14px)
- Padding: `var(--sp-4)` (32px)
- Box-shadow: `none` (shadows are currently disabled site-wide)
- No hover state change on cards (background stays the same)

**Exception — Transposition bento card:** uses `var(--vellum-shade-half)` as its background (one step warmer than card-white) and `1px solid var(--vellum-shade-1)` border so it reads distinctly against the surrounding vellum page background. No hover background change.

Card title: `t-h4` (20px, semibold), `margin-bottom: var(--sp-1-5)`
Card body: `t-body-sm` (14px), `color: var(--text-secondary)`

### 6.4 Section grids (the universal grid pattern)

All multi-card sections use the same grid setup:

```css
.any-grid {
  display: grid;
  grid-template-columns: repeat(N, 1fr);  /* N = number of columns */
  gap: 2px;
  max-width: var(--container);
  margin: 0 auto;
}
```

Mandatory properties:
- `gap: 2px` — tight packing between cards, always
- `max-width: var(--container)` — never wider than 1200px
- `margin: 0 auto` — centered

Column counts used on this site:
- 6 columns: feature bento (with span-2, span-3, span-4 on cells)
- 3 columns: proof cards (collapse to 1 column on mobile)
- 2-column / alternating: testimonials (see §6.10)
- 4 columns: show grid (pairs of source + adaptations)

On mobile (`max-width: 767px`), all grids collapse to `grid-template-columns: 1fr`.

### 6.5 Section wrapper

Every section on the page follows this structure:

```css
.any-section {
  padding: var(--sp-section) var(--sp-8);
}
.any-section .section-header {
  max-width: var(--container);
  margin: 0 auto var(--sp-4);
}
```

Section header uses `t-h3` for the heading. Never skip `--sp-section` for vertical padding. Never skip `var(--sp-8)` for horizontal padding.

### 6.6 Separators / dividers

All visible dividers use `var(--surface-divider)` (`--vellum-shade-half`, #ECEBE4). Exception: separators on beige backgrounds (where `--surface-divider` is too faint) use `var(--vellum-shade-1)` (#DAD9D2) instead. Both are 1px wide/tall.

Never use arbitrary greys, rgba values, or hardcoded hex for separators.

### 6.7 Locale cards (cascade)

Each card:
- Outer container `--surface-card`, 1px `--surface-divider`, radius `--r-card` (14px), `overflow: hidden`
- Eyebrow strip: flag + country name in `t-eyebrow` (Mallory regular, trimmed line-height 1, all caps), background `--vellum-tint-3`, bottom 1px `--surface-divider`
- Image area: 4:3 aspect, current placeholder is a `--vellum-shade-1 → --vellum-tint-3` gradient with city name in `t-display` faded out. Replace with real photography per §7.
- Story text: `t-body-sm` (Mallory Compact 14px / 1.55), padded `sp-3`, color `--text-secondary`
- Hover: `translateY(-2px)` + layered shadow (4+6 / 16+32 / 2+4)

### 6.8 Cascade branches

5 SVG paths from a single anchor `(540, 0)` in viewBox `0 0 1080 96` to centers of the 5 columns at the bottom (`108, 324, 540, 756, 972`). The middle path is straight; the four outer paths use cubic beziers with control points at midheight to create a smooth fan.

Stroke `--vellum-shade-2`, 1px, no fill. On entry each path animates `stroke-dashoffset: 600 → 0` with the staggered delays in §5.

### 6.9 Show cards (blockbusters section)

The `ShowsSection` component renders the adapted-show grid. Each show occupies two adjacent grid columns: the **source card** (thumbnail + title + genre tags + stats) and the **adaptations card** (3 locale thumbnails side-by-side). Implemented in `components/ShowsSection.tsx`.

**Vinyl hover animation:** the source card thumbnail rotates to a gentle `@keyframes vinyl-spin` on hover, giving the illusion of a spinning record. The play icon (Feather Icons polygon) appears centered over the thumbnail on hover, colored `var(--ink)`.

Genre tags use `--r-tag` (4px), background `--ink`, color `--vellum-tint-7`. Locale pills on adaptation thumbnails use the same shape with the locale's flag icon.

### 6.10 Testimonials

The testimonials section uses an **alternating two-column layout** — not a uniform card grid:

- **Row A** (odd rows): author block on left (`1fr`), quote card on right (`2fr`)
- **Row B** (even rows): quote card on left (`2fr`), author block on right (`1fr`)

Author block (`.t-row__author`): unboxed — no card background. Avatar (60px circle), name in `var(--fs-lg)` bold, locale subtitle in `var(--fs-base)` `--text-secondary`. On Row A the block aligns right (toward the quote); on Row B it aligns left.

Quote card (`.t-row__quote`): standard card pattern — `--surface-card` background, `--border-hairline`, `--r-card`, `var(--sp-4)` padding. Quote text `var(--fs-xl)`, no decorative quote marks. Italicize `<em>` for titles; bold `<strong>` for key claims and all mentions of Atlas.

**Mobile:** single column, quote card first, author block below (left-aligned, avatar + name/locale in a row).

---

## 7. Detail principles (the polish layer)

These ride on top of every component, drawn from the [make-interfaces-feel-better](https://github.com/jakubkrehel/make-interfaces-feel-better) skill. The skill is installed at `~/.agents/skills/make-interfaces-feel-better/` for reference.

| # | Principle | Atlas application |
| --- | --- | --- |
| 1 | **Concentric border radius** | Outer = inner + padding. Enforced for the adapter input (16 / 10 with sp-1). |
| 2 | **Optical over geometric alignment** | Button `→` arrows offset by 4–6px from text via `gap: var(--sp-1)`. Flag emoji + country label horizontally aligned via flex `gap: var(--sp-1)`, no padding tweaks needed. |
| 3 | **Shadows over borders for depth** | Hover lifts use layered `box-shadow` with multiple transparency stops, not heavier borders. Hairline borders stay at 1px. |
| 4 | **Interruptible animations** | Hover/active use `transition`. Branch draw-in and vinyl spin use `@keyframes`. |
| 5 | **Split + stagger entrances** | Locale cards stagger by 120ms (0.20s through 0.68s); branches stagger by 80ms. |
| 6 | **Subtle exits** | No exit animations on this page yet. When added, use small `translateY` (8–12px) not full height. |
| 7 | **Contextual icon animations** | When buttons swap state (e.g. "Take this global →" → "Adapting…"), icons cross-fade with `cubic-bezier(0.2, 0, 0, 1)`, opacity 0↔1, scale 0.25↔1, blur 4px↔0. Both icons in DOM, one absolute. |
| 8 | **Font smoothing** | `-webkit-font-smoothing: antialiased` on body. macOS rendering is crisper. |
| 9 | **Tabular numbers** | Any numeric counter uses `font-variant-numeric: tabular-nums`. The "247 words" counter and stat numbers (`bcell-stat`) already do. |
| 10 | **Text wrapping** | All headings get `text-wrap: balance`. All body text gets `text-wrap: pretty`. Defined in the type scale tokens. |
| 11 | **Image outlines** | Once real photography lands in locale cards, add `outline: 1px solid rgba(0,0,0,0.1)` — pure black at low opacity. Never tinted (slate, zinc, etc.) — those pick up surface color and read as dirt. |
| 12 | **Scale on press** | All buttons `transform: scale(0.95)` on `:active` with spring-bounce release (`200ms cubic-bezier(0.34, 1.56, 0.64, 1)`). |
| 13 | **Skip animation on page-load** for already-visible content | When framer-motion arrives, use `initial={false}` on `AnimatePresence` for default-state elements. Today the page has no `AnimatePresence` so this is documentation-only. |
| 14 | **Never `transition: all`** | Always specify properties: `transition: background 120ms var(--ease), transform 120ms var(--ease)`. Confirmed in code review. |
| 15 | **Sparse `will-change`** | Only on `.bcell`, `.locale-card` for `transform`. Never `will-change: all`. |
| 16 | **40px hit area minimum** | All buttons enforce `min-height: 40px`. Nav links use `padding: 12px 4px` (= 40px effective hit on the 14px font). |

### Trim-height (project-specific addition)

All non-body Mallory uses `line-height: 1`. See §2. This is the rule that keeps button text and eyebrow labels optically centered.

---

## 8. Font file inventory

**All fonts in `public/fonts/`:**

| File | Family | Weight/Axis | Status |
| --- | --- | --- | --- |
| `season-mix/SeasonCollectionVF.woff2` | Season Collection VF | wght 300–900, SERF 0–100, slnt -11–0 | ✅ Active |
| `mallory-mp-compact/Mallory-MP-Compact-Book.ttf` | Mallory MP Compact | 400 | ✅ Active |
| `mallory-mp-compact/Mallory-MP-Compact-Bold.ttf` | Mallory MP Compact | 700 | ✅ Active |
| `season-mix/SeasonMix-Regular.ttf` | Season Mix (static) | 400 | 🗄️ Archived (superseded by VF) |
| `season-mix/SeasonMix-Medium.ttf` | Season Mix (static) | 500 | 🗄️ Archived (superseded by VF) |
| `mallory-mp/Mallory-MP-Book.ttf` | Mallory MP (non-compact) | 400 | 🚫 Not loaded |
| `mallory-mp/Mallory-MP-Bold.ttf` | Mallory MP (non-compact) | 700 | 🚫 Not loaded |

**Forbidden families:** Mallory Narrow, Mallory Regular (non-MP), Mallory MP (non-compact). These must never be referenced in CSS or layout.

---

## 9. Update protocol

Any change to a value in this codebase that has a counterpart here:
1. Edit `styleguide.md` first (this file).
2. Edit `app/globals.css` to match.
3. Verify in browser preview.

Drift between this file and the CSS is a bug. If you find drift, the styleguide wins — update the CSS.
