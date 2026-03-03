import { BUSINESS, SITE_NAME, SITE_URL } from "@/data/metadata";
import rawPricing from "@/data/pricing.json";
import { useTranslations } from "next-intl";

interface TourData {
  name: string;
  description: string;
  duration?: string;
  price?: string;
}

interface SiteData {
  name: string;
  description: string;
  lat: number;
  lon: number;
}

interface StructuredDataProps {
  type?: "business" | "tour" | "site";
  data?: TourData | SiteData;
}

export default function StructuredData({
  type = "business",
  data,
}: StructuredDataProps) {
  const t = useTranslations("seo");

  const businessData = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": SITE_URL,
    name: t("business.name"),
    legalName: BUSINESS.legalName,
    description: t("business.description"),
    url: SITE_URL,
    telephone: BUSINESS.contact.phone,
    email: BUSINESS.contact.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: BUSINESS.address.street,
      addressLocality: BUSINESS.address.city,
      postalCode: BUSINESS.address.postcode,
      addressCountry: BUSINESS.address.country,
    },
    areaServed: BUSINESS.operatingAreas.map((area) => ({
      "@type": "Place",
      name: area.name,
      address: {
        "@type": "PostalAddress",
        addressRegion: area.region,
        addressCountry: area.countryCode,
      },
      geo: {
        "@type": "GeoCoordinates",
        latitude: area.geo.latitude,
        longitude: area.geo.longitude,
      },
    })),
    geo: {
      "@type": "GeoCoordinates",
      latitude: BUSINESS.operatingAreas[0].geo.latitude,
      longitude: BUSINESS.operatingAreas[0].geo.longitude,
    },
    priceRange: "€€",
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Paragliding Services",
      itemListElement: [
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: t("services.coastal.name"),
            description: t("services.coastal.description"),
          },
          price: rawPricing.tours.coastal.EUR.base,
          priceCurrency: "EUR",
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: t("services.mountain.name"),
            description: t("services.mountain.description"),
          },
          price: rawPricing.tours.mountain.EUR.base,
          priceCurrency: "EUR",
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: t("services.wellness.name"),
            description: t("services.wellness.description"),
          },
          price: rawPricing.tours.wellbeing.EUR.base,
          priceCurrency: "EUR",
        },
      ],
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "5.0",
      reviewCount: "4",
      bestRating: "5",
    },
    sameAs: [BUSINESS.social.facebook, BUSINESS.social.instagram],
  };

  const tourData =
    data && type === "tour"
      ? {
          "@context": "https://schema.org",
          "@type": "TouristTrip",
          name: data.name,
          description: data.description,
          provider: {
            "@type": "LocalBusiness",
            name: SITE_NAME,
            url: SITE_URL,
          },
          touristType: "Adventure Tourism",
          duration: (data as TourData).duration || "P7D",
          offers: {
            "@type": "Offer",
            price: (data as TourData).price,
            priceCurrency: "EUR",
            availability: "https://schema.org/InStock",
          },
        }
      : null;

  const siteData =
    data && type === "site"
      ? {
          "@context": "https://schema.org",
          "@type": "TouristAttraction",
          name: data.name,
          description: data.description,
          geo: {
            "@type": "GeoCoordinates",
            latitude: (data as SiteData).lat,
            longitude: (data as SiteData).lon,
          },
          address: {
            "@type": "PostalAddress",
            addressCountry: "Morocco",
          },
        }
      : null;

  const getStructuredData = () => {
    switch (type) {
      case "tour":
        return tourData;
      case "site":
        return siteData;
      default:
        return businessData;
    }
  };

  const structuredData = getStructuredData();

  return structuredData ? (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(structuredData),
      }}
    />
  ) : null;
}
