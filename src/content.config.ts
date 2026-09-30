import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// Empty strings from the CMS must not become invalid dates or empty alts.
const optionalDate = z.preprocess(
  (value) => (value === '' || value === null ? undefined : value),
  z.coerce.date().optional(),
);
const optionalText = z.preprocess(
  (value) => (typeof value === 'string' && value.trim() === '' ? undefined : value),
  z.string().optional(),
);

// Content Layer API (Astro 5+): collections are loaded with an explicit loader
// instead of the legacy `type: 'content'` declaration. Entries are keyed by
// `id` (the file name without extension) rather than `slug`.
const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    updated: optionalDate,
    draft: z.boolean().default(false),
    cover: z.string().optional(),
    coverAlt: optionalText,
    tags: z.array(z.string())
      .optional()
      .transform((tags) =>
        tags
          ? tags.map((tag) => tag.trim().toLowerCase()).filter(Boolean)
          : undefined,
      ),
  }),
});

export const collections = { blog };
