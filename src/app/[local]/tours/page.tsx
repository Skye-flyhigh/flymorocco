import { useTranslations } from "next-intl";
import Hero from "../components/Hero";
import TourCalendar from "../components/tours/TourCalendar";
import TourService from "../components/tours/TourService";
import Carousel from "../components/Carousel";
import TourCards from "../components/tours/TourCards";
import Link from "next/link";

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
<section
      id="explore"
      className="grid grid-rows-[150px_1fr_150px] h-screen bg-base-300"
      style={{
        maskImage: 'url("/images/stars.svg")',
        maskRepeat: "repeat",
        maskPosition: "center",
      }}
    >
      <article className="row-start-2 row-end-3 backdrop-blur-xl bg-base-100/80 flex items-center justify-center">
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
            <Link href="#tour-service" id="service-link" className="btn btn-primary">
            {t("explore.serviceLink")}
            </Link>
            <Link href="#tour-cards" id="tour-link" className="btn btn-secondary">
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
    </main>
  );
}
