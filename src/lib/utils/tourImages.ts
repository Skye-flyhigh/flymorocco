import { TourSlug } from "../types/tour";

export interface TourImageData {
  heroImage: string;
  images: Array<{
    src: string;
    width: number;
    height: number;
    alt: string;
  }>;
}

export function getTourImages(tourType: TourSlug): TourImageData {
  switch (tourType) {
    case "mountain":
      return {
        heroImage: "/images/guigou-2000x1333.webp",
        images: [
          {
            src: "/images/sonja-800x533.webp",
            width: 800,
            height: 533,
            alt: "Sonja flying over Aguergour",
          },
          {
            src: "/images/fred2-800x533.webp",
            width: 800,
            height: 533,
            alt: "Fred flying with Atlas mountains in the background",
          },
        ],
      };
    case "coastal":
      return {
        heroImage: "/images/plage-626x835.webp",
        images: [
          {
            src: "/images/aglou2-800x534.webp",
            width: 800,
            height: 532,
            alt: "Flying in Aglou",
          },
          {
            src: "/images/legzira2-800x600.webp",
            width: 800,
            height: 600,
            alt: "A picture of Legzira",
          },
        ],
      };
    case "wellbeing":
      return {
        heroImage: "/images/yoga-1536x1024.webp",
        images: [
          {
            src: "/images/legzira-800x600.webp",
            width: 800,
            height: 600,
            alt: "A picture of Legzira",
          },
          {
            src: "/images/skye.webp",
            width: 800,
            height: 800,
            alt: "Ground handling",
          },
        ],
      };
    default:
      return {
        heroImage: "/images/camel-1865x1415.webp",
        images: [
          {
            src: "/images/oukaimeden.webp",
            width: 800,
            height: 600,
            alt: "Flying over Moroccan mountains",
          },
          {
            src: "/images/niviuk-agdou-800x600.webp",
            width: 800,
            height: 600,
            alt: "Niviuk X-One flying over Moroccan village",
          },
        ],
      };
  }
}

export function getTourHeroImage(tourType: TourSlug): string {
  return getTourImages(tourType).heroImage;
}

export function getTourImageUrl(tourType: TourSlug, baseUrl?: string): string {
  const heroImage = getTourHeroImage(tourType);
  const base =
    baseUrl || process.env.NEXT_PUBLIC_BASE_URL || "https://flymorocco.info";

  // For Stripe: Use production URL if localhost (Stripe can't access localhost)
  if (base.includes("localhost")) {
    return `https://flymorocco.info${heroImage}`;
  }

  return `${base}${heroImage}`;
}
