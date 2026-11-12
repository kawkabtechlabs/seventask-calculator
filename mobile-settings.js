(() => {
  if (window.__sevenMobileSettings) return;
  window.__sevenMobileSettings = true;
  document.addEventListener('pointerdown', event => {
    if (localStorage.getItem('stc-vibration-enabled') === 'false') return;
    if (event.composedPath().some(node => node?.tagName === 'BUTTON')) {
      if(window.SevenTaskNative?.vibrate)window.SevenTaskNative.vibrate();
      else if(!window.SevenTaskHaptics)navigator.vibrate?.(12);
    }
  }, true);
  function mount() {
    const app=document.querySelector('taskai7-calculator');
    const root=app?.shadowRoot;
    const panel=root?.querySelector('.infopanel');
    if (!panel || panel.querySelector('.st-settings')) return false;
    const style=document.createElement('style');
    style.textContent=`
      .win{border:3px solid #25282d!important;box-sizing:border-box!important}
      .win.popup-mode{top:3px!important;left:3px!important;width:calc(100% - 6px)!important;height:calc(100% - 6px)!important}
      .win[data-theme="dark"]{border-color:#b8c0ca!important}
      .win .titlebar .dotmenu{width:42px!important;height:42px!important;flex:0 0 42px!important;margin-right:4px!important;border:0!important;border-radius:0!important;background:transparent!important;color:#17181b!important;box-shadow:none!important}
      .win .titlebar .dotmenu svg{width:29px!important;height:29px!important;stroke-width:2.2}
      .win .titlebar .dotmenu .st-menu-line{transform-box:fill-box;transform-origin:center;transition:transform .24s ease,opacity .16s ease}
      .win .titlebar .dotmenu:hover{background:transparent!important;transform:scale(1.06)}
      .win .titlebar .dotmenu:active{transform:scale(.9)}
      .win .titlebar .dotmenu[aria-expanded="true"] .st-menu-top{transform:translateY(6px) rotate(45deg)}
      .win .titlebar .dotmenu[aria-expanded="true"] .st-menu-middle{opacity:0;transform:scaleX(.4)}
      .win .titlebar .dotmenu[aria-expanded="true"] .st-menu-bottom{transform:translateY(-6px) rotate(-45deg)}
      .win[data-theme="dark"] .titlebar .dotmenu{color:#f0f2f5!important}
      .win .infobrand .info-close-btn{width:38px!important;height:38px!important;flex:0 0 38px!important;border:0!important;border-radius:0!important;background:transparent!important;color:#17181b!important;box-shadow:none!important}
      .win .infobrand .info-close-btn svg{width:24px!important;height:24px!important;stroke-width:2.6!important}
      .win .infobrand .info-close-btn:hover{background:transparent!important;transform:scale(1.08)}
      .win[data-theme="dark"] .infobrand .info-close-btn{color:#f0f2f5!important}
      @media(prefers-reduced-motion:reduce){.win .titlebar .dotmenu .st-menu-line{transition:none}}
      .win .infopanel{box-sizing:border-box!important;border:2px solid #25282d!important;border-right-width:3px!important;box-shadow:none!important}
      .win .infopanel.open{transform:none!important}
      .win .infopanel.open .info-links>*{transform:none!important}
      .win .infopanel :is(.infoabout,.infolabel,.theme-label,.theme-dropdown summary,.theme-options button,.info-links button,.info-links a,.st-settings-toggle,.st-settings-label){font-family:system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",Arial,sans-serif!important;font-synthesis:none!important;font-optical-sizing:auto!important;-webkit-font-smoothing:auto!important;text-rendering:auto!important}
      .win .infopanel .infoabout{font-size:13px!important;font-weight:400!important;line-height:1.55!important}
      .win .infopanel :is(.infolabel,.theme-label,.st-settings-label){font-size:13px!important;font-weight:600!important}
      .win .infopanel :is(.theme-dropdown summary,.theme-options button,.info-links button,.info-links a,.st-settings-toggle){font-size:13px!important;font-weight:600!important}
      .win[data-theme="dark"] .infopanel{border-color:#b8c0ca!important}
      .st-settings{border-top:0;margin:0;padding:10px 0 4px;color:#17181b}
      .st-settings-toggle{display:flex;align-items:center;justify-content:space-between;width:100%;min-height:48px;padding:9px 12px;border:1.5px solid #45484c;border-radius:11px;background:#fff;color:inherit;text-align:left;cursor:pointer;font:700 13px system-ui,sans-serif}
      .st-settings-heading{display:flex;align-items:center;gap:9px}.st-settings-heading svg,.infopanel .st-menu-icon{width:18px;height:18px;flex:none;color:currentColor;display:block}
      .infopanel .st-arrow-icon{width:16px;height:16px;flex:none;display:block;color:currentColor}
      .st-settings-chevron{width:16px;height:16px;transition:transform .18s}.st-settings-toggle[aria-expanded="true"] .st-settings-chevron{transform:rotate(180deg)}
      .st-settings-body{padding:5px 12px 2px;border:1.5px solid #45484c;border-top:0;border-radius:0 0 11px 11px;margin-top:-8px;padding-top:12px}.st-settings-body[hidden]{display:none}
      .st-settings-body .theme-choice{padding:8px 0 12px;margin:0;border-bottom:1px solid #d9dce0;animation:none!important}
      .st-settings-toggle[aria-expanded="true"]{border-radius:11px 11px 0 0}
      .st-settings-row{display:flex;align-items:center;justify-content:space-between;gap:12px;min-height:58px;padding:8px 0;border-bottom:1px solid #d9dce0}
      .st-settings-label{font:650 13px/1.2 system-ui,sans-serif}
      .st-size-control{display:grid;gap:2px;flex:none;width:112px;color:#686d75}.st-size-control input{width:100%;height:18px;margin:0;accent-color:#17181b;cursor:pointer}.st-size-labels{display:flex;justify-content:space-between;font:700 10px system-ui,sans-serif}.win[data-theme="dark"] .st-size-control{color:#c7cbd2}.win[data-theme="dark"] .st-size-control input{accent-color:#dfe3ea}
      .st-dropdown-align{position:relative;flex:none;width:112px}.st-dropdown-align summary{list-style:none;display:flex;align-items:center;justify-content:space-between;min-height:38px;padding:7px 10px;border:1.5px solid #45484c;border-radius:10px;background:var(--theme-menu,#fff);color:inherit;font:650 12px system-ui,sans-serif;cursor:pointer}.st-dropdown-align summary::-webkit-details-marker{display:none}.st-dropdown-align summary svg{width:14px;height:14px;transition:transform .18s}.st-dropdown-align[open] summary svg{transform:rotate(180deg)}.st-dropdown-align summary:hover{background:var(--theme-hover,#f1f2f4)}.st-dropdown-options{position:absolute;top:calc(100% + 4px);right:0;z-index:60;width:100%;padding:4px;border:1.5px solid #45484c;border-radius:10px;background:var(--theme-menu,#fff);box-shadow:0 8px 20px #0002}.st-dropdown-options button{display:block;width:100%;padding:8px;border:0;border-radius:7px;background:transparent;color:inherit;text-align:left;font:650 12px system-ui,sans-serif;cursor:pointer}.st-dropdown-options button:hover,.st-dropdown-options button[aria-pressed="true"]{background:var(--theme-hover,#eceef1)}.st-dropdown-options button[aria-pressed="true"]::after{content:"✓";float:right}
      .st-settings-row:has(.st-dropdown-align[open]){align-items:flex-start}.st-dropdown-align{max-width:calc(100% - 100px);box-sizing:border-box}.st-dropdown-options{position:static;top:auto;right:auto;width:100%;max-width:100%;box-sizing:border-box;margin-top:4px;box-shadow:none}
      .st-settings-row [data-st-clear-undo]{flex:none;min-width:58px;min-height:32px;padding:5px 10px;border:1.5px solid #45484c;border-radius:8px;background:#fff;color:#17181b;font:650 12px/1.2 system-ui,sans-serif;cursor:pointer;transition:background .15s,transform .15s}.st-settings-row [data-st-clear-undo]:hover{background:#f0f1f3}.st-settings-row [data-st-clear-undo]:active{transform:scale(.96)}.st-settings-row [data-st-clear-undo]:focus-visible{outline:2px solid currentColor;outline-offset:2px}
      .st-switch{position:relative;flex:none;width:48px;height:29px;border:2px solid #45484c;border-radius:99px;background:#e5e7e9;cursor:pointer;transition:background .18s}
      .st-switch::after{content:"";position:absolute;top:3px;left:3px;width:19px;height:19px;border-radius:50%;background:#fff;box-shadow:0 1px 3px #0004;transition:transform .18s}
      .st-switch[aria-checked="true"]{background:#17181b}.st-switch[aria-checked="true"]::after{transform:translateX(19px)}
      .st-switch:focus-visible{outline:3px solid #767b85;outline-offset:2px}
      .win[data-theme="dark"] .st-settings{color:#f0f1f2;border-color:#a4abb5}.win[data-theme="dark"] .st-settings-toggle{background:#24272d;color:#f0f1f2;border-color:#a4abb5}.win[data-theme="dark"] .st-settings-body{border-color:#a4abb5}.win[data-theme="dark"] .st-settings-row{border-color:#545b65}
      .win[data-theme="dark"] .st-settings-row [data-st-clear-undo]{background:#24272d;border-color:#a4abb5;color:#f0f1f2}.win[data-theme="dark"] .st-settings-row [data-st-clear-undo]:hover{background:#353a42}
      .win[data-theme="dark"] .st-dropdown-align :is(summary,.st-dropdown-options){background:#30343a;border-color:#a4abb5;color:#f0f1f2}.win[data-theme="dark"] .st-dropdown-options button:hover,.win[data-theme="dark"] .st-dropdown-options button[aria-pressed="true"]{background:#505762}
      .win[data-dropdown-size="small"] .modebtn{flex-basis:320px;width:min(320px,100%)}.win[data-dropdown-size="small"] .modemenu{width:min(320px,calc(100% - 24px))!important}
      .win[data-dropdown-size="large"] .modebtn{flex:1 1 auto;width:100%;max-width:none}
      .win[data-dropdown-size="large"] .modemenu{width:calc(100% - 24px)!important;max-width:none!important}
      .win[data-theme="dark"] .st-switch{border-color:#a4abb5}.win[data-theme="dark"] .st-switch[aria-checked="true"]{background:#dfe3ea}.win[data-theme="dark"] .st-switch[aria-checked="true"]::after{background:#17181b}
      .infopanel .update-status:not([hidden]){display:block;margin:4px 0 6px;padding:10px 12px;border:1.5px solid var(--ui-divider,#45484c);border-radius:10px;background:var(--theme-surface,#f6f7f8);color:inherit;font:600 11px/1.45 system-ui,sans-serif}
      .infopanel [data-action="download-app-update"]:not([hidden]),.infopanel [data-action="reload-web-update"]:not([hidden]){border-width:1.5px!important;font-weight:700!important}
    `;
    if(window.sevenTaskDesktop)style.textContent+=' .win.popup-mode{top:0!important;left:0!important;width:100%!important;height:100%!important}';
    root.appendChild(style);
    const section=document.createElement('section'); section.className='st-settings'; section.setAttribute('aria-label','App settings');
    section.innerHTML=`<button class="st-settings-toggle" type="button" aria-expanded="false" aria-controls="st-settings-body"><span class="st-settings-heading"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="3"/><path d="M10 2h4l.5 2.2c.6.2 1.2.4 1.7.7l2-1.1 2.8 2.8-1.1 2c.3.5.5 1.1.7 1.7L22 10v4l-2.2.5c-.2.6-.4 1.2-.7 1.7l1.1 2-2.8 2.8-2-1.1c-.5.3-1.1.5-1.7.7L14 22h-4l-.5-2.2c-.6-.2-1.2-.4-1.7-.7l-2 1.1-2.8-2.8 1.1-2c-.3-.5-.5-1.1-.7-1.7L2 14v-4l2.2-.5c.2-.6.4-1.2.7-1.7l-1.1-2L6.6 3l2 1.1c.5-.3 1.1-.5 1.7-.7L10 2Z"/></svg><span>Settings</span></span><svg class="st-settings-chevron" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="m3 6 5 5 5-5"/></svg></button><div class="st-settings-body" id="st-settings-body" hidden>
      <div class="st-settings-row"><label class="st-settings-label" for="st-dropdown-size">Dropdown Size</label><span class="st-size-control"><input id="st-dropdown-size" type="range" min="0" max="2" step="1" value="2" aria-label="Dropdown size"><span class="st-size-labels" aria-hidden="true"><span>S</span><span>M</span><span>L</span></span></span></div>
      <div class="st-settings-row"><span class="st-settings-label">Notifications</span><button class="st-switch" type="button" role="switch" aria-label="Notifications" data-st-notifications aria-checked="false"></button></div>
      <div class="st-settings-row"><span class="st-settings-label">Vibration</span><button class="st-switch" type="button" role="switch" aria-label="Vibration" data-st-vibration aria-checked="true"></button></div>
      <div class="st-settings-row"><span class="st-settings-label">Undo/Redo (History)</span><button type="button" data-st-clear-undo aria-label="Clear undo and redo history">Clear</button></div></div>`;
    section.querySelector('[data-st-clear-undo]').addEventListener('click',()=>{ panel.getRootNode().host?.clearUndoRedoHistory?.(); });
    const alignment=section.querySelector('#st-dropdown-size'),win=root.querySelector('.win');
    let dropdownSize='large';try{const saved=localStorage.getItem('stc-dropdown-size')||localStorage.getItem('stc-dropdown-align');dropdownSize=saved==='small'||saved==='medium'||saved==='large'?saved:saved==='left'||saved==='right'||saved==='wide'?'large':'large'}catch{}
    const sizes=['small','medium','large'];
    const applyDropdownSize=size=>{win.dataset.dropdownSize=size;alignment.value=String(sizes.indexOf(size));alignment.setAttribute('aria-valuetext',size[0].toUpperCase()+size.slice(1))};
    applyDropdownSize(dropdownSize);
    alignment.addEventListener('input',()=>{dropdownSize=sizes[Number(alignment.value)]||'large';applyDropdownSize(dropdownSize);try{localStorage.setItem('stc-dropdown-size',dropdownSize)}catch{}});
    const theme=panel.querySelector('.theme-choice');
    if(theme)theme.after(section); else panel.appendChild(section);
    if(theme)section.querySelector('.st-settings-body').prepend(theme);
    panel.querySelector('.shortcut-section')?.remove();
    section.querySelector('.st-settings-toggle').addEventListener('click',event=>{
      const button=event.currentTarget,body=section.querySelector('.st-settings-body');
      const open=button.getAttribute('aria-expanded')!=='true';
      button.setAttribute('aria-expanded',String(open));body.hidden=!open;
    });
    const notify=section.querySelector('[data-st-notifications]');
    const vibrate=section.querySelector('[data-st-vibration]');
    const sync=()=>{
      try { notify.setAttribute('aria-checked', String(window.SevenTaskNative?.notificationsEnabled?.() ?? (localStorage.getItem('stc-notifications-enabled')==='true'))); } catch {}
      try { vibrate.setAttribute('aria-checked', String(window.SevenTaskNative?.vibrationEnabled?.() ?? window.SevenTaskHaptics?.enabled?.() ?? (localStorage.getItem('stc-vibration-enabled')!=='false'))); } catch {}
    };
    notify.addEventListener('click',()=>{
      if(window.SevenTaskNative?.openNotificationSettings){window.SevenTaskNative.openNotificationSettings();return;}
      const next=notify.getAttribute('aria-checked')!=='true';
      localStorage.setItem('stc-notifications-enabled',String(next));
      notify.setAttribute('aria-checked',String(next));
    });
    vibrate.addEventListener('click',()=>{
      const next=vibrate.getAttribute('aria-checked')!=='true';
      window.SevenTaskHaptics?.setEnabled?.(next);
      window.SevenTaskNative?.setVibrationEnabled?.(next);
      localStorage.setItem('stc-vibration-enabled',String(next));
      vibrate.setAttribute('aria-checked',String(next));
    });
    document.addEventListener('visibilitychange',()=>{if(!document.hidden)sync()});
    panel.addEventListener('pointerdown',sync,true);
    sync();
    return true;
  }
  let count=0; const timer=setInterval(()=>{if(mount()||++count>40)clearInterval(timer)},250);
})();
