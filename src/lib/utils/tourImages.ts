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
          {
            src: "/images/aguergour2-1400x933.webp",
            width: 1400,
            height: 933,
            alt: "Paraglider flying over Aguergour, view over the northern ridge, Morocco",
          },
          {
            src: "/images/aguergour3-1400x933.webp",
            width: 1400,
            height: 933,
            alt: "Paraglider flying over Aguergour, view over the Plateau du Kik, Morocco",
          },
          {
            src: "/images/aitourir_hero-1598x910.webp",
            width: 1598,
            height: 910,
            alt: "Ait Ourir flying site with a paraglider"
          },
          {
            src: "/images/aitourir2-1400x933.webp",
            width: 1400,
            height: 933,
            alt: "Take off at Ait Ourir flying site"
          },
          {
            src: "/images/aitourir3-1400x874.webp",
            width: 1400,
            height: 874,
            alt: "Aerial view of Ait Ourir ridge"
          },
          {
            src: "/images/ouizen-2310x1440.webp",
            width: 2310,
            height: 1440,
            alt: "View of Ouizen village with a sea of cloud, Aguergour, Morocco"
          },
          {
            src: "/images/tizi-1984x1323.webp",
            width: 1984,
            height: 1323,
            alt: "View of Tizi n'Test pass and take off, Morocco"
          }
        ],
      };
    case "coastal":
      return {
        heroImage: "/images/plage-626x835.webp",
        images: [
          {
            src: "https://www.abertih.com/img/portfolio/pf-03.jpg",
            width: 800,
            height: 533,
            alt: "Hotel Abertih: Bedroom"
        },
          {
            src: "/images/aglou2-1280x960.webp",
            width: 1280,
            height: 960,
            alt: "Paraglider flying over Aglou Beach, Morocco",
          },
          {
            src: "/images/niddaigle3-1400x933.webp",
            width: 1400,
            height: 933,
            alt: "Paraglider flying over Nid d'Aigle, Morocco",
          },
          {
            src: "/images/legzira3-1085x1447.webp",
            width: 1085,
            height: 1447,
            alt: "Paraglider flying over Legzira arch",
          },
                    {
            src: "https://www.abertih.com/img/portfolio/pf-06.jpg",
            width: 800,
            height: 533,
            alt: "Hotel Abertih: Bedroom"
        },
          {
            src: "/images/niddaigle2-1500x900.webp",
            width: 1500,
            height: 900,
            alt: "Paraglider flying over Nid d'Aigle, Morocco",
          },
          {
            src: "/images/legzira2-800x600.webp",
            width: 800,
            height: 600,
            alt: "A picture of Legzira",
          },
          {
            src: "https://www.abertih.com/img/portfolio/resto03.jpg",
            width: 800,
            height: 533,
            alt: "Hotel Abertih: Restaurant"
          },
          {
            src: "/images/aglou-800x600.webp",
            width: 800,
            height: 600,
            alt: "Paragliders flying over the cave hotel of Aglou",
          },
          {
            src: "/images/legzira-961x1019.webp",
            alt: "Paraglider flying with the arch of Legzira in the background",
            width: 961,
            height: 1019,
          },
          {
            src: "/images/niddaigle-1280x853.webp",
            width: 1280,
            height: 853,
            alt: "Paraglider flying over Nid d'Aigle, Morocco",
          }
        ],
      };
    case "wellbeing":
      return {
        heroImage: "/images/yoga-1536x1024.webp",
        images: [
          {
            src: "https://magicalmirleft.com/wp-content/uploads/2024/10/IMG_7793.jpg",
            width: 800,
            height: 533,
            alt: "Magical Mirleft: Infinity Villa- view from living room",
          },
          {
            src: "/images/aglou2-1280x960.webp",
            width: 1280,
            height: 960,
            alt: "Paraglider flying over Aglou Beach, Morocco",
          },
          {
            src: "https://magicalmirleft.com/wp-content/uploads/2024/11/WhatsApp-Image-2024-11-07-at-18.47.39_4b4dacfb.jpg",
            width: 800,
            height: 533,
            alt: "Magical Mirleft: Infinity Villa- view of the terrace",
          },
          {
            src: "/images/niddaigle3-1400x933.webp",
            width: 1400,
            height: 933,
            alt: "Paraglider flying over Nid d'Aigle, Morocco",
          },
          {
            src: "https://magicalmirleft.com/wp-content/uploads/2024/10/IMG_7760.jpg",
            width: 800,
            height: 533,
            alt: "Magical Mirleft: Infinity Villa- view from inside",
          },
          {
            src: "https://magicalmirleft.com/wp-content/uploads/2024/10/IMG_7761.jpg",
            width: 800,
            height: 533,
            alt: "Magical Mirleft: Infinity Villa- view from inside",
          },
          {
            src: "/images/aglou3-1400x900.webp",
            width: 1400,
            height: 900,
            alt: "Paraglider flying over Aglou Beach, Morocco",
          },
          {
            src: "https://magicalmirleft.com/wp-content/uploads/2024/10/IMG_7878.jpg",
            width: 800,
            height: 533,
            alt: "Magical Mirleft: Infinity Villa- bed",
          },
          {
            src: "https://magicalmirleft.com/wp-content/uploads/2024/10/IMG_7763.jpg",
            width: 800,
            height: 533,
            alt: "Magical Mirleft: Infinity Villa- view from inside",
          },
          {
            src: "/images/legzira3-1085x1447.webp",
            width: 1085,
            height: 1447,
            alt: "Paraglider flying over Legzira arch",
          },
          {
            src: "https://magicalmirleft.com/wp-content/uploads/2024/10/IMG_7874.jpg",
            width: 800,
            height: 533,
            alt: "Magical Mirleft: Infinity Villa- bed",
          },
          {
            src: "/images/legzira-800x600.webp",
            width: 800,
            height: 600,
            alt: "A picture of Legzira",
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
