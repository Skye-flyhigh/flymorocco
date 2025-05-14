"use client";

import Link from "next/link";
import { useState } from "react";
import Annexe2Form from "../../components/rules/Annexe2Form";
import Annexe2and4Form from "../../components/rules/Annexe2and4Form";
import { useTranslations } from "next-intl";

export default function Page() {
  const t = useTranslations("rules");
  const [agreedPrivacy, setAgreedPrivacy] = useState(false);
  const [agreedMoroccanLaw, setAgreedMoroccanLaw] = useState(false);
  const [annex4, setAnnex4] = useState(false);

  if (!agreedPrivacy || !agreedMoroccanLaw) {
    return (
      <main className="mt-10">
        <section className="flex flex-col space-y-4 md:max-w-3/4 m-auto p-6">
          <article>
            {t("annexe2Disclaimer.intro")}
            <ol className="list-decimal pl-6">
              {Object.entries(t.raw("annexe2Disclaimer.items")).map((_, i) => (
                <li key={i}>
                  {t.rich(`annexe2Disclaimer.items.${i}`, {
                    abbrCAA: (chunks) => (
                      <abbr title="Civil Aviation Authority">{chunks}</abbr>
                    ),
                    abbrVFR: (chunks) => (
                      <abbr title="Visual Flight Rules">{chunks}</abbr>
                    ),
                    airspaceLink: (chunks) => (
                      <Link href="/rules/airspaces" target="_blank">
                        {chunks}
                      </Link>
                    ),
                  })}
                </li>
              ))}
            </ol>
          </article>

          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              onChange={(e) => setAgreedPrivacy(e.target.checked)}
            />
            <span>
              {t("agreements.read")}{" "}
              <Link href="/privacy" className="link">
                {t("agreements.privacy")}
              </Link>
              .
            </span>
          </label>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              onChange={(e) => setAgreedMoroccanLaw(e.target.checked)}
            />
            <span>
              {t("agreements.acknowledged")}{" "}
              <Link href="/rules/authorisation" className="link">
                {t("agreements.legal")}
              </Link>
              .
            </span>
          </label>
        </section>
      </main>
    );
  } else {
    return (
      <main className="mt-15">
        <section
          id="form-selector"
          className="flex items-center md:max-w-3/4 m-auto p-6"
        >
          <h3 className="m-5">{t("selector.title")}</h3>
          <div className="dropdown dropdown-bottom dropdown-center min-w-fit">
            <div tabIndex={0} role="button" className="btn m-1">
              {t("selector.dropdown")}
            </div>
            <ul
              tabIndex={0}
              className="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm"
            >
              <li onClick={() => setAnnex4(false)}>
                <a>{t("annexe2.title")}</a>
              </li>
              <li onClick={() => setAnnex4(true)}>
                <a>{t("annexe2and4.title")}</a>
              </li>
            </ul>
          </div>
        </section>

        {annex4 ? <Annexe2and4Form /> : <Annexe2Form />}
      </main>
    );
  }
}
