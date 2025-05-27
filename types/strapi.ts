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
