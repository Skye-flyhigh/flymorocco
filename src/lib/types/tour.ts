export const TOUR_SLUGS = ["mountain", "coastal", "wellbeing"] as const;
export type TourSlug = (typeof TOUR_SLUGS)[number];
