import { getCollection, type CollectionEntry } from 'astro:content';

export type BlogPost = CollectionEntry<'blog'>;

const WORDS_PER_MINUTE = 200;

export function sortByDateDesc(posts: BlogPost[]): BlogPost[] {
  return [...posts].sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}

export function sortByDateAsc(posts: BlogPost[]): BlogPost[] {
  return [...posts].sort((a, b) => a.data.date.getTime() - b.data.date.getTime());
}

export async function getPublishedPosts(): Promise<BlogPost[]> {
  const all = await getCollection('blog', ({ data }) => data.draft !== true);
  return sortByDateDesc(all);
}

export function estimateReadingTime(body: string): number {
  const words = body.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / WORDS_PER_MINUTE));
}

export async function getNoteNumber(post: BlogPost): Promise<string> {
  const all = await getCollection('blog', ({ data }) => data.draft !== true);
  const sorted = sortByDateAsc(all);
  const index = sorted.findIndex((p) => p.id === post.id);
  const number = index >= 0 ? index + 1 : sorted.length;
  return `N°${String(number).padStart(3, '0')}`;
}

export interface TagCount {
  tag: string;
  count: number;
}

export async function getAllTags(): Promise<TagCount[]> {
  const posts = await getPublishedPosts();
  const tagMap = new Map<string, number>();

  for (const post of posts) {
    for (const tag of post.data.tags ?? []) {
      tagMap.set(tag, (tagMap.get(tag) ?? 0) + 1);
    }
  }

  return Array.from(tagMap.entries())
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag));
}

export async function getPostsByTag(tag: string): Promise<BlogPost[]> {
  const posts = await getPublishedPosts();
  return posts.filter((post) =>
    (post.data.tags ?? []).includes(tag.toLowerCase()),
  );
}

export async function getAdjacentPosts(post: BlogPost): Promise<{
  newer: BlogPost | null;
  older: BlogPost | null;
}> {
  const posts = await getPublishedPosts();
  const index = posts.findIndex((p) => p.id === post.id);
  return {
    newer: index > 0 ? posts[index - 1] : null,
    older: index >= 0 && index < posts.length - 1 ? posts[index + 1] : null,
  };
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}
