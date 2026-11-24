#!/usr/bin/env node
const fs=require('node:fs');
const path=require('node:path');
const assert=require('node:assert/strict');

const root=path.resolve(__dirname,'..');
const read=file=>fs.readFileSync(path.join(root,file),'utf8');
const install=read('install.html');
assert.ok(install.includes('Windows installer unavailable'),'unpublished desktop installer must not be offered');

const update=JSON.parse(read('mobile-update.json'));
const release=JSON.parse(read('release.json'));
const apkUrl=new URL(update.apkUrl);
assert.equal(apkUrl.origin,'https://github.com');
assert.match(apkUrl.pathname,/^\/kawkabtechlabs\/seventask-android-releases\/releases\/download\/v[0-9.]+\/SevenTask-Calculator-Android-[0-9.]+\.apk$/);
assert.equal(update.versionCode,release.androidVersionCode);
assert.ok(apkUrl.pathname.includes(`/v${update.versionName}/SevenTask-Calculator-Android-${update.versionName}.apk`),'Android release path mismatch');
assert.ok(install.includes(update.apkUrl),'install page APK link mismatch');
assert.ok(install.includes(`Version ${update.versionName} · Android`),'install page Android version mismatch');
console.log(JSON.stringify({desktopAvailable:false,androidVersion:update.versionName,androidCode:update.versionCode,apkBytes:update.apkSizeBytes}));
