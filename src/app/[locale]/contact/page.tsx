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

  const metadata = await buildPageMetadata({ locale, page: "contact" });
  const keywords =
    locale === "fr"
      ? [
          "contact",
          "formulaire de contact",
          "demande d'information",
          "service client",
        ]
      : ["contact", "contact form", "inquiry", "customer service"];

  metadata.keywords = [...(metadata.keywords || []), ...keywords];

  return metadata;
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
