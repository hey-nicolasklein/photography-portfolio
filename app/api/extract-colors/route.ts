import { NextResponse } from "next/server";
import { Vibrant } from "node-vibrant/node";

// In-memory cache for color extraction results
const colorCache = new Map<string, string[]>();
const CACHE_MAX_SIZE = 1000; // Limit cache size

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const imageUrl = searchParams.get('url');

    if (!imageUrl) {
        return NextResponse.json(
            { error: 'Image URL is required' },
            { status: 400 }
        );
    }

    try {
        // Check cache first
        if (colorCache.has(imageUrl)) {
            return NextResponse.json({ colors: colorCache.get(imageUrl) });
        }

        // Extract colors using Vibrant
        const palette = await Vibrant.from(imageUrl).getPalette();

        // Extract hex colors from palette, filtering out null values
        const colors: string[] = [];

        // Priority order: Vibrant, DarkVibrant, LightVibrant, Muted, DarkMuted, LightMuted
        const swatchOrder = [
            'Vibrant',
            'DarkVibrant',
            'LightVibrant',
            'Muted',
            'DarkMuted',
            'LightMuted'
        ] as const;

        for (const swatchName of swatchOrder) {
            const swatch = palette[swatchName];
            if (swatch) {
                colors.push(swatch.hex);
            }
        }

        // Ensure we have at least some colors
        if (colors.length === 0) {
            return NextResponse.json(
                { error: 'Could not extract colors from image' },
                { status: 500 }
            );
        }

        // Limit to top 5 colors for UI clarity
        const limitedColors = colors.slice(0, 5);

        // Cache the result (with size limit)
        if (colorCache.size >= CACHE_MAX_SIZE) {
            // Remove oldest entry
            const firstKey = colorCache.keys().next().value;
            if (firstKey !== undefined) {
                colorCache.delete(firstKey);
            }
        }
        colorCache.set(imageUrl, limitedColors);

        return NextResponse.json({ colors: limitedColors });

    } catch (error) {
        console.error('Error extracting colors:', error);
        return NextResponse.json(
            { error: 'Failed to extract colors from image' },
            { status: 500 }
        );
    }
}
