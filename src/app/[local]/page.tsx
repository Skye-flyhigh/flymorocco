"use client";
import { useTranslations } from "next-intl";
import Carousel from "./components/Carousel";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Parallax } from "react-scroll-parallax";
import Services from "./components/home/Services";
import FeaturedSites from "./components/home/FeaturedSites";
import TourCalendar from "./components/home/TourCalendar";
import Testimonials from "./components/home/Testimonials";
import Explore from "./components/home/Explore";

export default function HomePage() {
  const t = useTranslations("HomePage");
  const images = [
    {
      src: "/images/sonja-800x533.jpg",
      width: 800,
      height: 533,
      isSelected: true,
      alt: "Sonja flying over Aguergour",
    },
    {
      src: "/images/plage-626x835.jpeg",
      width: 626,
      height: 835,
      isSelected: true,
      alt: "Ground Handling at Plage Blanche",
    },
    {
      src: "/images/legzira2-800x600.jpg",
      width: 800,
      height: 600,
      isSelected: true,
      alt: "Top takeoff view of Legzira",
    },
    {
      src: "/images/aglou-800x600.jpeg",
      width: 800,
      height: 600,
      isSelected: true,
      alt: "Busy Aglou dunes",
    },
    {
      src: "/images/fred2-800x533.jpg",
      width: 800,
      height: 533,
      isSelected: true,
      alt: "Fred flying with Atlas mountains in the background",
    },
    {
      src: "/images/guigou-800x533.jpg",
      width: 800,
      height: 533,
      isSelected: true,
      alt: "Zouhair flying Guigou, Mid Atlas",
    },
    {
      src: "/images/kik-800x533.jpg",
      width: 800,
      height: 533,
      isSelected: true,
      alt: "Gaggle picture over Plateau du Kik, behind Aguergour",
    },
    {
      src: "/images/plage3-800x533.jpeg",
      width: 800,
      height: 533,
      isSelected: true,
      alt: "Flying over Plage Blanche",
    },
  ];

  const heroImages = [
    {
      src: "/images/fred-centered.jpeg",
      alt: "Flying over Fred’s favorite ridge",
    },
    {
      src: "/images/niviuk-agdou-2000x1333.jpeg",
      alt: "Paraglider above Agdou valley",
    },
    { src: "/images/plage-1817x1362.jpg", alt: "Soaring above Plage Blanche" },
    { src: "/images/sonja.jpg", alt: "Sonja mid-flight over Aguergour" },
    {
      src: "/images/niviuk-agafay.jpg",
      alt: "Sunset glide over Agafay desert",
    },
  ];
  const [activeHeroIndex, setActiveHeroIndex] = useState(() =>
    Math.floor(Math.random() * heroImages.length),
  );
  const [fadeIn, setFadeIn] = useState(false);

  useEffect(() => {
    setFadeIn(true);
    const interval = setInterval(() => {
      setFadeIn(false);
      setTimeout(() => {
        setActiveHeroIndex((prev) => (prev + 1) % heroImages.length);
        setFadeIn(true);
      }, 500); // delay to allow fade-out before switching image
    }, 7500); // every 10 seconds
    return () => clearInterval(interval);
  }, [heroImages.length]);

  const currentHeroImage = heroImages[activeHeroIndex];

  return (
    <>
      <header
        className={`hero min-h-screen transition-opacity duration-1000 ease-in-out w-screen ${fadeIn ? "opacity-100" : "opacity-0"}`}
        style={{
          backgroundImage: `url(${currentHeroImage.src})`,
          backgroundPosition: "center",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
        }}
        aria-label={currentHeroImage.alt}
      >
        <Parallax speed={-4} className="w-fit">
          <div className="hero-content text-neutral-content text-center w-full">
            <div className="w-full">
              <h1 className="mb-10 text-5xl font-bold">
                Flymorocco - {t("title")}
              </h1>
              <h2 className="mb-7 text-2xl">{t("subtitle")}</h2>
              <Parallax speed={-4}>
                <a href="#explore" className="btn mt-3">
                  {t("exploreBtn")}
                </a>
              </Parallax>
            </div>
          </div>
        </Parallax>
      </header>

      <Carousel images={images} />
      <Explore />
      <Services />
      <FeaturedSites />
      <TourCalendar />
      <Testimonials />
    </>
  );
}
