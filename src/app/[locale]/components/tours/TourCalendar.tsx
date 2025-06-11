"use client";

import { tourSchedule } from "@/lib/validation/tourScheduleData";
import Link from "next/link";
import { format, parseISO } from "date-fns";
import { useTranslations } from "next-intl";
import {
  HandHeart,
  MountainSnow,
  Plane,
  Rocket,
  Sun,
  TreePalm,
} from "lucide-react";
import ViewMoreArrow from "../viewMoreArrow";
import { useEffect, useState } from "react";
import { formatRange } from "@/scripts/dateFormat";

export default function TourCalendar() {
  const t = useTranslations("tours");
  const today = format(new Date(), "yyyy-MM-dd");

  const filteredWeeks = Object.values(tourSchedule).filter(
    (trip) => parseISO(trip.start) > parseISO(today),
  );
  const [cards, setCards] = useState<number>(4);
  const [disable, setDisable] = useState(false);

  const increment = () => {
    if (cards < filteredWeeks.length) return setCards(cards + 2);
    else setDisable(true);
  };
  const decrement = () => {
    return setCards(cards - 2);
  };

  useEffect(() => {
    if (cards < filteredWeeks.length) setDisable(false);
  }, [cards, filteredWeeks]);

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
        {filteredWeeks.slice(0, cards).map((week) => {
          const Icon = iconMap[week.icon as keyof typeof iconMap] || Plane;

          return (
            <Link
              href={week.slug ? week.slug : `/tours/${week.type}`}
              key={week.start}
              target="_blank"
              rel="noopener"
              className="h-full group"
            >
              <div className="bg-radial h-full min-h-52 from-base-100 to-base-200 hover:from-base-200 hover:to-base-300 shadow-lg rounded-2xl p-4 hover:shadow-xl transition-all relative">
                <p
                  className={`badge badge-outline text-xs ${week.status === "full" ? "badge-error" : "badge-success"}`}
                >
                  {t(`${week.status}`).toUpperCase()}
                </p>
                <br />
                <Icon className="w-10 h-10 text-primary mt-4 mr-4 absolute right-0 top-0" />
                <h3 className="badge badge-secondary text-xl font-semibold mt-2 p-3 w-fit">
                  {week.type}{" "}
                  {week.provider && (
                    <span className="w-fit">
                      {" - "} {week.provider}
                    </span>
                  )}
                </h3>
                <p>{t(`toursDetails.${week.translationKey}.focus`)}</p>
                <p className="block mb-5 font-semibold absolute bottom-3">
                  {formatRange(week.start, week.end)}
                </p>
                <p className="text-xs text-accent absolute bottom-3">
                  {week.location}
                </p>
                <div className="absolute bottom-2 right-4">
                  <ViewMoreArrow />
                </div>
              </div>
            </Link>
          );
        })}
      </div>
      <div className="btn-container w-full mt-4 flex flex-wrap justify-evenly">
        <Link href="/tours" className="btn btn-primary m-5">
          {/* //TODO: refer to the right link for the book now button in tours */}
          {t("book")}
        </Link>
        {cards > 5 && (
          <button
            type="button"
            className="btn btn-soft m-5"
            onClick={decrement}
          >
            {t("viewLess")}
          </button>
        )}
        <button
          type="button"
          className="btn btn-secondary m-5"
          onClick={increment}
          disabled={disable}
        >
          {t("view")}
        </button>
      </div>
    </section>
  );
}
