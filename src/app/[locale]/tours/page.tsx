import { useTranslations } from "next-intl";
import Hero from "../components/Hero";
import TourCalendar from "../components/tours/TourCalendar";
import TourService from "../components/tours/TourService";
import Carousel from "../components/Carousel";
import TourCards from "../components/tours/TourCards";
import Link from "next/link";
import { buildPageMetadata } from "@/lib/metadata/buildPageMetadata";
import Script from "next/script";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  const metadata = await buildPageMetadata({ locale, page: "tours" });

  const keywords =
    locale === "fr"
      ? [
          "séjour parapente Maroc",
          "découverte parapente du Maroc",
          "séjour guidé parapente",
          "vacances parapente Maroc",
        ]
      : [
          "paragliding tour Morocco",
          "paragliding guided tour",
          "paragliding guided tour Morocco",
          "discover paragliding in Morocco",
          "paragliding holidays Morocco",
        ];

  metadata.keywords = [...(metadata.keywords || []), ...keywords];

  return metadata;
}

export default function Page() {
  const t = useTranslations("tours");

  const schema = {
    "@context": "https://schema.org",
    "@type": "TouristAttraction",
    name: t("title"),
    description: t("description"),
    image: "/images/niviuk-aguergour-square.webp",
    address: {
      "@type": "PostalAddress",
      addressCountry: "MA",
      addressRegion: "Atlas Mountains",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 31.6295,
      longitude: -8.0009,
    },
    touristType: "Paragliding Tourism",
    availableLanguage: ["en", "fr"],
    provider: {
      "@type": "Organization",
      name: "FlyMorocco",
    },
  };

  const images = [
    {
      src: "/images/skye.webp",
      alt: "Skye Ground Handling",
      height: 1080,
      width: 1204,
    },
    {
      src: "/images/two-niviuk.webp",
      alt: "Two Niviuk gliders over Agafay, in Aguergour",
      height: 1500,
      width: 1497,
    },
    {
      src: "/images/plage-626x835.webp",
      alt: "Plage Ground Handling",
      height: 835,
      width: 626,
    },
    {
      src: "/images/niviuk-aguergour-square.webp",
      alt: "Niviuk Aguergour",
      height: 1500,
      width: 1497,
    },
  ];

  return (
    <main id="main">
      <Hero
        title={t("title")}
        subtitle={t("subtitle")}
        img="/images/camel-1865x1415.webp"
      />
      <section
        id="explore"
        className="relative grid grid-rows-[150px_1fr_150px]"
      >
        <div
          className="w-full h-full absolute inset-0 z-0 bg-primary/20 overflow-hidden"
          style={{
            maskImage: "url('/images/star-tile.svg')",
            maskRepeat: "repeat",
            maskSize: "132px 134px",
          }}
        />
        <article className="row-start-2 row-end-2 backdrop-blur-xl bg-base-100/80 flex items-center justify-center py-5">
          <div id="article-container" className="max-w-2xl w-11/12 px-4">
            <h2 className="section-title">{t("explore.title")}</h2>
            <h3 className="section-subtitle">{t("explore.subtitle")}</h3>
            <p className="prose mb-15">{t("explore.blurb")}</p>
            <div
              id="btn-wrapper"
              className="flex flex-wrap w-full justify-evenly gap-4 mt-3"
            >
              <Link href="#tour-calendar" id="schedule-link" className="btn">
                {t("explore.scheduleLink")}
              </Link>
              <Link
                href="#tour-service"
                id="service-link"
                className="btn btn-primary"
              >
                {t("explore.serviceLink")}
              </Link>
              <Link
                href="#tour-cards"
                id="tour-link"
                className="btn btn-secondary"
              >
                {t("explore.tourLink")}
              </Link>
            </div>
          </div>
        </article>
      </section>
      <TourCards />
      <TourService />
      <section
        id="carousel"
        className="w-full bg-base-200 h-fit flex justify-center"
      >
        <Carousel images={images} />
      </section>
      <TourCalendar />
      <Script
        id="tour-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
    </main>
  );
}
