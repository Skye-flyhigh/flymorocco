import { getKeywordsForSiteGuide } from "@/data/keywords";
import { SITE_NAME, SITE_URL } from "@/data/metadata";
import { getSiteMeta } from "@/lib/data-retrievers/getSiteMeta";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import Link from "next/link";
import Script from "next/script";
import Carousel from "../../components/Carousel";
import Hero from "../../components/Hero";
import MissingMountain from "../../components/siteGuides/MissingMountain";
import SiteGuideTracker from "../../components/siteGuides/SiteGuideTracker";
import SiteMapContainer from "../../components/siteGuides/SiteMapContainer";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const t = await getTranslations({ locale, namespace: `siteGuides.${slug}` });
  const meta = getSiteMeta(slug);

  return {
    title: t("name"),
    description: t("description"),
    keywords: getKeywordsForSiteGuide(slug, t("name"), locale),
    openGraph: {
      title: t("name"),
      description: t("description"),
      url: `${SITE_URL}/${locale}/site-guides/${slug}`,
      siteName: SITE_NAME,
      images: meta
        ? [
            {
              url: meta.image,
              width: 1200,
              height: 900,
              alt: t("name"),
            },
          ]
        : [],
      locale,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: t("name"),
      description: t("description"),
      images: meta ? [meta.image] : [],
    },
    alternates: {
      canonical: `${SITE_URL}/${locale}/site-guides/${slug}`,
      languages: {
        en: `${SITE_URL}/en/site-guides/${slug}`,
        fr: `${SITE_URL}/fr/site-guides/${slug}`,
      },
    },
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}) {
  //TODO: add the legal info
  const { slug } = await params;
  const meta = getSiteMeta(slug);
  const t = await getTranslations("siteGuides");

  if (!meta || !slug) return <MissingMountain />;

  const schema = {
    "@context": "https://schema.org",
    "@type": "TouristAttraction",
    name: t(`${slug}.name`),
    description: t(`${slug}.description`),
    image: meta.image,
    geo: {
      "@type": "GeoCoordinates",
      latitude: meta.lat,
      longitude: meta.lon,
    },
  };

  const legislation = t(`${slug}.legislation`);
  const legislationExists =
    legislation !== `siteGuides.${slug}.legislation` && legislation !== "";

  console.log("Legislation blurb check:", legislationExists);

  return (
    <>
      <SiteGuideTracker siteName={slug} />
      <main className="m-auto flex flex-col">
        <Hero
          title={t(`${slug}.name`)}
          subtitle={t(`${slug}.description`)}
          img={meta.image}
        />
        <div className="text-sm text-gray-500 max-w-3/4 min-w-11/12 mx-auto p-5">
          Altitude: {meta.launch_altitude}m | Coordinates: {meta.lat},{" "}
          {meta.lon}
        </div>

        <div id="site-map" className="py-5 flex justify-center items-center">
          <SiteMapContainer zoom={13} lat={meta.lat} lon={meta.lon} />
        </div>
        <section id="description" className="max-w-3/4 min-w-11/12 mx-auto p-5">
          <p className="prose mb-6">{t(`${slug}.longDescription`)}</p>
          <div
            tabIndex={0}
            className="collapse collapse-arrow bg-base-100 border-base-300 border mb-2"
          >
            <div className="collapse-title font-semibold">{t("takeoff")}</div>
            <div className="collapse-content text-sm">
              {t(`${slug}.takeoff`)}
            </div>
          </div>
          <div
            tabIndex={0}
            className="collapse collapse-arrow bg-base-100 border-base-300 border mb-2"
          >
            <div className="collapse-title font-semibold">{t("landing")}</div>
            <div className="collapse-content text-sm">
              {t(`${slug}.landing`)}
            </div>
          </div>
          <div
            tabIndex={0}
            className="collapse collapse-arrow bg-base-100 border-base-300 border mb-2"
          >
            <div className="collapse-title font-semibold">{t("flying")}</div>
            <div className="collapse-content text-sm">
              {t(`${slug}.flying`)}
            </div>
          </div>
          <div
            tabIndex={0}
            className="collapse collapse-arrow bg-base-100 border-base-300 border mb-2"
          >
            <div className="collapse-title font-semibold">{t("hazard")}</div>
            <div className="collapse-content text-sm">
              {t(`${slug}.hazard`)}
            </div>
          </div>
        </section>

        {legislationExists && (
          <section
            id="legal-info"
            className="max-w-3/4 min-w-11/12 mx-auto p-5 bg-primary text-primary-content rounded-2xl"
          >
            <p>{t(`${slug}.legislation`)}</p>
          </section>
        )}

        <Link
          href="/site-guides"
          className="btn btn-secondary my-10 self-center"
        >
          {t("return")}
        </Link>
      </main>
      <div
        id="carousel-container"
        className="flex justify-center bg-base-200 w-screen"
      >
        <Carousel images={meta.images} />
      </div>
      <Script
        id="schema-org"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
    </>
  );
}
