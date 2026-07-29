// One-time conversion: generates a .webp twin next to every .jpg/.png in
// public/assets/images/, used by <picture><source type="image/webp">
// fallback markup in the views. Re-run after adding/replacing any image.
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const IMAGES_DIR = path.join(__dirname, '..', 'public', 'assets', 'images');

function walk(dir) {
  let files = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) files = files.concat(walk(full));
    else if (/\.(jpe?g|png)$/i.test(entry.name)) files.push(full);
  }
  return files;
}

(async () => {
  const files = walk(IMAGES_DIR);
  let totalBefore = 0;
  let totalAfter = 0;

  for (const file of files) {
    const outFile = file.replace(/\.(jpe?g|png)$/i, '.webp');
    const before = fs.statSync(file).size;
    await sharp(file).webp({ quality: 82 }).toFile(outFile);
    const after = fs.statSync(outFile).size;
    totalBefore += before;
    totalAfter += after;
    console.log(
      `${path.relative(IMAGES_DIR, file)}: ${(before / 1024).toFixed(0)}KB -> ${(after / 1024).toFixed(0)}KB (${Math.round((1 - after / before) * 100)}% smaller)`
    );
  }

  console.log(`\nTotal: ${(totalBefore / 1024).toFixed(0)}KB -> ${(totalAfter / 1024).toFixed(0)}KB (${Math.round((1 - totalAfter / totalBefore) * 100)}% smaller)`);
})().catch((err) => {
  console.error('FAILED:', err.message);
  process.exit(1);
});
