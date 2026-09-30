<div align="center">

# Jampuk Read

**The field notebook of Jampuk Intelligence.**

Principal-written notes on secure, compliant, production-grade AI systems.

[Read the notebook](https://read.jampuk.com) · [Browse notes](https://read.jampuk.com/notes/) · [Open CMS](https://read.jampuk.com/admin/) · [Jampuk](https://www.jampuk.com)

![Astro 7](https://img.shields.io/badge/Astro-7-BC52EE?style=flat-square&logo=astro&logoColor=white)
![Tailwind CSS 4](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)
![Node.js 24+](https://img.shields.io/badge/Node.js-24%2B-339933?style=flat-square&logo=nodedotjs&logoColor=white)
![Cloudflare Pages](https://img.shields.io/badge/Cloudflare-Pages-F38020?style=flat-square&logo=cloudflare&logoColor=white)
[![License: Apache 2.0](https://img.shields.io/badge/License-Apache_2.0-D97706?style=flat-square)](LICENSE)

</div>

---

## Overview

A static, reading-first publication built with **Astro 7**, **Tailwind CSS 4**, and **Sveltia CMS**, hosted on **Cloudflare Pages**. Its Field Ledger design pairs a quiet editorial layout with the canonical Jampuk palette.

- **Editorial, not promotional.** Ruled ledger rows, chronological note IDs, and a focused 65ch reading measure.
- **Content in Git.** Markdown notes managed through Sveltia CMS with GitHub token authentication.
- **Searchable by design.** Pagefind powers both the search modal and a dedicated search page.
- **Follow in your own reader.** RSS subscription with copy-to-clipboard and quick-add links.
- **Static delivery.** Pre-rendered pages, minimal client JavaScript, and worker-based analytics.

## Contents

- [Design system](#design-system)
- [Publishing and content](#publishing-and-content)
- [Project map](#project-map)
- [Development conventions](#development-conventions)
- [Search and subscriptions](#search-and-subscriptions)
- [Analytics and consent](#analytics-and-consent)
- [SEO](#seo)
- [Deployment](#deployment)
- [CMS authentication](#cms-authentication)
- [License](#license)

## Design system

[DESIGN.md](DESIGN.md) defines the blog's **Field Ledger** editorial layer. It shares the main website's palette and typography, but adopts a quieter, notebook-style presentation.

| Principle | Expression |
| --- | --- |
| Mono voice | Fira Code for metadata, note IDs, section markers, and marginalia |
| Ledger layout | Ruled rows instead of floating cards; no photographic heroes |
| Note numbering | Chronological identifiers: `N°001`, `N°002`, and onward |
| Intentional color | Cyan for links and code; amber for editorial accents |
| Quiet motion | No glows, pulses, or hover-lifts |
| Reading first | 65ch measure, drop caps, pull quotes, and a marginalia rail |

Design tokens live in the `@theme` block at the top of [src/styles/global.css](src/styles/global.css). Reuse these tokens rather than hardcoding hex values.

## Publishing and content

Use the [production CMS](https://read.jampuk.com/admin/) for editorial changes. Posts are stored as Markdown in `src/content/blog/`.

| Content detail | Convention |
| --- | --- |
| Author | Single principal profile |
| Frontmatter | `title`, `description`, `date`, `updated`, `draft`, `cover`, `coverAlt`, `tags` |
| Collection schema | `src/content.config.ts`, using a Content Layer `glob` loader |
| Entry identity | Entries are keyed by `id`, not `slug` |
| Post URL | `/<slug>/` |
| Archive | `/notes/` |
| Tags | Lowercase mono pills with archives at `/tags/<tag>/` |
| Legacy URLs | `/blog/...` routes 301-redirect through `public/_redirects` |
| Social image | `public/images/og-image.jpg` (1200 x 630), used when a post has no cover |

Tags in frontmatter are normalized to lowercase by the Zod schema transform.

> **Keep optional fields truly optional.** Sveltia requires `output.omit_empty_optional_fields: true` in `public/admin/config.yml`. Without it, empty optional values such as `cover` can fail schema validation.

Do not hand-edit generated `dist/` files or CMS upload binaries in `public/images/uploads/` outside the upload flow.

## Project map

| Location | Purpose |
| --- | --- |
| `DESIGN.md` | Editorial design system and visual conventions |
| `astro.config.mjs` | Static output, sitemap, Partytown, Tailwind, and Markdown processing |
| `public/admin/` | Sveltia CMS shell and configuration; excluded from the sitemap |
| `public/_headers`, `public/_redirects` | Hosting headers and legacy redirects |
| `public/images/og-image.jpg` | Default social preview image |
| `src/content/blog/` | Markdown notes and frontmatter |
| `src/content.config.ts` | Content schema, author constraints, and tag normalization |
| `src/pages/` | Homepage, posts, notes archive, error pages, and RSS feed |
| `src/pages/tags/` | Tag index and per-tag archives |
| `src/pages/search.astro` | Standalone Pagefind search with `?q=` support |
| `src/pages/robots.txt.ts` | Generated robots file with the configured sitemap URL |
| `src/layouts/Layout.astro` | Shared metadata, header, subscription modal, and footer |
| `src/components/` | Ledger rows, navigation, marginalia, search, consent, and subscription UI |
| `src/styles/global.css` | Tailwind theme tokens and global styles |
| `src/lib/posts.ts` | Reading time, note numbering, tags, and adjacent posts |
| `src/lib/seo.ts` | JSON-LD graphs, canonical URLs, and absolute URL helpers |
| `src/lib/search.ts` | Shared Pagefind loader and search UI logic |
| `src/lib/consent.ts` | Consent storage key and banner re-open event |
| `src/lib/rehype-image-metadata.mjs` | Markdown image dimensions and lazy loading |

## Development conventions

### Application

- Use Astro **static output** (SSG), with no SSR adapter.
- Keep layouts mobile-first, use semantic HTML with a single `h1`, and minimize client JavaScript.
- Use absolute URLs for header and footer links to `PUBLIC_WEBSITE_URL`.
- Use standard hyphens (`-`), never long dashes or their HTML entities.
- Keep secrets out of source files and logs. Declare environment variables with empty or dummy placeholders in `.env.example`.
- Do not commit lockfiles; the remote build installs dependencies with `npm install`.

> **Remote-first workflow.** Dependency installation, builds, integration tests, and deployment run off-machine. Do not run local build, test, or development-server commands unless explicitly requested.

### Tailwind CSS 4

Tailwind is utility-first and connected through `@tailwindcss/vite` in `astro.config.mjs`. There is no PostCSS configuration or `tailwind.config.mjs`.

- The `@theme` block precedes `@layer base` in `src/styles/global.css`.
- Tokens cover colors, fonts, radii, shadows, breakpoints, tracking, leading, and maximum widths.
- Legacy color aliases include `nocturne`, `luminous`, and `brandgold`; custom breakpoints include `xs` and `menu`.
- Keep `tailwindcss` and `@tailwindcss/vite` in `dependencies`, not `devDependencies`. The preview runtime loads `astro.config.mjs`, which imports the plugin.
- Both Dockerfile stages copy `astro.config.mjs` and `tsconfig.json`, not the removed PostCSS or Tailwind configuration files.

<details>
<summary><strong>Optional local tooling reference</strong></summary>

Local tooling is available only when explicitly requested:

- Astro's development server uses `http://localhost:4321`.
- Sveltia's **Work with Local Repository** mode is available at `http://localhost:4321/admin/index.html`. It requires a Chromium browser and a Git repository at the project root, but no proxy server.
- The Docker Compose configuration serves a static production build through Astro preview on port `8088`, without a local Node toolchain.
- The container has no volumes or HMR. Content changes require rebuilding the image.
- Lockfiles are excluded by `.gitignore` and `.dockerignore`, so the image installs dependencies with `npm install`.

</details>

## Search and subscriptions

### Search

**Pagefind** indexes the static site after Astro finishes building. The build script runs `astro build && pagefind --site dist`.

- Only post articles marked with `data-pagefind-body` are indexed. The CMS shell and error pages are excluded.
- `src/components/SearchModal.astro` provides header search with `/` and `Ctrl/Cmd+K` shortcuts.
- `/search/` provides a standalone search page and accepts `?q=` URL parameters.
- Both interfaces share the loader and UI logic in `src/lib/search.ts`.

The development server does not produce a search index. Its "not built" hint is expected; verify search against a completed remote build.

### Subscriptions

The subscription modal lets readers copy the RSS feed URL or open it in **Feedly**, **Inoreader**, **Feedbin**, or a native feed reader.

## Analytics and consent

Google Analytics 4 runs in a **Partytown worker**, configured through `PUBLIC_GA_MEASUREMENT_ID`. An empty value disables both GA4 and the consent banner.

<details>
<summary><strong>Implementation details and forwarding rules</strong></summary>

`src/layouts/Layout.astro` injects:

1. A main-thread `gtag` shim that pushes calls into `window.dataLayer`.
2. The GA4 `gtag.js` script with `type="text/partytown"`.
3. A worker bootstrap that sets Consent Mode v2 defaults and applies any stored consent decision **before** `gtag("config")`.

Consent defaults are granted globally and denied for the EEA/UK. The fixed bottom banner in `src/components/ConsentBanner.astro` stores the reader's choice in `localStorage` under `jampuk-read-consent` and sends `gtag("consent", "update")` on accept or reject. The footer's **Cookie settings** link re-opens the banner.

**Forward only `dataLayer.push`.** Adding `gtag` to Partytown's `forward` list would bounce calls back to the main thread and create a loop.

</details>

## SEO

- **Consistent URLs.** Internal links, canonical tags, and sitemap entries use directory-style trailing slashes.
- **Structured data.** Each page emits one JSON-LD `@graph` with `Organization`, `WebSite`, `Person`, and `BreadcrumbList`. Note pages also include `BlogPosting`.
- **Article metadata.** Note graphs include `headline`, `datePublished`, `dateModified`, `author`, `publisher`, `keywords`, `wordCount`, and `timeRequired`.
- **Breadcrumb hierarchy.** Posts appear under Notes; tag pages appear under Tags.
- **Freshness signals.** Sitemap `lastmod` values follow each post's `date` or `updated` frontmatter.
- **Environment-aware discovery.** `robots.txt` is generated at build time so its sitemap URL matches `PUBLIC_SITE_URL`.

## Deployment

### Cloudflare Pages

| Setting | Value |
| --- | --- |
| Project | `jampuk-read` |
| Repository | `jampuk/blog` |
| Production branch | `main` |
| Node.js | `24` |
| Remote build command | `npm install && npm run build` |
| Output directory | `dist` |
| Custom domain | `read.jampuk.com` (CNAME) |

### Environment variables

| Variable | Production value or purpose |
| --- | --- |
| `PUBLIC_SITE_URL` | `https://read.jampuk.com` |
| `PUBLIC_WEBSITE_URL` | `https://www.jampuk.com` |
| `PUBLIC_GA_MEASUREMENT_ID` | GA4 measurement ID; leave empty to disable analytics and the consent banner |

> **Keep the site origin aligned.** The `site_url` value in `public/admin/config.yml` must match `PUBLIC_SITE_URL`.

## CMS authentication

Sveltia uses **GitHub token sign-in only**. The CMS configuration sets `auth_methods: [token]`; no OAuth client is deployed, and the **Sign In with GitHub** button stays hidden.

1. Create a fine-grained personal access token for `jampuk/blog` with **Contents: Read and write**. A classic token requires the `repo` scope.
2. Open the [CMS](https://read.jampuk.com/admin/), choose **Sign In with Token**, and enter the token. Sveltia stores it in the browser's local storage.

Never commit the token or include it in configuration files or logs.

<details>
<summary><strong>Switching to OAuth later</strong></summary>

Deploy [Sveltia CMS Authenticator](https://github.com/sveltia/sveltia-cms-auth) on a Cloudflare Worker, point a GitHub OAuth App callback at it, then set `base_url` in `public/admin/config.yml` and remove `auth_methods`.

</details>

## License

Copyright 2026 Jampuk Intelligence Systems.

Licensed under the [Apache License, Version 2.0](LICENSE).
