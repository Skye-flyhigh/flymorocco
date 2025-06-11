import { TourSlug } from "@/lib/types/tour";
import { useTranslations } from "next-intl";

type MustHaveType = Record<TourSlug, string[]>;

export default function MustHave({ slug }: { slug: TourSlug }) {
  const t = useTranslations("tours");

  const mustHaveItems: MustHaveType = {
    mountain: ["downJacket", "sunscreen", "alcohol", "sunnies", "smile"],
    coastal: ["sunnies", "sunscreen", "smile"],
    wellbeing: ["sunnies", "sunscreen", "smile"],
  };

  return (
    <section id="must-have" className="py-20 px-10">
      <h2 className="section-title">{t("mustHave.title")}</h2>
      <h3 className="section-subtitle">{t("mustHave.subtitle")}</h3>

      <div className="">
        <ul className="list-disc list-inside space-y-2">
          {mustHaveItems[slug].map((key) => (
            <li key={key}>{t(`mustHave.items.${key}`)}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}
