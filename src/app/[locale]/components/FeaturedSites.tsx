"use client";
import { siteMeta } from "@/lib/validation/siteMeta";
import { useTranslations } from "next-intl";
import { ParallaxBanner, ParallaxBannerLayer } from "react-scroll-parallax";

function hashStringToNumber(str: string) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function getTodayFeaturedSite() {
  const today = new Date().toISOString().split("T")[0];
  const hash = hashStringToNumber(today);
  const keys = Object.keys(siteMeta);
  const index = hash % keys.length;
  const selectedKey = keys[index];
  return siteMeta[selectedKey];
}

export default function FeaturedSites() {
  const t = useTranslations("siteGuides");
  const featuredSite = getTodayFeaturedSite();

  return (
    <section
      id="featured-site"
      className="sm:grid grid-cols-2 bg-base-200 shadow-md hover:shadow-xl transition-shadow my-10"
    >
      <div id="cell" className="flex flex-col justify-evenly p-10 my-10">
        <h2 className="section-title">{t("featuring")}</h2>
        <h3 className="section-subtitle capitalize">
          {t(`${featuredSite.slug}.name`)}
        </h3>
        <p className="prose">{t(`${featuredSite.slug}.description`)}</p>
        <a
          href={`/site-guides/${featuredSite.slug}`}
          className="btn btn-primary self-end max-w-64 mt-6"
        >
          {t(`${featuredSite.slug}.name`)}
        </a>
      </div>
      <ParallaxBanner className="h-full" style={{ aspectRatio: "1 / 1" }}>
        <ParallaxBannerLayer image={featuredSite.image} speed={-10} />
      </ParallaxBanner>
    </section>
  );
}
