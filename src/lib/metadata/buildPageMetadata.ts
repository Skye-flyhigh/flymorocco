import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export async function buildPageMetadata({
  locale,
  page,
}: {
  locale: string;
  page: string;
}): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: `metadata.${page}` });

  const keywords =
    locale === "fr"
      ? [
          "parapente",
          "Maroc",
          "séjour parapente",
          "Atlas",
          "guide sites",
          "séjour bien-être",
          "Agadir",
          "Marrakech",
          "Mirleft",
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
          "expert guides",
        ];

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
