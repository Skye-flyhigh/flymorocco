import { getKeywordsForPage } from "@/data/keywords";
import { PAGE_ROUTES, PageKey, SITE_NAME, SITE_URL } from "@/data/metadata";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export async function buildPageMetadata({
  locale,
  page,
  path,
  extraKeywords,
}: {
  locale: string;
  page: PageKey;
  path?: string;
  extraKeywords?: string[];
}): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: `metadata.${page}` });
  const pagePath = path ?? PAGE_ROUTES[page];
  const keywords = getKeywordsForPage(page, locale, extraKeywords);
  const canonicalPath = pagePath ? `/${locale}/${pagePath}` : `/${locale}`;

  return {
    title: t("title"),
    description: t("description"),
    keywords,
    alternates: {
      canonical: `${SITE_URL}${canonicalPath}`,
      languages: {
        en: `${SITE_URL}/en${pagePath ? `/${pagePath}` : ""}`,
        fr: `${SITE_URL}/fr${pagePath ? `/${pagePath}` : ""}`,
      },
    },
    openGraph: {
      title: t("title"),
      description: t("description"),
      url: `${SITE_URL}${canonicalPath}`,
      siteName: SITE_NAME,
      locale,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: t("title"),
      description: t("description"),
    },
  };
}
