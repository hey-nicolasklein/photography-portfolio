// Raw Strapi API response types
export type StrapiImage = {
    id: number;
    documentId: string;
    name: string;
    alternativeText: string;
    caption: string;
    width: number;
    height: number;
    url: string;
    ext: string;
    mime: string;
    size: number;
    previewUrl?: string;
    provider?: string;
    provider_metadata?: string;
    hash: string;
    formats?: string;
};

export type StrapiGalleryItem = {
    id: number;
    documentId: string;
    tag: string;
    image: StrapiImage[];
};

export type StrapiPortfolioItem = {
    id: number;
    documentId: string;
    Title: string;
    Description: string;
    FullImage: StrapiImage;
    description?: string;
};

export type StrapiBioItem = {
    id: number;
    documentId: string;
    tags: string;
    title: string;
    description: string;
    profileImage: StrapiImage;
};

// New Story types based on the API response
export type StrapiStory = {
    id: number;
    documentId: string;
    title: string;
    description: string;
    images: StrapiImage[];
    companyLogo?: StrapiImage;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
    locale?: string;
    localizations?: Array<{
        id: number;
        documentId: string;
    }>;
};

// Transformed types for frontend use
export type GalleryItem = {
    id: number;
    src: string;
    alt: string;
    category: string;
};

export type PortfolioItem = {
    id: number;
    title: string;
    category: string;
    image: string;
    alt?: string;
};

export type BioItem = {
    id: number;
    tags: string;
    title: string;
    description: string;
    profileImage: string;
    profileImageAlt: string;
};

// New Story type for frontend use
export type Story = {
    id: number;
    documentId: string;
    title: string;
    description: string;
    images: Array<{
        id: number;
        url: string;
        alt: string;
        width: number;
        height: number;
    }>;
    companyLogo?: {
        url: string;
        alt: string;
        width: number;
        height: number;
    };
    createdAt: string;
};

// Generic Strapi API response
export type StrapiResponse<T> = {
    data: T[];
    meta?: {
        pagination?: {
            page: number;
            pageSize: number;
            pageCount: number;
            total: number;
        };
    };
};
