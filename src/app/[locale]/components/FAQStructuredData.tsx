import { useLocale } from "next-intl";

export default function FAQStructuredData() {
  const locale = useLocale();

  const faqData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity:
      locale === "fr"
        ? [
            {
              "@type": "Question",
              name: "Qu'est-ce que le parapente au Maroc ?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Le parapente au Maroc offre des vols exceptionnels au-dessus de l'Atlas et de la côte atlantique. FlyMorocco propose des stages et des séjours bien-être dans des sites comme Legzira, Aglou, et l'Atlas. Les conditions de vol sont excellentes avec des guides expérimentés et certifiés.",
              },
            },
            {
              "@type": "Question",
              name: "Où faire du parapente au Maroc ?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Les meilleurs sites de parapente au Maroc incluent : Legzira (côte atlantique), Aglou (falaises côtières), Aguergour et M'Zouda (Atlas), Tizi n'Test (haute montagne), Plage Blanche (dunes), et Imsouane (surf et parapente). FlyMorocco couvre tous ces sites avec des guides locaux experts.",
              },
            },
            {
              "@type": "Question",
              name: "Quand faire du parapente au Maroc ?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "La meilleure période pour le parapente au Maroc est d'octobre à mai. Les conditions sont excellentes avec des vents thermiques réguliers et un climat agréable. FlyMorocco organise des séjours côtiers en automne/hiver et des stages Atlas au printemps.",
              },
            },
            {
              "@type": "Question",
              name: "Faut-il une autorisation pour voler au Maroc ?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Oui, une autorisation de l'Aviation Civile Marocaine est requise pour voler au Maroc. FlyMorocco s'occupe de toutes les démarches administratives (Annexe 2 et Annexe 4) et fournit l'assurance nécessaire pour voler légalement.",
              },
            },
          ]
        : [
            {
              "@type": "Question",
              name: "What is paragliding in Morocco like?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Paragliding in Morocco offers exceptional flights over the Atlas Mountains and Atlantic coast. FlyMorocco provides guided tours and wellness weeks at sites like Legzira, Aglou, and the Atlas range. Flying conditions are excellent with experienced, certified guides.",
              },
            },
            {
              "@type": "Question",
              name: "Where to go paragliding in Morocco?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Best paragliding sites in Morocco include: Legzira (Atlantic coast), Aglou (coastal cliffs), Aguergour and M'Zouda (Atlas Mountains), Tizi n'Test (high mountain), Plage Blanche (dunes), and Imsouane (surf and fly). FlyMorocco covers all these sites with expert local guides.",
              },
            },
            {
              "@type": "Question",
              name: "When is the best time for paragliding in Morocco?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "The best time for paragliding in Morocco is October to May. Conditions are excellent with regular thermals and pleasant weather. FlyMorocco organizes coastal tours in autumn/winter and Atlas tours in spring.",
              },
            },
            {
              "@type": "Question",
              name: "Do you need authorization to fly in Morocco?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Yes, authorization from Morocco Civil Aviation Authority is required to fly in Morocco. FlyMorocco handles all administrative procedures (Annexe 2 and Annexe 4) and provides necessary insurance for legal flying.",
              },
            },
          ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(faqData),
      }}
    />
  );
}
