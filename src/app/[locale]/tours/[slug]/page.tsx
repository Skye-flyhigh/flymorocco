import Hero from "../../components/Hero";
import { getTranslations } from "next-intl/server";
import Activities from "../../components/tours/Activities";
import MustHave from "../../components/tours/MustHave";
import TourService from "../../components/tours/TourService";
import Image from "next/image";
import SelectedCalendar from "../../components/tours/SelectedCalendar";
import { isValidTourSlug, TOUR_SLUGS, TourSlug } from "@/lib/types/tour";
import MissingTour from "../../components/tours/MissingTour";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { getTourImages } from "@/lib/utils/tourImages";

export async function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    TOUR_SLUGS.map((slug) => ({ locale, slug })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}) {
  const { locale, slug } = await params;

  if (!TOUR_SLUGS.includes(slug as TourSlug)) {
    notFound(); // Next.js built-in 404 handling
  }

  const t = await getTranslations({ locale, namespace: `tours.${slug}` });
  return {
    title: t("title"),
    description: t("subtitle"),
    openGraph: {
      title: t("title"),
      description: t("subtitle"),
      url: `https://flymorocco.info/${locale}`,
      siteName: "Flymorocco",
      images: [
        {
          url: `/og-image/${slug}.webp`,
          width: 1200,
          height: 900,
          alt: slug,
        },
      ],
      locale,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: t("title"),
      description: t("subtitle"),
      images: [`/og-image/${slug}.webp`],
    },
    alternates: {
      canonical: `https://flymorocco.com/${locale}`,
      languages: {
        en: "https://flymorocco.com/en",
        fr: "https://flymorocco.com/fr",
      },
    },
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}) {
  const { slug } = await params;

  if (!isValidTourSlug(slug)) {
    return <MissingTour />;
  }

  const t = await getTranslations("tours");

  const tourImageData = getTourImages(slug);
  const { heroImage, images: img } = tourImageData;

  return (
    <main className="m-auto">
      <Hero
        title={t(`${slug}.title`)}
        subtitle={t(`${slug}.subtitle`)}
        img={heroImage}
      />

      <section id="tour-description" className="py-20 px-10 flex flex-col">
        <p className="prose">{t(`${slug}.intro`)}</p>
        <h2 className="text-3xl font-extrabold text-center mt-10 mb-5">
          {slug === "wellbeing" ? "£1,050 / €1,250" : "£799 / €950"}
        </h2>
        <h3 className="text-xl font-semibold text-center">{t("unit")}</h3>
        <TourService />
      </section>

      <section
        id="tour-details"
        className="grid lg:grid-cols-2 grid-rows-2 justify-center items-center"
      >
        <Image
          src={img[0].src}
          alt={img[0].alt}
          height={img[0].height}
          width={img[0].width}
          className="object-cover aspect-square"
        />
        <MustHave slug={slug as TourSlug} />
        <Activities slug={slug as TourSlug} />
        <Image
          src={img[1].src}
          alt={img[1].alt}
          height={img[1].height}
          width={img[1].width}
          className="object-cover aspect-square"
        />
      </section>

      <SelectedCalendar slug={slug as TourSlug} />
    </main>
  );
}
