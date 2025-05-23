"use client";

import { useTranslations } from "next-intl";
import Hero from "../components/Hero";
import SiteCard from "../components/siteGuides/SiteCard";
import { SiteMeta, siteMeta } from "@/lib/validation/siteMeta";
import FeaturedSites from "../components/FeaturedSites";
import { useState } from "react";
import SiteMapSection from "../components/SiteMapSection";

export default function SiteGuidesPage() {
  const t = useTranslations("siteGuides");

  const [searchInput, setSearchInput] = useState<string>("");

  const filterOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value.toLocaleLowerCase());
  };

  const normalise = (str: string) =>
    str
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[-_ ]/g, "")
      .toLocaleLowerCase();

  return (
    <main>
      <Hero
        title={t("title")}
        subtitle={t("subtitle")}
        img="/images/ouizen-2310x1440.jpg"
      />
      <FeaturedSites />
      <SiteMapSection />
      <section className="w-screen p-10">
        <div
          id="titles"
          className="w-full flex flex-wrap justify-evenly items-baseline"
        >
          <h2 className="section-title">{t("siteSelector")}</h2>
          <label className="input">
            <svg
              className="h-[1em] opacity-50"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              <g
                strokeLinejoin="round"
                strokeLinecap="round"
                strokeWidth="2.5"
                fill="none"
                stroke="currentColor"
              >
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.3-4.3"></path>
              </g>
            </svg>
            <input
              type="search"
              className="grow"
              placeholder="Filter sites"
              onChange={filterOnChange}
            />
          </label>
        </div>
        <div
          id="container"
          className="max-w-screen flex flex-row flex-wrap justify-evenly gap-3 transition-all pt-5"
        >
          {Object.values(siteMeta)
            .filter((site) =>
              normalise(site.slug).includes(normalise(searchInput)),
            )
            .map((site: SiteMeta) => (
              <div key={site.slug} className="w-1/6 min-w-80 align-middle">
                <SiteCard key={site.slug} site={site} />
              </div>
            ))}
        </div>
      </section>
    </main>
  );
}
