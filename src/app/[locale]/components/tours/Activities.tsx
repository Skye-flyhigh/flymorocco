import { TourSlug } from "@/lib/types/tour";
import { useTranslations } from "next-intl";

type ActivityType = Record<TourSlug, string[]>;

export default function Activities({ slug }: { slug: TourSlug }) {
  const t = useTranslations("tours");

  const activities: ActivityType = {
    mountain: [
      "jemaaElFna",
      "asni",
      "ourika",
      "horse",
      "quads",
      "camel",
      "hammam",
    ],
    coastal: ["tiznit", "beach", "horse", "surf", "quads", "camel", "spa"],
    wellbeing: ["tiznit", "beach", "horse", "surf", "quads", "camel", "spa"],
  };

  return (
    <section id="activities" className="py-20 px-10">
      <h2 className="section-title">{t("activities.title")}</h2>
      <h3 className="section-subtitle">{t("activities.subtitle")}</h3>

      <p className="prose mb-6 text-sm md:text-base">
        {t("activities.disclaimer")}
      </p>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {activities[slug as TourSlug]?.map((key: string) => (
          <ul
            key={key}
            className="flex items-center gap-3 bg-base-200 rounded-lg p-3 hover:bg-base-300 transition-all"
          >
            <li>{t(`activities.items.${key}`)}</li>
          </ul>
        ))}
      </div>
    </section>
  );
}
