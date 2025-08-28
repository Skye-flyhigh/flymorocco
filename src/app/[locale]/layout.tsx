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
import AIFriendlyMeta from "./components/AIFriendlyMeta";
import { GoogleAnalytics } from "@next/third-parties/google";
import { siteMeta } from "@/lib/validation/siteMeta";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });

  const baseKeywords =
    locale === "fr"
      ? [
          "parapente",
          "Maroc",
          "séjour parapente",
          "Atlas",
          "guide sites de vol parapente au Maroc",
          "parapente Maroc",
          "séjour bien-être",
          "Agadir",
          "Marrakech",
          "Mirleft",
          "DGAC du Maroc",
          "Espaces aériens du Maroc",
          "guides expérimentés",
        ]
      : [
          "paragliding",
          "Morocco",
          "paragliding tour",
          "Atlas Mountains",
          "Atlantic coast",
          "paragliding in Morocco",
          "Morocco paragliding",
          "paragliding site guides in Morocco",
          "wellness week",
          "Agadir",
          "Marrakech",
          "Mirleft",
          "Moroccan CAA",
          "Moroccan Airspaces",
          "expert guides",
        ];

  const paraglidingSites = Object.keys(siteMeta);

  const keywords = [...baseKeywords, ...paraglidingSites];

  return {
    title: {
      default: `Flymorocco - ${t("title")}`,
      template: "%s | Flymorocco",
    },
    description: t("description"),
    keywords,
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
      <head>
        <link rel="preload" href="/images/fred-centered.webp" as="image" />
        <AIFriendlyMeta />
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
