import { useTranslations } from "next-intl";
import SiteMapSection from "../../components/SiteMapSection";

export default function Page() {
  const t = useTranslations("rules");

  return (
    <main>
      <SiteMapSection />
    </main>
  );
}
