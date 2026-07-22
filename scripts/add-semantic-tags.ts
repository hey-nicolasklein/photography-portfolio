#!/usr/bin/env tsx
/**
 * Generate and save `embeddingDescription` for gallery items in the local
 * content store (content/gallery.json). Uses AI to analyze existing metadata
 * (and optionally the actual image via vision) to produce a short description
 * used for semantic search.
 *
 * This used to write back to Strapi; after the migration to git-based content
 * it reads and writes content/gallery.json directly, and vision reads the
 * downsized local images from public/images/**.
 *
 * Usage:
 *   pnpm tsx scripts/add-semantic-tags.ts [--vision] [--dry-run] [--force]
 *
 * Options:
 *   --vision:  Use vision to analyze the actual image (slower, more accurate)
 *   --dry-run: Show what would change without writing content/gallery.json
 *   --force:   Regenerate even for items that already have an embeddingDescription
 */

// Load environment variables FIRST before any other imports
import { config } from 'dotenv';
import { resolve } from 'path';
import { readFile, writeFile } from 'fs/promises';

// Load .env.local first, then .env (local takes precedence)
config({ path: resolve(process.cwd(), '.env.local') });
config({ path: resolve(process.cwd(), '.env') });

import { openai } from '@ai-sdk/openai';
import { generateObject, generateText } from 'ai';
import { z } from 'zod/v4';

const USE_VISION = process.argv.includes('--vision');
const DRY_RUN = process.argv.includes('--dry-run');
const FORCE = process.argv.includes('--force');

if (!process.env.OPENAI_API_KEY) {
    console.error('Missing required environment variable: OPENAI_API_KEY');
    process.exit(1);
}

const GALLERY_PATH = resolve(process.cwd(), 'content', 'gallery.json');
const PUBLIC_DIR = resolve(process.cwd(), 'public');

// Shape of a gallery item in content/gallery.json
type GalleryItem = {
    id: number;
    documentId?: string;
    src: string;
    alt: string;
    caption?: string;
    category: string;
    embeddingDescription?: string;
};

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

type GenMetadata = { title?: string; description?: string; alt?: string; category?: string };

function metadataBlock(metadata: GenMetadata): string {
    return `- Title: ${metadata.title || 'N/A'}
- Alt: ${metadata.alt || 'N/A'}
- Category: ${metadata.category || 'N/A'}
- Tags/Caption: ${metadata.description || 'N/A'}`;
}

async function generateDescriptionFromMetadata(metadata: GenMetadata): Promise<string> {
    try {
        const result = await generateObject({
            model: openai('gpt-5-nano'),
            schema: EmbeddingDescriptionSchema,
            prompt: `Write ONE sentence (120-200 characters) that clearly describes the photo for semantic search.

Metadata:
${metadataBlock(metadata)}

Rules:
- Include: key subject(s), setting/location, time of day or lighting, mood.
- Draw on the Tags/Caption for concrete details (subjects, colors, location).
- No lists. No line breaks. No prefixes. No hashtags.
- Prefer concise, concrete wording.`,
        });
        const value = (result as any)?.object?.embeddingDescription;
        if (typeof value === 'string' && value.trim().length > 0) return compactAndLimit(value, 200);
        // Fallback: attempt text-based generation if object missing
        const textRes = await generateText({
            model: openai('gpt-5-nano'),
            prompt: `ONE sentence (120-200 chars) clear image description for semantic search. Include subject, setting, time/lighting, mood. No line breaks.\n${metadataBlock(metadata)}`,
        });
        return compactAndLimit(textRes.text, 200);
    } catch (error) {
        console.error(`Error generating description from metadata:`, error);
        try {
            const textRes = await generateText({
                model: openai('gpt-5-nano'),
                prompt: `ONE sentence (120-200 chars) clear image description. Include subject, setting, time/lighting, mood. No line breaks.\n${metadataBlock(metadata)}`,
            });
            return compactAndLimit(textRes.text, 200);
        } catch (e) {
            return [metadata.title, metadata.description, metadata.alt, metadata.category]
                .filter(Boolean)
                .join(' ') || 'Photograph';
        }
    }
}

async function generateDescriptionFromVision(imageData: Uint8Array, metadata: GenMetadata): Promise<string> {
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
${metadataBlock(metadata)}

Rules:
- Include: key subject(s), setting/location, time of day or lighting, mood.
- No lists. No line breaks. No prefixes.`,
                        },
                        ({
                            type: 'image',
                            image: imageData,
                            detail: 'low',
                        } as any),
                    ],
                },
            ],
        });
        const value = (result as any)?.object?.embeddingDescription;
        if (typeof value === 'string' && value.trim().length > 0) return compactAndLimit(value, 200);
        // Fallback to metadata-only if parsing failed
        return compactAndLimit(await generateDescriptionFromMetadata(metadata), 200);
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

async function readGallery(): Promise<GalleryItem[]> {
    const raw = await readFile(GALLERY_PATH, 'utf8');
    const data = JSON.parse(raw);
    if (!Array.isArray(data)) throw new Error('content/gallery.json is not an array');
    return data as GalleryItem[];
}

async function writeGallery(items: GalleryItem[]): Promise<void> {
    await writeFile(GALLERY_PATH, `${JSON.stringify(items, null, 2)}\n`, 'utf8');
}

async function loadLocalImage(src: string): Promise<Uint8Array | null> {
    try {
        // src looks like "/images/gallery/foo.webp" → public/images/gallery/foo.webp
        const filePath = resolve(PUBLIC_DIR, src.replace(/^\//, ''));
        return new Uint8Array(await readFile(filePath));
    } catch (e) {
        console.warn(`   ⚠️  Could not read local image ${src}:`, e instanceof Error ? e.message : e);
        return null;
    }
}

async function main() {
    console.log('🚀 Generating embeddingDescription for gallery items (local)...\n');

    const items = await readGallery();
    console.log(`📥 Loaded ${items.length} gallery items from content/gallery.json\n`);

    let processed = 0;
    let skipped = 0;
    let failed = 0;
    let changed = false;

    for (let i = 0; i < items.length; i++) {
        const item = items[i];
        console.log(`🖼️  [${i + 1}/${items.length}] gallery-item ${item.id} (${item.src.split('/').pop()})`);

        // Skip if already has embeddingDescription (unless --force)
        if (!FORCE && item.embeddingDescription && item.embeddingDescription.trim().length > 0) {
            console.log(`   ⏭️  Skipping: embeddingDescription already present`);
            skipped++;
            continue;
        }

        try {
            const metadata: GenMetadata = {
                title: item.alt,
                alt: item.alt,
                category: item.category,
                description: item.caption, // rich semantic tags
            };

            let description: string;
            if (USE_VISION) {
                const imageData = await loadLocalImage(item.src);
                description = imageData
                    ? await generateDescriptionFromVision(imageData, metadata)
                    : await generateDescriptionFromMetadata(metadata);
            } else {
                description = await generateDescriptionFromMetadata(metadata);
            }

            console.log(`   ✅ ${description.slice(0, 90)}${description.length > 90 ? '…' : ''}`);

            if (!DRY_RUN) {
                item.embeddingDescription = description;
                changed = true;
            }
            processed++;

            // Gentle pacing to stay under API rate limits
            await new Promise(r => setTimeout(r, USE_VISION ? 1500 : 800));
        } catch (error) {
            console.error(`   ❌ Error processing item ${item.id}:`, error);
            failed++;
        }
    }

    if (changed && !DRY_RUN) {
        await writeGallery(items);
        console.log(`\n💾 Wrote updates to content/gallery.json`);
    } else if (DRY_RUN) {
        console.log(`\n🔍 Dry run — no files written`);
    }

    console.log(`\n✅ Complete! generated: ${processed}, skipped: ${skipped}, failed: ${failed}`);
}

// Run if called directly
if (require.main === module) {
    main().catch(console.error);
}

export { generateDescriptionFromMetadata, generateDescriptionFromVision };
