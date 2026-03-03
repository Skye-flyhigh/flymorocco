import { useLocale } from "next-intl";
import { FAQItem } from "@/data/faq";
import { generalFAQ } from "@/data/faq-content";

interface FAQStructuredDataProps {
  items?: FAQItem[];
}

export default function FAQStructuredData({ items }: FAQStructuredDataProps) {
  const locale = useLocale() as "en" | "fr";
  const faqItems = items ?? generalFAQ;

  const faqData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((item) => ({
      "@type": "Question",
      name: item.question[locale],
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer[locale],
      },
    })),
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
