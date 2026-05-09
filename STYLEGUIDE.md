# Atlas — Design Styleguide

**This file is the source of truth.** All CSS in `app/globals.css`, all component styling, and all type/spacing/color decisions in this codebase must derive from values defined here. If a token is added or changed in CSS, it gets added or changed here first.

The page is also reviewed against the [`make-interfaces-feel-better`](https://github.com/jakubkrehel/make-interfaces-feel-better) skill principles (concentric radii, optical alignment, scale on press, trim-height, etc.) — those rules apply on top of this styleguide.

---

## 1. Color tokens

Three families: **Ink** (near-black neutrals), **Vellum** (cream surfaces and warm neutrals), **Scarlet** (brand accent). No greys, no blue-tinted neutrals — the warmth of Vellum is what makes the page editorial rather than generic-tech.

### Ink (text, dark surfaces)
| Token | Hex | Usage |
| --- | --- | --- |
| `--ink-tint-7` | `#E2E2E2` | Lightest disabled text on dark |
| `--ink-tint-6` | `#C6C6C6` | — |
| `--ink-tint-5` | `#A9A9A9` | — |
| `--ink-tint-4` | `#8D8D8D` | Tertiary text |
| `--ink-tint-3` | `#717171` | Secondary text |
| `--ink-tint-1` | `#383838` | Primary button hover |
| `--ink` | `#1C1C1C` | Primary text, dark surfaces |
| `--ink-shade-2` | `#151515` | Primary button active |

### Vellum (page surface, light neutrals)
| Token | Hex | Usage |
| --- | --- | --- |
| `--vellum-tint-7` | `#FEFEFD` | Card / inner-input white |
| `--vellum-tint-3` | `#FBFBF6` | Subtle surface tint, locale-card eyebrow strip |
| `--vellum` | `#FAF9F1` | Page background |
| `--vellum-shade-half` | `#ECEBE4` | **Default hairline** — barely-there divider on white and beige |
| `--vellum-shade-1` | `#DAD9D2` | Outer-input beige, alt surface, hover/focus border |
| `--vellum-shade-2` | `#BBBAB4` | SVG branch strokes (where lines must read against page) |
| `--vellum-shade-3` | `#9C9B96` | Image-card label color (decorative) — **not used as a border** |
| `--vellum-shade-4` | `#7D7C78` | — |

**Border philosophy:** dividers and card outlines should be *indicative*, not loud. Every border in normal state uses `--surface-divider` (`--vellum-shade-half`). Only on hover/focus does the border deepen, and only to `--surface-divider-hover` (`--vellum-shade-1`) — never deeper. Anything darker than that reads as a heavy outline against vellum and breaks the editorial feel.

### Scarlet (brand)
| Token | Hex | Usage |
| --- | --- | --- |
| `--scarlet-tint-7` | `#FDE2DF` | Tinted accent surface |
| `--scarlet` | `#F51D00` | Primary CTAs, brand emphasis |
| `--scarlet-shade-1` | `#D61900` | Scarlet hover |
| `--scarlet-shade-2` | `#B71500` | Scarlet active |

### Semantic aliases
| Token | Maps to | Usage |
| --- | --- | --- |
| `--text-primary` | `--ink` | Body and heading text |
| `--text-secondary` | `--ink-tint-3` | Secondary body, sub-headlines |
| `--text-tertiary` | `--ink-tint-4` | Eyebrows, captions, placeholder |
| `--text-on-dark` | `--vellum` | Text on ink surfaces |
| `--surface-page` | `--vellum` | Page background |
| `--surface-card` | `--vellum-tint-7` | Card / panel surface |
| `--surface-alt` | `--vellum-shade-1` | Alt section background |
| `--surface-divider` | `--vellum-shade-2` | Hairlines |
| `--surface-inverse` | `--ink` | Dark fold background |

---

## 2. Typography

### Families

| Family | CSS variable | Role | Files |
| --- | --- | --- | --- |
| **Season Mix** | `--ff-display` | All display text (hero, headings, eyebrows in display register, image-card city labels) | `SeasonMix-Regular.ttf` (400), `SeasonMix-Medium.ttf` (500) — both in `public/fonts/` |
| **Mallory Compact** | `--ff-sans` / `--ff-sans-compact` | ALL non-display text across the entire page: buttons, nav, body, labels, eyebrows, cards, footer. No exceptions. Both variables resolve to the same Mallory Compact font. | Loaded via `next/font/local` in `app/layout.tsx` |

**Mallory Narrow and Mallory Regular are forbidden** in this codebase. Only Mallory Compact is used site-wide for all non-display text. No exceptions.

When the missing files arrive, register them via `next/font/local` in `app/layout.tsx` and the existing `--ff-sans` / `--ff-sans-compact` variables will start using them — no other CSS changes needed.

### Type scale — the canonical system

The scale has three tiers. Each token has a fixed identity and a single job. Don't invent new sizes inline — if you need something not in the scale, add it here first, then to globals.css.

#### Display tier — Season Mix (`--ff-display`)

Headings and editorial display. Always uses `text-wrap: balance` so multi-line breaks fall naturally. Letter-spacing tightens as size grows (large display type rendered at body letter-spacing looks loose).

| Token | Size | Line-height | Letter-spacing | Use |
| --- | --- | --- | --- | --- |
| `t-hero` | `clamp(56px, 7.5vw, 96px)` | `1.05` | `-0.035em` | The largest line on the page. **Reserved.** One per page, max — used by the page's primary headline. |
| `t-display` | `clamp(40px, 5.4vw, 56px)` | `1.07` | `-0.03em` | Section openers below the hero. The "next biggest" tier after the hero headline. |
| `t-h1` | `clamp(36px, 4.5vw, 48px)` | `1.10` | `-0.025em` | Final-CTA heading, large feature opener. |
| `t-h2` | `clamp(28px, 3.4vw, 36px)` | `1.15` | `-0.02em` | Section h2s ("Built for stories that cross borders"). |
| `t-h3` | `clamp(22px, 2.4vw, 28px)` | `1.20` | `-0.015em` | Bento-cell titles, mid-level headings. |
| `t-h4` | `20px` | `1.25` | `-0.01em` | Card titles, in-card headings. |

#### Body tier — Mallory MP Compact (`--ff-sans-compact`)

Reading text. `text-wrap: pretty` to avoid orphans. Normal line-height (1.50–1.65) — never trimmed. Bold (700) only when emphasizing a noun within prose; otherwise weight 400.

| Token | Size | Line-height | Letter-spacing | Use |
| --- | --- | --- | --- | --- |
| `t-lead` | `20px` | `1.50` | `0` | Opening paragraph after a heading. Substantial enough to anchor a fold. |
| `t-subheading` | `18px` | `1.50` | `0` | Hero sub-headlines (when used), section subheads, prominent sub-copy. |
| `t-body` | `16px` | `1.55` | `0` | Default body copy. The story-passage textarea uses this size. |
| `t-body-sm` | `14px` | `1.55` | `0.003em` | Card body, locale-card story text, secondary copy. |
| `t-body-xs` | `12px` | `1.50` | `0.005em` | Micro copy: footnotes, legal, dense data. Use sparingly. |

#### UI tier — Mallory MP regular (`--ff-sans`), trimmed

Buttons, eyebrows, nav, labels — anywhere a label sits in a fixed-height container. Always `line-height: 1` so glyphs sit centered. Vertical centering is handled by `min-height` + flex centering on the parent, not by line-height padding. Bold (700) by default for visual weight at small sizes.

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
- **Final-CTA stack:** `t-h1` (CTA headline, ink-on-vellum) → input or button.

Never stack two tokens of the same tier directly (e.g. two `t-h2`s adjacent). The hierarchy collapses.

### Trim-height rule

**All non-body Mallory text uses `line-height: 1`** with vertical padding chosen so the visible glyph sits centered in its container. This applies to every UI-tier token (`t-label-lg`, `t-label`, `t-nav`, `t-eyebrow`). The reason: Mallory rendered at non-body sizes with the default browser line-height adds top/bottom space that floats the glyph above the optical center of buttons, eyebrow strips, and tabs. Setting `line-height: 1` collapses that gap; matched padding on the parent restores breathing room.

**Body text (Mallory Compact) keeps a normal line-height** (1.50–1.65). Trim is for UI labels, not paragraphs.

For elements that need a fixed visible height (buttons, eyebrow strips), enforce it via `min-height` so the trim-height change doesn't shrink the click target. Buttons must hit the **40px minimum** specified in §6.

### Trim-height rule

**All non-body Mallory text uses `line-height: 1`** with vertical padding chosen so the visible glyph sits centered in its container. This applies to every token marked "trim" above. The reason: Mallory regular at non-body sizes loaded with the default browser line-height adds top/bottom space that makes the glyph float above the optical center of buttons, eyebrow strips, and tabs. Setting `line-height: 1` collapses that gap; matched padding restores vertical breathing room.

**Body text (Mallory Compact) keeps a normal line-height** (1.50–1.65). Trim is for UI labels, not paragraphs.

For elements that need a fixed visible height (buttons, eyebrow strips), enforce it via `min-height` so the trim-height change doesn't shrink the click target. Buttons must hit the **40px minimum** specified in §6.

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

### Containers

| Token | px | Usage |
| --- | --- | --- |
| `--container` | 1200 | Default max-width for full-bleed sections |
| `--container-narrow` | 720 | Story box, focused reading containers |

### Section padding

- Hero: `var(--sp-20) var(--sp-8) var(--sp-4)` (160 / 64 / 32) — top space dramatic, bottom tight because cascade follows
- Cascade: `0 var(--sp-8) var(--sp-15)` (0 / 64 / 120)
- Body sections (bento, cards): `var(--sp-12) var(--sp-8)` (96 / 64)
- Final CTA / dark fold: `var(--sp-20) var(--sp-8)` (160 / 64)

---

## 4. Radii

Concentric rule (from the polish skill): **outer radius = inner radius + padding**. Mismatched nested radii is the most common thing that makes interfaces feel off.

| Token | px | Usage |
| --- | --- | --- |
| `--r-btn` | 4 | Square buttons (rare — pill is default) |
| `--r-input` | 4 | Square inputs |
| `--r-tag` | 4 | Tags, chips |
| `--r-card` | **14** | Cards, locale-cascade wrapper, bento cells, use-case cards. Softened from the original 6px so cards read as friendly editorial blocks rather than crisp tech-product boxes. |
| `--r-card-inner` | **8** | Nested elements inside cards — image frames, inner thumbnails, anything that floats with padding inside a card surface. |
| `--r-pill` | 32 | Pill buttons |
| `--r-input-outer` | 16 | Outer adapter input box (vellum-shaded outer) — story box stays close to its original radius; do not soften this one |
| `--r-input-inner` | 10 | Inner white surface inside `--r-input-outer` (with `sp-1` padding → concentric: 16 = 10 + 8 ✓) |
| `--r-tw-outer` | 20 | Translation-window outer (Satyam's existing) |
| `--r-tw-inner` | 12 | Translation-window inner panel (with `sp-1` padding → 20 = 12 + 8 ✓) |

**Card radius rule:** every card-level surface on the page uses `--r-card` (14px). The story box at the top of the hero is the *one* exception — it uses `--r-input-outer` (16px) because its concentric inner element requires that math. Don't soften the story box; do soften everything else.

---

## 5. Motion

### Easing

| Token | Curve | Usage |
| --- | --- | --- |
| `--ease` | `cubic-bezier(0.22, 1, 0.36, 1)` | All interactive transitions and entrance animations |

### Durations

| Use | ms |
| --- | --- |
| Color/border hover | 120 |
| Border + shadow hover | 160 |
| Transform / lift on hover | 250 |
| Entrance fade-up | 700 |
| Branch draw-in | 900 |
| Translation-window adapt fade | 500 |

### Entrance staggers

When more than one peer enters together, stagger by **120ms** between siblings. Locale cards use 0.20s, 0.32s, 0.44s, 0.56s, 0.68s — exactly 120ms apart. Branch paths stagger by 80ms (slightly faster because they're decorative threads rather than content).

### Interruptibility

Use **CSS transitions** for interactive state changes (hover, focus, active) so they can be interrupted mid-flight. Reserve **CSS keyframes** for one-time staged sequences (entrance fades, branch draw-in).

### Scale on press

Every interactive button uses `transform: scale(0.96)` on `:active`. Never below 0.95 — anything lower feels exaggerated.

### `will-change`

Only on `transform`, `opacity`, `filter`. Never `will-change: all`. Only add when first-frame stutter is observable.

### `prefers-reduced-motion`

Globe rotation honors `prefers-reduced-motion`. New animations should too — set duration to 0 or skip the keyframe entirely.

---

## 6. Component patterns

### 6.1 Buttons

**Primary scarlet pill** (`btn-global`, `btn-brand`, etc.):
- Family `--ff-sans`, weight 700, size 14px, line-height 1 (trimmed), letter-spacing 0.005em
- Background `--scarlet`, color `--vellum`, no border
- Padding `10px var(--sp-3)`, border-radius `var(--r-pill)`, min-height **40px**
- Hover → `--scarlet-shade-1`, active → `--scarlet-shade-2` + `scale(0.96)`

**Secondary white pill** (`btn-demo`):
- Same type spec as primary
- Background `--vellum-tint-7`, color `--text-primary`, 1px border `--surface-divider`
- Padding `10px var(--sp-2-5)`, min-height **40px**
- Hover → background `--vellum-shade-1`, border `--vellum-shade-3`; active → `scale(0.96)`

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
│  │  [Demo story]                       [Take this global →] │
│  └─────────────────────────────────────────────────────┘  │
─────────────────────────────────────────────────────────────
```

Concentric radii: 16 = 10 + 6 (close enough to 8 — acceptable since the inner stroke visually splits the difference).

Outer max-width **`--container-narrow` (720px)** — the story passage should feel like a focused reading surface, not an enterprise form.

Hover/focus state: outer border deepens to `--vellum-shade-3`, shadow lifts (1+2 / 8+24 layered).

### 6.3 Locale cards (cascade)

Each card:
- Outer container `--surface-card`, 1px `--surface-divider`, radius `--r-card` (6px), `overflow: hidden`
- Eyebrow strip: flag + country name in `t-eyebrow` (Mallory regular, trimmed line-height 1, all caps), background `--vellum-tint-3`, bottom 1px `--surface-divider`
- Image area: 4:3 aspect, current placeholder is a `--vellum-shade-1 → --vellum-tint-3` gradient with city name in `t-display` faded out. Replace with real photography per §7.
- Story text: `t-body-sm` (Mallory Compact 14px / 1.55), padded `sp-3`, color `--text-secondary`
- Hover: `translateY(-2px)` + layered shadow (4+6 / 16+32 / 2+4)

### 6.4 Cascade branches

5 SVG paths from a single anchor `(540, 0)` in viewBox `0 0 1080 96` to centers of the 5 columns at the bottom (`108, 324, 540, 756, 972`). The middle path is straight; the four outer paths use cubic beziers with control points at midheight to create a smooth fan.

Stroke `--vellum-shade-2`, 1px, no fill. On entry each path animates `stroke-dashoffset: 600 → 0` with the staggered delays in §5.

### 6.5 Globe (existing — Satyam)

Hand-coded canvas wireframe with cursor-repel physics, multilingual character glyphs, and scarlet hover halo. Rotation paused under `prefers-reduced-motion`. Anchored to bottom of hero, only top hemisphere visible. Don't touch unless tasked.

---

## 7. Detail principles (the polish layer)

These ride on top of every component, drawn from the [make-interfaces-feel-better](https://github.com/jakubkrehel/make-interfaces-feel-better) skill. The skill is installed at `~/.agents/skills/make-interfaces-feel-better/` for reference.

| # | Principle | Atlas application |
| --- | --- | --- |
| 1 | **Concentric border radius** | Outer = inner + padding. Enforced for the adapter input (16 / 10 with sp-1) and translation window (20 / 12 with sp-1). |
| 2 | **Optical over geometric alignment** | Button `→` arrows offset by 4–6px from text via `gap: var(--sp-1)`. Flag emoji + country label horizontally aligned via flex `gap: var(--sp-1)`, no padding tweaks needed. |
| 3 | **Shadows over borders for depth** | Hover lifts use layered `box-shadow` with multiple transparency stops, not heavier borders. Hairline borders stay at 1px. |
| 4 | **Interruptible animations** | Hover/active use `transition`. Entrance and branch draw-in use `@keyframes`. |
| 5 | **Split + stagger entrances** | Locale cards stagger by 120ms (0.20s through 0.68s); branches stagger by 80ms. |
| 6 | **Subtle exits** | No exit animations on this page yet. When added, use small `translateY` (8–12px) not full height. |
| 7 | **Contextual icon animations** | When buttons swap state (e.g. "Take this global →" → "Adapting…"), icons cross-fade with `cubic-bezier(0.2, 0, 0, 1)`, opacity 0↔1, scale 0.25↔1, blur 4px↔0. Both icons in DOM, one absolute. |
| 8 | **Font smoothing** | `-webkit-font-smoothing: antialiased` on body. macOS rendering is crisper. |
| 9 | **Tabular numbers** | Any numeric counter uses `font-variant-numeric: tabular-nums`. The "247 words" counter and stat numbers (`bcell-stat`) already do. |
| 10 | **Text wrapping** | All headings get `text-wrap: balance`. All body text gets `text-wrap: pretty`. Defined in the type scale tokens. |
| 11 | **Image outlines** | Once real photography lands in locale cards, add `outline: 1px solid rgba(0,0,0,0.1)` — pure black at low opacity. Never tinted (slate, zinc, etc.) — those pick up surface color and read as dirt. |
| 12 | **Scale on press** | All buttons `transform: scale(0.96)` on `:active`. Always 0.96, never lower. |
| 13 | **Skip animation on page-load** for already-visible content | When framer-motion arrives, use `initial={false}` on `AnimatePresence` for default-state elements. Today the page has no `AnimatePresence` so this is documentation-only. |
| 14 | **Never `transition: all`** | Always specify properties: `transition: background 120ms var(--ease), transform 120ms var(--ease)`. Confirmed in code review. |
| 15 | **Sparse `will-change`** | Only on `.bcell`, `.card`, `.locale-card` for `transform`. Never `will-change: all`. |
| 16 | **40px hit area minimum** | All buttons enforce `min-height: 40px`. Nav links use `padding: 12px 4px` (= 40px effective hit on the 14px font). Tab buttons have `padding: 5px 10px` and need a pseudo-element extension if their visible height drops below 40px. |

### Trim-height (project-specific addition)

All non-body Mallory uses `line-height: 1`. See §2. This is the rule that keeps button text and eyebrow labels optically centered.

---

## 8. Font file requirements

**Files needed in `public/fonts/`:**

✅ Already present:
- `SeasonMix-Regular.ttf`
- `SeasonMix-Medium.ttf`

❌ Missing — please add:
- `Mallory-Regular.ttf` (weight 400)
- `Mallory-Bold.ttf` (weight 700)
- `Mallory-Compact-Regular.ttf` (weight 400)
- `Mallory-Compact-Bold.ttf` (weight 700)

🚫 Removed:
- Mallory Narrow files are no longer registered. Files can stay on disk for reference but are not loaded.

When the four missing files are added, register them in `app/layout.tsx` via `next/font/local` and the `--ff-sans` and `--ff-sans-compact` variables will pick them up automatically.

---

## 9. Update protocol

Any change to a value in this codebase that has a counterpart here:
1. Edit `STYLEGUIDE.md` first (this file).
2. Edit `app/globals.css` to match.
3. Verify in browser preview.

Drift between this file and the CSS is a bug. If you find drift, the styleguide wins — update the CSS.
