import { useTranslations } from "next-intl";
import Hero from "../components/Hero";
import FeaturedSites from "../components/FeaturedSites";
import SiteMapSection from "../components/SiteMapSection";
import { buildPageMetadata } from "@/lib/metadata/buildPageMetadata";
import SearchSiteBar from "../components/siteGuides/SearchSite";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return await buildPageMetadata({ locale, page: "siteGuides" });
}

export default function SiteGuidesPage() {
  const t = useTranslations("siteGuides");

  return (
    <main id="main">
      <Hero
        title={t("title")}
        subtitle={t("subtitle")}
        img="/images/ouizen-2310x1440.jpg"
      />
      <FeaturedSites />
      <SiteMapSection />
      <SearchSiteBar />
    </main>
  );
}
