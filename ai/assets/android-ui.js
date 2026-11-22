(() => {
  if (window.__sevenAndroidUi) return;
  window.__sevenAndroidUi = true;
  const overlay = new URLSearchParams(location.search).has('overlay');
  function mount() {
    const root = document.querySelector('taskai7-calculator')?.shadowRoot;
    const win = root?.querySelector('.win');
    if (!win || root.querySelector('#seven-android-ui')) return false;
    if (overlay) win.classList.add('st-overlay');
    const style = document.createElement('style');
    style.id = 'seven-android-ui';
    style.textContent = `

      .win{border:3px solid #25282d!important;box-sizing:border-box!important}
      .win.popup-mode{top:3px!important;left:3px!important;width:calc(100% - 6px)!important;height:calc(100% - 6px)!important}
      .win[data-theme="dark"]{border-color:#b8c0ca!important}
      .win .titlebar .title{min-height:24px!important;justify-content:center!important;overflow:visible!important;padding-top:3px!important;padding-bottom:3px!important;box-sizing:content-box!important}.win .titlebar .brand-title-line{line-height:1.15!important;overflow:visible!important}.win .titlebar .title{display:flex!important;flex-direction:column!important;gap:2px!important;align-items:flex-start!important}.win .titlebar .title small.brand-kawkab-straight{display:block!important;visibility:visible!important;opacity:1!important;margin:0!important;line-height:1.25!important;font-size:8px!important;white-space:nowrap!important}.win .titlebar :is(.brand-seven,.brand-calculator){line-height:1.2!important;overflow:visible!important}
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
      .win .infopanel.open{transform:none!important}.win .infopanel .infobrand{position:sticky!important;top:-12px!important;z-index:10!important;background:var(--panel-bg,#fff)!important;padding-top:12px!important}.win[data-theme="dark"] .infopanel .infobrand{background:#22262b!important}
      .win .infopanel.open .info-links>*{transform:none!important}
      .win .infopanel :is(.infoabout,.infolabel,.theme-label,.theme-dropdown summary,.theme-options button,.info-links button,.info-links a,.st-settings-toggle,.st-settings-label){font-family:system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",Arial,sans-serif!important;font-synthesis:none!important;font-optical-sizing:auto!important;-webkit-font-smoothing:auto!important;text-rendering:auto!important}
      .win .infopanel .infoabout{font-size:13px!important;font-weight:400!important;line-height:1.55!important}
      .win .infopanel :is(.infolabel,.theme-label,.st-settings-label){font-size:13px!important;font-weight:600!important}
      .win .infopanel :is(.theme-dropdown summary,.theme-options button,.info-links button,.info-links a,.st-settings-toggle){font-size:13px!important;font-weight:600!important}
      @media(max-width:380px){.win .infopanel{width:min(288px,80%)!important;max-width:min(288px,80%)!important;padding:12px!important;overflow-y:auto!important;overscroll-behavior:contain}.win .infopanel .infobrand{display:flex!important;align-items:center!important;min-width:0!important;gap:6px!important}.win .infopanel .infobrand .info-brand-mark{width:26px!important;height:32px!important;flex:0 0 26px!important}.win .infopanel .infobrandtext{flex:1 1 auto!important;min-width:0!important}.win .infopanel .brand-title-line{display:flex!important;align-items:baseline!important;flex-wrap:wrap!important;gap:2px 4px!important;white-space:normal!important;line-height:1.15!important}.win .infopanel .brand-seven{font-size:15px!important}.win .infopanel .brand-calculator{font-size:12px!important}.win .infopanel .infobrand .info-close-btn{margin-left:auto!important;flex:0 0 38px!important}.win .infopanel .infoabout{font-size:12px!important;line-height:1.45!important;overflow-wrap:anywhere}.win .infopanel :is(.infolabel,.theme-label,.st-settings-label,.theme-dropdown summary,.theme-options button,.info-links button,.info-links a,.st-settings-toggle){font-size:12px!important;min-width:0!important;overflow-wrap:anywhere}.win .infopanel .info-links>*{max-width:100%!important;box-sizing:border-box!important}}
      .win.mobile-floating .formview,.win.mobile-floating .fgrid,.win.mobile-floating .fgrid>*{min-width:0!important;max-width:100%!important;box-sizing:border-box!important}.win.mobile-floating .fgrid :is(input,select,textarea,.app-select){width:100%!important;min-width:0!important;max-width:100%!important;box-sizing:border-box!important}@media(max-width:380px){.win.mobile-floating .formview{padding-inline:8px!important}.win.mobile-floating .fgrid{grid-template-columns:minmax(0,1fr)!important;gap:8px!important}.win.mobile-floating .fgrid>*{grid-column:1/-1!important}.win.mobile-floating .unit-pair,.win.mobile-floating .currency-pair{grid-template-columns:minmax(0,1fr)!important}.win.mobile-floating .unit-pair>*,.win.mobile-floating .currency-pair>*{grid-column:1/-1!important;min-width:0!important}}
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
      .st-settings-row[hidden]{display:none!important}
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
    
      .win.mobile-app-mode,.win.mobile-app-mode *{-webkit-tap-highlight-color:transparent;-webkit-user-select:none;user-select:none;-webkit-touch-callout:none}
      .win.mobile-app-mode :is(input,textarea,[contenteditable="true"]){-webkit-user-select:text;user-select:text;-webkit-touch-callout:default}
      .win.mobile-app-mode img{-webkit-user-drag:none}
      .win.mobile-app-mode .title-duplicate-btn{display:none!important}
      .win.mobile-app-mode.st-overlay.popup-mode{border:0!important;border-radius:0!important;box-shadow:none!important;min-width:0!important;min-height:0!important}
      .win.mobile-app-mode .formview,.win.mobile-app-mode .fgrid,.win.mobile-app-mode .fgrid>*{min-width:0;max-width:100%;box-sizing:border-box}
      .win.mobile-app-mode .fgrid :is(input,select,textarea,.app-select,.pickerbtn){width:100%;min-width:0;max-width:100%;box-sizing:border-box}
      .win.mobile-app-mode .formview :is(.results,.rrow,.rtable){min-width:0;max-width:100%;overflow-wrap:anywhere}
      .win.mobile-app-mode .formview .unit-pair>*{min-width:0;max-width:100%}
      .win.mobile-app-mode.st-compact .formview{padding:10px;overflow-x:hidden}
      .win.mobile-app-mode.st-compact .fgrid{grid-template-columns:minmax(0,1fr)!important;gap:7px!important}
      .win.mobile-app-mode.st-compact .fgrid>*{grid-column:auto!important;min-width:0!important;max-width:100%!important}
      .win.mobile-app-mode.st-compact .unit-pair{grid-template-columns:repeat(2,minmax(0,1fr))!important;gap:7px!important}
      .win.mobile-app-mode.st-compact .currency-pair{grid-template-columns:minmax(0,1fr) 24px minmax(0,1fr)!important;gap:4px!important}
      .win.mobile-app-mode.st-compact :is(.unit-pair,.currency-pair)>*{grid-column:auto!important;min-width:0!important;max-width:100%!important}
      .win.mobile-app-mode.st-compact .formview{font-size:12px;gap:7px}
      .win.mobile-app-mode.st-compact .formview :is(input,select,.app-select,.pickerbtn){min-height:32px;font-size:13px}
      .win.mobile-app-mode.st-compact .pad{padding:6px;gap:4px;min-height:0!important;overflow:hidden!important}
      .win.mobile-app-mode.st-compact .grid{gap:4px;min-height:0!important}
      .win.mobile-app-mode.st-compact .pad button.btn{font-size:clamp(15px,6vw,21px);min-width:0;border-radius:12px}
      .win.mobile-app-mode.st-compact .titlebar{gap:2px;padding:9px 5px!important}
      .win.mobile-app-mode.st-compact .titlebar .iconbtn{width:28px!important;flex:0 0 28px!important}
      .win.mobile-app-mode.st-compact .titlebar{height:42px!important;min-height:42px!important;padding:2px 4px!important}
      .win.mobile-app-mode.st-compact .titlebar .iconbtn{height:30px!important}
      .win.mobile-app-mode.st-compact .toolbar{height:47px!important;min-height:47px!important;padding:4px 6px!important}
      .win.mobile-app-mode.st-compact .modebtn{height:37px!important;min-height:37px!important;font-size:12px!important}
      .win.mobile-app-mode.st-compact .display{padding:2px 7px 1px!important}
      .win.mobile-app-mode.st-compact .display .history{max-height:14px!important;margin-bottom:0!important}
      .win.mobile-app-mode.st-compact .display .history span{font-size:9px!important}
      .win.mobile-app-mode.st-compact .display .expr{min-height:12px!important;font-size:10px!important}
      .win.mobile-app-mode.st-compact .display .result{font-size:25px!important;line-height:1!important}
      .win.mobile-app-mode.st-compact .edit-actions{height:20px!important;min-height:20px!important;margin-top:1px!important}
      .win.mobile-app-mode.st-compact .edit-action{height:20px!important}
      .win.mobile-app-mode.st-compact .brand-home{min-width:0;flex:1 1 auto}
      .win.mobile-app-mode.st-compact .brand-home .title{min-width:0;overflow:hidden}
      .win.mobile-app-mode.st-tiny .brand-home .title{display:none!important}.win.mobile-app-mode .infopanel{height:100%!important;max-height:100%!important}.win.mobile-app-mode .infopanel .info-brand-logo{object-fit:contain!important;width:auto!important;height:auto!important;max-width:125px!important}.win.mobile-app-mode.st-overlay.popup-mode{top:0!important;left:0!important;width:100%!important;height:100%!important}.win.mobile-app-mode.st-tiny .titlebar .title{display:none!important}
      .win.mobile-app-mode.st-compact .brand-home .title small{display:none}
      .win.mobile-app-mode.st-landscape .body{overflow:hidden}
      .win.mobile-app-mode.st-landscape .kpview.show{flex:1 1 auto;min-height:0!important}
      .win.mobile-app-mode.st-landscape .display{padding:2px 10px;min-height:0!important}
      .win.mobile-app-mode.st-landscape .display .result{font-size:clamp(20px,5vh,30px)}
      .win.mobile-app-mode.st-landscape .pad{min-height:0!important;overflow:hidden!important;padding:4px 8px 5px}
      .win.mobile-app-mode.st-landscape .grid{min-height:0!important;gap:4px}
      .win.mobile-app-mode.st-landscape .titlebar{padding-block:6px!important}
      .win.mobile-app-mode.st-landscape .toolbar{padding-block:4px!important}
      .win.mobile-app-mode.st-landscape .pad button.btn{font-size:clamp(12px,3.5vh,20px)}
      .win.mobile-app-mode.st-landscape .titlebar{height:40px!important;min-height:40px!important;padding:2px 6px!important}
      .win.mobile-app-mode.st-landscape .toolbar{height:44px!important;min-height:44px!important;padding:3px 6px!important}
      .win.mobile-app-mode.st-landscape .modebtn{height:36px!important;min-height:36px!important}
      .win.mobile-app-mode.st-landscape .kpview.show{display:grid!important;grid-template-columns:minmax(110px,32%) minmax(0,1fr)!important;grid-template-rows:minmax(0,1fr)!important}
      .win.mobile-app-mode.st-landscape .kpview.show>.display{grid-column:1;grid-row:1;border-right:1px solid #a2a6ad;border-bottom:0;display:flex;flex-direction:column;justify-content:flex-end}
      .win.mobile-app-mode.st-landscape .kpview.show>.pad{grid-column:2;grid-row:1;height:100%;width:100%;min-height:0!important}
      .win.mobile-app-mode.st-landscape .kpview.show>.sci.show{grid-column:1/-1;grid-row:1;position:relative;z-index:1}
      .win.mobile-app-mode.st-landscape .kpview.show:has(>.sci.show){grid-template-rows:auto minmax(0,1fr)!important}
      .win.mobile-app-mode.st-landscape .kpview.show:has(>.sci.show)>.display,.win.mobile-app-mode.st-landscape .kpview.show:has(>.sci.show)>.pad{grid-row:2}
      .win.mobile-app-mode.st-overlay.popup-mode .titlebar .st-drag-dots{display:none!important}
      .win.mobile-app-mode.st-overlay.popup-mode [data-action="close"]{display:inline-flex!important}
    `;
    root.append(style);
    const nativeVersion=window.SevenTaskNative?.getVersionName?.(); if(nativeVersion)root.querySelectorAll(".version-number").forEach(el=>el.textContent=nativeVersion);
    const host=root.host; if(host?.shareAndroidApp)host.shareAndroidApp=async()=>{const r=await fetch("https://seventaskcalculator.in/mobile-update.json",{cache:"no-store"});if(!r.ok)return;const release=await r.json();const url=new URL(release.apkUrl);if(url.protocol!=="https:"||url.hostname!=="seventaskcalculator.in")return;const data={title:"SevenTask Calculator",text:"SevenTask Calculator for Android",url:url.href};if(navigator.share)await navigator.share(data);else await navigator.clipboard.writeText(url.href);};
    const update = () => {
      win.classList.toggle('st-compact', innerWidth < 360);
      win.classList.toggle('st-tiny', innerWidth < 300);
      win.classList.toggle('st-landscape', innerWidth > innerHeight);
    };
    update(); addEventListener('resize', update);
    if (overlay) {
      let x=0,y=0;
      const interactive='button,a,input,select,textarea,summary,[role="button"],[contenteditable="true"],.modemenu,.historydrawer,.infopanel';
      win.addEventListener('pointerdown', event => {
        if (event.target.closest(interactive)) return;
        x=event.screenX; y=event.screenY;
        win.setPointerCapture(event.pointerId);
        window.SevenTaskNative?.beginFloatingDrag?.();
        event.stopPropagation(); event.preventDefault();
      });
      win.addEventListener('pointermove', event => {
        if(!win.hasPointerCapture(event.pointerId)) return;
        window.SevenTaskNative?.moveFloatingDrag?.((event.screenX-x)*devicePixelRatio,(event.screenY-y)*devicePixelRatio);
        event.stopPropagation(); event.preventDefault();
      });
    }
    return true;
  }
  let attempts = 0;
  const timer = setInterval(() => { if(mount() || ++attempts > 60) clearInterval(timer); }, 150);
  if (mount()) clearInterval(timer);
})();
