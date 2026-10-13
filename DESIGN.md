# Weboldalas — Public site design system ("Void")

> Typography floating on black. One violet action, amber sparks, a particle globe.

Applies to the **public marketing site** (`src/app/(public)`). The admin/CRM (`src/app/(admin)`) has its own look and is out of scope.

Inspired by a dark-void SaaS style reference (Linear / Vercel / Runway family). We borrow the *principles*, never another brand's name, logo or signature imagery.

## Principles

1. **The void is the design.** Every section sits on pure `#000000`. No dark-gray panels, no cards, no borders, no shadows.
2. **Scale, not weight.** Headlines are weight **400** at huge sizes with `-0.04em` tracking. Never bold headlines.
3. **Airy body.** Body copy is **18px, weight 200**, line-height 1.5.
4. **One violet action per view.** `#8052ff` is only for the filled primary pill button. Secondary actions are ghost text links.
5. **Amber for emphasis.** `#ffb829` for small uppercase labels above body copy and for accent links.
6. **Flat UI.** No gradients on UI components. Color gradients live only in the particle visual.
7. **Spacious, two-column, zigzag.** Oversized left-aligned headline + generous body. One or two ideas per viewport.
8. **Fast.** Decorative motion is CSS `transform`/`opacity` or a single paused-when-offscreen canvas. No `filter: blur()`, no `backdrop-filter` on page content.

## Tokens

### Color (Tailwind v4 `@theme` names in `globals.css`)

| Token | Value | Use |
|---|---|---|
| `void` | `#000000` | Page canvas, all section backgrounds |
| `bone` | `#ffffff` | Headlines, body text, active nav |
| `ash` | `#9a9a9a` | Ghost links, secondary labels, muted nav |
| `mist` | `#bdbdbd` | Tertiary body, captions |
| `iris` | `#8052ff` | Filled primary button, brand accent dots |
| `saffron` | `#ffb829` | Uppercase labels, emphasis, accent links |
| `verdant` | `#15846e` | Particle palette / deep accent only |

Never use default link blue. Links are white, ash or saffron.

### Typography

- **Family:** Inter Tight (`next/font/google`, free substitute for PP Neue Montreal), `font-feature-settings: "ss01"`.
- **Weights:** 200 (body), 400 (all headings + UI), 600 (uppercase labels/nav).

| Role | Size | Weight | Line height | Tracking |
|---|---|---|---|---|
| display | 78–113px (`clamp`) | 400 | 1.0–1.05* | -0.04em |
| heading-lg | 78px | 400 | 1.05 | -0.04em |
| heading | 48px | 400 | 1.1 | -0.035em |
| heading-sm | 42px | 400 | 1.15 | -0.04em |
| subheading | 36px | 200–400 | 1.2 | -0.02em |
| heading-2xs | 24px | 400 | 1.25 | -0.02em |
| body | 18px | 200 | 1.5 | normal |
| label | 12–14px | 600 | 1.2 | 0.025em, UPPERCASE |

\* Hungarian accents (É, Ő, Ű) need ≥ 1.0 line-height on display text; never clip headlines with `overflow: hidden`.

### Spacing & shape

- Base unit **6px**: 6, 12, 18, 24, 30, 36, 60, 96, 120.
- Section gap **96–120px** desktop, **60–96px** mobile. Max content width **1280px**.
- Radius **24px** for buttons/media; `9999px` only for tiny tags and dots.

## Components

- **Primary button:** `bg-iris text-white`, pill, ~46px tall, 14px weight 600 uppercase, `tracking-[0.025em]`. Hover: slightly lighter violet. One per view.
- **Ghost link:** no container, `text-ash` → `text-white` on hover, optional `→`.
- **Section label:** 12–14px, weight 600, uppercase, `text-saffron`.
- **Section headline block:** two columns — headline left (78–113px), label + body right (18px/200).
- **Typographic list:** services, references, pricing as large text rows separated by whitespace only (no dividers, no cards). Hover: title shifts / turns iris, arrow appears.
- **Accordion (FAQ):** native `<details>`, `+` icon rotating to `×`, no boxes.
- **Carousel dots:** 8px circles, active `iris`, inactive `white/20`.
- **Particle globe (hero):** canvas of tiny outlined triangles (1px stroke) in the particle palette forming a slowly rotating organic sphere. Pauses off-screen / hidden tab, static frame for `prefers-reduced-motion`.
- **Ambient field:** sparse static outlined triangles (SVG) at low opacity across black sections.

Particle palette: `#8052ff`, `#ffb829`, `#15846e`, `#2dd4bf`, `#e879f9`, `#60a5fa`, `#a78bfa`, `#f472b6`.

## Do / Don't

**Do**
- Pure black backgrounds, white type, whitespace as structure.
- Weight 400 headlines, weight 200 body.
- `-0.04em` tracking on everything ≥ 42px.
- Keep copy short and confident (Hungarian, tegező).

**Don't**
- Cards, borders, dividers, shadows, glassmorphism.
- Gradients on buttons, text or panels.
- More than one filled button in a view.
- Fake product screenshots or stock photos in the hero.
- Unverifiable claims (only use numbers the business confirmed).
