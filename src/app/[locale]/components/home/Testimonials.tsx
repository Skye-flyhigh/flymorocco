"use client";
import { useTranslations } from "next-intl";
import TrustpilotWidget from "./TrustpilotWidget";
import GoogleBusinessWidget from "./GoogleBusinessWidget";

export default function Testimonials() {
  const t = useTranslations("testimonials");

  return (
    <section id="testimonials" className="py-20 text-center">
      <h2 className="section-title">{t("title")}</h2>
      <TrustpilotWidget />
      <GoogleBusinessWidget />
    </section>
  );
}
