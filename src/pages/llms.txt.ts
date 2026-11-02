import type { APIContext } from "astro";
import { SITE } from "@data/site";
import { formatDate, getAllTags, getPublishedPosts } from "@lib/posts";
import { humanizeTag } from "@lib/seo";

const PRODUCTION_URL = "https://read.jampuk.com";

export async function GET(_context: APIContext) {
  const site = SITE.url.replace(/\/+$/, "");
  const isProduction = site === PRODUCTION_URL;

  if (!isProduction) {
    return new Response("LLMs.txt is not available in non-production environments.\n", {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }

  const u = (path: string) => `${site}${path.startsWith("/") ? path : `/${path}`}`;

  const [posts, tags] = await Promise.all([getPublishedPosts(), getAllTags()]);

  const pages = [
    { href: "/", title: "Home", desc: "Latest field notes from Jampuk Read." },
    { href: "/notes/", title: "All Notes", desc: "Every published field note, newest first." },
    { href: "/tags/", title: "Tags", desc: "Field notes grouped by topic." },
    { href: "/search/", title: "Search", desc: "Full-text search across every note." },
  ];

  const linkList = (items: { href: string; title: string; desc: string }[]) =>
    items.map((i) => `- [${i.title}](${u(i.href)}): ${i.desc}`).join("\n");

  const notes = posts
    .map((post) => {
      const meta = [formatDate(post.data.date)];
      if (post.data.tags?.length) meta.push(`tags: ${post.data.tags.join(", ")}`);
      return `- [${post.data.title}](${u(`/${post.id}/`)}): ${post.data.description} (${meta.join("; ")})`;
    })
    .join("\n");

  const tagLinks = tags
    .map(
      ({ tag, count }) =>
        `- [${humanizeTag(tag)}](${u(`/tags/${tag}/`)}): ${count} note${count === 1 ? "" : "s"}`,
    )
    .join("\n");

  const body = `# ${SITE.name}

> ${SITE.description}

${SITE.name} is the field notebook of ${SITE.parentName} (${SITE.company.name}, SSM ${SITE.company.ssmRegistrationNo}, ${SITE.company.jurisdiction}), led by ${SITE.author.name}, ${SITE.author.jobTitle}. Contact: ${SITE.email}

## Pages

${linkList(pages)}

## Field Notes

${notes}

## Tags

${tagLinks}

## Optional

- [RSS Feed](${u("/rss.xml")}): Every published note as an RSS feed.
- [Jampuk Intelligence](${SITE.websiteUrl}/): The main website.
- [Jampuk Docs](https://docs.jampuk.com/): Delivery guides and technical reference.
`;

  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
