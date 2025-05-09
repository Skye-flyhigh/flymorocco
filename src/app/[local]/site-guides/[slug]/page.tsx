import { useTranslations } from "next-intl";
import { Metadata } from "next";
import { getSiteMeta } from "@/lib/site";
import SiteMapContainer from "../../components/siteGuides/SiteMapContainer";
import Carousel from "../../components/Carousel";
import MissingMountain from "../../components/siteGuides/MissingMountain";
import fs from "fs";
import path from "path";
import Hero from "../../components/Hero";

export async function generateMetadata({
  params,
}: {
  params: { slug: string; local: string };
}): Promise<Metadata> {
  const { slug, local } = params;
  const meta = getSiteMeta(slug);
  if (!meta) return { title: "Not Found" };

  const filePath = path.join(process.cwd(), "messages", `${local}.json`);
  const raw = fs.readFileSync(filePath, "utf-8");
  const messages = JSON.parse(raw);
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

  return (
    <>
      <main className="m-auto pt-10">
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
        <div id="description" className="max-w-3/4 min-w-11/12 mx-auto p-5">
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
