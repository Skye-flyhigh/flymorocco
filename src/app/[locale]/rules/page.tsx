import { buildPageMetadata } from "@/lib/metadata/buildPageMetadata";
import { Metadata } from "next";
import { useTranslations } from "next-intl";
import Hero from "../components/Hero";
import RulesNav from "../components/rules/RulesNav";
import RulesQnA from "../components/rules/RulesQnA";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return buildPageMetadata({ locale, page: "rules" });
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
