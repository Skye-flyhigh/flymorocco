"use client";
import { SiteMeta } from "@/lib/validation/siteMeta";
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

  return (
    <div className="card bg-base-100 shadow-xl w-full min-w-96">
      <figure>
        <Image
          src={site.image}
          alt={t(`${site.slug}.name`)}
          width={800}
          height={500}
          className="card-side object-cover aspect-auto"
        />
      </figure>
      <div className="card-body">
        <h2 className="card-title">{t(`${site.slug}.name`)}</h2>
        <p className="text-sm text-gray-500">{t(`${site.slug}.region`)}</p>
        <p className="prose">{siteDescription}</p>
        <button
          className="link"
          onClick={() => setShowFullDescription((prevState) => !prevState)}
        >
          {showFullDescription ? t("less") : t("more")}
        </button>
        <div className="card-actions justify-end">
          <Link
            href={`/site-guides/${site.slug}`}
            className="btn btn-primary btn-sm"
          >
            View Site
          </Link>
        </div>
      </div>
    </div>
  );
}
