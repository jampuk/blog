import { defineConfig } from 'astro/config';
import { unified } from '@astrojs/markdown-remark';
import partytown from '@astrojs/partytown';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import fs from 'node:fs';
import path from 'node:path';
import { rehypePostSources } from './src/lib/rehype-post-sources.mjs';
import { rehypeImageMetadata } from './src/lib/rehype-image-metadata.mjs';

/**
 * Reads a value from `.env` so the sitemap origin matches the origin used by
 * `src/data/site.ts` (which reads `import.meta.env` at build time). Astro
 * only exposes `.env` to `import.meta.env`, never to `process.env`.
 */
function dotEnvValue(key) {
  const file = path.join(process.cwd(), '.env');
  if (!fs.existsSync(file)) return undefined;
  for (const line of fs.readFileSync(file, 'utf8').split(/\r?\n/)) {
    const match = line.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*?)\s*$/);
    if (!match || match[1] !== key) continue;
    return match[2].replace(/^["']|["']$/g, '');
  }
  return undefined;
}

// Canonical blog URL. Falls back to https://read.jampuk.com for local/dev
// parity when PUBLIC_SITE_URL is not set.
const site = (
  process.env.PUBLIC_SITE_URL ||
  dotEnvValue('PUBLIC_SITE_URL') ||
  'https://read.jampuk.com'
)
  .trim()
  .replace(/\/+$/, '');

// Last-modified dates for posts, used by the sitemap. Read from frontmatter so
// the integration does not need access to the Astro content layer.
function postLastmods() {
  const dir = path.join(process.cwd(), 'src/content/blog');
  const dates = new Map();
  if (!fs.existsSync(dir)) return dates;

  for (const file of fs.readdirSync(dir)) {
    if (!file.endsWith('.md')) continue;
    const raw = fs.readFileSync(path.join(dir, file), 'utf8');
    if (/^draft:\s*true\s*$/m.test(raw)) continue;
    const updated = raw.match(/^updated:\s*["']?([0-9T:\-+.Z]+)["']?\s*$/m);
    const published = raw.match(/^date:\s*["']?([0-9T:\-+.Z]+)["']?\s*$/m);
    const value = updated?.[1] ?? published?.[1];
    if (!value) continue;
    const date = new Date(value);
    if (!Number.isNaN(date.valueOf())) {
      dates.set(`/${file.replace(/\.md$/, '')}/`, date);
    }
  }
  return dates;
}

const lastmods = postLastmods();
const EXCLUDED = ['/403', '/404', '/500', '/502', '/503', '/admin', '/search'];

function isExcluded(pathname) {
  const normalized = pathname.replace(/\/+$/, '') || '/';
  if (/\.(html|xml|txt|json)$/.test(normalized)) return true;
  return EXCLUDED.some(
    (excluded) => normalized === excluded || normalized.startsWith(`${excluded}/`),
  );
}

// https://astro.build/config
export default defineConfig({
  site,
  integrations: [
    partytown({
      config: {
        // Forward GA4 commands from the main thread into the Partytown worker.
        // Only `dataLayer.push` is forwarded: the main-thread `gtag` shim pushes
        // into `window.dataLayer`, so forwarding `gtag` as well would bounce the
        // call back to the main thread and loop.
        forward: ['dataLayer.push'],
      },
    }),
    sitemap({
      filter: (page) => !isExcluded(new URL(page).pathname),
      serialize: (item) => {
        // Normalize every entry to the directory-style trailing-slash URL so
        // the sitemap matches the canonical tags and the internal links.
        const url = new URL(item.url);
        if (!url.pathname.endsWith('/')) url.pathname = `${url.pathname}/`;
        const lastmod = lastmods.get(url.pathname);
        return {
          ...item,
          url: url.toString(),
          ...(lastmod ? { lastmod: lastmod.toISOString() } : {}),
        };
      },
    }),
  ],
  output: 'static',
  vite: {
    // Tailwind v4 is wired through the Vite plugin (postcss.config.mjs is gone).
    plugins: [tailwindcss()],
  },
  markdown: {
    // Astro 7 defaults to the SAtteri pipeline; opt back into the
    // remark/rehype pipeline so the custom rehype plugins below still run.
    processor: unified({
      rehypePlugins: [rehypePostSources, rehypeImageMetadata],
    }),
    shikiConfig: {
      theme: 'tokyo-night',
    },
  },
});
