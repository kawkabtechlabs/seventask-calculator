#!/usr/bin/env node
const fs=require('node:fs');
const path=require('node:path');
const crypto=require('node:crypto');
const assert=require('node:assert/strict');

const root=path.resolve(__dirname,'..');
const read=file=>fs.readFileSync(path.join(root,file),'utf8');
const install=read('install.html');
const desktopScript=read('desktop-download.js');
const version=/const release = '(\d+\.\d+\.\d+)'/.exec(desktopScript)?.[1];
assert.ok(version,'desktop download version missing');
const manifest=JSON.parse(read(`downloads/desktop-${version}/manifest.json`));
assert.equal(manifest.version,version);
assert.equal(manifest.filename,`SevenTask-Calculator-Setup-${version}.exe`);
assert.ok(install.includes(`Version ${version} · Windows`),'install page desktop version mismatch');
const fullHash=crypto.createHash('sha256');
let total=0;
for(const part of manifest.parts){
  const bytes=fs.readFileSync(path.join(root,`downloads/desktop-${version}`,part.file));
  assert.equal(bytes.length,part.bytes,`${part.file} size mismatch`);
  assert.equal(crypto.createHash('sha256').update(bytes).digest('hex'),part.sha256,`${part.file} hash mismatch`);
  fullHash.update(bytes);total+=bytes.length;
}
assert.equal(total,manifest.bytes,'installer size mismatch');
if(manifest.sha256)assert.equal(fullHash.digest('hex'),manifest.sha256,'installer SHA-256 mismatch');

const update=JSON.parse(read('mobile-update.json'));
const release=JSON.parse(read('release.json'));
const apkUrl=new URL(update.apkUrl);
assert.equal(apkUrl.origin,'https://seventaskcalculator.in');
assert.equal(apkUrl.searchParams.get('build'),String(update.versionCode));
assert.equal(update.versionCode,release.androidVersionCode);
assert.ok(apkUrl.pathname.startsWith(`/downloads/mobile-${update.versionName}/`),'Android release path mismatch');
const apkPath=apkUrl.pathname.slice(1);
assert.equal(fs.statSync(path.join(root,apkPath)).size,update.apkSizeBytes,'APK size mismatch');
assert.ok(install.includes(`${apkPath}?build=${update.versionCode}`),'install page APK link mismatch');
assert.ok(install.includes(`Version ${update.versionName} · Android`),'install page Android version mismatch');
console.log(JSON.stringify({desktopVersion:version,desktopBytes:total,desktopParts:manifest.parts.length,androidVersion:update.versionName,androidCode:update.versionCode,apkBytes:update.apkSizeBytes}));
