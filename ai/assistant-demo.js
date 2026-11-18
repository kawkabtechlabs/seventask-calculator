(()=>{let mounted=false;function mount(){const app=document.querySelector('taskai7-calculator'),root=app?.shadowRoot,win=root?.querySelector('.win');if(!win||mounted)return;mounted=true;
const css=document.createElement('style');css.textContent=`.ai-dock{position:absolute;z-index:120;bottom:4px;left:4px;right:4px;background:var(--theme-surface,#fff);color:var(--ui-text,#111);border:2px solid #111114;border-radius:14px;box-shadow:0 -6px 25px #0002;font:14px/1.4 'DM Sans',sans-serif;overflow:hidden}.ai-dock[hidden]{display:none}.ai-head{width:100%;border:0;background:transparent;color:inherit;text-align:left;padding:10px 12px;display:flex;align-items:center;gap:9px;font-weight:700;cursor:pointer}.ai-badge{width:30px;height:30px;border:1.5px solid currentColor;border-radius:10px;display:grid;place-items:center;font-size:13px}.ai-label{flex:1}.ai-label small{display:block;color:#777;font-weight:400;font-size:10px}.ai-content{padding:0 10px 10px}.ai-content[hidden]{display:none}.ai-chat{height:110px;overflow:auto;border-radius:10px;background:#f3f4f6;color:#23252a;padding:10px;font-size:12px}.ai-chat p{margin:4px 0 8px}.ai-chat .you{text-align:right}.ai-form{display:flex;gap:4px;margin-top:8px}.ai-form input{width:1px;flex:1;min-width:0;border:1px solid #bbb;border-radius:10px;padding:8px;background:#fff;color:#111;font:inherit}.ai-form button,.ai-tools button{border:1px solid #c8c8cc;border-radius:9px;background:#fff;color:#111;padding:7px;cursor:pointer}.ai-form .send{background:#111;color:white;border-color:#111;padding:7px 12px}.ai-tools{display:flex;gap:5px;margin-top:6px}.ai-tools button{font-size:11px}.ai-setting{display:flex;justify-content:space-between;gap:10px;align-items:center;margin:10px 0;padding:11px;border:1px solid #b6b9bd;border-radius:12px;font:600 13px 'DM Sans',sans-serif}.ai-setting button{border:1px solid #111;border-radius:20px;background:#111;color:white;padding:5px 12px;cursor:pointer}.ai-setting button[aria-checked=false]{background:#eee;color:#111}.ai-draw{position:absolute;inset:5%;z-index:160;background:white;color:#111;border:2px solid #111;border-radius:14px;padding:12px;box-shadow:0 8px 30px #0004}.ai-draw[hidden]{display:none}.ai-draw canvas{width:100%;height:55%;border:1px solid #aaa;border-radius:9px;touch-action:none}.ai-draw button{padding:8px;border:1px solid #bbb;background:white;border-radius:8px} 
.ai-dock{border:1.5px solid var(--ui-divider,#25282d);border-radius:16px;background:var(--theme-surface,#fff);box-shadow:0 -8px 28px #13161c1a;font-family:'DM Sans',system-ui,sans-serif}
.ai-head{padding:10px 13px;gap:10px;min-height:56px}.ai-head:hover{background:#8881}.ai-badge{width:36px;height:36px;border:1px solid #c8cbd0;border-radius:11px;background:#fff;box-shadow:0 2px 4px #1111;flex:none}.ai-badge img{width:24px;height:28px;object-fit:contain}
.ai-label{font:400 16px/1.1 'Fjalla One',sans-serif;letter-spacing:.01em}.ai-label small{font:500 10px/1.3 'DM Sans',sans-serif;margin-top:3px;color:var(--ai-muted,#71767e)}.chev svg{width:18px;height:18px;display:block;transition:transform .2s}.ai-head[aria-expanded=false] .chev svg{transform:rotate(180deg)}
.ai-content{padding:0 12px 11px}.ai-chat{height:105px;padding:11px 12px;border:1px solid var(--ai-line,#e4e5e8);border-radius:12px;background:var(--ai-chat,#f7f8fa);color:inherit;font-size:12px;scrollbar-width:thin}.ai-chat p{margin:0 0 8px;max-width:90%;line-height:1.5}.ai-chat p.you{margin-left:auto;text-align:left;background:#111114;color:#fff;border-radius:11px 11px 3px 11px;padding:8px 10px;width:max-content}.ai-chat b{font:400 14px 'Fjalla One',sans-serif;letter-spacing:.01em}
.ai-form{gap:6px;margin-top:9px;align-items:stretch}.ai-form input{height:42px;border:1px solid var(--ai-line,#cfd1d5);border-radius:11px;padding:0 12px;outline:none;background:var(--ai-input,#fff);color:inherit}.ai-form input:focus{border-color:currentColor;box-shadow:0 0 0 3px #8882}.ai-form button{height:42px;min-width:42px;padding:0;display:grid;place-items:center;border-radius:11px;background:var(--ai-input,#fff);color:inherit;border-color:var(--ai-line,#cfd1d5)}.ai-form button svg,.ai-tools button svg{width:18px;height:18px;display:block;fill:none;stroke:currentColor;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round}.ai-form button:hover,.ai-tools button:hover{background:#8882}.ai-form .send{display:flex;gap:5px;padding:0 13px;background:#111114;color:#fff;border-color:#111114;font-weight:700}.ai-form .send svg{width:15px;height:15px}.ai-tools{align-items:center;gap:6px;margin-top:7px}.ai-tools button{display:flex;align-items:center;gap:5px;padding:6px 9px;border-radius:9px;background:var(--ai-input,#fff);color:inherit;border-color:var(--ai-line,#d7d9dd);font:600 11px 'DM Sans',sans-serif}.ai-tools button svg{width:14px;height:14px}.ai-tools .state{margin-left:auto;color:var(--ai-muted,#71767e)!important}.ai-draw{background:var(--ai-input,#fff);color:inherit}.ai-draw canvas{background:white}
:is(.win,.ai-shell)[data-theme=dark] .ai-dock{--ai-chat:#30343a;--ai-input:#25292e;--ai-line:#565d66;--ai-muted:#c5c9ce;color:#f4f5f7}:is(.win,.ai-shell)[data-theme=dark] .ai-badge{background:#fff}:is(.win,.ai-shell)[data-theme=soft] .ai-dock{--ai-chat:#edf4ee;--ai-input:#f8fbf8;--ai-line:#bccdc0}:is(.win,.ai-shell)[data-theme=cloud] .ai-dock{--ai-chat:#f2edf8;--ai-input:#fdfbff;--ai-line:#d1c5df}:is(.win,.ai-shell)[data-theme=blue] .ai-dock{--ai-chat:#edf5fa;--ai-input:#f9fcff;--ai-line:#b7ccd9}:is(.win,.ai-shell)[data-theme=rose] .ai-dock{--ai-chat:#f8eeee;--ai-input:#fffafa;--ai-line:#dcc2c2}:is(.win,.ai-shell)[data-theme=sand] .ai-dock{--ai-chat:#f6f0e6;--ai-input:#fffcf6;--ai-line:#d8cbb6}
@media(max-width:420px){.ai-head{min-height:50px;padding:7px 9px}.ai-badge{width:32px;height:32px}.ai-badge img{width:21px;height:25px}.ai-content{padding:0 8px 8px}.ai-chat{height:86px}.ai-form{gap:4px}.ai-form button{min-width:38px;height:40px}.ai-form input{height:40px;font-size:12px}.ai-form .send{padding:0 9px}.ai-tools .state{font-size:9px!important}}
`;root.append(css);
const dock=document.createElement('section');dock.className='ai-dock';dock.innerHTML=`<button class="ai-head" type="button" aria-expanded="true"><span class="ai-badge"><img src="icon.svg" alt=""></span><span class="ai-label">SevenTask AI <small>Offline commands</small></span><span class="chev"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg></span></button><div class="ai-content"><div class="ai-chat" aria-live="polite"><p><b>SevenTask AI</b><br>Ask me a calculation. Try “18% of 2500” or “22 + 22”.</p></div><form class="ai-form"><input aria-label="Ask SevenTask AI" placeholder="Ask or enter a calculation…"><button type="button" class="camera" aria-label="Use camera" title="Use camera"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h3l1.5-2h7L17 7h3a1 1 0 0 1 1 1v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a1 1 0 0 1 1-1Z"/><circle cx="12" cy="13" r="3.2"/></svg></button><button type="button" class="voice" aria-label="Voice command" title="Voice command"><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="9" y="3" width="6" height="12" rx="3"/><path d="M5.5 11.5a6.5 6.5 0 0 0 13 0M12 18v3m-3 0h6"/></svg></button><button type="submit" class="send">Ask <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 19V5m-6 6 6-6 6 6"/></svg></button></form><div class="ai-tools"><button type="button" class="attach"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m20 11-8 8a5 5 0 0 1-7-7l8-8a3.5 3.5 0 0 1 5 5l-8 8a2 2 0 0 1-3-3l7.5-7.5"/></svg> Attach</button><button type="button" class="draw"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 20h4l11-11-4-4L4 16v4ZM13 7l4 4M3 21h18"/></svg> Draw</button><span class="state" style="font-size:10px;color:#777;align-self:center">Local demo · AI not connected</span></div><input class="file" type="file" accept="image/*" hidden><input class="photo" type="file" accept="image/*" capture="environment" hidden></div>`;
const shell=document.createElement('section');
const mobileLayout=document.documentElement.dataset.aiLayout==='mobile';
shell.className='ai-shell';
shell.hidden=true;
shell.setAttribute('aria-label','SevenTask AI Calculator');
if(!mobileLayout)root.append(shell);
const assistantFrame=mobileLayout?win:shell;
assistantFrame.append(dock);
const shellStyle=document.createElement('style');
shellStyle.textContent=''+`
  .win.ai-view-hidden{visibility:hidden!important;pointer-events:none!important}
  .ai-shell{position:fixed;inset:0;display:grid;place-items:center;padding:14px;pointer-events:auto;z-index:1000002;box-sizing:border-box;background:radial-gradient(circle,#7772 1px,transparent 1.2px) 0 0/20px 20px,var(--theme-surface,#fff)}
  .ai-shell[hidden]{display:none}
  .ai-shell .ai-dock{position:relative;inset:auto;width:min(100%,860px);height:min(500px,100%);min-width:0;min-height:0;display:flex;flex-direction:column;margin:0;border:2px solid var(--ui-divider,#25282d);border-radius:20px;background:var(--theme-surface,#fff);box-shadow:0 20px 48px #11111425;pointer-events:auto;container-type:inline-size}
  .ai-shell .ai-head{
    box-sizing:border-box;display:grid;grid-template-columns:minmax(0,1fr) auto minmax(0,1fr);align-items:center;gap:12px;min-height:64px;
    flex:none;padding:9px 14px;cursor:default;
    background:var(--theme-surface,#fff);border-bottom:1px solid var(--ai-line,#d8dbe0)
  }
  .ai-workspace-brand{display:flex;align-items:center;gap:inherit;min-width:0}
  .ai-shell .ai-head .ai-label{flex:1;min-width:0;line-height:1.2}
  .ai-shell .ai-head .ai-label small{margin-top:4px;font-size:11px}
  .ai-shell .ai-head .ai-badge{width:34px;height:38px}
  .ai-workspace-switch{display:inline-flex;align-items:center;justify-content:center;gap:3px;flex:none;padding:4px;border:1.5px solid var(--ai-line,#cbd0d7);border-radius:12px;background:var(--ai-chat,#f2f3f5)}
  .ai-workspace-switch>*{display:grid;place-items:center;min-height:34px;padding:0 10px;border-radius:8px;color:inherit;text-decoration:none;font:750 11px/1 'DM Sans',system-ui,sans-serif}
  .ai-workspace-switch a:hover{background:var(--ai-input,#fff)}
  .ai-workspace-switch [aria-current]{background:var(--ai-input,#fff);box-shadow:0 1px 3px #1112}
  .ai-workspace-switch a:focus-visible{outline:2px solid currentColor;outline-offset:1px}
  .ai-shell .ai-content{--ai-content-gutter:12px;display:flex;flex:1;min-height:0;flex-direction:column;padding:10px var(--ai-content-gutter)}
  .ai-shell .ai-chat{flex:1;min-height:0;height:auto;margin-inline:calc(-1 * var(--ai-content-gutter));border:1.5px solid var(--ui-divider,#858a91);border-radius:0}
  .ai-shell .ai-form,.ai-shell .ai-tools{flex:none}
  .ai-view-actions{display:flex;align-items:center;justify-self:end;gap:16px}
  .ai-view-actions button{border:1px solid var(--ui-divider,#858a91);border-radius:11px;background:transparent;color:inherit;cursor:pointer}
  .ai-view-actions button{
    display:inline-flex;align-items:center;justify-content:center;gap:7px;
    min-width:44px;min-height:44px;padding:0 12px;
    font:700 12px/1 'DM Sans',system-ui,sans-serif;white-space:nowrap;
    transition:background .18s ease,box-shadow .18s ease,transform .18s ease
  }
  .ai-view-actions button svg{width:17px;height:17px;flex:none;stroke:currentColor;fill:none;stroke-width:1.9;stroke-linecap:round;stroke-linejoin:round}
  .ai-size-controls{display:flex;align-items:center;gap:2px;padding:2px;border:1px solid var(--ai-line,#b9bdc3);border-radius:11px;background:var(--ai-input,#fff)}
  .ai-view-actions .ai-size-controls button{min-width:34px;min-height:38px;padding:0;border:0;border-radius:8px}
  .ai-size-controls button:disabled{opacity:.35;cursor:default}
  .ai-size-controls button:not(:disabled):hover{background:var(--ai-chat,#f0f1f3)}
  .ai-size-controls{flex-direction:column;gap:1px;width:96px;padding:0;border:0;background:transparent}
  .ai-size-controls input{appearance:none;-webkit-appearance:none;width:100%;height:24px;margin:0;background:transparent;cursor:pointer}
  .ai-size-controls input::-webkit-slider-runnable-track{height:6px;border:1px solid #b6bac1;border-radius:999px;background:linear-gradient(to right,#111114 var(--size-position,50%),#e0e2e5 var(--size-position,50%))}
  .ai-size-controls input::-webkit-slider-thumb{-webkit-appearance:none;width:19px;height:19px;margin-top:-7.5px;border:2px solid #111114;border-radius:50%;background:#fff;box-shadow:0 1px 3px #1113}
  .ai-size-controls input::-moz-range-track{height:4px;border:1px solid #b6bac1;border-radius:999px;background:#e0e2e5}
  .ai-size-controls input::-moz-range-progress{height:4px;border-radius:999px;background:#111114}
  .ai-size-controls input::-moz-range-thumb{width:15px;height:15px;border:2px solid #111114;border-radius:50%;background:#fff;box-shadow:0 1px 3px #1113}
  .ai-shell[data-theme=dark] .ai-size-controls input::-webkit-slider-runnable-track{border-color:#9299a3;background:linear-gradient(to right,#f1f2f4 var(--size-position,50%),#565d66 var(--size-position,50%))}
  .ai-shell[data-theme=dark] .ai-size-controls input::-webkit-slider-thumb{border-color:#f1f2f4;background:#25292e}
  .ai-size-controls input:focus-visible{outline:2px solid currentColor;outline-offset:2px;border-radius:6px}
  .ai-size-labels{display:flex;width:100%;justify-content:space-between;padding:0 2px;box-sizing:border-box;color:var(--ai-muted,#71767e);font:700 10px/1 'DM Sans',system-ui,sans-serif}
  .ai-view-actions .back-button{background:var(--ai-input,#fff);border-color:var(--ai-line,#b9bdc3);box-shadow:0 1px 2px #11111112}
  .ai-view-actions .power-button{background:#16171a;color:#fff;border-color:#16171a;box-shadow:0 2px 4px #11111124}
  .ai-shell[data-theme=dark] .ai-view-actions .power-button{background:#f1f2f4;color:#17181b;border-color:#f1f2f4}
  @media(hover:hover){
    .ai-view-actions .back-button:hover{background:var(--ai-chat,#f0f1f3);transform:translateY(-1px)}
    .ai-view-actions .power-button:hover{background:#33353a;transform:translateY(-1px)}
    .ai-shell[data-theme=dark] .ai-view-actions .power-button:hover{background:#d5d8de}
  }
  .ai-view-actions button:active{transform:translateY(1px);box-shadow:none}
  .ai-view-actions button:focus-visible{outline:2px solid currentColor;outline-offset:2px}
  :is(.ai-shell,.win.mobile-app-mode) .ai-draw{pointer-events:auto}
  @container (max-width:660px){
    .ai-shell .ai-head{grid-template-columns:minmax(0,1fr) auto}
    .ai-workspace-switch{grid-column:1/-1;grid-row:2;justify-self:center}
    .ai-view-actions{grid-column:2;grid-row:1}
  }
  @media(max-width:480px){
    .ai-shell{padding:6px}.ai-shell .ai-dock{height:100%;border-radius:15px}
    .ai-shell .ai-content{--ai-content-gutter:8px;padding-block:8px}
    .ai-shell .ai-head{min-height:60px;padding:7px 9px;gap:7px}
    .ai-shell .ai-head .ai-badge{width:28px;height:34px}
    .ai-view-actions{gap:10px}.ai-view-actions button{padding-inline:8px}
    .ai-view-actions .power-label{display:none}
  }
  @media(max-width:330px){.ai-view-actions .back-label{display:none}}
  @media(max-width:360px){
    .ai-shell .ai-view-actions{gap:4px}
    .ai-size-controls{gap:0;width:64px}
    .ai-view-actions .ai-size-controls button{min-width:30px}
  }
  .ai-shell[data-window-size="small"] .ai-dock{width:min(88%,690px);height:min(420px,100%)}
  @media(max-width:480px){.ai-shell[data-window-size="small"] .ai-dock{width:calc(100% - 16px)}}
  .ai-shell[data-window-size="full"]{padding:0}
  .ai-shell[data-window-size="full"] .ai-dock{width:100%;height:100%;border:0;border-radius:0;box-shadow:none}
  @media(prefers-reduced-motion:reduce){.ai-view-actions button{transition:none;transform:none!important}}
`;
root.append(shellStyle);
if(mobileLayout){
  const notch=document.createElement('div');
  notch.className='apk-floating-notch';
  notch.innerHTML='<span aria-hidden="true"><i></i><i></i><i></i></span>';
  win.prepend(notch);
  const resizeBar=document.createElement('div');
  resizeBar.className='apk-resize-bar';
  resizeBar.innerHTML='<div data-resize="sw" title="Resize from left"><svg viewBox="0 0 24 24"><path d="m4 20 0 0M4 14l6 6M4 7l13 13"/></svg></div><div data-resize="se" title="Resize from right"><svg viewBox="0 0 24 24"><path d="m20 20 0 0M20 14l-6 6M20 7 7 20"/></svg></div>';
  win.append(resizeBar);
  dock.hidden=true;
  const mobileStyle=document.createElement('style');
  mobileStyle.textContent=`
    .apk-floating-notch,.apk-resize-bar{display:none}
    .win.mobile-app-mode.mobile-floating{min-width:min(220px,calc(100vw - 16px))!important;min-height:min(320px,calc(100dvh - 32px))!important;border-width:4px!important;border-top:0!important;border-color:#111114!important;clip-path:polygon(0 24px,calc(50% - 37px) 24px,calc(50% - 37px) 12px,calc(50% - 34px) 5px,calc(50% - 29px) 1px,calc(50% - 23px) 0,calc(50% + 23px) 0,calc(50% + 29px) 1px,calc(50% + 34px) 5px,calc(50% + 37px) 12px,calc(50% + 37px) 24px,100% 24px,100% 100%,0 100%)}
    @media(orientation:landscape){.win.mobile-app-mode.mobile-floating{min-height:min(240px,calc(100dvh - 32px))!important}}
    .win.mobile-floating .apk-floating-notch{position:sticky;top:0;display:flex;justify-content:center;flex:0 0 28px;z-index:15;cursor:grab;touch-action:none;background:linear-gradient(transparent 24px,#111114 24px);margin-inline:-1px}
    .apk-floating-notch span{width:74px;height:28px;border:4px solid #111114;border-bottom:0;border-radius:17px 17px 0 0;background:var(--theme-surface,#fff);display:flex;align-items:center;justify-content:center;gap:5px}
    .apk-floating-notch i{width:6px;height:6px;border-radius:50%;background:#111114}
    .win.mobile-floating .apk-resize-bar{position:sticky;bottom:0;z-index:15;display:flex;justify-content:space-between;flex:0 0 28px;min-height:28px;background:var(--theme-surface,#fff)}
    .apk-resize-bar [data-resize]{width:36px;display:grid;place-items:center;touch-action:none;cursor:nwse-resize}
    .apk-resize-bar [data-resize=sw]{cursor:nesw-resize}
    .apk-resize-bar svg{width:22px;stroke:currentColor;stroke-width:2;stroke-linecap:round;fill:none}
    .win.mobile-app-mode.mobile-floating > .grip{display:none}
    .win.mobile-floating[data-theme=dark] :is(.apk-floating-notch span,.apk-resize-bar){background:#17191d;color:#fff}
    .win.mobile-floating[data-theme=dark] .apk-floating-notch i{background:#fff}
    .win.mobile-app-mode .infopanel{--mobile-panel-gutter:14px}
    .win.mobile-app-mode .infopanel .infobrand{margin-inline:calc(-1 * var(--mobile-panel-gutter));padding-inline:var(--mobile-panel-gutter);border-bottom:3px solid #25282d!important}
    .win.mobile-app-mode[data-theme=dark] .infopanel .infobrand{border-bottom-color:#b8c0ca!important}
    .win.mobile-app-mode.ai-extended{height:min(calc(var(--ai-base-height) + var(--ai-dock-height)),var(--ai-room))!important;max-height:none!important;overflow-y:auto!important;overscroll-behavior:contain;scrollbar-width:thin}
    .win.mobile-app-mode.ai-extended .body{flex:0 0 var(--ai-body-height);min-height:var(--ai-body-height)}
    .win.mobile-app-mode .ai-dock{position:relative;inset:auto;z-index:10;flex:none;margin:0;border-width:1.5px 0 0;border-radius:0;box-shadow:none}
    .win.mobile-app-mode .ai-dock[hidden]{display:none}
    .win.mobile-app-mode .ai-chat{margin-inline:-12px;border-radius:0;border:1.5px solid var(--ui-divider,#858a91)}
    @media(max-width:420px){.win.mobile-app-mode .ai-chat{margin-inline:-8px}}
    @media(max-width:380px){.win.mobile-app-mode .infopanel{--mobile-panel-gutter:12px}}
  `;
  root.append(mobileStyle);
  const body=win.querySelector('.body');
  let lastLayout='';
  function resizeMobileAssistant(){
    if(dock.hidden){
      if(win.classList.contains('ai-extended')){
        win.classList.remove('ai-extended');
        win.style.removeProperty('--ai-base-height');
        win.scrollTop=0;
      }
      lastLayout='';
      return;
    }
    if(!win.classList.contains('open')){lastLayout='';return}
    const styleKeys=['--tai7-w','--tai7-h','--tai7-top','--tai7-left'];
    const layout=[innerWidth,innerHeight,win.classList.contains('popup-mode'),...styleKeys.map(key=>win.style.getPropertyValue(key))].join('|');
    const scrollTop=win.scrollTop;
    if(layout!==lastLayout){
      dock.hidden=true;
      win.classList.remove('ai-extended');
      const baseHeight=win.offsetHeight;
      const room=Math.max(baseHeight,innerHeight-Math.max(0,win.getBoundingClientRect().top)-4);
      win.style.setProperty('--ai-base-height',`${baseHeight}px`);
      win.style.setProperty('--ai-body-height',`${body.offsetHeight}px`);
      win.style.setProperty('--ai-room',`${room}px`);
      win.classList.add('ai-extended');
      dock.hidden=false;
      lastLayout=layout;
    }
    const dockHeight=`${dock.offsetHeight}px`;
    if(win.style.getPropertyValue('--ai-dock-height')!==dockHeight)win.style.setProperty('--ai-dock-height',dockHeight);
    if(win.scrollTop!==scrollTop)win.scrollTop=scrollTop;
  }
  new ResizeObserver(resizeMobileAssistant).observe(dock);
  new MutationObserver(resizeMobileAssistant).observe(win,{attributes:true,attributeFilter:['class','style']});
  window.addEventListener('resize',resizeMobileAssistant);
}
const panelFix=document.createElement('style');panelFix.textContent=`.win .infobackdrop{z-index:140}.win .infopanel{z-index:150;overflow-y:auto!important;overflow-x:hidden;overscroll-behavior:contain;scrollbar-width:thin;scrollbar-color:#8a8e94 #f0f1f3}.win .infopanel::-webkit-scrollbar{width:8px}.win .infopanel::-webkit-scrollbar-track{background:#f0f1f3}.win .infopanel::-webkit-scrollbar-thumb{background:#8a8e94;border:2px solid #f0f1f3;border-radius:8px}.win .infopanel .infomade{display:flex;align-items:center;gap:6px;min-width:0}.win .infopanel .kawkab-brand-logo{display:block;width:88px;height:28px;max-width:60%;object-fit:contain;object-position:left center;margin:0;flex:none}:is(.win,.ai-shell)[data-theme=dark] .infopanel{scrollbar-color:#969ca5 #30343a}:is(.win,.ai-shell)[data-theme=dark] .infopanel::-webkit-scrollbar-track{background:#30343a}:is(.win,.ai-shell)[data-theme=dark] .infopanel::-webkit-scrollbar-thumb{background:#969ca5;border-color:#30343a}`;root.append(panelFix);
// Keep the input and Ask together, with all tools in the row beneath.
const form=dock.querySelector('.ai-form'), tools=dock.querySelector('.ai-tools');
const toolMotion=document.createElement('style');toolMotion.textContent=`.ai-tools button{transition:transform .2s cubic-bezier(.2,.7,.25,1),background .2s ease,border-color .2s ease,box-shadow .2s ease}.ai-tools button svg{transition:transform .2s cubic-bezier(.2,.7,.25,1)}@media(hover:hover){.ai-tools button:hover{transform:translateY(-2px);box-shadow:0 4px 10px #11111117}.ai-tools button:hover svg{transform:translateY(-1px) scale(1.06)}}.ai-tools button:active{transform:scale(.96);box-shadow:0 1px 3px #11111112}.ai-tools button:active svg{transform:scale(.94)}@media(prefers-reduced-motion:reduce){.ai-tools button,.ai-tools button svg{transition:none!important}.ai-tools button:hover,.ai-tools button:active,.ai-tools button:hover svg,.ai-tools button:active svg{transform:none!important}}`;
const camera=form.querySelector('.camera'), voice=form.querySelector('.voice');
tools.insertBefore(camera,tools.querySelector('.state')); tools.insertBefore(voice,tools.querySelector('.state'));
camera.title='Camera';voice.title='Voice command';
const sendButton=form.querySelector('.send');sendButton.setAttribute('aria-label','Send calculation');sendButton.insertAdjacentHTML('beforeend','<span class="send-sheen" aria-hidden="true"></span>');
const sendStyle=document.createElement('style');sendStyle.textContent=`.ai-form .send{position:relative;overflow:hidden;isolation:isolate;border-radius:11px;background:linear-gradient(155deg,#26272c,#0d0e11 68%);box-shadow:0 2px 3px #0003,0 5px 12px #0001;transition:transform .18s ease,box-shadow .18s ease,background .18s ease;letter-spacing:.01em}.ai-form .send:hover{background:linear-gradient(155deg,#36373e,#17181c 68%);box-shadow:0 4px 10px #0003;transform:translateY(-1px)}.ai-form .send:active{transform:scale(.95);box-shadow:0 1px 3px #0003}.ai-form .send:focus-visible{outline:2px solid currentColor;outline-offset:3px}.ai-form .send svg{transition:transform .2s ease}.ai-form .send:hover svg{transform:translateY(-2px)}.ai-form .send .send-sheen{position:absolute;inset:-45% auto -45% -45%;width:22%;background:linear-gradient(90deg,transparent,#ffffff35,transparent);transform:translateX(0) skewX(-20deg);pointer-events:none}.ai-form .send.sent .send-sheen{animation:ai-send-sheen .45s ease-out}.ai-form .send.sent svg{animation:ai-send-arrow .4s ease-out}@keyframes ai-send-sheen{to{transform:translateX(700%) skewX(-20deg)}}@keyframes ai-send-arrow{45%{transform:translateY(-5px);opacity:.45}46%{transform:translateY(4px);opacity:0}100%{transform:translateY(0);opacity:1}}@media(prefers-reduced-motion:reduce){.ai-form .send,.ai-form .send svg{transition:none}.ai-form .send.sent .send-sheen,.ai-form .send.sent svg{animation:none}}`;root.append(sendStyle);form.addEventListener('submit',()=>{if(!form.querySelector('input').value.trim())return;sendButton.classList.remove('sent');void sendButton.offsetWidth;sendButton.classList.add('sent')},true);
camera.insertAdjacentHTML('beforeend','<span>Camera</span>');voice.insertAdjacentHTML('beforeend','<span>Voice</span>');
const compact=document.createElement('style');compact.textContent=`
.ai-form{display:flex;align-items:center;gap:6px;margin-top:8px}.ai-form input{min-width:0;flex:1;height:38px}.ai-form .send{height:38px;min-width:62px;flex:none}
.ai-tools{display:flex;align-items:center;gap:6px;margin-top:7px;flex-wrap:wrap}.ai-tools button{height:34px;min-width:34px;padding:0 10px;display:inline-flex;align-items:center;justify-content:center;gap:6px;font:600 11px/1 'DM Sans',sans-serif;letter-spacing:.005em;color:inherit;border:1.5px solid var(--ai-line,#aeb3b9);border-radius:10px;background:var(--ai-input,#fff);box-shadow:0 1px 2px #1111110c;cursor:pointer;transition:background .15s,border-color .15s,transform .15s,box-shadow .15s}.ai-tools button svg{width:17px;height:17px;flex:none;stroke-width:1.85}.ai-tools button:hover{background:var(--ai-chat,#f3f4f6);border-color:#90969e;box-shadow:0 2px 5px #11111112}.ai-tools button:active{transform:scale(.96)}.ai-tools button:focus-visible{outline:2px solid currentColor;outline-offset:2px}.ai-tools .camera,.ai-tools .voice{padding:0 10px}.ai-tools .state{margin-left:auto;font-size:10px!important}
@media(max-width:420px){.ai-form input,.ai-form .send{height:37px}.ai-tools{gap:5px}.ai-tools button{height:34px;padding:0 8px}.ai-tools .camera,.ai-tools .voice{padding:0 8px}.ai-tools .camera span,.ai-tools .voice span{display:none}.ai-tools .state{font-size:9px!important}}
`;root.append(compact);root.append(toolMotion);
// Keep the tools beside the prompt and send button.
const mediaButtons=[tools.querySelector('.attach'),tools.querySelector('.draw'),camera];
if(!mobileLayout){
  for(const button of mediaButtons)button.remove();
  for(const input of dock.querySelectorAll('input[type=file]'))input.remove();
}
const inlineButtons=mobileLayout?[...mediaButtons,voice]:[voice];
inlineButtons.forEach(button=>{for(const node of [...button.childNodes])if(node.nodeType===Node.TEXT_NODE&&node.textContent.trim()){const label=document.createElement('span');label.textContent=node.textContent.trim();button.replaceChild(label,node)}form.insertBefore(button,sendButton)});
if(mobileLayout){
  const sendDivider=document.createElement('span');sendDivider.className='ai-send-divider';sendDivider.setAttribute('aria-hidden','true');form.insertBefore(sendDivider,sendButton);const dividerStyle=document.createElement('style');dividerStyle.textContent=`.ai-form .ai-send-divider{display:block;align-self:center;flex:0 0 2px;width:2px;height:24px;margin:0 3px;border-radius:2px;background:var(--ui-divider,#45484c)}:is(.win,.ai-shell)[data-theme=dark] .ai-form .ai-send-divider{background:#a4abb5}@media(max-width:420px){.ai-form .ai-send-divider{height:21px;margin:0 1px}}`;root.append(dividerStyle);
}
tools.querySelector('.state').style.marginLeft='0';
const inlineStyle=document.createElement('style');inlineStyle.textContent=`.ai-form{display:flex;align-items:center;justify-content:flex-start;flex-wrap:nowrap;gap:6px}.ai-form input{flex:1 1 360px;width:auto;max-width:520px;min-width:90px}.ai-form :is(.attach,.draw,.camera,.voice){display:inline-flex;align-items:center;justify-content:center;gap:6px;flex:0 0 auto;width:auto;height:38px;padding:0 10px;border:1.5px solid var(--ai-line,#aeb3b9);border-radius:10px;background:var(--ai-input,#fff);color:inherit;font:600 11px/1 'DM Sans',sans-serif;transition:transform .2s ease,background .2s ease,box-shadow .2s ease}.ai-form :is(.attach,.draw,.camera,.voice) svg{width:17px;height:17px;flex:none}.ai-form :is(.attach,.draw,.camera,.voice):hover{transform:translateY(-2px);background:var(--ai-chat,#f3f4f6);box-shadow:0 4px 10px #11111117}.ai-form :is(.attach,.draw,.camera,.voice):active{transform:scale(.96)}.ai-form :is(.attach,.draw,.camera,.voice):focus-visible{outline:2px solid currentColor;outline-offset:2px}.ai-tools{margin-top:5px;min-height:12px}@media(max-width:650px){.ai-form :is(.attach,.draw,.camera,.voice){width:36px;min-width:36px;padding:0}.ai-form :is(.attach,.draw,.camera,.voice) span{display:none}.ai-form input{flex-basis:140px}}@media(max-width:360px){.ai-form{gap:4px}.ai-form :is(.attach,.draw,.camera,.voice){width:32px;min-width:32px}.ai-form input{min-width:55px}.ai-form .send{min-width:55px;padding:0 7px}}@media(prefers-reduced-motion:reduce){.ai-form :is(.attach,.draw,.camera,.voice){transition:none}.ai-form :is(.attach,.draw,.camera,.voice):hover,.ai-form :is(.attach,.draw,.camera,.voice):active{transform:none}}`;root.append(inlineStyle);
const composerStyle=document.createElement('style');composerStyle.textContent=`.ai-form{box-sizing:border-box;width:min(100%,880px);max-width:100%;margin-left:auto;margin-right:auto;padding:5px;gap:5px;border:1.5px solid var(--ui-divider,#45484c);border-radius:14px;background:var(--ai-input,#fff);box-shadow:0 2px 7px #1111140b}.ai-form:focus-within{border-color:currentColor;box-shadow:0 0 0 3px #8882}.ai-form input{height:38px;max-width:none;min-width:100px;flex:1 1 330px;border:0!important;box-shadow:none!important;background:transparent;padding:0 10px;font-size:13px}.ai-form input:focus{box-shadow:none!important}.ai-form :is(.attach,.draw,.camera,.voice){height:36px;padding:0 10px;border-color:var(--ai-line,#d1d4d8);background:var(--ai-input,#fff);box-shadow:0 1px 2px #1111110c;white-space:nowrap}.ai-form .send{height:36px;min-width:72px;border-radius:10px;flex:none}.ai-tools{padding:0 4px;margin-top:5px}.ai-tools .state{font-size:10px!important;letter-spacing:.005em}@media(max-width:760px){.ai-form :is(.attach,.draw,.camera,.voice){width:36px;min-width:36px;padding:0}.ai-form :is(.attach,.draw,.camera,.voice) span{display:none}.ai-form input{flex-basis:150px}}@media(max-width:420px){.ai-form{gap:3px;padding:4px}.ai-form input{min-width:48px;font-size:12px;padding:0 6px}.ai-form :is(.attach,.draw,.camera,.voice){width:32px;min-width:32px;height:34px}.ai-form .send{height:34px;min-width:52px;padding:0 7px}}`;root.append(composerStyle);
const premiumComposer=document.createElement('style');premiumComposer.textContent=`.ai-form{width:min(100%,860px);padding:6px;gap:6px;border:1.5px solid var(--ui-divider,#45484c);border-radius:16px;background:var(--ai-input,#fff);box-shadow:0 2px 8px #11111410,0 1px 2px #1111140a;transition:border-color .2s,box-shadow .2s}.ai-form:focus-within{border-color:var(--ui-text,#111114);box-shadow:0 0 0 3px #7772,0 3px 10px #11111412}.ai-form input{height:40px;padding:0 12px;font:500 13px/1.3 'DM Sans',system-ui,sans-serif;color:inherit;letter-spacing:-.01em}.ai-form input::placeholder{color:#858990;opacity:1}.ai-form :is(.attach,.draw,.camera,.voice){height:38px;gap:6px;padding:0 11px;border:1.5px solid var(--ai-line,#d0d3d7);border-radius:11px;background:var(--ai-input,#fff);color:inherit;font:600 11px/1 'DM Sans',system-ui,sans-serif;box-shadow:0 1px 2px #1111140c}.ai-form :is(.attach,.draw,.camera,.voice) svg{width:17px;height:17px;stroke-width:1.9}.ai-form .ai-send-divider{height:24px;margin:0 2px;background:var(--ui-divider,#555b62)}.ai-form .send{height:38px;min-width:74px;padding:0 13px;border-radius:11px;font:700 12px/1 'DM Sans',system-ui,sans-serif;gap:6px}.ai-tools{width:min(100%,860px);box-sizing:border-box;margin:5px auto 0;padding:0 3px}.ai-tools .state{color:var(--ai-muted,#777d85)!important;font:500 10px/1.35 'DM Sans',system-ui,sans-serif}:is(.win,.ai-shell)[data-theme=dark] .ai-form input::placeholder{color:#aeb4bd}@media(max-width:760px){.ai-form :is(.attach,.draw,.camera,.voice){width:38px;min-width:38px;padding:0}}@media(max-width:420px){.ai-form{padding:4px;gap:3px;border-radius:13px}.ai-form input{min-width:42px;height:36px;padding:0 7px;font-size:12px}.ai-form :is(.attach,.draw,.camera,.voice){width:32px;min-width:32px;height:34px;padding:0;border-radius:9px}.ai-form :is(.attach,.draw,.camera,.voice) svg{width:16px;height:16px}.ai-form .send{height:34px;min-width:53px;padding:0 7px;border-radius:9px}.ai-form .ai-send-divider{height:21px;margin:0 1px}}@media(prefers-reduced-motion:reduce){.ai-form{transition:none}}`;root.append(premiumComposer);
const brandLabel=dock.querySelector('.ai-label');brandLabel.innerHTML='<span class="ai-brand-seven">SevenTask AI</span> <span class="ai-brand-calculator">Calculator</span><small>Offline commands</small>';dock.querySelector('.ai-badge img').src='icon.svg';
const brandStyle=document.createElement('style');brandStyle.textContent=`.ai-label .ai-brand-seven{font:400 16px/1.05 "Fjalla One","DM Sans",sans-serif;letter-spacing:.01em}.ai-label .ai-brand-calculator{font:550 14px/1.05 "DM Sans",system-ui,sans-serif;letter-spacing:-.025em}.ai-dock .ai-badge,:is(.win,.ai-shell)[data-theme=dark] .ai-dock .ai-badge{border:0;background:transparent;box-shadow:none}.ai-badge img{width:32px;height:32px;object-fit:contain}:is(.win,.ai-shell)[data-theme=dark] .ai-badge img{filter:invert(1)}@media(max-width:420px){.ai-label .ai-brand-seven{font-size:15px}.ai-label .ai-brand-calculator{font-size:13px}.ai-badge img{width:28px;height:28px}}`;root.append(brandStyle);
const panel=document.createElement('div');panel.className='ai-draw';panel.hidden=true;panel.setAttribute('role','dialog');panel.setAttribute('aria-label','Draw a calculation');panel.innerHTML=`<div class="draw-top"><span class="draw-mark"><img src="icon.svg" alt=""></span><div class="draw-heading"><b>Draw a calculation</b><span>Write numbers, symbols or a question</span></div><button type="button" class="close" aria-label="Close drawing pad"><svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6 6 18"/></svg></button></div><div class="draw-paper"><canvas width="1200" height="520" aria-label="Drawing area"></canvas><span class="draw-hint">Draw here</span></div><div class="draw-bottom"><span class="draw-note">Use your finger, pen or mouse</span><div class="draw-actions"><button type="button" class="clear"><svg viewBox="0 0 24 24"><path d="M4 7h16M9 7V4h6v3m3 0-1 13H7L6 7m4 4v5m4-5v5"/></svg>Clear</button><button type="button" class="done">Attach drawing <svg viewBox="0 0 24 24"><path d="M5 12h14m-6-6 6 6-6 6"/></svg></button></div></div>`;if(mobileLayout)assistantFrame.append(panel);
const drawStyle=document.createElement('style');drawStyle.textContent=`:is(.ai-shell,.win.mobile-app-mode) .ai-draw{position:absolute;z-index:160;inset:50% auto auto 50%;transform:translate(-50%,-50%);width:min(620px,calc(100% - 28px));height:min(470px,calc(100% - 28px));max-height:calc(100% - 28px);box-sizing:border-box;display:flex;flex-direction:column;gap:14px;padding:18px;background:var(--theme-surface,#fff);color:var(--ui-text,#111114);border:2px solid var(--ui-divider,#25282d);border-radius:18px;box-shadow:0 18px 55px #0003;font-family:'DM Sans',system-ui,sans-serif}:is(.ai-shell,.win.mobile-app-mode) .ai-draw[hidden]{display:none}.draw-top{display:flex;align-items:center;gap:10px;flex:none}.draw-mark{display:grid;place-items:center;width:37px;height:42px;flex:none}.draw-mark img{width:32px;height:38px;object-fit:contain}.draw-heading{flex:1;min-width:0}.draw-heading b{display:block;font:400 19px/1.2 'Fjalla One',sans-serif}.draw-heading span{display:block;margin-top:4px;color:#737982;font-size:12px}.ai-draw button{display:inline-flex;align-items:center;justify-content:center;gap:7px;cursor:pointer;font:600 12px 'DM Sans',sans-serif}.ai-draw button svg{width:17px;height:17px;fill:none;stroke:currentColor;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round}.ai-draw .close{width:38px;height:38px;flex:none;padding:0;border:1.5px solid var(--ui-divider,#c7cbd0);border-radius:11px;background:transparent;color:inherit}.draw-paper{position:relative;flex:1;min-height:80px;overflow:hidden;border:1.5px solid var(--ui-divider,#c7cbd0);border-radius:13px;background:#fff}.ai-draw .draw-paper canvas{display:block;width:100%;height:100%;border:0;border-radius:0;touch-action:none;background:transparent;cursor:crosshair}.draw-hint{position:absolute;top:14px;left:16px;color:#a3a7ad;font:500 12px 'DM Sans',sans-serif;pointer-events:none}.draw-paper.has-ink .draw-hint{display:none}.draw-bottom{display:flex;align-items:center;justify-content:space-between;gap:10px;flex-wrap:wrap;flex:none}.draw-note{color:#777d85;font-size:11px}.draw-actions{display:flex;gap:8px;margin-left:auto}.ai-draw .clear,.ai-draw .done{min-height:40px;padding:0 14px;border:1.5px solid var(--ui-divider,#c7cbd0);border-radius:11px;background:transparent;color:inherit}.ai-draw .done{border-color:#111114;background:#111114;color:#fff}.ai-draw button:hover{opacity:.8}.ai-draw button:focus-visible{outline:2px solid currentColor;outline-offset:2px}:is(.win,.ai-shell)[data-theme=dark] .draw-mark img{filter:invert(1)}:is(.win,.ai-shell)[data-theme=dark] .draw-heading span,:is(.win,.ai-shell)[data-theme=dark] .draw-note{color:#c5cbd3}@media(max-width:420px){:is(.ai-shell,.win.mobile-app-mode) .ai-draw{padding:13px;gap:10px}.draw-heading b{font-size:17px}.draw-heading span{font-size:11px}.draw-note{width:100%;font-size:10px}.draw-actions{width:100%}.ai-draw .clear{flex:1}.ai-draw .done{flex:2}}`;root.append(drawStyle);
const setting=document.createElement('div');setting.className='ai-setting';setting.innerHTML='<span class="ai-setting-copy"><strong>AI Calculator</strong><small class="ai-setting-status">On · Chat visible</small></span><button type="button" class="ai-setting-switch" role="switch" aria-label="AI Calculator" aria-checked="true"><span></span></button>';const place=root.querySelector('.st-settings')||root.querySelector('.theme-choice');if(mobileLayout)place?.before(setting);const settingStyle=document.createElement('style');settingStyle.textContent=`.win .infopanel .ai-setting{display:flex;align-items:center;gap:10px;margin:8px 0;padding:11px 10px;border:1px solid var(--ui-divider,#bfc2c6);border-radius:12px;background:var(--theme-surface,#fff);color:inherit;box-sizing:border-box}.ai-setting-icon{width:34px;height:34px;flex:none;display:grid;place-items:center;background:#fff;border:1px solid #d6d9dd;border-radius:10px}.ai-setting-icon img{width:30px;height:30px;object-fit:contain}.ai-setting-copy{display:flex;flex:1;min-width:0;flex-direction:column;gap:3px}.ai-setting-copy strong{font:650 13px/1.2 'DM Sans',system-ui,sans-serif}.ai-setting-copy small{font:400 11px/1.3 'DM Sans',system-ui,sans-serif;color:#777d85}.win .infopanel .ai-setting-switch{position:relative;flex:none;width:44px;height:26px;padding:0;border:1px solid #111114;border-radius:99px;background:#111114;cursor:pointer;transition:background .18s}.ai-setting-switch span{position:absolute;top:3px;left:21px;width:18px;height:18px;border-radius:50%;background:white;box-shadow:0 1px 3px #0003;transition:left .18s}.win .infopanel .ai-setting-switch[aria-checked=false]{background:#e0e2e5;border-color:#b9bdc3}.ai-setting-switch[aria-checked=false] span{left:3px}.ai-setting-switch:focus-visible{outline:2px solid currentColor;outline-offset:3px}:is(.win,.ai-shell)[data-theme=dark] .ai-setting-copy small{color:#c0c6cd}:is(.win,.ai-shell)[data-theme=dark] .infopanel .ai-setting{background:#30343a;border-color:#5a626b}`;if(mobileLayout)root.append(settingStyle);const toggle=setting.querySelector('.ai-setting-switch');
const head=dock.querySelector('.ai-head');
const staticHead=document.createElement('header');
staticHead.className='ai-head';
if(mobileLayout){
  const content=dock.querySelector('.ai-content');
  head.onclick=()=>{content.hidden=!content.hidden;head.setAttribute('aria-expanded',String(!content.hidden))};
}else{
  head.querySelector('.chev').remove();
  const brand=document.createElement('div');
  brand.className='ai-workspace-brand';
  brand.append(...head.childNodes);
  staticHead.append(brand);
  const workspaces=document.createElement('nav');
  workspaces.className='ai-workspace-switch';
  workspaces.setAttribute('aria-label','Choose workspace');
  workspaces.innerHTML='<span aria-current="page">AI</span><a href="./workspaces/max.html">MAX</a><a href="./workspaces/max.html#enterprise">ENTERPRISE</a>';
  staticHead.append(workspaces);
  head.replaceWith(staticHead);
}
const actions=document.createElement('div');
actions.className='ai-view-actions';
actions.innerHTML='<button type="button" class="back-button" aria-label="Back to Calculator" title="Back to Calculator"><svg aria-hidden="true" viewBox="0 0 24 24"><path d="M20 12H4m6-6-6 6 6 6"/></svg><span class="back-label">Calculator</span></button><button type="button" class="power-button" aria-label="Turn AI Calculator off" title="Turn AI Calculator off"><svg aria-hidden="true" viewBox="0 0 24 24"><path d="M12 3v8m5-5a8 8 0 1 1-10 0"/></svg><span class="power-label">Turn off</span></button>';
staticHead.append(actions);
const chat=dock.querySelector('.ai-chat'),input=dock.querySelector('input');
function message(text,cls){
  const note=document.createElement('p');
  note.className=cls||'assistant-message';
  note.textContent=text;
  chat.append(note);
  chat.scrollTop=chat.scrollHeight;
  return note;
}
function syncTheme(){
  shell.dataset.theme=win.dataset.theme||'monochrome';
  const theme=getComputedStyle(win);
  for(const token of ['--theme-surface','--ui-text','--ui-divider']){
    const value=theme.getPropertyValue(token).trim();
    if(value)shell.style.setProperty(token,value);
    else shell.style.removeProperty(token);
  }
}
let previousCalculatorMenu=null;
function showAI(){
  if(!shell.hidden)return;
  const infoPanel=win.querySelector('[data-infopanel]');
  previousCalculatorMenu={open:!!infoPanel?.classList.contains('open'),scrollTop:infoPanel?.scrollTop||0};
  app.closeInfoPanel();
  syncTheme();
  win.inert=true;
  win.classList.add('ai-view-hidden');
  shell.hidden=false;
  document.body.classList.add('ai-workspace-open');
  actions.querySelector('.power-button').focus({preventScroll:true});
}
function showCalculator(){
  stopVoice();
  panel.hidden=true;
  shell.hidden=true;
  document.body.classList.remove('ai-workspace-open');
  win.classList.remove('ai-view-hidden');
  win.inert=false;
  if(!win.classList.contains('open'))app.open();
  if(previousCalculatorMenu?.open){
    app.openInfoPanel();
    const infoPanel=win.querySelector('[data-infopanel]');
    if(infoPanel)infoPanel.scrollTop=previousCalculatorMenu.scrollTop;
  }else win.querySelector('.dotmenu')?.focus({preventScroll:true});
  previousCalculatorMenu=null;
}
if(mobileLayout){
  const settingKey='st-ai-demo-mobile';
  let enabled=localStorage.getItem(settingKey)==='on';
  function syncSetting(){
    toggle.setAttribute('aria-checked',String(enabled));
    toggle.title=enabled?'Turn AI Calculator off':'Turn AI Calculator on';
    setting.querySelector('.ai-setting-status').textContent=enabled?'On · Chat visible':'Off · Chat hidden';
    dock.hidden=!enabled;
  }
  syncSetting();
  dock.addEventListener('keydown',event=>event.stopPropagation());
  toggle.onclick=()=>{
    enabled=!enabled;
    localStorage.setItem(settingKey,enabled?'on':'off');
    syncSetting();
    if(!enabled){panel.hidden=true;stopVoice();}
  };
}else{
  const sizes=['small','standard','full'];
  let sizeIndex=1;
  const sizing=document.createElement('div');
  sizing.className='ai-size-controls';
  sizing.setAttribute('role','group');
  sizing.setAttribute('aria-label','AI window size');
  sizing.innerHTML='<input type="range" min="0" max="2" step="1" value="1" aria-label="AI window size" aria-valuetext="Medium"><span class="ai-size-labels" aria-hidden="true"><span>S</span><span>M</span><span>L</span></span>';
  const slider=sizing.querySelector('input');
  const sizeLabels=['Small','Medium','Large'];
  function setSize(index){
    sizeIndex=index;
    shell.dataset.windowSize=sizes[index];
    slider.setAttribute('aria-valuetext',sizeLabels[index]);
    slider.style.setProperty('--size-position',index*50+'%');
  }
  slider.addEventListener('input',()=>setSize(Number(slider.value)));
  actions.prepend(sizing);
  setSize(sizeIndex);
  document.querySelector('.web-page-footer-ai')?.addEventListener('click',showAI);
  actions.querySelector('.back-button').remove();
  actions.querySelector('.power-button').onclick=showCalculator;
  const requestedWorkspace=new URLSearchParams(location.search).get('workspace');
  if(requestedWorkspace==='ai')showAI();
  else if(requestedWorkspace==='calculator')app.open();
}
shell.addEventListener('keydown',event=>{
  if(event.key==='Escape'){
    event.preventDefault();
    if(!panel.hidden)panel.hidden=true;
    else showCalculator();
  }
  event.stopPropagation();
});
const chatStyle=document.createElement('style');chatStyle.textContent=`.ai-chat{background-image:radial-gradient(circle,rgba(80,87,96,.16) 1px,transparent 1.3px);background-size:20px 20px;box-sizing:border-box;min-height:110px;height:clamp(110px,17vh,180px);padding:14px 16px;overflow-y:auto;overscroll-behavior:contain;scrollbar-width:thin;scrollbar-color:#9da2aa transparent;scroll-behavior:smooth}.ai-chat::-webkit-scrollbar{width:8px}.ai-chat::-webkit-scrollbar-track{background:transparent}.ai-chat::-webkit-scrollbar-thumb{background:#a4a9af;border:2px solid transparent;background-clip:padding-box;border-radius:10px}.ai-chat p{white-space:pre-line;box-sizing:border-box;max-width:min(88%,520px);overflow-wrap:anywhere}.ai-chat p:first-child,.ai-chat .assistant-message{width:fit-content;margin:0 0 10px;padding:10px 12px;border:1px solid var(--ai-line,#dfe1e4);border-radius:12px 12px 12px 4px;background:var(--ai-input,#fff);color:inherit;box-shadow:0 1px 3px #1111;line-height:1.5}.ai-chat p:first-child b{display:inline-block;margin-bottom:3px;font:400 14px/1.2 'Fjalla One',sans-serif}.ai-chat p.you{margin:0 0 10px auto;max-width:85%;padding:9px 12px;border-radius:12px 12px 4px 12px;background:#111114;color:white;line-height:1.45;box-shadow:0 2px 5px #1112}:is(.win,.ai-shell)[data-theme=dark] .ai-chat{background-image:radial-gradient(circle,rgba(235,238,242,.15) 1px,transparent 1.3px)}:is(.win,.ai-shell)[data-theme=dark] .ai-chat .assistant-message,:is(.win,.ai-shell)[data-theme=dark] .ai-chat p:first-child{background:#25292e;border-color:#555d67;color:#f4f5f7}@media(max-width:420px){.ai-chat{height:110px;min-height:110px;padding:10px}.ai-chat p{max-width:95%}}@media(prefers-reduced-motion:reduce){.ai-chat{scroll-behavior:auto}}`;root.append(chatStyle);
const commands=createOfflineCommands(app);
const online=window.sevenTaskOnlineCalculator;
let onlineReady=false;
const status=brandLabel.querySelector('small');
status.setAttribute('role','status');
const statusStyle=document.createElement('style');
statusStyle.textContent=`.ai-online-dots{display:inline-flex;gap:3px;margin-right:5px;vertical-align:middle}.ai-online-dots i{width:5px;height:5px;border-radius:50%;background:#16a061;animation:ai-dot-pulse 1.2s ease-in-out infinite}.ai-online-dots i:nth-child(2){animation-delay:.15s}.ai-online-dots i:nth-child(3){animation-delay:.3s}@keyframes ai-dot-pulse{0%,100%{opacity:.4;transform:scale(.8)}50%{opacity:1;transform:scale(1.15)}}@media(prefers-reduced-motion:reduce){.ai-online-dots i{animation:none}}`;
root.append(statusStyle);
async function refreshOnline(){
  const available=!!(navigator.onLine&&await online?.available());
  onlineReady=available;
  if(available){
    status.replaceChildren();
    const dots=document.createElement('span');
    dots.className='ai-online-dots';dots.setAttribute('aria-hidden','true');
    dots.innerHTML='<i></i><i></i><i></i>';
    status.append(dots,document.createTextNode('AI online'));
  }else status.textContent='Offline commands';
}
void refreshOnline();
window.addEventListener('online',refreshOnline);
window.addEventListener('offline',refreshOnline);
document.addEventListener('visibilitychange',()=>{if(!document.hidden)void refreshOnline();});
window.mountCalculatorMentions?.({form,input,commands});
dock.querySelector('.state').textContent=window.mountCalculatorMentions?'Offline · Type @ to pick a calculator':'Offline · Type “list tools” for the catalog';
const intro=chat.querySelector('p');
intro.replaceChildren();
const introHeading=document.createElement('b');
introHeading.textContent='Offline calculator';
intro.append(introHeading,document.createElement('br'),'Type a calculation or try one below.');
const examples=document.createElement('span');
examples.className='ai-examples';
for(const [label,query] of [['Percentage','2500 ka 18%'],['EMI','EMI 5 lakh at 9% for 5 years'],['All tools','list tools']]){
  const button=document.createElement('button');
  button.type='button';
  button.textContent=label;
  button.onclick=()=>{input.value=query;form.requestSubmit();};
  examples.append(button);
}
intro.append(examples);
const exampleStyle=document.createElement('style');
exampleStyle.textContent=`
  .ai-examples{display:flex;flex-wrap:wrap;gap:4px;margin-top:6px}
  .ai-examples button,.ai-catalog button{color:inherit;background:var(--ai-input,#fff);border:1px solid var(--ui-divider,#858a91);border-radius:7px;padding:4px 7px;cursor:pointer;font:600 10px 'DM Sans',system-ui,sans-serif}
  .ai-examples button:hover,.ai-catalog button:hover{background:var(--ai-chat,#f3f4f6)}
  .ai-catalog{width:fit-content;padding:7px;border:1px solid var(--ai-line,#dfe1e4);border-radius:9px;background:var(--ai-input,#fff)}
  .ai-catalog summary{cursor:pointer;font-weight:650}.ai-catalog ul{display:flex;flex-wrap:wrap;gap:4px;list-style:none;margin:6px 0 0;padding:0}
`;
root.append(exampleStyle);
function renderCommand(command){
    if(command.error)return message(command.error);
    if(command.list){
      const menu=document.createElement('details');
      menu.className='ai-catalog';
      const title=document.createElement('summary');
      title.textContent='Offline tools · Pick a calculator';
      menu.append(title);
      const list=document.createElement('ul');
      for(const name of command.list){
        const item=document.createElement('li');
        const button=document.createElement('button');
        button.type='button';
        button.textContent=name;
        button.onclick=()=>{input.value=name;form.requestSubmit();};
        item.append(button);
        list.append(item);
      }
      menu.append(list);
      chat.append(menu);
      chat.scrollTop=chat.scrollHeight;
      return;
    }
    if(command.expression)return message('Result: '+app.formatNumber(command.result));
    const {tool,values,missing,problems}=command;
    if(problems.length){
      return message(tool.name+'\n'+problems.join('. '));
    }

    if(missing.length){
      return message(tool.name+' · Please enter '+missing.map(f=>f.label).join(', ')+'.');
    }
    if(!Object.keys(values).length){
      const fields=tool.fields.filter(f=>f.key!=='exchangeRate').map(f=>f.key);
      message(fields.length?tool.name+' · Type '+fields.slice(0,4).map(k=>k+'=…').join(', ')+'.':tool.name+' · Enter an expression here, or use the keypad in Calculator.');
      return;
    }
    const results=app.calculateOfflineTool(tool.id,values).filter(row=>row.type!=="table");
    const rows=[...results.filter(row=>row.emphasis),...results.filter(row=>!row.emphasis)];
    message([tool.name,...rows.slice(0,5).map(row=>row.label+': '+row.value)].join('\n'));
}
async function offerOnline(note,query){
  if(!note||query.length>600||!onlineReady)return;
  const mention=commands.readMention(query);
  const button=document.createElement('button');
  button.type='button';
  button.className='ai-online-action';
  button.textContent='Ask online';
  button.title='Send this command to the online AI provider';
  note.append(document.createElement('br'),button);
  button.onclick=async()=>{
    button.disabled=true;button.textContent='Checking…';
    try{
      const reply=await online.ask(query,mention?.tool?.id);
      const command=commands.fromOnline(reply);
      if(command)renderCommand(command);
      else if(reply.kind==='answer')message(reply.answer);
      else {
        const guidance={
          help:'Type @ to choose a calculator, or enter an expression such as 18% of 2500.',
          clarify:'Which calculation should I run? Give the amount, unit, or calculator name.',
          unsupported:'I can help with calculations, conversions, and using SevenTask Calculator.',
          limit:'Online requests are limited right now. You can still use offline commands.',
        };
        message(guidance[reply.kind]||guidance.clarify);
      }
      button.remove();
    }catch{
      button.disabled=false;button.textContent='Retry online';
      message('Online calculation is unavailable. You can still use offline commands.');
      onlineReady=false;
      status.textContent='Online AI unavailable';
    }
  };
  button.click();
}
function runCommand(query){
  if(!query)return;
  message(query,'you');
  try{
    const command=commands.parse(query);
    const note=renderCommand(command);
    const conceptual=/\b(?:what|why|how|explain|meaning|means|kya|kyun|kaise|matlab|samjha(?:o)?|batao)\b/i.test(query);
    if(command.unrecognized||command.problems?.length||(command.missing?.length&&(conceptual||commands.readMention(query)?.body))){
      void offerOnline(note,query);
    }
  }catch{
    message('Could not calculate this request. Check the inputs and try again.');
  }
}
form.onsubmit=event=>{
  event.preventDefault();
  const query=input.value.trim();
  input.value='';
  runCommand(query);
};
const stopVoice=mountOfflineVoice({dock,input});
if(mobileLayout){
  dock.querySelector('.attach').onclick=()=>dock.querySelector('.file').click();
  camera.onclick=()=>dock.querySelector('.photo').click();
  dock.querySelectorAll('input[type=file]').forEach(el=>el.onchange=()=>{if(el.files[0])message('Image attached: '+el.files[0].name+' · Type any numbers you want to calculate.')});
  const drawTrigger=dock.querySelector('.draw');
  drawTrigger.onclick=()=>panel.hidden=false;let canvas=panel.querySelector('canvas'),ctx=canvas.getContext('2d'),drawing=false;canvas.onpointerdown=e=>{drawing=true;panel.querySelector('.draw-paper').classList.add('has-ink');canvas.setPointerCapture(e.pointerId);ctx.beginPath();ctx.moveTo(e.offsetX*canvas.width/canvas.clientWidth,e.offsetY*canvas.height/canvas.clientHeight)};canvas.onpointermove=e=>{if(drawing){ctx.lineWidth=4;ctx.lineCap='round';ctx.lineTo(e.offsetX*canvas.width/canvas.clientWidth,e.offsetY*canvas.height/canvas.clientHeight);ctx.stroke()}};canvas.onpointerup=()=>drawing=false;panel.querySelector('.clear').onclick=()=>{ctx.clearRect(0,0,canvas.width,canvas.height);panel.querySelector('.draw-paper').classList.remove('has-ink')};panel.querySelector('.done').onclick=()=>{if(!panel.querySelector('.draw-paper').classList.contains('has-ink'))return;panel.hidden=true;const image=document.createElement('img');image.src=canvas.toDataURL('image/png');image.alt='Your drawing';image.style.cssText='display:block;max-width:180px;max-height:78px;border:1px solid #ccd0d5;border-radius:8px;background:white;margin:6px 0 6px auto';chat.append(image);message('Drawing saved in preview · Type the calculation to run it offline.');ctx.clearRect(0,0,canvas.width,canvas.height);panel.querySelector('.draw-paper').classList.remove('has-ink')};panel.querySelector('.close').onclick=()=>panel.hidden=true;
}
}customElements.whenDefined('taskai7-calculator').then(()=>{mount();if(!mounted){let timer=setInterval(()=>{mount();if(mounted)clearInterval(timer)},150);setTimeout(()=>clearInterval(timer),10000)}})})();
