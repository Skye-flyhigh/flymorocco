import { useTranslations } from "next-intl";
import Hero from "../components/Hero";
import CaaForm from "../components/caaForm/CaaForm";

export default function Page() {
  const t = useTranslations("rules");
  return (
    <main>
      <Hero
        title={t("title")}
        subtitle={t("subtitle")}
        img="/images/kik-800x533.jpg"
      />
      <section>
        <CaaForm />
      </section>
    </main>
  );
}
