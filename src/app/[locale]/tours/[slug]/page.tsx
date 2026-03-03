import { getKeywordsForTour } from "@/data/keywords";
import { BUSINESS, SITE_NAME, SITE_URL } from "@/data/metadata";
import rawPricing from "@/data/pricing.json";
import { routing } from "@/i18n/routing";
import { isValidTourSlug, TOUR_SLUGS, TourSlug } from "@/lib/types/tour";
import { getTourImages } from "@/lib/utils/tourImages";
import { getTranslations } from "next-intl/server";
import { Metadata } from "next/dist/lib/metadata/types/metadata-interface";
import Image from "next/image";
import { notFound } from "next/navigation";
import Script from "next/script";
import Carousel from "../../components/Carousel";
import Hero from "../../components/Hero";
import Activities from "../../components/tours/Activities";
import MissingTour from "../../components/tours/MissingTour";
import MustHave from "../../components/tours/MustHave";
import SelectedCalendar from "../../components/tours/SelectedCalendar";
import TourService from "../../components/tours/TourService";

export async function generateStaticParams() {
  return routing.locales.flatMap((locale: string) =>
    TOUR_SLUGS.map((slug: string) => ({ locale, slug })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;

  if (!TOUR_SLUGS.includes(slug as TourSlug)) {
    notFound(); // Next.js built-in 404 handling
  }

  const t = await getTranslations({ locale, namespace: `tours.${slug}` });
  const { heroImage } = getTourImages(slug as TourSlug);

  return {
    title: t("title"),
    description: t("subtitle"),
    keywords: getKeywordsForTour(slug, locale),
    openGraph: {
      title: t("title"),
      description: t("subtitle"),
      url: `${SITE_URL}/${locale}/tours/${slug}`,
      siteName: SITE_NAME,
      images: [
        {
          url: heroImage,
          width: 1200,
          height: 900,
          alt: t("title"),
        },
      ],
      locale,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: t("title"),
      description: t("subtitle"),
      images: [heroImage],
    },
    alternates: {
      canonical: `${SITE_URL}/${locale}/tours/${slug}`,
      languages: {
        en: `${SITE_URL}/en/tours/${slug}`,
        fr: `${SITE_URL}/fr/tours/${slug}`,
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

  const area = BUSINESS.operatingAreas.find((a) =>
    (a.tours as readonly string[]).includes(slug),
  ) ?? BUSINESS.operatingAreas[0];
  const { latitude: lat, longitude: lon } = area.geo;

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: t(`${slug}.serviceType`),
    name: t(`${slug}.title`),
    description: t(`${slug}.description`),
    provider: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
    },
    image: heroImage,
    additionalType: "https://schema.org/TouristAttraction",
    touristType: locale === "fr" ? "Tourisme Parapente" : "Paragliding Tourism",
    availableLanguage: ["en", "fr"],
    contactPoint: {
      "@type": "ContactPoint",
      telephone: BUSINESS.contact.phone,
      contactType: "Customer Service",
      email: BUSINESS.contact.email,
      areaServed: area.countryCode,
      availableLanguage: [...BUSINESS.languages],
    },
    offers: {
      "@type": "Offer",
      url: `${SITE_URL}/${locale}/tours/${slug}`,
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
          name: SITE_NAME,
          url: SITE_URL,
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

      <section id="tour-details">
        <div className="grid lg:grid-cols-2  justify-center items-center">
          <Image
            src={img[0].src}
            alt={img[0].alt}
            height={img[0].height}
            width={img[0].width}
            className="object-cover aspect-square"
          />
          <MustHave slug={slug as TourSlug} />
        </div>

        <Carousel images={img} />

        <div className="grid lg:grid-cols-2 justify-center items-center">
          <Activities slug={slug as TourSlug} />
          <Image
            src={img[1].src}
            alt={img[1].alt}
            height={img[1].height}
            width={img[1].width}
            className="object-cover aspect-square"
          />
        </div>
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
