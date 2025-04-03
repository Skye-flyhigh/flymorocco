import { useTranslations } from "next-intl";
import Carousel from "./components/Carousel";

export default function HomePage() {
  const t = useTranslations('HomePage')
  const images = [
    {
      src: '/images/sonja-800x533.jpg',
      width: 800,
      height: 533,
      isSelected: true,
      alt: 'Sonja flying over Aguergour'
    },
    {
      src: '/images/plage-626x835.jpeg',
      width: 626,
      height: 835,
      isSelected: true,
      alt: 'Ground Handling at Plage Blanche'
    },
    {
      src: '/images/legzira2-800x600.jpg',
      width: 800,
      height: 600,
      isSelected: true,
      alt: 'Top takeoff view of Legzira'
    }
  ]

  return (
    <>
    <header className="hero min-h-screen" style={{backgroundImage: "url(./images/fred-centered.jpeg)", backgroundPosition: 'center', backgroundSize: 'cover', backgroundRepeat: 'no-repeat'}}>
      <div className="hero-content text-neutral-content text-center ">
        <div className="max-w-md">
          <h1 className="mb-5 text-5xl font-bold">Flymorocco - {t('title')}</h1>
          <h2 className="mb-5 text-2xl">{t('subtitle')}</h2>
          <button className="btn">{t("exploreBtn")}</button>
        </div>
      </div>
    </header>
    <Carousel images={images}/>
    </>
  );
}
