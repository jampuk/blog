---
version: "2.0.0"
name: "Jampuk Read Design System"
description: "A dark-first, editorial design system for the Jampuk Read field notebook."

colors:
  primary: "#0B132B"
  on-primary: "#F8FAFC"
  secondary: "#1C2541"
  on-secondary: "#F8FAFC"
  tertiary: "#0EA5E9"
  on-tertiary: "#0B132B"
  accent-amber: "#F59E0B"
  on-accent-amber: "#0B132B"
  surface: "#0F172A"
  surface-container: "#1E293B"
  surface-container-high: "#334155"
  on-surface: "#E2E8F0"
  on-surface-variant: "#94A3B8"
  neutral: "#64748B"
  neutral-muted: "#334155"
  outline: "#334155"
  error: "#EF4444"
  on-error: "#FFFFFF"

typography:
  display-lg:
    fontFamily: Bricolage Grotesque
    fontSize: 48px
    fontWeight: 700
    lineHeight: 56px
    letterSpacing: "-0.03em"
  display-md:
    fontFamily: Bricolage Grotesque
    fontSize: 36px
    fontWeight: 700
    lineHeight: 44px
    letterSpacing: "-0.02em"
  headline-lg:
    fontFamily: Space Grotesk
    fontSize: 32px
    fontWeight: 700
    lineHeight: 40px
    letterSpacing: "-0.02em"
  headline-md:
    fontFamily: Space Grotesk
    fontSize: 24px
    fontWeight: 600
    lineHeight: 32px
    letterSpacing: "-0.01em"
  headline-sm:
    fontFamily: Space Grotesk
    fontSize: 20px
    fontWeight: 600
    lineHeight: 28px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: 400
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: 400
    lineHeight: 24px
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: 400
    lineHeight: 20px
  label-lg:
    fontFamily: Space Grotesk
    fontSize: 14px
    fontWeight: 600
    lineHeight: 20px
    letterSpacing: "0.01em"
  label-sm:
    fontFamily: Space Grotesk
    fontSize: 12px
    fontWeight: 600
    lineHeight: 16px
    letterSpacing: "0.04em"
  code-md:
    fontFamily: Fira Code
    fontSize: 14px
    fontWeight: 400
    lineHeight: 22px
  note-meta:
    fontFamily: Fira Code
    fontSize: 12px
    fontWeight: 400
    lineHeight: 18px
    letterSpacing: "0.06em"
  note-id:
    fontFamily: Fira Code
    fontSize: 12px
    fontWeight: 500
    letterSpacing: "0.12em"
  marginalia:
    fontFamily: Fira Code
    fontSize: 12px
    fontWeight: 400
    lineHeight: 18px
    letterSpacing: "0.03em"

rounded:
  none: 0px
  sm: 4px
  md: 8px
  lg: 12px
  xl: 16px
  full: 9999px

spacing:
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  2xl: 48px
  3xl: 64px
  4xl: 96px
---

# Jampuk Read Design System

> The field notebook of Jampuk Intelligence. Principal-written notes on secure, compliant, production-grade AI systems.

## Relationship to the Main Website

This design system is a **blog-specific layer** built on top of the canonical Jampuk Design System (`website/DESIGN.md`). The palette, typography, radii, and spacing are identical. What differs is the **editorial chrome**: how those tokens are composed into a reading-first, notebook-style experience.

## Design Intent

The main website is an **operations console** - it converts, demonstrates capability, and pushes action. The blog is a **field notebook** - it reads quietly, documents decisions, and invites reflection. Same owl, same night watch, different posture.

## Editorial Layer (What Makes the Blog Different)

### 1. Mono Voice

Fira Code is not just for code blocks. It is the **editorial voice** of the notebook:

- Dates, reading time, and metadata
- Note identifiers (`N°001`, `N°002`)
- Section markers (`// Archive`, `// Marginalia`)
- Table of contents entries
- Colophon and footer annotations
- Volume/issue strip in the header

This creates a "lab notebook" feel that Space Grotesk and Inter alone cannot achieve.

### 2. Note Numbering

Every published note receives a sequential identifier:

- `N°001` = first published note (oldest by date)
- Numbers increase chronologically as new notes are published
- Displayed on cards, article headers, and marginalia
- Format: Fira Code, amber color, `0.12em` letter spacing

### 3. Ledger Layout

Content is organized as a **ledger** - ruled rows, not floating cards:

- Archive page: single-column list of entries separated by 1px `outline` rule lines
- Homepage: typographic hero + abbreviated ledger index
- Cards have no shadow or elevation on hover - just a subtle background shift
- The ledger rows reference `surface-container` only on hover, not by default

### 4. Marginalia Rail

Articles have a **left marginalia rail** (hidden on mobile):

- Note identifier
- Reading time estimate
- Last-updated date
- "Filed under" tag links
- Table of contents (sticky on scroll)

This replaces the website's image-forward card grid with a text-forward reading scaffold.

### 5. Color Role Swap

| Token | Website Role | Blog Role |
|-------|-------------|-----------|
| `tertiary` (cyan) | Primary buttons, CTAs, glows | Links, code, inline highlights only |
| `accent-amber` | Warnings, status badges | Editorial accents: note IDs, section markers, "new" flags |
| `surface-container` | Card backgrounds | Hover states only (ledger rows) |

Buttons are rare on the blog. Links use cyan text with underline-reveal hover.

### 6. Quiet Motion

No glows, no pulses, no crossfades, no hover-lifts. The only motion:

- Underline reveals on link hover (`transition: text-decoration`)
- Subtle background shift on ledger row hover (`transition: background-color`)
- Modal open/close (opacity + scale)

The blog should feel like paper, not a dashboard.

### 7. Typography Posture

- Articles use `body-lg` (18px) with `line-height: 1.75` for long-form readability
- Drop caps on first paragraph of each article
- Pull quotes: left border in `tertiary`, larger `body-lg`, generous padding
- Code blocks: `primary` fill, `outline` border, `code-md` type
- Blockquotes: `on-surface-variant` italic, left `outline` border

### 8. Reading Measure

- Article body: `max-width: 65ch` (~700px)
- Marginalia rail: `240px` fixed on desktop, hidden below `lg`
- Archive ledger: `max-width: 760px` centered
- Homepage hero: `max-width: 640px`

## Components (Blog-Specific)

### Subscribe Modal

Replaces the website's "Book Briefing" CTA:

- **RSS section**: Feed URL displayed with copy-to-clipboard button
- **Newsletter section**: Email input + embedded signup iframe
- Triggered by "Subscribe" link in header
- Same modal pattern as website booking modal (fixed overlay, backdrop blur, panel scale animation)

### Note Meta Strip

Thin bar above the header showing:

- `// Field Notes` (left)
- `Vol. 01` (right)
- Fira Code, 11px, `on-surface-variant` color

### Tag Pills

- Lowercase, mono font, `surface-container` background
- Hover: `tertiary` border
- Used on article footer and tag archive pages

### Table of Contents

- Extracted from article headings (h2, h3)
- Sticky within marginalia rail
- Active section highlighted on scroll
- Fira Code entries with cyan links

### Author Snippet

Shows the author identity on every blog post (`AuthorSnippet.astro`, data from `SITE.author`). Two variants:

**Byline chip (article header):**
- 36px square avatar, `outline` border, hover: `tertiary` border
- `by Hafiz Zainudin` in Fira Code `note-meta` voice, uppercase
- Entire chip links to the principal profile (`rel="author"`)

**Author card (end of post, after content, before next/prev nav):**
- Flat ledger style: `rule-line` top separator, no card background or shadow
- `// Author` section marker (amber, mono)
- 64px square avatar, `outline` border
- Name (Space Grotesk 600) + job title (marginalia voice) + one-line bio from `SITE.author.bio` (summary of the website's principal profile)
- `Principal profile →` link in `tertiary` cyan text, plus a mono `linkedin` link
- Mono footer line: `// Vol. {volume} - {site name}`

**SEO:** A single JSON-LD `@graph` is emitted per page (`src/lib/seo.ts`): `Organization`, `WebSite`, `Person` (the author), `BreadcrumbList`, and `BlogPosting` on note pages. Author `Person` JSON-LD comes from `buildAuthor()`.

**Do:**
- Keep the card flat (no `glass-panel`, no elevation) - it is part of the ledger, not a floating card
- Use the avatar photo consistently (`src/assets/images/author-avatar.jpg`)
- Link both variants to the principal profile with `rel="author"`

**Don't:**
- Add social icon rows, hover-lifts, or glows
- Show the snippet on archive/tag index cards

## Shared Components (Unchanged from Website)

- `Logo.astro` - identical
- `Footer.astro` - identical cross-links, minus the booking CTA button
- `ConsentBanner.astro` - identical
- `Seo.astro` - extended with `ogType` prop (article vs website)

## Content Schema

```ts
{
  title: string,
  description: string,
  date: Date,
  updated?: Date,        // optional; drives article:modified_time and sitemap lastmod
  draft: boolean (default false),
  cover?: string,
  coverAlt?: string,     // social image alt text (falls back to the note title)
  tags?: string[]  // lowercase, trimmed
}
```

## Do's and Don'ts

**Do:**
- Use Fira Code for all metadata, IDs, and marginalia
- Number every published note sequentially
- Keep articles to a 65ch reading measure
- Use amber for editorial accents (note IDs, markers)
- Use cyan only for links and code
- Keep motion minimal - no glows or pulses
- Tag every post with 2-5 lowercase tags

**Don't:**
- Use `btn-primary` buttons - the blog is reading-first, not conversion-first
- Use photographic hero backgrounds - the blog is typographic
- Use hover-lift, glow-pulse, or crossfade animations
- Use amber for warnings - amber is an editorial accent on the blog
- Hardcode hex values - always use design tokens
