import { z } from "zod";

const GliderDataSchema = z.object({
  gliderManufacturer: z.string(),
  gliderModel: z.string(),
  gliderSize: z.string(),
  gliderColors: z.string().max(60, "Keep the color description short."),
});

export const ParticipantSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  nationality: z.string(),
  passportNumber: z.string(),
  insuranceValidity: z.date(),
  glider: GliderDataSchema,
});

export const FormDataSchema = z.object({
  identification: z.object({
    firstName: z.string(),
    lastName: z.string(),
    nationality: z.string(),
    passportNumber: z.string(),
  }),
  contact: z.object({
    contactEmail: z.string().email(),
    contactPhone: z.number(),
    address: z.string(),
  }),
  trip: z.object({
    insuranceValidity: z.date(),
    startDate: z.date(),
    endDate: z.date(),
  }),
  glider: GliderDataSchema.optional(),
  siteSelection: z.array(z.string()),
  participants: z.array(ParticipantSchema).optional(),
});

export const FormDataMapSchema = z.record(FormDataSchema);
export type FormData = z.infer<typeof FormDataSchema>;
export type FormDataSchema = Record<string, FormData>;

export type CaaFormState = {
  formData: FormData;
  error: string | null;
  success: boolean;
};
