(() => {
  const number = String.raw`[+-]?(?:(?:\d{1,3}(?:,\d{2})*,\d{3}|\d{1,3}(?:,\d{3})+|\d+)(?:\.\d+)?|\.\d+)(?:\s*(?:crores?|lakhs?|lacs?|thousand|million|billion)\b|\s*k\b)?`;
  const words = value => String(value).normalize('NFKC').toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, ' ').trim().replace(/\s+/g, ' ');
  const key = value => words(String(value).replace(/([a-z])([A-Z])/g, '$1 $2'));
  const matchNumber = new RegExp('^' + number + '$', 'i');
  const multipliers = {k:1e3, thousand:1e3, lakh:1e5, lakhs:1e5, lac:1e5, lacs:1e5, crore:1e7, crores:1e7, million:1e6, billion:1e9};
  const englishNumbers=Object.fromEntries('zero one two three four five six seven eight nine ten eleven twelve thirteen fourteen fifteen sixteen seventeen eighteen nineteen'.split(' ').map((word,index)=>[word,index]));
  Object.assign(englishNumbers,{twenty:20,thirty:30,forty:40,fifty:50,sixty:60,seventy:70,eighty:80,ninety:90});
  const hindiNumbers=Object.fromEntries('शून्य एक दो तीन चार पाँच छह सात आठ नौ दस ग्यारह बारह तेरह चौदह पंद्रह सोलह सत्रह अठारह उन्नीस बीस'.split(' ').map((word,index)=>[word,index]));
  Object.assign(hindiNumbers,{'पांच':5,'छः':6,'पच्चीस':25,'तीस':30,'चालीस':40,'पचास':50,'साठ':60,'सत्तर':70,'अस्सी':80,'नब्बे':90});
  const romanNumbers=Object.fromEntries('shunya ek do teen char paanch chhe saat aath nau das gyarah barah terah chaudah pandrah solah satrah atharah unnis bees'.split(' ').map((word,index)=>[word,index]));
  Object.assign(romanNumbers,{chaar:4,panch:5,chhah:6,che:6,bees:20,pachis:25,tees:30,pachas:50});
  const scaleWords={hundred:100,sau:100,thousand:1000,hazaar:1000,hazar:1000,lakh:1e5,lac:1e5,crore:1e7,million:1e6,billion:1e9};
  const hindiTerms={
    'सौ':'hundred','हज़ार':'thousand','हजार':'thousand','लाख':'lakh','करोड़':'crore',
    'प्रतिशत':'%','परसेंट':'%','फीसदी':'%','रुपये':'₹','रुपए':'₹','रुपया':'₹',
    'का':'ka','की':'ki','के':'ke','में':'mein','साल':'saal','महीने':'months',
    'जोड़':'plus','जोड़ो':'plus','जमा':'plus','घटा':'minus','गुणा':'times','भाग':'divided by',
    'प्लस':'plus','माइनस':'minus','ईएमआई':'EMI','जीएसटी':'GST','छूट':'discount',
    'किलोमीटर':'km','मील':'mile','किलोग्राम':'kg','सेंटीमीटर':'cm','मीटर':'m','कितना':'kitna',
    'बताओ':'batao','निकालो':'nikalo','करो':'karo','दशमलव':'point',
  };
  function normalizeSpokenWords(text){
    const tokens=text.split(/([\p{L}\p{M}]+)/u);
    for(let i=1;i<tokens.length;i+=2){
      const token=tokens[i];
      tokens[i]=Object.hasOwn(hindiNumbers,token)?String(hindiNumbers[token]):(hindiTerms[token]??token);
    }
    const vocabulary={...englishNumbers,...romanNumbers};
    const numberWord=Object.keys(vocabulary).join('|');
    const scaleWord=Object.keys(scaleWords).join('|');
    // Resolve number phrases without joining separate list items such as "two, three".
    const wordsPattern=new RegExp('\\b(?:'+numberWord+')\\b(?:[ -]+(?:'+numberWord+'|'+scaleWord+')\\b)*','gi');
    const normalized=tokens.join('').replace(/\bhundred\s+and\s+/gi,'hundred ').replace(wordsPattern,match=>{
      let total=0,group=0,previous=0;
      for(const word of match.toLowerCase().split(/[ -]+/)){
        if(scaleWords[word]===100){group=(group||1)*100;previous=0;continue}
        if(scaleWords[word]){total+=(group||1)*scaleWords[word];group=0;previous=0;continue}
        const value=vocabulary[word];
        if(previous>0&&!(previous>=20&&value<10))return match;
        group+=value;
        previous=value;
      }
      return String(total+group);
    });
    return normalized
      .replace(/(\d+)\s+(?:hundred|sau)\b(?:\s+(?:and\s+)?(\d{1,2})\b)?/gi,(_,a,b)=>String(Number(a)*100+Number(b||0)))
      .replace(/(\d+)\s+point\s+(\d)\b(?:\s+\d\b)*/gi,match=>match.replace(/\s+point\s+/i,'.').replace(/\s+/g,''));
  }
  function normalizeCommand(query){
    return query.normalize('NFKC').replace(/[०-९]/g,c=>String(c.charCodeAt(0)-0x966))
      .split(/("[^"]*")/).map((part,index)=>index%2?part:normalizeSpokenWords(part
        .replace(/\b(?:kar|nikal|nikaal|bata|dikha)\s+do\b/gi,'karo')
        .replace(/ई\s+एम\s+आई/g,'EMI').replace(/जी\s+एस\s+टी/g,'GST'))
        .replace(/\b(?:per\s*cent|percent(?:age)?|pct|prcnt|pratishat)\b/gi,(word,offset,text)=>
          /\d\s*$/.test(text.slice(0,offset))?'%':word.toLowerCase()==='pct'?'percentage':word)
        .replace(/\b(?:rupees?|rs\.?) *(?=\d)|\b(?:rupees?|rs\.?)\b(?=\s|$)/gi,'₹')
        .replace(/\b(?:hisab|hisaab)\s+(?:krdo|kardo|karo)\b/gi,'calculate')
        .replace(/\b(?:disc|dscnt)\b/gi,'discount')
        .replace(/\b(?:amt)\s*(?=[:=])/gi,'amount')
        .replace(/\b(?:pls|plz|please|bhai|bh|bhi)\b/gi,' ')
        .replace(/\s+(?:(?:kitna|kitni|hai|kya|bta|batao?|batado|nikaal(?:o|do)?|nikal(?:o|do)?|kar(?:o|do)?|krdo|kro|de|do|result|answer|tell me|show me)\b\s*)+(?=[?.!]*\s*$)/gi,''))
      .join('').trim().replace(/^(?:can (?:you|u)|could you|mujhe|muje|मुझे)\s+/i,'').replace(/[?.!]+$/,'').trim();
  }
  function numerical(value) {
    const clean=String(value).trim().replace(/^[₹$€£]\s*/,'').replace(/%$/,'').trim();
    if(!matchNumber.test(clean)) return undefined;
    const suffix=clean.match(/[a-z]+$/i)?.[0].toLowerCase();
    const result=Number((suffix?clean.slice(0,-suffix.length):clean).replaceAll(',',''))*(multipliers[suffix]??1);
    return Number.isFinite(result)?String(result):undefined;
  }
  const aliases = {
    percentage:['percent','percentage','pratishat','प्रतिशत','percent of'],
    discount:['discount','chhoot','छूट'], splitbill:['bill split','split bill','per person','split'],
    emi:['emi','monthly emi','monthly instalment','monthly installment','loan payment','किस्त'],
    gst:['gst'], bmi:['bmi','body mass index'], average:['average','mean','ausat','औसत'],
    unitconverter:['unit converter','unit conversion','convert units'], currency:['currency conversion','currency exchange','exchange currency'],
    datedifference:['date difference','days between'], age:['age','umar','उम्र','date of birth'],
    compoundinterest:['compound interest','ci'], simpleinterest:['simple interest'],
    sip:['sip','monthly sip'], ohmslaw:['ohm law','ohms law'], powerroot:['power root'],
    customcalc:['custom formula','custom calculator'], basic:['basic calculator','keypad'],
    scientific:['scientific calculator'], programmer:['programmer calculator'],
  };
  const fieldAliases = {
    principal:['loan','principal','investment'], amount:['amount','rakam','रकम'],
    rate:['interest','rate','interest rate','gst rate','annual rate'], years:['years','tenure','duration','term','saal','साल'],
    months:['months','tenure','duration','term'], weight:['weight','wazan','वजन'], height:['height','lambai','लंबाई'],
    people:['people','persons','log','लोग'], price:['price','original price','cost'], tax:['tax','gst'],
    exchangeRate:['rate','exchange rate'], dob:['dob','birth date'], date1:['start date','from date'], date2:['end date','to date'],
  };
  function optionsFor(field,values){
    const options=typeof field.options==='function'?field.options(values):field.options;
    return (options||[]).map(option=>typeof option==='object'?option:{value:option,label:option});
  }
  const fieldNames = field => [...new Set([key(field.key),words(field.label.split(/[·(]/)[0]),...(fieldAliases[field.key]||[])])];
  function typed(field,value,values) {
    if(field.type==='number')return numerical(value);
    if(field.type==='date'){
      if(!/^\d{4}-\d\d-\d\d$/.test(value))return;
      const date=new Date(value+'T00:00:00Z');
      return Number.isFinite(date.valueOf())&&date.toISOString().slice(0,10)===value?value:undefined;
    }
    if(field.type==='time') {
      const m=value.match(/^(\d{1,2}):([0-5]\d)$/);
      return m&&Number(m[1])<24?m[1].padStart(2,'0')+':'+m[2]:undefined;
    }
    if(['select','pills'].includes(field.type)){
      const normalized=words(value);
      return optionsFor(field,values).find(o=>String(o.value).toLowerCase()===value.toLowerCase()
        || (normalized&&(words(o.value)===normalized||words(o.label)===normalized||(unitAliases[o.value]||[]).includes(normalized))))?.value;
    }
    return value || undefined;
  }
  const unitAliases = {
    mile:['miles','mi'], km:['kilometers','kilometres','kilometer','kilometre'], m:['meters','metres','meter','metre'],
    kg:['kilogram','kilograms','kilos'], g:['gram','grams'], lb:['pound','pounds','lbs'], ft:['foot','feet'],
    inch:['inches'], cm:['centimeter','centimeters','centimetre','centimetres'], '°C':['celsius','deg c'],
    '°F':['fahrenheit','deg f'], K:['kelvin'], L:['liters','litres','liter','litre'], 'US gallon':['gallons','gallon'],
  };
  function convert(tool,amount,from,to,rate){
    const cat=tool.fields[0], source=tool.fields[1];
    const find=(options,unit)=>options.find(o=>String(o.value)===unit.trim())
      ||options.find(o=>[o.value,...(unitAliases[o.value]||[])].some(v=>String(v).toLowerCase()===unit.trim().toLowerCase()));
    const candidates=[];
    for(const category of optionsFor(cat,{})){
      const options=optionsFor(source,{cat:category.value});
      const a=find(options,from), b=find(options,to);
      if(a&&b) candidates.push({cat:category.value,from:a.value,to:b.value,value:amount});
    }
    if(candidates.length!==1)return null;
    const values=candidates[0];
    if(rate!==undefined)values.exchangeRate=numerical(rate);
    return values;
  }
  function findTool(query,tools){
    const normalized=' '+words(query)+' ';
    let best=null;
    for(const tool of tools){
      const names=[words(tool.name),words(tool.name.replace(/\bcalculator\b/i,'')),key(tool.id),...(aliases[tool.id]||[])];
      for(const name of names){
        if(name&&normalized.includes(' '+name+' ')&&(!best||name.length>best.name.length))best={tool,name};
      }
    }
    return best;
  }
  function parseFields(tool,source,previous={},allowPositional=true){
    const supplied={...previous};
    const problems=[];
    const names=[...new Set(tool.fields.flatMap(field=>[field.key,...fieldNames(field)]))];
    if(tool.id==='percentage')names.push('percent','base');
    const namePattern=names.filter(Boolean).sort((a,b)=>b.length-a.length).map(name=>name.split(' ').map(part=>part.replace(/[.*+?^$${}()|[\]\\]/g,'\\$&')).join('[ _-]+')).join('|');
    const unquoted=source.replace(/"[^"]*"/g, segment=>'#'.repeat(segment.length));
    const pairs=namePattern?[...unquoted.matchAll(new RegExp('(?:^|[;,\\s])('+namePattern+')\\s*[:=]\\s*','giu'))]:[];
    let remainder=pairs.length?source.slice(0,pairs[0].index).trim():source;
    const unknown=remainder.match(/([\p{L}][\p{L}\p{N} _/-]*)\s*[:=]/u);
    if(unknown)problems.push('Unknown field: '+unknown[1].trim());
    for(const [i,pair] of pairs.entries()){
      const name=pair[1];
      const label=key(name);
      const exact=tool.fields.find(f=>key(f.key)===label);
      const matching=tool.fields.filter(f=>fieldNames(f).includes(label)
        || (tool.id==='percentage'&&((f.key==='a'&&label==='percent')||(f.key==='b'&&label==='base'))));
      const field=exact||(matching.length===1?matching[0]:null);
      const raw=source.slice(pair.index+pair[0].length,pairs[i+1]?.index).trim().replace(/[;,]\s*$/,'').trim();
      if(field) supplied[field.key]=raw.replace(/^"([^"]*)"$/,'$1');
      else problems.push('Unknown field: '+name.trim());
    }
    // Catalog-driven spoken inputs: "principal 5 lakh, rate 9%, years 5".
    // Keep unknown values out of the calculation instead of guessing a field.
    if(!pairs.length){
      const aliases=tool.fields.flatMap(field=>fieldNames(field).filter(label=>label.length>1).map(label=>({field,label})))
        .filter(({label})=>tool.fields.filter(field=>fieldNames(field).includes(label)).length===1)
        .sort((a,b)=>b.label.length-a.label.length);
      const claimed=new Set();
      const spans=[];
      const numberFirst=/^\s*[₹$€£]?\s*[+-]?\d/.test(remainder);
      for(const {field,label} of aliases){
        if(claimed.has(field.key))continue;
        const pattern=label.split(' ').map(part=>part.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')).join('[ _-]+');
        const re=new RegExp('(?:^|[^\\p{L}\\p{N}])('+pattern+')\\s*(?:[:=]|\\b(?:is|of|at|ka|ki|ke|mein|me)\\b)?\\s*('+number+')(?:\\s*%)?','giu');
        const reverse=new RegExp('(?:^|[^\\p{L}\\p{N}])('+number+')(?:\\s*%)?\\s*('+pattern+')(?:$|[^\\p{L}\\p{N}])','iu');
        const forwardMatch=re.exec(remainder);
        const reverseMatch=reverse.exec(remainder);
        const match=(numberFirst?[reverseMatch,forwardMatch]:[forwardMatch,reverseMatch]).filter(Boolean)
          .find(candidate=>{
            const start=candidate.index+candidate[0].length-candidate[0].trimStart().length;
            const end=candidate.index+candidate[0].trimEnd().length;
            return !spans.some(([a,b])=>start<b&&end>a);
          });
        if(!match)continue;
        const value=match===forwardMatch?match[2]:match[1];
        supplied[field.key]=value;
        claimed.add(field.key);
        spans.push([match.index+match[0].length-match[0].trimStart().length,match.index+match[0].trimEnd().length]);
      }
      if(spans.length){
        const chars=[...remainder];
        for(const [start,end] of spans)for(let i=start;i<end;i++)chars[i]=' ';
        remainder=chars.join(' ');
      }
    }

    const values={};
    const pending=[];
    for(const field of tool.fields){
      const explicit=supplied[field.key];
      if(explicit!=null){
        const value=typed(field,String(explicit),values);
        if(value===undefined)problems.push('Check '+field.label+' ('+explicit+')');
        else values[field.key]=value;
      }else pending.push(field);
    }
    if(!pairs.length&&allowPositional){
      const dates=remainder.match(/\b\d{4}-\d\d-\d\d\b/g)||[];
      const times=remainder.match(/\b\d{1,2}:[0-5]\d\b/g)||[];
      const numbers=[...remainder.replace(/\b\d{4}-\d\d-\d\d\b|\b\d{1,2}:[0-5]\d\b/g,' ').matchAll(new RegExp(number,'gi'))].map(m=>numerical(m[0]));
      const queues={date:dates,time:times,number:numbers};
      for(const field of pending){
        if(!['select','pills'].includes(field.type))continue;
        const haystack=' '+words(remainder)+' ';
        const possible=optionsFor(field,values).filter(o=>/[a-z]/i.test(String(o.value))&&haystack.includes(' '+words(o.value)+' '));
        if(possible.length===1)values[field.key]=possible[0].value;
      }
      const numeric=pending.filter(f=>f.type==='number'||(f.type==='select'&&optionsFor(f,values).length&&optionsFor(f,values).every(o=>typeof o.value==='number')));
      if(numbers.length>numeric.length)problems.push('Too many numbers for this tool. Use named inputs.');
      else for(const field of pending){
        const queue=queues[field.type]||(numeric.includes(field)?numbers:null);
        if(queue?.length){
          const value=typed(field,queue.shift(),values);
          if(value===undefined)problems.push('Check '+field.label);
          else values[field.key]=value;
        }
      }
    }
    const currency=tool.id==='currency'||(tool.id==='unitconverter'&&values.cat==='Currency');
    const missing=tool.fields.filter(field=>values[field.key]===undefined&&(
      field.key==='exchangeRate'?currency&&(values.from??'USD')!==(values.to??'INR'):field.default===''
    )&& !(['average','standarddeviation'].includes(tool.id)&&field.key!=='v1'));
    return {tool,values,missing,problems};
  }
  window.createOfflineCommands = app => {
    const tools=app.offlineCommandTools(), byId=Object.fromEntries(tools.map(t=>[t.id,t]));
    const mentionName=tool=>tool.name.toLowerCase().trim().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
    function suggestions(fragment){
      const prefix=words(fragment);
      return tools.filter(tool=>[tool.id,tool.name,mentionName(tool),...(aliases[tool.id]||[])].some(name=>words(name).includes(prefix)))
        .sort((a,b)=>Number(b.id===prefix)-Number(a.id===prefix));
    }
    function readMention(query){
      const match=query.match(/^@([\w-]+)(?=\s|$)/);
      if(!match)return null;
      const slug=match[1].toLowerCase();
      const tool=Object.hasOwn(byId,slug)?byId[slug]:tools.find(item=>mentionName(item)===slug||(aliases[item.id]||[]).includes(slug));
      return {tool,body:query.slice(match[0].length).trim()};
    }
    let awaiting=null;
    const list=()=>tools.map(t=>t.name);
    function completed(tool, values, problems=[]){
      const result=parseFields(tool,'',values);
      result.problems.unshift(...problems);
      awaiting=result.missing.length||result.problems.length?result:null;
      return result;
    }
    function parse(query,{standalone=false}={}){
      const mention=readMention(query);
      if(query.startsWith('@')&&!mention?.tool)return {error:'Choose a calculator from the @ menu or type “list tools”.'};
      if(mention?.body&&['basic','scientific','casio'].includes(mention.tool.id))return parse(mention.body,{standalone:true});
      if(words(query).match(/^(help|list|tools|list tools|show tools|calculators|list calculators|madad|मदद)$/))return {list:list()};
      const source=normalizeCommand(mention?mention.body:query);
      let m=source.match(new RegExp('^(?:convert\\s+)?('+number+')\\s*([\\p{L}°²³µΩ/ ]+?)\\s+(?:to|in|into|mein|me|में)\\s+([\\p{L}°²³µΩ/ ]+?)(?:\\s+(?:at|rate\\s*[:=]?)\\s*('+number+'))?\\s*[?]?$','iu'));
      if(m&&(!mention||mention.tool.id==='unitconverter')){
        const converted=convert(byId.unitconverter,numerical(m[1]),m[2],m[3],m[4]);
        if(converted)return completed(byId.unitconverter,converted);
      }
      m=source.match(new RegExp('(?:^|\\b(?:what is|calculate)\\s+)('+number+')\\s*%\\s*(?:of|ka|का)\\s*[₹$]?\\s*('+number+')\\s*[?]?$','i'))
       ||source.match(new RegExp('^[₹$]?\\s*('+number+')\\s*(?:ka|of)\\s*('+number+')\\s*%\\s*(?:kitna|nikaalo|hai)?\\s*[?]?$','i'))?.map((v,i,a)=>i===1?a[2]:i===2?a[1]:v);
      if(m&&(!mention||mention.tool.id==='percentage'))return completed(byId.percentage,{a:numerical(m[1]),b:numerical(m[2])});

      const found=mention?{tool:mention.tool}:findTool(source,tools);
      if(found){
        const {tool,name}=found;
        let body=mention?source:source.replace(new RegExp('(^|[^\\p{L}\\p{N}])'+name.split(' ').map(part=>part.replace(/[.*+?^$\x7B\x7D()|[\]\\]/g,'\\$&')).join('[^\\p{L}\\p{N}]+')+'(?=$|[^\\p{L}\\p{N}])','iu'),'$1').trim().replace(/^[:;,\s]+/,'');
        if(tool.id==='emi' && !/[:=]/.test(body)){
          const interest=body.match(new RegExp('('+number+')\\s*%','i'));
          const term=body.match(new RegExp('('+number+')\\s*(years?|yrs?|saal|months?|mos?)\\b','i'));
          const principal=body.replace(interest?.[0]||'','').replace(term?.[0]||'','').match(new RegExp(number,'i'));
          if((interest||term)&&!/(?:principal|loan amount|interest rate|rate|years|tenure)\s*[:=]?\s*\d/i.test(body))return completed(tool,{principal:principal&&numerical(principal[0]),rate:interest&&numerical(interest[1]),years:term&&String(Number(numerical(term[1]))/(/^mo/i.test(term[2])?12:1))});
        }
        if(tool.id==='discount' && !/[:=]/.test(body)){
          const pct=body.match(new RegExp('('+number+')\\s*%','i'));
          const price=pct&&body.replace(pct[0],' ').match(new RegExp(number,'i'));
          if(price&&pct&&(body.match(/%/g)||[]).length===1)return completed(tool,{price:numerical(price[0]),discount:numerical(pct[1])});
        }
        if(tool.id==='gst' && !/[:=]/.test(body)){
          const pct=body.match(new RegExp('('+number+')\\s*%','i'));
          const amount=pct&&body.replace(pct[0],' ').match(new RegExp(number,'i'));
          if(amount&&pct&&(body.match(/%/g)||[]).length===1)return completed(tool,{
            amount:numerical(amount[0]),rate:numerical(pct[1]),type:/inclusiv|included|remove/i.test(body)?'Inclusive':'Exclusive'
          });
        }
        if(tool.id==='bmi'&&!/[:=]/.test(body)){
          const weight=body.match(new RegExp('('+number+')\\s*kg\\b','i')),height=body.match(new RegExp('('+number+')\\s*(cm|m)\\b','i'));
          if(weight&&height)return completed(tool,{weight:numerical(weight[1]),height:String(Number(numerical(height[1]))*(height[2].toLowerCase()==='m'?100:1))});
        }
        const result=parseFields(tool,body);
        awaiting=result.missing.length||result.problems.length?result:null;
        return result;
      }
      if(!standalone&&awaiting&&new RegExp('^'+number+'(?:\\s*[,;]\\s*'+number+')*$','i').test(source)){
        const prior=awaiting;
        const result=parseFields(prior.tool,source,prior.values);
        awaiting=result.missing.length||result.problems.length?result:null;
        return result;
      }
      if(!standalone&&awaiting&&awaiting.tool.fields.some(field=>
        fieldNames(field).some(name=>name.length>1&&(' '+words(source)+' ').includes(' '+name+' ')))){
        const prior=awaiting;
        const result=parseFields(prior.tool,source,prior.values);
        awaiting=result.missing.length||result.problems.length?result:null;
        return result;
      }
      const addition=source.match(new RegExp('^(?:add|sum of)\\s+('+number+')\\s+and\\s+('+number+')$','i'))
        ||source.match(new RegExp('^('+number+')\\s+aur\\s+('+number+')\\s+(?:jod|jodo)$','i'));
      const math=(addition?numerical(addition[1])+'+'+numerical(addition[2]):source).toLowerCase().replace(/^(?:calculate|calc|what is|solve|hisab karo)\s+/,'').replace(/[?=]\s*$/,'')
        .replace(/(?<=\d),(?=\d{2,3}(?:,|\b))/g,'').replace(/\b(?:multiplied by|times|guna)\b|[×]/g,'*')
        .replace(/\bdivided by\b|÷/g,'/').replace(/\b(?:plus|jod)\b/g,'+').replace(/\b(?:minus|ghata)\b|−/g,'-')
        .replace(/\bto the power of\b/g,'^').replace(/\bsquare root of\s+(\d+(?:\.\d+)?)/g,'sqrt($1)')
        .replace(/(\d+(?:\.\d+)?)\s*%\s*(?:of|ka)\s*/g,'($1/100)*').replace(/π/g,'pi');
      if(!standalone&&awaiting&&(/[:=]/.test(source)||new RegExp('^'+number+'(?:\\s*[,;]\\s*'+number+')*$','i').test(source))){
        const prior=awaiting;
        const result=parseFields(prior.tool,source,prior.values);
        awaiting=result.missing.length||result.problems.length?result:null;
        return result;
      }
      if(/\d|\bpi\b/.test(math)&&!/[^\d\s.+*/^(),%a-z-]/.test(math)&&!/\b(?!(?:pi|e|sqrt|abs|sin|cos|tan|log|ln|pow)\b)[a-z]+/i.test(math)){
        try{return {expression:math,result:app.offlineExpression(math)}}
        catch(error){return {error:error.message}}
      }
      return {unrecognized:true,error:'Try “2500 ka 18%”, “22 plus 22”, or a tool name with inputs. Type “list tools” for the catalog.'};
    }
    function fromOnline(reply){
      if(reply.kind==='expression')return parse(reply.expression,{standalone:true});
      const tool=Object.hasOwn(byId,reply.tool)?byId[reply.tool]:null;
      if(reply.kind!=='tool'||!tool||!Array.isArray(reply.fields))return null;
      const values={};
      for(const field of tool.fields){
        const entry=reply.fields.find(item=>item.key===field.key);
        if(entry&&typeof entry.value==='string'){
          const value=typed(field,entry.value,values);
          if(value!==undefined)values[field.key]=value;
        }
      }
      return completed(tool,values);
    }
    function guidedFields(tool,values){
      const effective={...values};
      app.applyFieldDefaults(tool,effective);
      const currency=tool.id==='currency'||(tool.id==='unitconverter'&&effective.cat==='Currency');
      return tool.fields.filter(field=>field.key!=='exchangeRate'||(currency&&effective.from!==effective.to));
    }
    function guidedInput(tool,query,values,field){
      const source=normalizeCommand(query);
      if(!source)return {};
      if(field){
        const defaults={...values};
        app.applyFieldDefaults(tool,defaults);
        let raw=['number','date','time'].includes(field.type)?source:query.trim();
        if(field.type==='number'){
          const unit=field.label.match(/\(([a-z]+)\)$/i)?.[1];
          const suffix=unit&&new RegExp('\\s*'+unit+'s?$','i');
          if(suffix)raw=raw.replace(suffix,'');
          raw=raw.replace(/\s*₹$/,'').trim();
          if(field.key==='years'||field.key==='months'){
            const duration=source.match(/^(.+?)\s*(years?|yrs?|saal|months?|mos?)$/i);
            if(duration){
              const amount=numerical(duration[1]);
              if(amount!==undefined)raw=String(Number(amount)*(/^mo/i.test(duration[2])?(field.key==='years'?1/12:1):(field.key==='months'?12:1)));
            }
          }
        }
        // Free-form text fields can contain expressions, so preserve their original text.
        const namedInput=/^[\w -]+\s*=/.test(query);
        const value=namedInput?undefined:typed(field,raw,defaults);
        if(value!==undefined)return {[field.key]:value};
      }
      if(!Object.keys(values).length&&(Object.hasOwn(byId,tool.id))){
        const previous=awaiting;
        try{
          const parsed=parse('@'+tool.id+' '+query);
          const structured=/[:=]/.test(source)||new RegExp('^'+number+'(?:\\s*[,;]\\s*'+number+')*$','i').test(source);
          const commonPattern=
            (tool.id==='emi'&&/\d\s*%/.test(source)&&/\b(?:years?|yrs?|saal|months?|mos?)\b/i.test(source))||
            (tool.id==='percentage'&&/\d\s*%\s*(?:of|ka)\s*\d|\d\s*(?:of|ka)\s*\d+\s*%/i.test(source))||
            (['discount','gst'].includes(tool.id)&&/%/.test(source)&&(source.match(new RegExp(number,'gi'))||[]).length===2)||
            (tool.id==='bmi'&&/\bkg\b/i.test(source)&&/\b(?:cm|m)\b/i.test(source))||
            (tool.id==='unitconverter'&&/\b(?:to|in|into|mein|me)\b/i.test(source));
          if(parsed.tool===tool&&!parsed.problems.length&&(structured||commonPattern))return parsed.values;
        }finally{awaiting=previous;}
      }
      const parsed=parseFields(tool,source,values,false);
      if(!parsed.problems.length)return Object.fromEntries(Object.entries(parsed.values).filter(([key,value])=>value!==values[key]));
      return {};
    }
    function guidedOnline(tool,reply,values,allowed){
      if(reply.kind!=='tool'||reply.tool!==tool.id||!Array.isArray(reply.fields))return {};
      const result={};
      const effective={...values};
      for(const field of tool.fields){
        if(!allowed.includes(field.key))continue;
        const raw=reply.fields.find(item=>item.key===field.key)?.value;
        if(typeof raw!=='string')continue;
        const value=typed(field,raw.trim(),effective);
        if(value!==undefined)effective[field.key]=result[field.key]=value;
      }
      return result;
    }
    function programmerResult(query){
      const bases={hex:16,dec:10,oct:8,bin:2};
      const convertNumber=token=>{
        const sign=token.startsWith('-')?-1:1;
        const value=token.replace(/^[+-]/,'').toLowerCase();
        const radix={x:16,b:2,o:8}[value.match(/^0([xbo])/)?.[1]]||10;
        const digits=radix===10?value:value.slice(2);
        if(!digits||[...digits].some(digit=>!/[0-9a-f]/.test(digit)||parseInt(digit,16)>=radix))return NaN;
        return sign*parseInt(digits,radix);
      };
      const expression=query.trim().replace(/\s+(?:to|in)\s+(?:binary|hex(?:adecimal)?|octal|decimal)$/i,'');
      const token='([+-]?(?:0[xbo][0-9a-f]+|[0-9]+))';
      const match=expression.match(new RegExp('^'+token+'(?:\\s*(AND|OR|XOR|[+−×÷*/-])\\s*'+token+')?$','i'));
      if(!match)return;
      const left=convertNumber(match[1]);
      const right=match[3]&&convertNumber(match[3]);
      const op=match[2]?.toUpperCase();
      if(!Number.isSafeInteger(left)||(op&&!Number.isSafeInteger(right)))return;
      if((op==='÷'||op==='/')&&right===0)return;
      const result=op?app.progOpApply({'-':'−','*':'×','/':'÷'}[op]||op,left,right):left;
      if(!Number.isSafeInteger(result))return;
      return Object.entries(bases).map(([name,radix])=>name.toUpperCase()+': '+result.toString(radix).toUpperCase()).join('\n');
    }
    return {parse,convert,tools,suggestions,readMention,fromOnline,guidedFields,guidedInput,guidedOnline,optionsFor,programmerResult,reset:()=>{awaiting=null;}};
  };
})();
