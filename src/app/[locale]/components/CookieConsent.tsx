"use client";

import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { updateAnalyticsConsent, checkGoogleAnalytics } from "@/lib/analytics";

export default function CookieConsent() {
  const [showConsent, setShowConsent] = useState(false);
  const t = useTranslations("cookies");

  useEffect(() => {
    // Check if user has already made a choice
    const consentGiven = localStorage.getItem("cookieConsent");
    if (!consentGiven) {
      setShowConsent(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("cookieConsent", "accepted");
    setShowConsent(false);

    // Use enhanced analytics consent function
    updateAnalyticsConsent(true);

    // Debug check after a brief delay to allow gtag to process
    setTimeout(() => {
      checkGoogleAnalytics();
    }, 1000);
  };

  const handleRefuse = () => {
    localStorage.setItem("cookieConsent", "refused");
    setShowConsent(false);

    // Use enhanced analytics consent function
    updateAnalyticsConsent(false);
  };

  if (!showConsent) return null;

  return (
    <div
      className="fixed bottom-0 left-0 right-0 bg-accent text-white p-4 z-50 shadow-lg"
      role="dialog"
      aria-modal="true"
      aria-labelledby="cookie-title"
    >
      <div className="max-w-6xl mx-auto flex flex-col text-accent-content sm:flex-row items-center justify-between gap-4">
        <div className="flex-1">
          <p className="text-sm" id="cookie-title">
            {t("banner")}
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleRefuse}
            className="px-4 py-2 text-sm btn btn-neutral"
            aria-label={t("refuse")}
          >
            {t("refuse")}
          </button>
          <button
            onClick={handleAccept}
            className="px-4 py-2 text-sm btn btn-primary"
            aria-label={t("accept")}
          >
            {t("accept")}
          </button>
        </div>
      </div>
    </div>
  );
}
