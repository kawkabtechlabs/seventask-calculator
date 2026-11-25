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
const nativeAI=Boolean(window.SevenTaskNative)||new URLSearchParams(location.search).has('apk-preview');
shell.className='ai-shell';
if(nativeAI)shell.classList.add('native-fullscreen');
shell.hidden=true;
shell.setAttribute('aria-label','SevenTask AI Calculator');
if(!mobileLayout)root.append(shell);
const assistantFrame=mobileLayout?win:shell;
assistantFrame.append(dock);
const shellStyle=document.createElement('style');
shellStyle.textContent=''+`
  .win.ai-view-hidden{visibility:hidden!important;pointer-events:none!important}
  .ai-shell{position:fixed;inset:0;display:grid;place-items:center;padding:14px;pointer-events:auto;z-index:1000002;box-sizing:border-box;background:radial-gradient(circle,#7772 1px,transparent 1.2px) 0 0/20px 20px,var(--theme-surface,#fff);opacity:0;transform:translateY(5px) scale(.995);transition:opacity .17s ease,transform .17s ease}
  .ai-shell:not([hidden]){opacity:1;transform:none}
  .ai-shell[hidden]{display:none}
  .ai-shell.is-closing{opacity:0;transform:translateY(5px) scale(.995);pointer-events:none}
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
  .ai-view-actions{display:flex;align-items:center;justify-self:end;gap:22px}
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
  .ai-size-controls{flex-direction:column;gap:4px;width:108px;padding:0;border:0;background:transparent}
  .ai-size-controls input{appearance:none;-webkit-appearance:none;width:100%;height:28px;margin:0;background:transparent;cursor:pointer}
  .ai-size-controls input::-webkit-slider-runnable-track{height:7px;border:1px solid #aeb4bc;border-radius:999px;background:linear-gradient(to right,#111114 var(--size-position,50%),#e3e6ea var(--size-position,50%));box-shadow:inset 0 1px 2px #0002}
  .ai-size-controls input::-webkit-slider-thumb{-webkit-appearance:none;width:23px;height:23px;margin-top:-9px;border:2px solid #111114;border-radius:50%;background:#fff;box-shadow:0 2px 5px #1114,0 0 0 3px #fff8}
  .ai-size-controls input::-moz-range-track{height:4px;border:1px solid #b6bac1;border-radius:999px;background:#e0e2e5}
  .ai-size-controls input::-moz-range-progress{height:4px;border-radius:999px;background:#111114}
  .ai-size-controls input::-moz-range-thumb{width:15px;height:15px;border:2px solid #111114;border-radius:50%;background:#fff;box-shadow:0 1px 3px #1113}
  .ai-shell[data-theme=dark] .ai-size-controls input::-webkit-slider-runnable-track{border-color:#9299a3;background:linear-gradient(to right,#f1f2f4 var(--size-position,50%),#565d66 var(--size-position,50%))}
  .ai-shell[data-theme=dark] .ai-size-controls input::-webkit-slider-thumb{border-color:#f1f2f4;background:#25292e}
  .ai-size-controls input:focus-visible{outline:2px solid currentColor;outline-offset:2px;border-radius:6px}
  .ai-size-labels{display:flex;width:100%;justify-content:space-between;padding:0 6px;box-sizing:border-box;color:var(--ai-muted,#71767e);font:750 12px/1 'DM Sans',system-ui,sans-serif;letter-spacing:.06em}.ai-size-labels span{transition:color .18s,transform .18s}.ai-size-controls[data-size="small"] .ai-size-labels span:nth-child(1),.ai-size-controls[data-size="standard"] .ai-size-labels span:nth-child(2),.ai-size-controls[data-size="full"] .ai-size-labels span:nth-child(3){color:var(--ui-text,#111114);transform:scale(1.15)}
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
  @container (max-width:740px){
    .ai-shell .ai-head{grid-template-columns:minmax(0,1fr) auto}
    .ai-workspace-switch{grid-column:1/-1;grid-row:2;justify-self:center}
    .ai-view-actions{grid-column:2;grid-row:1}
  }
  @media(max-width:480px){
    .ai-shell{padding:6px}.ai-shell .ai-dock{height:100%;border-radius:15px}
    .ai-shell .ai-content{--ai-content-gutter:8px;padding-block:8px}
    .ai-shell .ai-head{min-height:60px;padding:7px 9px;gap:7px}
    .ai-shell .ai-head .ai-badge{width:28px;height:34px}
    .ai-view-actions{gap:16px}.ai-view-actions button{padding-inline:8px}
    .ai-view-actions .power-label{display:none}
  }
  @media(max-width:330px){.ai-view-actions .back-label{display:none}}
  @media(max-width:360px){
    .ai-shell .ai-view-actions{gap:10px}
    .ai-size-controls{gap:3px;width:78px}
    .ai-size-labels{font-size:11px;padding-inline:4px}
    .ai-view-actions .ai-size-controls button{min-width:30px}
  }
  .ai-shell[data-window-size="small"] .ai-dock{width:min(88%,690px);height:min(420px,100%)}
  @media(max-width:480px){.ai-shell[data-window-size="small"] .ai-dock{width:calc(100% - 16px)}}
  .ai-shell[data-window-size="full"]{padding:0}
  .ai-shell[data-window-size="full"] .ai-dock{width:100%;height:100%;border:0;border-radius:0;box-shadow:none}
  .ai-shell .ai-history-toggle,.ai-shell .ai-panel-toggle,.ai-shell .ai-menu-drawer,.ai-shell .ai-history-drawer{display:none!important}
  @media(prefers-reduced-motion:reduce){.ai-view-actions button{transition:none;transform:none!important}}
`;
root.append(shellStyle);
if(nativeAI){
  const nativeWorkspaceStyle=document.createElement('style');
    nativeWorkspaceStyle.textContent=`.ai-shell.native-fullscreen{position:fixed;inset:0;display:grid;place-items:center;padding:0;overflow:hidden;background:var(--theme-surface,#fff)}.ai-shell.native-fullscreen[hidden]{display:none!important}.ai-shell.native-fullscreen :is(button,[role=button],input[type=range]){-webkit-tap-highlight-color:transparent}.ai-shell.native-fullscreen ::selection{background:#d9dde2;color:#111114}.ai-shell.native-fullscreen .ai-dock{width:calc(100% - 24px);height:calc(100% - 24px);max-width:none;max-height:none;border:2px solid var(--ui-divider,#858a91);border-radius:20px;box-shadow:0 8px 28px #11111418}.ai-shell.native-fullscreen[data-window-size=small] .ai-dock{width:min(88%,690px);height:min(68dvh,720px);border-radius:20px}.ai-shell.native-fullscreen[data-window-size=standard]{inset:env(safe-area-inset-top) 0 max(24px,env(safe-area-inset-bottom))}.ai-shell.native-fullscreen[data-window-size=standard] .ai-dock{width:calc(100% - 24px);height:calc(100% - 24px)}.ai-shell.native-fullscreen[data-window-size=full]{inset:env(safe-area-inset-top) 0 max(24px,env(safe-area-inset-bottom));padding:0}.ai-shell.native-fullscreen[data-window-size=full] .ai-dock{width:100%;height:100%;max-height:100%;border:0;border-radius:0;box-shadow:none}.ai-shell.native-fullscreen .ai-head{min-height:76px;padding:12px 16px}.ai-shell.native-fullscreen .ai-content{min-height:0;padding:10px 14px max(10px,env(safe-area-inset-bottom))}.ai-shell.native-fullscreen .ai-chat{height:auto;min-height:0;flex:1}.ai-shell.native-fullscreen .ai-composer-row{width:100%;gap:8px}.ai-shell.native-fullscreen .ai-quick-actions{justify-content:flex-start}.ai-shell.native-fullscreen .ai-tools{width:100%}@media(max-width:420px){.ai-shell.native-fullscreen .ai-head{grid-template-columns:minmax(0,1fr) auto;min-height:66px;padding:8px 10px;gap:6px}.ai-shell.native-fullscreen .ai-workspace-switch{display:none!important}.ai-shell.native-fullscreen .ai-head .ai-workspace-brand{grid-column:1;grid-row:1;gap:6px}.ai-shell.native-fullscreen .ai-head .ai-label{font-size:15px;white-space:nowrap}.ai-shell.native-fullscreen .ai-view-actions{grid-column:2;grid-row:1;gap:5px}.ai-shell.native-fullscreen .ai-view-actions button{min-width:36px;min-height:38px;padding:0 6px}.ai-shell.native-fullscreen .ai-size-controls{width:76px}.ai-shell.native-fullscreen .ai-size-controls input{width:76px}.ai-shell.native-fullscreen .ai-size-labels{font-size:10px}.ai-shell.native-fullscreen .ai-content{padding:7px 9px max(8px,env(safe-area-inset-bottom))}.ai-shell.native-fullscreen .ai-composer-row{flex-wrap:wrap;gap:6px}.ai-shell.native-fullscreen .ai-composer-row .ai-quick-actions{flex:none}.ai-shell.native-fullscreen .ai-composer-row .ai-form{flex-basis:100%}}`;
  root.append(nativeWorkspaceStyle);
}
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
    .win.mobile-app-mode .title-history,.win.mobile-app-mode .dotmenu{display:none!important}
    .win.mobile-app-mode .infobackdrop,.win.mobile-app-mode .infopanel{display:none!important}
    .win.mobile-app-mode .ai-dock{max-width:100%;width:100%;box-sizing:border-box}
    @media(max-width:420px){.win.mobile-app-mode .ai-dock{border-radius:12px}.win.mobile-app-mode .ai-chat{height:clamp(78px,24dvh,132px)}.win.mobile-app-mode .ai-content{padding-inline:7px}.win.mobile-app-mode .ai-form input{font-size:12px}}
    @media(orientation:landscape) and (max-height:520px){.win.mobile-app-mode .ai-head{min-height:46px;padding-block:5px}.win.mobile-app-mode .ai-chat{height:clamp(64px,22dvh,105px)}.win.mobile-app-mode .ai-content{padding-block:6px}.win.mobile-app-mode .ai-form{margin-top:5px}}
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
voice.querySelector('svg').setAttribute('viewBox','0 0 24 24');voice.querySelector('svg').setAttribute('overflow','visible');voice.querySelector('svg').setAttribute('fill','none');voice.querySelector('svg').setAttribute('stroke','currentColor');voice.querySelector('svg').setAttribute('stroke-width','2');voice.querySelector('svg').setAttribute('stroke-linecap','round');voice.querySelector('svg').setAttribute('stroke-linejoin','round');voice.querySelector('svg').innerHTML='<path d="M12 19v3M19 10v2a7 7 0 0 1-14 0v-2"/><rect x="9" y="2" width="6" height="13" rx="3"/>';
const micIconStyle=document.createElement('style');micIconStyle.textContent='.ai-dock .voice[data-voice-state=muted] svg{color:inherit!important}';root.append(micIconStyle);
tools.insertBefore(camera,tools.querySelector('.state')); tools.insertBefore(voice,tools.querySelector('.state'));
camera.title='Camera';voice.title='Voice command';
const sendButton=form.querySelector('.send');sendButton.setAttribute('aria-label','Send calculation');sendButton.insertAdjacentHTML('beforeend','<span class="send-sheen" aria-hidden="true"></span>');
const sendStyle=document.createElement('style');sendStyle.textContent=`.ai-form .send{position:relative;overflow:hidden;isolation:isolate;border-radius:11px;background:linear-gradient(155deg,#26272c,#0d0e11 68%);box-shadow:0 2px 3px #0003,0 5px 12px #0001;transition:transform .18s ease,box-shadow .18s ease,background .18s ease;letter-spacing:.01em}.ai-form .send:hover{background:linear-gradient(155deg,#36373e,#17181c 68%);box-shadow:0 4px 10px #0003;transform:translateY(-1px)}.ai-form .send:active{transform:scale(.95);box-shadow:0 1px 3px #0003}.ai-form .send:focus-visible{outline:2px solid currentColor;outline-offset:3px}.ai-form .send svg{transition:transform .2s ease}.ai-form .send:hover svg{transform:translateY(-2px)}.ai-form .send .send-sheen{position:absolute;inset:-45% auto -45% -45%;width:22%;background:linear-gradient(90deg,transparent,#ffffff35,transparent);transform:translateX(0) skewX(-20deg);pointer-events:none}.ai-form .send.sent .send-sheen{animation:ai-send-sheen .45s ease-out}.ai-form .send.sent svg{animation:ai-send-arrow .4s ease-out}@keyframes ai-send-sheen{to{transform:translateX(700%) skewX(-20deg)}}@keyframes ai-send-arrow{45%{transform:translateY(-5px);opacity:.45}46%{transform:translateY(4px);opacity:0}100%{transform:translateY(0);opacity:1}}@media(prefers-reduced-motion:reduce){.ai-form .send,.ai-form .send svg{transition:none}.ai-form .send.sent .send-sheen,.ai-form .send.sent svg{animation:none}}`;root.append(sendStyle);form.addEventListener('submit',()=>{if(!form.querySelector('input').value.trim())return;sendButton.classList.remove('sent');void sendButton.offsetWidth;sendButton.classList.add('sent')},true);
camera.insertAdjacentHTML('beforeend','<span>Camera</span>');
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
const brandLabel=dock.querySelector('.ai-label');brandLabel.innerHTML='<span class="ai-brand-title-line"><span class="ai-brand-seven">SevenTask AI</span> <span class="ai-brand-calculator">Calculator</span></span><span class="ai-brand-meta"><small>Basic calculations ready</small></span>';dock.querySelector('.ai-badge img').src='icon.svg';
const brandStyle=document.createElement('style');brandStyle.textContent=`.ai-label .ai-brand-title-line{display:block;white-space:nowrap;line-height:1.1}.ai-label .ai-brand-seven{font:400 16px/1.05 "Fjalla One","DM Sans",sans-serif;letter-spacing:.01em}.ai-label .ai-brand-calculator{font:550 14px/1.05 "DM Sans",system-ui,sans-serif;letter-spacing:-.025em}.ai-label .ai-brand-meta{display:flex;align-items:center;gap:8px;margin-top:3px}.ai-label .ai-brand-meta small{display:block!important;margin:0!important}.ai-label .ai-version{display:inline-flex;align-items:center;min-height:15px;padding:0 6px;border:1px solid var(--ai-line,#d6d9de);border-radius:999px;color:var(--ai-muted,#71767e);font:500 9px/1 'DM Sans',system-ui,sans-serif;letter-spacing:.01em;white-space:nowrap}.ai-dock .ai-badge,:is(.win,.ai-shell)[data-theme=dark] .ai-dock .ai-badge{border:0;background:transparent;box-shadow:none}.ai-badge img{width:32px;height:32px;object-fit:contain}:is(.win,.ai-shell)[data-theme=dark] .ai-badge img{filter:invert(1)}@media(max-width:420px){.ai-label .ai-brand-seven{font-size:15px}.ai-label .ai-brand-calculator{font-size:13px}.ai-label .ai-brand-meta{gap:5px}.ai-label .ai-version{min-height:14px;padding-inline:5px;font-size:8px}.ai-badge img{width:28px;height:28px}}`;root.append(brandStyle);
const panel=document.createElement('div');panel.className='ai-draw';panel.hidden=true;panel.setAttribute('role','dialog');panel.setAttribute('aria-label','Draw a calculation');panel.innerHTML=`<div class="draw-top"><span class="draw-mark"><img src="icon.svg" alt=""></span><div class="draw-heading"><b>Draw a calculation</b><span>Write numbers, symbols or a question</span></div><button type="button" class="close" aria-label="Close drawing pad"><svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6 6 18"/></svg></button></div><div class="draw-paper"><canvas width="1200" height="520" aria-label="Drawing area"></canvas><span class="draw-hint">Draw here</span></div><div class="draw-bottom"><span class="draw-note">Use your finger, pen or mouse</span><div class="draw-actions"><button type="button" class="clear"><svg viewBox="0 0 24 24"><path d="M4 7h16M9 7V4h6v3m3 0-1 13H7L6 7m4 4v5m4-5v5"/></svg>Clear</button><button type="button" class="done">Attach drawing <svg viewBox="0 0 24 24"><path d="M5 12h14m-6-6 6 6-6 6"/></svg></button></div></div>`;if(mobileLayout)assistantFrame.append(panel);
const drawStyle=document.createElement('style');drawStyle.textContent=`:is(.ai-shell,.win.mobile-app-mode) .ai-draw{position:absolute;z-index:160;inset:50% auto auto 50%;transform:translate(-50%,-50%);width:min(620px,calc(100% - 28px));height:min(470px,calc(100% - 28px));max-height:calc(100% - 28px);box-sizing:border-box;display:flex;flex-direction:column;gap:14px;padding:18px;background:var(--theme-surface,#fff);color:var(--ui-text,#111114);border:2px solid var(--ui-divider,#25282d);border-radius:18px;box-shadow:0 18px 55px #0003;font-family:'DM Sans',system-ui,sans-serif}:is(.ai-shell,.win.mobile-app-mode) .ai-draw[hidden]{display:none}.draw-top{display:flex;align-items:center;gap:10px;flex:none}.draw-mark{display:grid;place-items:center;width:37px;height:42px;flex:none}.draw-mark img{width:32px;height:38px;object-fit:contain}.draw-heading{flex:1;min-width:0}.draw-heading b{display:block;font:400 19px/1.2 'Fjalla One',sans-serif}.draw-heading span{display:block;margin-top:4px;color:#737982;font-size:12px}.ai-draw button{display:inline-flex;align-items:center;justify-content:center;gap:7px;cursor:pointer;font:600 12px 'DM Sans',sans-serif}.ai-draw button svg{width:17px;height:17px;fill:none;stroke:currentColor;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round}.ai-draw .close{width:38px;height:38px;flex:none;padding:0;border:1.5px solid var(--ui-divider,#c7cbd0);border-radius:11px;background:transparent;color:inherit}.draw-paper{position:relative;flex:1;min-height:80px;overflow:hidden;border:1.5px solid var(--ui-divider,#c7cbd0);border-radius:13px;background:#fff}.ai-draw .draw-paper canvas{display:block;width:100%;height:100%;border:0;border-radius:0;touch-action:none;background:transparent;cursor:crosshair}.draw-hint{position:absolute;top:14px;left:16px;color:#a3a7ad;font:500 12px 'DM Sans',sans-serif;pointer-events:none}.draw-paper.has-ink .draw-hint{display:none}.draw-bottom{display:flex;align-items:center;justify-content:space-between;gap:10px;flex-wrap:wrap;flex:none}.draw-note{color:#777d85;font-size:11px}.draw-actions{display:flex;gap:8px;margin-left:auto}.ai-draw .clear,.ai-draw .done{min-height:40px;padding:0 14px;border:1.5px solid var(--ui-divider,#c7cbd0);border-radius:11px;background:transparent;color:inherit}.ai-draw .done{border-color:#111114;background:#111114;color:#fff}.ai-draw button:hover{opacity:.8}.ai-draw button:focus-visible{outline:2px solid currentColor;outline-offset:2px}:is(.win,.ai-shell)[data-theme=dark] .draw-mark img{filter:invert(1)}:is(.win,.ai-shell)[data-theme=dark] .draw-heading span,:is(.win,.ai-shell)[data-theme=dark] .draw-note{color:#c5cbd3}@media(max-width:420px){:is(.ai-shell,.win.mobile-app-mode) .ai-draw{padding:13px;gap:10px}.draw-heading b{font-size:17px}.draw-heading span{font-size:11px}.draw-note{width:100%;font-size:10px}.draw-actions{width:100%}.ai-draw .clear{flex:1}.ai-draw .done{flex:2}}`;root.append(drawStyle);
const setting=document.createElement('div');setting.className='ai-setting';setting.innerHTML='<span class="ai-setting-copy"><strong>AI Calculator</strong><small class="ai-setting-status">On · Chat visible</small></span><button type="button" class="ai-setting-switch" role="switch" aria-label="AI Calculator" aria-checked="true"><span></span></button>';const place=root.querySelector('.st-settings')||root.querySelector('.theme-choice');if(mobileLayout||nativeAI)place?.before(setting);const settingStyle=document.createElement('style');settingStyle.textContent=`.win .infopanel .ai-setting{display:flex;align-items:center;gap:10px;margin:8px 0;padding:11px 10px;border:1px solid var(--ui-divider,#bfc2c6);border-radius:12px;background:var(--theme-surface,#fff);color:inherit;box-sizing:border-box}.ai-setting-icon{width:34px;height:34px;flex:none;display:grid;place-items:center;background:#fff;border:1px solid #d6d9dd;border-radius:10px}.ai-setting-icon img{width:30px;height:30px;object-fit:contain}.ai-setting-copy{display:flex;flex:1;min-width:0;flex-direction:column;gap:3px}.ai-setting-copy strong{font:650 13px/1.2 'DM Sans',system-ui,sans-serif}.ai-setting-copy small{font:400 11px/1.3 'DM Sans',system-ui,sans-serif;color:#777d85}.win .infopanel .ai-setting-switch{position:relative;flex:none;width:44px;height:26px;padding:0;border:1px solid #111114;border-radius:99px;background:#111114;cursor:pointer;transition:background .18s}.ai-setting-switch span{position:absolute;top:3px;left:21px;width:18px;height:18px;border-radius:50%;background:white;box-shadow:0 1px 3px #0003;transition:left .18s}.win .infopanel .ai-setting-switch[aria-checked=false]{background:#e0e2e5;border-color:#b9bdc3}.ai-setting-switch[aria-checked=false] span{left:3px}.ai-setting-switch:focus-visible{outline:2px solid currentColor;outline-offset:3px}:is(.win,.ai-shell)[data-theme=dark] .ai-setting-copy small{color:#c0c6cd}:is(.win,.ai-shell)[data-theme=dark] .infopanel .ai-setting{background:#30343a;border-color:#5a626b}`;if(mobileLayout||nativeAI)root.append(settingStyle);const toggle=setting.querySelector('.ai-setting-switch');
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
let fastMode=false;
try{fastMode=localStorage.getItem('seventask-ai-fast')==='true';}catch{}
const quickActions=document.createElement('div');
quickActions.className='ai-quick-actions';
quickActions.setAttribute('role','group');quickActions.setAttribute('aria-label','Assistant controls');
quickActions.innerHTML='<button type="button" class="ai-refresh" aria-label="Refresh AI connection" title="Refresh connection without clearing your chat"><img src="icon.svg" alt="" aria-hidden="true"><span>Refresh</span></button><button type="button" class="ai-fast" aria-pressed="false" aria-label="Enable Fast Mode" title="Fast Mode gives concise AI replies; calculations stay instant"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m13 2-9 12h7l-1 8 10-12h-7l1-8Z"/></svg><span>Fast</span></button><button type="button" class="clear-screen-button" aria-label="Clear all AI messages" title="Clear all messages and return to the welcome screen"><svg aria-hidden="true" viewBox="0 0 24 24"><path d="M4 7h16M9 7V4h6v3m-9 0 1 13h10l1-13M10 11v5m4-5v5"/></svg><span>Clear</span></button>';
const composerRow=document.createElement('div');
composerRow.className='ai-composer-row';
form.before(composerRow);
composerRow.append(quickActions,form);
const quickStyle=document.createElement('style');
quickStyle.textContent=`.ai-quick-actions{grid-column:1/-1;display:flex;justify-content:center;gap:7px}.ai-quick-actions button{display:inline-flex;align-items:center;justify-content:center;gap:6px;min-height:36px;min-width:38px;padding:0 11px;border:1.5px solid var(--ai-line,#bbc0c7);border-radius:10px;background:var(--ai-input,#fff);color:inherit;font:700 11px 'DM Sans',sans-serif;cursor:pointer;box-shadow:0 2px 3px #1111;transition:transform .18s,background .18s}.ai-quick-actions button svg{width:17px;height:17px;fill:none;stroke:currentColor;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round}.ai-quick-actions .ai-refresh img{width:21px;height:24px;display:block;object-fit:contain;transition:transform .25s ease}.ai-quick-actions button:hover{transform:translateY(-1px);background:var(--ai-chat,#f3f4f6)}.ai-quick-actions button:focus-visible{outline:2px solid currentColor;outline-offset:3px}.ai-quick-actions .ai-fast[aria-pressed=true]{background:#16171a;color:#fff;border-color:#16171a}.ai-refresh[aria-busy=true] img{animation:ai-refresh-spin .8s linear infinite}.ai-refresh:disabled{opacity:.65}@keyframes ai-refresh-spin{to{transform:rotate(360deg)}}@media(prefers-reduced-motion:reduce){.ai-quick-actions button{transition:none}.ai-refresh[aria-busy=true] img{animation:none}}`;
root.append(quickStyle);
const alignedControlsStyle=document.createElement('style');
alignedControlsStyle.textContent=`.ai-composer-row{display:flex;align-items:center;gap:10px;flex:none;width:min(100%,1020px);max-width:100%;box-sizing:border-box;margin:9px auto 0}.ai-composer-row .ai-form{flex:1;min-width:0;width:auto;margin:0}.ai-composer-row .ai-quick-actions{flex:none;align-items:center;gap:6px;padding:5px;border:1.5px solid var(--ai-line,#c9cdd3);border-radius:16px;background:var(--ai-input,#fff);box-shadow:0 2px 8px #1111140b}.ai-composer-row .ai-quick-actions button{height:40px;min-height:40px;min-width:40px;padding:0 11px;border-color:transparent;border-radius:11px;box-shadow:none;position:relative;overflow:hidden;transition:transform .2s ease,background .2s ease,box-shadow .2s ease}.ai-composer-row .ai-refresh{padding:0;width:40px}.ai-composer-row .ai-quick-actions svg{width:18px;height:18px;transition:transform .25s ease}.ai-composer-row .ai-quick-actions button:hover{transform:translateY(-1px);box-shadow:0 3px 7px #1112}.ai-composer-row .ai-quick-actions button:active{transform:scale(.94)}.ai-composer-row .ai-refresh:not([aria-busy=true]):hover img{transform:translateY(-1px) scale(1.06)}.ai-composer-row .ai-fast[aria-pressed=true]{box-shadow:0 2px 5px #1113}.ai-composer-row .ai-fast[aria-pressed=true] svg{animation:ai-fast-flash .35s ease-out}.ai-composer-row .ai-fast[aria-pressed=true]::after{content:'';position:absolute;inset:-60% auto -60% -50%;width:25%;background:linear-gradient(90deg,transparent,#fff4,transparent);transform:skewX(-20deg);animation:ai-fast-sheen .55s ease-out;pointer-events:none}@keyframes ai-fast-flash{50%{transform:scale(1.2);opacity:.55}}@keyframes ai-fast-sheen{to{left:140%}}.ai-shell .ai-tools{width:min(100%,1020px)}@container(max-width:440px){.ai-composer-row{flex-wrap:wrap;gap:7px}.ai-composer-row .ai-quick-actions{padding:3px;border-radius:12px}.ai-composer-row .ai-quick-actions button{height:34px;min-height:34px}.ai-composer-row .ai-form{flex-basis:100%}}@media(prefers-reduced-motion:reduce){.ai-composer-row .ai-quick-actions button,.ai-composer-row .ai-quick-actions svg,.ai-composer-row .ai-quick-actions img{transition:none}.ai-composer-row .ai-quick-actions button:hover,.ai-composer-row .ai-quick-actions button:active,.ai-composer-row .ai-refresh:hover img{transform:none}.ai-composer-row .ai-fast[aria-pressed=true] svg,.ai-composer-row .ai-fast[aria-pressed=true]::after{animation:none}}`;
root.append(alignedControlsStyle);
const unboxedControlsStyle=document.createElement('style');
unboxedControlsStyle.textContent=`.ai-composer-row .ai-quick-actions{padding:0;gap:4px;border:0;border-radius:0;background:transparent;box-shadow:none}.ai-composer-row .ai-quick-actions button{height:42px;min-height:42px;min-width:42px;padding:0 8px;border:0;border-radius:12px;background:transparent;box-shadow:none;color:inherit;transition:background .2s ease,transform .2s ease,color .2s ease}.ai-composer-row .ai-quick-actions button{gap:4px}.ai-composer-row .ai-quick-actions button>svg,.ai-composer-row .ai-quick-actions button>img{margin:0;flex:none}.ai-composer-row .ai-quick-actions button>span{margin:0;line-height:1;white-space:nowrap}.ai-composer-row .ai-refresh{width:auto;padding:0 8px 0 6px;gap:4px;font-weight:700;letter-spacing:.01em}.ai-composer-row .ai-refresh img{width:20px;height:22px}.ai-composer-row .ai-fast{gap:4px;padding:0 8px;font-weight:700;letter-spacing:.01em}.ai-composer-row .clear-screen-button{gap:4px;padding:0 8px}.ai-composer-row .ai-quick-actions button:hover{background:var(--ai-chat,#f0f1f3);box-shadow:none;transform:translateY(-1px)}.ai-composer-row .ai-fast[aria-pressed=true]{background:#16171a;color:#fff;box-shadow:0 2px 5px #1112}.ai-composer-row .ai-fast[aria-pressed=true]:hover{background:#303136;color:#fff}.ai-shell[data-theme=dark] .ai-composer-row .ai-fast[aria-pressed=true]{background:#f1f2f4;color:#17181b}.ai-composer-row .ai-quick-actions button:active{transform:scale(.94)}@container(max-width:520px){.ai-composer-row .ai-refresh span{display:none}.ai-composer-row .ai-refresh{width:38px;padding:0}}@container(max-width:440px){.ai-composer-row .ai-quick-actions{padding:0}.ai-composer-row .ai-quick-actions button{height:38px;min-height:38px}}@media(prefers-reduced-motion:reduce){.ai-composer-row .ai-quick-actions button{transition:none}.ai-composer-row .ai-quick-actions button:hover,.ai-composer-row .ai-quick-actions button:active{transform:none}}`;
root.append(unboxedControlsStyle);
const refreshDotStyle=document.createElement('style');refreshDotStyle.textContent=`.ai-composer-row .ai-refresh{position:relative;isolation:isolate;overflow:hidden!important;padding-bottom:0}.ai-composer-row .ai-refresh::after{content:'• • •';position:absolute;left:50%;bottom:1px;transform:translateX(-50%) scale(.82);transform-origin:center;font:700 8px/1 'DM Sans',sans-serif;letter-spacing:1px;color:#39b879;white-space:nowrap;opacity:0;transition:opacity .2s ease;pointer-events:none}.ai-composer-row .ai-refresh.ai-refresh-success::after{opacity:1;animation:ai-refresh-dots 1.2s ease-in-out infinite}@keyframes ai-refresh-dots{0%,100%{opacity:.48;transform:translateX(-50%) scale(.78)}50%{opacity:1;transform:translateX(-50%) scale(.9)}}@media(prefers-reduced-motion:reduce){.ai-composer-row .ai-refresh::after{animation:none!important}.ai-composer-row .ai-refresh.ai-refresh-success::after{opacity:.8}}`;root.append(refreshDotStyle);
const fastModeStyle=document.createElement('style');
fastModeStyle.textContent=`.ai-composer-row .ai-fast[aria-pressed=true] svg{animation:ai-superfast-bolt 1.15s cubic-bezier(.2,.8,.3,1) infinite}.ai-composer-row .ai-fast[aria-pressed=true]::after{animation:ai-superfast-streak 1.65s ease-in-out infinite}@keyframes ai-superfast-bolt{0%,68%,100%{transform:translateX(0) scale(1);opacity:1}76%{transform:translateX(2px) scale(1.14);opacity:.7}84%{transform:translateX(-1px) scale(.96);opacity:1}}@keyframes ai-superfast-streak{0%,52%{left:-45%;opacity:0}62%{opacity:1}86%,100%{left:135%;opacity:0}}@media(prefers-reduced-motion:reduce){.ai-composer-row .ai-fast[aria-pressed=true] svg,.ai-composer-row .ai-fast[aria-pressed=true]::after{animation:none}}`;
root.append(fastModeStyle);
const fastButton=quickActions.querySelector('.ai-fast'),refreshButton=quickActions.querySelector('.ai-refresh');
function syncFastMode(){
  fastButton.setAttribute('aria-pressed',String(fastMode));
  fastButton.setAttribute('aria-label',fastMode?'Disable Fast Mode':'Enable Fast Mode');
  fastButton.title=fastMode?'Fast Mode active · Click to use standard AI replies':'Fast Mode gives concise AI replies; calculations stay instant';
}
syncFastMode();
fastButton.onclick=()=>{fastMode=!fastMode;syncFastMode();try{localStorage.setItem('seventask-ai-fast',String(fastMode));}catch{}};
let refreshSuccessTimer=0;
refreshButton.onclick=async()=>{refreshButton.disabled=true;refreshButton.setAttribute('aria-busy','true');refreshButton.classList.remove('ai-refresh-success');const started=performance.now();try{await refreshOnline();const remaining=650-(performance.now()-started);if(remaining>0)await new Promise(resolve=>setTimeout(resolve,remaining));if(onlineReady){refreshButton.classList.add('ai-refresh-success');clearTimeout(refreshSuccessTimer);refreshSuccessTimer=setTimeout(()=>refreshButton.classList.remove('ai-refresh-success'),3500);}}finally{refreshButton.disabled=false;refreshButton.setAttribute('aria-busy','false');}};
const chat=dock.querySelector('.ai-chat'),input=dock.querySelector('input');
const historyKey='seventask-ai-history';
const historyLimit=100;
let aiHistory=[];
let historyDrawer;
function readAIHistory(){
  try{
    const entries=JSON.parse(localStorage.getItem(historyKey)||'[]');
    return Array.isArray(entries)?entries.filter(entry=>typeof entry?.query==='string'&&typeof entry.result==='string'&&Number.isFinite(entry.time)).slice(0,historyLimit):[];
  }catch{return [];}
}
function saveAIResult(query,result,inputSummary=query){
  if(!historyDrawer||!query||!result)return;
  aiHistory=[{query,result,inputSummary,time:Date.now()},...aiHistory].slice(0,historyLimit);
  try{localStorage.setItem(historyKey,JSON.stringify(aiHistory));}catch{}
  if(historyDrawer.open)renderAIHistory();
}
function renderAIHistory(){
  const list=historyDrawer.querySelector('ol');
  const fragment=document.createDocumentFragment();
  for(const entry of aiHistory){
    const item=document.createElement('li');
    const time=document.createElement('time');
    const date=new Date(entry.time);
    time.textContent=date.toLocaleString();
    const inputValue=document.createElement('span');
    inputValue.className='ai-history-input';
    inputValue.dir='auto';
    inputValue.textContent=typeof entry.inputSummary==='string'?entry.inputSummary:entry.query;
    const output=document.createElement('strong');
    output.dir='auto';
    output.textContent=entry.result;
    const reuse=document.createElement('button');
    reuse.type='button';
    reuse.textContent='Reuse input';
    reuse.onclick=()=>{
      historyDrawer.close();
      input.value=entry.query;
      input.focus();
    };
    item.append(time,inputValue,output,reuse);
    fragment.append(item);
  }
  list.replaceChildren(fragment);
  historyDrawer.querySelector('.ai-history-empty').hidden=aiHistory.length>0;
  historyDrawer.querySelector('.ai-history-clear').hidden=!aiHistory.length;
}
if(!mobileLayout){
  aiHistory=readAIHistory();
  const historyButton=document.createElement('button');
  historyButton.className='ai-panel-toggle ai-history-toggle';
  historyButton.type='button';
  historyButton.title='Calculation history';
  historyButton.setAttribute('aria-label','Open calculation history');
  historyButton.setAttribute('aria-haspopup','dialog');
  historyButton.append(win.querySelector('.title-history svg').cloneNode(true));
  actions.prepend(historyButton);
  const menuButton=document.createElement('button');
  menuButton.type='button';
  menuButton.className='ai-panel-toggle';
  menuButton.title='Open menu';
  menuButton.setAttribute('aria-label','Open menu');
  menuButton.setAttribute('aria-haspopup','dialog');
  menuButton.append(win.querySelector('.dotmenu svg').cloneNode(true));
  staticHead.querySelector('.ai-workspace-brand').prepend(menuButton);
  historyDrawer=document.createElement('dialog');
  historyDrawer.className='ai-history-drawer';
  historyDrawer.setAttribute('aria-labelledby','ai-history-title');
  historyDrawer.innerHTML='<header><h2 id="ai-history-title">History</h2><button type="button" class="ai-history-close" aria-label="Close history" autofocus>×</button></header><div class="ai-history-content"><p class="ai-history-empty">No calculations yet.</p><ol></ol></div><button type="button" class="ai-history-clear" hidden>Clear history</button>';
  const menuDrawer=document.createElement('dialog');
  menuDrawer.className='ai-history-drawer ai-menu-drawer';
  menuDrawer.setAttribute('aria-label','Calculator menu');
  const menuWrapper=document.createElement('div');
  menuWrapper.className='win ai-menu-wrapper';
  menuDrawer.append(menuWrapper);
  menuWrapper.addEventListener('click',event=>{
    if(!event.target.closest('[data-theme-option]'))return;
    queueMicrotask(()=>{
      menuWrapper.dataset.theme=win.dataset.theme||'monochrome';
      syncTheme();
    });
  });
  const originalMenu=win.querySelector('[data-infopanel]');
  // Keep the calculator theme picker visible in every AI surface (web, APK
  // preview and native wrapper).  The workspace tabs are useful for the
  // product shell, but the AI calculator itself must always expose its
  // calculator-only theme control here.
  if(staticHead.querySelector('.ai-workspace-switch')){
    const theme = document.createElement('details');
    theme.className='ai-native-theme';
    theme.innerHTML='<summary aria-label="Calculator theme"><span class="ai-theme-swatch"></span><span class="ai-theme-label"></span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="m7 10 5 5 5-5"/></svg></summary><div class="ai-theme-options" role="group" aria-label="Calculator themes"></div>';
    const colors={monochrome:'#fff',dark:'#25292e',soft:'#d9e8dc',cloud:'#e4d9ef',blue:'#d6e8f3',rose:'#efdada',sand:'#ece0c9'};
    const options=theme.querySelector('.ai-theme-options');
    function syncThemePicker(){
      const current=dock.dataset.aiTheme||'monochrome';
      for(const button of options.querySelectorAll('button')){
        const selected=button.dataset.aiTheme===current;
        button.setAttribute('aria-pressed',String(selected));
        if(selected){
          theme.querySelector('.ai-theme-label').textContent=button.textContent;
          theme.querySelector('.ai-theme-swatch').style.background=colors[current];
        }
      }
    }
    for(const option of originalMenu.querySelectorAll('[data-theme-option]')){
      const button=document.createElement('button');
      button.type='button';
      button.dataset.aiTheme=option.dataset.themeOption;
      const swatch=document.createElement('span');
      swatch.className='ai-theme-swatch';
      swatch.style.background=colors[button.dataset.aiTheme];
      button.append(swatch,document.createTextNode(option.textContent));
      button.onclick=()=>{
        dock.dataset.aiTheme=button.dataset.aiTheme;
        syncTheme();
        menuWrapper.dataset.theme=button.dataset.aiTheme;
        syncThemePicker();
        theme.open=false;
        theme.querySelector('summary').focus();
      };
      options.append(button);
    }
    syncThemePicker();
    new MutationObserver(syncThemePicker).observe(win,{attributes:true,attributeFilter:['data-theme']});
    root.addEventListener('click',event=>{if(!event.composedPath().includes(theme))theme.open=false;});
    theme.addEventListener('keydown',event=>{if(event.key==='Escape'){event.stopPropagation();theme.open=false;theme.querySelector('summary').focus();}});
    staticHead.querySelector('.ai-workspace-switch').replaceWith(theme);
    originalMenu.querySelector('.st-settings')?.remove();
    root.append(settingStyle);
    toggle.onclick=()=>{
      if(shell.hidden){showAI();}
      else{if(menuDrawer.open)menuDrawer.close();showCalculator();}
    };    menuWrapper.classList.add('ai-native-menu');
    const style=document.createElement('style');
    style.textContent=`
      .ai-native-theme{position:relative;box-sizing:border-box;min-width:148px;width:148px;max-width:min(148px,calc(100vw - 32px));justify-self:center;color:inherit;font:600 12px/1.3 'DM Sans',system-ui,sans-serif}
      .ai-native-theme summary{box-sizing:border-box;min-height:34px;display:flex;align-items:center;gap:6px;list-style:none;cursor:pointer;padding:6px 8px;border:1.5px solid var(--ai-line,#cbd0d7);border-radius:11px;background:var(--ai-input,#fff);box-shadow:0 2px 5px #1111;transition:box-shadow .18s,background .18s}
      .ai-native-theme summary::-webkit-details-marker{display:none}
      .ai-native-theme summary svg{width:14px;height:14px;margin-left:auto;flex:none;transition:transform .2s}
      .ai-native-theme .ai-theme-label{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
      .ai-native-theme[open] summary svg{transform:rotate(180deg)}
      .ai-native-theme summary:focus-visible,.ai-theme-options button:focus-visible{outline:2px solid currentColor;outline-offset:2px}
      .ai-theme-swatch{display:inline-block;width:17px;height:17px;flex:none;border:1px solid #8b9098;border-radius:50%;box-shadow:inset 0 0 0 2px #fff8}
      .ai-theme-options{position:absolute;z-index:200;top:calc(100% + 7px);left:0;right:0;max-height: min(310px,48dvh);overflow:auto;overscroll-behavior:contain;padding:5px;border:1.5px solid var(--ai-line,#cbd0d7);border-radius:13px;background:var(--ai-input,#fff);box-shadow:0 12px 28px #1113;animation:ai-theme-enter .18s ease-out}
      .ai-theme-options button{display:flex;align-items:center;gap:9px;width:100%;min-height:38px;padding:8px;border:0;border-radius:8px;background:transparent;color:inherit;text-align:left;font:inherit;cursor:pointer}
      .ai-theme-options button:hover,.ai-theme-options button[aria-pressed=true]{background:var(--ai-chat,#f0f1f3)}
      .ai-theme-options button[aria-pressed=true]::after{content:'✓';margin-left:auto;font-weight:800}
      @container(max-width:740px){.ai-native-theme{grid-column:1/-1;grid-row:2}}
      @keyframes ai-theme-enter{from{opacity:0;transform:translateY(-5px)}to{opacity:1;transform:none}}
      @media(prefers-reduced-motion:reduce){.ai-theme-options{animation:none}.ai-native-theme summary,.ai-native-theme summary svg{transition:none}}
      .ai-menu-wrapper.ai-native-menu{display:flex!important;flex-direction:column;overflow:hidden!important;background:var(--ai-input,#fff)!important}

      .ai-menu-wrapper.ai-native-menu .infopanel{position:relative!important;inset:auto!important;flex:1;min-height:0;height:auto!important;overflow-y:auto!important;overscroll-behavior:none;background:var(--ai-input,#fff)!important}
      .ai-menu-wrapper.ai-native-menu .theme-choice{display:none!important}
    `;
    root.append(style);
  }
  const menuPlaceholder=document.createComment('Calculator menu position');
  originalMenu.before(menuPlaceholder);
  const restoreMenu=()=>{
    app.closeInfoPanel();
    const title=originalMenu.querySelector('.brand-title-line');
    if(title?.dataset.calculatorTitle){
      title.innerHTML=title.dataset.calculatorTitle;
      delete title.dataset.calculatorTitle;
    }
    menuPlaceholder.after(originalMenu);
    syncTheme();
    (shell.hidden?win.querySelector('.dotmenu'):menuButton)?.focus({preventScroll:true});
  };
  menuDrawer.addEventListener('close',restoreMenu);
  originalMenu.querySelector('[data-action="info-toggle"]').addEventListener('click',()=>{
    if(menuDrawer.open)menuDrawer.close();
  });
  dock.append(menuDrawer,historyDrawer);
  function alignPanels(){
    const {left,top,height}=dock.getBoundingClientRect();
    dock.style.setProperty('--ai-panel-left',left+'px');
    dock.style.setProperty('--ai-panel-top',top+'px');
    dock.style.setProperty('--ai-panel-height',height+'px');
  }
  for(const drawer of [menuDrawer,historyDrawer]){
    drawer.querySelector('.ai-history-close')?.addEventListener('click',()=>drawer.close());
    drawer.addEventListener('keydown',event=>event.stopPropagation());
    drawer.addEventListener('click',event=>{
      if(event.target!==drawer)return;
      const bounds=drawer.getBoundingClientRect();
      if(event.clientX<bounds.left||event.clientX>bounds.right||event.clientY<bounds.top||event.clientY>bounds.bottom)drawer.close();
    });
  }
  window.addEventListener('resize',()=>{if(menuDrawer.open||historyDrawer.open)alignPanels();});
  menuButton.onclick=()=>{
    alignPanels();
    menuWrapper.dataset.theme=win.dataset.theme||'monochrome';
    const title=originalMenu.querySelector('.brand-title-line');
    if(title){
      title.dataset.calculatorTitle=title.innerHTML;
      title.innerHTML='<span class="ai-brand-seven">SevenTask AI</span> <span class="ai-brand-calculator">Calculator</span>';
    }
    menuWrapper.append(originalMenu);
    menuDrawer.showModal();
    app.openInfoPanel();
    originalMenu.querySelector('[data-action="info-toggle"]').focus();
  };
  historyButton.onclick=()=>{
    renderAIHistory();
    alignPanels();
    historyDrawer.showModal();
  };
  historyDrawer.querySelector('.ai-history-clear').onclick=()=>{
    if(!window.confirm('Clear all AI calculation history from this browser?'))return;
    aiHistory=[];
    try{localStorage.removeItem(historyKey);}catch{}
    renderAIHistory();
    historyDrawer.querySelector('.ai-history-close').focus();
  };
  window.addEventListener('storage',event=>{
    if(event.key!==historyKey&&event.key!==null)return;
    aiHistory=readAIHistory();
    if(historyDrawer.open)renderAIHistory();
  });
  const historyStyle=document.createElement('style');
  historyStyle.textContent=`
    .ai-head .ai-panel-toggle,.ai-history-close{flex:none;display:grid;place-items:center;width:34px;height:36px;min-width:34px;min-height:36px;padding:0;border:0;border-radius:9px;background:transparent;color:inherit;cursor:pointer}
    .ai-panel-toggle svg{width:20px;height:20px}
    .ai-history-toggle svg{transition:transform .26s cubic-bezier(.2,.8,.25,1)}
    .ai-history-toggle:hover svg{transform:rotate(-22deg) scale(1.2)}
    .ai-history-toggle:active svg{transform:scale(.9)}
    .ai-panel-toggle:hover,.ai-history-close:hover,.ai-history-drawer li button:hover{background:var(--ai-chat,#f3f4f6)}
    .ai-history-drawer{position:fixed;inset:var(--ai-panel-top,0) auto auto var(--ai-panel-left,0);box-sizing:border-box;margin:0;width:min(280px,calc(100% - 40px));max-width:none;height:var(--ai-panel-height,100%);max-height:100dvh;padding:0;border:1.5px solid var(--ui-divider,#45484c);border-radius:14px 0 0 14px;background:var(--theme-surface,#fff);color:inherit;box-shadow:0 12px 36px #1114;font:inherit;overflow:hidden}
    .ai-history-drawer[open]{display:flex;flex-direction:column;animation:ai-history-enter .2s ease-out}
    .ai-history-drawer::backdrop{background:#11111438}
    .ai-history-drawer.ai-menu-drawer{padding:0}
    .ai-menu-wrapper{position:relative!important;inset:auto!important;width:100%!important;height:100%!important;min-width:0!important;min-height:0!important;max-width:none!important;max-height:none!important;border:0!important;border-radius:0!important;box-shadow:none!important;overflow:hidden;visibility:visible!important;opacity:1!important;pointer-events:auto!important;transform:none!important;transition:none!important}
    .ai-menu-wrapper .brand-title-line .ai-brand-seven{font:400 17px/1.2 "Fjalla One","DM Sans",sans-serif!important}
    .ai-menu-wrapper .brand-title-line .ai-brand-calculator{font:550 14px/1.2 "DM Sans",system-ui,sans-serif!important}
    .ai-menu-wrapper.ai-native-menu .infopanel .infobrand{position:sticky!important;top:-18px!important;z-index:2;background:var(--ai-input,#fff)!important;padding-block:18px!important}
    .ai-menu-wrapper .infopanel{width:100%!important;max-width:none!important;box-sizing:border-box}
    .ai-history-drawer header{display:flex;align-items:center;justify-content:space-between;padding:14px;border-bottom:1px solid var(--ui-divider,#858a91)}
    .ai-history-drawer h2{margin:0;font:400 20px 'Fjalla One',sans-serif}
    .ai-history-close{font-size:24px}
    .ai-history-content{overflow:auto;overscroll-behavior:contain;padding:10px}
    .ai-history-empty{text-align:center;color:var(--ai-muted,#71767e);padding:12px}
    .ai-history-drawer ol{list-style:none;margin:0;padding:0;display:grid;gap:8px}
    .ai-history-drawer li{display:grid;gap:5px;padding:10px;border:1px solid var(--ui-divider,#858a91);border-radius:12px;background:var(--ai-input,#fff);overflow-wrap:anywhere}
    .ai-history-drawer time,.ai-history-input,.ai-result-input{color:var(--ai-muted,#71767e);font-size:11px}
    .ai-result-input{display:block;overflow-wrap:anywhere}
    .ai-history-drawer strong{white-space:pre-wrap}
    .ai-history-drawer li button{justify-self:start;border:1px solid var(--ai-line,#c9cdd3);border-radius:7px;background:transparent;color:inherit;cursor:pointer;padding:5px 8px;font:inherit;font-size:11px}
    .ai-history-clear{flex:none;padding:12px;border:0;border-top:1px solid var(--ui-divider,#858a91);background:transparent;color:inherit;font:inherit;cursor:pointer}
    .ai-history-clear:hover{background:var(--ai-chat,#f3f4f6)}
    .ai-menu-section{display:grid;gap:7px;padding:10px 6px;border-bottom:1px solid var(--ui-divider,#858a91)}
    .ai-menu-section p{margin:0}
    .ai-menu-section :is(select,button,a){box-sizing:border-box;display:block;width:100%;margin-top:4px;padding:8px;border:1px solid var(--ai-line,#bbc0c7);border-radius:8px;background:var(--ai-input,#fff);color:inherit;font:inherit;text-align:left;text-decoration:none}
    .ai-menu-section :is(button,a){cursor:pointer}
    .ai-menu-section :is(button,a):hover{background:var(--ai-chat,#f3f4f6)}
    .ai-shell .ai-view-actions{gap:clamp(3px,1vw,12px)}
    @keyframes ai-history-enter{from{transform:translateX(-100%)}to{transform:none}}
    @media(prefers-reduced-motion:reduce){.ai-history-drawer[open]{animation:none}.ai-history-toggle svg{transition:none}}
    @container(max-width:390px){.ai-workspace-brand .ai-badge{display:none}}
  `;
  root.append(historyStyle);
}
const welcomeScreen=chat.firstElementChild;
let screenGeneration=0;
const clearScreenButton=quickActions.querySelector('.clear-screen-button');
clearScreenButton.querySelector('svg').innerHTML='<path d="M5 7.5h14M9 7.5V4.5h6v3M7.2 7.5l.9 13h7.8l.9-13M10.5 11v6m3-6v6"/><path d="M3.5 7.5h17"/>';
clearScreenButton.querySelector('span').textContent='Trash';
const clearScreenStyle=document.createElement('style');
clearScreenStyle.textContent=`.ai-quick-actions .clear-screen-button{display:inline-flex;align-items:center;justify-content:center;gap:6px;min-height:42px;min-width:42px;padding:0 10px;border:0;border-radius:12px;background:transparent;color:inherit;font:700 11px 'DM Sans',sans-serif;cursor:pointer;transition:background .18s ease,transform .18s ease}.ai-quick-actions .clear-screen-button svg{width:17px;height:17px;fill:none;stroke:currentColor;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round}.ai-quick-actions .clear-screen-button:hover{background:var(--ai-chat,#f1f2f4);transform:translateY(-1px)}.ai-quick-actions .clear-screen-button:active{transform:scale(.96)}.ai-quick-actions .clear-screen-button:focus-visible{outline:2px solid currentColor;outline-offset:2px}@container(max-width:520px){.ai-quick-actions .clear-screen-button{min-width:38px;padding:0 9px}}@media(prefers-reduced-motion:reduce){.ai-quick-actions .clear-screen-button{transition:none}.ai-quick-actions .clear-screen-button:hover,.ai-quick-actions .clear-screen-button:active{transform:none}}`;
root.append(clearScreenStyle);
clearScreenButton.onclick=()=>{
  screenGeneration++;
  guided=null;
  commands.reset();
  stopVoice?.();
  panel.hidden=true;
  input.value='';
  chat.replaceChildren(welcomeScreen);
  chat.scrollTop=0;
  input.focus({preventScroll:true});
};
function message(text,cls){
  const note=document.createElement('p');
  note.className=cls||'assistant-message';
  note.dir='auto';
  note.textContent=text;
  if(cls==='you'&&text)note.append(createMessageActions(text,'input',note));
  chat.append(note);
  chat.scrollTop=chat.scrollHeight;
  return note;
}
function localLanguage(text=''){
  if(/[\u0900-\u097f]/u.test(text))return 'hi';
  if(/[\u0600-\u06ff]/u.test(text))return 'ur';
  if(/[\u0980-\u09ff]/u.test(text))return 'bn';
  if(/[\u0a80-\u0aff]/u.test(text))return 'gu';
  if(/[\u0a00-\u0a7f]/u.test(text))return 'pa';
  if(/[\u0b80-\u0bff]/u.test(text))return 'ta';
  if(/[\u0c00-\u0c7f]/u.test(text))return 'te';
  if(/[\u4e00-\u9fff]/u.test(text))return 'zh';
  if(/[\u3040-\u30ff]/u.test(text))return 'ja';
  if(/[\uac00-\ud7af]/u.test(text))return 'ko';
  if(/[\u0400-\u04ff]/u.test(text))return 'ru';
  if(/\b(?:kya|kitna|kitni|ka|ki|hai|karo|batao|jod|ghata|guna|hisaab|hisab)\b/i.test(text))return 'hinglish';
  return 'en';
}
function resultLabelFor(text=''){
  const detected=localLanguage(text);
  return ({hi:'परिणाम',ur:'نتیجہ',bn:'ফলাফল',gu:'પરિણામ',pa:'ਨਤੀਜਾ',ta:'முடிவு',te:'ఫలితం',zh:'结果',ja:'結果',ko:'결과',ru:'Результат',hinglish:'Jawaab',en:'Result'})[detected==='en'?conversationLanguage:detected]||'Result';
}
function showResultInput(note,query){
  if(!historyDrawer||!query)return;
  const inputLine=document.createElement('span');
  inputLine.className='ai-result-input';
  inputLine.dir='auto';
  inputLine.textContent=query;
  note.prepend(inputLine);
}
function createMessageActions(text,kind='result',messageNode=null){
  const actions=document.createElement('span');
  actions.className='ai-message-actions';
  const make=(label,icon,handler)=>{const b=document.createElement('button');b.type='button';b.className='ai-message-action';b.setAttribute('aria-label',label);b.title=label;b.innerHTML=icon;b.onclick=event=>{event.stopPropagation();handler(b)};return b};
  const copyIcon='<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="8" y="8" width="11" height="11" rx="2"/><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2"/></svg>';
  const shareIcon='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 16V4m-4 4 4-4 4 4"/><path d="M5 13v5a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-5"/></svg>';
  const editIcon='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h9"/><path d="m18.5 2.5 3 3L11 16l-4 1 1-4 10.5-10.5Z"/></svg>';
  const soundIcon='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 10v4h4l5 4V6l-5 4H4Z"/><path d="M17 9a5 5 0 0 1 0 6M19.5 6.5a9 9 0 0 1 0 11"/></svg>';
  const speakLang={hi:'hi-IN',ur:'ur-PK',bn:'bn-IN',gu:'gu-IN',pa:'pa-IN',ta:'ta-IN',te:'te-IN',zh:'zh-CN',ja:'ja-JP',ko:'ko-KR',ru:'ru-RU',hinglish:'hi-IN',en:'en-US'};
  const copyButton=make('Copy message',copyIcon,b=>{navigator.clipboard?.writeText(text).then(()=>{b.classList.add('is-done');setTimeout(()=>b.classList.remove('is-done'),900)}).catch(()=>{});});
  const soundButton=make('Read aloud',soundIcon,b=>{if('speechSynthesis' in window){speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(text);u.lang=speakLang[localLanguage(text)]||'en-US';u.onstart=()=>b.classList.add('is-active');u.onend=()=>b.classList.remove('is-active');speechSynthesis.speak(u)}});
  const shareButton=make('Share as JPG',shareIcon,b=>showShareCard(text,b));
  const editButton=make('Edit message',editIcon,()=>{
    // Editing a user turn starts a fresh branch of the conversation. Remove
    // every response/result after it so old output cannot look like it belongs
    // to the corrected request.
    screenGeneration++;
    guided?.controls?.remove();
    guided=null;
    commands.reset();
    input.value=text;
    input.focus({preventScroll:true});
    let node=messageNode;
    while(node){const next=node.nextElementSibling;node.remove();node=next;}
  });
  actions.append(copyButton);
  if(kind==='input')actions.append(editButton);
  return actions;
}
function showShareCard(text,sourceButton){
  const canvas=document.createElement('canvas');canvas.width=1200;canvas.height=720;const ctx=canvas.getContext('2d');
  const bg=getComputedStyle(dock).getPropertyValue('--theme-surface').trim()||'#fff';const ink=getComputedStyle(dock).getPropertyValue('--ui-text').trim()||'#111114';
  ctx.fillStyle=bg;ctx.fillRect(0,0,canvas.width,canvas.height);ctx.fillStyle=ink;ctx.font='700 34px DM Sans, sans-serif';ctx.fillText('SevenTask AI Calculator',72,88);ctx.font='500 22px DM Sans, sans-serif';ctx.globalAlpha=.7;ctx.fillText('Calculator result',72,126);ctx.globalAlpha=1;ctx.font='600 30px DM Sans, sans-serif';ctx.fillText('Result',72,210);ctx.font='500 34px DM Sans, sans-serif';ctx.fillText(text.slice(0,48),72,270);ctx.strokeStyle=ink;ctx.globalAlpha=.18;ctx.lineWidth=2;ctx.strokeRect(60,165,1080,180);ctx.globalAlpha=1;ctx.font='700 18px DM Sans, sans-serif';ctx.globalAlpha=.55;ctx.fillText('seventaskcalculator.in',72,650);ctx.globalAlpha=1;
  const url=canvas.toDataURL('image/jpeg',.92);const preview=document.createElement('dialog');preview.className='ai-share-preview';preview.innerHTML='<form method="dialog"><button class="ai-share-close" aria-label="Close preview">×</button></form><img alt="JPG share preview"><div class="ai-share-actions"><button type="button" class="ai-share-download">Save JPG</button><button type="button" class="ai-share-native">Share</button></div>';preview.querySelector('img').src=url;document.body.append(preview);preview.showModal();const blobPromise=fetch(url).then(r=>r.blob());preview.querySelector('.ai-share-download').onclick=()=>{const a=document.createElement('a');a.href=url;a.download='seventask-ai-result.jpg';a.click()};preview.querySelector('.ai-share-native').onclick=async()=>{try{const blob=await blobPromise;const file=new File([blob],'seventask-ai-result.jpg',{type:'image/jpeg'});if(navigator.canShare?.({files:[file]}))await navigator.share({files:[file],title:'SevenTask AI result'});else preview.querySelector('.ai-share-download').click()}catch{}};preview.addEventListener('close',()=>preview.remove());sourceButton?.classList.add('is-done');
}
function resultMessage(value,query='',label=''){
  const note=document.createElement('p');
  note.className='assistant-message ai-result-message';
  note.dir='auto';
  const caption=document.createElement('span');
  caption.className='ai-result-label';
  caption.textContent=label||resultLabelFor(query);
  const output=document.createElement('strong');
  output.className='ai-result-value';
  output.textContent=value;
  note.append(caption,output);
  showResultInput(note,query);
  note.append(createMessageActions(String(value),'result'));
  saveAIResult(query,value);
  chat.append(note);
  chat.scrollTop=chat.scrollHeight;
  return note;
}
function syncTheme(){
  const key=dock.dataset.aiTheme||'monochrome';
  const palettes={
    monochrome:{surface:'#fff',text:'#111114',divider:'#858a91',chat:'#f7f8fa',input:'#fff',line:'#d0d3d7',muted:'#71767e'},
    dark:{surface:'#171a20',text:'#f7f8fa',divider:'#747b87',chat:'#252b33',input:'#20252c',line:'#626b78',muted:'#c5cbd3'},
    soft:{surface:'#f1f7f2',text:'#17251c',divider:'#9bb7a4',chat:'#e6f0e8',input:'#fbfefb',line:'#bccdc0',muted:'#587064'},
    cloud:{surface:'#f7f3fb',text:'#30233e',divider:'#bca8d0',chat:'#eee6f6',input:'#fdfbff',line:'#d1c5df',muted:'#766583'},
    blue:{surface:'#f1f8fc',text:'#172d3b',divider:'#9bb8ca',chat:'#e4f0f7',input:'#fbfdff',line:'#b7ccd9',muted:'#5a7788'},
    rose:{surface:'#fcf5f5',text:'#3b2022',divider:'#c99fa1',chat:'#f7e9e9',input:'#fffafa',line:'#dcc2c2',muted:'#896567'},
    sand:{surface:'#fbf7ef',text:'#3b2d1d',divider:'#c9b99e',chat:'#f4ecdf',input:'#fffcf6',line:'#d8cbb6',muted:'#806d54'}
  };
  const palette=palettes[key]||palettes.monochrome;
  shell.dataset.theme=key;
  for(const [token,value] of Object.entries({'--theme-surface':palette.surface,'--ui-text':palette.text,'--ui-divider':palette.divider,'--ai-chat':palette.chat,'--ai-input':palette.input,'--ai-line':palette.line,'--ai-muted':palette.muted}))dock.style.setProperty(token,value);
  shell.style.setProperty('--theme-surface','#fff');
  shell.style.setProperty('--ui-text','#111114');
  shell.style.setProperty('--ui-divider','#d8dbe0');
}
let previousCalculatorMenu=null;
let calculatorCloseTimer=0;
function showAI(){
  if(!shell.hidden)return;
  if(calculatorCloseTimer){window.clearTimeout(calculatorCloseTimer);calculatorCloseTimer=0;}
  shell.classList.remove('is-closing');
  const infoPanel=win.querySelector('[data-infopanel]');
  previousCalculatorMenu={open:!!infoPanel?.classList.contains('open'),scrollTop:infoPanel?.scrollTop||0};
  app.closeInfoPanel();
  syncTheme();
  win.inert=true;
  win.classList.add('ai-view-hidden');
  shell.hidden=false;
  toggle.setAttribute('aria-checked','true');
  setting.querySelector('.ai-setting-status').textContent='On · Chat visible';
  const aiEntry=root.querySelector('[data-action="open-ai-calculator"]');
  aiEntry?.setAttribute('aria-checked','true');
  aiEntry?.setAttribute('aria-label','AI Calculator, on');
  const aiEntryState=aiEntry?.querySelector('.mobile-ai-copy small');
  if(aiEntryState)aiEntryState.textContent='On · AI Calculator open';
  document.body.classList.add('ai-workspace-open');
  actions.querySelector('.power-button').focus({preventScroll:true});
}
function showCalculator(){
  stopVoice();
  panel.hidden=true;
  if(calculatorCloseTimer)return;
  if(!shell.hidden){
    shell.classList.add('is-closing');
    win.inert=true;
    calculatorCloseTimer=window.setTimeout(()=>{
      calculatorCloseTimer=0;
      shell.hidden=true;
      finishShowCalculator();
    },170);
    return;
  }
  finishShowCalculator();
}
function finishShowCalculator(){
  shell.hidden=true;
  shell.classList.remove('is-closing');
  toggle.setAttribute('aria-checked','false');
  setting.querySelector('.ai-setting-status').textContent='Off · Chat hidden';
  const aiEntry=root.querySelector('[data-action="open-ai-calculator"]');
  aiEntry?.setAttribute('aria-checked','false');
  aiEntry?.setAttribute('aria-label','AI Calculator, off');
  const aiEntryState=aiEntry?.querySelector('.mobile-ai-copy small');
  if(aiEntryState)aiEntryState.textContent='Off · Tap to launch';
  document.body.classList.remove('ai-workspace-open');
  win.classList.remove('ai-view-hidden');
  win.inert=false;
  if(!win.classList.contains('open'))app.open();
  win.querySelector('[data-infopanel]')?.classList.remove('open');
  win.querySelector('[data-infobackdrop]')?.classList.remove('open');
  win.querySelector('.dotmenu')?.setAttribute('aria-expanded','false');
  win.querySelector('.dotmenu')?.focus({preventScroll:true});
  previousCalculatorMenu=null;
}
if(!nativeAI&&!mobileLayout){
  window.SevenTaskWebAI={open:showAI,close:showCalculator,isOpen:()=>!shell.hidden};
}
if(mobileLayout){
  const settingKey='st-ai-demo-mobile';
  // The native app opens this bundled page only after the user enables AI.
  // Start its chat dock visible in APK launches; keep the browser preview opt-in.
  let enabled=nativeAI||localStorage.getItem(settingKey)==='on';
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
  sizing.innerHTML='<input type="range" min="0" max="2" step="1" value="1" aria-label="AI window size" aria-valuetext="Medium"><span class="ai-size-labels"><span role="button" tabindex="0" aria-label="Small size">S</span><span role="button" tabindex="0" aria-label="Medium size">M</span><span role="button" tabindex="0" aria-label="Large size">L</span></span>';
  const slider=sizing.querySelector('input');
  const sizeLabels=['Small','Medium','Large'];
  function updateSizeControl(index){
    sizing.dataset.size=sizes[index];
    slider.setAttribute('aria-valuetext',sizeLabels[index]);
    slider.style.setProperty('--size-position',index*50+'%');
    sizing.querySelectorAll('.ai-size-labels [role="button"]').forEach((label,labelIndex)=>label.setAttribute('aria-pressed',String(labelIndex===index)));
  }
  function setSize(index){
    sizeIndex=index;
    shell.dataset.windowSize=sizes[index];
    slider.value=String(index);
    updateSizeControl(index);
    if(nativeAI)window.SevenTaskNative?.setAiWindowSize?.(index);
  }
  slider.addEventListener('input',()=>updateSizeControl(Number(slider.value)));
  slider.addEventListener('change',()=>setSize(Number(slider.value)));
  slider.addEventListener('pointerup',()=>setSize(Number(slider.value)));
  slider.addEventListener('pointercancel',()=>setSize(Number(slider.value)));
  sizing.querySelectorAll('.ai-size-labels [role="button"]').forEach((label,index)=>{
    label.style.cursor='pointer';
    label.addEventListener('click',()=>setSize(index));
    label.addEventListener('keydown',event=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();setSize(index)}});
  });
  actions.querySelector('.power-button').before(sizing);
  setSize(sizeIndex);
  document.querySelector('.web-page-footer-ai')?.addEventListener('click',showAI);
  actions.querySelector('.back-button').remove();
  actions.querySelector('.power-button').onclick=showCalculator;
  const requestedWorkspace=new URLSearchParams(location.search).get('workspace');
  if(requestedWorkspace==='ai')showAI();
  else if(requestedWorkspace==='calculator')app.open();
  else if(nativeAI)showAI();
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
const conversationStyle=document.createElement('style');conversationStyle.textContent=`.ai-chat .assistant-message:not(.ai-pending):not(.ai-result-message)::before{content:'SevenTask AI';display:block;margin-bottom:4px;color:var(--ai-muted,#71767e);font:700 9px/1.2 'DM Sans',system-ui,sans-serif;letter-spacing:.06em;text-transform:uppercase}.ai-chat .ai-result-message{position:relative;isolation:isolate;display:grid;gap:5px;min-width:150px;padding:12px 15px;overflow:hidden;border-width:1.5px;box-shadow:0 8px 22px #11111413;animation:ai-result-enter .42s cubic-bezier(.2,.8,.2,1) both}.ai-chat .ai-result-message::after{content:'';position:absolute;z-index:-1;inset:-70% auto -70% -45%;width:38%;background:linear-gradient(90deg,transparent,#ffffffb8,transparent);transform:skewX(-18deg);animation:ai-result-sheen .85s .18s ease-out both}.ai-result-input{margin:0 0 1px;padding:0 0 8px;border-bottom:1px dashed color-mix(in srgb,var(--ai-line,#c9cdd3) 90%,transparent);font:500 11px/1.25 'DM Sans',system-ui,sans-serif;letter-spacing:.01em}.ai-result-label{margin-top:1px;color:var(--ai-muted,#71767e);font:700 10px/1.2 'DM Sans',system-ui,sans-serif;letter-spacing:.075em;text-transform:uppercase}.ai-result-value{font:600 clamp(25px,4vw,34px)/1.02 'DM Sans',system-ui,sans-serif;letter-spacing:-.05em;font-variant-numeric:tabular-nums;text-wrap:balance}@keyframes ai-result-enter{from{opacity:0;transform:translateY(9px) scale(.97);filter:blur(3px)}to{opacity:1;transform:none;filter:none}}@keyframes ai-result-sheen{from{left:-45%}to{left:125%}}:is(.win,.ai-shell)[data-theme=dark] .ai-chat .ai-result-message::after{background:linear-gradient(90deg,transparent,#ffffff26,transparent)}@media(prefers-reduced-motion:reduce){.ai-chat .ai-result-message,.ai-chat .ai-result-message::after{animation:none}}`;root.append(conversationStyle);
const messageActionStyle=document.createElement('style');messageActionStyle.textContent=`.ai-message-actions{display:flex;align-items:center;gap:8px;margin-top:8px;color:var(--ai-muted,#8a9098)}.ai-message-action{display:inline-grid;place-items:center;width:25px;height:25px;padding:0;border:0;border-radius:7px;background:transparent;color:inherit;cursor:pointer;transition:background .16s ease,color .16s ease,transform .16s ease}.ai-message-action svg{width:17px;height:17px;fill:none;stroke:currentColor;stroke-width:1.7;stroke-linecap:round;stroke-linejoin:round}.ai-message-action:hover{background:var(--ai-chat,#f0f1f3);color:var(--ui-text,#111114);transform:translateY(-1px)}.you .ai-message-actions{color:#f4f5f6}.you .ai-message-action:hover{background:#ffffff1f;color:#fff}.you .ai-message-action:focus-visible{outline-color:#fff}.ai-message-action:active{transform:scale(.9)}.ai-message-action.is-active,.ai-message-action.is-done{color:#2f9d6a;background:#e3f4eb}.you .ai-message-action.is-active,.you .ai-message-action.is-done{color:#fff;background:#ffffff2a}.ai-message-action:focus-visible{outline:2px solid currentColor;outline-offset:2px}.ai-share-preview{position:relative;width:min(520px,calc(100% - 28px));max-height:calc(100dvh - 32px);box-sizing:border-box;overflow:auto;padding:16px;border:1.5px solid var(--ai-line,#cbd0d7);border-radius:18px;background:var(--ai-input,#fff);color:var(--ui-text,#111114);box-shadow:0 20px 60px #0004}.ai-share-preview::backdrop{background:#11111466;backdrop-filter:blur(3px)}.ai-share-preview img{display:block;width:100%;max-height:min(56dvh,420px);height:auto;object-fit:contain;border:1px solid var(--ai-line,#d0d3d7);border-radius:12px;background:var(--ai-chat,#f0f1f3)}.ai-share-close{position:absolute;top:10px;right:10px;width:30px;height:30px;border:0;border-radius:50%;background:var(--ai-chat,#f0f1f3);color:inherit;font-size:22px;cursor:pointer}.ai-share-actions{display:flex;justify-content:flex-end;gap:8px;margin-top:12px}.ai-share-actions button{min-height:36px;padding:0 14px;border:1px solid var(--ai-line,#cbd0d7);border-radius:10px;background:var(--ai-input,#fff);color:inherit;font:650 12px 'DM Sans',sans-serif;cursor:pointer}.ai-share-actions .ai-share-native{background:#111114;color:#fff;border-color:#111114}@media(max-width:420px){.ai-share-preview{width:calc(100% - 20px);padding:11px}.ai-share-preview img{max-height:52dvh}}@media(prefers-reduced-motion:reduce){.ai-message-action{transition:none}}`;root.append(messageActionStyle);
const editMessageStyle=document.createElement('style');editMessageStyle.textContent='.ai-edit-message{float:right;margin:4px -4px -4px 8px}';root.append(editMessageStyle);
const refreshDotPolish=document.createElement('style');refreshDotPolish.textContent='.ai-composer-row .ai-refresh::after{left:50%;font-size:8px;font-weight:700;letter-spacing:1px;line-height:1;bottom:1px;max-width:100%;overflow:hidden}';root.append(refreshDotPolish);
const refreshSignalStyle=document.createElement('style');refreshSignalStyle.textContent='.ai-composer-row .ai-refresh.ai-refresh-success{position:relative}.ai-composer-row .ai-refresh.ai-refresh-success::after{content:"• • •";color:#31b77a;font:700 7px/1 \'DM Sans\',sans-serif;letter-spacing:1px;bottom:1px;transform:translateX(-50%) scale(.82);animation:ai-signal-pulse 1.2s ease-in-out 2}.ai-composer-row .ai-refresh.ai-refresh-success img{opacity:1}@keyframes ai-signal-pulse{0%,100%{opacity:.45;transform:translateX(-50%) scale(.78)}50%{opacity:1;transform:translateX(-50%) scale(.9)}}';root.append(refreshSignalStyle);
const refreshScaleStyle=document.createElement('style');refreshScaleStyle.textContent='.ai-composer-row .ai-refresh span{font-size:12px}.ai-shell[data-window-size="full"] .ai-composer-row .ai-refresh span{font-size:13px}.ai-shell[data-window-size="small"] .ai-composer-row .ai-refresh span{font-size:11px}';root.append(refreshScaleStyle);
const sizeProStyle=document.createElement('style');sizeProStyle.textContent='.ai-size-controls input::-webkit-slider-runnable-track{background:linear-gradient(to right,#38b879 var(--size-position,50%),#dfe4e1 var(--size-position,50%));border-color:#9bb6a6}.ai-size-controls input::-webkit-slider-thumb{border-color:#239b67;box-shadow:0 0 0 3px #fff,0 0 0 5px #38b87955,0 2px 6px #1114}.ai-size-controls input::-moz-range-progress{background:#38b879}.ai-size-controls input::-moz-range-thumb{border-color:#239b67;box-shadow:0 0 0 3px #fff,0 0 0 5px #38b87955,0 2px 6px #1114}.ai-size-controls[data-size="small"] .ai-size-labels span:nth-child(1),.ai-size-controls[data-size="standard"] .ai-size-labels span:nth-child(2),.ai-size-controls[data-size="full"] .ai-size-labels span:nth-child(3){position:relative;color:#229861}.ai-size-controls[data-size="small"] .ai-size-labels span:nth-child(1)::after,.ai-size-controls[data-size="standard"] .ai-size-labels span:nth-child(2)::after,.ai-size-controls[data-size="full"] .ai-size-labels span:nth-child(3)::after{content:"";position:absolute;left:50%;top:-7px;width:4px;height:4px;border-radius:50%;background:#38b879;transform:translateX(-50%);animation:ai-size-dot .8s ease-out}@keyframes ai-size-dot{from{opacity:0;transform:translateX(-50%) scale(.4)}to{opacity:1;transform:translateX(-50%) scale(1)}}';root.append(sizeProStyle);
const sizeClassicStyle=document.createElement('style');sizeClassicStyle.textContent='.ai-size-controls input::-webkit-slider-runnable-track{background:linear-gradient(to right,#111114 var(--size-position,50%),#e0e2e5 var(--size-position,50%));border-color:#b6bac1}.ai-size-controls input::-webkit-slider-thumb{width:15px;height:15px;margin-top:-5px;border-width:2px;border-color:#111114;box-shadow:0 0 0 2px #fff,0 0 0 3px #11111444,0 1px 3px #1113}.ai-size-controls input::-moz-range-progress{background:#111114}.ai-size-controls input::-moz-range-thumb{width:13px;height:13px;border-width:2px;border-color:#111114;box-shadow:0 0 0 2px #fff,0 0 0 3px #11111444,0 1px 3px #1113}.ai-size-controls[data-size] .ai-size-labels span{color:var(--ai-muted,#71767e)}.ai-size-controls[data-size] .ai-size-labels span::after{display:none!important}';root.append(sizeClassicStyle);
const mutedVoicePolish=document.createElement('style');mutedVoicePolish.textContent='.ai-dock .voice[data-voice-state=muted]{background:linear-gradient(145deg,#fff5f5,#f3e1e3)!important;border-color:#d58a93!important;color:#9f3441!important;box-shadow:0 0 0 3px #cf39481c,0 3px 8px #8e243322!important}.ai-dock .voice[data-voice-state=muted]::after{background:#cf3948!important;border-color:#fff!important;box-shadow:0 0 0 2px #cf39481f}.ai-dock .voice[data-voice-state=muted]:hover{transform:translateY(-2px) scale(1.04);box-shadow:0 0 0 4px #cf394825,0 6px 14px #8e243332!important}.online-voice-status{border-color:#d58a93!important;background:var(--ai-input,#fff)!important;box-shadow:0 8px 20px #8e243322!important}';root.append(mutedVoicePolish);
const micNoBoxStyle=document.createElement('style');micNoBoxStyle.textContent='.ai-dock .voice,.ai-dock .voice[data-voice-state=muted],.ai-dock .voice[data-voice-state=listening]{position:relative;border:0!important;border-radius:0!important;background:transparent!important;box-shadow:none!important;overflow:visible!important}.ai-dock .voice svg{display:block;overflow:visible!important;width:40px!important;height:40px!important;flex:none;transition:transform .24s cubic-bezier(.2,.8,.25,1),opacity .24s ease}.ai-dock .voice .mic-muted,.ai-dock .voice .mic-normal{overflow:visible!important;stroke-linecap:round;stroke-linejoin:round}.ai-dock .voice:hover{transform:translateY(-1px) scale(1.04)!important;background:transparent!important;box-shadow:none!important}.ai-dock .voice:active{transform:scale(.96)!important}.ai-dock .voice::after{display:none!important}.ai-dock .voice[data-voice-state=muted]::after{content:"";display:block!important;position:absolute;right:5px;top:50%;width:5px;height:5px;border-radius:50%;background:#111114;transform:translateY(-50%)}.ai-dock .voice[data-voice-state=muted]:hover{transform:translateY(-1px) scale(1.04)!important}.ai-dock .voice[data-voice-state=muted]{color:#111114!important}.ai-dock .voice[data-voice-state=muted]::before{display:none!important}.ai-dock .voice[data-voice-state=muted] svg{color:#111114!important}';root.append(micNoBoxStyle);
const micSingleIconStyle=document.createElement('style');micSingleIconStyle.textContent='.ai-dock .voice::after,.ai-dock .voice[data-voice-state=muted]::after{display:none!important}.ai-dock .voice[data-voice-state=muted] svg{color:inherit!important}';root.append(micSingleIconStyle);
const micInteractionPolish=document.createElement('style');micInteractionPolish.textContent=`.ai-dock .voice{width:44px!important;min-width:44px!important;height:44px!important;min-height:44px!important;padding:0!important;display:inline-grid!important;place-items:center!important;flex:0 0 44px!important;position:relative!important;isolation:isolate;overflow:visible!important;color:var(--ui-text,#111114)!important;cursor:pointer;touch-action:manipulation}.ai-dock .voice svg{width:34px!important;height:34px!important;overflow:visible!important;transform-origin:50% 55%;transition:transform .2s cubic-bezier(.2,.8,.25,1),color .2s ease,filter .2s ease}.ai-dock .voice:hover svg{transform:scale(1.06)}.ai-dock .voice:active svg{transform:scale(.94)}.ai-dock .voice[data-voice-state=listening] svg{color:var(--ui-text,#111114)!important;filter:drop-shadow(0 1px 2px #1113);animation:stc-mic-listening .9s ease-in-out infinite alternate}.ai-dock .voice[data-voice-state=listening]::before{content:'';position:absolute;inset:5px;border:1.5px solid #17191d35;border-radius:50%;background:transparent!important;transform:scale(.78);animation:stc-mic-wave 1.45s ease-out infinite;pointer-events:none}.ai-dock .voice[data-voice-state=listening]::after{display:none!important}.ai-dock .voice[data-voice-state=processing] svg{animation:stc-mic-process 1s linear infinite}.ai-dock .voice[data-voice-state=muted] svg,.ai-dock .voice[data-voice-state=error] svg{color:var(--ui-text,#111114)!important}.ai-dock .voice:focus-visible{outline:2px solid var(--ui-text,#111114);outline-offset:2px;border-radius:8px}@keyframes stc-mic-listening{from{transform:scale(.98)}to{transform:scale(1.04)}}@keyframes stc-mic-wave{0%{transform:scale(.78);opacity:.7}100%{transform:scale(1.45);opacity:0}}@keyframes stc-mic-process{to{transform:rotate(360deg)}}@media(max-width:420px){.ai-dock .voice{width:40px!important;min-width:40px!important;height:40px!important;min-height:40px!important;flex-basis:40px!important}.ai-dock .voice svg{width:32px!important;height:32px!important}}@media(prefers-reduced-motion:reduce){.ai-dock .voice svg,.ai-dock .voice[data-voice-state=listening]::before{animation:none!important;transition:none!important}}`;root.append(micInteractionPolish);
const commands=createOfflineCommands(app);
let guided=null;
let conversationLanguage='en';
function guidedText(en,hi,hinglish){return conversationLanguage==='hi'?hi:conversationLanguage==='hinglish'?hinglish:en;}
function guidedFieldLabel(field){
  const label=field.label;
  if(conversationLanguage!=='hi')return label;
  const names={'Percent %':'प्रतिशत %','Percent (%)':'प्रतिशत (%)','Of value':'कुल राशि','Amount':'राशि','Principal':'मूलधन','Loan amount':'ऋण की राशि','Interest rate':'ब्याज दर','Annual interest rate':'सालाना ब्याज दर','Rate':'दर','Years':'वर्ष','Months':'महीने','Tenure':'अवधि','Weight':'वज़न','Height':'ऊँचाई','Age':'उम्र','Value':'वैल्यू','Price':'कीमत','Quantity':'मात्रा','Distance':'दूरी','Time':'समय'};
  return names[label]||label;
}
const guidedStyle=document.createElement('style');
guidedStyle.textContent=`
  .ai-guided-controls{display:flex;flex-wrap:wrap;align-items:center;gap:7px;margin-top:10px;animation:ai-guided-in .22s ease-out both}
  .ai-guided-controls :is(button,select){min-height:38px;max-width:100%;border:1.5px solid var(--ai-line,#bfc3c9);border-radius:11px;padding:7px 11px;background:var(--ai-input,#fff);color:inherit;font:600 12px/1.2 'DM Sans',system-ui,sans-serif;box-shadow:0 2px 5px #1111140c;transition:background .18s,border-color .18s,box-shadow .18s,transform .18s}
  .ai-guided-controls select{appearance:none;-webkit-appearance:none;min-width:170px;padding-right:34px;background-image:linear-gradient(45deg,transparent 50%,currentColor 50%),linear-gradient(135deg,currentColor 50%,transparent 50%);background-position:calc(100% - 16px) 16px,calc(100% - 11px) 16px;background-size:5px 5px,5px 5px;background-repeat:no-repeat;cursor:pointer}
  .ai-guided-controls select option{background:var(--ai-input,#fff);color:var(--ui-text,#111114);font:500 13px 'DM Sans',system-ui,sans-serif}
  .ai-guided-controls :is(button,select):hover{background:var(--ai-chat,#f1f2f4);border-color:var(--ui-text,#71767e);box-shadow:0 4px 10px #11111418;transform:translateY(-1px)}
  .ai-guided-controls button{cursor:pointer}
  .ai-guided-controls :is(button,select):focus-visible{outline:2px solid currentColor;outline-offset:2px}
  @keyframes ai-guided-in{from{opacity:0;transform:translateY(4px)}to{opacity:1;transform:none}}
  @media(prefers-reduced-motion:reduce){.ai-guided-controls{animation:none}.ai-guided-controls :is(button,select){transition:none}}
`;
root.append(guidedStyle);
function guidedControl(container,label,action){
  const button=document.createElement('button');
  button.type='button';
  button.textContent=label;
  button.onclick=action;
  container.append(button);
}
function guidedPrompt(session,field,invalid=false){
  session.field=field;
  session.controls?.remove();
  const hint={date:' (YYYY-MM-DD)',time:' (HH:MM, 24-hour)'}[field?.type]||'';
  const question=field?'Enter '+field.label+hint+'.':session.tool.id==='programmer'
    ?'Enter an integer or operation, such as 0xFF, 0b1010, or 5 AND 3.'
    :'Enter a calculation, such as 22 + 22.';
  const prompt=field?guidedText(question,guidedFieldLabel(field)+' दर्ज करें'+hint+'।',field.label+' ki value dein'+hint+'.'):question;
  const note=message(session.tool.name+'\n'+(invalid?guidedText('Please check that value. ','कृपया वैल्यू जाँचें। ','Value dobara check karein. '):'')+prompt);
  const controls=document.createElement('span');
  controls.className='ai-guided-controls';
  session.controls=controls;
  if(field){
    const effective={...session.values};
    app.applyFieldDefaults(session.tool,effective);
    const options=commands.optionsFor(field,effective);
    if(!options.length){
      const entry=document.createElement('input');
      entry.type=field.type==='date'?'date':field.type==='time'?'time':'text';
      entry.inputMode=field.type==='number'?'decimal':'text';
      entry.placeholder=field.label;
      entry.setAttribute('aria-label',field.label);
      entry.style.cssText="width:100%;min-width:0;min-height:42px;padding:9px 11px;border:1.5px solid var(--ai-line,#bfc3c9);border-radius:11px;background:var(--ai-input,#fff);color:inherit;font:inherit;box-sizing:border-box";
      entry.value=String(session.values[field.key]??'');
      const submit=()=>{const value=entry.value.trim();if(value&&guided===session)runCommand(value);};
      entry.addEventListener('keydown',event=>{if(event.key==='Enter'){event.preventDefault();event.stopPropagation();submit();}});
      controls.append(entry);
      guidedControl(controls,guidedText('Continue','आगे बढ़ें','Aage badhein'),submit);
    }
    if(options.length){
      const select=document.createElement('select');
      select.setAttribute('aria-label',field.label);
      const placeholder=new Option(guidedText('Choose '+field.label,guidedFieldLabel(field)+' चुनें',field.label+' chunein'),'',true,true);
      placeholder.disabled=true;
      select.add(placeholder);
      for(const option of options)select.add(new Option(option.label,String(option.value)));
      select.onchange=()=>runCommand(select.value);
      controls.append(select);
    }
  }
  if(!session.tool.fields.length||session.tool.id==='customcalc'){
    guidedControl(controls,'Open calculator',()=>{
      session.controls?.remove();
      guided=null;
      if(!mobileLayout)showCalculator();
      app.selectFeature(session.tool.id);
    });
  }
  guidedControl(controls,guidedText('Cancel','रद्द करें','Cancel'),()=>{
    session.controls?.remove();
    if(guided===session)guided=null;
  });
  note.append(controls);
  chat.scrollTop=chat.scrollHeight;
}
function guidedRequired(session){
  const {tool,values}=session;
  return commands.guidedFields(tool,values).filter(field=>{
    if(values[field.key]!==undefined)return false;
    if(['average','standarddeviation'].includes(tool.id)&&field.key!=='v1')return false;
    if(['currency','unitconverter'].includes(tool.id))return true;
    return field.default===''||field.default===undefined;
  });
}
function applyGuidedValues(session,updates){
  if(Object.hasOwn(updates,'cat')&&updates.cat!==session.values.cat){
    delete session.values.from;
    delete session.values.to;
  }
  if(['cat','from','to'].some(key=>Object.hasOwn(updates,key)&&updates[key]!==session.values[key]))delete session.values.exchangeRate;
  Object.assign(session.values,updates);
}
const guidedInputStyle=document.createElement('style');
guidedInputStyle.textContent=`
  .ai-chat .ai-guided-controls{position:relative;display:block;width:min(100%,260px);min-width:0;margin:12px 0 1px}
  .ai-chat .ai-guided-trigger{display:flex;align-items:center;justify-content:space-between;gap:12px;box-sizing:border-box;width:100%;min-width:0;min-height:42px;padding:0 12px;border:1.5px solid var(--ai-line,#cbd0d7);border-radius:12px;background:var(--ai-input,#fff);color:var(--ui-text,#111114);font:650 12px/1.3 'DM Sans',system-ui,sans-serif;text-align:left;box-shadow:0 1px 2px #1111110c;cursor:pointer;transition:border-color .16s ease,box-shadow .16s ease,background-color .16s ease}
  .ai-chat .ai-guided-trigger:hover,.ai-chat .ai-guided-controls[data-open=true] .ai-guided-trigger{border-color:var(--ui-text,#111114);box-shadow:0 3px 9px #11111112}
  .ai-chat .ai-guided-trigger:focus-visible{outline:2px solid var(--ui-text,#111114);outline-offset:2px}
  .ai-chat .ai-guided-trigger svg{width:16px;height:16px;flex:none;fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round;transition:transform .16s ease}
  .ai-chat .ai-guided-controls[data-open=true] .ai-guided-trigger svg{transform:rotate(180deg)}
  .ai-chat .ai-guided-menu{position:absolute;z-index:20;left:0;bottom:calc(100% + 7px);display:grid;gap:2px;box-sizing:border-box;width:100%;max-height:min(176px,38vh);padding:4px;overflow:auto;border:1.5px solid var(--ai-line,#cbd0d7);border-radius:12px;background:var(--ai-input,#fff);box-shadow:0 10px 24px #11111425;animation:guided-menu-in .14s ease-out both}
  .ai-chat .ai-guided-option{display:flex;align-items:center;justify-content:space-between;gap:10px;min-width:0;min-height:38px;padding:7px 9px;border:0;border-radius:8px;background:transparent;color:var(--ui-text,#111114);font:550 12px/1.3 'DM Sans',system-ui,sans-serif;text-align:left;overflow-wrap:anywhere;cursor:pointer;touch-action:manipulation}
  .ai-chat .ai-guided-option:hover,.ai-chat .ai-guided-option:focus-visible{background:var(--ai-chat,#f1f2f4);outline:none}
  .ai-chat .ai-guided-option svg{width:16px;height:16px;flex:none;fill:none;stroke:currentColor;stroke-width:2}
  @keyframes guided-menu-in{from{opacity:0;transform:translateY(4px)}to{opacity:1;transform:none}}
  @media(max-width:420px){.ai-chat .ai-guided-controls{margin-top:10px}.ai-chat .ai-guided-trigger{min-height:40px;font-size:11px}.ai-chat .ai-guided-option{min-height:38px;font-size:11px}}
  @media(prefers-reduced-motion:reduce){.ai-chat .ai-guided-trigger,.ai-chat .ai-guided-trigger svg{transition:none}.ai-chat .ai-guided-menu{animation:none}}
`;
root.append(guidedInputStyle);
const guidedLayoutFix=document.createElement('style');
guidedLayoutFix.textContent='.ai-chat .ai-guided-menu{position:relative;left:auto;bottom:auto;margin-top:7px;box-shadow:0 3px 10px #11111415}.ai-chat .ai-guided-menu[hidden]{display:none!important}.ai-chat .ai-guided-controls{display:flex;flex-wrap:wrap;gap:7px}.ai-chat .ai-guided-controls>input{flex:1 0 100%}.ai-chat .ai-guided-trigger,.ai-chat .ai-guided-menu{flex-basis:100%}';
root.append(guidedLayoutFix);
function finishGuidedStep(session){
  const next=guidedRequired(session)[0];
  if(next){guidedPrompt(session,next);return;}
  session.controls?.remove();
  guided=null;
  const {tool,values}=session;
  const effective={...values};
  app.applyFieldDefaults(tool,effective);
  const fields=commands.guidedFields(tool,values);
  const used=fields.filter(field=>effective[field.key]!==undefined&&effective[field.key]!=='');
  const inputSummary=used.map(field=>field.label+': '+effective[field.key]).join(' · ');
  const assignments=used.map(field=>{
    const value=String(effective[field.key]);
    return field.key+'='+(!value.includes('"')?'"'+value+'"':value);
  });
  const query=['@'+tool.id,...assignments].join(' ');
  let note;
  try{note=renderCommand({tool,values,missing:[],problems:[]},query,'',inputSummary);}
  catch{message('The calculator could not use those inputs. Check the values and try again.');}
  if(!note)return;
  const controls=document.createElement('span');
  controls.className='ai-guided-controls';
  const trigger=document.createElement('button');
  trigger.type='button';
  trigger.className='ai-guided-trigger';
  trigger.setAttribute('aria-label','Edit a calculator input');
  trigger.setAttribute('aria-haspopup','listbox');
  trigger.setAttribute('aria-expanded','false');
  trigger.innerHTML='<span></span><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>';
  trigger.querySelector('span').textContent=guidedText('Edit an input…','वैल्यू बदलें…','Value badlein…');
  const menu=document.createElement('span');
  menu.className='ai-guided-menu';
  menu.setAttribute('role','listbox');
  menu.setAttribute('aria-label','Choose calculator input');
  menu.hidden=true;
  for(const field of fields){
    const option=document.createElement('button');
    option.type='button';
    option.className='ai-guided-option';
    option.setAttribute('role','option');
    option.textContent=guidedFieldLabel(field);
    const mark=document.createElementNS('http://www.w3.org/2000/svg','svg');
    mark.setAttribute('viewBox','0 0 24 24');mark.setAttribute('aria-hidden','true');
    const path=document.createElementNS('http://www.w3.org/2000/svg','path');path.setAttribute('d','m9 18 6-6-6-6');mark.append(path);option.append(mark);
    option.onclick=(event)=>{
      event.preventDefault();
      event.stopPropagation();
      controls.dataset.open='false';menu.hidden=true;trigger.setAttribute('aria-expanded','false');
      guided?.controls?.remove();
      guided={tool,values:{...values}};
      guidedPrompt(guided,field);
      chat.scrollTop=chat.scrollHeight;
    };
    menu.append(option);
  }
  trigger.onclick=()=>{
    const open=controls.dataset.open!=='true';
    controls.dataset.open=String(open);menu.hidden=!open;trigger.setAttribute('aria-expanded',String(open));
    if(open)menu.querySelector('.ai-guided-option')?.focus({preventScroll:true});
  };
  controls.append(trigger,menu);
  note.append(controls);
  chat.scrollTop=chat.scrollHeight;
}
async function answerGuided(session,query){
  const {tool,values,field}=session;
  const revision=(session.revision||0)+1;
  session.revision=revision;
  if(!tool.fields.length){
    const programmer=tool.id==='programmer';
    const operation=programmer?null:commands.parse(query,{standalone:true});
    const result=programmer?commands.programmerResult(query):operation?.expression?app.formatNumber(operation.result):null;
    if(result){
      resultMessage(result,'@'+tool.id+' '+query);
    }else guidedPrompt(session,null,true);
    return;
  }
  let updates=commands.guidedInput(tool,query,values,field);
  if(!Object.keys(updates).length&&onlineReady&&query.length<=600){
    const requested=[...new Set([field?.key,...commands.guidedFields(tool,values).map(item=>item.key)].filter(Boolean))];
    const allowed=requested.filter(key=>key===field?.key||values[key]===undefined);
    const waiting=message('Reading calculator inputs…','assistant-message ai-pending');
    try{
      const reply=await online.ask(query,tool.id,{fast:true,requestedFields:allowed});
      if(guided!==session||revision!==session.revision)return;
      updates=commands.guidedOnline(tool,reply,values,allowed);
    }catch{}finally{waiting.remove();}
  }
  if(guided!==session||revision!==session.revision)return;
  if(!Object.keys(updates).length){
    guidedPrompt(session,field||guidedRequired(session)[0]||tool.fields[0],true);
    return;
  }
  applyGuidedValues(session,updates);
  finishGuidedStep(session);
}
const online=window.sevenTaskOnlineCalculator;
let onlineReady=false;
const status=brandLabel.querySelector('small');
status.setAttribute('role','status');
const statusStyle=document.createElement('style');
statusStyle.textContent=`.ai-online-dots{display:inline-flex;gap:3px;margin-right:5px;vertical-align:middle}.ai-online-dots i{width:5px;height:5px;border-radius:50%;background:#16a061;animation:ai-dot-pulse 1.2s ease-in-out infinite}.ai-online-dots i:nth-child(2){animation-delay:.15s}.ai-online-dots i:nth-child(3){animation-delay:.3s}@keyframes ai-dot-pulse{0%,100%{opacity:.4;transform:scale(.8)}50%{opacity:1;transform:scale(1.15)}}@media(prefers-reduced-motion:reduce){.ai-online-dots i{animation:none}}`;
root.append(statusStyle);
const workingStyle=document.createElement('style');
workingStyle.textContent=`.ai-chat .ai-pending{display:flex;align-items:center;gap:9px;min-height:38px;color:var(--ai-muted,#71767e);font-size:11px}.ai-working-dots{display:inline-flex;align-items:center;gap:4px;height:18px}.ai-working-dots i{width:5px;height:5px;border-radius:50%;background:currentColor;animation:ai-working-bounce 1s ease-in-out infinite}.ai-working-dots i:nth-child(2){animation-delay:.12s}.ai-working-dots i:nth-child(3){animation-delay:.24s}@keyframes ai-working-bounce{0%,70%,100%{transform:translateY(0);opacity:.35}35%{transform:translateY(-4px);opacity:1}}@media(prefers-reduced-motion:reduce){.ai-working-dots i{animation:none;opacity:.7}}`;
root.append(workingStyle);
let connectionCheck=0;
async function refreshOnline(){
  const check=++connectionCheck;
  const available=!!(navigator.onLine&&await online?.available());
  if(check!==connectionCheck)return;
  const micPreview=new URLSearchParams(location.search).has('mic-preview');
  onlineReady=available||micPreview;
  const networkAvailable=navigator.onLine;
  voice.hidden=!networkAvailable;
  voice.setAttribute('aria-hidden',String(!networkAvailable));
  voice.tabIndex=networkAvailable?0:-1;
  if(available){
    status.replaceChildren();
    const dots=document.createElement('span');
    dots.className='ai-online-dots';dots.setAttribute('aria-hidden','true');
    dots.innerHTML='<i></i><i></i><i></i>';
    status.append(dots,document.createTextNode('AI online'));
  }else if(networkAvailable){
    status.replaceChildren();
    const dots=document.createElement('span');
    dots.className='ai-online-dots';dots.setAttribute('aria-hidden','true');
    dots.innerHTML='<i></i><i></i><i></i>';
    status.append(dots,document.createTextNode('AI offline'));
  }else status.textContent='Basic calculations ready · No connection';
}
void refreshOnline();
window.addEventListener('online',refreshOnline);
window.addEventListener('offline',refreshOnline);
document.addEventListener('visibilitychange',()=>{if(!document.hidden)void refreshOnline();});
setInterval(()=>{if(!document.hidden&&navigator.onLine)void refreshOnline();},30000);
window.mountCalculatorMentions?.({form,input,commands,onPick:!mobileLayout});
const dockState=dock.querySelector('.state');dockState.textContent='Instant calculations · AI for calculator questions';const dockVersion=document.createElement('span');dockVersion.className='ai-dock-version';const appVersion=String(window.SevenTaskNative?.getVersionName?.()||document.documentElement.dataset.webVersion||'1.18.65');const dockVersionName=document.createElement('span');dockVersionName.textContent='TOUHID';const dockVersionNumber=document.createElement('b');dockVersionNumber.textContent=appVersion;dockVersion.append(dockVersionName,' ',dockVersionNumber);dockVersion.setAttribute('aria-label','TOUHID version '+appVersion);dockState.insertAdjacentElement('afterend',dockVersion);const dockVersionStyle=document.createElement('style');dockVersionStyle.textContent=`.ai-dock-version{display:inline-flex;align-items:baseline;gap:3px;flex:none;margin-left:auto!important;color:var(--ai-muted,#71767e);white-space:nowrap;-webkit-font-smoothing:antialiased;text-rendering:geometricPrecision}.ai-dock-version span{font:400 8px/1 'Fjalla One','DM Sans',sans-serif;letter-spacing:.09em}.ai-dock-version b{color:var(--ui-text,#111114);font:650 9px/1 Manrope,'DM Sans',system-ui,sans-serif;letter-spacing:-.015em}:is(.win,.ai-shell)[data-theme=dark] .ai-dock-version b{color:#f3f4f6}@media(max-width:540px){.ai-dock-version{margin-left:auto!important}.ai-dock-version span{font-size:7px}.ai-dock-version b{font-size:8px}}`;root.append(dockVersionStyle);
const intro=chat.querySelector('p');
intro.replaceChildren();
const introHeading=document.createElement('b');
introHeading.textContent='SevenTask AI';
intro.append(introHeading,document.createElement('br'),'Ask a calculation, or choose a calculator with @ and I’ll ask for the values I need.');
const examples=document.createElement('span');
examples.className='ai-examples';
for(const [label,query] of [['Percentage','2500 ka 18%'],['EMI',mobileLayout?'EMI 5 lakh at 9% for 5 years':'@emi'],['All tools','list tools']]){
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
 function renderCommand(command,query='',label='',inputSummary=query){
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
        button.onclick=()=>{
          const tool=commands.tools.find(candidate=>candidate.name===name);
          input.value=tool&&!mobileLayout?'@'+tool.id:name;
          form.requestSubmit();
        };
        item.append(button);
        list.append(item);
      }
      menu.append(list);
      chat.append(menu);
      chat.scrollTop=chat.scrollHeight;
      return;
    }
    if(command.expression)return resultMessage(app.formatNumber(command.result),query,label);
    const {tool,values,missing,problems}=command;
    if(problems.length){
      return message(tool.name+'\n'+problems.join('. '));
    }

    if(missing.length){
      guided?.controls?.remove();
      guided={tool,values:{...values}};
      guidedPrompt(guided,missing[0]);
      return;
    }
    if(!tool.fields.length){
      const fields=tool.fields.filter(f=>f.key!=='exchangeRate').map(f=>f.key);
      message(fields.length?tool.name+' · Type '+fields.slice(0,4).map(k=>k+'=…').join(', ')+'.':tool.name+' · Enter an expression here, or use the keypad in Calculator.');
      return;
    }
    const results=app.calculateOfflineTool(tool.id,values);
    const rows=[...results.filter(row=>row.emphasis),...results.filter(row=>!row.emphasis)];
    const summaryText=[tool.name,...rows.filter(row=>row.type!=='table').map(row=>row.label+': '+row.value)].join('\n');
    const note=message(summaryText);
    showResultInput(note,inputSummary);
    if(rows.length)saveAIResult(query,summaryText,inputSummary);
    for(const row of rows.filter(row=>row.type==='table')){
      const details=document.createElement('details');details.className='ai-catalog';
      const summary=document.createElement('summary');summary.textContent=row.title||row.label||'Calculation details';details.append(summary);
      const content=document.createElement('div');content.style.cssText='max-height:240px;overflow:auto';
      const table=document.createElement('table');table.style.cssText='border-collapse:collapse;font:inherit';
      const data=row.rows||[];
      if(data.length){
        const keys=Object.keys(data[0]);const heading=document.createElement('tr');
        for(const key of keys){const cell=document.createElement('th');cell.textContent=key;cell.style.padding='5px 8px';heading.append(cell);}table.append(heading);
        for(const entry of data){const tr=document.createElement('tr');for(const key of keys){const td=document.createElement('td');td.textContent=String(entry[key]??'');td.style.cssText='padding:5px 8px;border-top:1px solid #8883';tr.append(td);}table.append(tr);}
      }
      content.append(table);details.append(content);chat.append(details);
    }
    return note;
}
async function offerOnline(note,query,generation=screenGeneration){
  if(!note)return;
  const mention=commands.readMention(query);
  try{
    const reply=await online.ask(query,mention?.tool?.id,{fast:fastMode});
    if(generation!==screenGeneration)return;
    if(!onlineReady)void refreshOnline();
    note.remove();
    await acceptOnlineReply(reply,query);
  }catch{
    if(generation!==screenGeneration)return;
    note.classList.remove('ai-pending');
    note.textContent='The assistant is unavailable right now. Basic calculations still work here, including “22 + 22” and “18% of 2500”.';
    void refreshOnline();
  }
}
function runCommand(query,forceOnline=false){
  if(/[a-zA-Z\u0900-\u097f]/u.test(query)&&!query.startsWith('@'))conversationLanguage=localLanguage(query);
  if(!query)return;
  message(query,'you');
  const maxLength=query.startsWith('@')?2400:600;
  if(query.length>maxLength){message('Please keep your calculator request under '+maxLength+' characters.');return;}
  const mention=commands.readMention(query);
  if(mention?.tool){
    // Every @ calculator command starts the same guided flow in web, APK and
    // floating layouts. Incomplete commands must collect the tool's required
    // fields before any calculation is evaluated.
    guided?.controls?.remove();
    commands.reset();
    guided={tool:mention.tool,values:{}};
    if(mention.body)void answerGuided(guided,mention.body);
    else guidedPrompt(guided,guidedRequired(guided)[0]||mention.tool.fields[0]);
    return;
  }
  if(query.startsWith('@')){message('Choose a calculator from the @ menu.');return;}
  if(guided){
    const session=guided;
    void answerGuided(session,query);
    return;
  }
  try{
    const command=commands.parse(query);
    const directTool=commands.readMention(query)?.tool||commands.tools.find(tool=>tool.name.toLowerCase()===query.toLowerCase()||tool.id===query.toLowerCase());
    const calculatorQuestion=/\b(?:explain|why|what does|meaning|difference between|how does|samjha|samjhao)\b/i.test(query);
    const localResult=command.expression||command.list||(command.tool&&!calculatorQuestion);
    if((!forceOnline&&(localResult||directTool))||(!navigator.onLine&&command.error&&!command.unrecognized)){
      renderCommand(command,query);
      return;
    }
  }catch{
    if(!onlineReady){message('Please check the numbers and operation, then try again.');return;}
  }
  if(!navigator.onLine){message('Use @ to choose any calculator and enter its values, or type a calculation. AI explanations need a connection.');return;}
  const note=message('','assistant-message ai-pending');
  note.setAttribute('role','status');
  note.setAttribute('aria-label','Working on your calculation');
  note.innerHTML='<span class="ai-working-dots" aria-hidden="true"><i></i><i></i><i></i></span><span>Working</span>';
  void offerOnline(note,query,screenGeneration);
}
form.onsubmit=event=>{
  event.preventDefault();
  const query=input.value.trim();
  input.value='';
  runCommand(query);
};
async function acceptOnlineReply(reply,query=''){
  if(reply.transcript){const spoken=reply.transcript.trim();if(spoken){message(spoken,'you');query=spoken;if(/[a-zA-Z\u0900-\u097f]/u.test(spoken))conversationLanguage=localLanguage(spoken);}}
  const command=commands.fromOnline(reply);
  if(command){renderCommand(command,query,reply.label);return;}
  if(reply.kind==='answer'){
    showResultInput(message(reply.answer),query);
    saveAIResult(query,reply.answer);
    return;
  }
  const guidance={help:'Ask about calculations, conversions, or using a SevenTask calculator.',clarify:'Please repeat the calculation with the amount, unit, or calculator name.',unsupported:'Sorry, I can only help with calculator questions and calculations.',limit:'Online requests are busy right now. You can still use offline calculator commands.'};
  message(reply.answer||guidance[reply.kind]||'Please try a calculator-related question.');
}
const stopVoice=mountOfflineVoice({dock,input,onlineAvailable:()=>onlineReady,onSpeechResult:transcript=>runCommand(transcript,true),onOnlineResult:async(data,mimeType)=>{
  if(!onlineReady)throw Error('offline');
  const generation=screenGeneration;
  const session=guided;
  const revision=session?.revision;
  const reply=await online.askAudio(data,mimeType,{fast:fastMode});
  if(generation!==screenGeneration)return;
  if(session){
    if(guided!==session||revision!==session.revision)return;
    if(reply.transcript?.trim())runCommand(reply.transcript.trim());
    else message('I couldn’t hear the value. Try again or type it.');
    return;
  }
  await acceptOnlineReply(reply);
}});
if(mobileLayout){
  dock.querySelector('.attach').onclick=()=>dock.querySelector('.file').click();
  camera.onclick=()=>dock.querySelector('.photo').click();
  dock.querySelectorAll('input[type=file]').forEach(el=>el.onchange=()=>{if(el.files[0])message('Image attached: '+el.files[0].name+' · Type any numbers you want to calculate.')});
  const drawTrigger=dock.querySelector('.draw');
  drawTrigger.onclick=()=>panel.hidden=false;let canvas=panel.querySelector('canvas'),ctx=canvas.getContext('2d'),drawing=false;canvas.onpointerdown=e=>{drawing=true;panel.querySelector('.draw-paper').classList.add('has-ink');canvas.setPointerCapture(e.pointerId);ctx.beginPath();ctx.moveTo(e.offsetX*canvas.width/canvas.clientWidth,e.offsetY*canvas.height/canvas.clientHeight)};canvas.onpointermove=e=>{if(drawing){ctx.lineWidth=4;ctx.lineCap='round';ctx.lineTo(e.offsetX*canvas.width/canvas.clientWidth,e.offsetY*canvas.height/canvas.clientHeight);ctx.stroke()}};canvas.onpointerup=()=>drawing=false;panel.querySelector('.clear').onclick=()=>{ctx.clearRect(0,0,canvas.width,canvas.height);panel.querySelector('.draw-paper').classList.remove('has-ink')};panel.querySelector('.done').onclick=()=>{if(!panel.querySelector('.draw-paper').classList.contains('has-ink'))return;panel.hidden=true;const image=document.createElement('img');image.src=canvas.toDataURL('image/png');image.alt='Your drawing';image.style.cssText='display:block;max-width:180px;max-height:78px;border:1px solid #ccd0d5;border-radius:8px;background:white;margin:6px 0 6px auto';chat.append(image);message('Drawing saved in preview · Type the calculation to run it offline.');ctx.clearRect(0,0,canvas.width,canvas.height);panel.querySelector('.draw-paper').classList.remove('has-ink')};panel.querySelector('.close').onclick=()=>panel.hidden=true;
}
}customElements.whenDefined('taskai7-calculator').then(()=>{mount();if(!mounted){let timer=setInterval(()=>{mount();if(mounted)clearInterval(timer)},150);setTimeout(()=>clearInterval(timer),10000)}})})();
