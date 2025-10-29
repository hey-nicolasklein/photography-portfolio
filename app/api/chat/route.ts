import { openai } from '@ai-sdk/openai';
import { streamText, tool, convertToModelMessages } from 'ai';
import { z } from 'zod/v4';
import { getAllImagesWithMetadata } from '@/lib/strapi';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
    try {
        const { messages } = await req.json();

        // Convert UI messages to model messages
        const modelMessages = convertToModelMessages(messages);

        // Fetch all available images
        const allImages = await getAllImagesWithMetadata();

        // Create a simple representation for the AI
        const imageList = allImages.map(img => ({
            id: img.id,
            title: img.title,
            description: img.description,
            category: img.category,
        }));

        const result = streamText({
            model: openai('gpt-4o-mini'),
            messages: modelMessages,
            system: `You are a helpful photography assistant. You can help users find and display photos from their portfolio.

Available images in the portfolio:
${JSON.stringify(imageList, null, 2)}

IMPORTANT: When users ask to see photos, images, pictures, or request any visual content, you MUST use the showImages tool to display them on the canvas. Always use the showImages tool when:
- User asks to "show", "display", "find", "search", or "see" photos/images
- User mentions categories like "wedding", "gallery", "portfolio", "story"
- User wants to filter or browse images

You can filter by:
- Title/name keywords (e.g., "Vinny", "wedding", "portrait")
- Category (gallery, portfolio, story)
- Description keywords

After calling showImages, be conversational and friendly. Explain what images you're showing and why they match the user's request.`,
            tools: {
                showImages: tool({
                    description: 'Display filtered images on the canvas based on search criteria',
                    inputSchema: z.object({
                        query: z.string().describe('Search query to filter images by title, description, or category'),
                        limit: z.number().optional().describe('Maximum number of images to show (default: 20)'),
                    }),
                    execute: async ({ query, limit = 20 }) => {
                        // Simple text-based filtering
                        const queryLower = query.toLowerCase();

                        const filteredImages = allImages.filter(img => {
                            const searchText = `${img.title} ${img.description} ${img.category} ${img.alt || ''}`.toLowerCase();
                            return searchText.includes(queryLower);
                        });

                        const results = filteredImages.slice(0, limit);

                        return {
                            images: results,
                            count: results.length,
                            total: filteredImages.length,
                            query,
                        };
                    },
                }),
                clearCanvas: tool({
                    description: 'Clear all images from the canvas',
                    inputSchema: z.object({}),
                    execute: async () => {
                        return {
                            images: [],
                            count: 0,
                            message: 'Canvas cleared',
                        };
                    },
                }),
            },
        });

        return result.toUIMessageStreamResponse();
    } catch (error) {
        console.error('Error in chat API:', error);
        return new Response(
            JSON.stringify({ error: 'Internal server error' }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
}
