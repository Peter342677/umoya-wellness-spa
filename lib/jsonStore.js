// Minimal append-only JSON file store, shared by contact submissions and
// booking records. Not for concurrent-write-heavy use, but fine for a
// low-traffic marketing site's form/webhook volume.
const fs = require('fs');
const path = require('path');

function appendJsonEntry(filePath, entry) {
  let existing = [];
  try {
    existing = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (e) {
    existing = [];
  }
  existing.push(entry);
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, JSON.stringify(existing, null, 2));
}

module.exports = { appendJsonEntry };
