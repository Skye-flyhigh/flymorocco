"use client"
import { useParams } from "next/navigation"
import { useTranslations } from "next-intl"
import siteMeta from "@/data/siteMeta.json"
import Image from "next/image"

export default function SiteGuidePage() {
  const { slug } = useParams<{ slug: string }>()
  const meta = siteMeta[slug as keyof typeof siteMeta]
  const t = useTranslations("siteGuides")

  if (!meta || !slug) return <div>Not found</div>

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold">{t(`${slug}.name`)}</h1>
      <p className="text-gray-500 mb-4">{t(`${slug}.region`)}</p>

      <Image
        src={meta.image}
        alt={t(`${slug}.name`)}
        width={1200}
        height={700}
        className="rounded-lg shadow-md object-cover mb-6"
      />

      <p className="mb-8">{t(`${slug}.description`)}</p>

      <div className="text-sm text-gray-500">
        Altitude: {meta.launch_altitude}m | Coordinates: {meta.lat}, {meta.lng}
      </div>
    </div>
  )
}