window.mountOfflineVoice = ({ dock, input }) => {
  const languages=[
    ['hindi','Hindi','hi-IN'],
    ['hinglish','Hinglish','hi-IN'],
    ['en-GB','English (UK)','en-GB'],
    ['en-US','English (USA)','en-US'],
    ['en-IN','English (India)','en-IN'],
    ['simple','English (Simple)','en-US'],
  ];
  const trigger=dock.querySelector('.voice');
  const bar=document.createElement('div');
  bar.className='offline-voice';
  bar.hidden=true;
  bar.innerHTML='<label>Voice language <select></select></label><button type="button" class="voice-start">Speak</button><button type="button" class="voice-install" hidden>Get language pack</button><small role="status"></small>';
  dock.querySelector('.ai-form').after(bar);
  const style=document.createElement('style');
  style.textContent='.offline-voice{display:flex;align-items:center;flex-wrap:wrap;gap:6px;margin:6px auto 0;width:min(100%,860px);padding:6px 0;color:inherit;font:600 11px "DM Sans",system-ui,sans-serif}.offline-voice[hidden],.offline-voice button[hidden]{display:none}.offline-voice :is(button,select){max-width:100%;border:1px solid var(--ui-divider,#858a91);border-radius:8px;padding:5px 7px;background:var(--ai-input,#fff);color:inherit;font:inherit}.offline-voice button{cursor:pointer}.offline-voice small{width:100%;font-weight:400;color:var(--ai-muted,#6b7078)}';
  dock.getRootNode().append(style);
  const select=bar.querySelector('select'), start=bar.querySelector('.voice-start'), install=bar.querySelector('.voice-install'), status=bar.querySelector('[role=status]');
  for(const [id,label] of languages)select.add(new Option(label,id));
  const key='stc-offline-voice-language';
  select.value=localStorage.getItem(key)||'en-IN';
  if(!select.value)select.value='en-IN';
  const settings=()=>({langs:[languages.find(language=>language[0]===select.value)[2]],processLocally:true});
  const Speech=window.SpeechRecognition||window.webkitSpeechRecognition;
  let recognition=null;
  let busy=false;
  function stop(){
    const session=recognition;
    recognition=null;
    session?.abort();
    start.textContent='Speak';
    start.setAttribute('aria-pressed','false');
  }
  trigger.setAttribute('aria-expanded','false');
  trigger.onclick=()=>{
    bar.hidden=!bar.hidden;
    trigger.setAttribute('aria-expanded',String(!bar.hidden));
    if(bar.hidden)stop();
    else select.focus({preventScroll:true});
  };
  select.onchange=()=>{
    stop();
    localStorage.setItem(key,select.value);
    install.hidden=true;
    status.textContent=select.value==='hinglish'?'Uses the Hindi speech pack and accepts supported Hindi and English command words.':'';
  };
  start.onclick=async ()=>{
    if(recognition){recognition.stop();return;}
    if(busy)return;
    if(!Speech||!('processLocally' in Speech.prototype)){
      status.textContent='On-device voice is unavailable in this browser. You can still type your command.';
      return;
    }
    const language=select.value;
    const options=settings();
    busy=true;
    install.hidden=true;
    try{
      if(typeof Speech.available==='function'){
        const available=await Speech.available(options);
        if(language!==select.value||bar.hidden)return;
        if(available!=='available'){
          install.hidden=available!=='downloadable'||typeof Speech.install!=='function';
          status.textContent=available==='downloadable'?'Set up this language pack once to speak offline.'
            :available==='downloading'?'Language pack is downloading. Try again when it finishes.'
              :'This language is unavailable for offline voice in this browser.';
          return;
        }
      }
      const session=new Speech();
      recognition=session;
      session.processLocally=true;
      session.lang=options.langs[0];
      session.onresult=event=>{
        const spoken=event.results[event.resultIndex]?.[0]?.transcript?.trim();
        if(spoken&&recognition===session){
          input.value=spoken;
          status.textContent='Voice captured. Review it and tap Ask.';
          input.focus({preventScroll:true});
        }
      };
      session.onerror=event=>{
        if(event.error==='aborted')return;
        status.textContent=event.error==='no-speech'?'No speech heard. Try again.'
          :event.error==='not-allowed'?'Allow microphone access to use voice.'
            :'Offline voice could not start for this language.';
      };
      session.onend=()=>{if(recognition===session)stop();};
      session.start();
      start.textContent='Stop';
      start.setAttribute('aria-pressed','true');
      status.textContent='Listening on this device…';
    }catch{
      stop();
      status.textContent='Offline voice could not start. You can still type your command.';
    }finally{busy=false;}
  };
  install.onclick=async ()=>{
    if(install.disabled)return;
    install.disabled=true;
    try{
      const installed=await Speech.install(settings());
      status.textContent=installed?'Language pack ready. Tap Speak.':'Language pack setup failed. Try again when online.';
      install.hidden=installed;
    }catch{status.textContent='This browser could not install the language pack.';}
    finally{install.disabled=false;}
  };
  document.addEventListener('visibilitychange',()=>{if(document.hidden)stop();});
  return stop;
};
