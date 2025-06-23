"use client";

import { SiteMeta, siteMeta } from "@/lib/validation/siteMeta";
import { useState } from "react";
import SiteCard from "./SiteCard";
import { useTranslations } from "next-intl";

export default function SearchSiteBar() {
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
    <section className="w-screen p-10">
      <div
        id="titles"
        className="w-full flex flex-wrap justify-evenly items-baseline"
      >
        <h2 className="section-title">{t("siteSelector")}</h2>
        <label className="input" htmlFor="search-sites">
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
            id="search-sites"
            name="search"
            type="search"
            className="grow"
            placeholder="Filter sites"
            onChange={filterOnChange}
          />
        </label>
      </div>
      <div
        id="container"
        className="w-full flex flex-wrap justify-evenly gap-3 transition-all pt-5"
      >
        {Object.values(siteMeta)
          .filter((site) =>
            normalise(site.slug).includes(normalise(searchInput)),
          )
          .map((site: SiteMeta) => (
            <div key={site.slug} className="w-1/6 min-w-72">
              <SiteCard key={site.slug} site={site} />
            </div>
          ))}
      </div>
    </section>
  );
}
