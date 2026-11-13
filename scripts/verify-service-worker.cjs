#!/usr/bin/env node
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const assert=require('node:assert/strict');

const handlers={},stores=new Map([['seventask-calculator-shell-old',new Map()]]);
let failedPath='./calculator-core.js',skipped=0,claimed=0;
const caches={
  open:async name=>{
    if(!stores.has(name))stores.set(name,new Map());
    return {put:async(request,response)=>stores.get(name).set(request.url,response),match:async request=>stores.get(name).get(typeof request==='string'?request:request.url)};
  },
  keys:async()=>[...stores.keys()],
  delete:async name=>stores.delete(name),
};
const self={
  location:{origin:'https://seventaskcalculator.in'},
  addEventListener:(name,handler)=>{handlers[name]=handler;},
  skipWaiting:async()=>{skipped++;},
  clients:{claim:async()=>{claimed++;}},
};
const context={self,caches,Request:class{constructor(url){this.url=url;}},fetch:async request=>({ok:request.url!==failedPath,status:request.url===failedPath?503:200}),URL,Response};
vm.runInNewContext(fs.readFileSync(path.join(__dirname,'..','sw.js'),'utf8'),context);
async function dispatch(name){let pending;handlers[name]({waitUntil:promise=>{pending=promise;}});return pending;}
(async()=>{
  await assert.rejects(dispatch('install'),/Core asset unavailable/);
  assert.equal(skipped,0,'failed core caching must not activate the new worker');
  assert.ok(stores.has('seventask-calculator-shell-old'),'old offline cache must remain after failed install');
  failedPath=null;
  await dispatch('install');
  assert.equal(skipped,1,'complete core caching may activate the new worker');
  await dispatch('activate');
  assert.equal(claimed,1);
  assert.ok(!stores.has('seventask-calculator-shell-old'),'old cache is deleted only after successful activation');
  console.log('Service worker install and cache migration checks passed');
})().catch(error=>{console.error(error);process.exitCode=1;});
