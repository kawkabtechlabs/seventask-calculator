#!/usr/bin/env node
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');

const [installer, version] = process.argv.slice(2);
if (!installer || !/^\d+\.\d+\.\d+$/.test(version || '')) {
  throw new Error('Usage: node scripts/package-desktop.cjs <installer.exe> <version>');
}
const source = path.resolve(installer);
const filename = `SevenTask-Calculator-Setup-${version}.exe`;
if (path.basename(source) !== filename) throw new Error(`Expected ${filename}`);
const destination = path.resolve(__dirname, '..', 'downloads', `desktop-${version}`);
fs.mkdirSync(destination, { recursive: true });
const chunkBytes = 8 * 1024 * 1024;
const fd = fs.openSync(source, 'r');
const bytes = fs.statSync(source).size;
const parts = [];
const installerHash = crypto.createHash('sha256');
try {
  for (let offset = 0, index = 1; offset < bytes; offset += chunkBytes, index++) {
    const buffer = Buffer.allocUnsafe(Math.min(chunkBytes, bytes - offset));
    fs.readSync(fd, buffer, 0, buffer.length, offset);
    installerHash.update(buffer);
    const file = `part-${String(index).padStart(2, '0')}.bin`;
    fs.writeFileSync(path.join(destination, file), buffer);
    parts.push({ file, bytes: buffer.length, sha256: crypto.createHash('sha256').update(buffer).digest('hex') });
  }
} finally { fs.closeSync(fd); }
fs.writeFileSync(path.join(destination, 'manifest.json'), JSON.stringify({ filename, bytes, version, sha256: installerHash.digest('hex'), parts }, null, 2) + '\n');
console.log(`${filename}: ${bytes} bytes, ${parts.length} parts`);
