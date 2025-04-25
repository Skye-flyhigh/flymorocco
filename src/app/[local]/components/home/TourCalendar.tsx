"use client";

import filteredWeeks from "@/data/tourSchedule.json";
import Link from "next/link";
import { format, isSameMonth, isSameYear, parseISO } from "date-fns";
import { enGB } from "date-fns/locale"; // Or localize based on user

export function formatRange(startISO: string, endISO: string) {
  const start = parseISO(startISO);
  const end = parseISO(endISO);

  if (isSameMonth(start, end) && isSameYear(start, end)) {
    return `${format(start, "d", { locale: enGB })}–${format(end, "d MMMM yyyy", { locale: enGB })}`;
  }

  if (!isSameYear(start, end)) {
    return `${format(start, "d MMM yyyy", { locale: enGB })} – ${format(end, "d MMM yyyy", { locale: enGB })}`;
  }

  return `${format(start, "d MMM", { locale: enGB })} – ${format(end, "d MMM yyyy", { locale: enGB })}`;
}

export default function TourCalendar() {


  return (
    <section id="tour-calendar" className="bg-base-100 py-20 px-6">
      <h2 className="section-title text-shadow">Tour Calendar</h2>
      <div className="grid gap-8 sm:grid-cols-2">
      {
  filteredWeeks.slice(0, 2).map((week) => (
    <div key={week.start} className="card bg-base-100 border">
      <h3 className="text-xl font-bold">
        {formatRange(week.start, week.end)}
      </h3>
      <p>{week.location} — {week.focus}</p>
      <span className={`badge ${week.status === "full" ? "badge-error" : "badge-success"}`}>
        {week.status.toUpperCase()}
      </span>
    </div>
  ))
}
<Link href="/tours" className="btn btn-primary mt-4">See Full Calendar</Link>
      </div>
    </section>
  );
}