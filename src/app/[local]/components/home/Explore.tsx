"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";

export default function Explore() {
  const t = useTranslations("HomePage");

  return (
    <section
      id="explore"
      className="grid grid-rows-[150px_1fr_150px] h-screen bg-primary"
      style={{
        maskImage: 'url("/images/stars.svg")',
        maskRepeat: "repeat",
        maskPosition: "center",
      }}
    >
      <article className="row-start-2 row-end-3 backdrop-blur-xl bg-base-100/80 flex items-center justify-center">
        <div id="article-container" className="max-w-2xl w-11/12 px-4">
          <h2 className="section-title">{t("explore.title")}</h2>
          <h3 className="section-subtitle">{t("explore.subtitle")}</h3>
          <p className="prose">{t("explore.blurb")}</p>
          <div
            id="btn-wrapper"
            className="flex flex-wrap w-full justify-evenly gap-4 mt-3"
          >
            <Link href="/site-guides" id="site-link" className="btn">
              {t("explore.siteLink")}
            </Link>
            <Link href="/tours" id="tour-link" className="btn btn-secondary">
              {t("explore.tourLink")}
            </Link>
          </div>
        </div>
      </article>
    </section>
  );
}
