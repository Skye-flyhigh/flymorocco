import { useTranslations } from "next-intl";
import Hero from "../components/Hero";
import RulesNav from "../components/rules/RulesNav";
import RulesQnA from "../components/rules/RulesQnA";
import { buildPageMetadata } from "@/lib/metadata/buildPageMetadata";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  const metadata = await buildPageMetadata({ locale, page: "rules" });
  const keywords =
    locale === "fr"
      ? [
          "règles",
          "espaces aériens",
          "DGAC annexe 2",
          "DGAC annexe 4",
          "DGAC Maroc",
        ]
      : [
          "rules",
          "airspace",
          "Moroccan CAA appendix 2",
          "Moroccan CAA appendix 4",
          "moroccan civil aviation authority",
        ];

  metadata.keywords = [...(metadata.keywords || []), ...keywords];

  return metadata;
}

export default function Page() {
  const t = useTranslations("rules");
  return (
    <main id="main">
      <Hero
        title={t("title")}
        subtitle={t("subtitle")}
        img="/images/kik-800x533.webp"
      />
      <RulesNav />
      <RulesQnA />
    </main>
  );
}
