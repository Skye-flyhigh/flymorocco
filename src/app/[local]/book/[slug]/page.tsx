// src/app/[locale]/book/[slug]/page.tsx
import { notFound } from "next/navigation";
import { tourSchedule } from "@/lib/validation/tourScheduleData";
import { format } from "date-fns";

export default function Page({
  params,
}: {
  params: { slug: string };
}) {
  const slug = "/tours/" + params.slug;
  const matchingTours = tourSchedule.filter(
    (tour) => tour.slug === slug
  );

  if (matchingTours.length === 0) return notFound();

  return (
    <main className="max-w-3xl mx-auto py-16 px-6">
      <h1 className="text-3xl font-bold mb-4">
        Book: {params.slug}
      </h1>

      {matchingTours.map((tour, index) => (
        <section key={index} className="mb-8 border p-4 rounded-xl shadow-sm">
          <h2 className="text-xl font-semibold">
            {tour.location} ({tour.type})
          </h2>
          <p className="text-sm text-gray-600 mb-2">
            {format(new Date(tour.start), "MMMM d")} →{" "}
            {format(new Date(tour.end), "MMMM d, yyyy")}
          </p>
          <p>Status: <span className="font-medium">{tour.status}</span></p>

          <div className="mt-4">
            <button className="btn btn-primary" disabled>
              Booking Form Coming Soon
            </button>
          </div>
        </section>
      ))}
    </main>
  );
}