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
const defaultOgImage = '/og-default.svg';

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
  
  // Use custom image, generate dynamic one, or fall back to default
  const ogImageUrl = image || 
    `/api/og?title=${encodeURIComponent(title)}&description=${encodeURIComponent(description)}&type=${type}`;

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
          url: defaultOgImage,
          width: 1200,
          height: 630,
          alt: `${title} - Nicolas Klein Photography (Default)`,
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

// Helper function for structured data (JSON-LD)
export function generatePhotographerStructuredData() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Nicolas Klein',
    jobTitle: 'Professional Photographer',
    url: 'https://nicolasklein.photography',
    image: `${baseUrl}/api/og?type=default`,
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