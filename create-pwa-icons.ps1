$ErrorActionPreference = 'Stop'
# Render the original vector on white; generated PNGs are never source artwork.
# Requires Node.js and sharp, or an absolute SHARP_MODULE_PATH.
Push-Location $PSScriptRoot
try {
  $js = @"
const fs = require('node:fs');
const sharp = require(process.env.SHARP_MODULE_PATH || 'sharp');
const source = fs.readFileSync('icon.svg', 'utf8')
  .replace(/<svg[^>]*>/, '<svg x="84" y="84" width="344" height="344" viewBox="0 0 64 64" fill="none">');
const artwork = Buffer.from('<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512"><rect width="512" height="512" fill="white"/>' + source + '</svg>');
(async () => {
  for (const [size, name] of [[192, 'icon-192.png'], [512, 'icon-512.png'], [180, 'apple-touch-icon.png']]) {
    await sharp(artwork, { density: 384 }).resize(size, size).png().toFile(name);
  }
  console.log('Created clean calculator icons from icon.svg with no ring.');
})().catch(error => { console.error(error.message); process.exitCode = 1; });
"@
  $js | node
  if ($LASTEXITCODE -ne 0) { throw 'Icon generation failed.' }
} finally { Pop-Location }
