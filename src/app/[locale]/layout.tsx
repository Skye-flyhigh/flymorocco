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
    keywords: locale === 'fr' 
      ? ["parapente", "Maroc", "séjour parapente", "Atlas", "côte atlantique", "guide sites", "séjour bien-être", "Agadir", "Essaouira", "Mirleft", "guides expérimentés"]
      : ["paragliding", "Morocco", "paragliding tour", "Atlas Mountains", "Atlantic coast", "site guides", "wellness week", "Agadir", "Essaouira", "Mirleft", "expert guides"],
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

        {/* <!-- Google tag (gtag.js) --> */}
        <Script
          async
          src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
        />
        <Script id="google-analytics">
          {`window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}

  //Set default consent state
  gtag('consent', 'default', {
    'ad_user_data': 'denied',
    'ad_personalization': 'denied',
    'ad_storage': 'denied',
    'analytics_storage': 'denied',
    'wait_for_update': 500,
  });

  gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}');`}
        </Script>

        {/* Stripe.js */}
        <Script
          src="https://js.stripe.com/v3/"
          strategy="lazyOnload"
        />
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
