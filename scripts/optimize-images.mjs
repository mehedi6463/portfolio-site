/**
 * Image pipeline — run with `npm run images`.
 * Reads originals from /assets-src and writes optimised web assets to /public/images.
 *  - profile.png  → white studio background removed (edge flood-fill) → profile.webp
 *  - about.jpg    → resized + compressed → about.webp
 *  - signature.png → copied (used as a CSS mask so it can be tinted per theme)
 *  - favicon / og image generated into /public
 */
import sharp from 'sharp';
import { mkdir, copyFile, writeFile } from 'node:fs/promises';

const SRC = 'assets-src';
const OUT = 'public/images';
await mkdir(OUT, { recursive: true });

/* ---------- 1. Profile cut-out ---------- */
async function cutoutProfile() {
  const scale = 2; // upscale small source so it stays crisp on retina
  const img = sharp(`${SRC}/profile.png`).removeAlpha();
  const meta = await img.metadata();
  const W = meta.width * scale;
  const H = meta.height * scale;
  const { data } = await img
    .resize(W, H, { kernel: 'lanczos3' })
    .raw()
    .toBuffer({ resolveWithObject: true });

  const alpha = new Uint8ClampedArray(W * H).fill(255);
  const visited = new Uint8Array(W * H);
  const isBg = (i) => {
    const r = data[i * 3], g = data[i * 3 + 1], b = data[i * 3 + 2];
    const min = Math.min(r, g, b), max = Math.max(r, g, b);
    return min > 222 && max - min < 22;
  };

  // flood fill from every border pixel
  const stack = [];
  for (let x = 0; x < W; x++) stack.push(x, (H - 1) * W + x);
  for (let y = 0; y < H; y++) stack.push(y * W, y * W + W - 1);
  while (stack.length) {
    const p = stack.pop();
    if (visited[p]) continue;
    visited[p] = 1;
    if (!isBg(p)) continue;
    alpha[p] = 0;
    const x = p % W, y = (p / W) | 0;
    if (x > 0) stack.push(p - 1);
    if (x < W - 1) stack.push(p + 1);
    if (y > 0) stack.push(p - W);
    if (y < H - 1) stack.push(p + W);
  }

  // soften the edge: 1px feather on pixels touching background
  const soft = new Uint8ClampedArray(alpha);
  for (let y = 1; y < H - 1; y++) {
    for (let x = 1; x < W - 1; x++) {
      const p = y * W + x;
      if (alpha[p] === 0) continue;
      let sum = 0;
      for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) sum += alpha[p + dy * W + dx];
      soft[p] = sum / 9;
    }
  }

  const rgba = Buffer.alloc(W * H * 4);
  for (let i = 0; i < W * H; i++) {
    rgba[i * 4] = data[i * 3];
    rgba[i * 4 + 1] = data[i * 3 + 1];
    rgba[i * 4 + 2] = data[i * 3 + 2];
    rgba[i * 4 + 3] = soft[i];
  }
  await sharp(rgba, { raw: { width: W, height: H, channels: 4 } })
    .webp({ quality: 88, alphaQuality: 90 })
    .toFile(`${OUT}/profile.webp`);
  console.log('✓ profile.webp', W, 'x', H);
}

/* ---------- 2. About photo ---------- */
async function about() {
  // crop to a 4:5 portrait centred on the rider (trims the bystander on the right edge)
  await sharp(`${SRC}/about.jpg`)
    .rotate()
    .extract({ left: 120, top: 260, width: 2540, height: 3175 })
    .resize({ width: 900 })
    .webp({ quality: 78 })
    .toFile(`${OUT}/about.webp`);
  console.log('✓ about.webp');
}

/* ---------- 3. Signature ---------- */
async function signature() {
  await copyFile(`${SRC}/signature.png`, `${OUT}/signature.png`);
  console.log('✓ signature.png');
}

/* ---------- 4. Favicon + OG image ---------- */
async function brand() {
  const favicon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <rect width="64" height="64" rx="16" fill="#092635"/>
  <path d="M16 46V18h6l10 14 10-14h6v28h-7V30l-9 12-9-12v16z" fill="#9EC8B9"/>
</svg>`;
  await writeFile('public/favicon.svg', favicon);
  await sharp(Buffer.from(favicon)).resize(180, 180).png().toFile('public/apple-touch-icon.png');

  const og = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
  <defs>
    <radialGradient id="g" cx="80%" cy="20%" r="70%"><stop offset="0" stop-color="#1B4242"/><stop offset="1" stop-color="#061A24"/></radialGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#g)"/>
  <text x="80" y="250" font-family="Arial, sans-serif" font-size="30" fill="#9EC8B9" letter-spacing="6">FRONTEND DEVELOPER</text>
  <text x="80" y="350" font-family="Arial, sans-serif" font-weight="700" font-size="96" fill="#EAF4F1">Mehedi Hasan</text>
  <text x="80" y="420" font-family="Arial, sans-serif" font-size="32" fill="#8FB0A8">Crafting modern digital experiences with React &amp; Tailwind CSS</text>
  <rect x="80" y="480" width="120" height="6" rx="3" fill="#9EC8B9"/>
</svg>`;
  await sharp(Buffer.from(og)).png().toFile('public/og-image.png');
  console.log('✓ favicon + og-image');
}

await Promise.all([cutoutProfile(), about(), signature(), brand()]);
