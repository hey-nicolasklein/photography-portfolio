import { NextResponse } from "next/server";
import { getAllImagesWithMetadata, ImageMetadata } from "@/lib/strapi";
import type { GalleryItem } from "@/types";

// Allow longer duration for semantic search processing
export const maxDuration = 30;

// Simple in-memory cache to avoid fetching same data repeatedly
let cachedAllImages: ImageMetadata[] | null = null;
let lastFetchTime = 0;
const CACHE_DURATION = 60000; // 1 minute

async function getAllImages() {
    const now = Date.now();
    
    // Return cached images if still fresh
    if (cachedAllImages && (now - lastFetchTime) < CACHE_DURATION) {
        return cachedAllImages;
    }
    
    // Fetch fresh data
    const images = await getAllImagesWithMetadata();
    
    // Cache results
    cachedAllImages = images;
    lastFetchTime = now;
    
    return images;
}

// Semantic keyword mappings for common concepts
const semanticMappings: Record<string, string[]> = {
    'evening': ['evening', 'sunset', 'dusk', 'twilight', 'golden hour', 'golden hour', 'abend', 'abendstimmung'],
    'sunset': ['sunset', 'evening', 'dusk', 'twilight', 'golden hour', 'sonnenuntergang', 'abendrot'],
    'morning': ['morning', 'sunrise', 'dawn', 'morgen'],
    'portrait': ['portrait', 'portrait', 'person', 'people', 'human', 'face', 'porträt'],
    'wedding': ['wedding', 'wedding', 'marriage', 'bride', 'groom', 'h wedding', 'hochzeit'],
    'nature': ['nature', 'outdoor', 'landscape', 'landscape', 'nature', 'natural', 'natur'],
    'celebration': ['celebration', 'party', 'festival', 'fest', 'happiness', 'joy', 'feier'],
    'sports': ['sports', 'sport', 'football', 'fußball', 'soccer', 'athletic', 'sport'],
    'festival': ['festival', 'fest', 'event', 'celebration', 'party'],
};

function performSemanticSearch(images: ImageMetadata[], query: string): ImageMetadata[] {
    if (!query || query.trim().length === 0) {
        return images;
    }

    const queryLower = query.toLowerCase().trim();
    const queryTerms = queryLower.split(/\s+/);

    // Expand query with semantic synonyms
    const expandedTerms = new Set(queryTerms);
    for (const term of queryTerms) {
        const synonyms = semanticMappings[term] || [];
        synonyms.forEach(syn => expandedTerms.add(syn));
    }

    // Score images based on semantic relevance
    const scoredImages = images.map(img => {
        const searchText = `${img.title} ${img.description} ${img.category} ${img.alt || ''} ${img.embeddingDescription || ''}`.toLowerCase();
        const tagsText = (img.tags || []).join(' ').toLowerCase();
        
        let score = 0;
        
        // Tag matches get highest priority (15 points)
        if (img.tags && img.tags.length > 0) {
            for (const term of queryTerms) {
                const matchingTag = img.tags.find(tag => 
                    tag.toLowerCase().includes(term) || term.includes(tag.toLowerCase())
                );
                if (matchingTag) {
                    score += 15; // Tags are highly relevant
                }
            }
            
            // Semantic tag matches
            for (const term of expandedTerms) {
                if (tagsText.includes(term)) {
                    score += 8; // Semantic tag matches
                }
            }
        }
        
        // Exact match gets high score
        if (searchText.includes(queryLower)) {
            score += 10;
        }
        
        // Partial word matches in text
        for (const term of queryTerms) {
            if (searchText.includes(term)) {
                score += 5;
            }
        }
        
        // Semantic/synonym matches in text
        for (const term of expandedTerms) {
            if (searchText.includes(term) && !queryTerms.includes(term)) {
                score += 3;
            }
        }
        
        // Category match boost
        if (img.category && queryLower.includes(img.category.toLowerCase())) {
            score += 4;
        }
        
        return { image: img, score };
    });

    // Sort by score and filter out zero scores
    const filteredImages = scoredImages
        .filter(item => item.score > 0)
        .sort((a, b) => b.score - a.score)
        .map(item => item.image);

    return filteredImages;
}

function convertToGalleryItem(image: ImageMetadata): GalleryItem {
    return {
        id: image.id,
        src: image.url,
        alt: image.alt,
        category: image.category,
        embeddingDescription: image.embeddingDescription,
    };
}

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query') || '';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    
    try {
        const allImages = await getAllImages();
        
        let filteredImages: ImageMetadata[];
        
        if (query.trim().length === 0) {
            // No query - return shuffled images like the original endpoint
            const shuffled = [...allImages].sort(() => Math.random() - 0.5);
            filteredImages = shuffled;
        } else {
            // Perform semantic search
            filteredImages = performSemanticSearch(allImages, query);
        }
        
        // Pagination
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        
        // Return empty if beyond available items
        if (startIndex >= filteredImages.length) {
            return NextResponse.json([]);
        }
        
        const paginatedImages = filteredImages.slice(startIndex, endIndex);
        const galleryItems = paginatedImages.map(convertToGalleryItem);
        
        return NextResponse.json(galleryItems);
        
    } catch (error) {
        console.error('Error in search-images API:', error);
        return NextResponse.json([], { status: 500 });
    }
}

