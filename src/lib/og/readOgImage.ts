import { readFile } from "fs/promises";
import path from "path";

/**
 * Read a PNG from /public/og-images/ and return it as a base64 data URI.
 * Falls back to null if the file doesn't exist (e.g., imsouane).
 */
export async function readOgImage(slug: string): Promise<string | null> {
  try {
    const filePath = path.join(
      process.cwd(),
      "public",
      "og-images",
      `${slug}.png`,
    );
    const data = await readFile(filePath);
    return `data:image/png;base64,${data.toString("base64")}`;
  } catch {
    return null;
  }
}

/**
 * Read the white Flymorocco logo SVG as a base64 data URI for Satori.
 */
export async function readLogo(): Promise<string | null> {
  try {
    const filePath = path.join(
      process.cwd(),
      "public",
      "images",
      "FMorocco-logo-single-transparent-white.svg",
    );
    const data = await readFile(filePath);
    return `data:image/svg+xml;base64,${data.toString("base64")}`;
  } catch {
    return null;
  }
}
