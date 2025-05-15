import { Metadata } from "next";
import { getSiteMeta } from "../data-retrievers/getSiteMeta";
import fs from "fs";
import path from "path";

export async function generateSiteMetadata({
  params,
}: {
  params: { slug: string; local: string };
}): Promise<Metadata> {
  const { slug, local } = params;
  const meta = getSiteMeta(slug);
  if (!meta) return { title: "Not Found" };

  const filePath = path.join(process.cwd(), "messages", `${local}.json`);
  const raw = fs.readFileSync(filePath, "utf-8");
  const messages = JSON.parse(raw);
  const t = messages.siteGuides?.[slug];

  return {
    title: `${t?.name} – FlyMorocco`,
    description: t?.description,
  };
}
