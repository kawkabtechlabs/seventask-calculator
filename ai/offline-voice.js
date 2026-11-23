window.mountOfflineVoice = ({ dock, input, onlineAvailable = () => false, onOnlineResult = () => {} }) => {
  const trigger = dock.querySelector('.voice');
  const form = dock.querySelector('.ai-form');
  const state = dock.querySelector('.state');
  const bar = document.createElement('div');
  bar.className = 'online-voice-status';
  bar.hidden = true;
  bar.setAttribute('role', 'status');
  bar.setAttribute('aria-live', 'polite');
  dock.querySelector('.ai-form').after(bar);

  const style = document.createElement('style');
  style.textContent = `
    .ai-composer-row{position:relative;overflow:visible}
    .ai-composer-row .online-voice-status{position:absolute;z-index:18;inset:auto 8px calc(100% + 8px) auto;width:max-content;max-width:min(360px,calc(100% - 16px));box-sizing:border-box;margin:0;padding:7px 10px;color:var(--ui-text,#111114);border:1px solid var(--ai-line,#cfd3d8)!important;border-radius:10px;background:var(--ai-input,#fff);box-shadow:0 7px 22px #1111141b;font:600 10px/1.35 'DM Sans',system-ui,sans-serif;pointer-events:none;animation:online-voice-status-in .2s ease-out both}
    .online-voice-status[hidden]{display:none!important}
    .ai-form .voice{position:relative;width:44px!important;min-width:44px!important;height:44px!important;padding:0!important;overflow:visible;border:1.5px solid var(--ai-line,#cfd3d8)!important;border-radius:50%!important;background:linear-gradient(145deg,var(--ai-input,#fff),var(--ai-chat,#f3f4f6))!important;box-shadow:0 2px 5px #11111412,0 1px 0 #fff8 inset!important;transition:transform .2s cubic-bezier(.2,.8,.25,1),background .2s ease,color .2s ease,border-color .2s ease,box-shadow .2s ease!important}
    .ai-form .voice svg{position:relative;z-index:2;width:20px!important;height:20px!important;transition:transform .22s cubic-bezier(.2,.8,.25,1)}
    .ai-form .voice::before{content:'';position:absolute;inset:4px;border:1.5px solid transparent;border-radius:50%;pointer-events:none}
    .ai-form .voice::after{content:'';position:absolute;z-index:3;right:5px;bottom:5px;width:7px;height:7px;border:1.5px solid var(--ai-input,#fff);border-radius:50%;background:#8a9098;box-sizing:border-box;transition:background .2s,transform .2s}
    .ai-form .voice:hover{transform:translateY(-2px) scale(1.03);border-color:#7f8791!important;box-shadow:0 6px 15px #11111420,0 1px 0 #fff9 inset!important}
    .ai-form .voice:active{transform:scale(.94)}
    .ai-form .voice[data-voice-state=listening]{color:#fff!important;background:linear-gradient(145deg,#20252b,#0d0f12)!important;border-color:#111114!important;box-shadow:0 0 0 4px #25a66f25,0 7px 18px #1114!important}
    .ai-form .voice[data-voice-state=listening]::before{border-color:#69d6a4;animation:online-mic-ring 1.15s ease-out infinite}
    .ai-form .voice[data-voice-state=listening]::after{background:#69d6a4;border-color:#111114;animation:online-mic-live .78s ease-in-out infinite}
    .ai-form .voice[data-voice-state=listening] svg{animation:online-mic-pulse 1.05s ease-in-out infinite}
    .ai-form .voice[data-voice-state=processing]{color:#111114;background:#eef0f2!important;border-color:#aeb4bc!important;cursor:wait}
    .ai-form .voice[data-voice-state=processing]::before{border-color:#111114 transparent #111114 transparent;animation:online-mic-process .8s linear infinite}
    .ai-form .voice[data-voice-state=processing]::after{background:#f0a32f}
    .ai-form .voice[data-voice-state=error]::after{background:#cf3948;transform:scale(1.18)}
    .ai-form .voice[data-voice-state=muted]{color:#68717c!important;background:linear-gradient(145deg,#eef0f3,#dfe3e8)!important;border-color:#b9c0c8!important;box-shadow:0 2px 5px #11111418!important}
    .ai-form .voice[data-voice-state=muted]::before{inset:7px auto 7px 20px;width:2.5px;border:0;border-radius:99px;background:#c73545;transform:rotate(-42deg);box-shadow:0 0 0 1px #fff5}
    .ai-form .voice[data-voice-state=muted]::after{background:#cf3948}
    @keyframes online-mic-pulse{50%{transform:scale(1.12)}}
    @keyframes online-mic-ring{0%{transform:scale(.82);opacity:1}100%{transform:scale(1.35);opacity:0}}
    @keyframes online-mic-live{50%{transform:scale(1.45);opacity:.65}}
    @keyframes online-mic-process{to{transform:rotate(360deg)}}
    @keyframes online-voice-status-in{from{opacity:0;transform:translateY(5px)}to{opacity:1;transform:none}}
    @media(max-width:420px){.ai-form .voice{width:40px!important;min-width:40px!important;height:40px!important}.ai-form .voice::after{right:4px;bottom:4px}}
    @media(max-width:440px){.ai-composer-row .online-voice-status{inset:auto 4px calc(100% + 6px) 4px;width:auto;max-width:none;text-align:center}}
    @media(prefers-reduced-motion:reduce){.online-voice-status,.ai-form .voice,.ai-form .voice::before,.ai-form .voice::after,.ai-form .voice svg{animation:none!important;transition:none!important}}
    .ai-form .voice{border:0!important;border-radius:0!important;background:transparent!important;box-shadow:none!important}
    .ai-form .voice:hover,.ai-form .voice:active{transform:none;background:transparent!important;box-shadow:none!important}
    .ai-form .voice[data-voice-state=listening]{border:0!important;background:transparent!important;box-shadow:none!important;color:#111114!important}
    .ai-form .voice[data-voice-state=listening]::before{content:'';inset:auto 50% -4px;width:24px;height:3px;border:0;border-radius:99px;background:linear-gradient(90deg,transparent 0 8%,#31b77a 8% 20%,transparent 20% 30%,#31b77a 30% 44%,transparent 44% 54%,#31b77a 54% 68%,transparent 68% 78%,#31b77a 78% 92%,transparent 92%);transform:translateX(-50%);animation:mic-line-flow .9s ease-in-out infinite}
    .ai-form .voice[data-voice-state=listening]::after{display:none}
    @keyframes mic-line-flow{0%,100%{opacity:.45;transform:translateX(-50%) scaleX(.72)}50%{opacity:1;transform:translateX(-50%) scaleX(1.08)}}
    .ai-form .voice[data-voice-state=muted]{border:0!important;background:transparent!important;box-shadow:none!important}
  `;
  dock.getRootNode().append(style);

  trigger.setAttribute('aria-label', 'Ask by voice');
  trigger.title = 'Ask by voice';
  trigger.setAttribute('aria-pressed', 'false');
  trigger.dataset.voiceState = 'idle';
  let recorder = null;
  let stream = null;
  let timer = 0;
  let silenceTimer = 0;
  let audioContext = null;
  let busy = false;
  let discardNext = false;
  let recognition = null;
  let completionWatcher = null;

  const setVoiceState = (next, label, title = label) => {
    trigger.dataset.voiceState = next;
    trigger.setAttribute('aria-label', label);
    trigger.title = title;
    trigger.setAttribute('aria-pressed', String(next === 'listening'));
    trigger.disabled = next === 'processing';
  };

  const setStatus = text => {
    bar.textContent = text;
    bar.hidden = !text;
    if (state) state.textContent = text || 'Online assistant · calculator questions only';
  };
  const stopCompletionWatcher = () => {
    const watcher=completionWatcher;
    completionWatcher=null;
    if(watcher){watcher.onresult=null;watcher.onerror=null;watcher.onend=null;try{watcher.stop();}catch{}}
  };
  const startCompletionWatcher = () => {
    const SpeechRecognition=window.SpeechRecognition||window.webkitSpeechRecognition;
    if(!SpeechRecognition)return;
    try{
      const watcher=new SpeechRecognition();
      completionWatcher=watcher;
      watcher.lang=navigator.language||'en-IN';
      watcher.continuous=true;
      watcher.interimResults=false;
      watcher.maxAlternatives=1;
      watcher.onresult=event=>{
        const heard=[...event.results].filter(result=>result.isFinal).map(result=>result[0]?.transcript||'').join(' ').toLocaleLowerCase().replace(/[.,!?।؛:]+/g,' ').replace(/\s+/g,' ').trim();
        const finishPhrases=[
          /\b(show|tell|give) (me )?(the )?(answer|result)\b/,
          /\b(answer|result) (please|now|batao|dikhao|dikhाओ|show|de do|de dena)\b/,
          /\b(jawab|natija) (batao|dikhao|dikhाओ|de do|de dena)\b/,
          /\b(बस|बस इतना|जवाब बताओ|रिजल्ट दिखाओ|नतीजा बताओ)\b/,
          /\b(that is all|that's all|thats all|i am done|i'm done|stop listening|finish|submit)\b/,
        ];
        if(finishPhrases.some(pattern=>pattern.test(heard))&&recorder?.state==='recording'){
          setStatus('Finishing your voice question…');
          finishRecording();
        }
      };
      watcher.onerror=()=>stopCompletionWatcher();
      watcher.start();
    }catch{completionWatcher=null;}
  };
  const startSpeechRecognition = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition || busy) return false;
    let heard = '';
    let submitted = false;
    let endTimer = 0;
    const finish = text => {
      if (submitted) return;
      submitted = true;
      window.clearTimeout(endTimer);
      recognition = null;
      busy = false;
      const transcript = String(text || heard).trim();
      if (!transcript) {
        setVoiceState('error', 'No voice captured');
        setStatus('I couldn’t hear that. Tap the microphone and try again.');
        return;
      }
      setVoiceState('processing', 'Processing your request');
      setStatus('Heard: ' + transcript);
      input.value = transcript;
      input.dispatchEvent(new Event('input', { bubbles: true }));
      form?.requestSubmit();
      setVoiceState('idle', 'Ask by voice');
      setStatus('Ready for your next calculator question.');
    };
    try {
      const engine = new SpeechRecognition();
      recognition = engine;
      busy = true;
      engine.lang = navigator.language || 'en-IN';
      // Keep the recognizer open until the user taps the mic again. Some
      // speech engines emit a short final segment mid-sentence; don't submit
      // those partial thoughts as complete calculator commands.
      engine.continuous = true;
      engine.interimResults = true;
      engine.maxAlternatives = 2;
      engine.onresult = event => {
        let finalText = '';
        let interimText = '';
        for (let index = event.resultIndex; index < event.results.length; index++) {
          const phrase = event.results[index][0]?.transcript?.trim() || '';
          if (event.results[index].isFinal) finalText += (finalText ? ' ' : '') + phrase;
          else interimText = phrase;
        }
        if (finalText) heard = `${heard} ${finalText}`.trim();
        else if (!heard && interimText) heard = interimText;
        if (heard) setStatus(heard);
      };
      engine.onspeechend = () => setStatus(heard || 'Listening… tap the mic when you’re done.');
      engine.onerror = event => {
        if (submitted) return;
        submitted = true;
        window.clearTimeout(endTimer);
        recognition = null;
        busy = false;
        const denied = event.error === 'not-allowed' || event.error === 'service-not-allowed';
        setVoiceState(denied ? 'muted' : 'error', denied ? 'Microphone permission required' : 'Voice recognition unavailable');
        setStatus(denied ? 'Allow microphone access to ask by voice.' : 'Voice recognition stopped. Tap the microphone to try again.');
      };
      engine.onend = () => {
        if (!submitted && heard) finish(heard);
        else if (recognition === engine) { recognition = null; busy = false; setVoiceState('idle', 'Ask by voice'); }
      };
      setVoiceState('listening', 'Listening', 'Listening… tap the mic to finish');
      setStatus('Listening…');
      engine.start();
      return true;
    } catch {
      recognition = null;
      busy = false;
      return false;
    }
  };
  const stopTracks = () => {
    window.clearInterval(silenceTimer);
    silenceTimer = 0;
    if (audioContext) {
      const context = audioContext;
      audioContext = null;
      void context.close().catch(() => {});
    }
    stream?.getTracks().forEach(track => track.stop());
    stream = null;
  };
  const finishRecording = (discard = false) => {
    window.clearTimeout(timer);
    timer = 0;
    window.clearInterval(silenceTimer);
    silenceTimer = 0;
    stopCompletionWatcher();
    const active = recorder;
    recorder = null;
    if (active?.state === 'recording') {
      discardNext=discard;
      setVoiceState(discard?'idle':'processing', discard?'Ask by voice':'Processing voice request', discard?'Ask by voice':'Understanding your calculator question…');
      active.stop();
    }
  };

  async function startRecording() {
    if (!onlineAvailable()) {
      setVoiceState('muted', 'Voice needs an internet connection');
      setStatus('Connect to use voice with SevenTask AI.');
      return;
    }
    if (!navigator.mediaDevices?.getUserMedia || !window.MediaRecorder) {
      setVoiceState('muted', 'Voice recording unavailable');
      setStatus('Voice recording is unavailable in this browser. Type your calculator question instead.');
      return;
    }
    if (busy) return;
    busy = true;
    try {
      const supported=navigator.mediaDevices.getSupportedConstraints?.()||{};
      const audio={};
      if(supported.echoCancellation)audio.echoCancellation=true;
      if(supported.noiseSuppression)audio.noiseSuppression=true;
      if(supported.autoGainControl)audio.autoGainControl=true;
      if(supported.channelCount)audio.channelCount={ideal:1};
      if(supported.sampleRate)audio.sampleRate={ideal:48000};
      stream = await navigator.mediaDevices.getUserMedia({ audio });
      const mimeType = ['audio/webm;codecs=opus', 'audio/webm', 'audio/mp4'].find(type => MediaRecorder.isTypeSupported(type));
      if (!mimeType) throw new Error('audio-format');
      const chunks = [];
      const session = new MediaRecorder(stream, { mimeType });
      recorder = session;
      session.ondataavailable = event => { if (event.data?.size) chunks.push(event.data); };
      session.onerror = () => setStatus('Voice recording stopped. You can type your calculator question.');
      session.onstop = async () => {
        window.clearTimeout(timer);
        timer = 0;
        recorder = null;
        if(discardNext){discardNext=false;stopTracks();setVoiceState('idle','Ask by voice');return;}
        setVoiceState('processing', 'Processing voice request', 'Understanding your calculator question…');
        stopTracks();
        const clip = new Blob(chunks, { type: mimeType });
        if (!clip.size) { setVoiceState('error','No voice captured');setStatus('No voice was captured. Tap the microphone to try again.'); return; }
        if (clip.size > 2_200_000) { setVoiceState('error','Voice clip too large');setStatus('That voice clip is too large to send. Try a shorter voice request.'); return; }
        if (!onlineAvailable()) { setVoiceState('error','Connection lost');setStatus('Connection lost. Reconnect to use voice with SevenTask AI.'); return; }
        setStatus('Understanding your question…');
        try {
          const encoded = await new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(String(reader.result).split(',')[1]);
            reader.onerror = () => reject(reader.error || new Error('read-failed'));
            reader.readAsDataURL(clip);
          });
          await onOnlineResult(encoded, mimeType.split(';')[0]);
          setVoiceState('idle', 'Ask by voice');
          setStatus('Ready for your next calculator question.');
        } catch {
          setVoiceState('error', 'Voice could not be processed');
          setStatus('Voice could not be processed. You can type your calculator question.');
        }
      };
      session.start();
      setVoiceState('listening', 'Listening', 'Listening… tap the mic to send, or say “show the answer” when finished');
      setStatus('Listening… tap the mic to send, or say “show the answer” when you’re done.');
      // Keep one owner of the microphone stream. Starting Web Speech as a
      // second listener beside MediaRecorder can steal or mute the recording.
      timer = 0;
    } catch (error) {
      stopTracks();
      setVoiceState(error?.name === 'NotAllowedError'?'muted':'error', error?.name === 'NotAllowedError' ? 'Microphone permission required' : 'Voice recording unavailable');
      setStatus(error?.name === 'NotAllowedError'
        ? 'Allow microphone access to ask by voice.'
        : 'Voice recording is unavailable. You can type your calculator question.');
    } finally {
      busy = false;
    }
  }

  trigger.onclick = () => {
    if (window.SevenTaskNative?.startAiVoiceInput) {
      setVoiceState('listening', 'Google voice input is open', 'Speak your calculator question');
      setStatus('Listening with Google voice input…');
      window.SevenTaskNative.startAiVoiceInput();
      return;
    }
    if (recorder?.state === 'recording') finishRecording();
    else void startRecording();
  };
  document.addEventListener('visibilitychange', () => {
    if (document.hidden && recorder?.state === 'recording') finishRecording();
  });
  window.addEventListener('offline', () => {
    if (recorder?.state === 'recording') finishRecording();
    setVoiceState('muted', 'Voice needs an internet connection');
    setStatus('Connect to use voice with SevenTask AI.');
  });
  return () => { stopCompletionWatcher(); finishRecording(true); stopTracks(); };
};
