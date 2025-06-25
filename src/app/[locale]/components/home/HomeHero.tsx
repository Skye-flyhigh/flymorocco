"use client";

import { ImageType, ImageTypeSchema } from "@/lib/types/image";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Parallax } from "react-scroll-parallax";

export default function HomeHero({ images }: { images: ImageType[] }) {
  const t = useTranslations("HomePage");
  const [activeHeroIndex, setActiveHeroIndex] = useState<number | null>(null);
  const [fadeIn, setFadeIn] = useState(false);
  const [preloadedImages, setPreloadedImages] = useState<Set<number>>(
    new Set(),
  );

  const validImages = useMemo(() => {
    return images.filter((image) => ImageTypeSchema.safeParse(image).success);
  }, [images]);

  // Preload images strategically
  const preloadImage = useCallback(
    (index: number) => {
      if (preloadedImages.has(index)) return;

      const img = new Image();
      img.src = validImages[index].src;
      img.onload = () => {
        setPreloadedImages((prev) => new Set(prev).add(index));
      };
    },
    [preloadedImages, validImages],
  );

  useEffect(() => {
    const randomIndex = Math.floor(
      Math.floor(Math.random() * validImages.length),
    );
    setActiveHeroIndex(randomIndex);
    setFadeIn(true);

    // Preload first image immediately
    preloadImage(randomIndex);

    // Preload next image after a delay
    setTimeout(() => {
      const nextIndex = (randomIndex + 1) % validImages.length;
      preloadImage(nextIndex);
    }, 1000);

    const interval = setInterval(() => {
      setFadeIn(false);
      setTimeout(() => {
        setActiveHeroIndex((prev) => {
          const nextIndex = prev !== null ? (prev + 1) % validImages.length : 0;

          // Preload the image after next
          const preloadIndex = (nextIndex + 1) % validImages.length;
          preloadImage(preloadIndex);

          return nextIndex;
        });
        setFadeIn(true);
      }, 500); // delay to allow fade-out before switching image
    }, 7500); // every 10 seconds
    return () => clearInterval(interval);
  }, [validImages.length, preloadImage]);

  const currentHeroImage =
    activeHeroIndex !== null ? validImages[activeHeroIndex] : validImages[0];

  return (
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
  );
}
