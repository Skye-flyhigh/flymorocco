import { buildPageMetadata } from "@/lib/metadata/buildPageMetadata";
import { Metadata } from "next";
import { useTranslations } from "next-intl";
import Link from "next/link";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return await buildPageMetadata({ locale, page: "privacy" });
}

export default function Page() {
  const t = useTranslations("privacy");

  return (
    <main id="main">
      <section id="privacy" className="md:mt-10 mb-20 mx-auto legals">
        <h1 className="section-title">{t("title")}</h1>
        <h2 className="section-subtitle">
          {t("lastUpdate")} {new Date("27/5/25").toDateString()}
        </h2>
        <article id="who">
          <h3>{t("who.title")}</h3>
          <p>{t("who.description")}</p>
          <p>
            <strong>{t("who.controller")}</strong> Skye Graille
          </p>
        </article>
        <article id="collection">
          <h3>{t("collection.title")}</h3>
          <p>{t("collection.description")}</p>
          <ul>
            <li>
              {t("collection.c1.title")} {t("collection.c1.description")}
            </li>
            <li>
              {t("collection.c2.title")} {t("collection.c2.description")}
            </li>
            <li>
              {t("collection.c3.title")} {t("collection.c3.description")}
            </li>
            <li>
              {t("collection.c4.title")} {t("collection.c4.description")}
            </li>
            <li>
              {t("collection.c5.title")} {t("collection.c5.description")}
            </li>
          </ul>
          <p>{t("collection.purpose")}</p>
        </article>
        <article id="reasons">
          <h3>{t("reasons.title")}</h3>
          <p>{t("reasons.description")}</p>
          <ul>
            <li>
              {t("reasons.r1.title")} {t("reasons.r1.description")}
            </li>
            <li>
              {t("reasons.r2.title")} {t("reasons.r2.description")}
            </li>
            <li>
              {t("reasons.r3.title")} {t("reasons.r3.description")}
            </li>
          </ul>
        </article>
        <article id="store">
          <h3>{t("store.title")}</h3>
          <ul>
            <li>{t("store.s1")}</li>
            <li>{t("store.s2")}</li>
            <li>{t("store.s3")}</li>
            <li>{t("store.s4")}</li>
          </ul>
        </article>
        <article id="communication">
          <h3>{t("communication.title")}</h3>
          <p>{t("communication.description")}</p>
        </article>
        <article id="GDPR">
          <h3>{t("gdpr.title")}</h3>
          <p>{t("gdpr.description")}</p>
          <ul>
            <li>{t("gdpr.g1")}</li>
            <li>{t("gdpr.g2")}</li>
            <li>{t("gdpr.g3")}</li>
            <li>{t("gdpr.g4")}</li>
            <li>{t("gdpr.g5")}</li>
          </ul>
          <p>{t("gdpr.contact")}</p>
        </article>
        <article id="analytics">
          <h3>{t("analytics.title")}</h3>
          <p>{t("analytics.description")}</p>
        </article>
        <article id="retention">
          <h3>{t("retention.title")}</h3>
          <ul>
            <li>{t("retention.r1")}</li>
            <li>{t("retention.r2")}</li>
            <li>{t("retention.r3")}</li>
          </ul>
        </article>
        <article id="modification">
          <h3>{t("modification.title")}</h3>
          <p>{t("modification.description")}</p>
        </article>
        <article id="contact">
          <h3>{t("contact.title")}</h3>
          <p>{t("contact.description")}</p>
          <Link
            href={"mailto:contact@flymorocco.info"}
            className="link link-hover link-primary"
            aria-label="Send an email"
          >
            {t("contact.contact")}
          </Link>
        </article>
      </section>
    </main>
  );
}
