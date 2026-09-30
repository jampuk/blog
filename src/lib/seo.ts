import { SITE } from "@data/site";

/**
 * Pure SEO helpers (no framework deps). Builds schema.org JSON-LD nodes
 * and absolute URLs for social crawlers.
 *
 * Nodes are emitted as a single `@graph` with stable `@id`s so Organization,
 * WebSite, Author, breadcrumbs and BlogPosting cross-reference each other.
 */

export const OG_IMAGE_WIDTH = 1200;
export const OG_IMAGE_HEIGHT = 630;

export const SITE_URL = SITE.url.replace(/\/+$/, "");
export const ORGANIZATION_ID = `${SITE_URL}/#organization`;
export const WEBSITE_ID = `${SITE_URL}/#website`;
export const AUTHOR_ID = `${absoluteUrl(SITE.author.profileUrl, SITE.websiteUrl)}#person`;
export const LOGO_PATH = "/favicons/android-chrome-512x512.png";

export const TAG_LABELS: Record<string, string> = {
  ai: "AI",
  aiar: "AIAR",
  cms: "CMS",
  devops: "DevOps",
  gitops: "GitOps",
  llm: "LLM",
  llms: "LLMs",
  rag: "RAG",
};

export function absoluteUrl(path: string, site: string | URL | undefined): string {
  const base = typeof site === "string" ? site : site?.toString();
  if (!base) return path;
  try {
    return new URL(path, base).toString();
  } catch {
    return path;
  }
}

/** Canonical URL for a page path, with directory-style trailing slash. */
export function canonicalUrl(pathname: string, site: string = SITE_URL): string {
  const clean = pathname.split(/[?#]/)[0] || "/";
  const withSlash = clean.endsWith("/") ? clean : `${clean}/`;
  return absoluteUrl(withSlash, site);
}

/** Strip trailing slashes for concatenating with route templates. */
export function trimSiteUrl(site: string = SITE_URL): string {
  return site.replace(/\/+$/, "");
}

function prettify(segment: string): string {
  const whole = TAG_LABELS[segment.toLowerCase()];
  if (whole) return whole;
  return segment
    .split("-")
    .map((word) => {
      const label = TAG_LABELS[word.toLowerCase()];
      return label ?? word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(" ");
}

/** Human-readable label for a normalized tag slug ("ai-engineering" -> "AI Engineering"). */
export function humanizeTag(tag: string): string {
  return prettify(tag);
}

export function buildOrganization(): Record<string, unknown> {
  const logo = absoluteUrl(LOGO_PATH, SITE_URL);
  return {
    "@type": "Organization",
    "@id": ORGANIZATION_ID,
    name: SITE.name,
    alternateName: SITE.company.name,
    url: SITE_URL,
    logo: {
      "@type": "ImageObject",
      "@id": `${SITE_URL}/#logo`,
      url: logo,
      width: 512,
      height: 512,
    },
    image: { "@id": `${SITE_URL}/#logo` },
    description: SITE.description,
    email: SITE.email,
    founder: { "@id": AUTHOR_ID },
    sameAs: SITE.sameAs,
  };
}

export function buildWebsite(): Record<string, unknown> {
  return {
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    name: SITE.name,
    alternateName: SITE.parentName,
    url: SITE_URL,
    description: SITE.description,
    inLanguage: SITE.locale.replace("_", "-"),
    publisher: { "@id": ORGANIZATION_ID },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/search/?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

export function buildAuthor(): Record<string, unknown> {
  const sameAs: string[] = [];
  if (SITE.author.linkedinUrl) sameAs.push(SITE.author.linkedinUrl);
  if (SITE.author.mastodonUrl) sameAs.push(SITE.author.mastodonUrl);
  return {
    "@type": "Person",
    "@id": AUTHOR_ID,
    name: SITE.author.name,
    jobTitle: SITE.author.jobTitle,
    description: SITE.author.bio,
    url: absoluteUrl(SITE.author.profileUrl, SITE.websiteUrl),
    ...(sameAs.length > 0 ? { sameAs } : {}),
    worksFor: { "@id": ORGANIZATION_ID },
  };
}

export interface BreadcrumbInput {
  name: string;
  path: string;
}

export function buildBreadcrumbs(
  crumbs: BreadcrumbInput[],
  site: string = SITE_URL,
): Record<string, unknown> | null {
  if (crumbs.length === 0) return null;
  const last = crumbs[crumbs.length - 1];
  return {
    "@type": "BreadcrumbList",
    "@id": `${canonicalUrl(last.path, site)}#breadcrumb`,
    itemListElement: crumbs.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.name,
      item: canonicalUrl(crumb.path, site),
    })),
  };
}

/**
 * Blog route-aware breadcrumb trail. Avoids treating the site name as a URL
 * level: notes live at the root, the archive lives under /notes/, and tags
 * under /tags/.
 */
export function breadcrumbsForPath(
  pathname: string,
  pageTitle?: string,
): BreadcrumbInput[] | null {
  const segments = pathname.split("/").filter(Boolean);
  if (segments.length === 0) return null;

  const first = segments[0];
  if (first === "search" || first === "404" || first === "403") return null;

  const crumbs: BreadcrumbInput[] = [{ name: "Home", path: "/" }];

  if (first === "notes") {
    crumbs.push({ name: pageTitle ?? "All notes", path: "/notes/" });
  } else if (first === "tags") {
    crumbs.push({ name: "Tags", path: "/tags/" });
    if (segments[1]) {
      crumbs.push({
        name: pageTitle ?? humanizeTag(segments[1]),
        path: `/tags/${segments[1]}/`,
      });
    }
  } else {
    // A note lives at the root of the site, so it has no URL parent: the
    // trail is Home > Note.
    crumbs.push({
      name: pageTitle ?? prettify(first),
      path: `/${first}/`,
    });
  }

  return crumbs;
}

export interface ArticleInput {
  url: string;
  headline: string;
  description: string;
  image?: string;
  datePublished: string;
  dateModified?: string;
  tags?: string[];
  section?: string;
  wordCount?: number;
  readingMinutes?: number;
}

export function buildArticle(input: ArticleInput): Record<string, unknown> {
  const image = input.image
    ? { "@type": "ImageObject", url: absoluteUrl(input.image, SITE_URL) }
    : undefined;
  return {
    "@type": "BlogPosting",
    "@id": `${input.url}#article`,
    headline: input.headline,
    name: input.headline,
    description: input.description,
    image,
    datePublished: input.datePublished,
    dateModified: input.dateModified ?? input.datePublished,
    author: { "@id": AUTHOR_ID },
    publisher: { "@id": ORGANIZATION_ID },
    mainEntityOfPage: { "@type": "WebPage", "@id": input.url },
    isPartOf: { "@id": WEBSITE_ID },
    inLanguage: SITE.locale.replace("_", "-"),
    url: input.url,
    ...(input.section ? { articleSection: input.section } : {}),
    ...(input.tags && input.tags.length > 0 ? { keywords: input.tags.join(", ") } : {}),
    ...(input.wordCount ? { wordCount: input.wordCount } : {}),
    ...(input.readingMinutes ? { timeRequired: `PT${input.readingMinutes}M` } : {}),
  };
}
