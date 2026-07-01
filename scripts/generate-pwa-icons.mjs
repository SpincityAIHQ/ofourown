/**
 * Generates the OOO Performance PWA icon set with zero external dependencies.
 *
 * The mark is a minimal monochrome "OOO" (three rings) in near-white on the
 * brand near-black (#0E0E10). Regular icons use ~78% of the canvas; the
 * maskable icon keeps the mark inside a ~60% safe zone so platform masks
 * (circle/squircle) never clip it.
 *
 * PLACEHOLDER: derived from the OOO wordmark, not a final logo asset. Replace
 * with a designed mark when available (keep the same filenames/sizes).
 *
 * Run: node scripts/generate-pwa-icons.mjs
 */
import { deflateSync } from "node:zlib";
import { mkdirSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = join(__dirname, "..", "public", "icons");

const BG = [14, 14, 16]; // #0E0E10
const FG = [245, 245, 245]; // near-white

// --- tiny PNG encoder (RGBA, 8-bit) ---
const CRC_TABLE = (() => {
  const t = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c >>> 0;
  }
  return t;
})();
function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}
function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const typeBuf = Buffer.from(type, "ascii");
  const body = Buffer.concat([typeBuf, data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(body), 0);
  return Buffer.concat([len, body, crc]);
}
function encodePng(width, height, rgba) {
  const sig = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // color type RGBA
  ihdr[10] = 0;
  ihdr[11] = 0;
  ihdr[12] = 0;
  // raw scanlines with filter byte 0
  const stride = width * 4;
  const raw = Buffer.alloc((stride + 1) * height);
  for (let y = 0; y < height; y++) {
    raw[y * (stride + 1)] = 0;
    rgba.copy(raw, y * (stride + 1) + 1, y * stride, y * stride + stride);
  }
  const idat = deflateSync(raw, { level: 9 });
  return Buffer.concat([
    sig,
    chunk("IHDR", ihdr),
    chunk("IDAT", idat),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}

// --- draw the OOO mark ---
function drawIcon(size, markFraction) {
  const rgba = Buffer.alloc(size * size * 4);
  // fill background
  for (let i = 0; i < size * size; i++) {
    rgba[i * 4] = BG[0];
    rgba[i * 4 + 1] = BG[1];
    rgba[i * 4 + 2] = BG[2];
    rgba[i * 4 + 3] = 255;
  }
  const markW = size * markFraction;
  const gap = markW * 0.06;
  const ringD = (markW - 2 * gap) / 3; // diameter of each O
  const rO = ringD / 2;
  const rI = rO * 0.58; // inner radius -> ring thickness
  const cy = size / 2;
  const startX = (size - markW) / 2 + rO;
  const centers = [startX, startX + ringD + gap, startX + 2 * (ringD + gap)];
  const aa = 1.2; // anti-alias band in px

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      let cov = 0;
      for (const cx of centers) {
        const d = Math.hypot(x + 0.5 - cx, y + 0.5 - cy);
        // ring coverage: 1 inside [rI, rO], smooth edges
        const outer = 1 - smooth(rO - aa, rO + aa, d);
        const inner = smooth(rI - aa, rI + aa, d);
        cov = Math.max(cov, Math.min(outer, inner));
      }
      if (cov > 0) {
        const idx = (y * size + x) * 4;
        rgba[idx] = Math.round(BG[0] + (FG[0] - BG[0]) * cov);
        rgba[idx + 1] = Math.round(BG[1] + (FG[1] - BG[1]) * cov);
        rgba[idx + 2] = Math.round(BG[2] + (FG[2] - BG[2]) * cov);
        rgba[idx + 3] = 255;
      }
    }
  }
  return encodePng(size, size, rgba);
}
function smooth(a, b, x) {
  if (x <= a) return 0;
  if (x >= b) return 1;
  const t = (x - a) / (b - a);
  return t * t * (3 - 2 * t);
}

mkdirSync(OUT_DIR, { recursive: true });
const targets = [
  { file: "icon-192.png", size: 192, frac: 0.78 },
  { file: "icon-512.png", size: 512, frac: 0.78 },
  { file: "icon-512-maskable.png", size: 512, frac: 0.6 },
  { file: "apple-touch-icon.png", size: 180, frac: 0.72 },
  { file: "favicon-32.png", size: 32, frac: 0.84 },
];
for (const t of targets) {
  const png = drawIcon(t.size, t.frac);
  writeFileSync(join(OUT_DIR, t.file), png);
  console.log(`wrote icons/${t.file} (${t.size}x${t.size}, ${png.length} bytes)`);
}
console.log("done");
