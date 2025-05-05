import { useTranslations } from "next-intl";
import Image from "next/image";
import { Metadata } from "next";
import { getSiteMeta } from "@/lib/site";
import SiteMapContainer from "../../components/siteGuides/SiteMapContainer";
import Carousel from "../../components/Carousel";
import { extractImageDimensions } from "@/scripts/imageProcessing";
import MissingMountain from "../../components/siteGuides/MissingMountain";

export async function generateMetadata({
  params,
}: {
  params: { slug: string; local: string };
}): Promise<Metadata> {
  const { slug, local } = await params;

  const meta = getSiteMeta(slug);
  if (!meta) return { title: "Not Found" };

  const messages = (await import(`@messages/${local}.json`)).default;
  const t = messages.siteGuides?.[slug];

  return {
    title: `${t?.name} – FlyMorocco`,
    description: t?.description,
  };
}

export default function SiteGuidePage({
  params,
}: {
  params: { slug: string; local: string };
}) {
  const { slug } = params;
  const meta = getSiteMeta(slug);
  const t = useTranslations("siteGuides");
  if (!meta || !slug) return <MissingMountain />;

  const { width, height } = extractImageDimensions(meta.image);

  return (
    <>
      <main className="m-auto pt-10 max-w-11/12">
        <h1 className="text-3xl font-bold max-w-3/4 min-w-11/12 mx-auto p-5">
          {t(`${slug}.name`)}
        </h1>
        <p className="text-gray-500 mb-4 font-semibold max-w-3/4 min-w-11/12 mx-auto p-5">
          {t(`${slug}.region`)}
        </p>

        <Image
          src={meta.image}
          alt={t(`${slug}.name`)}
          width={width}
          height={height}
          className="rounded-lg shadow-md object-cover mx-auto mb-6"
        />

        <p className="mb-8 max-w-3/4 min-w-11/12 mx-auto p-5">
          {t(`${slug}.description`)}
        </p>

        <div className="text-sm text-gray-500 max-w-3/4 min-w-11/12 mx-auto p-5">
          Altitude: {meta.launch_altitude}m | Coordinates: {meta.lat},{" "}
          {meta.lon}
        </div>

        <div id="site-map" className="py-5 flex justify-center items-center">
          <SiteMapContainer zoom={13} lat={meta.lat} lon={meta.lon} />
        </div>
        <div id="description" className="max-w-3/4 min-w-11/12 mx-auto p-5">
          <p className="prose mb-6">{t(`${slug}.longDescription`)}</p>
          <div
            tabIndex={0}
            className="collapse collapse-arrow bg-base-100 border-base-300 border"
          >
            <div className="collapse-title font-semibold">{t("takeoff")}</div>
            <div className="collapse-content text-sm">
              {t(`${slug}.takeoff`)}
            </div>
          </div>
          <div
            tabIndex={0}
            className="collapse collapse-arrow bg-base-100 border-base-300 border"
          >
            <div className="collapse-title font-semibold">{t("landing")}</div>
            <div className="collapse-content text-sm">
              {t(`${slug}.landing`)}
            </div>
          </div>
          <div
            tabIndex={0}
            className="collapse collapse-arrow bg-base-100 border-base-300 border"
          >
            <div className="collapse-title font-semibold">{t("flying")}</div>
            <div className="collapse-content text-sm">
              {t(`${slug}.flying`)}
            </div>
          </div>
          <div
            tabIndex={0}
            className="collapse collapse-arrow bg-base-100 border-base-300 border"
          >
            <div className="collapse-title font-semibold">{t("hazard")}</div>
            <div className="collapse-content text-sm">
              {t(`${slug}.hazard`)}
            </div>
          </div>
        </div>
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
