"use client";
import { useTranslations } from "next-intl";
import Hero from "../components/Hero";
import ContactForm from "../components/contact/ContactForm";

export default function Page() {
  const t = useTranslations("contact");
  return (
    <main>
      <Hero
        title={t("title")}
        subtitle={t("subtitle")}
        img="/images/camel-1865x1415.jpg"
      />
      <ContactForm />
    </main>
  );
}
