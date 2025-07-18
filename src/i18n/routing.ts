import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  // A list of all locales that are supported
  locales: ["en", "fr"] as const,

  // Used when no locale matches
  defaultLocale: "en",
});

export type Locale = (typeof routing.locales)[number];
