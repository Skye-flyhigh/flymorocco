"use client";

import { useLocale, useTranslations } from "next-intl";
import { Globe } from "lucide-react";
import { useTransition } from "react";
import { usePathname, useRouter } from "next/navigation";

// const availableLocales = ['en', 'fr'] as const;

export default function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const currentLocale = useLocale();
  const [isPending, startTransition] = useTransition();
  const t = useTranslations("nav");

  const switchLocale = () => {
    const nextLocale = currentLocale === "en" ? "fr" : "en";

    startTransition(() => {
      router.replace(`/${nextLocale}${pathname.replace(/^\/[^\/]+/, "")}`);
    });
  };

  const getLocaleName = (locale: string) => {
    return locale === "en" ? "English" : "Français";
  };

  return (
    <button
      onClick={switchLocale}
      disabled={isPending}
      aria-label={`${t("languageSwitch")} ${getLocaleName(currentLocale === "en" ? "fr" : "en")}`}
      className="btn btn-sm btn-ghost gap-1 flex items-center"
    >
      <Globe className="w-4 h-4" />
      {currentLocale.toUpperCase()}
    </button>
  );
}
