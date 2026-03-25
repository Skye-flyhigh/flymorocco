import { getRequestConfig } from "next-intl/server";
import { hasLocale } from "next-intl";
import { routing } from "./routing";

// Static imports ensure proper bundling on Vercel serverless
import enMessages from "../../messages/en.json";
import frMessages from "../../messages/fr.json";

const messagesByLocale: Record<string, typeof enMessages> = {
  en: enMessages,
  fr: frMessages,
};

export default getRequestConfig(async ({ requestLocale }) => {
  // Typically corresponds to the `[locale]` segment
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;

  return {
    locale,
    messages: messagesByLocale[locale],
  };
});
