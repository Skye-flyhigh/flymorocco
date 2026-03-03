import { BUSINESS, SITE_NAME } from "@/data/metadata";
import { createOgCard, OG_SIZE } from "@/lib/og/createOgCard";
import { readLogo, readOgImage } from "@/lib/og/readOgImage";
import { isValidTourSlug } from "@/lib/types/tour";
import { getTranslations } from "next-intl/server";
import { ImageResponse } from "next/og";

export const alt = `${BUSINESS.name} Tours`;
export const size = OG_SIZE;
export const contentType = "image/png";

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}) {
  const { slug, locale } = await params;

  if (!isValidTourSlug(slug)) {
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
    getTranslations({ locale, namespace: `tours.${slug}` }),
    readOgImage(slug),
    readLogo(),
  ]);

  return new ImageResponse(
    createOgCard({
      title: t("title"),
      subtitle: t("subtitle"),
      bgImageUrl: bgImage,
      logoSrc: logo,
    }),
    { ...size },
  );
}
