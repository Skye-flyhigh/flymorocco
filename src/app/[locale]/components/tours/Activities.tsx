import { useTranslations } from "next-intl"
import { TourSlug } from "../../tours/[slug]/page"

type ActivityType = Record<TourSlug, string[]>

export default function Activities (slug: TourSlug) {
    const t = useTranslations('tours')

    const activities: ActivityType = {
        [TourSlug.Mountain]: ['jemaaElFna', 'asni', 'ourika', 'horse', 'quads', 'camel', 'hammam'],
        [TourSlug.Coastal]: ['tiznit', 'beach', 'horse', 'surf', 'quads', 'camel', 'spa'],
        [TourSlug.Wellbeing]: ['tiznit', 'beach', 'horse', 'surf', 'quads', 'camel', 'spa']
    }

    return(
        <section id="activities" className="py-20 px-10">
            <h2 className="section-title">{t('activities.title')}</h2>
            <h3 className="section-subtitle">{t('activities.subtitle')}</h3>

            <p className="prose mb-6 text-sm md:text-base">
    {t('activities.disclaimer')}
  </p>

  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
    {activities[slug as TourSlug]?.map((key: string) => (
      <ul
        key={key}
        className="flex items-center gap-3 bg-base-200 rounded-lg p-3"
      >
        <li>{t(`activities.items.${key}`)}</li>
      </ul>
    ))}
  </div>
        </section>
    )
}