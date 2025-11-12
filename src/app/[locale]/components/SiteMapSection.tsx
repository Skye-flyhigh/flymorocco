"use client";
import { useTranslations } from "next-intl";
import SiteMapContainer from "./siteGuides/SiteMapContainer";

export default function SiteMapSection() {
  const t = useTranslations("siteGuides");

  return (
    <section id="map" className="w-screen m-auto md:py-15 px-5">
      <h2 className="section-title">{t("siteMap.title")}</h2>
      <p className="section-subtitle">{t("siteMap.subtitle")}</p>
      <div
        id="container"
        className="w-full flex flex-col justify-center items-center relative"
      >
        <SiteMapContainer zoom={6} lat={29.5} lon={-9.5} />
      </div>
    </section>
  );
}
