import { z } from "zod";

export const ImageTypeSchema = z.object({
  src: z.string(),
  alt: z.string(),
  width: z.number().optional(),
  height: z.number().optional(),
});

export type ImageType = z.infer<typeof ImageTypeSchema>;
