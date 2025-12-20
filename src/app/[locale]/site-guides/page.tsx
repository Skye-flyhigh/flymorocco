import { useTranslations } from "next-intl";
import Hero from "../components/Hero";
import FeaturedSites from "../components/FeaturedSites";
import SiteMapSection from "../components/SiteMapSection";
import { buildPageMetadata } from "@/lib/metadata/buildPageMetadata";
import SearchSiteBar from "../components/siteGuides/SearchSite";
import { siteMeta } from "@/lib/validation/siteMeta";
import { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  const metadata = await buildPageMetadata({ locale, page: "siteGuides" });
  const paraglidingSites = Object.keys(siteMeta);

  metadata.keywords = [...(metadata.keywords || []), ...paraglidingSites];

  return metadata;
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
