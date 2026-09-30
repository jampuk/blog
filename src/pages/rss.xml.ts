import type { APIContext } from "astro";
import { getPublishedPosts } from "@lib/posts";
import { SITE } from "@data/site";
import { trimSiteUrl } from "@lib/seo";

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET(_context: APIContext) {
  const posts = await getPublishedPosts();
  const site = trimSiteUrl(SITE.url);
  const lastBuild = posts[0]?.data.date ?? new Date();

  const items = posts
    .map((post) => {
      const url = `${site}/${post.id}/`;
      const categories = (post.data.tags ?? [])
        .map((tag) => `    <category>${escapeXml(tag)}</category>`)
        .join("\n");

      return `  <item>
    <title>${escapeXml(post.data.title)}</title>
    <link>${escapeXml(url)}</link>
    <guid isPermaLink="true">${escapeXml(url)}</guid>
    <pubDate>${post.data.date.toUTCString()}</pubDate>
    <description>${escapeXml(post.data.description)}</description>
${categories}
  </item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="utf-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(SITE.name)}</title>
    <link>${escapeXml(site)}/</link>
    <description>${escapeXml(SITE.description)}</description>
    <language>${SITE.locale.replace("_", "-")}</language>
    <lastBuildDate>${lastBuild.toUTCString()}</lastBuildDate>
    <atom:link href="${escapeXml(site)}/rss.xml" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
    },
  });
}
