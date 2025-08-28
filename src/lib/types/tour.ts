import { ParticipantDetails } from "./bookingDetails";

export const TOUR_SLUGS = ["mountain", "coastal", "wellbeing"] as const;
export type TourSlug = (typeof TOUR_SLUGS)[number];

export function isValidTourSlug(slug: string): slug is TourSlug {
  return TOUR_SLUGS.includes(slug as TourSlug);
}

export interface TourByDate {
  tourStartDate: string;
  tourEndDate: string;
  tourType: string;
  participants: ParticipantDetails[];
  totalPeople: number;
  totalRevenue: number;
  pilotsCount: number;
  currency: string;
}
