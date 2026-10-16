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

### Color (Tailwind v4 `@theme` in `globals.css`, source of truth: `design/tokens.json`)

| Token / utility | Value | Use |
|---|---|---|
| `void` (`bg-void`) | `#000000` | Page canvas, all section backgrounds |
| `bone-white` | `#ffffff` | Headlines, body text, active nav |
| `ash-gray` | `#9a9a9a` | Ghost links, secondary labels, muted nav |
| `silver-mist` | `#bdbdbd` | Tertiary body, captions |
| `electric-iris` | `#8052ff` | Filled primary button, brand accent dots |
| `saffron-spark` | `#ffb829` | Uppercase labels, emphasis, accent links |
| `deep-verdant` | `#15846e` | Particle palette / deep accent only |

Never use default link blue. Links are white, ash-gray or saffron-spark.

### Typography

- **Family:** Inter Tight (`next/font/google`, free substitute for PP Neue Montreal), `font-feature-settings: "ss01"`.
- **Weights:** 200 (body), 400 (all headings + UI), 600 (uppercase labels/nav).

Use the token utilities — each size already carries its line-height and letter-spacing:

| Utility | Size | Weight | Line height | Tracking |
|---|---|---|---|---|
| `text-display` | 113px | 400 | 1.1 | -0.04em |
| `text-heading-lg` | 78px | 400 | 1.1 | -0.04em |
| `text-heading` | 48px | 400 | 1.1 | -0.035em |
| `text-heading-sm` | 42px | 400 | 1.2 | -0.04em |
| `text-subheading` | 36px | 400 (200 for quotes) | 1.2 | 0 |
| `text-heading-xs` | 27px | 400 | 1.0 | 0 |
| `text-heading-2xs` | 24px | 400 | 1.25 | -0.02em |
| `text-body` + `font-extralight` | 18px | 200 | 1.5 | 0 |
| `text-nav-label` + `font-semibold uppercase tracking-nav-label` | 14px | 600 | 1.2 | 0.025em |
| `text-caption` | 12px | 400/600 | 1.5 | 0 |

Responsive: step down on small screens, e.g. `text-heading sm:text-heading-lg xl:text-display`.
Tracking tokens are stored in `em` (identical to the reference px values at the nominal size) so they stay correct when the size steps down.
Font utility: `font-ppneuemontreal` (PP Neue Montreal if licensed files are added, otherwise Inter Tight).

\* Hungarian accents (É, Ő, Ű) need ≥ 1.0 line-height on display text; never clip headlines with `overflow: hidden`.

### Spacing & shape

- Base unit **6px**: 6, 12, 18, 24, 30, 36, 60, 96, 120 → Tailwind `1.5, 3, 4.5, 6, 7.5, 9, 15, 24, 30` (e.g. `gap-4.5`, `py-30`).
  The reference's `--spacing-*` tokens are intentionally **not** added to `@theme`: in Tailwind v4 they would redefine `p-6`, `gap-12` … across the whole app (admin included).
- Section gap **96–120px** desktop, **60–96px** mobile. Max content width **1280px**.
- Radius tokens: `rounded-buttons`, `rounded-cards`, `rounded-nav` (24px), `rounded-tags` (9999px).

## Components

- **Primary button:** `.void-button` (`bg-electric-iris`, `rounded-buttons`), pill, ~46px tall, 14px weight 600 uppercase, `tracking-[0.025em]`. Hover: slightly lighter violet. One per view.
- **Ghost link:** no container, `text-ash-gray` → `text-bone-white` on hover, optional `→`.
- **Section label:** `text-caption sm:text-nav-label font-semibold uppercase tracking-nav-label text-saffron-spark`.
- **Section headline block:** two columns — headline left (78–113px), label + body right (18px/200).
- **Typographic list:** services, references, pricing as large text rows separated by whitespace only (no dividers, no cards). Hover: title shifts / turns electric-iris, arrow appears.
- **Accordion (FAQ):** native `<details>`, `+` icon rotating to `×`, no boxes.
- **Carousel dots:** 8px circles, active `electric-iris`, inactive `white/20`.
- **Service visual (`ServiceVisual`):** small inline-SVG line animations per service (wireframe drawing, cart drop, slot pick, CTA flow, kanban move, heartbeat). 1px strokes, iris/saffron accents, CSS only, paused off-screen.
- **Scroll particles (`ScrollParticles`):** one fixed canvas; elements with `data-particles="<shape>"` are anchors where the cloud forms that shape (devices, chat, pen, progress, rocket, gears, plane — chat dots type, the progress ring fills to 100% and shows a check, gears mesh and spin); `data-particles="scatter"` dissolves it into ambient stardust. `data-particles="none"` keeps a whole section empty (used under the service animations). Morphs are time-smoothed, staggered and use a small burst so fast scrolling glides instead of jumping. Shapes live in `particleShapes.ts`.
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
- Unverifiable claims or promises: no delivery-time promises ("10 nap"), no client counts or results the business has not confirmed. Describe what we do, not what we guarantee.
