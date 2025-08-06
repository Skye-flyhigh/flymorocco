import Carousel from "./components/Carousel";
import Services from "./components/home/Services";
import FeaturedSites from "./components/FeaturedSites";
import TourCalendar from "./components/tours/TourCalendar";
import Testimonials from "./components/home/Testimonials";
import Explore from "./components/home/Explore";
import HomeHero from "./components/home/HomeHero";
import { ImageType } from "@/lib/types/image";
import FAQStructuredData from "./components/FAQStructuredData";

const heroImages: ImageType[] = [
  {
    src: "/images/fred-centered.webp",
    alt: "Flying over Fred’s favorite ridge",
  },
  {
    src: "/images/niviuk-agdou-2000x1333.webp",
    alt: "Paraglider above Agdou valley",
  },
  { src: "/images/plage-1817x1362.webp", alt: "Soaring above Plage Blanche" },
  { src: "/images/sonja.webp", alt: "Sonja mid-flight over Aguergour" },
  {
    src: "/images/niviuk-agafay.webp",
    alt: "Sunset glide over Agafay desert",
  },
];

export const metadata = {
  other: {
    "preload-image": "true", // Flag for documentation
  },
};

export default function HomePage() {
  const images = [
    {
      src: "/images/sonja-800x533.webp",
      width: 800,
      height: 533,
      isSelected: true,
      alt: "Sonja flying over Aguergour",
    },
    {
      src: "/images/plage-626x835.webp",
      width: 626,
      height: 835,
      isSelected: true,
      alt: "Ground Handling at Plage Blanche",
    },
    {
      src: "/images/legzira2-800x600.webp",
      width: 800,
      height: 600,
      isSelected: true,
      alt: "Top takeoff view of Legzira",
    },
    {
      src: "/images/aglou-800x600.webp",
      width: 800,
      height: 600,
      isSelected: true,
      alt: "Busy Aglou dunes",
    },
    {
      src: "/images/fred2-800x533.webp",
      width: 800,
      height: 533,
      isSelected: true,
      alt: "Fred flying with Atlas mountains in the background",
    },
    {
      src: "/images/guigou-800x533.webp",
      width: 800,
      height: 533,
      isSelected: true,
      alt: "Zouhair flying Guigou, Mid Atlas",
    },
    {
      src: "/images/kik-800x533.webp",
      width: 800,
      height: 533,
      isSelected: true,
      alt: "Gaggle picture over Plateau du Kik, behind Aguergour",
    },
    {
      src: "/images/plage3-800x533.webp",
      width: 800,
      height: 533,
      isSelected: true,
      alt: "Flying over Plage Blanche",
    },
  ];

  return (
    <main id="main">
      <FAQStructuredData />
      <HomeHero images={heroImages} />
      <Carousel images={images} />
      <Explore />
      <Services />
      <FeaturedSites />
      <TourCalendar />
      <Testimonials />
    </main>
  );
}
