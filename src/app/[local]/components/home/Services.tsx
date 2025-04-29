"use client";
import { useTranslations } from "next-intl";
import { MapPinned, Compass, FileText } from "lucide-react";
import Link from "next/link";

const services = [
  {
    key: "siteGuides",
    url: "/site-guides",
    icon: MapPinned, // Place SVG or PNG in public/icons/
  },
  {
    key: "tours",
    url: "/tours",
    icon: Compass,
  },
  {
    key: "rules",
    url: "/rules",
    icon: FileText,
  },
];

export default function Services() {
  const t = useTranslations("services");

  return (
    <section id="services" className="py-20 m-5 px-4 min-h-3/4">
      <div className="max-w-6xl mx-auto mb-5 text-center">
        <h2 className="section-title">{t("title")}</h2>
        <p className="section-subtitle">{t("subtitle")}</p>

        <div className="grid gap-10 sm:grid-cols-3">
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <Link
                key={service.key}
                href={service.url}
                className="bg-radial from-base-100 to-base-200 shadow-lg rounded-2xl p-6 hover:shadow-xl transition-all flex flex-col items-center text-center"
              >
                <Icon className="w-10 h-10 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">
                  {t(`${service.key}.title`)}
                </h3>
                <p className="text-gray-600 text-sm">
                  {t(`${service.key}.description`)}
                </p>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
