"use client";
import { useTranslations } from "next-intl";
import TrustpilotWidget from "./TrustpilotWidget";
import GoogleBusinessWidget from "./GoogleBusinessWidget";

export default function Testimonials() {
  const t = useTranslations("testimonials");

  return (
    <section id="testimonials" className="py-20 text-center">
      <h1 className="section-title">{t("title")}</h1>
      <TrustpilotWidget />
      <GoogleBusinessWidget />
    </section>
  );
}
