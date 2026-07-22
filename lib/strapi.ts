// Local content data layer.
//
// Content was migrated out of Strapi into static JSON files under `content/`
// (see scripts/export-strapi.ts). These functions keep the exact same names,
// signatures, and return shapes the app already consumed, so no callers needed
// to change — the only difference is the data now comes from the repo instead
// of a live CMS. Images live in `public/images/**` and are served locally.

import type {
    GalleryItem,
    PortfolioItem,
    BioItem,
    Story,
} from "@/types";

import galleryData from "@/content/gallery.json";
import portfolioData from "@/content/portfolio.json";
import bioData from "@/content/bio.json";
import storiesData from "@/content/stories.json";

// Fetch gallery items
export async function getGalleryItems(): Promise<GalleryItem[]> {
    return galleryData as GalleryItem[];
}

// Fetch portfolio items
export async function getPortfolioItems(): Promise<PortfolioItem[]> {
    return portfolioData as PortfolioItem[];
}

// Fetch bio item
export async function getBio(): Promise<BioItem | null> {
    return (bioData as BioItem) ?? null;
}

// Fetch stories (already sorted newest-first at export time)
export async function getStories(): Promise<Story[]> {
    return storiesData as Story[];
}

// Filename of an image path — used to match the same photo across the
// per-category folders (gallery/ vs stories/) it was exported into.
export function imageBasename(path: string): string {
    return (path || "").split("/").pop() || path;
}

// Set of image filenames that already appear inside a story. The gallery grid
// uses this to avoid showing the same photo twice on pages that also render
// stories (15 of the gallery photos are also part of stories).
export async function getStoryImageNames(): Promise<Set<string>> {
    const stories = await getStories();
    const names = new Set<string>();
    for (const story of stories) {
        for (const image of story.images) {
            names.add(imageBasename(image.url));
        }
    }
    return names;
}

// Get all images with metadata for semantic search
export interface ImageMetadata {
    id: string;
    documentId?: string; // Strapi documentId (retained for compatibility)
    title: string;
    description: string;
    url: string;
    category: string;
    alt: string;
    tags?: string[]; // Semantic tags extracted from alt text or caption
    embeddingDescription?: string; // Long description used for semantic search
}

export async function getAllImagesWithMetadata(): Promise<ImageMetadata[]> {
    try {
        const [galleryItems, portfolioItems, stories] = await Promise.all([
            getGalleryItems(),
            getPortfolioItems(),
            getStories(),
        ]);

        const images: ImageMetadata[] = [];

        // Add gallery items
        galleryItems.forEach((item: any) => {
            // Extract tags from caption field first (where we write semantic tags), fallback to alt text
            const captionText = item.caption || '';
            const altText = item.alt || '';

            // Prioritize caption for tags, but also include alt if caption is empty
            const tagsSource = captionText || altText;
            const tags = tagsSource
                ? tagsSource.split(',').map((t: string) => t.trim()).filter((t: string) => t.length > 0 && t.length < 100)
                : [];

            images.push({
                id: `gallery-${item.id}`,
                documentId: item.documentId, // Store for API updates
                title: item.alt || 'Gallery image',
                description: item.category || '',
                url: item.src,
                category: item.category || 'gallery',
                alt: item.alt,
                tags: tags.length > 0 ? tags : undefined,
                embeddingDescription: item.embeddingDescription,
            });
        });

        // Add portfolio items
        portfolioItems.forEach((item) => {
            // Extract tags from alt text or description
            const altOrTitle = item.alt || item.title || '';
            const tags = altOrTitle
                .split(',')
                .map(t => t.trim())
                .filter(t => t.length > 0 && t.length < 50); // Filter out overly long "tags"

            images.push({
                id: `portfolio-${item.id}`,
                title: item.title || 'Portfolio image',
                description: item.category || '',
                url: item.image,
                category: 'portfolio',
                alt: item.alt || item.title,
                tags: tags.length > 0 ? tags : undefined,
            });
        });

        // Add story images
        stories.forEach((story) => {
            story.images.forEach((image, index) => {
                // Extract tags from image alt or story description
                const altText = image.alt || `${story.title} - Image ${index + 1}`;
                const tags = altText
                    .split(',')
                    .map(t => t.trim())
                    .filter(t => t.length > 0 && t.length < 50);

                images.push({
                    id: `story-${story.id}-${image.id}`,
                    title: story.title,
                    description: story.description || '',
                    url: image.url,
                    category: 'story',
                    alt: altText,
                    tags: tags.length > 0 ? tags : undefined,
                });
            });
        });

        return images;
    } catch (error) {
        console.error("Error building image metadata:", error);
        return [];
    }
}
