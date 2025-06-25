import { useTranslations } from "next-intl";
import Hero from "../components/Hero";
import ContactForm from "../components/contact/ContactForm";
import { buildPageMetadata } from "@/lib/metadata/buildPageMetadata";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return await buildPageMetadata({ locale, page: "contact" });
}

export default function Page() {
  const t = useTranslations("contact");
  return (
    <main id="main">
      <Hero
        title={t("title")}
        subtitle={t("subtitle")}
        img="/images/camel-1865x1415.webp"
      />
      <ContactForm />
    </main>
  );
}
