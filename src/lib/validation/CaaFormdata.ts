import { z } from "zod";

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
  glider: z.object({
    gliderManufacturer: z.string(),
    gliderModel: z.string(),
    gliderSize: z.string(),
  }),
  siteSelection: z.array(z.string()),
});

export const FormDataMapSchema = z.record(FormDataSchema);
export type FormData = z.infer<typeof FormDataSchema>;
export type FormDataSchema = Record<string, FormData>;
