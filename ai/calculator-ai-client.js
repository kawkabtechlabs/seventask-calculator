(() => {
  let endpoint;
  if (location.protocol==='https:'||['localhost','127.0.0.1'].includes(location.hostname)) {
    const url=new URL(document.documentElement.dataset.calculatorAiEndpoint||'/api/calculator-ai',location.href);
    if(url.protocol==='https:'||url.origin===location.origin)endpoint=url;
  }
  window.sevenTaskOnlineCalculator={
    async available(){
      if(!endpoint)return false;
      try{
        const result=await fetch(endpoint,{cache:'no-store',credentials:'omit',signal:AbortSignal.timeout(2500)});
        return result.ok&&(await result.json()).available===true;
      }catch{return false;}
    },
    async ask(prompt,tool){
      const result=await fetch(endpoint,{
        method:'POST',credentials:'omit',headers:{'Content-Type':'application/json'},
        body:JSON.stringify({prompt,tool}),signal:AbortSignal.timeout(13_000),
      });
      if(result.status===429)return {kind:'limit'};
      if(!result.ok)throw Error('Online calculator unavailable');
      return result.json();
    },
  };

  window.mountCalculatorMentions=({form,input,commands})=>{
    const list=document.createElement('div');
    list.id='ai-tool-suggestions';
    list.className='ai-tool-suggestions';
    list.role='listbox';
    list.setAttribute('aria-label','Calculators');
    list.hidden=true;
    const show=document.createElement('button');
    show.className='ai-mention';
    show.type='button';
    show.textContent='@';
    show.title='Choose a calculator';
    show.setAttribute('aria-label','Choose a calculator');
    input.setAttribute('aria-controls',list.id);
    input.setAttribute('aria-expanded','false');
    input.setAttribute('role','combobox');
    input.setAttribute('aria-autocomplete','list');
    form.prepend(show);
    form.append(list);
    const style=document.createElement('style');
    style.textContent='.ai-form{position:relative}.ai-form .ai-mention{width:30px;min-width:30px;height:36px;border:0;background:transparent;color:inherit;border-radius:8px;font:700 16px/1 "DM Sans",sans-serif}.ai-form .ai-mention:hover{background:#8882}.ai-form .ai-mention:focus-visible{outline:2px solid currentColor}.ai-form>.ai-tool-suggestions{position:absolute;z-index:25;bottom:calc(100% + 6px);inset-inline-start:0;width:min(300px,100%);max-height:min(34dvh,235px);overflow:auto;box-sizing:border-box;padding:4px;border:1px solid var(--ui-divider,#81858e);border-radius:12px;background:var(--ai-input,#fff);box-shadow:0 6px 24px #1112}.ai-tool-suggestions[hidden]{display:none!important}.ai-tool-suggestions [role=option]{display:flex;align-items:center;justify-content:space-between;gap:8px;padding:8px;border-radius:8px;font:600 12px "DM Sans",sans-serif;cursor:pointer}.ai-tool-suggestions [aria-selected=true],.ai-tool-suggestions [role=option]:hover{background:#8882}.ai-tool-suggestions small{opacity:.75}.ai-online-action{margin-top:7px;border:1px solid var(--ui-divider,#81858e);background:transparent;color:inherit;border-radius:8px;padding:5px 9px;cursor:pointer}.ai-online-action:disabled{opacity:.7;cursor:default}';
    form.getRootNode().append(style);
    let matches=[],selected=0,draft='';
    const close=()=>{
      list.hidden=true;
      input.setAttribute('aria-expanded','false');
      input.removeAttribute('aria-activedescendant');
    };
    const highlight=()=>{
      const options=[...list.children];
      options.forEach((option,i)=>option.setAttribute('aria-selected',String(i===selected)));
      input.setAttribute('aria-activedescendant',options[selected].id);
      options[selected].scrollIntoView({block:'nearest'});
    };
    function pick(tool){
      input.value='@'+tool.id+' '+draft;
      draft='';
      input.focus({preventScroll:true});
      input.setSelectionRange(tool.id.length+2,tool.id.length+2);
      close();
    }
    function refresh(){
      const prefix=input.value.match(/^@([\w-]*)$/);
      matches=prefix?commands.suggestions(prefix[1]):[];
      if(!matches.length){close();return;}
      list.replaceChildren();
      selected=0;
      for(const [index,tool] of matches.entries()){
        const item=document.createElement('div'),name=document.createElement('span'),key=document.createElement('small');
        item.id='ai-tool-option-'+index;
        item.role='option';
        name.textContent=tool.name;
        key.textContent='@'+tool.id;
        item.append(name,key);
        item.onpointerdown=event=>event.preventDefault();
        item.onclick=()=>pick(tool);
        list.append(item);
      }
      list.hidden=false;
      input.setAttribute('aria-expanded','true');
      highlight();
    }
    show.onclick=()=>{
      const current=input.value.match(/^@([\w-]*)(?:\s+(.*))?$/);
      draft=current?current[2]||'':input.value;
      input.value='@'+(current?.[1]||'');
      input.focus({preventScroll:true});
      refresh();
    };
    input.addEventListener('input',()=>{
      if(!input.value.startsWith('@'))draft='';
      refresh();
    });
    input.addEventListener('blur',()=>{
      if(!list.hidden&&draft){
        input.value=draft;
        draft='';
      }
      close();
    });
    input.addEventListener('keydown',event=>{
      if(list.hidden)return;
      if(event.key==='Escape'){
        event.preventDefault();event.stopPropagation();
        if(draft){input.value=draft;draft='';}
        close();
      }
      else if(event.key==='ArrowDown'||event.key==='ArrowUp'){
        event.preventDefault();
        selected=(selected+(event.key==='ArrowDown'?1:matches.length-1))%matches.length;
        highlight();
      }else if(event.key==='Enter'){
        event.preventDefault();
        pick(matches[selected]);
      }
    });
    form.addEventListener('submit',()=>{draft='';close();});
  };
})();
