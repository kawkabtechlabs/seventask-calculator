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

// Exercise the copy action in both floating and regular website modes. A
// floating calculator used to leave the button visible but return early.
const core = read('calculator-core.js');
const duplicateSource = core.slice(core.indexOf('    duplicate(){'), core.indexOf('    setPreviewTheme('));
assert.ok(duplicateSource.startsWith('    duplicate(){'), 'copy action exists');
for (const popupMode of [false, true]) {
  const created = [];
  const storage = new Map();
  const context = {
    window: { innerWidth: 1280, innerHeight: 800 },
    location: { search: '' },
    URLSearchParams,
    Math,
    document: {
      querySelectorAll: () => [{ shadowRoot: { querySelector: () => ({}) } }],
      createElement: () => ({
        id: '', feature: '', attributes: [],
        setAttribute(name) { this.attributes.push(name); },
        open() { this.opened = true; },
        saveState() { this.saved = true; },
        $win: { style: { setProperty(name, value) { this[name] = value; } } },
      }),
      body: { appendChild(element) { created.push(element); } },
    },
    localStorage: {
      getItem(key) { return storage.get(key) ?? null; },
      setItem(key, value) { storage.set(key, value); },
    },
  };
  const { duplicate } = vm.runInNewContext(`({${duplicateSource}})`, context);
  duplicate.call({
    popupMode, nativeAppMode: false, feature: 'scientific',
    $win: { getBoundingClientRect: () => ({ left: 440, top: 80, width: 600, height: 650 }) },
  });
  assert.equal(created.length, 1, `copy creates a calculator when popupMode=${popupMode}`);
  assert.equal(created[0].opened, true);
  assert.equal(created[0].feature, 'scientific');
  assert.equal(created[0].saved, true);
  assert.equal(created[0].$win.style['--tai7-w'], popupMode ? '400px' : '600px');
}
console.log(`Web smoke checks passed for ${release.versionName}`);
