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
            model: openai('gpt-5-nano'),
            messages: modelMessages,
            system: `You are a helpful photography assistant with semantic understanding capabilities. You can help users find and display photos from their portfolio.

Available images in the portfolio:
${JSON.stringify(imageList, null, 2)}

IMPORTANT: When users ask to see photos, images, pictures, or request any visual content, you MUST use the showImages tool to display them on the canvas. Always use the showImages tool when:
- User asks to "show", "display", "find", "search", or "see" photos/images
- User mentions categories like "wedding", "gallery", "portfolio", "story"
- User wants to filter or browse images

SEMANTIC UNDERSTANDING: The showImages tool supports semantic search. When users ask for:
- "evening" photos → think about: sunset, dusk, twilight, golden hour, abend, abendstimmung
- "happiness" or "joy" → think about: celebration, party, festival, smiling, laughter
- "nature" → think about: outdoor, landscape, natural, environment
- "sports" → think about: athletic, football, soccer, competition, game
Use your understanding to expand queries semantically. For example, if a user asks for "evening photos", you might search for terms like "sunset", "dusk", "twilight", "golden hour" in addition to "evening".

STRATEGY: 
1. Understand the user's intent semantically
2. Construct a comprehensive query that includes related terms and synonyms
3. Pass this expanded query to showImages tool
4. The tool will score and rank images based on semantic relevance

After calling showImages, be conversational and friendly. Explain what images you're showing and why they match the user's request semantically.`,
            tools: {
                showImages: tool({
                    description: 'Display filtered images using semantic search. Accepts both literal and conceptual queries. For best results, include related terms and synonyms in the query (e.g., for "evening" include "sunset dusk twilight golden hour"). The tool will score images based on semantic relevance.',
                    inputSchema: z.object({
                        query: z.string().describe('Search query with semantic terms. Can include multiple related keywords. Example: "evening sunset dusk golden hour abend" for evening photos, or "happiness joy celebration party" for joyful images'),
                        limit: z.number().optional().describe('Maximum number of images to show (default: 20)'),
                    }),
                    execute: async ({ query, limit = 20 }) => {
                        // Semantic matching: use the LLM context to understand relationships
                        // Since we're in a tool execute function, we'll use fuzzy semantic matching
                        const queryLower = query.toLowerCase();
                        const queryTerms = queryLower.split(/\s+/);

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

                        // Expand query with semantic synonyms
                        const expandedTerms = new Set(queryTerms);
                        for (const term of queryTerms) {
                            const synonyms = semanticMappings[term] || [];
                            synonyms.forEach(syn => expandedTerms.add(syn));
                        }

                        // Score images based on semantic relevance
                        const scoredImages = allImages.map(img => {
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
