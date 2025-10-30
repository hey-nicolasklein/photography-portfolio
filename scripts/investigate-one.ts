#!/usr/bin/env tsx
/**
 * Investigate a specific photo (e.g., IMG_1030.jpg) across Strapi upload files
 * - Fetch pages of files
 * - Filter by base name (IMG_1030)
 * - Print all matches with id, name, url, width x height, size (KB)
 * - Pick the largest by area (width*height) and update its caption
 */

import { config } from 'dotenv';
import { resolve } from 'path';
import { FormData } from 'formdata-node';

config({ path: resolve(process.cwd(), '.env.local') });
config({ path: resolve(process.cwd(), '.env') });

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL;
const STRAPI_TOKEN = process.env.STRAPI_API_TOKEN;

if (!STRAPI_URL || !STRAPI_TOKEN) {
  console.error('Missing NEXT_PUBLIC_STRAPI_URL or STRAPI_API_TOKEN');
  process.exit(1);
}

type Attrs = {
  name?: string;
  url?: string;
  mime?: string;
  ext?: string;
  width?: number;
  height?: number;
  size?: number;
};

type StrapiFile = {
  id: number;
  name?: string;
  url?: string;
  mime?: string;
  ext?: string;
  width?: number;
  height?: number;
  size?: number;
  attributes?: Attrs;
};

const TARGET_BASENAME = 'IMG_1030';

function isImageMime(m?: string): boolean {
  return !!m && m.toLowerCase().startsWith('image/');
}

function normalizeFile(f: StrapiFile) {
  const a = f.attributes || {};
  const name = a.name ?? f.name ?? '';
  const url = a.url ?? f.url ?? '';
  const mime = a.mime ?? f.mime ?? '';
  const ext = (a.ext ?? f.ext ?? '').replace(/^\./, '').toLowerCase();
  const width = a.width ?? f.width ?? 0;
  const height = a.height ?? f.height ?? 0;
  const size = a.size ?? f.size ?? 0; // in KB typically
  return { id: f.id, name, url, mime, ext, width, height, size };
}

function getBaseName(name: string): string {
  const noExt = name.replace(/\.[^.]+$/, '');
  return noExt;
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

async function updateCaption(fileId: number, caption: string) {
  const form = new FormData();
  form.append('fileInfo', JSON.stringify({ caption }));
  const res = await fetch(`${STRAPI_URL}/api/upload?id=${fileId}`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${STRAPI_TOKEN}` },
    body: form as any,
  });
  const text = await res.text();
  if (!res.ok) {
    console.error(`   ❌ Update failed for ${fileId}: ${res.status} ${text}`);
    return false;
  }
  console.log(`   ✅ Updated caption for file ${fileId}`);
  return true;
}

async function main() {
  console.log('🔎 Investigating base name:', TARGET_BASENAME);

  const pageSize = 100;
  const all: ReturnType<typeof normalizeFile>[] = [];
  let page = 1;
  while (page <= 10 && all.length < 1000) {
    const files = await fetchFilesPage(page, pageSize);
    if (files.length === 0) break;
    all.push(
      ...files.map(normalizeFile).filter((f) => isImageMime(f.mime) && !!f.url)
    );
    if (files.length < pageSize) break;
    page++;
  }

  const matches = all.filter((f) => getBaseName(f.name || '').includes(TARGET_BASENAME));
  console.log(`Found ${matches.length} matching entries for ${TARGET_BASENAME}:\n`);
  matches.forEach((m, i) => {
    const link = m.url!.startsWith('http') ? m.url : `${STRAPI_URL}${m.url}`;
    const area = (m.width || 0) * (m.height || 0);
    console.log(
      `${i + 1}. id=${m.id} name=${m.name} mime=${m.mime} size=${m.size || 0}KB dims=${m.width || 0}x${m.height || 0} area=${area} url=${link}`
    );
  });

  if (matches.length === 0) {
    console.log('No matches found, exiting.');
    return;
  }

  // Pick the largest by area (fallback to size)
  const largest = matches
    .map((m) => ({ m, area: (m.width || 0) * (m.height || 0) }))
    .sort((a, b) => b.area - a.area || (b.m.size || 0) - (a.m.size || 0))[0].m;

  console.log('\n🧩 Candidate for update (largest):');
  const largestLink = largest.url!.startsWith('http') ? largest.url : `${STRAPI_URL}${largest.url}`;
  console.log(
    `id=${largest.id} name=${largest.name} size=${largest.size || 0}KB dims=${largest.width || 0}x${largest.height || 0} url=${largestLink}`
  );

  // Update caption with a simple, non-destructive test value
  const newCaption = 'auto-tags: test study for IMG_1030 (do not remove)';
  console.log('\n✏️  Updating caption on the largest candidate...');
  await updateCaption(largest.id, newCaption);
}

main().catch((e) => {
  console.error('Error:', e);
  process.exit(1);
});



