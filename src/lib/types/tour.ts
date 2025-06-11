import MissingTour from "@/app/[locale]/components/tours/MissingTour";

export const TOUR_SLUGS = ["mountain", "coastal", "wellbeing"] as const;
export type TourSlug = (typeof TOUR_SLUGS)[number];

export function validTourSlug(slug: string) {
  const validSlugs = TOUR_SLUGS;

  if (!validSlugs.includes(slug as TourSlug)) {
    return MissingTour();
  }

  return slug as TourSlug;
}
