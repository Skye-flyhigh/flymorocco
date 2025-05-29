import getTourMeta from "@/lib/data-retrievers/getTourMeta";
import MissingTour from "../../components/tours/MissingTour";
import Hero from "../../components/Hero";
import { TourSchedule } from "@/lib/validation/tourScheduleData";
import Link from "next/link";
import { formatRange } from "@/scripts/dateFormat";
import { getTranslations } from "next-intl/server";
import { TourSlug } from "@/lib/types/tour";

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}) {
  const { slug } = await params;

  const validSlugs: TourSlug[] = ["mountain", "coastal", "wellbeing"];

  if (!validSlugs.includes(slug as TourSlug)) {
    return <MissingTour />;
  }

  const path = "/tours/" + slug;
  const meta: TourSchedule = getTourMeta(path);

  if (!meta || !slug) return <MissingTour />;
  const t = await getTranslations("tours");

  let img = "";
  switch (slug) {
    case "mountain":
      img = "/images/guigou-2000x1333.jpg";
      break;
    case "coastal":
      img = "/images/plage-626x835.jpeg";
      break;
    case "wellbeing":
      img = "/images/yoga-1536x1024.png";
      break;
    default:
      img = "/images/camel-1865x1415.jpg";
      break;
  }

  return (
    <main className="m-auto pt-10">
      <Hero
        title={t(`${slug}.title`)}
        subtitle={t(`${slug}.subtitle`)}
        img={img}
      />

      <section id="CTA" className="py-20 px-10">
        <p className="prose">{t(`${slug}.intro`)}</p>
        <Link href="#upcoming-tours" className="btn btn-primary">
          {t("upcoming")}
        </Link>
      </section>

      <section id="description" className="py-20 px-10">
        {/* <MustHave slug={slug} />
      <Activities slug={slug}/> */}
      </section>

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
