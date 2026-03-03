import { useTranslations } from "next-intl";
import { FAQItem } from "@/data/faq";

interface FAQStructuredDataProps {
  items?: FAQItem[];
}

export default function FAQStructuredData({ items }: FAQStructuredDataProps) {
  const t = useTranslations("faq");
  const faqItems = items ?? (t.raw("items") as FAQItem[]);

  const faqData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
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
