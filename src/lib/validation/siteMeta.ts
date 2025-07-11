import { z } from "zod";
import rawSiteMeta from "@/data/siteMeta.json";

const SiteMetaSchema = z.object({
  slug: z.string(),
  image: z.string(),
  lat: z.number(),
  lon: z.number(),
  launch_altitude: z.number(),
  windDirections: z.array(z.string()),
  images: z.array(z.object({ src: z.string(), alt: z.string() })),
});

const SiteMetaMapSchema = z.record(SiteMetaSchema);
const parsedResult = SiteMetaMapSchema.safeParse(rawSiteMeta);

if (!parsedResult.success) {
  console.error(
    "❌ Validation of site Meta failed:",
    parsedResult.error.format(),
  );
}

export const siteMeta = parsedResult.success
  ? (parsedResult.data as SiteMetaMap)
  : (() => {
      throw new Error("Invalid site meta data: Wrong mountain 🏔️");
    })();
export type SiteMeta = z.infer<typeof SiteMetaSchema>;
export type SiteMetaMap = Record<string, SiteMeta>;
