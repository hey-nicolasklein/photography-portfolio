#!/usr/bin/env tsx
/**
 * Script to generate and save embeddingDescription for gallery items in Strapi
 * Uses AI to analyze existing metadata (and optionally vision) to produce a long description
 * 
 * Usage: 
 *   pnpm tsx scripts/add-semantic-tags.ts [--vision] [--dry-run]
 * 
 * Options:
 *   --vision: Use GPT-4 Vision to analyze actual images (slower, more accurate)
 *   --dry-run: Show what would be updated without actually updating Strapi
 */

// Load environment variables FIRST before any other imports
import { config } from 'dotenv';
import { resolve } from 'path';

// Load .env.local first, then .env (local takes precedence)
const envPath = resolve(process.cwd(), '.env.local');
const envDefaultPath = resolve(process.cwd(), '.env');
config({ path: envPath });
config({ path: envDefaultPath });

import { openai } from '@ai-sdk/openai';
import { generateObject, generateText } from 'ai';
import { z } from 'zod/v4';

// We'll use dynamic import in main() to ensure env vars are loaded first

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL;
const STRAPI_TOKEN = process.env.STRAPI_API_TOKEN;

const USE_VISION = process.argv.includes('--vision');
const DRY_RUN = process.argv.includes('--dry-run');

if (!STRAPI_URL || !STRAPI_TOKEN) {
    console.error('Missing required environment variables: NEXT_PUBLIC_STRAPI_URL, STRAPI_API_TOKEN');
    process.exit(1);
}

// Schema for concise, mappable description
const EmbeddingDescriptionSchema = z.object({
    embeddingDescription: z.string().describe('One sentence, clear image description (120-220 characters). Include key subject(s), setting/location, time of day/lighting, and mood. No lists, no line breaks, no extra commentary.'),
});

function compactAndLimit(input: string, maxLen = 200): string {
    const singleLine = (input || '').replace(/\s+/g, ' ').trim();
    if (singleLine.length <= maxLen) return singleLine;
    // Trim without breaking words
    let cut = singleLine.slice(0, maxLen);
    const lastSpace = cut.lastIndexOf(' ');
    if (lastSpace > 100) cut = cut.slice(0, lastSpace);
    return cut.replace(/[.,;:!?\-\s]*$/, '');
}

async function generateDescriptionFromMetadata(metadata: { title?: string; description?: string; alt?: string; category?: string }): Promise<string> {
    try {
        const result = await generateObject({
            model: openai('gpt-5-nano'),
            schema: EmbeddingDescriptionSchema,
            prompt: `Write ONE sentence (120-200 characters) that clearly describes the photo for semantic search.

Metadata:
- Title: ${metadata.title || 'N/A'}
- Alt: ${metadata.alt || 'N/A'}
- Category: ${metadata.category || 'N/A'}

Rules:
- Include: key subject(s), setting/location, time of day or lighting, mood.
- No lists. No line breaks. No prefixes. No hashtags.
- Prefer concise, concrete wording.`,
        });
        const value = (result as any)?.object?.embeddingDescription;
        if (typeof value === 'string' && value.trim().length > 0) return compactAndLimit(value, 200);
        // Fallback: attempt text-based generation if object missing
        const textRes = await generateText({
            model: openai('gpt-5-nano'),
            prompt: `ONE sentence (120-200 chars) clear image description for semantic search. Include subject, setting, time/lighting, mood. No line breaks.\nTitle: ${metadata.title || 'N/A'}\nAlt: ${metadata.alt || 'N/A'}\nCategory: ${metadata.category || 'N/A'}`,
        });
        return compactAndLimit(textRes.text, 200);
    } catch (error) {
        console.error(`Error generating description from metadata:`, error);
        try {
            const textRes = await generateText({
                model: openai('gpt-5-nano'),
                prompt: `ONE sentence (120-200 chars) clear image description. Include subject, setting, time/lighting, mood. No line breaks.\nTitle: ${metadata.title || 'N/A'}\nAlt: ${metadata.alt || 'N/A'}\nCategory: ${metadata.category || 'N/A'}`,
            });
            return compactAndLimit(textRes.text, 200);
        } catch (e) {
            return [metadata.title, metadata.description, metadata.alt, metadata.category]
                .filter(Boolean)
                .join(' ') || 'Photograph';
        }
    }
}

async function generateDescriptionFromVision(imageUrl: string, metadata: { title?: string; description?: string; alt?: string; category?: string }): Promise<string> {
    try {
        // Vision-based description
        const result = await generateObject({
            model: openai('gpt-5-nano'),
            schema: EmbeddingDescriptionSchema,
            messages: [
                {
                    role: 'user',
                    content: [
                        {
                            type: 'text',
                            text: `Analyze this photograph and write ONE sentence (120-200 characters) that clearly describes it for semantic search.

Existing metadata:
- Title: ${metadata.title || 'N/A'}
- Alt: ${metadata.alt || 'N/A'}
- Category: ${metadata.category || 'N/A'}

Rules:
- Include: key subject(s), setting/location, time of day or lighting, mood.
- No lists. No line breaks. No prefixes.`,
                        },
                        ({
                            type: 'image',
                            image: imageUrl,
                            detail: 'low',
                        } as any),
                    ],
                },
            ],
        });
        const value = (result as any)?.object?.embeddingDescription;
        if (typeof value === 'string' && value.trim().length > 0) return compactAndLimit(value, 200);
        // Fallback to text-only if parsing failed
        const textRes = await generateText({
            model: openai('gpt-5-nano'),
            prompt: `ONE sentence (120-200 chars) clear image description for semantic search. Include subject, setting, time/lighting, mood. No line breaks.\nImage URL: ${imageUrl}\nTitle: ${metadata.title || 'N/A'}\nAlt: ${metadata.alt || 'N/A'}\nCategory: ${metadata.category || 'N/A'}`,
        });
        return compactAndLimit(textRes.text, 200);
    } catch (error) {
        console.error(`Error generating description from vision:`, error);
        // Fallback to metadata-based generation
        try {
            return compactAndLimit(await generateDescriptionFromMetadata(metadata), 200);
        } catch (e) {
            // Last resort
            return [metadata.title, metadata.description, metadata.alt, metadata.category]
                .filter(Boolean)
                .join(' ') || 'Photograph';
        }
    }
}

type GalleryItemForUpdate = { id: number; documentId?: string; tag: string; image: Array<{ id: number; name: string; url: string; alternativeText?: string }>; embeddingDescription?: string };

async function fetchAllGalleryItems(): Promise<Array<GalleryItemForUpdate>> {
    const items: Array<GalleryItemForUpdate> = [];
    let page = 1;
    const pageSize = 100;
    while (true) {
        const res = await fetch(`${STRAPI_URL}/api/gallery-items?populate=image&fields[0]=documentId&fields[1]=tag&pagination[page]=${page}&pagination[pageSize]=${pageSize}`,
            { headers: { Authorization: `Bearer ${STRAPI_TOKEN}` } });
        if (!res.ok) break;
        const json = await res.json();
        const data = Array.isArray(json?.data) ? json.data : [];
        if (data.length === 0) break;
        for (const raw of data) {
            // Support both flat and nested shapes (Strapi v5 returns nested under attributes)
            const attrs = raw.attributes || raw;
            const imageData = attrs.image?.data
                ? Array.isArray(attrs.image.data)
                    ? attrs.image.data.map((n: any) => ({ id: n.id, ...n.attributes }))
                    : [{ id: attrs.image.data.id, ...(attrs.image.data.attributes || {}) }]
                : (Array.isArray(raw.image) ? raw.image : []);

            items.push({
                id: raw.id,
                documentId: raw.documentId || attrs.documentId,
                tag: attrs.tag ?? raw.tag,
                embeddingDescription: attrs.embeddingDescription ?? raw.embeddingDescription,
                image: (imageData || []).map((img: any) => ({
                    id: img.id,
                    name: img.name,
                    url: img.url,
                    alternativeText: img.alternativeText,
                })),
            });
        }
        if (data.length < pageSize) break;
        page++;
        if (page > 1000) break;
    }
    return items;
}

async function updateGalleryItemEmbeddingDescription(identifier: string | number, text: string): Promise<boolean> {
    try {
        const url = `${STRAPI_URL}/api/gallery-items/${encodeURIComponent(String(identifier))}`;
        console.log(`   🔗 Updating: ${url}`);
        // Use PUT with documentId for Strapi v5 partial update on collection type
        const res = await fetch(url, {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${STRAPI_TOKEN}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ data: { embeddingDescription: text } }),
        });
        if (!res.ok) {
            const msg = await res.text();
            console.error(`   ❌ Failed to update gallery-item ${String(identifier)}: ${res.status} ${msg.substring(0, 200)}`);
            return false;
        }
        console.log(`   ✅ Saved embeddingDescription on gallery-item ${String(identifier)}`);
        return true;
    } catch (e) {
        console.error(`   ❌ Network error updating gallery-item ${String(identifier)}:`, e);
        return false;
    }
}

async function main() {
    console.log('🚀 Starting embeddingDescription generation for gallery items...\n');

    // Fetch all gallery items with images
    console.log('📥 Fetching gallery items from Strapi...');
    const allItems = await fetchAllGalleryItems();

    // Deduplicate by base name of the first image to avoid repeats across multiple assets
    const baseName = (name: string) => (name || '').replace(/\.[^.]+$/, '');
    const seen = new Set<string>();
    const itemsToProcess: GalleryItemForUpdate[] = [];
    for (const item of allItems) {
        const first = item.image?.[0];
        const key = (first ? baseName(first.name) : `item-${item.id}`).toLowerCase();
        if (seen.has(key)) continue;
        seen.add(key);
        itemsToProcess.push(item);
    }

    console.log(`🧹 Deduplicated to ${itemsToProcess.length} gallery items by base image name.`);

    let processed = 0;
    let failed = 0;
    const updatedItemIds: number[] = [];

    // Process one at a time to ensure each is completed before moving on
    for (const item of itemsToProcess) {
        try {
            console.log(`\n🖼️  [${processed + failed + 1}/${itemsToProcess.length}] Processing gallery-item ${item.id} (${item.image?.[0]?.name || 'no-image'})`);

            // Skip if already has embeddingDescription
            if (item.embeddingDescription && item.embeddingDescription.trim().length > 0) {
                console.log(`   ⏭️  Skipping: embeddingDescription already present`);
                continue;
            }

            // Optional: sanity check that item exists server-side to avoid 404 surprises
            try {
                const checkUrl = `${STRAPI_URL}/api/gallery-items/${encodeURIComponent(String(item.documentId || item.id))}`;
                const checkRes = await fetch(checkUrl, { headers: { Authorization: `Bearer ${STRAPI_TOKEN}` } });
                if (checkRes.status === 404) {
                    console.warn(`   ⚠️  GET ${checkUrl} returned 404 (not found). Skipping.`);
                    failed++;
                    continue;
                }
            } catch {}

            const img = item.image?.[0];
            const imageUrl = img?.url ? (img.url.startsWith('http') ? img.url : `${STRAPI_URL}${img.url}`) : '';
            const description = USE_VISION && imageUrl
                ? await generateDescriptionFromVision(imageUrl, {
                    title: img?.name,
                    description: img?.alternativeText,
                    alt: img?.alternativeText,
                    category: item.tag,
                })
                : await generateDescriptionFromMetadata({
                    title: img?.name,
                    description: '',
                    alt: img?.alternativeText,
                    category: item.tag,
                });

            console.log(`   ✅ Generated embeddingDescription (${Math.min(description.length, 80)} chars preview): ${description.slice(0, 80)}${description.length > 80 ? '…' : ''}`);

            const identifier = item.documentId || item.id;
            const success = DRY_RUN ? true : await updateGalleryItemEmbeddingDescription(identifier, description);
            
            if (success) {
                processed++;
                updatedItemIds.push(item.id);
                console.log(`   ✅ Successfully updated gallery-item ${item.id}`);
            } else {
                failed++;
                console.log(`   ❌ Failed to update gallery-item ${item.id}`);
            }

            // Rate limiting - wait 2-3 seconds between requests
            await new Promise(resolve => setTimeout(resolve, USE_VISION ? 3000 : 2000));
        } catch (error) {
            console.error(`   ❌ Error processing item ${item.id}:`, error);
            failed++;
        }
    }

    console.log(`\n\n✅ Complete!`);
    console.log(`   Successfully updated: ${processed}`);
    console.log(`   Failed: ${failed}`);
    console.log(`   Total processed: ${itemsToProcess.length}`);
    
    if (updatedItemIds.length > 0) {
        console.log(`\n📝 Updated Gallery Items:`);
        updatedItemIds.forEach((id, index) => {
            console.log(`   ${index + 1}. id=${id}`);
        });
    }
    
    return updatedItemIds;
}

// Run if called directly
if (require.main === module) {
    main().catch(console.error);
}

export { generateDescriptionFromMetadata, generateDescriptionFromVision, updateGalleryItemEmbeddingDescription };

