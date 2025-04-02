import { Plane } from "lucide-react"
import { useTranslations } from "next-intl";

export default function HomePage() {
  const t = useTranslations('HomePage')
  
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <h1>Flymorocco</h1>
        <h2>{t('subtitle')}</h2>
        <Plane className="mx-auto h-10 w-10 text-blue-500"/>
        <button className="btn">{t("exploreBtn")}</button>
      </main>
    </div>
  );
}
