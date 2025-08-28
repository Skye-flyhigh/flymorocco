import { buildPageMetadata } from "@/lib/metadata/buildPageMetadata";
import AnnexeClientWrapper from "../../components/rules/AnnexeClientWrap";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  const metadata = await buildPageMetadata({ locale, page: "caaForms" });
  const keywords =
    locale === "fr"
      ? [
          "autorisation de vol Maroc",
          "demande d'autorisation Maroc",
          "réglementation du vol",
          "annexe 2",
          "annexe 4",
          "DGAC",
        ]
      : [
          "flight authorization Morocco",
          "authorization request Morocco",
          "flight regulations",
          "annex 2",
          "annex 4",
          "Morocco civial aviation authority",
        ];

  metadata.keywords = [...(metadata.keywords || []), ...keywords];

  return metadata;
}

export default function Page() {
  return <AnnexeClientWrapper />;
}
