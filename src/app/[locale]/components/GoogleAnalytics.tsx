"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { trackPageView } from "@/lib/analytics";

export default function GoogleAnalytics() {
  const pathname = usePathname();

  useEffect(() => {
    // Only track if user has consented to cookies
    const hasConsent = localStorage.getItem("cookieConsent") === "accepted";
    if (hasConsent) {
      trackPageView(pathname);
    }
  }, [pathname]);

  return null; // This component doesn't render anything
}
