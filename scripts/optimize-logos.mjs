/**
 * Trim cream background, export @1x/@2x PNG + WebP for header logos.
 * Run: node scripts/optimize-logos.mjs
 */
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const PUBLIC = path.resolve('public');
const META_PATH = path.join(PUBLIC, 'logo-meta.json');

/** Pixels within this distance (RGB) from corner samples are treated as background. */
const BG_TOLERANCE = 28;

async function loadRaw(filePath) {
  const image = sharp(filePath).ensureAlpha();
  const { data, info } = await image.raw().toBuffer({ resolveWithObject: true });
  return { data, info };
}

function sampleCornerBg(data, info) {
  const { width, height, channels } = info;
  const samples = [
    [0, 0],
    [width - 1, 0],
    [0, height - 1],
    [width - 1, height - 1],
  ];
  const acc = [0, 0, 0];
  for (const [x, y] of samples) {
    const i = (y * width + x) * channels;
    acc[0] += data[i];
    acc[1] += data[i + 1];
    acc[2] += data[i + 2];
  }
  return acc.map((v) => Math.round(v / samples.length));
}

function colorDistance(r, g, b, bg) {
  return Math.max(Math.abs(r - bg[0]), Math.abs(g - bg[1]), Math.abs(b - bg[2]));
}

async function makeTransparent(inputPath) {
  const { data, info } = await loadRaw(inputPath);
  const bg = sampleCornerBg(data, info);
  const { width, height, channels } = info;

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const i = (y * width + x) * channels;
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      if (colorDistance(r, g, b, bg) <= BG_TOLERANCE) {
        data[i + 3] = 0;
      }
    }
  }

  return sharp(data, { raw: { width, height, channels } }).trim();
}

async function exportVariant(base, name, maxWidth) {
  const meta = await base.metadata();
  const scale = maxWidth / (meta.width ?? maxWidth);
  const height = Math.round((meta.height ?? maxWidth) * scale);

  const sized = base.clone().resize(maxWidth, height, { fit: 'inside', withoutEnlargement: true });

  const pngPath = path.join(PUBLIC, `${name}.png`);
  const webpPath = path.join(PUBLIC, `${name}.webp`);
  const png2xPath = path.join(PUBLIC, `${name}@2x.png`);
  const webp2xPath = path.join(PUBLIC, `${name}@2x.webp`);

  await sized.png({ compressionLevel: 9 }).toFile(pngPath);
  await sized.webp({ quality: 90, alphaQuality: 100 }).toFile(webpPath);

  const sized2x = base.clone().resize(maxWidth * 2, height * 2, {
    fit: 'inside',
    withoutEnlargement: true,
  });
  await sized2x.png({ compressionLevel: 9 }).toFile(png2xPath);
  await sized2x.webp({ quality: 90, alphaQuality: 100 }).toFile(webp2xPath);

  const outMeta = await sharp(pngPath).metadata();
  return {
    width: outMeta.width ?? maxWidth,
    height: outMeta.height ?? height,
  };
}

async function processLogo(inputName, outputName, maxWidth) {
  const inputPath = path.join(PUBLIC, inputName);
  const transparent = await makeTransparent(inputPath);
  const size = await exportVariant(transparent, outputName, maxWidth);
  return size;
}

const iconSize = await processLogo('logo-icon.png', 'logo-icon', 40);
const withTextSize = await processLogo('logo-with-text.png', 'logo-with-text', 220);

const meta = {
  icon: iconSize,
  withText: withTextSize,
};

await writeFile(META_PATH, `${JSON.stringify(meta, null, 2)}\n`);

console.log('Logo optimization complete:', meta);
