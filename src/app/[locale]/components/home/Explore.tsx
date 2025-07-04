"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";

export default function Explore() {
  const t = useTranslations("HomePage");

  return (
    <section id="explore" className="grid grid-rows-[150px_1fr_150px] relative">
      <div
        className="w-full h-full absolute inset-0 z-0 bg-primary/20 overflow-hidden"
        style={{
          maskImage: "url('/images/star-tile.svg')",
          maskRepeat: "repeat",
          maskSize: "132px 134px",
        }}
      />
      <article className="row-start-2 row-end-3 py-5 backdrop-blur-xl bg-base-100/80 flex items-center justify-center relative z-10">
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
