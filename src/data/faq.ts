export interface FAQItem {
  question: { en: string; fr: string };
  answer: { en: string; fr: string };
}

export interface FAQSection {
  page: string;
  items: FAQItem[];
}
