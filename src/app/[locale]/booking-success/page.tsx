import { Suspense } from "react";
import { getTranslations } from "next-intl/server";
import BookingSuccessClient from "../components/BookingSuccessClient";
import Link from "next/link";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  await getTranslations({ locale, namespace: "booking" });

  return {
    title: "Booking Confirmed - FlyMorocco",
    description: "Your booking has been confirmed! We'll be in touch soon with your tour details.",
  };
}

export default async function BookingSuccessPage() {
  const t = await getTranslations("booking");

  return (
    <main className="min-h-screen flex items-center justify-center bg-base-100 p-4">
      <div className="max-w-2xl w-full">
        <div className="card bg-base-200 shadow-xl">
          <div className="card-body text-center">
            <div className="text-6xl mb-4">✅</div>
            <h1 className="card-title text-3xl justify-center mb-4">
              {t("success.title", { fallback: "Booking Confirmed!" })}
            </h1>
            
            <div className="prose max-w-none">
              <p className="text-lg mb-4">
                {t("success.message", { 
                  fallback: "Thank you for your booking! Your payment has been processed successfully." 
                })}
              </p>
              
              <div className="bg-base-300 rounded-lg p-4 mb-6">
                <h3 className="text-lg font-semibold mb-2">{t("success.nextSteps.title")}</h3>
                <ol className="text-left space-y-2">
                  <li>📧 {t("success.nextSteps.step1")}</li>
                  <li>📋 {t("success.nextSteps.step2")}</li>
                  <li>🪂 {t("success.nextSteps.step3")}</li>
                  <li>📞 {t("success.nextSteps.step4")}</li>
                </ol>
              </div>
              
              <p className="text-sm text-base-content/70">
                {t("success.questions")}
              </p>
            </div>
            
            <div className="card-actions justify-center mt-6">
              <Link href="/" className="btn btn-primary">
                {t("success.buttons.homepage")}
              </Link>
              <Link href="/tours" className="btn btn-outline">
                {t("success.buttons.tours")}
              </Link>
            </div>
          </div>
        </div>

        <Suspense fallback={<div>{t("success.loading")}</div>}>
          <BookingSuccessClient />
        </Suspense>
      </div>
    </main>
  );
}