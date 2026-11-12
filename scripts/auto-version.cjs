// Increment the web version once per changed application source set.
// Download metadata remains tied to real APK/EXE builds.
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const root=path.resolve(__dirname,'..');
const releasePath=path.join(root,'release.json');
const release=JSON.parse(fs.readFileSync(releasePath,'utf8'));
const sourceFiles=['calculator.html','mobile-settings.js','index.html','install.html','pwa-install.js','desktop-download.js','manifest.webmanifest','sw.js','sw-v103.js'];
const normalize=s=>s.replace(/\r\n/g,'\n').replace(/\d+\.\d+\.\d+/g,'VERSION').replace(/seventask-calculator-shell-[\w.-]+/g,'CACHE_VERSION');
const hash=crypto.createHash('sha256');
for(const file of sourceFiles)hash.update(file+'\n'+normalize(fs.readFileSync(path.join(root,file),'utf8')));
const fingerprint=hash.digest('hex');
const statePath=path.join(root,'scripts','.web-release-state.json');
const state=fs.existsSync(statePath)?JSON.parse(fs.readFileSync(statePath,'utf8')):null;
if(state?.fingerprint===fingerprint){console.log('No application changes; version unchanged.');process.exit(0);}
const prior=release.versionName;
if(state&&!process.argv.includes('--baseline')){
 const [major,minor,patch]=prior.split('.').map(Number);
 release.versionName=`${major}.${minor}.${String(patch+1).padStart(2,'0')}`;
 for(const file of ['calculator.html','SevenTask-Calculator-Last-Final-Design-Preview.html']){
  const p=path.join(root,file);if(!fs.existsSync(p))continue;
  fs.writeFileSync(p,fs.readFileSync(p,'utf8').replace(/(class="version-number">)[^<]+/g,'$1'+release.versionName));
 }
}
for(const file of ['sw.js','sw-v103.js']){const p=path.join(root,file);fs.writeFileSync(p,fs.readFileSync(p,'utf8').replace(/const CACHE = "[^"]+"/,`const CACHE = "seventask-calculator-shell-${release.versionName}"`));}
fs.writeFileSync(releasePath,JSON.stringify(release,null,2)+'\n');
fs.writeFileSync(statePath,JSON.stringify({fingerprint,version:release.versionName},null,2)+'\n');
console.log('Web release '+release.versionName);
