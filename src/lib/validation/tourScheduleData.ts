import { z } from "zod";
import rawTourSchedule from "@/data/tourSchedule.json";

export const tourScheduleData = z.object({
  start: z.string(),
  end: z.string(),
  slug: z
    .string()
    .refine((val) => val.startsWith("/") || val.startsWith("http"), {
      message: "Slug must start with '/' (internal) or 'http' (external URL)",
    }),
  provider: z.string().optional(),
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

export type TourSchedule = z.infer<typeof TourScheduleDataSchema>;
export type TourScheduleMap = Record<string, TourSchedule>;

export const tourSchedule = parsedResult.success
  ? (parsedResult.data as TourSchedule)
  : (() => {
      throw new Error("Invalid tour schedule data: Wrong calendar 📅");
    })();
