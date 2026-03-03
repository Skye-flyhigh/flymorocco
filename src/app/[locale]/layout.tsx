import "./globals.css";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import Footer from "./components/Footer";
import Navbar from "./components/NavBar";
import ParallaxClientWrapper from "./components/ParallaxClientWrapper";
import CookieConsent from "./components/CookieConsent";
import { getTranslations } from "next-intl/server";
import Script from "next/script";
import StructuredData from "./components/StructuredData";
import { GoogleAnalytics } from "@next/third-parties/google";
import { siteMeta } from "@/lib/validation/siteMeta";
import { Metadata } from "next";
import { SITE_URL, SITE_NAME } from "@/data/metadata";
import { getKeywordsForPage } from "@/data/keywords";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });

  const paraglidingSites = Object.keys(siteMeta);
  const keywords = getKeywordsForPage("home", locale, paraglidingSites);

  return {
    title: {
      default: `${SITE_NAME} - ${t("title")}`,
      template: `%s | ${SITE_NAME}`,
    },
    keywords,
    authors: [{ name: "Skye" }],
    creator: "Skye",
    metadataBase: new URL(SITE_URL),
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
    other: {
      "geo.region": "MA",
      "geo.country": "Morocco",
    },
    openGraph: {
      title: SITE_NAME,
      description: t("description"),
      url: SITE_URL,
      siteName: SITE_NAME,
      images: [
        {
          url: "/og-image.png",
          width: 1200,
          height: 900,
          alt: SITE_NAME,
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
      <head>
        <link rel="preload" href="/images/fred-centered.webp" as="image" />
        <StructuredData type="business" />

        {/* Stripe.js */}
        <Script src="https://js.stripe.com/v3/" strategy="lazyOnload" />

        {/* Google Analytics */}
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID!} />
      </head>
      <body>
        <NextIntlClientProvider locale={locale}>
          <ParallaxClientWrapper>
            <a href="#main" className="sr-only focus:not-sr-only">
              {t("main")}
            </a>
            <Navbar />
            {children}
            <Footer />
            <CookieConsent />
          </ParallaxClientWrapper>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
