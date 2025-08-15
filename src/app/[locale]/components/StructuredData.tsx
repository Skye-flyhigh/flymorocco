import { useTranslations } from 'next-intl';

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
  type?: 'business' | 'tour' | 'site';
  data?: TourData | SiteData;
}

export default function StructuredData({ type = 'business', data }: StructuredDataProps) {
  const t = useTranslations('seo');

  const businessData = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": "https://flymorocco.info",
    "name": t('business.name'),
    "description": t('business.description'),
    "url": "https://flymorocco.info",
    "telephone": t('business.phone'),
    "email": t('business.email'),
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "Morocco",
      "addressRegion": "Souss-Massa",
      "addressLocality": "Agadir"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 30.4278,
      "longitude": -9.5981
    },
    "priceRange": "€€",
    "serviceArea": {
      "@type": "GeoCircle",
      "geoMidpoint": {
        "@type": "GeoCoordinates",
        "latitude": 30.4278,
        "longitude": -9.5981
      },
      "geoRadius": "300000"
    },
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Paragliding Services",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": t('services.coastal.name'),
            "description": t('services.coastal.description')
          }
        },
        {
          "@type": "Offer", 
          "itemOffered": {
            "@type": "Service",
            "name": t('services.mountain.name'),
            "description": t('services.mountain.description')
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service", 
            "name": t('services.wellness.name'),
            "description": t('services.wellness.description')
          }
        }
      ]
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "5.0",
      "reviewCount": "4",
      "bestRating": "5"
    },
    "sameAs": [
      "https://www.facebook.com/flymorocco",
      "https://www.instagram.com/flymorocco"
    ]
  };

  const tourData = (data && type === 'tour') ? {
    "@context": "https://schema.org",
    "@type": "TouristTrip",
    "name": data.name,
    "description": data.description,
    "provider": {
      "@type": "LocalBusiness",
      "name": "FlyMorocco",
      "url": "https://flymorocco.info"
    },
    "touristType": "Adventure Tourism",
    "duration": (data as TourData).duration || "P7D",
    "offers": {
      "@type": "Offer",
      "price": (data as TourData).price,
      "priceCurrency": "EUR",
      "availability": "https://schema.org/InStock"
    }
  } : null;

  const siteData = (data && type === 'site') ? {
    "@context": "https://schema.org",
    "@type": "TouristAttraction",
    "name": data.name,
    "description": data.description,
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": (data as SiteData).lat,
      "longitude": (data as SiteData).lon
    },
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "Morocco"
    }
  } : null;

  const getStructuredData = () => {
    switch (type) {
      case 'tour':
        return tourData;
      case 'site':
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
        __html: JSON.stringify(structuredData)
      }}
    />
  ) : null;
}