import { useTranslations } from "next-intl";
import Link from "next/link";

export default function Page() {
  const t = useTranslations("terms");
  return (
    <main>
      <section id="terms" className="md:mt-10 mb-20 mx-auto legals">
        <h1 className="section-title">{t("title")}</h1>
        <h2 className="section-subtitle">
          {t("lastUpdate")} {new Date("24/5/2025").toDateString()}
        </h2>
        <address id="legal-info">
          <h3>{t("legalInfo.title")}</h3>
          {t.rich("legalInfo.description", {
            strong: (chunks) => <strong>{chunks}</strong>,
            ol: (chunks) => <ol>{chunks}</ol>,
            li: (chunks) => <li>{chunks}</li>,
            email: (chunks) => (
              <Link
                href={"mailto:contact@flymorocco.info"}
                className="link link-hover link-primary"
              >
                {chunks}
              </Link>
            ),
            host: (chunks) => <Link href="https://nindohost.ma">{chunks}</Link>,
          })}
        </address>
        <article id="acceptance">
          <h3>{t("acceptance.title")}</h3>
          <p>{t("acceptance.description")}</p>
        </article>
        <article id="services">
          <h3>{t("services.title")}</h3>
          <p>{t("services.description")}</p>
          <ol>
            {t.rich("services.list", {
              li: (chunks) => <li>{chunks}</li>,
            })}
          </ol>
          <p>
            {t.rich("services.exclusion", {
              strong: (chunks) => <strong>{chunks}</strong>,
              abbr: (chunks) => (
                <abbr title="Civil Aviation Authority">{chunks}</abbr>
              ), //FIXME: this is hard coded abbr
            })}
          </p>
        </article>
        <article id="liability">
          <h3>{t("liability.title")}</h3>
          <ul>
            <li>{t("liability.l1")}</li>
            <li>{t("liability.l2")}</li>
            <li>{t("liability.l3")}</li>
          </ul>
        </article>
        <article id="data-collection">
          <h3>{t("data.title")}</h3>
          <p>
            {t.rich("data.description", {
              a: (chunks) => (
                <Link href="/privacy" className="link link-hover link-primary">
                  {chunks}
                </Link>
              ),
            })}
          </p>
        </article>
        <article id="cookie">
          <h3>{t("cookie.title")}</h3>
          <p>{t("cookie.description")}</p>
        </article>
        <article id="intellectual-property">
          <h3>{t("intellectualProperty.title")}</h3>
          <p>{t("intellectualProperty.description")}</p>
        </article>
        <article id="external-providers">
          <h3>{t("externalProviders.title")}</h3>
          <p>{t("externalProviders.description")}</p>
        </article>
        <article id="terms-modification">
          <h3>{t("termsModification.title")}</h3>
          <p>{t("termsModification.description")}</p>
        </article>
        <article id="jurisdiction">
          <h3>{t("jurisdiction.title")}</h3>
          <p>{t("jurisdiction.description")}</p>
        </article>
      </section>
      <div className="hidden">
        ### 10. To Be Confirmed / Pending Entries * [ ] Registration number of
        FlyMorocco (if company status is established) * [ ] Physical address for
        legal notice * [ ] Hosting provider legal ID / jurisdiction * [ ] Cookie
        policy (pending confirmation of whether cookies or analytics are used) *
        [ ] Data retention timeline and deletion policy for generated forms * [
        ] Terms regarding booking or payment if such features are added ---
        Questions? Email us at:
      </div>
    </main>
  );
}
