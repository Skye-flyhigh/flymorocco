import { buildPageMetadata } from "@/lib/metadata/buildPageMetadata";
import { Metadata } from "next";
import SiteMapSection from "../../components/SiteMapSection";
import DownloadAirspaces from "../../components/rules/DowloadAirspaces";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return buildPageMetadata({ locale, page: "airspaces" });
}

export default function Page() {
  return (
    <main id="main">
      <SiteMapSection />
      <DownloadAirspaces />
    </main>
  );
}
