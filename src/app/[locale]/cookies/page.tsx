import { buildPageMetadata } from "@/lib/metadata/buildPageMetadata";
import { Metadata } from "next";
import { useTranslations } from "next-intl";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return await buildPageMetadata({ locale, page: "cookies" });
}

export default function Page() {
  const t = useTranslations("cookies");

  const nbOfArticles = 5;

  return (
    <main id="main">
      <section id="cookies" className="md:mt-10 mb-20 mx-auto legals">
        <h1 className="section-title">{t("title")}</h1>
        <h2 className="section-subtitle">
          {t("lastUpdated")} {new Date(2025, 4, 20).toDateString()}
        </h2>
        {Array.from({ length: nbOfArticles }, (_, index) => {
          const num = index + 1;
          return (
            <article key={num}>
              <h3>{t(`q${num}.q`)}</h3>
              <p>{t(`q${num}.a`)}</p>
            </article>
          );
        })}
        <a
          href={"mailto:contact@flymorocco.info"}
          className="link link-primary link-hover"
          aria-label="Send an email"
        >
          {t("contact")}
        </a>
      </section>
    </main>
  );
}
