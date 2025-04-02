import SiteCard from "../components/SiteCard"
import siteMeta from "@/data/siteMeta.json"

export default function SiteGuidesPage() {
  return (
    <div className="card-body">
      {Object.values(siteMeta).map((site: SiteMeta) => (
        <SiteCard key={site.slug} site={site} />
      ))}
    </div>
  )
}