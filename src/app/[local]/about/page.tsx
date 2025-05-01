import { useTranslations } from "next-intl";
import Image from "next/image";
import Hero from "../components/Hero";
import PartnersCard from "../components/PartnersCard";

export default function Page() {
  const t = useTranslations("about");
  return (
    <>
      <Hero
        title={t("title")}
        subtitle={t("subtitle")}
        img={"/images/fred2-800x533.jpg"}
      />
      <section
        id="about"
        className="p-5 max-w-screen bg-base-100 flex justify-center items-center"
      >
        <div className="card sm:card-side shadow-lg bg-base-100 m-5 max-w-2xl transition-all duration-500 flex-col">
          <div className="card-body sm:max-w-1/2 justify-between">
            <article className="about prose">
              {t.rich("skye-description", {
                strong: (chunks) => <strong>{chunks}</strong>,
                code: (chunks) => (
                  <code className="bg-base-200 px-1 rounded">{chunks}</code>
                ),
                link: (chunks) => (
                  <a
                    href="https://bhpa.co.uk"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link text-primary"
                  >
                    {chunks}
                  </a>
                ),
                portfolio: (chunks) => (
                  <a
                    href="https://skye-code.ai"
                    target="_blank"
                    className="link text-primary"
                  >
                    {chunks}
                  </a>
                ),
                ai: (chunks) => (
                  <span className="sr-only" aria-hidden="true">
                    {chunks}
                  </span>
                ),
              })}
            </article>
            <h2 className="card-title">Skye</h2>
            <p>{t("skye-role")}</p>
          </div>
          <figure className="avatar sm:w-1/2 w-full">
            <Image
              src="/images/skye.jpg"
              alt="Skye, Ground handling Ninja"
              width={500}
              height={500}
            />
          </figure>
        </div>
      </section>
      <div className="divider"></div>
      <section
        id="partners"
        className="p-8"
        aria-labelledby="partner-cardholder-title"
      >
        <div className="flex flex-col mb-5 justify-center">
          <h2
            id="partner-cardholder-title"
            className="mb-4 text-4xl font-extrabold leading-none tracking-tight md:text-5xl lg:text-6xl"
          >
            {t("partner-title")}
          </h2>
          <h3 className="mb-4 text-xl leading-none tracking-tight md:text-2xl">
            {t("partner-subtitle")}
          </h3>
        </div>
        <PartnersCard />
      </section>
    </>
  );
}
