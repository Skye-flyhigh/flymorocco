import "./globals.css";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import Footer from "./components/Footer";
import Navbar from "./components/NavBar";
import ParallaxClientWrapper from "./components/ParallaxClientWrapper";
import { getTranslations } from "next-intl/server";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });

  return {
    title: {
      default: `Flymorocco - ${t("title")}`,
      template: "%s | Flymorocco",
    },
    description: t("description"),
    keywords: ["Morocco"],
    authors: [{ name: "Skye" }],
    creator: "Skye",
    metadataBase: new URL("https://flymorocco.info"),
    openGraph: {
      title: "Flymorocco",
      description: t("description"),
      url: "https://flymorocco.info",
      siteName: "Flymorocco",
      images: [
        {
          url: "/og-image.png",
          width: 1200,
          height: 900,
          alt: "Flymorocco",
        },
      ],
      type: "website",
    },
    alternates: {
      canonical: "/",
      languages: {
        en: "/en",
        fr: "/fr",
      },
    },
    formatDetection: {
      email: true,
    },
  };
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  // Ensure that the incoming `locale` is valid
  const resolvedParams = await params;
  const locale = resolvedParams.locale;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const t = await getTranslations("HomePage");

  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider locale={locale}>
          <ParallaxClientWrapper>
            <a href="#main" className="sr-only focus:not-sr-only">
              {t("main")}
            </a>
            <Navbar />
            {children}
            <Footer />
          </ParallaxClientWrapper>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
