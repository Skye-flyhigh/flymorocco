import { TourSchedule, tourSchedule } from "../validation/tourScheduleData";

export default function getTourMeta(slug: string) {
  const today = new Date();

  console.log("Initial data:", tourSchedule);

  const meta: TourSchedule = [];
  tourSchedule.forEach((tour) => {
    const isFuture = new Date(tour.start) > today;
    const matchesSlug = tour.slug === slug;
    if (isFuture && matchesSlug) {
      meta.push(tour);
    }
  });

  console.log("Tour meta:", meta);

  if (meta.length === 0)
    console.warn(`⚠️ No tourMeta found for slug: "${slug}"`);

  return meta || null;
}
