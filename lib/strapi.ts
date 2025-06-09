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
                cache: "no-store",
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

            return {
                id: item.id,
                src: fullImageUrl,
                alt:
                    item.image[0]?.alternativeText ||
                    item.image[0]?.name ||
                    "Gallery image",
                category: item.tag,
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
                cache: "no-store",
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
            cache: "no-store",
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
        const res = await fetch(`${STRAPI_URL}/api/stories?populate=images`, {
            headers: {
                Authorization: `Bearer ${STRAPI_TOKEN}`,
            },
            cache: "no-store",
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

        return stories.map((story) => ({
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
    } catch (error) {
        console.error("Error fetching stories:", error);
        return [];
    }
}
