import { TourSchedule, tourSchedule } from "../validation/tourScheduleData";

export default function getTourMeta(slug: string) {
  const today = new Date();

  const meta: TourSchedule[] = [];
  tourSchedule.forEach((tour) => {
    const isFuture = new Date(tour.start) > today;
    const matchesSlug = tour.type === slug;
    if (isFuture && matchesSlug) {
      meta.push(tour);
    }
  });

  if (meta.length === 0)
    console.warn(`⚠️ No tourMeta found for slug: "${slug}"`);

  return meta || null;
}
