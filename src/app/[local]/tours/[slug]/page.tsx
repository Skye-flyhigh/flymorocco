"use client"
import getTourMeta from "@/lib/data-retrievers/getTourMeta";
// import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import MissingTour from "../../components/tours/MissingTour";
import Hero from "../../components/Hero";

export default function Page() {
  const slug = usePathname().split("/").slice(3).toString();
  const meta = getTourMeta(slug);
  console.log("Tours meta info:", {slug, meta});
  
  if (!meta || !slug) return <MissingTour />
//   const t = useTranslations(`tours.toursDetails.${meta.translationKey}`);


  let path = ''
  switch(slug) {
    case mountain:
        path = "/images/guigou-2000x1333.jpg";
        break;
    case coastal:
        path = "/images/plage-626x835.jpeg"
        break;
    case wellbeing:
        path = "";
        break;
  } 


    return(
        <main className="m-auto pt-10">
            <Hero
            title={t('name')}
            subtitle={t('description')}
            img={path ?? "/images/camel-1865x1415.jpg"}
            />

        </main>
    )
}