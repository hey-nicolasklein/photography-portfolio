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
            `${STRAPI_URL}/api/gallery-items?populate=image,darkModeImage`,
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

            const darkImageUrl = item.darkModeImage?.[0]?.url;
            const fullDarkImageUrl = darkImageUrl ? getFullImageUrl(darkImageUrl) : undefined;

            return {
                id: item.id,
                src: fullImageUrl,
                srcDark: fullDarkImageUrl,
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
            `${STRAPI_URL}/api/portfolio-items?populate=FullImage,FullImageDarkMode`,
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
            imageDark: item.FullImageDarkMode?.url ? getFullImageUrl(item.FullImageDarkMode.url) : undefined,
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
        const res = await fetch(`${STRAPI_URL}/api/bio?populate=profileImage,profileImageDarkMode`, {
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

        const profileImageDarkUrl = bioItem.profileImageDarkMode?.url;
        const fullProfileImageDarkUrl = profileImageDarkUrl ? getFullImageUrl(profileImageDarkUrl) : undefined;

        return {
            id: bioItem.id,
            tags: bioItem.tags,
            title: bioItem.title,
            description: bioItem.description,
            profileImage: fullProfileImageUrl,
            profileImageDark: fullProfileImageDarkUrl,
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
        const res = await fetch(`${STRAPI_URL}/api/stories?populate=images,darkModeImages,companyLogo,companyLogoDarkMode&pagination[pageSize]=100`, {
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

        return stories.map((story) => ({
            id: story.id,
            documentId: story.documentId,
            title: story.title,
            description: story.description,
            images: story.images.map((image, index) => {
                const darkImage = story.darkModeImages?.[index];
                return {
                    id: image.id,
                    url: getFullImageUrl(image.url),
                    urlDark: darkImage?.url ? getFullImageUrl(darkImage.url) : undefined,
                    alt: image.alternativeText || image.name || story.title,
                    width: image.width,
                    height: image.height,
                };
            }),
            companyLogo: story.companyLogo ? {
                url: getFullImageUrl(story.companyLogo.url),
                urlDark: story.companyLogoDarkMode?.url ? getFullImageUrl(story.companyLogoDarkMode.url) : undefined,
                alt: story.companyLogo.alternativeText || story.companyLogo.name || `${story.title} logo`,
                width: story.companyLogo.width,
                height: story.companyLogo.height,
            } : undefined,
            createdAt: story.createdAt,
        }));
    } catch (error) {
        console.error("Error fetching stories:", error);
        return [];
    }
}
