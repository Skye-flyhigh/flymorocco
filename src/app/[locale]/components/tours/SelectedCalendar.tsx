import getTourMeta from "@/lib/data-retrievers/getTourMeta";
import { availabilityStyling, tourAvailability } from "@/lib/utils/tour-availability";
import { TourSchedule } from "@/lib/validation/tourScheduleData";
import { formatRange } from "@/scripts/dateFormat";
import { parseISO } from "date-fns";
import { useTranslations } from "next-intl";
import BookingForm from "../booking/BookingForm";

export default function SelectedCalendar({ slug }: { slug: string }) {
  const t = useTranslations("tours");

  const meta: TourSchedule[] = getTourMeta(slug);

  if (!meta) {
    return (
      <section>
        <h2 className="section-title">{t("notAvailable")}</h2>
      </section>
    );
  } else {
    return (
      <section id="tour-calendar" className="py-20 px-10">
        <h2 className="section-title">{t(`${slug}.title`)}</h2>

        {meta.map((week: TourSchedule) => {
          const today = new Date();
          const tourDate = parseISO(week.start);
          if (tourDate < today) return;

          const status = tourAvailability(week)
          const statusStyling = availabilityStyling(status)

          return (
            <article
              key={week.start}
              className="flex sm:flex-row group flex-col gap-4 justify-between w-5/6 items-center sm:px-20 bg-base-200 hover:bg-base-300 shadow-md transition-all mx-auto my-5 rounded-xl p-3"
            >
              <p className="text-xl semibold">
                {formatRange(week.start, week.end)}
              </p>
              {
                status !== "available" && (
                                  <p
                  className={`badge badge-outline text-xs group-hover:transition-all ${statusStyling}`}
                >
                  {t(`${status}`).toUpperCase()}
                </p>

                )
}

              <BookingForm {...week} />
            </article>
          );
        })}
      </section>
    );
  }
}
