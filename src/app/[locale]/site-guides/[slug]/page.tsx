import { getSiteMeta } from "@/lib/data-retrievers/getSiteMeta";
import SiteMapContainer from "../../components/siteGuides/SiteMapContainer";
import Carousel from "../../components/Carousel";
import MissingMountain from "../../components/siteGuides/MissingMountain";
import Hero from "../../components/Hero";
import Link from "next/link";
import { getTranslations } from "next-intl/server";

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}) {
  //TODO: add the legal info
  const { slug } = await params;
  const meta = getSiteMeta(slug);
  const t = await getTranslations("siteGuides");

  if (!meta || !slug) return <MissingMountain />;

  const legislation = t(`${slug}.legislation`);
  const legislationExists =
    legislation !== `siteGuides.${slug}.legislation` && legislation !== "";

  console.log("Legislation blurb check:", legislationExists);

  return (
    <>
      <main className="m-auto pt-10 flex flex-col">
        <Hero
          title={t(`${slug}.name`)}
          subtitle={t(`${slug}.description`)}
          img={meta.image}
        />
        <div className="text-sm text-gray-500 max-w-3/4 min-w-11/12 mx-auto p-5">
          Altitude: {meta.launch_altitude}m | Coordinates: {meta.lat},{" "}
          {meta.lon}
        </div>

        <div id="site-map" className="py-5 flex justify-center items-center">
          <SiteMapContainer zoom={13} lat={meta.lat} lon={meta.lon} />
        </div>
        <section id="description" className="max-w-3/4 min-w-11/12 mx-auto p-5">
          <p className="prose mb-6">{t(`${slug}.longDescription`)}</p>
          <div
            tabIndex={0}
            className="collapse collapse-arrow bg-base-100 border-base-300 border mb-2"
          >
            <div className="collapse-title font-semibold">{t("takeoff")}</div>
            <div className="collapse-content text-sm">
              {t(`${slug}.takeoff`)}
            </div>
          </div>
          <div
            tabIndex={0}
            className="collapse collapse-arrow bg-base-100 border-base-300 border mb-2"
          >
            <div className="collapse-title font-semibold">{t("landing")}</div>
            <div className="collapse-content text-sm">
              {t(`${slug}.landing`)}
            </div>
          </div>
          <div
            tabIndex={0}
            className="collapse collapse-arrow bg-base-100 border-base-300 border mb-2"
          >
            <div className="collapse-title font-semibold">{t("flying")}</div>
            <div className="collapse-content text-sm">
              {t(`${slug}.flying`)}
            </div>
          </div>
          <div
            tabIndex={0}
            className="collapse collapse-arrow bg-base-100 border-base-300 border mb-2"
          >
            <div className="collapse-title font-semibold">{t("hazard")}</div>
            <div className="collapse-content text-sm">
              {t(`${slug}.hazard`)}
            </div>
          </div>
        </section>

        {legislationExists && (
          <section
            id="legal-info"
            className="max-w-3/4 min-w-11/12 mx-auto p-5 bg-primary text-primary-content rounded-2xl"
          >
            <p>{t(`${slug}.legislation`)}</p>
          </section>
        )}

        <Link
          href="/site-guides"
          className="btn btn-secondary my-10 self-center"
        >
          {t("return")}
        </Link>
      </main>
      <div
        id="carousel-container"
        className="flex justify-center bg-base-200 w-screen"
      >
        <Carousel images={meta.images} />
      </div>
    </>
  );
}
