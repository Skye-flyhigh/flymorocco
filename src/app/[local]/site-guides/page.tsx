import { useTranslations } from "next-intl";
import Hero from "../components/Hero";
import SiteCard from "../components/SiteCard";
import { SiteMeta, siteMeta } from "@/lib/validation/siteMeta";

export default function SiteGuidesPage() {
  const t = useTranslations("siteGuides");
  return (
    <main>
      <Hero
        title={t("title")}
        subtitle={t("subtitle")}
        img="/images/ouizen-2310x1440.jpg"
      />
      <section className="max-w-screen bg-accent flex flex-row flex-wrap gap-3">
        {Object.values(siteMeta).map((site: SiteMeta) => (
          <div key={site.slug} className="w-1/6 min-w-96 align-middle">
            <SiteCard key={site.slug} site={site} />
          </div>
        ))}
      </section>
    </main>
  );
}
