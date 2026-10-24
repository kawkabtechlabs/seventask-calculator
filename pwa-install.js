(()=>{
  let promptEvent=null;
  const statusFor=button=>button.closest('[data-pwa-card]')?.querySelector('[data-pwa-status]')||document.querySelector('[data-pwa-status]');
  const installed=()=>window.matchMedia?.('(display-mode: standalone)').matches||navigator.standalone===true;
  window.addEventListener('beforeinstallprompt',event=>{event.preventDefault();promptEvent=event;document.querySelectorAll('[data-pwa-install]').forEach(button=>button.removeAttribute('aria-disabled'));});
  window.addEventListener('appinstalled',()=>{promptEvent=null;document.querySelectorAll('[data-pwa-status]').forEach(node=>node.textContent='SevenTask PWA is installed on this device.');});
  document.addEventListener('click',async event=>{
    const button=event.target.closest('[data-pwa-install]');if(!button)return;
    event.preventDefault();if(button.dataset.busy==='true')return;
    const status=statusFor(button);const ua=navigator.userAgent||'';
    if(installed()){if(status)status.textContent='SevenTask is already installed on this device.';return;}
    if(promptEvent){button.dataset.busy='true';button.setAttribute('aria-busy','true');try{await promptEvent.prompt();const choice=await promptEvent.userChoice;if(status)status.textContent=choice?.outcome==='accepted'?'Install prompt accepted. SevenTask is being added to your home screen.':'Install cancelled. Use your browser menu whenever you are ready.';promptEvent=null;}catch(error){console.error('PWA install prompt failed:',error);if(status)status.textContent='Install prompt could not open. Use your browser menu to install SevenTask.';}finally{button.dataset.busy='false';button.removeAttribute('aria-busy');}return;}
    if(status){if(/android/i.test(ua))status.textContent='To install: open this page in Chrome or Edge, tap ⋮, then choose “Install app” or “Add to Home screen”.';else if(/iphone|ipad|ipod/i.test(ua))status.textContent='To install on iPhone/iPad: open this page in Safari, tap Share, then “Add to Home Screen”.';else status.textContent='Open this page on Android in Chrome or Edge, then use ⋮ → “Install app” or “Add to Home screen”.';}
  });
})();