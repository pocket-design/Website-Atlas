# Pocket Atlas — Design System

**This document is the single source of truth.** Every CSS rule in
`app/globals.css`, every component, and every type/spacing/color decision
in this codebase must derive from values defined here. If a token is
added or changed in CSS, it must be added or changed here first.

This file is merged from two earlier docs: the hardik branch's
`styleguide.md` (source-of-truth conventions, motion + component patterns)
and main's previous `docs/design-system.md` (button system, breakpoints,
typography hierarchy). It is reconciled against the actual tokens shipping
in `app/globals.css`.

The page is also reviewed against the
[`make-interfaces-feel-better`](https://github.com/jakubkrehel/make-interfaces-feel-better)
skill principles (concentric radii, optical alignment, scale-on-press,
trim-height, etc.) — those rules apply on top of this document.

---

## Token-naming convention

Two parallel naming layers exist in `app/globals.css`. They are intentional —
do not "collapse" one into the other.

| Layer | Block in `globals.css` | Prefix | Used by |
|---|---|---|---|
| **Raw tokens** | `:root { … }` | unprefixed: `--ink`, `--sp-3`, `--r-card`, `--ff-display` | hand-written CSS, inline `style={{ … }}` |
| **Tailwind `@theme` mirror** | `@theme { … }` (top of file) | prefixed: `--color-ink`, `--spacing-3`, `--radius-card`, `--font-display` | Tailwind v4 utility class generation (e.g. `bg-ink`, `p-3`, `rounded-card`, `font-display`) |

The `@theme` block mirrors a subset of the raw tokens so Tailwind v4 can
generate utility classes. **The raw tokens are authoritative.** When you add
or change a value, edit the raw `:root` token first; then if the value should
be a Tailwind utility too, mirror it in `@theme`.

---

## 1. Color tokens

Three families: **Ink** (near-black neutrals), **Vellum** (cream surfaces and
warm neutrals), **Scarlet** (brand accent). No cool greys or blue-tinted
neutrals — the warmth of Vellum is what makes the page editorial rather than
generic-tech.

### Ink — text, dark surfaces

| Token | Hex | Usage |
|---|---|---|
| `--ink-tint-7` | `#E2E2E2` | Lightest disabled text on dark |
| `--ink-tint-6` | `#C6C6C6` | — |
| `--ink-tint-5` | `#A9A9A9` | Empty state, placeholder, `--text-muted` |
| `--ink-tint-4` | `#8D8D8D` | Tertiary text, `--text-tertiary` |
| `--ink-tint-3` | `#717171` | Secondary text, `--text-secondary` |
| `--ink-tint-2` | `#545454` | — |
| `--ink-tint-1` | `#383838` | Primary-button hover |
| `--ink` | `#1C1C1C` | Primary text, dark surfaces, `--text-primary`, `--surface-inverse` |
| `--ink-shade-1` | `#181818` | — |
| `--ink-shade-2` | `#151515` | Primary-button active |
| `--ink-shade-3` | `#111111` | — |

### Vellum — page surface, light neutrals

| Token | Hex | Usage |
|---|---|---|
| `--vellum-tint-7` | `#FEFEFD` | Card / inner-input white, `--surface-card` |
| `--vellum-tint-6` | `#FDFDFB` | — |
| `--vellum-tint-5` | `#FDFCF9` | — |
| `--vellum-tint-4` | `#FCFCF8` | — |
| `--vellum-tint-3` | `#FBFBF6` | Subtle surface tint, locale-card eyebrow strip |
| `--vellum-tint-2` | `#FBFAF4` | — |
| `--vellum-tint-1` | `#FAF9F2` | — |
| `--vellum` | `#FAF9F1` | Page background, `--surface-page`, `--text-on-dark` |
| `--vellum-shade-1` | `#DAD9D2` | Outer-input beige, alt surface, hover/focus border, `--surface-alt`, `--surface-divider-hover` |
| `--vellum-shade-2` | `#BBBAB4` | SVG branch strokes, `--surface-divider` |
| `--vellum-shade-3` | `#9C9B96` | Image-card label colour (decorative — NOT a border) |
| `--vellum-shade-4` | `#7D7C78` | — |
| `--vellum-shade-5` | `#5D5D5A` | — |
| `--vellum-shade-6` | `#3E3E3C` | — |
| `--vellum-shade-7` | `#1F1F1E` | — |

**Border philosophy:** dividers and card outlines should be *indicative*,
not loud. In normal state use `var(--surface-divider)` (`#BBBAB4`).
On hover/focus deepen to `var(--surface-divider-hover)` (`#DAD9D2`).
Anything darker reads as a heavy outline against vellum and breaks the
editorial feel.

### Scarlet — brand

| Token | Hex | Usage |
|---|---|---|
| `--scarlet-tint-7` | `#FDE2DF` | Tinted accent surface |
| `--scarlet-tint-6` | `#FCC6BF` | — |
| `--scarlet-tint-3` | `#F8715F` | — |
| `--scarlet` | `#F51D00` | Primary CTAs, brand emphasis |
| `--scarlet-shade-1` | `#D61900` | Scarlet hover |
| `--scarlet-shade-2` | `#B71500` | Scarlet active |

### Semantic colour aliases

| Token | Maps to | Usage |
|---|---|---|
| `--text-primary` | `--ink` | Body and heading text |
| `--text-secondary` | `--ink-tint-3` | Secondary body, sub-headlines |
| `--text-tertiary` | `--ink-tint-4` | Eyebrows, captions, placeholder |
| `--text-disabled` | `--ink-tint-5` | Disabled |
| `--text-muted` | `--ink-tint-5` | Empty states, placeholder prose |
| `--text-on-dark` | `--vellum` | Text on ink surfaces |
| `--surface-page` | `--vellum` | Page background |
| `--surface-card` | `--vellum-tint-7` | Card / panel surface |
| `--surface-alt` | `--vellum-shade-1` | Alt section background |
| `--surface-divider` | `--vellum-shade-2` | Hairlines, default border |
| `--surface-divider-hover` | `--vellum-shade-1` | Slight emphasis on hover/focus |
| `--surface-inverse` | `--ink` | Dark fold background |

---

## 2. Typography

### Families

Two typefaces, one rule. Any text that reads as a heading uses **Season Mix**.
Everything else uses **Mallory MP Narrow**.

| Token | Resolves to | Use |
|---|---|---|
| `--ff-display` | `Season Mix, Georgia, serif` | Headings (Season Mix Regular 400 only) |
| `--ff-sans` | `Mallory MP Narrow, Inter, system-ui, sans-serif` | Everything non-heading |
| `--ff-sans-compact` | Currently aliased to `--ff-sans` | Reserved for future Mallory MP Compact variant |

Both typefaces are self-hosted from `public/fonts/`:

| File | Family token | Weight |
|---|---|---|
| `SeasonMix-Regular.ttf` | `--ff-display` | 400 |
| `Mallory-MP-Narrow-Book.ttf` | `--ff-sans` | 400 |
| `Mallory-MP-Narrow-Bold.ttf` | `--ff-sans` | 700 |

Fonts are loaded via `next/font/local` in `app/layout.tsx` and exposed as
`--font-season-mix` and `--font-mallory-narrow` CSS variables that
`--ff-display` / `--ff-sans` reference.

### Type scale

All scale values are emitted as `.t-*` utility classes in `app/globals.css`.
Apply them directly (e.g. `<h1 className="t-display">`).

| Class | Family | Size | Line height | Tracking | Use |
|---|---|---|---|---|---|
| `.t-display` | Season Mix 400 | `clamp(40px, 5.4vw, 56px)` | `1.07` | `-0.03em` | Hero h1 |
| `.t-h1` | Season Mix 400 | `clamp(36px, 4.5vw, 48px)` | `1.10` | `-0.025em` | Page titles |
| `.t-h2` | Season Mix 400 | `clamp(28px, 3.4vw, 36px)` | `1.15` | `-0.02em` | Section headlines |
| `.t-h3` | Season Mix 400 | `clamp(22px, 2.4vw, 28px)` | `1.20` | `-0.015em` | Block / card titles |
| `.t-h4` | Season Mix 400 | `20px` | `1.25` | `-0.01em` | Writer names · stat labels |
| `.t-subheading` | Mallory 400 | `18px` | `1.5` | `0` | Lead paragraph · hero body |
| `.t-body` | Mallory 400 | `16px` | `1.55` | `0` | Default paragraph |
| `.t-body-sm` | Mallory 400 | `14px` | `1.45` | `0.003em` | Dense body · footer links |
| `.t-label` | Mallory 400 | `13px` | `1.4` | `0.005em` | UI labels · chips · stats |
| `.t-eyebrow` | Mallory **700** | `12px` | `1.4` | `0.08em` UPPERCASE | Section eyebrows |
| `.t-caption` | Mallory 400 | `11px` | `1.4` | `0.02em` | Meta · timestamps · footnotes |

### Font-size tokens

These are the raw size scale that the `.t-*` utilities consume. Reference
them directly only when a `.t-*` utility doesn't fit your case.

| Token | Value |
|---|---|
| `--fs-xs` | `11px` |
| `--fs-sm` | `12px` |
| `--fs-ui` | `13px` |
| `--fs-base` | `14px` |
| `--fs-md` | `15px` |
| `--fs-lg` | `18px` |
| `--fs-xl` | `20px` |
| `--fs-2xl` | `22px` |

### Line-height tokens

| Token | Value |
|---|---|
| `--lh-1` | `1` |
| `--lh-snug` | `1.25` |
| `--lh-normal` | `1.5` |
| `--lh-spacious` | `1.7` |

### Letter-spacing tokens

| Token | Value |
|---|---|
| `--ls-normal` | `0.005em` |
| `--ls-wide` | `0.01em` |
| `--ls-wider` | `0.02em` |
| `--ls-caps` | `0.08em` |

### Font weights

| Token | Value | Note |
|---|---|---|
| `--fw-regular` | `400` | Mallory Book; Season Mix Regular |
| `--fw-medium` | `500` | reserved (no glyphs shipped) |
| `--fw-semibold` | `600` | reserved (no glyphs shipped) |
| `--fw-bold` | `700` | Mallory Bold |

**Available weights today: 400 and 700 only.** Do not specify 500 or 600 in
new code unless we ship those weight files.

### Pairing rules

- Heading + body in the same block: heading is `.t-h2/-h3/-h4`, body is
  `.t-body-sm` or `.t-body`. Never mix two `.t-h*` adjacent siblings.
- Eyebrow + heading: `.t-eyebrow` directly above `.t-h2`/`.t-h1` works because
  the eyebrow is so small (12px Mallory bold uppercase) that it reads as a label.
- Trim-height rule: when text needs to be perfectly centred in a fixed-height
  pill or button, set `line-height: var(--lh-1)` and rely on CSS `text-box-trim`
  to remove half-leading.

### Voice rules

- Sentence case for everything except buttons and eyebrows. Eyebrows go
  UPPERCASE via `letter-spacing: var(--ls-caps)`.
- Numbers in stats and trust signals get `font-variant-numeric: tabular-nums`
  so digit widths line up across rows.

---

## 3. Spacing — 8 px grid

The base unit is `--sp-1 = 8px`. Numeric multiples are integer multiples
of 8, with fractional half-steps for tight UI rhythm.

| Token | Value | Common use |
|---|---|---|
| `--sp-half` | `4px` | Tightest internal gap (e.g. dropdown padding) |
| `--sp-1` | `8px` | Default chip / inline gap |
| `--sp-1-5` | `12px` | Small section gap (e.g. card padding row) |
| `--sp-2` | `16px` | Default card / element padding |
| `--sp-2-5` | `20px` | — |
| `--sp-3` | `24px` | Default vertical rhythm |
| `--sp-4` | `32px` | Section-header bottom margin |
| `--sp-5` | `40px` | — |
| `--sp-6` | `48px` | — |
| `--sp-8` | `64px` | Section side padding |
| `--sp-10` | `80px` | — |
| `--sp-12` | `96px` | Large section vertical padding |
| `--sp-15` | `120px` | — |
| `--sp-20` | `160px` | Hero / final-CTA vertical padding |

### Container widths

| Token | Value | Use |
|---|---|---|
| `--container-narrow` | `720px` | Single-column prose |
| `--container` | `1200px` | Default page container — bento, cascade, proof, stats |
| `--container-wide` | `1376px` | Wide layouts (testimonials ticker, etc.) |

### Section padding convention

Top-level sections use the BEM-style `.<section>__wrap` pattern (see
`.atlas-bento__wrap` and `.cascade__wrap`):

```html
<section class="atlas-bento">         <!-- full-width, has padding -->
  <div class="atlas-bento__wrap">     <!-- max-width: var(--container), centered -->
    <div class="atlas-bento__grid">…</div>
  </div>
</section>
```

```css
.atlas-bento { padding: var(--sp-12) var(--sp-8); }
.atlas-bento__wrap {
  position: relative;
  max-width: var(--container);
  margin: 0 auto;
}
```

---

## 4. Radii

Concentric radii rule: when a child element sits inside a parent with
padding `P`, the child's radius should equal the parent's radius minus `P`.
The `_inner` / `_outer` token pairs encode common pairs.

| Token | Value | Use |
|---|---|---|
| `--r-sm` | `6px` | Small chips, tag |
| `--r-input` | `6px` | Form inputs |
| `--r-tag` | `6px` | Chips / tags |
| `--r-btn` | `8px` | Buttons |
| `--r-card-inner` | `8px` | Inner element of a card |
| `--r-input-inner` | `10px` | Inner panel inside an outer-input frame |
| `--r-card` | `12px` | Cards (default) |
| `--r-tw-inner` | `12px` | Translation-window inner panel |
| `--r-input-outer` | `16px` | Outer-input frame |
| `--r-panel` | `16px` | Panels |
| `--r-tw-outer` | `20px` | Translation-window outer frame |
| `--r-pill` | `9999px` | Pill / chip with fully-rounded ends |
| `--r-full` | `9999px` | Same as pill — circles / fully-rounded |

---

## 5. Shadows

Use the smallest shadow that achieves the effect. Avoid stacking shadows on
nested elements.

| Token | Use |
|---|---|
| `--shadow-xs` | Subtle outline (button inset, pressed state) |
| `--shadow-sm` | Light raise (default button) |
| `--shadow-md` | Card / panel default — *alias of `--shadow-border`* |
| `--shadow-border` | Hairline + 2 px lift — default for cards |
| `--shadow-border-hover` | Hover state of border-style cards |
| `--shadow-card` | Same as `--shadow-border` (semantic alias) |
| `--shadow-card-hover` | Same as `--shadow-border-hover` (semantic alias) |
| `--shadow-elevated` | Floating UI (dial-kit, modals) |
| `--shadow-btn-brand` | Scarlet branded glow on primary CTA |

---

## 6. Motion

### Easing

| Token | Value | Use |
|---|---|---|
| `--ease` | `cubic-bezier(0.22, 1, 0.36, 1)` | Default ease-out for entrances |
| `--ease-out` | `cubic-bezier(0.4, 0, 0.2, 1)` | Material-style ease-out |
| `--ease-spring` | `cubic-bezier(0.34, 1.56, 0.64, 1)` | Press-bounce (scale on press) |

### Durations

| Token | Value | Use |
|---|---|---|
| `--dur-instant` | `120ms` | Hover state changes |
| `--dur-fast` | `160ms` | UI state transitions |
| `--dur-normal` | `200ms` | Default transition |
| `--dur-slow` | `300ms` | Sheen / reveal animations |
| `--dur-slower` | `500ms` | Long fades, dot trails |

### Entrance staggers

When a section enters the viewport, stagger child reveals by `40–80ms`
to suggest assembly without becoming sluggish. See `.hero-eyebrow`,
`.hero-title` in `app/globals.css` for the reference pattern.

### Interruptibility

All transitions must be interruptible — never use `transition-delay` to
queue a long sequence. A user who hovers out should see the reverse
animation start immediately, not finish the forward animation first.

### Scale on press

Buttons get `transform: scale(0.95)` on `:active` with
`transition: transform var(--dur-normal) var(--ease-spring)`. The spring
easing gives a small bounce on release.

### `prefers-reduced-motion`

Any non-essential animation must be wrapped:

```css
@media (prefers-reduced-motion: reduce) {
  .foo-animation { transition: none !important; animation: none !important; }
}
```

For scroll-driven animations (e.g. `BattleTestedStats` while it was live),
use `useReducedMotion()` from `motion/react` to short-circuit to a static
fallback layout.

### `will-change`

Use only on elements that are actively animating *right now*. Remove (set
to `auto`) once the animation completes. Permanent `will-change` is a
memory leak.

---

## 7. Z-index

| Token | Value | Use |
|---|---|---|
| `--z-base` | `0` | Page background, dial-kit hero bg |
| `--z-raised` | `1` | Default in-flow elements raised over background |
| `--z-overlay` | `3` | Loading / fading overlays inside a card |
| `--z-nav` | `100` | Floating top navigation |

Avoid arbitrary z-indices. If you need a new layer, add a named token here
first.

---

## 8. Glass / nav surface

| Token | Value | Use |
|---|---|---|
| `--glass-bg` | `rgba(250, 249, 241, 0.82)` | Nav pill background |
| `--glass-blur` | `blur(32px) saturate(1.8)` | Nav backdrop-filter |
| `--border-glass` | `1px solid rgba(255, 255, 255, 0.4)` | Nav border |
| `--border-hairline` | `1px solid var(--surface-divider)` | Default 1 px divider for cards, locale cards, proof cards |

**`backdrop-filter` ordering:** always declare `-webkit-backdrop-filter`
*before* the unprefixed `backdrop-filter`. Tailwind v4's PostCSS minifier
strips the unprefixed declaration if the prefixed one is declared after.
This bug was fixed in PR #2 and again for `.site-nav` in commit dbc8dd3.

---

## 9. Component patterns

### 9.1 Buttons

Three button hierarchies. **All buttons share** the same height
(`min-height: 40px`), padding (`10px var(--sp-3)`), radius
(`var(--r-pill)`), font (Mallory bold), and press-state
(`transform: scale(0.95); transition: var(--dur-normal) var(--ease-spring)`).

#### Primary — conversion-critical action

Used by hero CTA, "Adapt the story" in `HeroAdapter`, "Try it now" in nav.
Class: `.btn-global` or `.btn-primary`.

| State | Background | Text |
|---|---|---|
| default | `linear-gradient(to bottom, #FF3318, var(--scarlet))` | `var(--vellum)` |
| `:hover` | `linear-gradient(to bottom, var(--scarlet), var(--scarlet-shade-1))` | `var(--vellum)` |
| `:active` | `linear-gradient(to bottom, var(--scarlet-shade-1), var(--scarlet-shade-2))` | `var(--vellum)` + `scale(0.95)` |
| `:disabled` | same default, `opacity: 0.6` | same |

Shadow: `var(--shadow-elevated)` default, `var(--shadow-border)` on active
(to reinforce the pressed feel).

#### Secondary — optional / read-more action

Used by "Listen" in testimonials. Class: `.btn-secondary`,
`.testimonial-card__listen`.

| State | Background | Text | Border |
|---|---|---|---|
| default | transparent | `var(--text-primary)` | `1px solid var(--text-primary)` |
| `:hover` | `var(--text-primary)` | `var(--surface-page)` | same |

#### Brand-secondary (rarely used)

A scarlet outline button — used when scarlet emphasis is needed but the
context already has a primary CTA. Reserved.

### 9.2 Inputs

Concentric two-layer pattern (outer + inner) with the inner having
`var(--r-input-inner)` and the outer having `var(--r-input-outer)`.

```html
<div class="adapt-input">           <!-- outer: --r-input-outer + --shadow-border -->
  <div class="adapt-input-inner">   <!-- inner: --r-input-inner + --border-hairline -->
    <textarea class="adapt-input-textarea">…</textarea>
  </div>
</div>
```

Hover/focus deepens the outer border from `--surface-divider` to
`--surface-divider-hover` only — never deeper.

### 9.3 Cards

Three flavours:

| Flavour | Pattern |
|---|---|
| Bento (image background) | `border-radius: var(--r-card)`, `border: 1px solid rgba(255,255,255,0.12)`, contains absolutely-positioned `bg` + `blur` + `vignette` + `content` layers |
| Locale (cascade) | `border-right: var(--border-hairline)` (except last), no radius, edge-aligned columns inside `.cascade-grid` |
| Proof | `padding: var(--sp-4)`, `border: var(--border-hairline)`, `border-radius: var(--r-card)`, `background: var(--surface-card)` |

### 9.4 Section header

`<div class="section-header"><h2 class="t-h3">…</h2></div>`. Header is
`max-width: var(--container)`, `margin: 0 auto var(--sp-4)`, `text-align: left`.

---

## 10. Tailwind v4 `@theme` block

The `@theme { … }` block at the top of `app/globals.css` mirrors a subset
of the raw tokens above so Tailwind v4 can generate utility classes. The
mirror is one-way: edit the raw token first, then update `@theme` if the
utility is needed.

| Raw token | `@theme` mirror | Tailwind utility |
|---|---|---|
| `--ink` | `--color-ink: #1C1C1C` | `bg-ink`, `text-ink`, `border-ink` |
| `--vellum` | `--color-vellum: #FAF9F1` | `bg-vellum`, `text-vellum`, … |
| `--scarlet` | `--color-scarlet: #F51D00` | `bg-scarlet`, `text-scarlet`, … |
| `--ink-tint-3` | `--color-ink-tint-3` | `text-ink-tint-3`, `border-ink-tint-3` |
| `--surface-card` | `--color-card` | `bg-card` |
| `--surface-page` | `--color-page` | `bg-page` |
| `--surface-divider` | `--color-divider` | `border-divider` |
| `--text-primary` | `--color-primary` | `text-primary` |
| `--text-secondary` | `--color-secondary` | `text-secondary` |
| `--text-tertiary` | `--color-tertiary` | `text-tertiary` |
| `--sp-1` (8 px) | `--spacing: 8px` (base) | `p-1`, `m-2`, `gap-3` derive from this |
| `--r-card` | `--radius-card` | `rounded-card` |
| `--r-pill` | `--radius-pill` | `rounded-pill` |
| `--r-btn` | `--radius-btn` | `rounded-btn` |
| `--ff-display` | `--font-display` | `font-display` |
| `--ff-sans` | `--font-sans` | `font-sans` |
| `--container` | `--container-base: 1200px` | `max-w-base` |

**JIT-only:** Tailwind v4 generates utilities only for classes it actually
sees in source files. Adding a token to `@theme` does NOT produce a utility
on its own — you must use the class in JSX/HTML somewhere for it to appear
in the compiled stylesheet.

---

## 11. Breakpoints

Currently expressed inline as media queries — no token scale yet. Common
breakpoints in use:

| Width | Where used |
|---|---|
| `1024px` | Bento grid collapses 4-col → 2-col; testimonial cards shrink |
| `768px` | Bento grid collapses 2-col → 1-col; testimonial cards halve; mobile fallbacks |

If we add breakpoint tokens, prefix with `--bp-` (e.g. `--bp-md: 768px`).

---

## 12. Filenames

| Where | File |
|---|---|
| All raw + `@theme` tokens | `app/globals.css` |
| All utility classes (`.t-*`, etc.) | `app/globals.css` |
| Font files | `public/fonts/` |
| Per-section CSS | `app/globals.css` (one big file by convention) |
| Component-specific CSS imported by JS | not used — all CSS lives in `globals.css` |

---

## 13. When to add a new token

Before adding a token:

1. **Does an existing token cover it?** Prefer reusing `--sp-3` over inventing `--sp-card-padding`.
2. **Is it semantic or raw?** Raw tokens go in the appropriate scale (`--sp-*`, `--fs-*`). Semantic tokens go in the semantic block (`--text-*`, `--surface-*`).
3. **Is it system-wide or component-local?** System-wide tokens go here. Component-local one-offs can live as inline CSS variables on the component.
4. **Add to `:root` first**, then to `@theme` if a Tailwind utility is wanted.
5. **Document it here in the same PR.** If the doc isn't updated, the PR isn't done.

---

## 14. Drift checklist (before any release)

- [ ] Every `var(--…)` in `app/globals.css` resolves to a token defined in `:root` *or* `@theme`
- [ ] Every token defined in `:root` is either documented here or marked as "internal / planned"
- [ ] No hard-coded colour hex outside `:root` and `@theme`
- [ ] No hard-coded pixel value outside the spacing scale (exceptions: `1px` border, animation-specific values)
- [ ] Tailwind utility classes used in JSX have a matching `@theme` token

If any of these fail, fix before merging.
