#!/usr/bin/env tsx
// One-time Strapi export: localize CMS content and images so the app can run without Strapi.

import fs from 'node:fs';
import { basename as pathBasename, extname, resolve } from 'node:path';
import { config } from 'dotenv';
import sharp from 'sharp';

config({ path: resolve(process.cwd(), 'migration.env') });

const strapiUrl = process.env.STRAPI_URL_PROD;
const token = process.env.STRAPI_ALL_ACCESS_TOKEN_PROD;

if (!strapiUrl || !token) {
  console.error(
    'Missing required migration environment variables: STRAPI_URL_PROD and STRAPI_ALL_ACCESS_TOKEN_PROD must both be set.',
  );
  process.exit(1);
}

const contentDir = resolve(process.cwd(), 'content');
const imageRoot = resolve(process.cwd(), 'public', 'images');

let imagesDownloaded = 0;
let imagesSkipped = 0;

type LocalImage = {
  src: string;
  width: number;
  height: number;
};

type StrapiResponse<T> = {
  data: T;
};

type StrapiImage = {
  id?: number;
  url: string;
  alternativeText?: string | null;
  name?: string | null;
  caption?: string | null;
  width?: number;
  height?: number;
};

type GalleryItem = {
  id: number;
  documentId: string;
  tag: string;
  image?: StrapiImage[] | null;
  embeddingDescription: string;
};

type PortfolioItem = {
  id: number;
  Title: string;
  Description: string;
  FullImage?: StrapiImage | null;
  description: string;
};

type Bio = {
  id: number;
  tags: unknown;
  title: string;
  description: string;
  profileImage?: StrapiImage | null;
};

type Story = {
  id: number;
  documentId: string;
  title: string;
  description: string;
  images?: StrapiImage[] | null;
  createdAt: string;
};

function absoluteImageUrl(imageUrl: string): string {
  if (imageUrl.startsWith('http')) {
    return imageUrl;
  }

  return `${strapiUrl.replace(/\/$/, '')}/${imageUrl.replace(/^\//, '')}`;
}

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

// Strapi Cloud's media CDN throttles/blocks rapid, non-browser bulk downloads,
// so we present a browser User-Agent, pace requests, and retry with backoff.
const IMAGE_REQUEST_DELAY_MS = 600;
const IMAGE_MAX_ATTEMPTS = 5;
const BROWSER_HEADERS = {
  'User-Agent':
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
  Accept: 'image/avif,image/webp,image/png,image/*,*/*;q=0.8',
} as const;

async function fetchImageWithRetry(absoluteUrl: string): Promise<Buffer> {
  let lastError: unknown;
  for (let attempt = 1; attempt <= IMAGE_MAX_ATTEMPTS; attempt += 1) {
    try {
      const response = await fetch(absoluteUrl, { headers: BROWSER_HEADERS });
      if (response.ok) {
        return Buffer.from(await response.arrayBuffer());
      }
      lastError = new Error(`HTTP ${response.status} ${response.statusText}`);
    } catch (error) {
      lastError = error;
    }
    if (attempt < IMAGE_MAX_ATTEMPTS) {
      // Exponential backoff (1.2s, 2.4s, 4.8s, ...) to ride out WAF throttling.
      await sleep(IMAGE_REQUEST_DELAY_MS * 2 ** attempt);
    }
  }
  throw lastError ?? new Error('Unknown image fetch failure');
}

async function localizeImage(remoteUrl: string, category: string): Promise<LocalImage> {
  try {
    const absoluteUrl = absoluteImageUrl(remoteUrl);
    const url = new URL(absoluteUrl);
    const filename = decodeURIComponent(pathBasename(url.pathname));
    const nameWithoutExtension = filename.slice(0, filename.length - extname(filename).length);
    const sanitizedBasename = nameWithoutExtension.replace(/[^a-zA-Z0-9._-]/g, '_') || 'image';
    const outputDir = resolve(imageRoot, category);
    const outputPath = resolve(outputDir, `${sanitizedBasename}.webp`);
    const publicSrc = `/images/${category}/${sanitizedBasename}.webp`;

    fs.mkdirSync(outputDir, { recursive: true });

    if (fs.existsSync(outputPath)) {
      const metadata = await sharp(outputPath).metadata();
      imagesSkipped += 1;
      return {
        src: publicSrc,
        width: metadata.width ?? 0,
        height: metadata.height ?? 0,
      };
    }

    const imageBuffer = await fetchImageWithRetry(absoluteUrl);
    // Pace successful downloads too, so we stay under the CDN's rate limit.
    await sleep(IMAGE_REQUEST_DELAY_MS);
    const info = await sharp(imageBuffer)
      .rotate()
      .resize({
        width: 2000,
        height: 2000,
        fit: 'inside',
        withoutEnlargement: true,
      })
      .webp({ quality: 82 })
      .toFile(outputPath);

    imagesDownloaded += 1;
    return { src: publicSrc, width: info.width, height: info.height };
  } catch (error) {
    console.warn(`Warning: could not localize image "${remoteUrl}": ${errorMessage(error)}`);
    return { src: '/placeholder.svg', width: 0, height: 0 };
  }
}

async function fetchStrapi<T>(endpoint: string): Promise<T | null> {
  const response = await fetch(`${strapiUrl.replace(/\/$/, '')}${endpoint}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    console.error(
      `Strapi request failed for ${endpoint}: HTTP ${response.status} ${response.statusText}`,
    );
    return null;
  }

  const payload = (await response.json()) as StrapiResponse<T>;
  return payload.data;
}

function writeJson(filename: string, value: unknown): void {
  fs.writeFileSync(resolve(contentDir, filename), `${JSON.stringify(value, null, 2)}\n`, 'utf8');
}

async function exportGallery(): Promise<number> {
  const items = await fetchStrapi<GalleryItem[]>('/api/gallery-items?populate=image');
  if (items === null) {
    writeJson('gallery.json', []);
    return 0;
  }
  if (!Array.isArray(items)) {
    throw new Error('Gallery response data is not an array.');
  }

  const output = [];
  for (const item of items) {
    const image = item.image?.[0];
    const localized = image?.url
      ? await localizeImage(image.url, 'gallery')
      : { src: '/placeholder.svg', width: 0, height: 0 };

    output.push({
      id: item.id,
      documentId: item.documentId,
      src: localized.src,
      alt: image?.alternativeText || image?.name || 'Gallery image',
      caption: image?.caption || '',
      category: item.tag,
      embeddingDescription: item.embeddingDescription,
    });
  }

  writeJson('gallery.json', output);
  return output.length;
}

async function exportPortfolio(): Promise<number> {
  const items = await fetchStrapi<PortfolioItem[]>('/api/portfolio-items?populate=FullImage');
  if (items === null) {
    writeJson('portfolio.json', []);
    return 0;
  }
  if (!Array.isArray(items)) {
    throw new Error('Portfolio response data is not an array.');
  }

  const output = [];
  for (const item of items) {
    const localized = item.FullImage?.url
      ? await localizeImage(item.FullImage.url, 'portfolio')
      : { src: '/placeholder.svg', width: 0, height: 0 };

    output.push({
      id: item.id,
      title: item.Title,
      category: item.Description,
      image: localized.src,
      alt: item.description,
    });
  }

  writeJson('portfolio.json', output);
  return output.length;
}

async function exportBio(): Promise<void> {
  const bio = await fetchStrapi<Bio>('/api/bio?populate=profileImage');
  if (bio === null) {
    return;
  }
  if (typeof bio !== 'object' || Array.isArray(bio)) {
    throw new Error('Bio response data is not a single object.');
  }

  const localized = bio.profileImage?.url
    ? await localizeImage(bio.profileImage.url, 'bio')
    : { src: '/photographer.png', width: 0, height: 0 };

  writeJson('bio.json', {
    id: bio.id,
    tags: bio.tags,
    title: bio.title,
    description: bio.description,
    profileImage: localized.src,
    profileImageAlt:
      bio.profileImage?.alternativeText ||
      bio.profileImage?.name ||
      'Nicolas Klein - Photographer',
  });
}

async function exportStories(): Promise<number> {
  const stories = await fetchStrapi<Story[]>(
    '/api/stories?populate=images&pagination[pageSize]=100',
  );
  if (stories === null) {
    writeJson('stories.json', []);
    return 0;
  }
  if (!Array.isArray(stories)) {
    throw new Error('Stories response data is not an array.');
  }

  const output = [];
  for (const story of stories) {
    const images = [];
    for (const image of story.images ?? []) {
      const localized = await localizeImage(image.url, 'stories');
      images.push({
        id: image.id,
        url: localized.src,
        alt: image.alternativeText || image.name || story.title,
        width: localized.width,
        height: localized.height,
      });
    }

    output.push({
      id: story.id,
      documentId: story.documentId,
      title: story.title,
      description: story.description,
      images,
      createdAt: story.createdAt,
    });
  }

  output.sort(
    (left, right) => new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime(),
  );
  writeJson('stories.json', output);
  return output.length;
}

async function main(): Promise<void> {
  fs.mkdirSync(contentDir, { recursive: true });

  let galleryCount = 0;
  let portfolioCount = 0;
  let storiesCount = 0;

  try {
    galleryCount = await exportGallery();
  } catch (error) {
    console.error(`Gallery export failed: ${errorMessage(error)}`);
  }

  try {
    portfolioCount = await exportPortfolio();
  } catch (error) {
    console.error(`Portfolio export failed: ${errorMessage(error)}`);
  }

  try {
    await exportBio();
  } catch (error) {
    console.error(`Bio export failed: ${errorMessage(error)}`);
  }

  try {
    storiesCount = await exportStories();
  } catch (error) {
    console.error(`Stories export failed: ${errorMessage(error)}`);
  }

  console.log(
    `Export complete: gallery=${galleryCount}, portfolio=${portfolioCount}, stories=${storiesCount}, images downloaded=${imagesDownloaded}, images skipped=${imagesSkipped}`,
  );
}

void main().catch((error) => {
  console.error(`Strapi export failed: ${errorMessage(error)}`);
  process.exitCode = 1;
});
