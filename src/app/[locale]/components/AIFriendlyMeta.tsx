import { useLocale, useTranslations } from 'next-intl';

interface AIFriendlyMetaProps {
  title?: string;
  description?: string;
  type?: 'website' | 'article' | 'service';
  location?: {
    name: string;
    lat: number;
    lon: number;
  };
}

export default function AIFriendlyMeta({ 
  title, 
  description, 
  type = 'website',
  location 
}: AIFriendlyMetaProps) {
  const locale = useLocale();
  const t = useTranslations('seo');

  const defaultTitle = t('title');
  const defaultDescription = t('description');

  return (
    <>
      {/* AI-Friendly Meta Tags */}
      <meta name="description" content={description || defaultDescription} />
      <meta name="keywords" content={t('keywords')} />
      
      {/* Geographic Information for AI */}
      <meta name="geo.region" content="MA" />
      <meta name="geo.country" content="Morocco" />
      {location && (
        <>
          <meta name="geo.position" content={`${location.lat};${location.lon}`} />
          <meta name="geo.placename" content={location.name} />
          <meta name="ICBM" content={`${location.lat}, ${location.lon}`} />
        </>
      )}
      
      {/* Content Classification for AI */}
      <meta name="content-type" content={type} />
      <meta name="audience" content="Adventure tourists, Paragliding enthusiasts" />
      <meta name="category" content="Adventure Tourism, Paragliding, Morocco Travel" />
      
      {/* AI Reading Hints */}
      <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      <meta name="language" content={locale} />
      <meta name="content-language" content={locale} />
      
      {/* Open Graph for AI Understanding */}
      <meta property="og:title" content={title || defaultTitle} />
      <meta property="og:description" content={description || defaultDescription} />
      <meta property="og:type" content={type} />
      <meta property="og:locale" content={locale === 'fr' ? 'fr_FR' : 'en_US'} />
      <meta property="og:site_name" content="FlyMorocco" />
      
      {/* Business Information for AI */}
      <meta name="business:contact_data:country_name" content="Morocco" />
      <meta name="business:contact_data:region" content="Souss-Massa" />
      <meta name="business:contact_data:locality" content="Agadir" />
      <meta name="business:contact_data:phone_number" content={t('business.phone')} />
      <meta name="business:contact_data:email" content={t('business.email')} />
    </>
  );
}