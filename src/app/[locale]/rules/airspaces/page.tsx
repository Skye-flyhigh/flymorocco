import { buildPageMetadata } from "@/lib/metadata/buildPageMetadata";
import SiteMapSection from "../../components/SiteMapSection";
import DownloadAirspaces from "../../components/rules/DowloadAirspaces";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  const metadata = await buildPageMetadata({ locale, page: "airspaces" });
  const keywords =
    locale === "fr"
      ? [
          "airspace aérien Maroc",
          "règles de l'air Maroc",
          "sécurité aérienne Maroc",
          "aviation Maroc",
          "DGAC Maroc",
          "réglementation aviation Maroc",
        ]
      : [
          "airspace Morocco",
          "air rules Morocco",
          "aviation safety Morocco",
          "DGAC Morocco",
          "aviation regulations Morocco",
          "civil aviation Morocco",
          "Moroccan CAA",
        ];

  metadata.keywords = [...(metadata.keywords || []), ...keywords];
  return metadata;
}

export default function Page() {
  return (
    <main id="main">
      <SiteMapSection />
      <DownloadAirspaces />
    </main>
  );
}
