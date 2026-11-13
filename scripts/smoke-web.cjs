const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const assert = require('node:assert/strict');

const root = path.resolve(__dirname, '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');
const release = JSON.parse(read('release.json'));

for (const file of ['index.html', 'calculator.html', 'max.html', 'keyboard-shortcuts.html', 'pricing.html']) {
  const html = read(file);
  for (const [, attributes, content] of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)) {
    if (/\bsrc\s*=|\btype\s*=\s*["']application\/ld\+json/i.test(attributes)) continue;
    new vm.Script(content, { filename: file });
  }
  for (const [, url] of html.matchAll(/<a\b[^>]*\bhref="([^"]+)"/gi)) {
    if (!url.endsWith('.html')) continue;
    assert.ok(fs.existsSync(path.join(root, url)), `${file}: missing link ${url}`);
  }
}

assert.match(read('index.html'), /href="keyboard-shortcuts\.html"/);
assert.match(read('index.html'), /href="pricing\.html"/);
assert.match(read('calculator.html'), /href="\/max"/);
assert.match(read('max.html'), /href="\/calculator"/);
assert.match(read('calculator-core.js'), new RegExp(`class="version-number">${release.versionName.replaceAll('.', '\\.')}<`));
assert.match(read('calculator.html'), new RegExp(`TOUHID<\\/span><b>${release.versionName.replaceAll('.', '\\.')}<`));
assert.match(read('sw.js'), new RegExp(`shell-${release.versionName.replaceAll('.', '\\.')}`));
console.log(`Web smoke checks passed for ${release.versionName}`);
