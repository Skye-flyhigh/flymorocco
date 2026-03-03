import { PageKey } from "./metadata";

type LocaleKeywords = { en: string[]; fr: string[] };

export const BASE_KEYWORDS: LocaleKeywords = {
  en: [
    "paragliding",
    "Morocco",
    "paragliding in Morocco",
    "Morocco paragliding",
    "Atlas Mountains",
    "Atlantic coast",
    "expert guides",
    "Agadir",
    "Marrakech",
  ],
  fr: [
    "parapente",
    "Maroc",
    "parapente Maroc",
    "parapente au Maroc",
    "Atlas",
    "côte atlantique",
    "guides expérimentés",
    "Agadir",
    "Marrakech",
  ],
};

const PAGE_KEYWORDS: Partial<Record<PageKey, LocaleKeywords>> = {
  home: {
    en: [
      "paragliding site guides in Morocco",
      "paragliding tour",
      "wellness week",
      "Mirleft",
      "Moroccan CAA",
      "Moroccan Airspaces",
    ],
    fr: [
      "guide sites de vol parapente au Maroc",
      "séjour parapente",
      "séjour bien-être",
      "Mirleft",
      "DGAC du Maroc",
      "Espaces aériens du Maroc",
    ],
  },
  about: {
    en: [
      "paragliding instructors",
      "BHPA certified",
      "Morocco flying team",
      "paragliding guides Morocco",
      "experienced pilots",
      "local partnerships",
      "safety record",
    ],
    fr: [
      "instructeurs parapente",
      "certifié BHPA",
      "équipe vol Maroc",
      "guides parapente Maroc",
      "pilotes expérimentés",
      "partenariats locaux",
      "bilan sécurité",
    ],
  },
  contact: {
    en: [
      "contact",
      "contact form",
      "paragliding inquiry",
      "book paragliding Morocco",
    ],
    fr: [
      "contact",
      "formulaire de contact",
      "demande parapente",
      "réserver parapente Maroc",
    ],
  },
  tours: {
    en: [
      "paragliding tour Morocco",
      "guided paragliding tour",
      "paragliding holidays Morocco",
      "discover paragliding Morocco",
      "adventure tours Morocco",
    ],
    fr: [
      "séjour parapente Maroc",
      "séjour guidé parapente",
      "vacances parapente Maroc",
      "découverte parapente Maroc",
      "séjours aventure Maroc",
    ],
  },
  siteGuides: {
    en: [
      "paragliding site guides",
      "flying sites Morocco",
      "paragliding locations Morocco",
      "site guide directory",
    ],
    fr: [
      "guides sites parapente",
      "sites de vol Maroc",
      "lieux de parapente Maroc",
      "répertoire guides sites",
    ],
  },
  rules: {
    en: [
      "rules",
      "airspace",
      "DGAC",
      "Moroccan CAA",
      "paragliding regulations Morocco",
    ],
    fr: [
      "règles",
      "espaces aériens",
      "DGAC",
      "aviation civile Maroc",
      "réglementation parapente Maroc",
    ],
  },
  airspaces: {
    en: [
      "airspace Morocco",
      "Moroccan airspace map",
      "ENR 5.5",
      "OpenAir format",
      "airspace restrictions Morocco",
      "paragliding airspace",
      "controlled airspace Morocco",
    ],
    fr: [
      "espace aérien Maroc",
      "carte espace aérien Maroc",
      "ENR 5.5",
      "format OpenAir",
      "restrictions espace aérien Maroc",
      "espace aérien parapente",
      "espace aérien contrôlé Maroc",
    ],
  },
  caaForms: {
    en: [
      "flight authorization Morocco",
      "DGAC authorization",
      "annexe 2",
      "annexe 4",
      "Morocco civil aviation authority",
      "free flying permit Morocco",
    ],
    fr: [
      "autorisation de vol Maroc",
      "autorisation DGAC",
      "annexe 2",
      "annexe 4",
      "aviation civile Maroc",
      "permis vol libre Maroc",
    ],
  },
  bookingSuccess: {
    en: ["booking confirmed", "tour reservation"],
    fr: ["réservation confirmée", "réservation séjour"],
  },
};

const TOUR_KEYWORDS: Record<string, LocaleKeywords> = {
  wellbeing: {
    en: [
      "wellbeing Morocco",
      "wellbeing retreat Morocco",
      "relaxation Morocco",
      "meditation yoga Morocco",
      "paragliding wellbeing Morocco",
      "winter paragliding holiday Morocco",
    ],
    fr: [
      "bien-être Maroc",
      "séjour bien-être Maroc",
      "relaxation Maroc",
      "méditation yoga Maroc",
      "séjour bien-être parapente Maroc",
      "vacance hiver parapente",
    ],
  },
  mountain: {
    en: [
      "mountains of Morocco",
      "Atlas paragliding Morocco",
      "Toubkal",
      "Aguergour",
      "Ait Ourir",
      "Marrakech paragliding",
    ],
    fr: [
      "montagnes du Maroc",
      "parapente Atlas Maroc",
      "Toubkal",
      "Aguergour",
      "Ait Ourir",
      "parapente Marrakech",
      "vol libre au Maroc",
    ],
  },
  coastal: {
    en: [
      "beach Morocco",
      "ocean Morocco",
      "Nid d'Aigle",
      "Aglou",
      "Aglou Beach",
      "Souss-Massa National Park",
    ],
    fr: [
      "plage Maroc",
      "Mirleft",
      "Sidi Ifni",
      "Nid d'Aigle",
      "Aglou",
      "Aglou Plage",
      "Parc naturel Souss-Massa",
    ],
  },
};

export function getKeywordsForPage(
  page: PageKey,
  locale: string,
  extraKeywords?: string[],
): string[] {
  const loc = locale as "en" | "fr";
  const base = BASE_KEYWORDS[loc] ?? BASE_KEYWORDS.en;
  const pageKw = PAGE_KEYWORDS[page]?.[loc] ?? PAGE_KEYWORDS[page]?.en ?? [];
  return [...base, ...pageKw, ...(extraKeywords ?? [])];
}

export function getKeywordsForTour(slug: string, locale: string): string[] {
  const loc = locale as "en" | "fr";
  const base = BASE_KEYWORDS[loc] ?? BASE_KEYWORDS.en;
  const tourBase =
    loc === "fr"
      ? [
          "séjour parapente Maroc",
          "découverte parapente du Maroc",
          "séjour guidé parapente",
          "vacances parapente Maroc",
        ]
      : [
          "paragliding tour Morocco",
          "paragliding guided tour",
          "paragliding guided tour Morocco",
          "discover paragliding in Morocco",
          "paragliding holidays Morocco",
        ];
  const tourSpecific =
    TOUR_KEYWORDS[slug]?.[loc] ?? TOUR_KEYWORDS[slug]?.en ?? [];
  return [...base, ...tourBase, ...tourSpecific];
}

export function getKeywordsForSiteGuide(
  slug: string,
  siteName: string,
  locale: string,
): string[] {
  const loc = locale as "en" | "fr";
  const base = BASE_KEYWORDS[loc] ?? BASE_KEYWORDS.en;
  const siteKw =
    loc === "fr"
      ? [
          "parapente Maroc",
          "site de vol",
          "guide parapente",
          siteName,
          `parapente ${siteName}`,
        ]
      : [
          "paragliding Morocco",
          "flying site",
          "site guide",
          siteName,
          `paragliding ${siteName}`,
        ];
  return [...base, ...siteKw];
}
