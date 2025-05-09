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

const BaseIdentification = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
});

export const FullFormSchema = z.object({
  formType: z.literal("annexe2and4"),
  identification: BaseIdentification.extend({
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

const Annexe2Schema = z.object({
  formType: z.literal("annexe2"),
  identification: BaseIdentification,
  contact: z.object({
    contactEmail: z.string().email(),
  }),
});

export const FormDataMapSchema = z.discriminatedUnion("formType", [
  Annexe2Schema,
  FullFormSchema,
]);

export const FormTypeEnum = z.enum(["annexe2", "annexe2and4"]);
export type FormType = z.infer<typeof FormTypeEnum>;

export type Annex2Type = z.infer<typeof Annexe2Schema>;
export type GliderSchemaType = z.infer<typeof GliderDataSchema>;
export type ParticipantType = z.infer<typeof ParticipantSchema>;
export type FullFormSchemaType = z.infer<typeof FullFormSchema>;
export type FormData = z.infer<typeof FormDataMapSchema>;
