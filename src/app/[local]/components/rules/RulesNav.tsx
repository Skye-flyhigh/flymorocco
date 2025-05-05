import { Map, NotepadText } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";

const rules = [
  {
    key: "airspaces",
    icon: Map,
    btn: "primary"
  },
  {
    key: "authorisation",
    icon: NotepadText,
    btn: "secondary"
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
        className={`my-5 grid gap-10 sm:grid-cols-2 justify-items-center`}
      >
        {rules.map((rule) => {
          const Icon = rule.icon;
          return (
            <Link
              key={rule.key}
              href={`/rules/${rule.key}`}
              className="bg-radial from-base-100 to-base-200 shadow-lg rounded-2xl p-6 hover:shadow-xl transition-all flex flex-col items-center text-center h-full max-w-96"
            >
              <Icon className="w-10 h-10 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">
                {t(`${rule.key}.title`)}
              </h3>
              <p className="text-gray-600 text-sm">
                {t(`${rule.key}.description`)}
              </p>
              <button className={`btn btn-${rule.btn}`}>{t(`${rule.key}.title`)}</button>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
