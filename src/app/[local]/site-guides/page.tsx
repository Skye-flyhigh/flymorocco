import { useTranslations } from "next-intl"
import Hero from "../components/Hero"
import SiteCard from "../components/SiteCard"
import { SiteMeta, siteMeta } from "@/types/siteMeta"

export default function SiteGuidesPage() {
  const t = useTranslations("siteGuides")
  return (
    <main>
      <Hero title={t("title")} subtitle={t("subtitle")} img="/images/ouizen-2310x1440.jpg" />
      <section className="card-body flex flex-row flex-wrap">
        {Object.values(siteMeta).map((site: SiteMeta) => (
          <SiteCard key={site.slug} site={site} />
        ))}
      </section>
    </main>
  )
}