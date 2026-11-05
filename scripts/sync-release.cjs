#!/usr/bin/env node
// Keep published version labels in sync with release.json.
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const release = JSON.parse(fs.readFileSync(path.join(root, 'release.json'), 'utf8'));
const version = release.versionName;
if (!/^\d+\.\d+\.\d+$/.test(version) || !Number.isInteger(release.androidVersionCode) || release.androidVersionCode < 1) {
  throw new Error('release.json needs a numeric versionName and positive androidVersionCode');
}

const previous = JSON.parse(fs.readFileSync(path.join(root, 'mobile-update.json'), 'utf8')).versionName;
const siteFiles = [
  'calculator.html', 'desktop-download.js', 'index.html', 'install.html',
  'llms.txt', 'manifest.webmanifest', 'privacy-policy.html', 'README.md',
  'SevenTask-Calculator-Last-Final-Design-Preview.html', 'sw.js', 'sw-v103.js',
  'promo/product-tour.html'
];
const check = process.argv.includes('--check');
let changed = false;
function sync(file, next) {
  if (!fs.existsSync(file)) return;
  const current = fs.readFileSync(file, 'utf8');
  if (current === next) return;
  changed = true;
  console.log(`${check ? 'Out of sync' : 'Updated'}: ${path.relative(root, file)}`);
  if (!check) fs.writeFileSync(file, next);
}

for (const relative of siteFiles) {
  const file = path.join(root, relative);
  if (!fs.existsSync(file)) continue;
  const current = fs.readFileSync(file, 'utf8');
  let next = current.split(previous).join(version);
  if (relative === 'install.html' || relative === 'calculator.html') {
    next = next.replace(/(SevenTask-Calculator-Android-[0-9.]+\.apk\?build=)\d+/g,
      (_, url) => url + release.androidVersionCode);
  }
  if (relative === 'README.md') next = next.replace(/versionCode \d+/, `versionCode ${release.androidVersionCode}`);
  sync(file, next);
}

const updateFile = path.join(root, 'mobile-update.json');
const update = JSON.parse(fs.readFileSync(updateFile, 'utf8'));
update.versionName = version;
update.versionCode = release.androidVersionCode;
update.apkUrl = `https://seventaskcalculator.in/downloads/mobile-${version}/SevenTask-Calculator-Android-${version}.apk?build=${release.androidVersionCode}`;
const updateEol = fs.readFileSync(updateFile, 'utf8').includes('\r\n') ? '\r\n' : '\n';
sync(updateFile, JSON.stringify(update, null, 2).replace(/\n/g, updateEol) + updateEol);

// The native projects live next to github-live in this workspace. npm uses a
// normalized patch number (1.18.7); the installer filename keeps 1.18.07.
const workspace = path.resolve(root, '..');
const desktopFile = path.join(workspace, 'work', 'release-1.18.07', 'desktop', 'package.json');
if (fs.existsSync(desktopFile)) {
  const pkg = JSON.parse(fs.readFileSync(desktopFile, 'utf8'));
  pkg.version = version.split('.').map(Number).join('.');
  pkg.build.win.artifactName = `SevenTask-Calculator-Setup-${version}.exe`;
  sync(desktopFile, JSON.stringify(pkg, null, 2) + '\n');
}
const gradleFile = path.join(workspace, 'work', 'release-1.18.07', 'android', 'app', 'build.gradle');
if (fs.existsSync(gradleFile)) {
  const gradle = fs.readFileSync(gradleFile, 'utf8')
    .replace(/versionCode\s+\d+/, `versionCode ${release.androidVersionCode}`)
    .replace(/versionName\s+'[^']+'/, `versionName '${version}'`);
  sync(gradleFile, gradle);
}

if (check && changed) process.exitCode = 1;
