// Google Analytics utilities and enhanced tracking
declare global {
  interface Window {
    gtag: (
      command: "config" | "event" | "consent",
      targetIdOrAction: string | "default" | "update",
      parameters?: {
        page_path?: string;
        event_category?: string;
        event_label?: string;
        value?: number;
        analytics_storage?: "granted" | "denied";
        ad_storage?: "granted" | "denied";
        ad_user_data?: "granted" | "denied";
        ad_personalization?: "granted" | "denied";
        wait_for_update?: number;
      },
    ) => void;
    dataLayer: Array<Record<string, unknown>>;
  }
}

// Enhanced page view tracking
export const trackPageView = (url: string) => {
  if (typeof window !== "undefined" && typeof window.gtag === "function") {
    window.gtag("config", process.env.NEXT_PUBLIC_GA_ID as string, {
      page_path: url,
    });
    console.log("📊 GA Pageview tracked:", url);
  }
};

// Custom event tracking
export const trackEvent = (
  action: string,
  category: string,
  label?: string,
  value?: number,
) => {
  if (typeof window !== "undefined" && typeof window.gtag === "function") {
    window.gtag("event", action, {
      event_category: category,
      event_label: label,
      value: value,
    });
    console.log("📊 GA Event tracked:", { action, category, label, value });
  }
};

// Business-specific tracking functions
export const trackBookingEvent = (
  action: "booking_started" | "booking_completed" | "payment_success",
  tourType?: string,
  amount?: number,
) => {
  trackEvent(action, "booking", tourType, amount);
};

export const trackContactForm = (formType: "contact" | "caa_form") => {
  trackEvent("form_submit", "engagement", formType);
};

export const trackSiteGuideView = (siteName: string) => {
  trackEvent("view_site_guide", "content", siteName);
};

export const trackVaultAccess = () => {
  trackEvent("vault_access", "admin");
};

// Debug function to check GA status
export const checkGoogleAnalytics = () => {
  if (typeof window !== "undefined") {
    console.log("🔍 Google Analytics Debug:");
    console.log("- window.gtag exists:", typeof window.gtag === "function");
    console.log("- window.dataLayer exists:", !!window.dataLayer);
    console.log("- dataLayer length:", window.dataLayer?.length || 0);

    // Check consent status
    if (localStorage.getItem("cookieConsent")) {
      console.log("- Cookie consent:", localStorage.getItem("cookieConsent"));
    } else {
      console.log("- Cookie consent: not set (analytics disabled)");
    }

    // Send test event only if gtag is actually loaded
    if (typeof window.gtag === "function") {
      trackEvent("debug_check", "system", "analytics_status");
      console.log("✅ Test event sent");
    } else {
      console.log("❌ gtag function not loaded yet");
    }
  }
};

// Enhanced consent management
export const updateAnalyticsConsent = (granted: boolean) => {
  if (typeof window !== "undefined" && typeof window.gtag === "function") {
    window.gtag("consent", "update", {
      analytics_storage: granted ? "granted" : "denied",
      ad_storage: granted ? "granted" : "denied",
    });
    console.log(`📊 Analytics consent ${granted ? "granted" : "denied"}`);
  }
};
