import { useTranslations } from "next-intl";
import Hero from "../components/Hero";
import TourCalendar from "../components/tours/TourCalendar";
import TourService from "../components/tours/TourService";
import Carousel from "../components/Carousel";

export default function Page() {
  const t = useTranslations("tours");

  const images = [
    {
      src: "/images/skye.jpg",
      alt: "Skye Ground Handling",
      height: 1080,
      width: 1204,
    },
    {
      src: "/images/two-niviuk.jpeg",
      alt: "Two Niviuk gliders over Agafay, in Aguergour",
      height: 1500,
      width: 1497,
    },
    {
      src: "/images/plage-626x835.jpeg",
      alt: "Plage Ground Handling",
      height: 835,
      width: 626,
    },
    {
      src: "/images/niviuk-aguergour-square.jpeg",
      alt: "Niviuk Aguergour",
      height: 1500,
      width: 1497,
    },
  ];

  return (
    <main>
      <Hero
        title={t("title")}
        subtitle={t("subtitle")}
        img="/images/camel-1865x1415.jpg"
      />
      <TourService />
      <section
        id="carousel"
        className="w-full bg-base-200 h-fit flex justify-center"
      >
        <Carousel images={images} />
      </section>
      <TourCalendar />
    </main>
  );
}
