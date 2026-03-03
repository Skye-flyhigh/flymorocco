export const SITE_URL = "https://flymorocco.info";
export const SITE_NAME = "Flymorocco";

export const BUSINESS = {
  name: "Flymorocco",
  legalName: "Skye Graille",
  address: {
    street: "35 Mount Street",
    city: "Abergavenny",
    postcode: "NP7 7DT",
    country: "GB",
    countryName: "United Kingdom",
  },
  operatingAreas: [
    {
      name: "Mirleft",
      region: "Souss-Massa",
      country: "Morocco",
      countryCode: "MA",
      geo: { latitude: 29.5788, longitude: -10.0343 },
      tours: ["coastal", "wellbeing"],
    },
    {
      name: "Aguergour",
      region: "Marrakech-Safi",
      country: "Morocco",
      countryCode: "MA",
      geo: { latitude: 31.2931, longitude: -8.081 },
      tours: ["mountain"],
    },
  ],
  contact: {
    phone: "+212 636 04 17 61",
    whatsapp: "https://wa.me/+212636041761",
    email: "contact@flymorocco.info",
    noreply: "noreply@flymorocco.info",
    bookings: "bookings@flymorocco.info",
  },
  social: {
    facebook: "https://www.facebook.com/flymorocco",
    instagram: "https://www.instagram.com/flymorocco",
  },
  languages: ["en", "fr"] as const,
} as const;

export type PageKey =
  | "home"
  | "about"
  | "contact"
  | "tours"
  | "siteGuides"
  | "rules"
  | "airspaces"
  | "caaForms"
  | "bookingSuccess"
  | "cookies"
  | "privacy"
  | "terms";

export const PAGE_ROUTES: Record<PageKey, string> = {
  home: "",
  about: "about",
  contact: "contact",
  tours: "tours",
  siteGuides: "site-guides",
  rules: "rules",
  airspaces: "rules/airspaces",
  caaForms: "rules/authorisation",
  bookingSuccess: "booking-success",
  cookies: "cookies",
  privacy: "privacy",
  terms: "terms",
};
