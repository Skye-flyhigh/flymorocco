"use client";
import { MoveRight } from "lucide-react";
import { useTranslations } from "next-intl";

export default function ViewMoreArrow() {
  const t = useTranslations("rules");

  return (
    <div className="flex justify-end items-center mt-6 text-secondary text-xs">
      <p className="group-hover:opacity-100 group-hover:translate-x-2 transition-all duration-300 opacity-0 mr-2">
        {t("rulesNav.view")}
      </p>
      <MoveRight
        size={26}
        className="group-hover:translate-x-2 transition-transform duration-300"
      />
    </div>
  );
}
