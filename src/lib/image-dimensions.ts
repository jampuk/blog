import { existsSync } from "node:fs";
import { join } from "node:path";

/**
 * Reads the intrinsic size of an image that lives in `public/`.
 * Returns null when the file is missing or cannot be read.
 */
export async function publicImageDimensions(
  publicPath: string | undefined,
): Promise<{ width: number; height: number } | null> {
  if (!publicPath) return null;
  const file = join(process.cwd(), "public", publicPath.replace(/^\/+/, ""));
  if (!existsSync(file)) return null;
  try {
    // Loaded lazily so the native module never enters the client bundle.
    const { default: sharp } = await import("sharp");
    const meta = await sharp(file).metadata();
    return meta.width && meta.height
      ? { width: meta.width, height: meta.height }
      : null;
  } catch {
    return null;
  }
}
