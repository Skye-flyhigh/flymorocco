import { SiteMeta, siteMeta } from "../types/siteMeta"

export function getSiteMeta(slug: string): SiteMeta {
  const meta = siteMeta[slug as keyof typeof siteMeta];
  if(!meta) console.warn(`⚠️ No siteMeta found for slug: "${slug}"`);
  return meta || null;
}