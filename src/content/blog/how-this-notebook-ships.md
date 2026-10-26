---
title: "How this notebook ships: GitOps, Pagefind search, Sveltia CMS, and Cloudflare Pages"
description: "A build log of the notebook itself: Markdown in a GitHub repo, Sveltia CMS committing straight to main, a Pagefind index compiled into the static build, and Cloudflare Pages turning every push into read.jampuk.com."
date: 2026-10-16
draft: false
cover: /images/uploads/how-this-notebook-ships.jpg
tags:
  - field-notes
  - gitops
  - cloudflare
  - pagefind
  - cms
---

Every note on this site is a Markdown file in a git repository. There is no database, no application server behind the editor, no search service to pay for, and no machine we log into to fix anything. The notebook is three moving parts: a git repository, a build pipeline, and a static host.

We spend most of our working hours arguing that source should live in version control, that build artifacts should be reproducible from a commit, and that nothing important should be hand-tuned on a live server. It would be a poor demonstration if our own notebook broke those rules. So this note is the build log: how a post travels from a text file to `read.jampuk.com`, and the four pieces that do the work.

![Dark technical schematic showing a Markdown note becoming a git commit, passing through a build engine that outputs a search index and static HTML pages, and being distributed from a globe of edge network nodes by cyan beams](/images/uploads/how-this-notebook-ships.jpg)

## Git is the only interface

GitOps normally describes infrastructure: the desired state lives in a repository, and an automated pipeline reconciles reality to it. Scaled down to a notebook, it means something simple. The repository is the source of truth, and git is the only way in.

Posts are Markdown files under `src/content/blog/`, each with a small frontmatter block for the title, description, date, draft flag, optional cover, and tags. The Astro content collection validates that block against a Zod schema at build time, so a malformed date or a missing description fails the build instead of surfacing later as a broken page.

Because the repository is the source of truth, two properties fall out for free. The first is reproducibility: the production build is a pure function of a commit, so any commit can be rebuilt into a deployable artifact. The second is history: the commit log is the audit trail, and a rollback is a redeploy of an earlier commit rather than a restore from a backup nobody has tested.

The whole flow is one line:

```text
write -> commit to main -> build (astro build + pagefind) -> static HTML on the edge
```

## A CMS with no server of its own

Non-technical authors should not have to touch git, so we put an editor on top. [Sveltia CMS](https://sveltiacms.app/) runs at `/admin/`, and the interesting part is what it is not: it is not an application server. `/admin/` is a static page that ships with the same build as the notes, and it talks to GitHub through the API. The repository is the database.

The backend is a few lines in `public/admin/config.yml`:

```yaml
backend:
  name: github
  repo: jampuk/blog
  branch: main
  auth_methods: [token]
```

Authentication is token-only. Sveltia can run an OAuth flow through a deployed worker, but for a single-author notebook a fine-grained GitHub token with Contents read and write is enough, and it keeps one less service alive. The token lives in the browser's local storage, and every save in the editor is a commit to `main`, exactly the same commit an engineer would make from the command line.

Two sharp edges are worth recording. Sveltia writes a value for every field it is shown, so an empty optional field such as `cover` is saved as an empty string, which the Astro schema rejects; `output.omit_empty_optional_fields: true` keeps it out of the frontmatter, and it should not be removed. And publishing is just a frontmatter boolean: a note with `draft: true` is filtered out of every listing, the feed, and the sitemap until the flag is flipped. There is no separate staging database to drift out of sync, because there is no database.

## Search that ships with the build

Search on most sites is a service: a hosted index, an API key, a bill that scales with queries. This notebook needed none of that, so it uses [Pagefind](https://pagefind.app/), which inverts the problem. Instead of indexing content into someone else's cloud, Pagefind indexes the finished site and writes a static index back into it.

It runs as a second step in the build:

```json
"build": "astro build && pagefind --site dist"
```

After Astro has written the HTML, Pagefind crawls `dist/`, compiles the index, and drops it at `dist/pagefind/`. The index is a build artifact like any other, so it is always in sync with the content that produced it.

Its scope is deliberate. Only the post body is indexed: the article carries `data-pagefind-body`, and the title and date are tagged with `data-pagefind-meta`. Navigation, tag lists, the author card, and the previous/next links are marked `data-pagefind-ignore`, so results match the notes and not the chrome around them. The CMS shell and the error pages never enter the index at all.

At runtime the search UI lazy-loads `pagefind.js` only when a reader actually searches. The header icon opens a modal, `/` or `Ctrl/Cmd+K` opens it from the keyboard, and a standalone `/search` page accepts a `?q=` parameter so a search can be linked to.

The one trap is local. `astro dev` serves pages that Pagefind never saw, so in development the search panel reports that the index has not been built. That is not a bug to chase; search is tested against `npm run preview`, where the real artifact is served.

## The host builds from git

[Cloudflare Pages](https://developers.cloudflare.com/pages/) closes the loop. The project `jampuk-read` is pointed at the `jampuk/blog` repository on the `main` branch, and its only job is to run the build and publish the output:

- Build command: `npm install && npm run build` (lockfiles are never committed)
- Output directory: `dist`
- Node version: 24

Every push to `main` starts a build, and a green build goes straight to the edge under the custom domain `read.jampuk.com`. The environment is configuration, not state: `PUBLIC_SITE_URL` and the other `PUBLIC_*` values are read at build time, and `PUBLIC_SITE_URL` must stay identical to `site_url` in the CMS config so the canonical URLs, the sitemap, and the feed all agree on one origin.

The platform's own configuration lives in the repository too, reviewed like code. `public/_headers` sets security headers, keeps the CMS frame same-origin, marks `/admin/` `noindex`, and caches uploaded media immutably. `public/_redirects` maps the blog's old `/blog/...` URLs onto the current `/notes/` structure with 301s. The sitemap integration excludes `/admin` and `/search`, and the feed is generated at build time at `/rss.xml`.

To test that exact artifact before it reaches the edge, the repository also carries a `Dockerfile`: `docker compose up --build` serves the same production build from the Astro preview server on `localhost:8088`, with no watch mode, rebuilt after each content change.

## Mostly plumbing

What this buys is boring, which is the point. There is no server to patch, because there is no server. There is no database to back up, because the repository is the backup, replicated to GitHub and to every clone. There is no search bill, because the index is a file. A rollback is a redeploy of an earlier commit. For a static site, the running cost is close to nothing and the failure modes are small.

The deeper benefit is that the constraint is the feature. Because the only write path into production is git, the worst a tired editor can do is commit a bad Markdown file, and even that is visible in history and undone in one commit. There is no console to fat-finger, no live configuration to drift, no state that exists only on the running system.

It is the same rule we apply to client systems, only here it is small enough to hold in your head: keep the source of truth in version control, make the artifact reproducible from a commit, and leave nothing to hand-tune on a server. This notebook is the smallest honest proof we could build.
