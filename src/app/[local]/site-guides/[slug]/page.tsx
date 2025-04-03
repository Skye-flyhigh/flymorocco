import { useTranslations } from "next-intl"
import Image from "next/image"
import { Metadata } from "next";
import { getSiteMeta } from "@/lib/site";

export async function generateMetadata({ params }: { params: { slug: string; local: string }; }): Promise<Metadata> {
  const { slug, local } = await params;

  const meta = getSiteMeta(slug);
  if (!meta) return { title: "Not Found" };
    
  const messages = (await import(`@messages/${local}.json`)).default;
  const t = messages.siteGuides?.[slug];

  return {
    title: `${t?.name} – FlyMorocco`,
    description: t?.description,
  };
}

export default function SiteGuidePage({ params }: { params: { slug: string; local: string } }) {
  const { slug } = params;
  const meta = getSiteMeta(slug);
  const t = useTranslations("siteGuides");

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