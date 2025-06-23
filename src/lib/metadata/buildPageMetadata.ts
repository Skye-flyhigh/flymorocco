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

  return {
    title: `${t("title")}`,
    description: t("description"),
    alternates: {
      canonical: `https://flymorocco.com/${locale}`,
      languages: {
        en: `https://flymorocco.com/en`,
        fr: `https://flymorocco.com/fr`,
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
