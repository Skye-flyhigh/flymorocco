import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  // A list of all locales that are supported
  locales: ["en", "fr"] as const,

  // Used when no locale matches
  defaultLocale: "en",

  // Use permanent redirects (301) instead of temporary (307)
  localePrefix: 'always',

  // Disable automatic locale detection for SEO
  localeDetection: false
});

export type Locale = (typeof routing.locales)[number];
