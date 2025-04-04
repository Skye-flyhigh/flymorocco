import { z } from "zod";
import rawPartnerMeta from "@/data/partnerMeta.json";

const PartnerMetaSchema = z.object({
    slug: z.string(),
    name: z.string(),
    url: z.string().url(),
    img: z.string().url()
})

const PartnerMetaMapSchema = z.record(PartnerMetaSchema);
const parsedResult = PartnerMetaMapSchema.safeParse(rawPartnerMeta)

if (!parsedResult.success) {
    console.error("❌ Partner's data (meta) validation failed:", parsedResult.error.format())
}

export const partnerMeta = parsedResult.data;
export type PartnerMeta = z.infer<typeof PartnerMetaSchema>;
export type PartnerMetaMap = Record<string, PartnerMeta>;