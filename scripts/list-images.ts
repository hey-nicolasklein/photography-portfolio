#!/usr/bin/env tsx
/**
 * List the first up to 100 image files from Strapi Media Library
 * Prints: index. name - url
 */

import { config } from 'dotenv';
import { resolve } from 'path';

config({ path: resolve(process.cwd(), '.env.local') });
config({ path: resolve(process.cwd(), '.env') });

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL;
const STRAPI_TOKEN = process.env.STRAPI_API_TOKEN;

if (!STRAPI_URL || !STRAPI_TOKEN) {
  console.error('Missing NEXT_PUBLIC_STRAPI_URL or STRAPI_API_TOKEN');
  process.exit(1);
}

type StrapiFile = {
  id: number;
  name?: string;
  url?: string;
  mime?: string;
  ext?: string;
  attributes?: {
    name?: string;
    url?: string;
    mime?: string;
    ext?: string;
  };
};

function isImageMime(m?: string): boolean {
  return !!m && m.toLowerCase().startsWith('image/');
}

function normalizeFile(f: StrapiFile) {
  const a = f.attributes || {};
  const name = a.name ?? f.name ?? '';
  const url = a.url ?? f.url ?? '';
  const mime = a.mime ?? f.mime ?? '';
  const ext = (a.ext ?? f.ext ?? '').replace(/^\./, '').toLowerCase();
  return { id: f.id, name, url, mime, ext };
}

async function fetchFilesPage(page: number, pageSize: number): Promise<StrapiFile[]> {
  const res = await fetch(
    `${STRAPI_URL}/api/upload/files?pagination[page]=${page}&pagination[pageSize]=${pageSize}`,
    { headers: { Authorization: `Bearer ${STRAPI_TOKEN}` } }
  );
  if (!res.ok) return [];
  const json = await res.json();
  if (Array.isArray(json)) return json as StrapiFile[];
  if (Array.isArray(json?.data)) return json.data as StrapiFile[];
  return [];
}

async function main() {
  console.log('📥 Fetching images from Strapi...');
  const pageSize = 100; // one page is enough if API respects
  const files = await fetchFilesPage(1, pageSize);

  const all: Array<ReturnType<typeof normalizeFile>> = files
    .map(normalizeFile)
    .filter((f) => isImageMime(f.mime) && !!f.url);

  // Fallback pagination: fetch a few more pages to ensure completeness
  let page = 2;
  while (page <= 5) {
    const more = await fetchFilesPage(page, pageSize);
    if (more.length === 0) break;
    all.push(
      ...more
        .map(normalizeFile)
        .filter((f) => isImageMime(f.mime) && !!f.url)
    );
    if (more.length < pageSize) break;
    page++;
  }

  // Derive a baseName to detect duplicates: strip extension and trailing hash-like segment
  const getBaseName = (name: string): string => {
    const noExt = name.replace(/\.[^.]+$/, '');
    // Strip trailing _<hex/hash>
    const m = noExt.match(/^(.*?)(_[0-9a-f]{6,}|_[0-9]+)?$/i);
    return (m && m[1]) ? m[1] : noExt;
  };

  const uniqueMap = new Map<string, { name: string; url: string }>();
  const dupMap = new Map<string, number>();

  for (const img of all) {
    const base = getBaseName(img.name || '');
    const key = base.toLowerCase();
    const link = img.url!.startsWith('http') ? img.url! : `${STRAPI_URL}${img.url}`;
    if (!uniqueMap.has(key)) {
      uniqueMap.set(key, { name: img.name || base, url: link });
      dupMap.set(key, 0);
    } else {
      dupMap.set(key, (dupMap.get(key) || 0) + 1);
    }
  }

  const unique = Array.from(uniqueMap.values());
  const total = all.length;
  const duplicates = Array.from(dupMap.values()).reduce((a, b) => a + b, 0);

  console.log(`Total image files found: ${total}`);
  console.log(`Unique by base name: ${unique.length}`);
  console.log(`Duplicate count: ${duplicates}`);
  if (unique.length !== 119) {
    console.log(`⚠️  Expected 119 unique images, found ${unique.length}. Potential duplicates or non-image entries present.`);
  }

  const first100 = unique.slice(0, 100);
  console.log(`\nListing first ${first100.length} unique images (name - url):\n`);
  first100.forEach((img, idx) => {
    console.log(`${idx + 1}. ${img.name} - ${img.url}`);
  });
}

main().catch((e) => {
  console.error('Error:', e);
  process.exit(1);
});


