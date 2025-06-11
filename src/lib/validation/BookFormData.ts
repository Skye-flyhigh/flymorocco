import { z } from "zod";

export const BookingFormSchema = z.object({
  name: z.string().min(1, "Missing a name"),
  email: z.string().email("Invalid email address"),
});
