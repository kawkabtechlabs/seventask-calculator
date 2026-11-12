#!/usr/bin/env node
// Web version labels follow release.json. Native downloads follow actual builds.
const fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..');
const version=JSON.parse(fs.readFileSync(path.join(root,'release.json'),'utf8')).versionName;
if(!/^\d+\.\d+\.\d+$/.test(version))throw new Error('Invalid web release version');
const check=process.argv.includes('--check');let changed=false;
function update(relative,transform){const file=path.join(root,relative);if(!fs.existsSync(file))return;const current=fs.readFileSync(file,'utf8'),next=transform(current);if(current===next)return;changed=true;console.log((check?'Out of sync: ':'Updated: ')+relative);if(!check)fs.writeFileSync(file,next)}
update('calculator-core.js',text=>text.replace(/(class="version-number">)[^<]+/,'$1'+version));
update('index.html',text=>text.replace(/(<span class="version-mark"><span>TOUHID<\/span><b>)[^<]+/,'$1'+version));
for(const file of ['sw.js','sw-v103.js'])update(file,text=>text.replace(/const CACHE = "[^"]+"/,'const CACHE = "seventask-calculator-shell-'+version+'"'));
if(check&&changed)process.exitCode=1;
