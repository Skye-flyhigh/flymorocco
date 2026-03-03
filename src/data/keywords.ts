import { PageKey } from "./metadata";
import { getTranslations } from "next-intl/server";

export async function getKeywordsForPage(
  page: PageKey,
  locale: string,
  extraKeywords?: string[],
): Promise<string[]> {
  const t = await getTranslations({ locale, namespace: "keywords" });
  const base = t.raw("base") as string[];
  const pageKw = t.raw(page) as string[];
  return [...base, ...pageKw, ...(extraKeywords ?? [])];
}

export async function getKeywordsForTour(
  slug: string,
  locale: string,
): Promise<string[]> {
  const t = await getTranslations({ locale, namespace: "keywords" });
  const base = t.raw("base") as string[];
  const tourBase = t.raw("tourBase") as string[];
  const tourKey = `tour${slug.charAt(0).toUpperCase() + slug.slice(1)}`;
  const tourSpecific = t.raw(tourKey) as string[];
  return [...base, ...tourBase, ...tourSpecific];
}

export async function getKeywordsForSiteGuide(
  siteName: string,
  locale: string,
): Promise<string[]> {
  const t = await getTranslations({ locale, namespace: "keywords" });
  const base = t.raw("base") as string[];
  const siteBase = t.raw("siteGuideBase") as string[];
  const prefix = t("siteGuidePrefix");
  return [...base, ...siteBase, siteName, `${prefix} ${siteName}`];
}
