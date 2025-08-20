import { z } from "zod";
import { TOUR_SLUGS } from "../types/tour";

// Participant schema for individual participants
export const ParticipantSchema = z
  .object({
    name: z.string().min(1, "Missing participant name"),
    isPilot: z.boolean(),
    soloOccupancy: z.boolean(),
    email: z.string().email("Invalid email address").optional(), // Only required if isPilot is true
  })
  .refine(
    (data) => {
      // If isPilot is true, email must be provided
      if (data.isPilot && !data.email) {
        return false;
      }
      return true;
    },
    {
      message: "Pilot email is required for pilots",
      path: ["email"],
    },
  );

// Main booking form schema
export const BookingFormSchema = z
  .object({
    // Main booker contact
    name: z.string().min(1, "Missing a name"),
    email: z.string().email("Invalid email address"),
    isPilot: z.boolean(),
    soloOccupancy: z.boolean(),

    // Tour details
    start: z.string().min(1, "Missing a start date"),
    tourType: z.enum(TOUR_SLUGS, {
      errorMap: () => ({
        message:
          "Invalid tour type. Must be one of: mountain, coastal, wellbeing",
      }),
    }),

    // Participants
    participantCount: z.number().max(20, "Maximum 20 participants allowed"),
    participants: z.array(ParticipantSchema),
  })
  .refine(
    (data) => {
      // Ensure participants array matches participantCount
      return data.participants.length === data.participantCount;
    },
    {
      message:
        "Participant count doesn't match number of participants provided",
      path: ["participants"],
    },
  );

// Type definitions
export type ParticipantData = z.infer<typeof ParticipantSchema>;
export type BookingFormData = z.infer<typeof BookingFormSchema>;
