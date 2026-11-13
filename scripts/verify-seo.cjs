#!/usr/bin/env node
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');

const root = path.resolve(__dirname, '..');
for (const [file, route] of [
  ['index.html', '/'],
  ['calculator.html', '/calculator'],
  ['max.html', '/max'],
  ['keyboard-shortcuts.html', '/keyboard-shortcuts'],
  ['pricing.html', '/pricing'],
  ['install.html', '/install'],
  ['privacy-policy.html', '/privacy-policy'],
]) {
  const html = fs.readFileSync(path.join(root, file), 'utf8');
  assert.ok(html.includes(`rel="canonical" href="https://seventaskcalculator.in${route}"`), `${file}: missing canonical URL`);
  assert.ok(/<meta\s+name="description"\s+content="[^"]+"/i.test(html), `${file}: missing description`);
  assert.ok(/<title>[^<]+<\/title>/i.test(html), `${file}: missing title`);
  if (file !== 'calculator.html') assert.ok(/<h1[\s>]/i.test(html), `${file}: missing H1`);
}
const sitemap = fs.readFileSync(path.join(root, 'sitemap.xml'), 'utf8');
for (const route of ['/calculator', '/max', '/keyboard-shortcuts', '/pricing']) {
  assert.ok(sitemap.includes(`<loc>https://seventaskcalculator.in${route}</loc>`), `sitemap: missing ${route}`);
}
assert.ok(!sitemap.includes('<loc>https://seventaskcalculator.in/calculator.html</loc>'));
console.log('SEO route checks passed');
