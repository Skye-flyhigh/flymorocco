import { z } from "zod";
import rawTourSchedule from "@/data/tourSchedule.json";

export const tourScheduleData = z.object({
  start: z.string(),
  end: z.string(),
  slug: z.string().optional(),
  provider: z.string().optional(),
  type: z.string(),
  location: z.string(),
  icon: z.string(),
  status: z.string(),
  translationKey: z.string(),
});

const TourScheduleDataSchema = z.array(tourScheduleData);
const parsedResult = TourScheduleDataSchema.safeParse(rawTourSchedule);

if (!parsedResult.success) {
  console.error(
    "❌ Validation of tour schedule data failed:",
    parsedResult.error.format(),
  );
}

export type TourSchedule = z.infer<typeof tourScheduleData>;

export const tourSchedule = parsedResult.success
  ? (parsedResult.data as TourSchedule[])
  : (() => {
      throw new Error("Invalid tour schedule data: Wrong calendar 📅");
    })();
