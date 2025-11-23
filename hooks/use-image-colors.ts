import { useState, useEffect } from 'react';

// Client-side cache to avoid re-fetching colors
const colorCache = new Map<string, string[]>();

export function useImageColors(imageUrl: string | undefined) {
    const [colors, setColors] = useState<string[] | undefined>(undefined);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!imageUrl) return;

        // Check cache first
        if (colorCache.has(imageUrl)) {
            setColors(colorCache.get(imageUrl));
            return;
        }

        const fetchColors = async () => {
            setLoading(true);
            setError(null);

            try {
                const response = await fetch(
                    `/api/extract-colors?url=${encodeURIComponent(imageUrl)}`
                );

                if (!response.ok) {
                    throw new Error('Failed to extract colors');
                }

                const data = await response.json();

                if (data.colors && Array.isArray(data.colors)) {
                    setColors(data.colors);
                    if (imageUrl) {
                        colorCache.set(imageUrl, data.colors);
                    }
                }
            } catch (err) {
                console.error('Error fetching colors:', err);
                setError(err instanceof Error ? err.message : 'Unknown error');
            } finally {
                setLoading(false);
            }
        };

        fetchColors();
    }, [imageUrl]);

    return { colors, loading, error };
}

// Batch fetch colors for multiple images
export async function fetchColorsForImages(imageUrls: string[]): Promise<Map<string, string[]>> {
    const results = new Map<string, string[]>();

    // Filter out already cached URLs
    const urlsToFetch = imageUrls.filter(url => !colorCache.has(url));

    // Add cached colors to results
    imageUrls.forEach(url => {
        if (colorCache.has(url)) {
            results.set(url, colorCache.get(url)!);
        }
    });

    // Fetch remaining colors in batches of 5 to avoid overwhelming the server
    const batchSize = 5;
    for (let i = 0; i < urlsToFetch.length; i += batchSize) {
        const batch = urlsToFetch.slice(i, i + batchSize);

        await Promise.all(
            batch.map(async (url) => {
                try {
                    const response = await fetch(
                        `/api/extract-colors?url=${encodeURIComponent(url)}`
                    );

                    if (response.ok) {
                        const data = await response.json();
                        if (data.colors && Array.isArray(data.colors)) {
                            results.set(url, data.colors);
                            colorCache.set(url, data.colors);
                        }
                    }
                } catch (error) {
                    console.error(`Error fetching colors for ${url}:`, error);
                }
            })
        );
    }

    return results;
}
