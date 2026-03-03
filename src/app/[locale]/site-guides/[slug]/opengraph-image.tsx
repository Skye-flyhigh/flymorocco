import { BUSINESS, SITE_NAME } from "@/data/metadata";
import { getSiteMeta } from "@/lib/data-retrievers/getSiteMeta";
import { createOgCard, OG_SIZE } from "@/lib/og/createOgCard";
import { readLogo, readOgImage } from "@/lib/og/readOgImage";
import { getTranslations } from "next-intl/server";
import { ImageResponse } from "next/og";

export const alt = `${BUSINESS.name} Site Guide`;
export const size = OG_SIZE;
export const contentType = "image/png";

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}) {
  const { slug, locale } = await params;
  const meta = getSiteMeta(slug);

  if (!meta) {
    return new ImageResponse(
      <div
        style={{
          display: "flex",
          width: "100%",
          height: "100%",
          alignItems: "center",
          justifyContent: "center",
          background: "#1a1a1a",
          color: "white",
          fontSize: 48,
        }}
      >
        {SITE_NAME}
      </div>,
      { ...size },
    );
  }

  const [t, bgImage, logo] = await Promise.all([
    getTranslations({ locale, namespace: `siteGuides.${slug}` }),
    readOgImage(slug),
    readLogo(),
  ]);

  return new ImageResponse(
    createOgCard({
      title: t("name"),
      subtitle: t("description"),
      bgImageUrl: bgImage,
      logoSrc: logo,
    }),
    { ...size },
  );
}
