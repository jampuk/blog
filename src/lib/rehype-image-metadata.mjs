import { existsSync } from 'node:fs';
import { join } from 'node:path';

let sharpModule;

/** Loads sharp lazily so a missing native binary cannot break the build. */
async function loadSharp() {
  if (sharpModule === undefined) {
    try {
      sharpModule = (await import('sharp')).default;
    } catch {
      sharpModule = null;
    }
  }
  return sharpModule;
}

function walk(node, visit) {
  if (!node || typeof node !== 'object') return;
  if (node.type === 'element') visit(node);
  if (Array.isArray(node.children)) {
    for (const child of node.children) walk(child, visit);
  }
}

function publicFile(src) {
  if (!src || /^[a-z]+:\/\//i.test(src) || src.startsWith('//')) return null;
  const clean = src.split(/[?#]/)[0];
  const file = join(process.cwd(), 'public', clean.replace(/^\/+/, ''));
  return existsSync(file) ? file : null;
}

/**
 * Adds intrinsic dimensions and deferred loading to Markdown images so the
 * rendered prose reserves layout space (Core Web Vitals) and stays lazy.
 * Local public/ images are measured with sharp at build time; remote images
 * are left untouched because their dimensions cannot be verified.
 */
export function rehypeImageMetadata() {
  return async (tree) => {
    const images = [];
    walk(tree, (node) => {
      if (node.tagName === 'img') images.push(node);
    });
    if (images.length === 0) return;

    const sharp = await loadSharp();

    await Promise.all(
      images.map(async (node, index) => {
        const properties = node.properties || (node.properties = {});
        const file = publicFile(String(properties.src || ''));
        if (sharp && file && (!properties.width || !properties.height)) {
          try {
            const meta = await sharp(file).metadata();
            if (meta.width && meta.height) {
              properties.width = meta.width;
              properties.height = meta.height;
            }
          } catch {
            /* unreadable image: leave dimensions unset */
          }
        }
        // The first image is usually the LCP candidate: load it eagerly, the
        // rest lazily.
        if (!properties.loading) {
          properties.loading = index === 0 ? 'eager' : 'lazy';
        }
        if (!properties.decoding) properties.decoding = 'async';
      }),
    );
  };
}
