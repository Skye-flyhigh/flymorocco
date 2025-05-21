"use client";
import getTourMeta from "@/lib/data-retrievers/getTourMeta";
// import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import MissingTour from "../../components/tours/MissingTour";
import Hero from "../../components/Hero";
import { TourSchedule } from "@/lib/validation/tourScheduleData";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { formatRange } from "@/scripts/dateFormat";

export default function Page() {
  const t = useTranslations("tours");
  const slug = "/" + usePathname().split("/").slice(2).join("/").toString();
  const meta: TourSchedule = getTourMeta(slug);
  console.log("Tours meta info:", { slug, meta });

  if (!meta || !slug) return <MissingTour />;

  let path = "";
  let translationKey = "";
  switch (slug) {
    case "/tours/mountain":
      path = "/images/guigou-2000x1333.jpg";
      translationKey = "mountain";
      break;
    case "/tours/coastal":
      path = "/images/plage-626x835.jpeg";
      translationKey = "coastal";
      break;
    case "/tours/wellbeing":
      path = "/images/camel-1865x1415.jpg";
      translationKey = "wellbeing";
      break;
    default:
      path = "/images/camel-1865x1415.jpg";
      translationKey = "default";
      break;
  }

  return (
    <main className="m-auto pt-10">
      <Hero
        title={t(`${translationKey}.title`)}
        subtitle={t(`${translationKey}.subtitle`)}
        img={path}
      />

      <Link href="#upcoming-tours" className="btn btn-primary m-5">
        {t("upcoming")}
      </Link>

      <section id="description" className="py-20 px-10"></section>

      <section id="upcoming-tours" className="py-20 px-10">
        {meta.length > 0 ? (
          meta.map((week) => (
            <article
              key={week.slug}
              className="flex w-fit items-center bg-base-200 hover:bg-base-300 shadow-md transition-all m-5 rounded-xl p-3"
            >
              <p className="text-xl semibold">
                {formatRange(week.start, week.end)}
              </p>

              <Link href={`/book${slug}`} className="btn btn-primary m-2">
                Book this tour
              </Link>
            </article>
          ))
        ) : (
          <div>No tours programmed</div>
        )}
      </section>
    </main>
  );
}
