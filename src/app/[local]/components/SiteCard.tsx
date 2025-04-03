import { useTranslations } from "next-intl"
import Image from "next/image"
import Link from "next/link"

interface SiteMeta {
  slug: string
  image: string
  lat: number
  lng: number
  launch_altitude: number
}

export default function SiteCard({ site }: { site: SiteMeta }) {
  const t = useTranslations("siteGuides")
  return (
    <div className="card w-full bg-base-100 shadow-xl">
      <figure>
        <Image
          src={site.image}
          alt={t(`${site.slug}.name`)}
          width={800}
          height={500}
          className="card-side"
        />
      </figure>
      <div className="card-body">
        <h2 className="card-title">{t(`${site.slug}.name`)}</h2>
        <p className="text-sm text-gray-500">{t(`${site.slug}.region`)}</p>
        <p>{t(`${site.slug}.description`)}</p>
        <div className="card-actions justify-end">
          <Link href={`/site-guides/${site.slug}`} className="btn btn-primary btn-sm">
            View Site
          </Link>
        </div>
      </div>
    </div>
  )
}