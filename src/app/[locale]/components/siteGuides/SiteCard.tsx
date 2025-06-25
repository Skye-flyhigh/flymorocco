"use client";
import { SiteMeta } from "@/lib/validation/siteMeta";
import { extractImageDimensions } from "@/scripts/imageProcessing";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function SiteCard({ site }: { site: SiteMeta }) {
  const t = useTranslations("siteGuides");
  const [showFullDescription, setShowFullDescription] = useState(false);

  let siteDescription = t(`${site.slug}.description`);
  if (!showFullDescription && siteDescription.length > 120) {
    siteDescription = siteDescription.substring(0, 120) + "...";
  }

  const imagePath = site.image || `/images/fallback-1944x1944.webp`;
  const { width, height } = extractImageDimensions(imagePath);

  return (
    <div className="card bg-base-100 hover:bg-base-200 shadow-xl hover:shadow-2xl transition-all h-full w-full">
      <figure className="aspect-video">
        <Image
          src={imagePath}
          alt={t(`${site.slug}.name`)}
          width={width}
          height={height}
          className="card-side object-cover"
        />
      </figure>
      <div className="card-body">
        <h2 className="card-title">{t(`${site.slug}.name`)}</h2>
        <p className="text-sm text-neutral">{t(`${site.slug}.region`)}</p>
        <div id="desc-ctn" className="flex">
          <p className="prose">{siteDescription}</p>
        </div>
        <button
          className="link self-end"
          onClick={() => setShowFullDescription((prevState) => !prevState)}
        >
          {siteDescription.length > 120 &&
            (showFullDescription ? t("less") : t("more"))}
        </button>

        <div className="card-actions justify-end">
          <Link
            href={`/site-guides/${site.slug}`}
            className="btn btn-primary btn-sm"
          >
            {t("viewSite")}
          </Link>
        </div>
      </div>
    </div>
  );
}
