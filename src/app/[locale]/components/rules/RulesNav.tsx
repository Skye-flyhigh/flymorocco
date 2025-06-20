import { Map, NotepadText } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import ViewMoreArrow from "../viewMoreArrow";

const rules = [
  {
    key: "airspaces",
    icon: Map,
  },
  {
    key: "authorisation",
    icon: NotepadText,
  },
];

export default function RulesNav() {
  const t = useTranslations("rules");

  return (
    <section id="navigation" className="py-10 m-5 px-4 min-h-3/4">
      <div id="container" className="text-center">
        <h2 className="section-title">{t("rulesNav.title")}</h2>
        <p>{t("rulesNav.requirements")}</p>
      </div>
      <div
        id="links"
        aria-label="regulation links"
        className={`my-5 grid gap-10 sm:grid-cols-2 justify-items-center`}
      >
        {rules.map((rule) => {
          const Icon = rule.icon;
          return (
            <Link
              key={rule.key}
              aria-label={`${rule.key} link`}
              href={`/rules/${rule.key}`}
              className="group bg-radial from-base-100 to-base-200 hover:from-base-200 hover:to-base-300 shadow-lg rounded-2xl p-6 hover:shadow-xl transition-all w-full h-full max-w-96 flex flex-col justify-between"
            >
              <article
                id="content"
                className="flex flex-col items-center text-center"
              >
                <Icon className={`w-10 h-10 text-secondary mb-4`} />
                <h3 className="text-xl font-semibold mb-2">
                  {t(`${rule.key}.title`)}
                </h3>
                <p className="text-gray-600 text-sm">
                  {t(`${rule.key}.description`)}
                </p>
              </article>
              <div className="flex justify-end items-center mt-6 text-neutral text-xs">
                <ViewMoreArrow />
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
