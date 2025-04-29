"use client";

import { tourSchedule } from "@/lib/validation/tourScheduleData";
import Link from "next/link";
import { format, isSameMonth, isSameYear, isValid, parseISO } from "date-fns";
import { enGB } from "date-fns/locale"; // Or localize based on user
import { useTranslations } from "next-intl";
import {
  HandHeart,
  MountainSnow,
  Plane,
  Rocket,
  Sun,
  TreePalm,
} from "lucide-react";

export function formatRange(startISO: string, endISO: string) {
  const start = parseISO(startISO);
  const end = parseISO(endISO);

  if (!isValid(start) || !isValid(end)) {
    console.warn("Invalid date in tour data:", startISO, endISO);
    return "Invalid dates";
  }

  if (isSameMonth(start, end) && isSameYear(start, end)) {
    return `${format(start, "d", { locale: enGB })}–${format(end, "d MMMM yyyy", { locale: enGB })}`;
  }

  if (!isSameYear(start, end)) {
    return `${format(start, "d MMM yyyy", { locale: enGB })} – ${format(end, "d MMM yyyy", { locale: enGB })}`;
  }

  return `${format(start, "d MMM", { locale: enGB })} – ${format(end, "d MMM yyyy", { locale: enGB })}`;
}

export default function TourCalendar({
  nbWeeksDisplay,
}: {
  nbWeeksDisplay: number;
}) {
  //TODO: Properly connect the buttons to something when that something exist!

  const t = useTranslations("tours");
  const today = format(new Date(), "yyyy-MM-dd");
  const filteredWeeks = Object.values(tourSchedule).filter(
    (trip) => parseISO(trip.start) > parseISO(today),
  );

  type IconName =
    | "sun"
    | "mountain-snow"
    | "hand-heart"
    | "tree-palm"
    | "rocket";

  const iconMap: Record<
    IconName,
    React.ComponentType<{ className?: string }>
  > = {
    sun: Sun,
    "mountain-snow": MountainSnow,
    "hand-heart": HandHeart,
    "tree-palm": TreePalm,
    rocket: Rocket,
  };

  return (
    <section id="tour-calendar" className="bg-base-100 py-20 px-10">
      <h2 className="section-title text-shadow">{t("calendar")}</h2>
      <p className="text-2xl font-bold mb-5">{t("upcoming")}</p>
      <div className="grid gap-8 sm:grid-cols-2">
        {filteredWeeks.slice(0, nbWeeksDisplay).map((week) => {
          const Icon = iconMap[week.icon as keyof typeof iconMap] || Plane;

          return (
            <Link
              href={week.slug}
              key={week.start}
              target="_blank"
              rel="noopener"
              className="h-full"
            >
              <div className="bg-radial h-full from-base-100 to-base-200 shadow-lg rounded-2xl p-6 hover:shadow-xl transition-all flex flex-col items-center text-center">
                <Icon className="w-10 h-10 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">
                  {formatRange(week.start, week.end)}{" "}
                  {week.provider && (
                    <span className="text-primary-content">
                      {t("by")} {week.provider}
                    </span>
                  )}
                </h3>
                <p>
                  {week.location} —{" "}
                  {t(`toursDetails.${week.translationKey}.focus`)}
                </p>
                <p className="pb-2 text-base-content">
                  {t(`toursDetails.${week.translationKey}.note`)}
                </p>
                <span
                  className={`badge m-2 ${week.status === "full" ? "badge-error" : "badge-success"}`}
                >
                  {t(`${week.status}`).toUpperCase()}
                </span>
              </div>
            </Link>
          );
        })}
      </div>
      <div className="btn-container w-full mt-4 flex justify-evenly">
        <Link href="/tours" className="btn btn-primary m-5">
          {t("book")}
        </Link>
        <Link href="/tours" className="btn btn-secondary m-5">
          {t("view")}
        </Link>
      </div>
    </section>
  );
}
