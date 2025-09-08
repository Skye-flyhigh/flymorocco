import Hero from "../../components/Hero";
import { getTranslations } from "next-intl/server";
import Activities from "../../components/tours/Activities";
import MustHave from "../../components/tours/MustHave";
import TourService from "../../components/tours/TourService";
import Image from "next/image";
import SelectedCalendar from "../../components/tours/SelectedCalendar";
import { isValidTourSlug, TOUR_SLUGS, TourSlug } from "@/lib/types/tour";
import MissingTour from "../../components/tours/MissingTour";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { getTourImages } from "@/lib/utils/tourImages";
import Script from "next/script";
import rawPricing from "@/data/pricing.json";

export async function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    TOUR_SLUGS.map((slug) => ({ locale, slug })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}) {
  const { locale, slug } = await params;

  if (!TOUR_SLUGS.includes(slug as TourSlug)) {
    notFound(); // Next.js built-in 404 handling
  }

  const t = await getTranslations({ locale, namespace: `tours.${slug}` });

  const baseKeywords =
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

  const tourSpecificKeywords = [];

  switch (slug) {
    case "wellbeing":
      if (locale === "fr") {
        tourSpecificKeywords.push(
          "bien-être Maroc",
          "séjour bien-être Maroc",
          "relaxation Maroc",
          "méditation yoga Maroc",
          "séjour bien-être parapente Maroc",
          "vacance hiver parapente",
        );
      } else {
        tourSpecificKeywords.push(
          "wellbeing Morocco",
          "wellbeing retreat Morocco",
          "relaxation Morocco",
          "meditation yoga Morocco",
          "paragliding wellbeing Morocco",
          "winter paragliding holiday Morocco",
        );
      }
      break;
    case "mountain":
      if (locale === "fr") {
        tourSpecificKeywords.push(
          "montagnes du Maroc",
          "Aguergour",
          "Ait Ourir",
          "parapente Marrakech",
          "vol libre au Maroc",
          "parapente Atlas Maroc",
          "Toubkal",
        );
      } else {
        tourSpecificKeywords.push(
          "mountains of Morocco",
          "paragliding Morocco",
          "Atlas paragliding Morocco",
          "Toubkal",
          "Aguergour",
          "Ait Ourir",
          "Marrakech paragliding",
        );
      }
      break;
    case "coastal":
      if (locale === "fr") {
        tourSpecificKeywords.push(
          "plage Maroc",
          "Mirleft",
          "Sidi Ifni",
          "Nid d'Aigle",
          "Aglou",
          "Aglou Plage",
          "Parc naturel Souss-Massa",
        );
      } else {
        tourSpecificKeywords.push(
          "beach Morocco",
          "ocean Morocco",
          "relaxation Morocco",
          "Nid d'Aigle",
          "Aglou",
          "Aglou Beach",
          "Souss-Massa National Park",
        );
      }
      break;
  }

  return {
    title: t("title"),
    description: t("subtitle"),
    keywords: [...baseKeywords, ...tourSpecificKeywords],
    openGraph: {
      title: t("title"),
      description: t("subtitle"),
      url: `https://flymorocco.info/${locale}`,
      siteName: "Flymorocco",
      images: [
        {
          url: `/og-image/${slug}.webp`,
          width: 1200,
          height: 900,
          alt: slug,
        },
      ],
      locale,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: t("title"),
      description: t("subtitle"),
      images: [`/og-image/${slug}.webp`],
    },
    alternates: {
      canonical: `https://flymorocco.com/${locale}`,
      languages: {
        en: "https://flymorocco.com/en",
        fr: "https://flymorocco.com/fr",
      },
    },
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}) {
  const { slug, locale } = await params;
  const pricing: Record<string, Record<string, number>> = {
    EUR: {
      wellbeing: rawPricing.tours.wellbeing.EUR.base,
      mountain: rawPricing.tours.mountain.EUR.base,
      coastal: rawPricing.tours.coastal.EUR.base,
    },
    GBP: {
      wellbeing: rawPricing.tours.wellbeing.GBP.base,
      mountain: rawPricing.tours.mountain.GBP.base,
      coastal: rawPricing.tours.coastal.GBP.base,
    },
  };
  const price = pricing.EUR[slug];

  if (!isValidTourSlug(slug)) {
    return <MissingTour />;
  }

  const t = await getTranslations("tours");

  const tourImageData = getTourImages(slug);
  const { heroImage, images: img } = tourImageData;

  let { lat, lon } = { lat: 31.6295, lon: -8.0009 };

  switch (slug) {
    case "wellbeing":
    case "coastal":
      ({ lat, lon } = { lat: 29.578839934298145, lon: -10.034339239347261 });
      break;
    case "mountain":
      ({ lat, lon } = { lat: 31.29309943199174, lon: -8.081017604069611 });
      break;
    default:
      ({ lat, lon } = { lat: 31.6295, lon: -8.0009 });
      break;
  }

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: t(`${slug}.serviceType`),
    name: t(`${slug}.title`),
    description: t(`${slug}.description`),
    provider: {
      "@type": "Organization",
      name: "FlyMorocco",
      url: "https://flymorocco.com",
    },
    image: heroImage,
    additionalType: "https://schema.org/TouristAttraction",
    touristType: locale === "fr" ? "Tourisme Parapente" : "Paragliding Tourism",
    availableLanguage: ["en", "fr"],
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+212 634041761",
      contactType: "Customer Service",
      email: "contact@flymorocco.info",
      areaServed: "MA",
      availableLanguage: ["en", "fr"],
    },
    offers: {
      "@type": "Offer",
      url: `https://flymorocco.com/${locale}/tours/${slug}`,
      priceCurrency: "EUR",
      price,
      itemOffered: {
        "@type": "Service",
        serviceType: t(`${slug}.serviceType`),
        availability: {
          "@type": "ItemAvailability",
          availability: "InStock",
        },
        provider: {
          "@type": "Organization",
          name: "FlyMorocco",
          url: "https://flymorocco.com",
        },
        geo: {
          "@type": "GeoCoordinates",
          latitude: lat,
          longitude: lon,
        },
      },
    },
  };

  return (
    <main className="m-auto">
      <Hero
        title={t(`${slug}.title`)}
        subtitle={t(`${slug}.subtitle`)}
        img={heroImage}
      />

      <section id="tour-description" className="py-20 px-10 flex flex-col">
        <p className="prose">{t(`${slug}.intro`)}</p>
        <h2 className="text-3xl font-extrabold text-center mt-10 mb-5">
          {`€${pricing.EUR[slug]} / £${pricing.GBP[slug]}`}
        </h2>
        <h3 className="text-xl font-semibold text-center">{t("unit")}</h3>
        <TourService />
      </section>

      <section
        id="tour-details"
        className="grid lg:grid-cols-2 grid-rows-2 justify-center items-center"
      >
        <Image
          src={img[0].src}
          alt={img[0].alt}
          height={img[0].height}
          width={img[0].width}
          className="object-cover aspect-square"
        />
        <MustHave slug={slug as TourSlug} />
        <Activities slug={slug as TourSlug} />
        <Image
          src={img[1].src}
          alt={img[1].alt}
          height={img[1].height}
          width={img[1].width}
          className="object-cover aspect-square"
        />
      </section>

      <SelectedCalendar slug={slug as TourSlug} />

      <Script
        id="schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
    </main>
  );
}
