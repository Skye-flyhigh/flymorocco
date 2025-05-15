import { TourSchedule, tourSchedule } from "../validation/tourScheduleData";

export default function getTourMeta( slug: string ): TourSchedule {
    const meta: TourSchedule = tourSchedule[slug as keyof typeof tourSchedule];
    if(!meta) console.warn(`⚠️ No tourMeta found for slug: "${slug}"`);
    return meta || null
}