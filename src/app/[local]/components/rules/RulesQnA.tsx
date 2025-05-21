import { useTranslations } from "next-intl";

export default function RulesQnA() {
  const t = useTranslations("rules");

  const nbQuestions = 5;
  const questionKeys = Array.from(
    { length: nbQuestions },
    (_, i) => `q${i + 1}`,
  );

  return (
    <section id="QnA" className="w-screen py-20 px-10">
      <div id="content" className="mx-auto max-w-2xl">
        <h2 className="section-title">{t("qna.title")}</h2>
        <h3 className="sections-subtitle">{t("qna.subtitle")}</h3>
        <div className="mt-10 flex flex-col gap-4">
          {questionKeys.map((key) => (
            <div
              key={key}
              tabIndex={0}
              className="collapse bg-base-200 hover:bg-base-300 transition-colors"
            >
              <div className="collapse-title font-semibold">
                {t(`${key}.q`)}
              </div>
              <div className="collapse-content text-sm">{t(`${key}.a`)}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
