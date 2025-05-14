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
  firstName: z.string(),
  lastName: z.string(),
});
const BaseContact = z.object({
  contactEmail: z.string().email(),
});

export const Annexe2BaseSchema = z.object({
  identification: BaseIdentification,
  contact: BaseContact,
});

export const Annexe2Schema = Annexe2BaseSchema.extend({
  formType: z.literal("annexe2"),
});

export const FullFormSchema = z.object({
  formType: z.literal("annexe2and4"),
  identification: BaseIdentification.extend({
    nationality: z.string(),
    passportNumber: z.string(),
  }),
  contact: BaseContact.extend({
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

export const FormDataMapSchema = z.discriminatedUnion("formType", [
  Annexe2Schema,
  FullFormSchema,
]);

export type FormType = z.infer<typeof FormTypeEnum>;
export const FormTypeEnum = z.enum(["annexe2", "annexe2and4"]);

export type Annex2Type = z.infer<typeof Annexe2Schema>;
export type GliderSchemaType = z.infer<typeof GliderDataSchema>;
export type ParticipantType = z.infer<typeof ParticipantSchema>;
export type FullFormSchemaType = z.infer<typeof FullFormSchema>;
export type FormData = z.infer<typeof FormDataMapSchema>;
