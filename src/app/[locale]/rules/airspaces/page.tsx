import { buildPageMetadata } from "@/lib/metadata/buildPageMetadata";
import SiteMapSection from "../../components/SiteMapSection";
import DownloadAirspaces from "../../components/rules/DowloadAirspaces";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return await buildPageMetadata({ locale, page: "airspaces" });
}

export default function Page() {
  return (
    <main id="main">
      <SiteMapSection />
      <DownloadAirspaces />
    </main>
  );
}
