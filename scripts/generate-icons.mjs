import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import sharp from "sharp";

const root = process.cwd();
const appDir = path.join(root, "app");
const iconPath = path.join(appDir, "icon.svg");
const iconSvg = await fs.readFile(iconPath);

await fs.mkdir(appDir, { recursive: true });

await sharp(iconSvg)
  .resize(180, 180)
  .png({ compressionLevel: 9 })
  .toFile(path.join(appDir, "apple-icon.png"));

const faviconSizes = [16, 32, 48];
const faviconPngs = await Promise.all(
  faviconSizes.map((size) =>
    sharp(iconSvg)
      .resize(size, size)
      .png({ compressionLevel: 9 })
      .toBuffer(),
  ),
);

function createIco(images, sizes) {
  const headerSize = 6;
  const entrySize = 16;
  const dataOffset = headerSize + entrySize * images.length;
  const header = Buffer.alloc(headerSize);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(images.length, 4);

  let offset = dataOffset;
  const entries = images.map((image, index) => {
    const size = sizes[index];
    const entry = Buffer.alloc(entrySize);
    entry.writeUInt8(size === 256 ? 0 : size, 0);
    entry.writeUInt8(size === 256 ? 0 : size, 1);
    entry.writeUInt8(0, 2);
    entry.writeUInt8(0, 3);
    entry.writeUInt16LE(1, 4);
    entry.writeUInt16LE(32, 6);
    entry.writeUInt32LE(image.length, 8);
    entry.writeUInt32LE(offset, 12);
    offset += image.length;
    return entry;
  });

  return Buffer.concat([header, ...entries, ...images]);
}

await fs.writeFile(
  path.join(appDir, "favicon.ico"),
  createIco(faviconPngs, faviconSizes),
);

const socialIcon = await sharp(iconSvg)
  .resize(260, 260)
  .png({ compressionLevel: 9 })
  .toBuffer();

const socialText = Buffer.from(`
  <svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
    <rect width="1200" height="630" fill="#10251b"/>
    <rect x="56" y="56" width="1088" height="518" rx="30" fill="#173327" stroke="#356447" stroke-width="3"/>
    <text x="390" y="285" fill="#f3f5f1" font-family="Arial, Helvetica, sans-serif" font-size="72" font-weight="800">Chop Chop Inc. Wiki</text>
    <text x="394" y="365" fill="#d89a62" font-family="Arial, Helvetica, sans-serif" font-size="34" font-weight="600">Verified recipes, items &amp; world data</text>
    <rect x="394" y="405" width="330" height="7" rx="3.5" fill="#3f8e59"/>
  </svg>
`);

await sharp(socialText)
  .composite([{ input: socialIcon, left: 92, top: 185 }])
  .png({ compressionLevel: 9 })
  .toFile(path.join(appDir, "opengraph-image.png"));

console.log("Generated app/icon.svg, app/apple-icon.png, app/favicon.ico, and app/opengraph-image.png");
