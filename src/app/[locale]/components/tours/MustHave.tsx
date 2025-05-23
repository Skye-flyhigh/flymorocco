import { useTranslations } from "next-intl"
import { TourSlug } from "../../tours/[slug]/page"

type MustHaveType = Record<TourSlug, string[]>

export default function MustHave (slug: TourSlug) {
    const t = useTranslations("tours")

    const mustHaveItems: MustHaveType = {
        [TourSlug.Mountain]: ['downJacket', 'sunscreen', 'alcohol', 'sunnies', 'smile'],
        [TourSlug.Coastal]: ['sunnies', 'smile'],
        [TourSlug.Wellbeing]: ['sunnies', 'smile'],
    }

    return(
        <section id="must-have" className="py-20 px-10">
            <h2 className="section-title">{t('mustHave.title')}</h2>
            <h3 className="section-subtitle">{t('mustHave.subtitle')}</h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
<ul className="list-disc list-inside space-y-2">
  {mustHaveItems[slug].map((key) => (
    <li key={key}>{t(`mustHave.items.${key}`)}</li>
  ))}
</ul></div>
        </section>
    )
}