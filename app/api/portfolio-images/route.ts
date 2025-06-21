import { NextResponse } from "next/server";
import { getGalleryItems, getPortfolioItems } from "@/lib/strapi";

// Simple in-memory cache to avoid fetching same data repeatedly
let cachedAllItems: any[] | null = null;
let lastFetchTime = 0;
const CACHE_DURATION = 60000; // 1 minute

async function getAllItems() {
    const now = Date.now();
    
    // Return cached items if still fresh
    if (cachedAllItems && (now - lastFetchTime) < CACHE_DURATION) {
        return cachedAllItems;
    }
    
    // Fetch fresh data
    const [galleryItems, portfolioItems] = await Promise.all([
        getGalleryItems(),
        getPortfolioItems()
    ]);

    // Combine items with simple ID strategy
    const allItems = [
        ...galleryItems.map(item => ({
            id: item.id,
            src: item.src,
            alt: item.alt,
            category: item.category || 'gallery'
        })),
        ...portfolioItems.map(item => ({
            id: item.id + 10000, // Simple offset to avoid conflicts
            src: item.image,
            alt: item.alt || item.title,
            category: item.category || 'portfolio'
        }))
    ];

    // Remove duplicates based on src URL
    const uniqueItems = allItems.filter((item, index, self) => 
        index === self.findIndex(i => i.src === item.src)
    );

    // Simple shuffle - no need for seeded complexity
    const shuffledItems = [...uniqueItems].sort(() => Math.random() - 0.5);
    
    // Cache results
    cachedAllItems = shuffledItems;
    lastFetchTime = now;
    
    return shuffledItems;
}

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    
    try {
        const allItems = await getAllItems();
        
        // Simple pagination
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        
        // Return empty if beyond available items
        if (startIndex >= allItems.length) {
            return NextResponse.json([]);
        }
        
        const paginatedItems = allItems.slice(startIndex, endIndex);
        return NextResponse.json(paginatedItems);
        
    } catch (error) {
        console.error('Error fetching images:', error);
        return NextResponse.json([], { status: 500 });
    }
}
