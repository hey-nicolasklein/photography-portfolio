import type {
    StrapiGalleryItem,
    StrapiPortfolioItem,
    StrapiBioItem,
    StrapiStory,
    GalleryItem,
    PortfolioItem,
    BioItem,
    Story,
    StrapiResponse,
} from "@/types";

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL;
const STRAPI_TOKEN = process.env.STRAPI_API_TOKEN;

if (!STRAPI_URL) {
    throw new Error("NEXT_PUBLIC_STRAPI_URL environment variable is required");
}

if (!STRAPI_TOKEN) {
    throw new Error("STRAPI_API_TOKEN environment variable is required");
}

// Helper function to construct full image URLs
function getFullImageUrl(url: string): string {
    if (url.startsWith("http")) {
        return url;
    }
    return `${STRAPI_URL}${url}`;
}

// Fetch gallery items from Strapi
export async function getGalleryItems(): Promise<GalleryItem[]> {
    try {
        const res = await fetch(
            `${STRAPI_URL}/api/gallery-items?populate=image`,
            {
                headers: {
                    Authorization: `Bearer ${STRAPI_TOKEN}`,
                },
                next: { revalidate: 300 }, // Cache for 5 minutes
            }
        );

        if (!res.ok) {
            console.error(
                "Failed to fetch gallery items:",
                res.status,
                res.statusText
            );
            return [];
        }

        const json: StrapiResponse<StrapiGalleryItem> = await res.json();
        const galleryItems = json.data || [];

        // Transform and construct full URLs
        return galleryItems.map((item) => {
            const imageUrl = item.image[0]?.url || "/placeholder.svg";
            const fullImageUrl = getFullImageUrl(imageUrl);
            const imageData = item.image[0];

            return {
                id: item.id,
                documentId: item.documentId, // Include documentId for API updates
                src: fullImageUrl,
                alt:
                    imageData?.alternativeText ||
                    imageData?.name ||
                    "Gallery image",
                caption: imageData?.caption || '', // legacy tags
                category: item.tag,
                embeddingDescription: item.embeddingDescription,
            };
        });
    } catch (error) {
        console.error("Error fetching gallery items:", error);
        return [];
    }
}

// Fetch portfolio items from Strapi
export async function getPortfolioItems(): Promise<PortfolioItem[]> {
    try {
        const res = await fetch(
            `${STRAPI_URL}/api/portfolio-items?populate=FullImage`,
            {
                headers: {
                    Authorization: `Bearer ${STRAPI_TOKEN}`,
                },
                next: { revalidate: 300 }, // Cache for 5 minutes
            }
        );

        if (!res.ok) {
            console.error(
                "Failed to fetch portfolio items:",
                res.status,
                res.statusText
            );
            return [];
        }

        const json: StrapiResponse<StrapiPortfolioItem> = await res.json();
        const portfolioItems = json.data || [];

        return portfolioItems.map((item) => ({
            id: item.id,
            title: item.Title,
            category: item.Description,
            image: getFullImageUrl(item.FullImage.url),
            alt: item.description,
        }));
    } catch (error) {
        console.error("Error fetching portfolio items:", error);
        return [];
    }
}

// Fetch bio item from Strapi
export async function getBio(): Promise<BioItem | null> {
    try {
        const res = await fetch(`${STRAPI_URL}/api/bio?populate=profileImage`, {
            headers: {
                Authorization: `Bearer ${STRAPI_TOKEN}`,
            },
            next: { revalidate: 600 }, // Cache for 10 minutes (bio changes less frequently)
        });

        if (!res.ok) {
            console.error("Failed to fetch bio:", res.status, res.statusText);
            return null;
        }

        const json: { data: StrapiBioItem } = await res.json();
        const bioItem = json.data;

        if (!bioItem) {
            return null;
        }

        // Transform and construct full URLs
        const profileImageUrl =
            bioItem.profileImage?.url || "/photographer.png";
        const fullProfileImageUrl = getFullImageUrl(profileImageUrl);

        return {
            id: bioItem.id,
            tags: bioItem.tags,
            title: bioItem.title,
            description: bioItem.description,
            profileImage: fullProfileImageUrl,
            profileImageAlt:
                bioItem.profileImage?.alternativeText ||
                bioItem.profileImage?.name ||
                "Nicolas Klein - Photographer",
        };
    } catch (error) {
        console.error("Error fetching bio:", error);
        return null;
    }
}

// Fetch stories from Strapi
export async function getStories(): Promise<Story[]> {
    try {
        const res = await fetch(`${STRAPI_URL}/api/stories?populate=images&pagination[pageSize]=100`, {
            headers: {
                Authorization: `Bearer ${STRAPI_TOKEN}`,
            },
            next: { revalidate: 300 }, // Cache for 5 minutes
        });

        if (!res.ok) {
            console.error(
                "Failed to fetch stories:",
                res.status,
                res.statusText
            );
            return [];
        }

        const json: StrapiResponse<StrapiStory> = await res.json();
        const stories = json.data || [];

        const transformedStories = stories.map((story) => ({
            id: story.id,
            documentId: story.documentId,
            title: story.title,
            description: story.description,
            images: story.images.map((image) => ({
                id: image.id,
                url: getFullImageUrl(image.url),
                alt: image.alternativeText || image.name || story.title,
                width: image.width,
                height: image.height,
            })),
            createdAt: story.createdAt,
        }));

        return transformedStories.sort((a, b) => {
            const dateA = new Date(a.createdAt).getTime();
            const dateB = new Date(b.createdAt).getTime();
            return dateB - dateA;
        });
    } catch (error) {
        console.error("Error fetching stories:", error);
        return [];
    }
}

// Get all images with metadata for semantic search
export interface ImageMetadata {
    id: string;
    documentId?: string; // Strapi documentId for API updates
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
        console.error("Error fetching all images:", error);
        return [];
    }
}
