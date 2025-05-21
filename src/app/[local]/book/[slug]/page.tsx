import { tourSchedule } from "@/lib/validation/tourScheduleData";
import { format } from "date-fns";
import MissingTour from "../../components/tours/MissingTour";

type Props = {
  params: {
    slug: string;
  };
};

export default function BookingPage({ params }: Props) {
  const slug = "/tours/" + params.slug;
  const matchingTours = tourSchedule.filter((tour) => tour.slug === slug);

  if (matchingTours.length === 0) return MissingTour();

  return (
    <main className="max-w-3xl mx-auto py-16 px-6">
      <h1 className="text-3xl font-bold mb-4">
        Book: {params.slug.replace("/", "")}
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
          <p>
            Status: <span className="font-medium">{tour.status}</span>
          </p>

          {/* Placeholder for booking form */}
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
