(()=>{
  // Web-only adapter: APK AI assets stay untouched; the web AI route uses the full-screen workspace.
  const params=new URLSearchParams(location.search);
  const isWebAI=!window.SevenTaskNative&&!params.has('apk-preview')&&params.get('workspace')==='ai';
  if(isWebAI)document.documentElement.dataset.aiLayout='web';
  const syncVersion=version=>{
    if(!/^\d+\.\d+\.\d+$/.test(version))return;
    document.documentElement.dataset.webVersion=version;
    document.querySelectorAll('.version-mark b').forEach(node=>node.textContent=version);
    const updateShadow=()=>{
      const root=document.querySelector('taskai7-calculator')?.shadowRoot;
      if(!root)return false;
      root.querySelectorAll('.version-number,.ai-dock-version b').forEach(node=>node.textContent=version);
      return root.querySelector('.ai-dock-version b')!==null;
    };
    if(updateShadow())return;
    customElements.whenDefined('taskai7-calculator').then(()=>{
      if(updateShadow())return;
      const root=document.querySelector('taskai7-calculator')?.shadowRoot;
      if(!root)return;
      const observer=new MutationObserver(()=>{if(updateShadow())observer.disconnect()});
      observer.observe(root,{childList:true,subtree:true});
      setTimeout(()=>observer.disconnect(),10000);
    }).catch(()=>{});
  };
  fetch('/release.json',{cache:'no-store',credentials:'omit'}).then(response=>response.ok?response.json():null).then(release=>{
    if(release?.versionName)syncVersion(String(release.versionName));
  }).catch(()=>{});
})();
