import type { Metadata } from "next";
import "./globals.css";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import Footer from "./components/Footer";
import Navbar from "./components/NavBar";
import ParallaxClientWrapper from "./components/ParallaxClientWrapper";

export const metadata: Metadata = {
  title: "Flymorocco",
  description: "Paragliding adventures in Morocco",
};

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
  const { local: locale } = resolvedParams; //Official next-intl docs said it return { locale } they said, they were wrong all along!! DUH

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider locale={locale}>
          <ParallaxClientWrapper>
            <Navbar />
            {children}
            <Footer />
          </ParallaxClientWrapper>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
