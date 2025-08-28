import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { siteMeta } from "../validation/siteMeta";

export async function buildPageMetadata({
  locale,
  page,
}: {
  locale: string;
  page: string;
}): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: `metadata.${page}` });

  const baseKeywords =
    locale === "fr"
      ? [
          "parapente",
          "Maroc",
          "séjour parapente",
          "Atlas",
          "côte atlantique",
          "guide sites",
          "séjour bien-être",
          "Agadir",
          "Marrakech",
          "Mirleft",
          "DGAC du Maroc",
          "Espaces aériens du Maroc",
          "guides expérimentés",
        ]
      : [
          "paragliding",
          "Morocco",
          "paragliding tour",
          "Atlas Mountains",
          "Atlantic coast",
          "site guides",
          "wellness week",
          "Agadir",
          "Marrakech",
          "Mirleft",
          "Moroccan CAA",
          "Moroccan Airspaces",
          "expert guides",
        ];

  const paraglidingSites = Object.keys(siteMeta);

  const keywords = [...baseKeywords, ...paraglidingSites];

  return {
    title: `${t("title")}`,
    description: t("description"),
    keywords,
    alternates: {
      canonical: `https://flymorocco.info/${locale}`,
      languages: {
        en: `https://flymorocco.info/en`,
        fr: `https://flymorocco.info/fr`,
      },
    },
    openGraph: {
      title: t("title"),
      description: t("description"),
      url: `/${locale}/${page}`,
      siteName: "Flymorocco",
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
