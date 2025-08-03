import type { Metadata } from 'next';

interface OpenGraphConfig {
  title: string;
  description: string;
  path?: string;
  type?: 'default' | 'portfolio';
  image?: string;
  noIndex?: boolean;
}

const baseUrl = 'https://nicolasklein.photography';
const defaultOgImage = '/og_hero.png';
const fallbackOgImage = '/og-default.svg';

export function generateMetadata({
  title,
  description,
  path = '',
  type = 'default',
  image,
  noIndex = false,
}: OpenGraphConfig): Metadata {
  const fullTitle = path === '' ? title : `${title} | Nicolas Klein Photography`;
  const url = `${baseUrl}${path}`;
  
  // Use custom image, default to static hero image, or generate dynamic one as fallback
  const ogImageUrl = image || defaultOgImage;

  const metadata: Metadata = {
    title: fullTitle,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      type: 'website',
      locale: 'de_DE',
      url,
      siteName: 'Nicolas Klein Photography',
      title: fullTitle,
      description,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: `${title} - Nicolas Klein Photography`,
        },
        {
          url: fallbackOgImage,
          width: 1200,
          height: 630,
          alt: `${title} - Nicolas Klein Photography (Fallback)`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [ogImageUrl],
      creator: '@hey.nicolasklein',
      site: '@hey.nicolasklein',
    },
  };

  if (noIndex) {
    metadata.robots = {
      index: false,
      follow: true,
    };
  }

  return metadata;
}

// Helper function to generate metadata with only the static default image
export function generateStaticMetadata({
  title,
  description,
  path = '',
  noIndex = false,
}: Omit<OpenGraphConfig, 'type' | 'image'>): Metadata {
  return generateMetadata({
    title,
    description,
    path,
    image: defaultOgImage,
    noIndex,
  });
}

// Helper function to generate metadata with dynamic OG image (for special cases)
export function generateDynamicMetadata({
  title,
  description,
  path = '',
  type = 'default',
  noIndex = false,
}: Omit<OpenGraphConfig, 'image'>): Metadata {
  const dynamicImage = `/api/og?title=${encodeURIComponent(title)}&description=${encodeURIComponent(description)}&type=${type}`;
  return generateMetadata({
    title,
    description,
    path,
    image: dynamicImage,
    noIndex,
    type,
  });
}

// Helper function for structured data (JSON-LD)
export function generatePhotographerStructuredData() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Nicolas Klein',
    jobTitle: 'Professional Photographer',
    url: 'https://nicolasklein.photography',
    image: `${baseUrl}${defaultOgImage}`,
    description: 'Professioneller Fotograf in Saarbrücken. Spezialisiert auf Porträts und Event-Fotografie.',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Saarbrücken',
      addressCountry: 'DE',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      email: 'hello@nicolasklein.photography',
      contactType: 'customer service',
    },
    sameAs: [
      'https://www.instagram.com/hey.nicolasklein/',
    ],
  };
} 