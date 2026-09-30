import type { APIContext } from "astro";
import { SITE } from "@data/site";
import { trimSiteUrl } from "@lib/seo";

const PRODUCTION_URL = "https://read.jampuk.com";

export function GET(_context: APIContext) {
  const site = trimSiteUrl(SITE.url);
  // Staging and preview builds must never be indexed: point the canonical
  // sitemap at production and block crawling of the preview host.
  const isProduction = site === PRODUCTION_URL;

  const body = isProduction
    ? `User-agent: *
Allow: /
Disallow: /admin/

Sitemap: ${site}/sitemap-index.xml
`
    : `User-agent: *
Disallow: /
`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}
