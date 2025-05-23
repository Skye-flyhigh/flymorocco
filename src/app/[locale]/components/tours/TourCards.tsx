"use client";

import { extractImageDimensions } from "@/scripts/imageProcessing";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";

type TourCard = {
  type: string;
  img: string;
  alt: string;
};

export default function TourCards() {
  const t = useTranslations("tours");
  const tours: TourCard[] = [
    {
      type: "mountain",
      img: "/images/kik-800x533.jpg",
      alt: "Gaggle flying on the back of Aguergour",
    },
    {
      type: "coastal",
      img: "/images/legzira3-1085x1447.jpeg",
      alt: "Flying over the arch of Legzira",
    },
    {
      type: "wellbeing",
      img: "/images/plage-626x835.jpeg",
      alt: "Ground handling at the Plage Blanche",
    },
  ];

  return (
    <section id="tour-cards" className="py-20 px-10">
      <h1 className="section-title ml-5">{t("tourCards.title")}</h1>
      <h2 className="section-subtitle ml-5">{t("tourCards.description")}</h2>
      <div id="card-container" className="flex flex-wrap gap-4 justify-center">
        {tours.map((tour) => {
          const { height, width } = extractImageDimensions(tour.img);
          if (!height || !width)
            console.warn(
              "Tour Cards: unable to extract the width/height of image card.",
            );

          return (
            <article
              key={tour.type}
              className="card bg-base-100 w-96 shadow-sm hover:bg-base-200 hover:shadow-xl transition-all"
            >
              <figure>
                <Image
                  src={tour.img}
                  alt={tour.alt}
                  height={height ?? 800}
                  width={width ?? 600}
                  loading="lazy"
                  className="aspect-square object-cover"
                />
              </figure>
              <div className="card-body">
                <h2 className="card-title">
                  {t(`toursDetails.${tour.type}.focus`)}
                </h2>
                <p>{t(`toursDetails.${tour.type}.note`)}</p>
                <div className="card-actions justify-end">
                  <Link href={`/tours/${tour.type}`}>
                    <button type="button" className="btn btn-primary">
                      {t("view")}
                    </button>
                  </Link>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
