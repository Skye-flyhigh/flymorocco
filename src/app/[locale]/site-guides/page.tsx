import { buildPageMetadata } from "@/lib/metadata/buildPageMetadata";
import { siteMeta } from "@/lib/validation/siteMeta";
import { Metadata } from "next";
import { useTranslations } from "next-intl";
import FeaturedSites from "../components/FeaturedSites";
import Hero from "../components/Hero";
import SearchSiteBar from "../components/siteGuides/SearchSite";
import SiteMapSection from "../components/SiteMapSection";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const paraglidingSites = Object.keys(siteMeta);
  return buildPageMetadata({
    locale,
    page: "siteGuides",
    extraKeywords: paraglidingSites,
  });
}

export default function SiteGuidesPage() {
  const t = useTranslations("siteGuides");

  return (
    <main id="main">
      <Hero
        title={t("title")}
        subtitle={t("subtitle")}
        img="/images/ouizen-2310x1440.webp"
      />
      <FeaturedSites />
      <SiteMapSection />
      <SearchSiteBar />
    </main>
  );
}
