#!/usr/bin/env node
/**
 * One-time seed: imports data/fabrics.json into Supabase (not used at runtime).
 * Usage: node scripts/seed-supabase.mjs
 * Requires: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY in env or .env (loaded via dotenv if present)
 */
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createClient } from '@supabase/supabase-js';
import ws from 'ws';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

function loadEnvFile() {
  try {
    const raw = readFileSync(join(root, '.env'), 'utf8');
    for (const line of raw.split('\n')) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const eq = trimmed.indexOf('=');
      if (eq === -1) continue;
      const key = trimmed.slice(0, eq);
      const value = trimmed.slice(eq + 1);
      if (!process.env[key]) process.env[key] = value;
    }
  } catch {
    // no .env
  }
}

loadEnvFile();

const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !key) {
  console.error('Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(url, key, {
  auth: { persistSession: false },
  realtime: { transport: ws },
});

const fabrics = JSON.parse(readFileSync(join(root, 'data/fabrics.json'), 'utf8'));

const portfolio = [
  {
    title: 'Угловой диван',
    fabric_name: 'Велюр «Песок»',
    image_before_url:
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&q=80',
    image_after_url:
      'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&q=80',
    sort_order: 0,
  },
  {
    title: 'Кресло-реклайнер',
    fabric_name: 'Рогожка «Олива»',
    image_before_url:
      'https://images.unsplash.com/photo-1592078611750-7bfdc99a2e4b?w=400&q=80',
    image_after_url:
      'https://images.unsplash.com/photo-1567538096630-e0c55bd6374b?w=400&q=80',
    sort_order: 1,
  },
  {
    title: 'Обеденные стулья',
    fabric_name: 'Экокожа «Карамель»',
    image_before_url:
      'https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=400&q=80',
    image_after_url:
      'https://images.unsplash.com/photo-1617806118233-18e1de247200?w=400&q=80',
    sort_order: 2,
  },
];

async function seedTable(table, rows, mapRow) {
  const { count } = await supabase.from(table).select('*', { count: 'exact', head: true });
  if (count && count > 0) {
    console.log(`Skip ${table}: already has ${count} rows`);
    return;
  }

  const payload = rows.map(mapRow);
  const { error } = await supabase.from(table).insert(payload);
  if (error) throw new Error(`${table}: ${error.message}`);
  console.log(`Seeded ${table}: ${payload.length} rows`);
}

await seedTable('fabrics', fabrics, (f, i) => ({
  name: f.name,
  material: f.material,
  color: f.color,
  price_per_meter: f.pricePerMeter,
  image_url: f.imageUrl,
  description: f.description ?? null,
  pet_friendly: Boolean(f.petFriendly),
  sort_order: i,
}));

await seedTable('portfolio', portfolio, (p) => p);

console.log('Done.');
