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
  return await buildPageMetadata({ locale, page: "rules" });
}

export default function Page() {
  const t = useTranslations("rules");
  return (
    <main id="main">
      <Hero
        title={t("title")}
        subtitle={t("subtitle")}
        img="/images/kik-800x533.jpg"
      />
      <RulesNav />
      <RulesQnA />
    </main>
  );
}
