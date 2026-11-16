// GENERATED. Edit scripts/build-worker.mjs and worker/handler.js, then rebuild.

const __engine = (() => {
const window = { setTimeout, clearTimeout };
  /* ===================== helpers ===================== */
  const num = v => { const n = parseFloat(v); return isFinite(n) ? n : 0; };
  const fmtNum = n => !isFinite(n) ? '—' : (Math.round(n*100)/100).toLocaleString('en-IN',{maximumFractionDigits:2});
  const fmtCur = n => !isFinite(n) ? '—' : '₹' + fmtNum(n);
  const fmtPct = n => !isFinite(n) ? '—' : fmtNum(n) + '%';
  const fmtMeasure = n => { if(!Number.isFinite(n)) return '—'; if(n===0) return '0'; const a=Math.abs(n); return (a<1e-6 || a>=1e12) ? n.toExponential(6) : Number(n.toPrecision(8)).toLocaleString('en-IN',{maximumSignificantDigits:8}); };

  const emiCalc = (P, annualRate, months) => {
    const r = annualRate/12/100;
    if(months<=0) return 0;
    if(r===0) return P/months;
    const pw = Math.pow(1+r, months);
    return P*r*pw/(pw-1);
  };
  const tenureFromEmi = (P, annualRate, EMI) => {
    const r = annualRate/12/100;
    if(r===0) return EMI>0 ? P/EMI : 0;
    if(EMI<=P*r) return Infinity;
    return Math.log(EMI/(EMI-P*r)) / Math.log(1+r);
  };
  const rateFromEmi = (P, EMI, n) => {
    let lo=0, hi=0.08;
    for(let i=0;i<60;i++){
      const mid=(lo+hi)/2;
      const e = mid===0 ? P/n : P*mid*Math.pow(1+mid,n)/(Math.pow(1+mid,n)-1);
      if(e>EMI) hi=mid; else lo=mid;
    }
    return ((lo+hi)/2)*12*100;
  };
  const amortSummary = (P, annualRate, months) => {
    const r = annualRate/12/100;
    const emi = emiCalc(P, annualRate, months);
    let bal=P, rows=[], yp=0, yi=0;
    for(let m=1; m<=months; m++){
      const interest = bal*r;
      const principal = emi - interest;
      bal = Math.max(0, bal - principal);
      yp += principal; yi += interest;
      if(m % 12 === 0 || m === months){
        rows.push({ year: Math.ceil(m/12), principal: yp, interest: yi, balance: bal });
        yp=0; yi=0;
      }
    }
    return rows;
  };
  const xirrCalc = (flows) => {
    if(!Array.isArray(flows) || flows.length !== 2) return NaN;
    const ordered = [...flows].sort((a,b)=>a.date-b.date);
    const [start,end] = ordered;
    const days = (end.date-start.date)/(24*60*60*1000);
    if(!Number.isFinite(days) || days <= 0 || !Number.isFinite(start.amount) || !Number.isFinite(end.amount) || start.amount*end.amount >= 0 || start.amount === 0 || end.amount === 0) return NaN;
    const growth = -end.amount/start.amount;
    if(!(growth > 0)) return NaN;
    return (Math.pow(growth,365/days)-1)*100;
  };
  const UNITS = {
    Length:{'mm':0.001,'cm':0.01,'m':1,'km':1000,'inch':0.0254,'ft':0.3048,'yd':0.9144,'mile':1609.344,'nautical mile':1852,'micrometre':1e-6,'nanometre':1e-9},
    Area:{'mm²':1e-6,'cm²':1e-4,'m²':1,'km²':1e6,'hectare':10000,'acre':4046.8564224,'in²':0.00064516,'ft²':0.09290304,'yd²':0.83612736,'mile²':2589988.110336},
    Volume:{'mL':1e-6,'L':0.001,'m³':1,'cm³':1e-6,'US tsp':4.92892159375e-6,'US tbsp':1.478676478125e-5,'US cup':0.0002365882365,'metric cup':0.00025,'US fl oz':2.95735295625e-5,'US pint':0.000473176473,'US quart':0.000946352946,'US gallon':0.003785411784,'UK gallon':0.00454609,'in³':1.6387064e-5,'ft³':0.028316846592,'yd³':0.764554857984},
    Mass:{'µg':1e-9,'mg':1e-6,'g':0.001,'kg':1,'tonne':1000,'grain':0.00006479891,'oz':0.028349523125,'lb':0.45359237,'stone':6.35029318,'US ton':907.18474,'UK ton':1016.0469088},
    Time:{'ns':1e-9,'µs':1e-6,'ms':0.001,'s':1,'min':60,'h':3600,'day':86400,'week':604800,'average month':2629800,'average year':31557600},
    Speed:{'m/s':1,'km/h':1/3.6,'mph':0.44704,'ft/s':0.3048,'knot':0.514444444444,'cm/s':0.01,'Mach (20°C)':343,'speed of light':299792458},
    Energy:{'J':1,'kJ':1000,'cal':4.184,'kcal':4184,'Wh':3600,'kWh':3600000,'eV':1.602176634e-19,'BTU (IT)':1055.05585262,'US therm':105505585.257},
    Pressure:{'Pa':1,'kPa':1000,'MPa':1e6,'bar':100000,'mbar':100,'atm':101325,'torr':101325/760,'mmHg':133.322387415,'psi':6894.757293168,'inH₂O':249.08891},
    Power:{'W':1,'mW':0.001,'kW':1000,'MW':1e6,'mechanical hp':745.699871582,'metric hp':735.49875,'BTU/h':0.29307107,'ft·lbf/s':1.3558179483314},
    'Digital Storage':{'bit':1,'byte (B)':8,'kB (1000 B)':8000,'MB (1000 kB)':8e6,'GB (1000 MB)':8e9,'TB (1000 GB)':8e12,'KiB (1024 B)':8192,'MiB (1024 KiB)':8388608,'GiB (1024 MiB)':8589934592,'TiB (1024 GiB)':8796093022208},
    Angle:{'radian':1,'degree':Math.PI/180,'gradian':Math.PI/200,'arcminute':Math.PI/10800,'arcsecond':Math.PI/648000,'turn':2*Math.PI,'milliradian':0.001},
    Force:{'N':1,'kN':1000,'dyn':1e-5,'kgf':9.80665,'lbf':4.4482216152605,'poundal':0.138254954376},
    Frequency:{'Hz':1,'kHz':1000,'MHz':1e6,'GHz':1e9,'rpm':1/60,'revolutions/s':1,'beats/min':1/60},
    Density:{'kg/m³':1,'g/cm³':1000,'g/mL':1000,'kg/L':1000,'lb/ft³':16.01846337,'lb/US gal':119.8264273},
    Torque:{'N·m':1,'N·cm':0.01,'kgf·m':9.80665,'lbf·ft':1.3558179483314,'lbf·in':0.1129848290276},
    'Fuel Economy':{'km/L':1,'mpg (US)':0.425143707,'mpg (UK)':0.354006043,'L/100 km':1},
    'Data Rate':{'bit/s':1,'kbit/s':1000,'Mbit/s':1e6,'Gbit/s':1e9,'B/s':8,'kB/s':8000,'MB/s':8e6,'KiB/s':8192,'MiB/s':8388608},
    'Electric Charge':{'C':1,'mC':0.001,'µC':1e-6,'Ah':3600,'mAh':3.6,'µAh':0.0036,'elementary charge':1.602176634e-19},
    Voltage:{'V':1,'mV':0.001,'µV':1e-6,'kV':1000,'MV':1e6},
    Current:{'A':1,'mA':0.001,'µA':1e-6,'kA':1000},
    Resistance:{'Ω':1,'mΩ':0.001,'kΩ':1000,'MΩ':1e6,'GΩ':1e9},
    Capacitance:{'F':1,'mF':0.001,'µF':1e-6,'nF':1e-9,'pF':1e-12},
    Inductance:{'H':1,'mH':0.001,'µH':1e-6,'nH':1e-9},
    'Flow Rate':{'m³/s':1,'m³/h':1/3600,'L/s':0.001,'L/min':1/60000,'mL/s':1e-6,'US gal/min':0.003785411784/60,'UK gal/min':0.00454609/60},
    Illuminance:{'lx':1,'klx':1000,'foot-candle':10.7639104167,'phot':10000},
    Radioactivity:{'Bq':1,'kBq':1000,'MBq':1e6,'GBq':1e9,'Ci':3.7e10,'mCi':3.7e7,'µCi':37000},
    'Amount of Substance':{'mol':1,'mmol':0.001,'µmol':1e-6,'nmol':1e-9,'kmol':1000,'particles':1/6.02214076e23},
    Acceleration:{'m/s²':1,'cm/s²':0.01,'ft/s²':0.3048,'standard gravity (g)':9.80665},
    'Magnetic Field':{'tesla (T)':1,'millitesla (mT)':0.001,'microtesla (µT)':1e-6,'gauss (G)':1e-4,'milligauss (mG)':1e-7},
    'Magnetic Flux':{'weber (Wb)':1,'milliweber (mWb)':0.001,'microweber (µWb)':1e-6,'maxwell (Mx)':1e-8},
    'Radiation Dose':{'gray (Gy)':1,'milligray (mGy)':0.001,'sievert (Sv)':1,'millisievert (mSv)':0.001,'rem':0.01,'rad':0.01},
    Luminance:{'cd/m²':1,'stilb (sb)':10000,'nit':1,'foot-lambert (fL)':3.4262591},
    'Dynamic Viscosity':{'Pa·s':1,'mPa·s':0.001,'poise (P)':0.1,'centipoise (cP)':0.001},
    'Kinematic Viscosity':{'m²/s':1,'cm²/s':0.0001,'stokes (St)':0.0001,'centistokes (cSt)':1e-6},
  };
  const CURRENCY_API='https://api.frankfurter.dev/v2';
  const fetchWithTimeout=(url,options={})=>{const controller=new AbortController();const timeout=window.setTimeout(()=>controller.abort(),8000);return fetch(url,{...options,signal:controller.signal}).finally(()=>window.clearTimeout(timeout));};
  const CURRENCY_SEED=['USD','INR','EUR','GBP','JPY','CAD','AUD','CHF','CNY'];
  let CURRENCY_CODES=CURRENCY_SEED.slice(), CURRENCY_NAMES={}, currencyListPromise=null, CURRENCY_READY=false;
  const currencyLabel=code=>{ try{return `${code} — ${new Intl.DisplayNames(['en'],{type:'currency'}).of(code)}`;}catch(e){return code;} };
  async function loadCurrencyCodes(){
    if(currencyListPromise) return currencyListPromise;
    currencyListPromise=(async()=>{
      try{
        const cached=JSON.parse(localStorage.getItem('kawkab_currency_codes')||'null');
        if(Array.isArray(cached)&&cached.length){CURRENCY_CODES=[...new Set([...CURRENCY_SEED,...cached.filter(c=>/^[A-Z]{3}$/.test(c))])].sort();}
      }catch(e){}
      try{
        const res=await fetchWithTimeout(`${CURRENCY_API}/currencies`,{headers:{Accept:'application/json'}});
        if(!res.ok) throw new Error('Currency list unavailable');
        const rows=await res.json();
        const codes=rows.map(x=>String(x.iso_code||x.code||x.currency||'').toUpperCase()).filter(c=>/^[A-Z]{3}$/.test(c));
        if(codes.length){CURRENCY_CODES=[...new Set([...CURRENCY_SEED,...codes])].sort();try{localStorage.setItem('kawkab_currency_codes',JSON.stringify(codes));}catch(e){}}
      }catch(e){}
      CURRENCY_READY=true;return CURRENCY_CODES;
    })();
    return currencyListPromise;
  }
  function currencyOptions(){return CURRENCY_CODES.map(code=>({value:code,label:currencyLabel(code)}));}
  async function getCurrencyRate(from,to){
    if(!/^[A-Z]{3}$/.test(from)||!/^[A-Z]{3}$/.test(to))throw new Error('Choose valid ISO currency codes.');
    if(from===to)return {rate:1,date:new Date().toISOString().slice(0,10),cached:false};
    const key=`kawkab_fx_${from}_${to}`;
    let old=null;try{old=JSON.parse(localStorage.getItem(key)||'null');if(old&&Number.isFinite(old.rate)&&Date.now()-old.savedAt<86400000)return {...old,cached:true};}catch(e){}
    try{
      const res=await fetchWithTimeout(`${CURRENCY_API}/rate/${encodeURIComponent(from.toLowerCase())}/${encodeURIComponent(to.toLowerCase())}`,{headers:{Accept:'application/json'}});
      if(!res.ok)throw new Error(res.status===404||res.status===422?'A daily reference rate is not available for this currency pair.':'Could not load the exchange rate.');
      const data=await res.json(),rate=Number(data.rate);
      if(!Number.isFinite(rate)||rate<=0)throw new Error('The rate provider returned an invalid value.');
      const saved={rate,date:data.date,savedAt:Date.now()};try{localStorage.setItem(key,JSON.stringify(saved));}catch(e){}
      return {...saved,cached:false};
    }catch(e){if(old&&Number.isFinite(old.rate))return {...old,cached:true,stale:true};throw e;}
  }

  const escapeHtml = value => String(value ?? '').replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  const DAY_MS = 86400000;
  function parseCalendarDate(value){
    const match=/^(\d{4})-(\d{2})-(\d{2})$/.exec(String(value||''));
    if(!match) return null;
    const year=Number(match[1]),month=Number(match[2]),day=Number(match[3]);
    const date=new Date(Date.UTC(year,month-1,day));
    if(date.getUTCFullYear()!==year||date.getUTCMonth()+1!==month||date.getUTCDate()!==day) return null;
    return {year,month,day,serial:date.getTime()/DAY_MS};
  }
  function calendarAge(birth,today){
    let months=(today.year-birth.year)*12+today.month-birth.month;
    const anniversary=count=>{
      const monthIndex=birth.month-1+count,year=birth.year+Math.floor(monthIndex/12),month=monthIndex%12+1;
      const lastDay=new Date(Date.UTC(year,month,0)).getUTCDate();
      return Date.UTC(year,month-1,Math.min(birth.day,lastDay))/DAY_MS;
    };
    if(months<0||today.serial<birth.serial) return null;
    if(anniversary(months)>today.serial) months--;
    return {years:Math.floor(months/12),months:months%12,days:today.serial-anniversary(months)};
  }
  function evalCustomFormula(source, values){
    const text=String(source||'').trim(); if(!text||text.length>180) throw new Error('Enter a formula under 180 characters.');
    const tokens=[]; const re=/\s*(?:(\d+(?:\.\d*)?|\.\d+)|([A-Za-z]+)|([()+\-*/%^,]))/gy; let pos=0,m;
    while(pos<text.length){re.lastIndex=pos;m=re.exec(text);if(!m)throw new Error('Use numbers, A–H, + − × ÷ ^ %, parentheses or supported functions.');tokens.push(m[1]!==undefined?{type:'number',value:Number(m[1])}:m[2]!==undefined?{type:'word',value:m[2].toUpperCase()}:{type:m[3],value:m[3]});pos=re.lastIndex;}
    let i=0;const peek=()=>tokens[i],take=()=>tokens[i++];
    function primary(){const t=take();if(!t)throw new Error('Formula is incomplete.');if(t.type==='number')return t.value;if(t.type==='('){const x=expr();if(take()?.type!==')')throw new Error('Add a closing parenthesis.');return x;}if(t.type==='word'){const name=t.value;if('ABCDEFGH'.includes(name)&&name.length===1)return num(values[name.toLowerCase()]);if(name==='PI')return Math.PI;if(name==='E')return Math.E;if(take()?.type!=='(')throw new Error('Functions need parentheses, for example sqrt(A).');const a=expr();let b;if(peek()?.type===','){take();b=expr();}if(take()?.type!==')')throw new Error('Add a closing parenthesis.');const f={SQRT:()=>Math.sqrt(a),SIN:()=>Math.sin(a),COS:()=>Math.cos(a),TAN:()=>Math.tan(a),LOG:()=>Math.log10(a),LN:()=>Math.log(a),ABS:()=>Math.abs(a),POW:()=>Math.pow(a,b)}[name];if(!f||((name==='POW')!==(b!==undefined)))throw new Error('Supported functions: sqrt, sin, cos, tan, log, ln, abs, pow.');return f();}throw new Error('Expected a number, variable or parenthesized expression.');}
    function unary(){if(peek()?.type==='+'){take();return unary();}if(peek()?.type==='-'){take();return -unary();}return power();}
    function power(){let a=primary();if(peek()?.type==='^'){take();a=Math.pow(a,unary());}return a;}
    function term(){let a=unary();while(['*','/','%'].includes(peek()?.type)){const op=take().type,b=unary();a=op==='*'?a*b:op==='/'?a/b:a%b;}return a;}
    function expr(){let a=term();while(['+','-'].includes(peek()?.type)){const op=take().type,b=term();a=op==='+'?a+b:a-b;}return a;}
    const result=expr();if(i!==tokens.length)throw new Error('Check the formula syntax.');if(!Number.isFinite(result))throw new Error('This formula has no finite result.');return result;
  }
  /* ===================== calculator catalog ===================== */
  const CATEGORIES = [
  { name:'Utility', items:[
    { id:'percentage', name:'Percentage', fields:[
        {key:'a', label:'Percent %', type:'number', default:''},
        {key:'b', label:'Of value', type:'number', default:''},
      ], compute:v=>{ const a=num(v.a), b=num(v.b);
        return [ {label:'Result', value:fmtNum(a*b/100), emphasis:true}, {label:`${a||0} is what % of ${b||0}`, value: b? fmtPct(a/b*100):'—'} ];
      }},
    { id:'discount', name:'Discount & Savings', fields:[
        {key:'price', label:'Original price', type:'number', default:''},
        {key:'discount', label:'Discount %', type:'number', default:''},
        {key:'tax', label:'Tax %', type:'number', default:0},
      ], compute:v=>{ const price=Math.max(0,num(v.price)), pct=Math.min(100,Math.max(0,num(v.discount))), tax=Math.max(0,num(v.tax)); const savings=price*pct/100, discounted=price-savings, taxAmount=discounted*tax/100; return [ {label:'You save',value:fmtCur(savings)}, {label:'Price after discount',value:fmtCur(discounted)}, {label:'Tax',value:fmtCur(taxAmount)}, {label:'Final price',value:fmtCur(discounted+taxAmount),emphasis:true} ]; }},
    { id:'unitprice', name:'Unit Price', fields:[
        {key:'price', label:'Total price', type:'number', default:''},
        {key:'quantity', label:'Quantity', type:'number', default:''},
        {key:'unit', label:'Unit', type:'select', options:['items','kg','g','L','m'], default:'items'},
      ], compute:v=>{ const q=num(v.quantity); return [{label:'Price per '+(v.unit||'unit'),value:q>0?fmtCur(num(v.price)/q):'Enter a quantity above zero',emphasis:true}]; }},
    { id:'splitbill', name:'Split bill', fields:[
        {key:'total', label:'Total amount', type:'number', default:''},
        {key:'people', label:'Number of people', type:'number', default:2},
        {key:'tip', label:'Tip %', type:'number', default:0},
      ], compute:v=>{ const total=num(v.total), people=Math.max(1,num(v.people)), tip=num(v.tip);
        const withTip = total*(1+tip/100);
        return [ {label:'Total with tip', value:fmtCur(withTip)}, {label:'Per person', value:fmtCur(withTip/people), emphasis:true} ];
      }},
    { id:'age', name:'Age calculator', fields:[ {key:'dob', label:'Date of birth', type:'date', default:''} ],
      compute:v=>{ if(!v.dob) return [{label:'Age', value:'—', emphasis:true}];
        const dob=parseCalendarDate(v.dob),now=new Date();
        const today=parseCalendarDate(`${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')}`);
        if(!dob) return [{label:'Age', value:'Enter a valid birth date.', emphasis:true}];
        const age=calendarAge(dob,today);
        return [{label:'Age', value:age?`${age.years}y ${age.months}m ${age.days}d`:'Birth date must not be in the future.', emphasis:true}];
      }},
    { id:'time', name:'Time calculator', fields:[
        {key:'t1', label:'Start time', type:'time', default:''},
        {key:'t2', label:'End time', type:'time', default:''},
      ], compute:v=>{ if(!v.t1||!v.t2) return [{label:'Difference', value:'—', emphasis:true}];
        const [h1,m1]=v.t1.split(':').map(Number), [h2,m2]=v.t2.split(':').map(Number);
        let mins=(h2*60+m2)-(h1*60+m1); if(mins<0) mins+=24*60;
        return [{label:'Difference', value:`${Math.floor(mins/60)}h ${mins%60}m`, emphasis:true}];
      }},
    { id:'unitconverter', name:'Complete Unit & Currency Converter', fields:[
        {key:'cat', label:'Measurement', type:'select', options:[...Object.keys(UNITS),'Temperature','Currency'], default:'Length'},
        {key:'from', label:'From', type:'select', options:v=>v.cat==='Temperature'?['°C','°F','K','°R']:v.cat==='Currency'?currencyOptions():Object.keys(UNITS[v.cat||'Length']), default:v=>v.cat==='Temperature'?'°C':v.cat==='Currency'?'USD':Object.keys(UNITS[v.cat||'Length'])[0]},
        {key:'to', label:'To', type:'select', options:v=>v.cat==='Temperature'?['°C','°F','K','°R']:v.cat==='Currency'?currencyOptions():Object.keys(UNITS[v.cat||'Length']), default:v=>v.cat==='Temperature'?'°F':v.cat==='Currency'?'INR':(Object.keys(UNITS[v.cat||'Length'])[1]||Object.keys(UNITS[v.cat||'Length'])[0])},
        {key:'value', label:'Value', type:'number', default:1},
      ], compute:v=>{ const val=num(v.value); let out;
        if(v.cat==='Temperature'){
          const c=v.from==='°C'?val:v.from==='°F'?(val-32)*5/9:v.from==='K'?val-273.15:val*5/9-273.15;
          out=v.to==='°C'?c:v.to==='°F'?c*9/5+32:v.to==='K'?c+273.15:(c+273.15)*9/5;
        } else if(v.cat==='Fuel Economy'){
          if(val<=0 && (v.from==='L/100 km'||v.to==='L/100 km')) return [{label:'Result',value:'Enter a value above zero',emphasis:true}];
          const kml=v.from==='L/100 km'?100/val:val*UNITS[v.cat][v.from];
          out=v.to==='L/100 km'?100/kml:kml/UNITS[v.cat][v.to];
        } else {
          const table=UNITS[v.cat]||UNITS.Length;
          out=val*table[v.from]/table[v.to];
        }
        return [{label:`${val} ${v.from} =`,value:`${fmtMeasure(out)} ${v.to}`,emphasis:true}];
      }},
  ]},
  { name:'Loan & EMI', items:[
    { id:'emi', name:'EMI Calculator', fields:[
        {key:'principal', label:'Loan amount', type:'number', default:''},
        {key:'rate', label:'Interest rate % p.a.', type:'number', default:''},
        {key:'years', label:'Tenure (years)', type:'number', default:''},
      ], compute:v=>{ const P=num(v.principal), months=Math.round(num(v.years)*12);
        if(months>1200) return [{label:'Tenure',value:'Enter a tenure of 100 years or less.'}];
        const emi=emiCalc(P,num(v.rate),months), total=emi*months, interest=total-P;
        return [ {label:'Monthly EMI', value:fmtCur(emi), emphasis:true}, {label:'Total interest', value:fmtCur(interest)}, {label:'Total payment', value:fmtCur(total)},
          {type:'table', title:'Yearly breakup', rows:amortSummary(P,num(v.rate),months)} ];
      }},
    { id:'personalloan', name:'Personal Loan', fields:[
        {key:'amount', label:'Loan amount', type:'number', default:''},
        {key:'rate', label:'Rate % p.a.', type:'number', default:''},
        {key:'months', label:'Tenure (months)', type:'number', default:''},
      ], compute:v=>{ const P=num(v.amount), months=num(v.months);
        const emi=emiCalc(P,num(v.rate),months), total=emi*months;
        return [ {label:'EMI', value:fmtCur(emi), emphasis:true}, {label:'Total cost', value:fmtCur(total)}, {label:'Total interest', value:fmtCur(total-P)} ];
      }},
    { id:'homeloan', name:'Home Loan', fields:[
        {key:'propertyValue', label:'Property value', type:'number', default:''},
        {key:'downPayment', label:'Down payment', type:'number', default:''},
        {key:'rate', label:'Rate % p.a.', type:'number', default:''},
        {key:'years', label:'Tenure (years)', type:'number', default:''},
      ], compute:v=>{ const P=Math.max(0,num(v.propertyValue)-num(v.downPayment)), months=Math.round(num(v.years)*12);
        const emi=emiCalc(P,num(v.rate),months), total=emi*months;
        return [ {label:'Loan amount', value:fmtCur(P)}, {label:'EMI', value:fmtCur(emi), emphasis:true}, {label:'Total interest', value:fmtCur(total-P)} ];
      }},
    { id:'carloan', name:'Car Loan', fields:[
        {key:'carPrice', label:'Car price', type:'number', default:''},
        {key:'downPayment', label:'Down payment', type:'number', default:''},
        {key:'tradeIn', label:'Trade-in allowance', type:'number', default:0},
        {key:'taxPct', label:'Sales tax %', type:'number', default:0},
        {key:'fees', label:'Title / registration fees', type:'number', default:0},
        {key:'rate', label:'Rate % p.a.', type:'number', default:''},
        {key:'years', label:'Tenure (years)', type:'number', default:''},
      ], compute:v=>{ const price=Math.max(0,num(v.carPrice)), tax=price*Math.max(0,num(v.taxPct))/100, fees=Math.max(0,num(v.fees));
        const onRoad=price+tax+fees, down=Math.min(onRoad,Math.max(0,num(v.downPayment))), tradeIn=Math.min(onRoad-down,Math.max(0,num(v.tradeIn)));
        const P=Math.max(0,onRoad-down-tradeIn), months=Math.max(0,Math.round(num(v.years)*12)), rate=Math.max(0,num(v.rate));
        const emi=emiCalc(P,rate,months), total=emi*months, interest=Math.max(0,total-P);
        return [ {label:'Car price', value:fmtCur(price)}, {label:'Sales tax', value:fmtCur(tax)}, {label:'Title / registration fees', value:fmtCur(fees)},
          {label:'Down payment', value:fmtCur(down)}, {label:'Trade-in credit', value:fmtCur(tradeIn)}, {label:'Amount financed', value:fmtCur(P)},
          {label:'Monthly EMI', value:fmtCur(emi), emphasis:true}, {label:'Total interest', value:fmtCur(interest)},
          {label:'Total of loan payments', value:fmtCur(total)}, {label:'Total cost incl. down payment & trade-in', value:fmtCur(total+down+tradeIn)} ];
      }},
    { id:'loaneligibility', name:'Loan Eligibility', fields:[
        {key:'income', label:'Monthly income', type:'number', default:''},
        {key:'existingEmi', label:'Existing EMI', type:'number', default:0},
        {key:'rate', label:'Rate % p.a.', type:'number', default:''},
        {key:'years', label:'Tenure (years)', type:'number', default:''},
      ], compute:v=>{ const maxEmi=Math.max(0,num(v.income)*0.5-num(v.existingEmi)), months=Math.round(num(v.years)*12);
        const r=num(v.rate)/12/100, pw=Math.pow(1+r,months);
        const eligible = r===0 ? maxEmi*months : maxEmi*(pw-1)/(r*pw);
        return [ {label:'Max affordable EMI', value:fmtCur(maxEmi)}, {label:'Estimated eligibility', value:fmtCur(eligible), emphasis:true} ];
      }},
    { id:'loantenure', name:'Loan Tenure', fields:[
        {key:'principal', label:'Loan amount', type:'number', default:''},
        {key:'emi', label:'EMI', type:'number', default:''},
        {key:'rate', label:'Rate % p.a.', type:'number', default:''},
      ], compute:v=>{ const months=tenureFromEmi(num(v.principal),num(v.rate),num(v.emi));
        return [{label:'Required tenure', value: isFinite(months)? `${Math.ceil(months)} months (~${(months/12).toFixed(1)} yrs)` : 'EMI too low', emphasis:true}];
      }},
    { id:'interestrate', name:'Interest Rate', fields:[
        {key:'principal', label:'Loan amount', type:'number', default:''},
        {key:'emi', label:'EMI', type:'number', default:''},
        {key:'months', label:'Tenure (months)', type:'number', default:''},
      ], compute:v=>{ const rate=rateFromEmi(num(v.principal),num(v.emi),num(v.months));
        return [{label:'Estimated interest rate', value:fmtPct(rate), emphasis:true}];
      }},
    { id:'loanprepayment', name:'Loan Prepayment', fields:[
        {key:'outstanding', label:'Outstanding principal', type:'number', default:''},
        {key:'currentEmi', label:'Current EMI', type:'number', default:''},
        {key:'prepayment', label:'Prepayment amount', type:'number', default:''},
        {key:'rate', label:'Rate % p.a.', type:'number', default:''},
      ], compute:v=>{ const outstanding=num(v.outstanding), emi=num(v.currentEmi), rate=num(v.rate);
        const newP=Math.max(0,outstanding-num(v.prepayment));
        const oldM=tenureFromEmi(outstanding,rate,emi), newM=tenureFromEmi(newP,rate,emi);
        const oldInt=oldM*emi-outstanding, newInt=newM*emi-newP;
        return [ {label:'New tenure', value: isFinite(newM)?`${Math.ceil(newM)} months`:'—', emphasis:true},
          {label:'Tenure reduced by', value: (isFinite(oldM)&&isFinite(newM))?`${Math.max(0,Math.ceil(oldM-newM))} months`:'—'},
          {label:'Approx. interest saved', value:(isFinite(oldInt)&&isFinite(newInt))?fmtCur(oldInt-newInt):'—'} ];
      }},
    { id:'amortization', name:'Amortization', fields:[
        {key:'principal', label:'Loan amount', type:'number', default:''},
        {key:'rate', label:'Rate % p.a.', type:'number', default:''},
        {key:'years', label:'Tenure (years)', type:'number', default:''},
      ], compute:v=>{ const P=num(v.principal), months=Math.round(num(v.years)*12);
        if(months>1200) return [{label:'Tenure',value:'Enter a tenure of 100 years or less.'}];
        return [ {label:'Monthly EMI', value:fmtCur(emiCalc(P,num(v.rate),months)), emphasis:true},
          {type:'table', title:'Yearly breakup', rows:amortSummary(P,num(v.rate),months)} ];
      }},
  ]},
  { name:'Investment', items:[
    { id:'sip', name:'SIP', fields:[
        {key:'monthly', label:'Monthly investment', type:'number', default:''},
        {key:'years', label:'Duration (years)', type:'number', default:''},
        {key:'returnRate', label:'Expected return % p.a.', type:'number', default:''},
      ], compute:v=>{ const M=num(v.monthly), months=Math.round(num(v.years)*12), i=num(v.returnRate)/12/100;
        const invested=M*months, fv = i===0? M*months : M*((Math.pow(1+i,months)-1)/i)*(1+i);
        return [ {label:'Invested amount', value:fmtCur(invested)}, {label:'Estimated return', value:fmtCur(fv-invested)}, {label:'Final value', value:fmtCur(fv), emphasis:true} ];
      }},
    { id:'lumpsum', name:'Lumpsum', fields:[
        {key:'investment', label:'Investment', type:'number', default:''},
        {key:'years', label:'Duration (years)', type:'number', default:''},
        {key:'returnRate', label:'Return % p.a.', type:'number', default:''},
      ], compute:v=>{ const P=num(v.investment), fv=P*Math.pow(1+num(v.returnRate)/100,num(v.years));
        return [ {label:'Final value', value:fmtCur(fv), emphasis:true}, {label:'Profit', value:fmtCur(fv-P)} ];
      }},
    { id:'cagr', name:'CAGR', fields:[
        {key:'initial', label:'Initial value', type:'number', default:''},
        {key:'final', label:'Final value', type:'number', default:''},
        {key:'years', label:'Period (years)', type:'number', default:''},
      ], compute:v=>{ const i=num(v.initial), f=num(v.final), y=num(v.years);
        const cagr = (i>0 && y>0) ? (Math.pow(f/i,1/y)-1)*100 : NaN;
        return [{label:'CAGR', value:fmtPct(cagr), emphasis:true}];
      }},
    { id:'xirr', name:'XIRR', fields:[
        {key:'amt1', label:'Investment amount', type:'number', default:''},
        {key:'date1', label:'Investment date', type:'date', default:''},
        {key:'amt2', label:'Final value', type:'number', default:''},
        {key:'date2', label:'Final date', type:'date', default:''},
      ], compute:v=>{ if(!v.date1||!v.date2) return [{label:'XIRR', value:'—', emphasis:true}];
        if(num(v.amt1)<=0||num(v.amt2)<=0||new Date(v.date2)<=new Date(v.date1)) return [{label:'XIRR', value:'Use positive amounts and set the final date after investment', emphasis:true}];
        const flows=[{amount:-num(v.amt1), date:new Date(v.date1)}, {amount:num(v.amt2), date:new Date(v.date2)}];
        const result=xirrCalc(flows);
        return [{label:'XIRR', value:Number.isFinite(result)?fmtPct(result):'Enter opposite-sign amounts and a later date', emphasis:true}];
      }},
    { id:'roi', name:'ROI', fields:[
        {key:'cost', label:'Investment cost', type:'number', default:''},
        {key:'currentValue', label:'Current value', type:'number', default:''},
      ], compute:v=>{ const c=num(v.cost), cv=num(v.currentValue), p=cv-c;
        return [ {label:'Profit / Loss', value:fmtCur(p)}, {label:'ROI', value: c? fmtPct(p/c*100):'—', emphasis:true} ];
      }},
    { id:'compoundinterest', name:'Compound Interest', fields:[
        {key:'principal', label:'Principal', type:'number', default:''},
        {key:'rate', label:'Rate % p.a.', type:'number', default:''},
        {key:'years', label:'Time (years)', type:'number', default:''},
        {key:'freq', label:'Compounding', type:'select', options:[{value:1,label:'Yearly'},{value:2,label:'Half-yearly'},{value:4,label:'Quarterly'},{value:12,label:'Monthly'}], default:1},
      ], compute:v=>{ const P=num(v.principal), r=num(v.rate), t=num(v.years), n=num(v.freq)||1;
        const A=P*Math.pow(1+r/100/n, n*t);
        return [ {label:'Interest', value:fmtCur(A-P)}, {label:'Final amount', value:fmtCur(A), emphasis:true} ];
      }},
    { id:'simpleinterest', name:'Simple Interest', fields:[
        {key:'principal', label:'Principal', type:'number', default:''},
        {key:'rate', label:'Rate % p.a.', type:'number', default:''},
        {key:'years', label:'Time (years)', type:'number', default:''},
      ], compute:v=>{ const P=num(v.principal), si=P*num(v.rate)*num(v.years)/100;
        return [ {label:'Interest', value:fmtCur(si)}, {label:'Final amount', value:fmtCur(P+si), emphasis:true} ];
      }},
  ]},
  { name:'Tax', items:[
    { id:'incometax', name:'Income Tax', fields:[
        {key:'income', label:'Taxable annual income (after eligible deductions)', type:'number', default:''},
        {key:'regime', label:'Regime', type:'pills', options:['New','Old'], default:'New'},
        {key:'residency', label:'Residential status', type:'pills', options:['Resident','Non-resident'], default:'Resident'},
      ], compute:v=>{ const inc=Math.max(0,num(v.income)); let tax=0; const slabs=v.regime==='New'
          ? [[400000,0],[800000,.05],[1200000,.1],[1600000,.15],[2000000,.2],[2400000,.25],[Infinity,.3]]
          : [[250000,0],[500000,.05],[1000000,.2],[Infinity,.3]];
        let prev=0; for(const [limit,rate] of slabs){ if(inc>prev){ tax += (Math.min(inc,limit)-prev)*rate; prev=limit; } }
        const rebateLimit=v.regime==='New'?1200000:500000, rebateCap=v.regime==='New'?60000:12500;
        const rebate=v.residency==='Resident'&&inc<=rebateLimit?Math.min(tax,rebateCap):0;
        tax=Math.max(0,tax-rebate);
        if(v.residency==='Resident'&&inc>rebateLimit) tax=Math.min(tax,inc-rebateLimit);
        const cess=tax*0.04;
        return [ {label:'Tax after rebate / threshold relief', value:fmtCur(tax)}, {label:'Health & edu. cess (4%)', value:fmtCur(cess)}, {label:'Estimated total', value:fmtCur(tax+cess), emphasis:true}, {label:'Assessment year', value:`AY 2026–27 · ${v.residency.toLowerCase()} individual under 60 · surcharge excluded`} ];
      }},
    { id:'gst', name:'GST', fields:[
        {key:'amount', label:'Amount', type:'number', default:''},
        {key:'rate', label:'GST rate', type:'select', options:[5,12,18,28], default:18},
        {key:'type', label:'Type', type:'pills', options:['Exclusive','Inclusive'], default:'Exclusive'},
      ], compute:v=>{ const amt=num(v.amount), rate=num(v.rate); let base,gstAmt,total;
        if(v.type==='Inclusive'){ total=amt; base=amt/(1+rate/100); gstAmt=amt-base; } else { base=amt; gstAmt=amt*rate/100; total=amt+gstAmt; }
        return [ {label:'CGST', value:fmtCur(gstAmt/2)}, {label:'SGST', value:fmtCur(gstAmt/2)}, {label:'Total GST', value:fmtCur(gstAmt)}, {label:'Total amount', value:fmtCur(total), emphasis:true} ];
      }},
    { id:'capitalgains', name:'Capital Gains', fields:[
        {key:'purchase', label:'Purchase price', type:'number', default:''},
        {key:'sale', label:'Sale price', type:'number', default:''},
        {key:'holding', label:'Holding period', type:'pills', options:['Short-term','Long-term'], default:'Short-term'},
      ], compute:v=>{ const gain=num(v.sale)-num(v.purchase), rate=v.holding==='Long-term'?12.5:20;
        return [ {label:'Gain', value:fmtCur(gain)}, {label:'Applicable tax (approx.)', value: gain>0?fmtCur(gain*rate/100):fmtCur(0), emphasis:true} ];
      }},
    { id:'hra', name:'HRA', fields:[
        {key:'basic', label:'Basic salary (monthly)', type:'number', default:''},
        {key:'hra', label:'HRA received (monthly)', type:'number', default:''},
        {key:'rent', label:'Rent paid (monthly)', type:'number', default:''},
        {key:'city', label:'City type', type:'pills', options:['Metro','Non-metro'], default:'Metro'},
      ], compute:v=>{ const basic=num(v.basic), hra=num(v.hra), rent=num(v.rent), pct=v.city==='Metro'?0.5:0.4;
        const exemption=Math.max(0,Math.min(hra, rent-0.1*basic, basic*pct));
        return [ {label:'HRA exemption', value:fmtCur(exemption), emphasis:true}, {label:'Taxable HRA', value:fmtCur(Math.max(0,hra-exemption))} ];
      }},
    { id:'tds', name:'TDS', fields:[
        {key:'amount', label:'Payment amount', type:'number', default:''},
        {key:'rate', label:'TDS rate %', type:'number', default:10},
      ], compute:v=>{ const amt=num(v.amount), tds=amt*num(v.rate)/100;
        return [ {label:'TDS amount', value:fmtCur(tds), emphasis:true}, {label:'Net amount', value:fmtCur(amt-tds)} ];
      }},
    { id:'taxsavings', name:'Tax Savings', fields:[
        {key:'deductions', label:'Investments / deductions', type:'number', default:''},
        {key:'slab', label:'Tax slab', type:'select', options:[5,20,30], default:30},
      ], compute:v=>{ const saving=num(v.deductions)*num(v.slab)/100;
        return [{label:'Estimated tax saving', value:fmtCur(saving), emphasis:true}];
      }},
  ]},
  { name:'Retirement', items:[
    { id:'retirementcorpus', name:'Retirement Corpus', fields:[
        {key:'currentAge', label:'Current age', type:'number', default:''},
        {key:'retireAge', label:'Retirement age', type:'number', default:60},
        {key:'monthlyExpense', label:'Current monthly expenses', type:'number', default:''},
        {key:'inflation', label:'Inflation % p.a.', type:'number', default:6},
        {key:'returnRate', label:'Post-retirement return % p.a.', type:'number', default:8},
      ], compute:v=>{ const years=Math.max(0,num(v.retireAge)-num(v.currentAge));
        const futureMonthly=num(v.monthlyExpense)*Math.pow(1+num(v.inflation)/100, years);
        const annual=futureMonthly*12, real=(num(v.returnRate)-num(v.inflation))/100;
        const corpus = real>0.001 ? annual/real : annual*25;
        return [ {label:'Future monthly expense', value:fmtCur(futureMonthly)}, {label:'Required corpus', value:fmtCur(corpus), emphasis:true} ];
      }},
    { id:'retirementsip', name:'Retirement SIP', fields:[
        {key:'target', label:'Target corpus', type:'number', default:''},
        {key:'current', label:'Current savings', type:'number', default:0},
        {key:'years', label:'Years to retirement', type:'number', default:''},
        {key:'returnRate', label:'Expected return % p.a.', type:'number', default:''},
      ], compute:v=>{ const months=Math.round(num(v.years)*12), i=num(v.returnRate)/12/100;
        const grown=num(v.current)*Math.pow(1+num(v.returnRate)/100,num(v.years));
        const need=Math.max(0,num(v.target)-grown);
        const req = i===0 ? need/months : need/(((Math.pow(1+i,months)-1)/i)*(1+i));
        return [{label:'Required monthly SIP', value:fmtCur(req), emphasis:true}];
      }},
    { id:'pension', name:'Pension', fields:[
        {key:'corpus', label:'Retirement corpus', type:'number', default:''},
        {key:'withdrawalRate', label:'Annual withdrawal rate %', type:'number', default:4},
      ], compute:v=>{ const annual=num(v.corpus)*num(v.withdrawalRate)/100;
        return [ {label:'Annual pension', value:fmtCur(annual)}, {label:'Monthly pension', value:fmtCur(annual/12), emphasis:true} ];
      }},
    { id:'annuity', name:'Annuity', fields:[
        {key:'investment', label:'Investment', type:'number', default:''},
        {key:'rate', label:'Rate % p.a.', type:'number', default:''},
        {key:'years', label:'Payout period (years)', type:'number', default:''},
      ], compute:v=>{ const i=num(v.rate)/100, n=num(v.years), P=num(v.investment);
        const payment = i===0 ? P/n : P*i/(1-Math.pow(1+i,-n));
        return [{label:'Annual payout', value:fmtCur(payment), emphasis:true}];
      }},
    { id:'retirementinflation', name:'Retirement Inflation', fields:[
        {key:'currentExpense', label:'Current annual expense', type:'number', default:''},
        {key:'inflation', label:'Inflation % p.a.', type:'number', default:6},
        {key:'years', label:'Years', type:'number', default:''},
      ], compute:v=>{ const fut=num(v.currentExpense)*Math.pow(1+num(v.inflation)/100,num(v.years));
        return [{label:'Future expense', value:fmtCur(fut), emphasis:true}];
      }},
  ]},
  { name:'Savings', items:[
    { id:'savingsgoal', name:'Savings Goal', fields:[
        {key:'goal', label:'Goal amount', type:'number', default:''},
        {key:'current', label:'Current savings', type:'number', default:0},
        {key:'years', label:'Time (years)', type:'number', default:''},
        {key:'returnRate', label:'Expected return % p.a.', type:'number', default:0},
      ], compute:v=>{ const months=Math.round(num(v.years)*12), i=num(v.returnRate)/12/100;
        const grown=num(v.current)*Math.pow(1+num(v.returnRate)/100,num(v.years));
        const need=Math.max(0,num(v.goal)-grown);
        const req = i===0 ? need/months : need/(((Math.pow(1+i,months)-1)/i)*(1+i));
        return [{label:'Required monthly saving', value:fmtCur(req), emphasis:true}];
      }},
    { id:'fd', name:'FD', fields:[
        {key:'principal', label:'Principal', type:'number', default:''},
        {key:'rate', label:'Interest rate % p.a.', type:'number', default:''},
        {key:'years', label:'Tenure (years)', type:'number', default:''},
        {key:'freq', label:'Compounding', type:'select', options:[{value:1,label:'Yearly'},{value:4,label:'Quarterly'},{value:12,label:'Monthly'}], default:4},
      ], compute:v=>{ const P=num(v.principal), n=num(v.freq)||1, maturity=P*Math.pow(1+num(v.rate)/100/n, n*num(v.years));
        return [ {label:'Maturity amount', value:fmtCur(maturity), emphasis:true}, {label:'Interest earned', value:fmtCur(maturity-P)} ];
      }},
    { id:'rd', name:'RD', fields:[
        {key:'monthly', label:'Monthly deposit', type:'number', default:''},
        {key:'rate', label:'Interest rate % p.a.', type:'number', default:''},
        {key:'years', label:'Tenure (years)', type:'number', default:''},
      ], compute:v=>{ const M=num(v.monthly), months=Math.round(num(v.years)*12), i=num(v.rate)/12/100;
        const maturity = i===0 ? M*months : M*((Math.pow(1+i,months)-1)/i)*(1+i);
        const invested=M*months;
        return [ {label:'Total deposited', value:fmtCur(invested)}, {label:'Maturity value', value:fmtCur(maturity), emphasis:true} ];
      }},
    { id:'emergencyfund', name:'Emergency Fund', fields:[
        {key:'monthlyExpenses', label:'Monthly expenses', type:'number', default:''},
        {key:'targetMonths', label:'Target months', type:'number', default:6},
      ], compute:v=>[{label:'Required fund', value:fmtCur(num(v.monthlyExpenses)*num(v.targetMonths)), emphasis:true}] },
    { id:'inflation', name:'Inflation', fields:[
        {key:'currentCost', label:'Current cost', type:'number', default:''},
        {key:'rate', label:'Inflation rate % p.a.', type:'number', default:6},
        {key:'years', label:'Years', type:'number', default:''},
      ], compute:v=>[{label:'Future cost', value:fmtCur(num(v.currentCost)*Math.pow(1+num(v.rate)/100,num(v.years))), emphasis:true}] },
  ]},
  { name:'Debt & Credit', items:[
    { id:'creditcardinterest', name:'Credit Card Interest', fields:[
        {key:'outstanding', label:'Outstanding amount', type:'number', default:''},
        {key:'monthlyRate', label:'Monthly interest rate %', type:'number', default:3.5},
      ], compute:v=>[{label:'Interest cost', value:fmtCur(num(v.outstanding)*num(v.monthlyRate)/100), emphasis:true}] },
    { id:'minimumpayment', name:'Minimum Payment', fields:[
        {key:'balance', label:'Outstanding balance', type:'number', default:''},
        {key:'minPct', label:'Minimum %', type:'number', default:5},
      ], compute:v=>[{label:'Minimum payment', value:fmtCur(num(v.balance)*num(v.minPct)/100), emphasis:true}] },
    { id:'debtpayoff', name:'Debt Payoff', fields:[
        {key:'balance', label:'Balance', type:'number', default:''},
        {key:'rate', label:'Interest rate % p.a.', type:'number', default:''},
        {key:'payment', label:'Monthly payment', type:'number', default:''},
      ], compute:v=>{ const P=num(v.balance), r=num(v.rate)/12/100, pay=num(v.payment);
        if(pay<=P*r) return [{label:'Payoff time', value:'Payment too low to cover interest', emphasis:true}];
        const months = r===0 ? P/pay : -Math.log(1-(P*r)/pay)/Math.log(1+r);
        return [{label:'Months to pay off', value:`${Math.ceil(months)} months`, emphasis:true}];
      }},
    { id:'debttoincome', name:'Debt-to-Income', fields:[
        {key:'monthlyDebt', label:'Monthly debt payments', type:'number', default:''},
        {key:'monthlyIncome', label:'Monthly income', type:'number', default:''},
      ], compute:v=>{ const inc=num(v.monthlyIncome); return [{label:'DTI ratio', value: inc? fmtPct(num(v.monthlyDebt)/inc*100):'—', emphasis:true}]; }},
    { id:'debtconsolidation', name:'Debt Consolidation', fields:[
        {key:'totalDebt', label:'Total existing debt', type:'number', default:''},
        {key:'newRate', label:'New rate % p.a.', type:'number', default:''},
        {key:'newMonths', label:'New tenure (months)', type:'number', default:''},
      ], compute:v=>[{label:'New consolidated EMI', value:fmtCur(emiCalc(num(v.totalDebt),num(v.newRate),num(v.newMonths))), emphasis:true}] },
  ]},
  { name:'Property', items:[
    { id:'rentvsbuy', name:'Rent vs Buy', fields:[
        {key:'price', label:'Property price', type:'number', default:''},
        {key:'rent', label:'Monthly rent', type:'number', default:''},
        {key:'downPct', label:'Down payment %', type:'number', default:20},
        {key:'rate', label:'Loan rate % p.a.', type:'number', default:''},
        {key:'years', label:'Horizon (years)', type:'number', default:''},
        {key:'investReturn', label:'Alt. investment return % p.a.', type:'number', default:10},
      ], compute:v=>{ const price=num(v.price), down=price*num(v.downPct)/100, loan=price-down;
        const emi=emiCalc(loan,num(v.rate),num(v.years)*12);
        const buyCost = emi*num(v.years)*12;
        const rentCost = num(v.rent)*num(v.years)*12;
        const opportunity = down*Math.pow(1+num(v.investReturn)/100,num(v.years)) - down;
        const netBuy = buyCost + opportunity;
        return [ {label:'Total EMI paid', value:fmtCur(buyCost)}, {label:'Total rent paid', value:fmtCur(rentCost)},
          {label:'Cheaper option', value: netBuy<rentCost?'Buying':'Renting', emphasis:true} ];
      }},
    { id:'downpayment', name:'Down Payment', fields:[
        {key:'price', label:'Property price', type:'number', default:''},
        {key:'pct', label:'Down payment %', type:'number', default:20},
      ], compute:v=>{ const price=num(v.price), amt=price*num(v.pct)/100;
        return [ {label:'Down payment', value:fmtCur(amt), emphasis:true}, {label:'Loan needed', value:fmtCur(price-amt)} ];
      }},
    { id:'propertyappreciation', name:'Property Appreciation', fields:[
        {key:'purchase', label:'Purchase price', type:'number', default:''},
        {key:'current', label:'Current value', type:'number', default:''},
        {key:'years', label:'Period (years)', type:'number', default:''},
      ], compute:v=>{ const p=num(v.purchase), c=num(v.current), y=num(v.years);
        return [ {label:'Total appreciation', value: p? fmtPct((c-p)/p*100):'—'}, {label:'CAGR', value:(p>0&&y>0)?fmtPct((Math.pow(c/p,1/y)-1)*100):'—', emphasis:true} ];
      }},
    { id:'stampduty', name:'Stamp Duty', fields:[
        {key:'value', label:'Property value', type:'number', default:''},
        {key:'rate', label:'Stamp duty %', type:'number', default:5},
      ], compute:v=>[ {label:'Estimated stamp duty', value:fmtCur(num(v.value)*num(v.rate)/100), emphasis:true}, {label:'Note', value:'Rate varies by state — adjust %'} ]},
    { id:'homeloancost', name:'Home Loan Cost', fields:[
        {key:'propertyPrice', label:'Property price', type:'number', default:''},
        {key:'loanAmount', label:'Loan amount', type:'number', default:''},
        {key:'rate', label:'Rate % p.a.', type:'number', default:''},
        {key:'years', label:'Tenure (years)', type:'number', default:''},
      ], compute:v=>{ const L=num(v.loanAmount), emi=emiCalc(L,num(v.rate),num(v.years)*12), total=emi*num(v.years)*12;
        return [ {label:'EMI', value:fmtCur(emi)}, {label:'Total interest', value:fmtCur(total-L)}, {label:'Total cost of ownership', value:fmtCur(num(v.propertyPrice)-L+total), emphasis:true} ];
      }},
  ]},
  { name:'Business', items:[
    { id:'profitmargin', name:'Profit Margin', fields:[
        {key:'revenue', label:'Revenue', type:'number', default:''},
        {key:'cost', label:'Cost', type:'number', default:''},
      ], compute:v=>{ const r=num(v.revenue), p=r-num(v.cost); return [ {label:'Profit', value:fmtCur(p)}, {label:'Margin', value: r? fmtPct(p/r*100):'—', emphasis:true} ]; }},
    { id:'grossmargin', name:'Gross Margin', fields:[
        {key:'revenue', label:'Revenue', type:'number', default:''},
        {key:'cogs', label:'COGS', type:'number', default:''},
      ], compute:v=>{ const r=num(v.revenue), gp=r-num(v.cogs); return [ {label:'Gross profit', value:fmtCur(gp)}, {label:'Gross margin', value: r? fmtPct(gp/r*100):'—', emphasis:true} ]; }},
    { id:'netmargin', name:'Net Margin', fields:[
        {key:'revenue', label:'Revenue', type:'number', default:''},
        {key:'expenses', label:'Expenses', type:'number', default:''},
      ], compute:v=>{ const r=num(v.revenue), np=r-num(v.expenses); return [ {label:'Net profit', value:fmtCur(np)}, {label:'Net margin', value: r? fmtPct(np/r*100):'—', emphasis:true} ]; }},
    { id:'markup', name:'Markup', fields:[
        {key:'cost', label:'Cost', type:'number', default:''},
        {key:'markupPct', label:'Markup %', type:'number', default:''},
      ], compute:v=>{ const c=num(v.cost), sp=c*(1+num(v.markupPct)/100); return [ {label:'Selling price', value:fmtCur(sp), emphasis:true}, {label:'Profit', value:fmtCur(sp-c)} ]; }},
    { id:'breakeven', name:'Break-even', fields:[
        {key:'fixedCost', label:'Fixed cost', type:'number', default:''},
        {key:'price', label:'Selling price / unit', type:'number', default:''},
        {key:'variableCost', label:'Variable cost / unit', type:'number', default:''},
      ], compute:v=>{ const d=num(v.price)-num(v.variableCost); return [{label:'Break-even units', value: d>0? fmtNum(num(v.fixedCost)/d):'—', emphasis:true}]; }},
    { id:'cashflow', name:'Cash Flow', fields:[
        {key:'income', label:'Income', type:'number', default:''},
        {key:'expenses', label:'Expenses', type:'number', default:''},
      ], compute:v=>[{label:'Net cash flow', value:fmtCur(num(v.income)-num(v.expenses)), emphasis:true}] },
    { id:'businessroi', name:'Business ROI', fields:[
        {key:'investment', label:'Investment', type:'number', default:''},
        {key:'profit', label:'Profit', type:'number', default:''},
      ], compute:v=>{ const inv=num(v.investment); return [{label:'ROI', value: inv? fmtPct(num(v.profit)/inv*100):'—', emphasis:true}]; }},
  ]},
  { name:'Market & Stock', items:[
    { id:'stockaverageprice', name:'Stock Average Price', fields:[
        {key:'existingShares', label:'Existing shares', type:'number', default:''},
        {key:'existingPrice', label:'Existing avg price', type:'number', default:''},
        {key:'newShares', label:'New shares', type:'number', default:''},
        {key:'newPrice', label:'New price', type:'number', default:''},
      ], compute:v=>{ const es=num(v.existingShares), ep=num(v.existingPrice), ns=num(v.newShares), np=num(v.newPrice);
        const totalShares=es+ns; const avg = totalShares? (es*ep+ns*np)/totalShares : 0;
        return [{label:'New average price', value:fmtCur(avg), emphasis:true}];
      }},
    { id:'stockreturn', name:'Stock Return', fields:[
        {key:'buy', label:'Buy price', type:'number', default:''},
        {key:'sell', label:'Sell price', type:'number', default:''},
        {key:'qty', label:'Quantity', type:'number', default:1},
      ], compute:v=>{ const buy=num(v.buy), sell=num(v.sell), qty=num(v.qty);
        return [ {label:'Profit / Loss', value:fmtCur((sell-buy)*qty)}, {label:'Return', value: buy? fmtPct((sell-buy)/buy*100):'—', emphasis:true} ];
      }},
    { id:'dividendyield', name:'Dividend Yield', fields:[
        {key:'dividend', label:'Dividend / share', type:'number', default:''},
        {key:'price', label:'Stock price', type:'number', default:''},
      ], compute:v=>{ const price=num(v.price); return [{label:'Dividend yield', value: price? fmtPct(num(v.dividend)/price*100):'—', emphasis:true}]; }},
    { id:'portfolioreturn', name:'Portfolio Return', fields:[
        {key:'invested', label:'Invested amount', type:'number', default:''},
        {key:'current', label:'Current value', type:'number', default:''},
      ], compute:v=>{ const inv=num(v.invested), cur=num(v.current), gain=cur-inv;
        return [ {label:'Gain / Loss', value:fmtCur(gain)}, {label:'Return', value: inv? fmtPct(gain/inv*100):'—', emphasis:true} ];
      }},
  ]},
  { name:'Currency', items:[
    { id:'currency', name:'Currency Converter', fields:[
        {key:'from', label:'From currency', type:'select', options:currencyOptions, default:'USD'},
        {key:'to', label:'To currency', type:'select', options:currencyOptions, default:'INR'},
        {key:'value', label:'Amount', type:'number', default:1},
      ], compute:v=>[ {label:'Currency conversion', value:'Uses the latest available daily reference rate', emphasis:true} ] },
    { id:'forexgainloss', name:'Forex Gain/Loss', fields:[
        {key:'buyRate', label:'Buy rate', type:'number', default:''},
        {key:'sellRate', label:'Sell rate', type:'number', default:''},
        {key:'amount', label:'Amount', type:'number', default:''},
      ], compute:v=>[{label:'Gain / Loss', value:fmtCur((num(v.sellRate)-num(v.buyRate))*num(v.amount)), emphasis:true}] },
  ]},
  { name:'Basic Math', items:[
    { id:'fraction', name:'Fraction Calculator', fields:[
        {key:'a1', label:'Numerator 1', type:'number', default:''},
        {key:'b1', label:'Denominator 1', type:'number', default:1},
        {key:'op', label:'Operation', type:'pills', options:['+','−','×','÷'], default:'+'},
        {key:'a2', label:'Numerator 2', type:'number', default:''},
        {key:'b2', label:'Denominator 2', type:'number', default:1},
      ], compute:v=>{ const a1=num(v.a1), b1=num(v.b1)||1, a2=num(v.a2), b2=num(v.b2)||1;
        let n,d;
        if(v.op==='+'){ n=a1*b2+a2*b1; d=b1*b2; } else if(v.op==='−'){ n=a1*b2-a2*b1; d=b1*b2; }
        else if(v.op==='×'){ n=a1*a2; d=b1*b2; } else { n=a1*b2; d=b1*a2; }
        const g = (function gcd(x,y){ x=Math.abs(x); y=Math.abs(y); while(y){ [x,y]=[y,x%y]; } return x||1; })(n,d);
        return [ {label:'Result', value:`${n/g}/${d/g}`, emphasis:true}, {label:'Decimal', value:fmtNum(n/d)} ];
      }},
    { id:'ratio', name:'Ratio & Proportion', fields:[
        {key:'a', label:'A', type:'number', default:''},
        {key:'b', label:'B (A : B)', type:'number', default:''},
        {key:'c', label:'C (find x in A:B = C:x)', type:'number', default:''},
      ], compute:v=>{ const a=num(v.a), b=num(v.b), c=num(v.c);
        const g = (function gcd(x,y){ x=Math.abs(x); y=Math.abs(y); while(y){ [x,y]=[y,x%y]; } return x||1; })(a,b);
        return [ {label:'Simplified ratio', value:`${a/g} : ${b/g}`}, {label:'Missing value (x)', value: a? fmtNum((b*c)/a):'—', emphasis:true} ];
      }},
    { id:'average', name:'Average Calculator', fields:[
        {key:'v1', label:'Value 1', type:'number', default:''}, {key:'v2', label:'Value 2', type:'number', default:''},
        {key:'v3', label:'Value 3', type:'number', default:''}, {key:'v4', label:'Value 4', type:'number', default:''},
        {key:'v5', label:'Value 5', type:'number', default:''},
      ], compute:v=>{ const vals=[v.v1,v.v2,v.v3,v.v4,v.v5].filter(x=>x!==''&&x!==undefined).map(Number);
        if(!vals.length) return [{label:'Mean', value:'—', emphasis:true}];
        const mean=vals.reduce((a,b)=>a+b,0)/vals.length;
        const sorted=[...vals].sort((a,b)=>a-b), mid=Math.floor(sorted.length/2);
        const median = sorted.length%2 ? sorted[mid] : (sorted[mid-1]+sorted[mid])/2;
        return [ {label:'Mean', value:fmtNum(mean), emphasis:true}, {label:'Median', value:fmtNum(median)}, {label:'Count', value:String(vals.length)} ];
      }},
    { id:'rounding', name:'Rounding Calculator', fields:[
        {key:'value', label:'Value', type:'number', default:''},
        {key:'decimals', label:'Decimal places', type:'select', options:[0,1,2,3,4], default:2},
      ], compute:v=>{ const d=num(v.decimals), f=Math.pow(10,d);
        return [{label:'Rounded value', value: fmtNum(Math.round(num(v.value)*f)/f), emphasis:true}];
      }},
    { id:'powerroot', name:'Power / Root Calculator', fields:[
        {key:'base', label:'Base', type:'number', default:''},
        {key:'exp', label:'Exponent / Root degree', type:'number', default:2},
        {key:'type', label:'Type', type:'pills', options:['Power','Root'], default:'Power'},
      ], compute:v=>{ const b=num(v.base), e=num(v.exp)||1;
        const result = v.type==='Power' ? Math.pow(b,e) : Math.pow(b,1/e);
        return [{label:'Result', value:fmtNum(result), emphasis:true}];
      }},
    { id:'lcmhcf', name:'LCM / HCF Calculator', fields:[
        {key:'a', label:'Number A', type:'number', default:''},
        {key:'b', label:'Number B', type:'number', default:''},
      ], compute:v=>{ const a=Math.round(num(v.a)), b=Math.round(num(v.b));
        const hcf = (function gcd(x,y){ x=Math.abs(x); y=Math.abs(y); while(y){ [x,y]=[y,x%y]; } return x||1; })(a,b);
        const lcm = a && b ? Math.abs(a*b)/hcf : 0;
        return [ {label:'HCF (GCD)', value:String(hcf)}, {label:'LCM', value:String(lcm), emphasis:true} ];
      }},
    { id:'npr_ncr', name:'Permutation / Combination', fields:[
        {key:'n', label:'n', type:'number', default:''},
        {key:'r', label:'r', type:'number', default:''},
        {key:'type', label:'Type', type:'pills', options:['nPr','nCr'], default:'nCr'},
      ], compute:v=>{ const n=Math.round(num(v.n)), r=Math.round(num(v.r));
        const fact=x=>{ if(x<0 || Number.isNaN(x)) return NaN; if(x>170) return Infinity; let f=1; for(let i=2;i<=x;i++) f*=i; return f; };
        if(r>n || r<0) return [{label:'Result', value:'r must be ≤ n', emphasis:true}];
        const result = v.type==='nPr' ? fact(n)/fact(n-r) : fact(n)/(fact(r)*fact(n-r));
        return [{label:v.type, value:fmtNum(result), emphasis:true}];
      }},
  ]},
  { name:'Algebra & Geometry', items:[
    { id:'linearequation', name:'Linear Equation Solver', fields:[
        {key:'a', label:'a (in ax + b = c)', type:'number', default:''},
        {key:'b', label:'b', type:'number', default:''},
        {key:'c', label:'c', type:'number', default:''},
      ], compute:v=>{ const a=num(v.a); return [{label:'x =', value: a? fmtNum((num(v.c)-num(v.b))/a):'a cannot be 0', emphasis:true}]; }},
    { id:'quadraticequation', name:'Quadratic Equation Solver', fields:[
        {key:'a', label:'a (in ax² + bx + c = 0)', type:'number', default:''},
        {key:'b', label:'b', type:'number', default:''},
        {key:'c', label:'c', type:'number', default:''},
      ], compute:v=>{ const a=num(v.a), b=num(v.b), c=num(v.c);
        if(!a) return [{label:'Roots', value:'a cannot be 0', emphasis:true}];
        const D=b*b-4*a*c;
        if(D>=0){ const r1=(-b+Math.sqrt(D))/(2*a), r2=(-b-Math.sqrt(D))/(2*a);
          return [ {label:'Discriminant', value:fmtNum(D)}, {label:'x1', value:fmtNum(r1), emphasis:true}, {label:'x2', value:fmtNum(r2), emphasis:true} ]; }
        const re=(-b/(2*a)), im=Math.sqrt(-D)/(2*a);
        return [ {label:'Discriminant', value:fmtNum(D)}, {label:'x1', value:`${fmtNum(re)} + ${fmtNum(im)}i`, emphasis:true}, {label:'x2', value:`${fmtNum(re)} − ${fmtNum(im)}i`, emphasis:true} ];
      }},
    { id:'trianglesolver', name:'Triangle Solver (SSS)', fields:[
        {key:'a', label:'Side a', type:'number', default:''},
        {key:'b', label:'Side b', type:'number', default:''},
        {key:'c', label:'Side c', type:'number', default:''},
      ], compute:v=>{ const a=num(v.a), b=num(v.b), c=num(v.c);
        if(a+b<=c || b+c<=a || a+c<=b) return [{label:'Result', value:'Not a valid triangle', emphasis:true}];
        const toDeg=r=>r*180/Math.PI;
        const A=toDeg(Math.acos((b*b+c*c-a*a)/(2*b*c))), B=toDeg(Math.acos((a*a+c*c-b*b)/(2*a*c))), C=180-A-B;
        const s=(a+b+c)/2, area=Math.sqrt(s*(s-a)*(s-b)*(s-c));
        return [ {label:'Angle A', value:fmtNum(A)+'°'}, {label:'Angle B', value:fmtNum(B)+'°'}, {label:'Angle C', value:fmtNum(C)+'°'}, {label:'Area', value:fmtNum(area), emphasis:true} ];
      }},
    { id:'circlecalc', name:'Circle Calculator', fields:[ {key:'radius', label:'Radius', type:'number', default:''} ],
      compute:v=>{ const r=num(v.radius);
        return [ {label:'Area', value:fmtNum(Math.PI*r*r), emphasis:true}, {label:'Circumference', value:fmtNum(2*Math.PI*r)}, {label:'Diameter', value:fmtNum(2*r)} ];
      }},
    { id:'spherecalc', name:'Sphere Calculator', fields:[ {key:'radius', label:'Radius', type:'number', default:''} ],
      compute:v=>{ const r=num(v.radius);
        return [ {label:'Volume', value:fmtNum((4/3)*Math.PI*r*r*r), emphasis:true}, {label:'Surface area', value:fmtNum(4*Math.PI*r*r)} ];
      }},
    { id:'cylindercalc', name:'Cylinder Calculator', fields:[
        {key:'radius', label:'Radius', type:'number', default:''}, {key:'height', label:'Height', type:'number', default:''},
      ], compute:v=>{ const r=num(v.radius), h=num(v.height);
        return [ {label:'Volume', value:fmtNum(Math.PI*r*r*h), emphasis:true}, {label:'Surface area', value:fmtNum(2*Math.PI*r*(r+h))} ];
      }},
    { id:'conecalc', name:'Cone Calculator', fields:[
        {key:'radius', label:'Radius', type:'number', default:''}, {key:'height', label:'Height', type:'number', default:''},
      ], compute:v=>{ const r=num(v.radius), h=num(v.height), slant=Math.sqrt(r*r+h*h);
        return [ {label:'Volume', value:fmtNum((1/3)*Math.PI*r*r*h), emphasis:true}, {label:'Surface area', value:fmtNum(Math.PI*r*(r+slant))} ];
      }},
    { id:'standarddeviation', name:'Standard Deviation', fields:[
        {key:'v1', label:'Value 1', type:'number', default:''}, {key:'v2', label:'Value 2', type:'number', default:''},
        {key:'v3', label:'Value 3', type:'number', default:''}, {key:'v4', label:'Value 4', type:'number', default:''},
        {key:'v5', label:'Value 5', type:'number', default:''},
      ], compute:v=>{ const vals=[v.v1,v.v2,v.v3,v.v4,v.v5].filter(x=>x!==''&&x!==undefined).map(Number);
        if(vals.length<2) return [{label:'SD', value:'Need at least 2 values', emphasis:true}];
        const mean=vals.reduce((a,b)=>a+b,0)/vals.length;
        const variance=vals.reduce((a,b)=>a+Math.pow(b-mean,2),0)/vals.length;
        return [ {label:'Mean', value:fmtNum(mean)}, {label:'Variance', value:fmtNum(variance)}, {label:'Standard deviation', value:fmtNum(Math.sqrt(variance)), emphasis:true} ];
      }},
    { id:'probabilitybasic', name:'Probability Calculator', fields:[
        {key:'favorable', label:'Favorable outcomes', type:'number', default:''},
        {key:'total', label:'Total outcomes', type:'number', default:''},
      ], compute:v=>{ const f=num(v.favorable), t=num(v.total); return [{label:'Probability', value: t? fmtPct(f/t*100):'—', emphasis:true}]; }},
  ]},
  { name:'Construction', items:[
    { id:'areacalc', name:'Area Calculator', fields:[
        {key:'length', label:'Length', type:'number', default:''}, {key:'width', label:'Width', type:'number', default:''},
      ], compute:v=>[{label:'Area', value:fmtNum(num(v.length)*num(v.width)), emphasis:true}] },
    { id:'concretecalc', name:'Concrete Calculator', fields:[
        {key:'length', label:'Length', type:'number', default:''}, {key:'width', label:'Width', type:'number', default:''}, {key:'depth', label:'Depth', type:'number', default:''},
      ], compute:v=>[{label:'Volume needed', value:fmtNum(num(v.length)*num(v.width)*num(v.depth)), emphasis:true}] },
    { id:'paintcalc', name:'Paint Calculator', fields:[
        {key:'area', label:'Wall area', type:'number', default:''}, {key:'coverage', label:'Coverage per litre', type:'number', default:10},
      ], compute:v=>{ const cov=num(v.coverage)||1; return [{label:'Litres needed', value:fmtNum(num(v.area)/cov), emphasis:true}]; }},
    { id:'tilecalc', name:'Tile / Flooring Calculator', fields:[
        {key:'floorArea', label:'Floor area', type:'number', default:''}, {key:'tileArea', label:'Area per tile', type:'number', default:''}, {key:'wastage', label:'Wastage %', type:'number', default:10},
      ], compute:v=>{ const ta=num(v.tileArea)||1; const tiles=Math.ceil((num(v.floorArea)/ta)*(1+num(v.wastage)/100));
        return [{label:'Tiles needed', value:String(tiles), emphasis:true}];
      }},
  ]},
  { name:'Engineering', items:[
    { id:'ohmslaw', name:"Ohm's Law", fields:[
        {key:'voltage', label:'Voltage (V)', type:'number', default:''}, {key:'current', label:'Current (A)', type:'number', default:''},
      ], compute:v=>{ const V=num(v.voltage), I=num(v.current)||1e-9;
        return [ {label:'Resistance (Ω)', value:fmtNum(V/I), emphasis:true}, {label:'Power (W)', value:fmtNum(V*I)} ];
      }},
    { id:'electricitybill', name:'Electricity Bill', fields:[
        {key:'units', label:'Units consumed (kWh)', type:'number', default:''}, {key:'rate', label:'Rate per unit', type:'number', default:''}, {key:'fixed', label:'Fixed charges', type:'number', default:0},
      ], compute:v=>[{label:'Estimated bill', value:fmtCur(num(v.units)*num(v.rate)+num(v.fixed)), emphasis:true}] },
    { id:'batterybackup', name:'Battery Backup', fields:[
        {key:'load', label:'Load (W)', type:'number', default:''}, {key:'voltage', label:'Battery voltage (V)', type:'number', default:12}, {key:'ah', label:'Battery capacity (Ah)', type:'number', default:''}, {key:'efficiency', label:'Efficiency %', type:'number', default:80},
      ], compute:v=>{ const load=num(v.load)||1; const runtime=(num(v.voltage)*num(v.ah)*num(v.efficiency)/100)/load;
        return [{label:'Backup time', value:fmtNum(runtime)+' hrs', emphasis:true}];
      }},
  ]},
  { name:'Health & Fitness', items:[
    { id:'bmi', name:'BMI Calculator', fields:[
        {key:'weight', label:'Weight (kg)', type:'number', default:''}, {key:'height', label:'Height (cm)', type:'number', default:''},
      ], compute:v=>{ const h=num(v.height)/100||1, bmi=num(v.weight)/(h*h);
        let cat = bmi<18.5?'Underweight': bmi<25?'Normal': bmi<30?'Overweight':'Obese';
        return [ {label:'BMI', value:fmtNum(bmi), emphasis:true}, {label:'Category', value:cat} ];
      }},
    { id:'bmr', name:'BMR Calculator', fields:[
        {key:'weight', label:'Weight (kg)', type:'number', default:''}, {key:'height', label:'Height (cm)', type:'number', default:''},
        {key:'age', label:'Age', type:'number', default:''}, {key:'sex', label:'Sex', type:'pills', options:['Male','Female'], default:'Male'},
      ], compute:v=>{ const base=10*num(v.weight)+6.25*num(v.height)-5*num(v.age);
        const bmr = v.sex==='Male'? base+5 : base-161;
        return [{label:'BMR', value:fmtNum(bmr)+' kcal/day', emphasis:true}];
      }},
    { id:'tdee', name:'TDEE Calculator', fields:[
        {key:'bmr', label:'BMR (kcal)', type:'number', default:''},
        {key:'activity', label:'Activity level', type:'select', options:[{value:1.2,label:'Sedentary'},{value:1.375,label:'Light'},{value:1.55,label:'Moderate'},{value:1.725,label:'Active'},{value:1.9,label:'Very active'}], default:1.375},
      ], compute:v=>[{label:'TDEE', value:fmtNum(num(v.bmr)*num(v.activity))+' kcal/day', emphasis:true}] },
    { id:'calorietarget', name:'Calorie Calculator', fields:[
        {key:'tdee', label:'TDEE (kcal)', type:'number', default:''}, {key:'goal', label:'Goal', type:'pills', options:['Lose','Maintain','Gain'], default:'Maintain'},
      ], compute:v=>{ const adj = v.goal==='Lose'?-500: v.goal==='Gain'?500:0;
        return [{label:'Daily target', value:fmtNum(num(v.tdee)+adj)+' kcal', emphasis:true}];
      }},
    { id:'bodyfat', name:'Body Fat Calculator', fields:[
        {key:'bmi', label:'BMI', type:'number', default:''}, {key:'age', label:'Age', type:'number', default:''}, {key:'sex', label:'Sex', type:'pills', options:['Male','Female'], default:'Male'},
      ], compute:v=>{ const g=v.sex==='Male'?1:0; const bf=(1.20*num(v.bmi))+(0.23*num(v.age))-(10.8*g)-5.4;
        return [{label:'Estimated body fat %', value:fmtPct(bf), emphasis:true}];
      }},
    { id:'macro', name:'Macro Calculator', fields:[
        {key:'calories', label:'Daily calories', type:'number', default:''}, {key:'goal', label:'Diet type', type:'pills', options:['Balanced','Low-carb','High-protein'], default:'Balanced'},
      ], compute:v=>{ const cal=num(v.calories); const splits={ 'Balanced':[.3,.4,.3], 'Low-carb':[.35,.2,.45], 'High-protein':[.4,.35,.25] };
        const [p,c,f]=splits[v.goal]||splits.Balanced;
        return [ {label:'Protein', value:fmtNum(cal*p/4)+' g'}, {label:'Carbs', value:fmtNum(cal*c/4)+' g'}, {label:'Fat', value:fmtNum(cal*f/9)+' g', emphasis:true} ];
      }},
    { id:'protein', name:'Protein Calculator', fields:[
        {key:'weight', label:'Weight (kg)', type:'number', default:''}, {key:'activity', label:'Activity', type:'pills', options:['Sedentary','Active','Athlete'], default:'Active'},
      ], compute:v=>{ const f = v.activity==='Sedentary'?0.8 : v.activity==='Athlete'?1.8:1.2;
        return [{label:'Daily protein', value:fmtNum(num(v.weight)*f)+' g', emphasis:true}];
      }},
    { id:'waterintake', name:'Water Intake', fields:[
        {key:'weight', label:'Weight (kg)', type:'number', default:''}, {key:'activityMin', label:'Exercise (min/day)', type:'number', default:0},
      ], compute:v=>[{label:'Daily water target', value:fmtNum(num(v.weight)*0.033+num(v.activityMin)/30*0.35)+' L', emphasis:true}] },
    { id:'pace', name:'Pace Calculator', fields:[
        {key:'distance', label:'Distance (km)', type:'number', default:''}, {key:'time', label:'Time (minutes)', type:'number', default:''},
      ], compute:v=>{ const d=num(v.distance)||1; return [ {label:'Pace', value:fmtNum(num(v.time)/d)+' min/km', emphasis:true}, {label:'Speed', value:fmtNum(d/(num(v.time)/60))+' km/h'} ]; }},
    { id:'heartratezone', name:'Heart Rate Zone', fields:[
        {key:'age', label:'Age', type:'number', default:''}, {key:'resting', label:'Resting HR', type:'number', default:''},
      ], compute:v=>{ const maxHR=220-num(v.age), rhr=num(v.resting), reserve=maxHR-rhr;
        const zone=p=>Math.round(rhr+reserve*p);
        return [ {label:'Max HR', value:String(maxHR)}, {label:'Fat burn (60-70%)', value:`${zone(.6)}-${zone(.7)} bpm`}, {label:'Cardio (70-85%)', value:`${zone(.7)}-${zone(.85)} bpm`, emphasis:true}, {label:'Peak (85-95%)', value:`${zone(.85)}-${zone(.95)} bpm`} ];
      }},
  ]},
  { name:'Date & Travel', items:[
    { id:'datedifference', name:'Date Difference', fields:[
        {key:'date1', label:'Start date', type:'date', default:''}, {key:'date2', label:'End date', type:'date', default:''},
      ], compute:v=>{ if(!v.date1||!v.date2) return [{label:'Difference', value:'—', emphasis:true}];
        const d1=parseCalendarDate(v.date1),d2=parseCalendarDate(v.date2);
        if(!d1||!d2) return [{label:'Difference', value:'Enter valid dates.', emphasis:true}];
        const days=d2.serial-d1.serial;
      return [ {label:'Days', value:String(days), emphasis:true}, {label:'Weeks', value:fmtNum(days/7)}, {label:'Months (approx)', value:fmtNum(days/30.44)}, {label:'Years (approx)', value:fmtNum(days/365.2425)} ];
      }},
    { id:'workingdays', name:'Working Days', fields:[
        {key:'date1', label:'Start date', type:'date', default:''}, {key:'date2', label:'End date', type:'date', default:''},
      ], compute:v=>{ if(!v.date1||!v.date2) return [{label:'Working days', value:'—', emphasis:true}];
        const start=parseCalendarDate(v.date1),end=parseCalendarDate(v.date2);
        if(!start||!end) return [{label:'Working days', value:'Enter valid dates.', emphasis:true}];
        if(end.serial<start.serial) return [{label:'Working days', value:'End date must be after start date.', emphasis:true}];
        let count=0;
        for(let serial=start.serial;serial<=end.serial;serial++){
          const day=new Date(serial*DAY_MS).getUTCDay();if(day!==0&&day!==6) count++;
        }
        return [{label:'Working days', value:String(count), emphasis:true}];
      }},
    { id:'countdown', name:'Countdown', fields:[ {key:'targetDate', label:'Target date', type:'date', default:''} ],
      compute:v=>{ if(!v.targetDate) return [{label:'Remaining', value:'—', emphasis:true}];
        const target=parseCalendarDate(v.targetDate);
        if(!target) return [{label:'Remaining', value:'Enter a valid date.', emphasis:true}];
        const now=new Date();
        const today=parseCalendarDate(`${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')}`);
        const days=target.serial-today.serial;
        return [{label:'Days remaining', value:String(days), emphasis:true}];
      }},
    { id:'fuelcost', name:'Fuel Cost', fields:[
        {key:'distance', label:'Distance (km)', type:'number', default:''}, {key:'mileage', label:'Mileage (km/L)', type:'number', default:''}, {key:'price', label:'Fuel price / L', type:'number', default:''},
      ], compute:v=>{ const m=num(v.mileage)||1; return [{label:'Trip fuel cost', value:fmtCur((num(v.distance)/m)*num(v.price)), emphasis:true}]; }},
    { id:'tripbudget', name:'Trip Budget', fields:[
        {key:'transport', label:'Transport', type:'number', default:0}, {key:'stay', label:'Stay (total)', type:'number', default:0},
        {key:'food', label:'Food (total)', type:'number', default:0}, {key:'activities', label:'Activities', type:'number', default:0}, {key:'days', label:'Number of days', type:'number', default:1},
      ], compute:v=>{ const total=num(v.transport)+num(v.stay)+num(v.food)+num(v.activities), days=Math.max(1,num(v.days));
        return [ {label:'Total budget', value:fmtCur(total), emphasis:true}, {label:'Per day', value:fmtCur(total/days)} ];
      }},
  ]},
  { name:'Science', items:[
    { id:'density', name:'Density Calculator', fields:[
        {key:'mass', label:'Mass (kg)', type:'number', default:''}, {key:'volume', label:'Volume (m³)', type:'number', default:''},
      ], compute:v=>{ const vol=num(v.volume)||1; return [{label:'Density', value:fmtNum(num(v.mass)/vol)+' kg/m³', emphasis:true}]; }},
    { id:'kinematics', name:'Kinematics', fields:[
        {key:'u', label:'Initial velocity (m/s)', type:'number', default:0}, {key:'a', label:'Acceleration (m/s²)', type:'number', default:''}, {key:'t', label:'Time (s)', type:'number', default:''},
      ], compute:v=>{ const u=num(v.u), a=num(v.a), t=num(v.t);
        return [ {label:'Final velocity', value:fmtNum(u+a*t)+' m/s', emphasis:true}, {label:'Distance', value:fmtNum(u*t+0.5*a*t*t)+' m'} ];
      }},
    { id:'phcalc', name:'pH Calculator', fields:[ {key:'h', label:'H⁺ concentration (mol/L)', type:'number', default:''} ],
      compute:v=>{ const h=num(v.h); return [{label:'pH', value: h>0? fmtNum(-Math.log10(h)):'—', emphasis:true}]; }},
  ]},
  { name:'Technology', items:[
    { id:'datastorage', name:'Data Storage Converter', fields:[
        {key:'value', label:'Value', type:'number', default:1},
        {key:'from', label:'From', type:'select', options:['B','KB','MB','GB','TB'], default:'GB'},
        {key:'to', label:'To', type:'select', options:['B','KB','MB','GB','TB'], default:'MB'},
      ], compute:v=>{ const order=['B','KB','MB','GB','TB']; const p=order.indexOf(v.from)-order.indexOf(v.to);
        return [{label:'Converted value', value:fmtNum(num(v.value)*Math.pow(1024,p))+' '+v.to, emphasis:true}];
      }},
    { id:'downloadtime', name:'Download Time', fields:[
        {key:'sizeMB', label:'File size (MB)', type:'number', default:''}, {key:'speedMbps', label:'Speed (Mbps)', type:'number', default:''},
      ], compute:v=>{ const speed=num(v.speedMbps)||1; const seconds=(num(v.sizeMB)*8)/speed;
        return [{label:'Download time', value:`${Math.floor(seconds/60)}m ${Math.round(seconds%60)}s`, emphasis:true}];
      }},
    { id:'passwordentropy', name:'Password Entropy', fields:[
        {key:'length', label:'Password length', type:'number', default:12},
        {key:'charset', label:'Character set', type:'select', options:[{value:26,label:'Lowercase only'},{value:52,label:'Upper + lower'},{value:62,label:'Alphanumeric'},{value:94,label:'All characters'}], default:94},
      ], compute:v=>{ const bits=num(v.length)*Math.log2(num(v.charset));
        return [{label:'Entropy', value:fmtNum(bits)+' bits', emphasis:true}, {label:'Strength', value: bits<40?'Weak': bits<60?'Fair': bits<80?'Strong':'Very strong'}];
      }},
    { id:'aitokencost', name:'AI Token Cost', fields:[
        {key:'inputTokens', label:'Input tokens', type:'number', default:''}, {key:'outputTokens', label:'Output tokens', type:'number', default:''},
        {key:'inputPrice', label:'Input price / 1K', type:'number', default:''}, {key:'outputPrice', label:'Output price / 1K', type:'number', default:''},
      ], compute:v=>{ const cost=(num(v.inputTokens)/1000)*num(v.inputPrice)+(num(v.outputTokens)/1000)*num(v.outputPrice);
        return [{label:'Estimated cost', value:fmtCur(cost), emphasis:true}];
      }},
  ]},
  { name:'Agriculture & EV', items:[
    { id:'farmyield', name:'Farm Yield', fields:[
        {key:'area', label:'Area (acres)', type:'number', default:''}, {key:'yieldPerAcre', label:'Yield per acre', type:'number', default:''},
      ], compute:v=>[{label:'Total production', value:fmtNum(num(v.area)*num(v.yieldPerAcre)), emphasis:true}] },
    { id:'evrange', name:'EV Range', fields:[
        {key:'battery', label:'Battery capacity (kWh)', type:'number', default:''}, {key:'efficiency', label:'Efficiency (kWh/km)', type:'number', default:0.15},
      ], compute:v=>{ const eff=num(v.efficiency)||0.15; return [{label:'Estimated range', value:fmtNum(num(v.battery)/eff)+' km', emphasis:true}]; }},
    { id:'evchargingcost', name:'EV Charging Cost', fields:[
        {key:'battery', label:'Battery capacity (kWh)', type:'number', default:''}, {key:'tariff', label:'Tariff / kWh', type:'number', default:''},
      ], compute:v=>[{label:'Charging cost', value:fmtCur(num(v.battery)*num(v.tariff)), emphasis:true}] },
    { id:'carbonfootprint', name:'Carbon Footprint', fields:[
        {key:'electricity', label:'Electricity (kWh/month)', type:'number', default:0}, {key:'carKm', label:'Car travel (km/month)', type:'number', default:0}, {key:'flightHours', label:'Flight hours/month', type:'number', default:0},
      ], compute:v=>{ const co2=num(v.electricity)*0.82+num(v.carKm)*0.12+num(v.flightHours)*90;
        return [{label:'Estimated CO2e', value:fmtNum(co2)+' kg/month', emphasis:true}];
      }},
  ]},
  { name:'Business & Shops', items:[
    {id:'milkledger',name:'Milk Dairy · Date, Litre & Price',fields:[{key:'startDate',label:'Period start date',type:'date',default:''},{key:'endDate',label:'Period end date',type:'date',default:''},{key:'litres',label:'Milk sold per day (L)',type:'number',default:''},{key:'sellRate',label:'Selling price / L',type:'number',default:''},{key:'buyRate',label:'Purchase cost / L',type:'number',default:''},{key:'waste',label:'Spillage / returns (L/day)',type:'number',default:0},{key:'expenses',label:'Other daily expenses',type:'number',default:0}],compute:v=>{const sold=Math.max(0,num(v.litres)-num(v.waste)),daily=sold*num(v.sellRate),cost=num(v.litres)*num(v.buyRate)+num(v.expenses),profit=daily-cost;let days=30;if(v.startDate&&v.endDate){days=Math.max(0,Math.floor((new Date(v.endDate+'T00:00:00')-new Date(v.startDate+'T00:00:00'))/86400000)+1);}return[{label:'Period days',value:String(days)},{label:'Net litres sold / day',value:fmtNum(sold)+' L'},{label:'Daily sales',value:fmtCur(daily)},{label:'Daily profit',value:fmtCur(profit),emphasis:true},{label:'Period sales',value:fmtCur(daily*days)},{label:'Period profit',value:fmtCur(profit*days)}] }},
    {id:'kiranainvoice',name:'Kirana · Multi-item Bill',fields:[{key:'q1',label:'Item 1 quantity',type:'number',default:0},{key:'p1',label:'Item 1 price / unit',type:'number',default:0},{key:'q2',label:'Item 2 quantity',type:'number',default:0},{key:'p2',label:'Item 2 price / unit',type:'number',default:0},{key:'q3',label:'Item 3 quantity',type:'number',default:0},{key:'p3',label:'Item 3 price / unit',type:'number',default:0},{key:'q4',label:'Item 4 quantity',type:'number',default:0},{key:'p4',label:'Item 4 price / unit',type:'number',default:0},{key:'q5',label:'Item 5 quantity',type:'number',default:0},{key:'p5',label:'Item 5 price / unit',type:'number',default:0},{key:'discount',label:'Bill discount %',type:'number',default:0},{key:'tax',label:'Tax % (if applicable)',type:'number',default:0},{key:'paid',label:'Amount received',type:'number',default:0}],compute:v=>{const sub=[1,2,3,4,5].reduce((a,i)=>a+Math.max(0,num(v['q'+i]))*Math.max(0,num(v['p'+i])),0),disc=sub*Math.min(100,Math.max(0,num(v.discount)))/100,tax=(sub-disc)*Math.max(0,num(v.tax))/100,total=sub-disc+tax;return[{label:'Items subtotal',value:fmtCur(sub)},{label:'Discount',value:'− '+fmtCur(disc)},{label:'Tax',value:fmtCur(tax)},{label:'Customer total',value:fmtCur(total),emphasis:true},{label:'Change due',value:fmtCur(Math.max(0,num(v.paid)-total))}]}},
    {id:'retailmargin',name:'Retail Shop · Price & Margin',fields:[{key:'qty',label:'Units sold',type:'number',default:1},{key:'cost',label:'Cost per unit',type:'number',default:''},{key:'price',label:'Selling price / unit',type:'number',default:''},{key:'discount',label:'Customer discount %',type:'number',default:0},{key:'tax',label:'Tax %',type:'number',default:0}],compute:v=>{const q=Math.max(0,num(v.qty)),cost=Math.max(0,num(v.cost)),price=Math.max(0,num(v.price)),gross=q*price,disc=gross*Math.min(100,Math.max(0,num(v.discount)))/100,tax=(gross-disc)*Math.max(0,num(v.tax))/100,net=gross-disc+tax,profit=gross-disc-q*cost;return[{label:'Customer pays (incl. tax)',value:fmtCur(net),emphasis:true},{label:'Net sales before tax',value:fmtCur(gross-disc)},{label:'Gross profit',value:fmtCur(profit)},{label:'Margin on net sales',value:fmtPct(gross-disc?(profit/(gross-disc))*100:0)}]}},
    {id:'wholesaleretail',name:'Wholesaler ↔ Retailer Margin',fields:[{key:'cost',label:'Your purchase cost / unit',type:'number',default:''},{key:'wholesale',label:'Wholesale price / unit',type:'number',default:''},{key:'retail',label:'Retail price / unit',type:'number',default:''},{key:'qty',label:'Quantity',type:'number',default:1}],compute:v=>{const q=Math.max(0,num(v.qty)),c=num(v.cost),w=num(v.wholesale),r=num(v.retail);return[{label:'Your wholesale profit',value:fmtCur((w-c)*q),emphasis:true},{label:'Wholesaler margin',value:fmtPct(w?(w-c)/w*100:0)},{label:'Retailer gross profit',value:fmtCur((r-w)*q)},{label:'Retailer margin',value:fmtPct(r?(r-w)/r*100:0)},{label:'End-customer value',value:fmtCur(r*q)}]}},
    {id:'shopinvoice',name:'Shop · Quick Invoice & Change',fields:[{key:'qty',label:'Quantity',type:'number',default:1},{key:'price',label:'Price per item',type:'number',default:''},{key:'discount',label:'Discount %',type:'number',default:0},{key:'tax',label:'Tax %',type:'number',default:0},{key:'paid',label:'Cash received',type:'number',default:0}],compute:v=>{const sub=Math.max(0,num(v.qty))*Math.max(0,num(v.price)),disc=sub*Math.min(100,Math.max(0,num(v.discount)))/100,tax=(sub-disc)*Math.max(0,num(v.tax))/100,total=sub-disc+tax;return[{label:'Subtotal',value:fmtCur(sub)},{label:'Discount',value:fmtCur(disc)},{label:'Tax',value:fmtCur(tax)},{label:'Total due',value:fmtCur(total),emphasis:true},{label:'Change to return',value:fmtCur(Math.max(0,num(v.paid)-total))}]}},
    {id:'sweetbatch',name:'Sweets · Batch Cost & Selling',fields:[{key:'yield',label:'Sellable pieces / kg',type:'number',default:''},{key:'batch',label:'Batch output (kg)',type:'number',default:''},{key:'ingredients',label:'Ingredients cost',type:'number',default:''},{key:'labor',label:'Labour cost',type:'number',default:0},{key:'fuel',label:'Fuel & overhead',type:'number',default:0},{key:'packaging',label:'Packaging cost',type:'number',default:0},{key:'price',label:'Selling price per piece',type:'number',default:''}],compute:v=>{const qty=Math.max(0,num(v.yield)*num(v.batch)),cost=num(v.ingredients)+num(v.labor)+num(v.fuel)+num(v.packaging),sales=qty*num(v.price);return[{label:'Pieces to sell',value:fmtNum(qty)},{label:'Cost per piece',value:fmtCur(qty?cost/qty:0)},{label:'Batch cost',value:fmtCur(cost)},{label:'Expected sales',value:fmtCur(sales)},{label:'Batch gross profit',value:fmtCur(sales-cost),emphasis:true}]}},
    {id:'salonservice',name:'Salon · Service & Staff Earnings',fields:[{key:'services',label:'Services per day',type:'number',default:''},{key:'ticket',label:'Average service price',type:'number',default:''},{key:'commission',label:'Staff commission %',type:'number',default:0},{key:'products',label:'Product sales / day',type:'number',default:0},{key:'expenses',label:'Daily shop expenses',type:'number',default:0},{key:'days',label:'Open days per month',type:'number',default:26}],compute:v=>{const daily=num(v.services)*num(v.ticket)+num(v.products),staff=daily*Math.min(100,Math.max(0,num(v.commission)))/100,net=daily-staff-num(v.expenses);return[{label:'Daily revenue',value:fmtCur(daily)},{label:'Staff commission',value:fmtCur(staff)},{label:'Shop net / day',value:fmtCur(net),emphasis:true},{label:'Estimated monthly net',value:fmtCur(net*Math.max(0,num(v.days)))}]}},
  ]},
  { name:'Trade & Materials', items:[
    {id:'steelweight',name:'Iron & Steel · Weight & Quote',fields:[{key:'shape',label:'Material shape',type:'select',options:['Round bar','Flat bar / plate','Sheet','Square bar'],default:'Round bar'},{key:'dimension1',label:'Diameter / width (mm)',type:'number',default:''},{key:'dimension2',label:'Thickness / second side (mm)',type:'number',default:''},{key:'length',label:'Length per piece (m)',type:'number',default:''},{key:'qty',label:'Number of pieces',type:'number',default:1},{key:'density',label:'Density (kg/m³)',type:'number',default:7850},{key:'rate',label:'Selling rate / kg',type:'number',default:''}],compute:v=>{const a=num(v.dimension1)/1000,b=num(v.dimension2)/1000,l=num(v.length),area=v.shape==='Round bar'?Math.PI*a*a/4:v.shape==='Square bar'?a*a:a*b,kg=area*l*num(v.density)*Math.max(0,num(v.qty));return[{label:'Estimated total weight',value:fmtNum(kg)+' kg',emphasis:true},{label:'Quote at entered rate',value:fmtCur(kg*num(v.rate))},{label:'Formula',value:v.shape==='Round bar'?'π × diameter² ÷ 4 × length × density':'cross-section × length × density'}]}},
    {id:'welderquote',name:'Welder · Job Cost & Quote',fields:[{key:'material',label:'Metal & parts',type:'number',default:''},{key:'consumables',label:'Welding rods / gas',type:'number',default:0},{key:'hours',label:'Labour hours',type:'number',default:''},{key:'hourRate',label:'Labour rate / hour',type:'number',default:''},{key:'overhead',label:'Travel & overhead',type:'number',default:0},{key:'margin',label:'Profit margin %',type:'number',default:20}],compute:v=>{const cost=num(v.material)+num(v.consumables)+num(v.hours)*num(v.hourRate)+num(v.overhead),quote=cost*(1+Math.max(0,num(v.margin))/100);return[{label:'Estimated job cost',value:fmtCur(cost)},{label:'Suggested quote',value:fmtCur(quote),emphasis:true},{label:'Gross profit in quote',value:fmtCur(quote-cost)}]}},
    {id:'metaltrade',name:'Gold · Silver · Diamond Counter',fields:[{key:'metal',label:'Counter type',type:'select',options:['Gold','Silver','Diamond'],default:'Gold'},{key:'weight',label:'Weight (g)',type:'number',default:''},{key:'purity',label:'Purity factor % (gold: 24K=100, 22K=91.67)',type:'number',default:100},{key:'rate',label:'Base market rate / g',type:'number',default:''},{key:'stones',label:'Stone / diamond value',type:'number',default:0},{key:'making',label:'Making charge %',type:'number',default:0},{key:'discount',label:'Discount %',type:'number',default:0},{key:'tax',label:'Tax % (if applicable)',type:'number',default:0}],compute:v=>{const metal=num(v.weight)*num(v.rate)*Math.max(0,num(v.purity))/100,make=metal*Math.max(0,num(v.making))/100,sub=metal+make+Math.max(0,num(v.stones)),disc=sub*Math.min(100,Math.max(0,num(v.discount)))/100,tax=(sub-disc)*Math.max(0,num(v.tax))/100,total=sub-disc+tax;return[{label:'Metal value at entered purity',value:fmtCur(metal)},{label:'Making + stone value',value:fmtCur(make+num(v.stones))},{label:'Discount',value:'− '+fmtCur(disc)},{label:'Tax',value:fmtCur(tax)},{label:'Customer total',value:fmtCur(total),emphasis:true}]}},
    {id:'furniturejob',name:'Furniture · Build & Sell Margin',fields:[{key:'material',label:'Wood / board / hardware',type:'number',default:''},{key:'labor',label:'Carpentry labour',type:'number',default:''},{key:'finish',label:'Finishing & polish',type:'number',default:0},{key:'delivery',label:'Delivery & installation',type:'number',default:0},{key:'overhead',label:'Shop overhead',type:'number',default:0},{key:'margin',label:'Target margin %',type:'number',default:25}],compute:v=>{const cost=num(v.material)+num(v.labor)+num(v.finish)+num(v.delivery)+num(v.overhead),m=Math.min(95,Math.max(0,num(v.margin))),price=cost/(1-m/100);return[{label:'Total build cost',value:fmtCur(cost)},{label:'Suggested selling price',value:fmtCur(price),emphasis:true},{label:'Gross profit',value:fmtCur(price-cost)}]}},
  ]},
  { name:'Online Seller & Buyer', items:[
    {id:'marketplaceprofit',name:'Online Seller · Net Profit',fields:[{key:'price',label:'Selling price / order',type:'number',default:''},{key:'cost',label:'Product cost / order',type:'number',default:''},{key:'fee',label:'Marketplace fee %',type:'number',default:0},{key:'shipping',label:'Shipping / order',type:'number',default:0},{key:'packing',label:'Packing cost / order',type:'number',default:0},{key:'ads',label:'Ads / order',type:'number',default:0},{key:'returns',label:'Returns allowance / order',type:'number',default:0},{key:'qty',label:'Orders',type:'number',default:1}],compute:v=>{const q=Math.max(0,num(v.qty)),p=num(v.price),fee=p*Math.max(0,num(v.fee))/100,unit=p-num(v.cost)-fee-num(v.shipping)-num(v.packing)-num(v.ads)-num(v.returns);return[{label:'Net profit / order',value:fmtCur(unit),emphasis:true},{label:'Net profit for orders',value:fmtCur(unit*q)},{label:'Net margin',value:fmtPct(p?unit/p*100:0)},{label:'Marketplace fee / order',value:fmtCur(fee)}]}},
    {id:'onlinecompare',name:'Online Purchase · Compare Final Price',fields:[{key:'aPrice',label:'Store A item price',type:'number',default:''},{key:'aShip',label:'Store A delivery',type:'number',default:0},{key:'aTax',label:'Store A tax %',type:'number',default:0},{key:'aCoupon',label:'Store A coupon',type:'number',default:0},{key:'bPrice',label:'Store B item price',type:'number',default:''},{key:'bShip',label:'Store B delivery',type:'number',default:0},{key:'bTax',label:'Store B tax %',type:'number',default:0},{key:'bCoupon',label:'Store B coupon',type:'number',default:0}],compute:v=>{const a=Math.max(0,(num(v.aPrice)-num(v.aCoupon))*(1+num(v.aTax)/100)+num(v.aShip)),b=Math.max(0,(num(v.bPrice)-num(v.bCoupon))*(1+num(v.bTax)/100)+num(v.bShip)),d=Math.abs(a-b);return[{label:'Store A final price',value:fmtCur(a)},{label:'Store B final price',value:fmtCur(b)},{label:a===b?'Best price':'Cheaper option',value:a===b?'Same total':a<b?'Store A · save '+fmtCur(d):'Store B · save '+fmtCur(d),emphasis:true}]}},
    {id:'productpricing',name:'Clothes · Toys · Gift Shop Pricing',fields:[{key:'cost',label:'Purchase cost per item',type:'number',default:''},{key:'freight',label:'Freight / item',type:'number',default:0},{key:'overhead',label:'Other cost / item',type:'number',default:0},{key:'margin',label:'Target profit margin %',type:'number',default:25},{key:'qty',label:'Stock quantity',type:'number',default:1},{key:'sale',label:'Actual selling price / item',type:'number',default:''}],compute:v=>{const cost=num(v.cost)+num(v.freight)+num(v.overhead),m=Math.min(95,Math.max(0,num(v.margin))),target=cost/(1-m/100),actual=num(v.sale),profit=actual-cost,q=Math.max(0,num(v.qty));return[{label:'Landed cost / item',value:fmtCur(cost)},{label:'Suggested price at margin',value:fmtCur(target),emphasis:true},{label:'Actual profit / item',value:fmtCur(profit)},{label:'Profit on listed stock',value:fmtCur(profit*q)},{label:'Actual margin',value:fmtPct(actual?profit/actual*100:0)}]}},
    {id:'pharmacyinvoice',name:'Medical Shop · Invoice & Margin',fields:[{key:'qty',label:'Packs sold',type:'number',default:1},{key:'cost',label:'Purchase cost / pack',type:'number',default:''},{key:'price',label:'Sale price / pack',type:'number',default:''},{key:'discount',label:'Customer discount %',type:'number',default:0},{key:'tax',label:'Tax % (confirm local rules)',type:'number',default:0}],compute:v=>{const q=Math.max(0,num(v.qty)),gross=q*num(v.price),net=gross*(1-Math.min(100,Math.max(0,num(v.discount)))/100),tax=net*Math.max(0,num(v.tax))/100,profit=net-q*num(v.cost);return[{label:'Customer total incl. entered tax',value:fmtCur(net+tax),emphasis:true},{label:'Sales before tax',value:fmtCur(net)},{label:'Gross profit estimate',value:fmtCur(profit)},{label:'Margin estimate',value:fmtPct(net?profit/net*100:0)}]}},
  ]},
  { name:'Expenses & Personal Finance', items:[
    {id:'monthlybudget',name:'Personal Monthly Budget',fields:[
      {key:'income',label:'Monthly take-home income',type:'number',default:0},{key:'housing',label:'Rent / housing',type:'number',default:0},{key:'food',label:'Food & groceries',type:'number',default:0},{key:'transport',label:'Transport',type:'number',default:0},{key:'utilities',label:'Utilities & phone',type:'number',default:0},{key:'health',label:'Health & insurance',type:'number',default:0},{key:'education',label:'Education & family',type:'number',default:0},{key:'emi',label:'Debt / EMI payments',type:'number',default:0},{key:'subscriptions',label:'Subscriptions & recurring bills',type:'number',default:0},{key:'other',label:'Other planned spending',type:'number',default:0},{key:'savings',label:'Planned savings contribution',type:'number',default:0},{key:'days',label:'Days in budget period',type:'number',default:30}
    ],compute:v=>{const income=Math.max(0,num(v.income)),expenses=['housing','food','transport','utilities','health','education','emi','subscriptions','other'].reduce((s,k)=>s+Math.max(0,num(v[k])),0),saving=Math.max(0,num(v.savings)),remaining=income-expenses-saving,days=Math.max(1,Math.floor(num(v.days)||30));return[{label:'Monthly income',value:fmtCur(income)},{label:'Planned expenses',value:fmtCur(expenses)},{label:'Planned savings',value:fmtCur(saving)},{label:'Unallocated / shortfall',value:fmtCur(remaining),emphasis:true},{label:'Savings rate',value:income?fmtPct(saving/income*100):'—'},{label:remaining>=0?'Daily amount available':'Average daily shortfall',value:fmtCur(Math.abs(remaining)/days)}] }},
    {id:'incomesummary',name:'Income & Expense Summary',fields:[
      {key:'opening',label:'Starting balance',type:'number',default:0},{key:'salary',label:'Salary / regular income',type:'number',default:0},{key:'business',label:'Business / freelance income',type:'number',default:0},{key:'otherIncome',label:'Other income',type:'number',default:0},{key:'housing',label:'Housing',type:'number',default:0},{key:'food',label:'Food & groceries',type:'number',default:0},{key:'transport',label:'Transport',type:'number',default:0},{key:'utilities',label:'Utilities & phone',type:'number',default:0},{key:'health',label:'Health & education',type:'number',default:0},{key:'emi',label:'Debt / EMI',type:'number',default:0},{key:'recurring',label:'Subscriptions & recurring bills',type:'number',default:0},{key:'otherExpense',label:'Other expenses',type:'number',default:0},{key:'days',label:'Period length (days)',type:'number',default:30}
    ],compute:v=>{const income=['salary','business','otherIncome'].reduce((s,k)=>s+Math.max(0,num(v[k])),0),expenses=['housing','food','transport','utilities','health','emi','recurring','otherExpense'].reduce((s,k)=>s+Math.max(0,num(v[k])),0),net=income-expenses,opening=num(v.opening),days=Math.max(1,Math.floor(num(v.days)||30));return[{label:'Total income',value:fmtCur(income)},{label:'Total expenses',value:fmtCur(expenses)},{label:'Net cash flow',value:fmtCur(net),emphasis:true},{label:'Estimated closing balance',value:fmtCur(opening+net)},{label:'Net cash-flow rate',value:income?fmtPct(net/income*100):'—'},{label:'Average daily net',value:fmtCur(net/days)}] }},
    {id:'dailyspend',name:'Safe-to-Spend Planner',fields:[{key:'cash',label:'Available money until next income',type:'number',default:''},{key:'bills',label:'Bills & EMI due first',type:'number',default:0},{key:'buffer',label:'Keep-aside emergency buffer',type:'number',default:0},{key:'days',label:'Days until next income',type:'number',default:30}],compute:v=>{const cash=Math.max(0,num(v.cash)),bills=Math.max(0,num(v.bills)),buffer=Math.max(0,num(v.buffer)),days=Math.max(1,Math.floor(num(v.days))),available=cash-bills-buffer;return[{label:'After bills & buffer',value:fmtCur(available),emphasis:true},{label:'Daily safe-to-spend',value:fmtCur(Math.max(0,available)/days)},{label:available<0?'Shortfall to cover':'Unassigned after daily allowance',value:available<0?fmtCur(-available):fmtCur(0)}] }},
    {id:'savingsgoalplan',name:'Savings Goal Planner',fields:[{key:'target',label:'Target amount',type:'number',default:''},{key:'current',label:'Already saved',type:'number',default:0},{key:'months',label:'Months to reach goal',type:'number',default:''},{key:'monthly',label:'Your planned monthly saving',type:'number',default:0}],compute:v=>{const target=Math.max(0,num(v.target)),current=Math.max(0,num(v.current)),gap=Math.max(0,target-current),months=Math.max(0,Math.floor(num(v.months))),monthly=Math.max(0,num(v.monthly)),required=months?gap/months:0,finish=monthly?Math.ceil(gap/monthly):Infinity;return[{label:'Amount remaining',value:fmtCur(gap)},{label:'Monthly saving needed',value:months?fmtCur(required):'Enter a goal timeline',emphasis:true},{label:'At your planned saving',value:Number.isFinite(finish)?(finish===0?'Goal reached':`${finish} month${finish===1?'':'s'}`):'Enter a monthly amount'},{label:'Progress',value:target?fmtPct(Math.min(100,current/target*100)):'—'}] }},
    {id:'emergencyfundplan',name:'Emergency Fund Planner',fields:[{key:'housing',label:'Essential housing / rent per month',type:'number',default:0},{key:'food',label:'Essential food per month',type:'number',default:0},{key:'utilities',label:'Utilities & transport per month',type:'number',default:0},{key:'health',label:'Health & insurance per month',type:'number',default:0},{key:'minimumDebt',label:'Minimum debt payments per month',type:'number',default:0},{key:'months',label:'Months of essential costs to cover',type:'number',default:6},{key:'current',label:'Emergency savings already set aside',type:'number',default:0},{key:'monthly',label:'Monthly contribution',type:'number',default:0}],compute:v=>{const essential=['housing','food','utilities','health','minimumDebt'].reduce((s,k)=>s+Math.max(0,num(v[k])),0),months=Math.min(36,Math.max(1,Math.floor(num(v.months)||6))),target=essential*months,current=Math.max(0,num(v.current)),gap=Math.max(0,target-current),monthly=Math.max(0,num(v.monthly)),time=monthly?Math.ceil(gap/monthly):Infinity;return[{label:'Essential monthly costs',value:fmtCur(essential)},{label:`${months}-month fund target`,value:fmtCur(target),emphasis:true},{label:'Remaining to save',value:fmtCur(gap)},{label:'Time at planned contribution',value:Number.isFinite(time)?`${time} month${time===1?'':'s'}`:'Enter a monthly contribution'}] }},
    {id:'networth',name:'Personal Net Worth Snapshot',fields:[{key:'cash',label:'Cash & bank balances',type:'number',default:0},{key:'investments',label:'Investments & deposits',type:'number',default:0},{key:'property',label:'Property / vehicle current value',type:'number',default:0},{key:'otherAssets',label:'Other assets',type:'number',default:0},{key:'cards',label:'Credit card balances',type:'number',default:0},{key:'loans',label:'Home / vehicle / personal loans',type:'number',default:0},{key:'otherDebt',label:'Other debts',type:'number',default:0}],compute:v=>{const assets=['cash','investments','property','otherAssets'].reduce((s,k)=>s+Math.max(0,num(v[k])),0),debts=['cards','loans','otherDebt'].reduce((s,k)=>s+Math.max(0,num(v[k])),0);return[{label:'Total assets',value:fmtCur(assets)},{label:'Total liabilities',value:fmtCur(debts)},{label:'Estimated net worth',value:fmtCur(assets-debts),emphasis:true},{label:'Liquid cash & bank',value:fmtCur(Math.max(0,num(v.cash)))}] }},
    {id:'debtstrategy',name:'Debt Payoff · Snowball / Avalanche',fields:[{key:'strategy',label:'Payoff order',type:'select',options:['Avalanche · highest rate first','Snowball · smallest balance first'],default:'Avalanche · highest rate first'},{key:'balance1',label:'Debt 1 balance',type:'number',default:0},{key:'rate1',label:'Debt 1 interest rate % p.a.',type:'number',default:0},{key:'min1',label:'Debt 1 minimum payment / month',type:'number',default:0},{key:'balance2',label:'Debt 2 balance',type:'number',default:0},{key:'rate2',label:'Debt 2 interest rate % p.a.',type:'number',default:0},{key:'min2',label:'Debt 2 minimum payment / month',type:'number',default:0},{key:'balance3',label:'Debt 3 balance',type:'number',default:0},{key:'rate3',label:'Debt 3 interest rate % p.a.',type:'number',default:0},{key:'min3',label:'Debt 3 minimum payment / month',type:'number',default:0},{key:'extra',label:'Extra monthly amount toward debt',type:'number',default:0}],compute:v=>{const debts=[1,2,3].map(i=>({balance:Math.round(Math.max(0,num(v['balance'+i]))*100)/100,rate:Math.max(0,num(v['rate'+i])),min:Math.max(0,num(v['min'+i]))})).filter(d=>d.balance>0.009),extra=Math.max(0,num(v.extra)),strategy=String(v.strategy||'').startsWith('Snowball')?'Snowball':'Avalanche';if(!debts.length)return[{label:'Debt payoff plan',value:'Enter at least one debt balance',emphasis:true}];let months=0,paid=0,interest=0,cleared=true;while(debts.some(d=>d.balance>0.009)&&months<1200){months++;let monthlyInterest=0,minimumPaid=0;debts.forEach(d=>{if(d.balance<=0.009){d.balance=0;return;}const charge=Math.round(d.balance*d.rate/1200*100)/100;d.balance=Math.round((d.balance+charge)*100)/100;interest+=charge;monthlyInterest+=charge;const pmt=Math.min(d.min,d.balance);d.balance=Math.round((d.balance-pmt)*100)/100;minimumPaid+=pmt;paid+=pmt;});let remaining=extra+debts.reduce((s,d)=>s+d.min,0)-minimumPaid;const order=debts.filter(d=>d.balance>0.009).sort((a,b)=>strategy==='Snowball'?(a.balance-b.balance):(b.rate-a.rate||a.balance-b.balance));for(const d of order){if(remaining<=0)break;const pmt=Math.min(d.balance,remaining);d.balance=Math.round((d.balance-pmt)*100)/100;remaining=Math.round((remaining-pmt)*100)/100;paid+=pmt;}if(debts.some(d=>d.balance>0.009)&&debts.every(d=>d.balance>0.009&&d.min<=0)&&extra<=0){cleared=false;break;}if(debts.every(d=>d.balance>0.009)&&minimumPaid+extra<=monthlyInterest+0.009){cleared=false;break;}}if(debts.some(d=>d.balance>0.009))cleared=false;return cleared?[{label:'Payoff strategy',value:strategy},{label:'Debt-free in',value:`${months} month${months===1?'':'s'}`,emphasis:true},{label:'Estimated total interest',value:fmtCur(interest)},{label:'Estimated total paid',value:fmtCur(paid)},{label:'Interest assumption',value:'Monthly rate = APR ÷ 12'}]:[{label:'Payoff estimate',value:'This payment plan does not clear the entered balances',emphasis:true},{label:'Review',value:'Increase monthly payments or check the interest rates and minimums.'}] }},
    {id:'recurringcost',name:'Bills & Subscriptions Cost',fields:[{key:'amount1',label:'Payment 1 amount',type:'number',default:0},{key:'cycle1',label:'Payment 1 frequency',type:'select',options:['Monthly','Weekly','Quarterly','Yearly'],default:'Monthly'},{key:'amount2',label:'Payment 2 amount',type:'number',default:0},{key:'cycle2',label:'Payment 2 frequency',type:'select',options:['Monthly','Weekly','Quarterly','Yearly'],default:'Monthly'},{key:'amount3',label:'Payment 3 amount',type:'number',default:0},{key:'cycle3',label:'Payment 3 frequency',type:'select',options:['Monthly','Weekly','Quarterly','Yearly'],default:'Monthly'},{key:'amount4',label:'Payment 4 amount',type:'number',default:0},{key:'cycle4',label:'Payment 4 frequency',type:'select',options:['Monthly','Weekly','Quarterly','Yearly'],default:'Monthly'}],compute:v=>{const m={Monthly:1,Weekly:52/12,Quarterly:1/3,Yearly:1/12};const monthly=[1,2,3,4].reduce((s,i)=>s+Math.max(0,num(v['amount'+i]))*(m[v['cycle'+i]]||1),0);return[{label:'Estimated monthly cost',value:fmtCur(monthly),emphasis:true},{label:'Estimated yearly cost',value:fmtCur(monthly*12)},{label:'Average weekly cost',value:fmtCur(monthly*12/52)}] }},
    {id:'billreserve',name:'Upcoming Bills Reserve',fields:[{key:'bill1',label:'Upcoming bill 1',type:'number',default:0},{key:'bill2',label:'Upcoming bill 2',type:'number',default:0},{key:'bill3',label:'Upcoming bill 3',type:'number',default:0},{key:'bill4',label:'Upcoming bill 4',type:'number',default:0},{key:'saved',label:'Money already reserved',type:'number',default:0},{key:'days',label:'Days until bills are due',type:'number',default:7}],compute:v=>{const total=[1,2,3,4].reduce((s,i)=>s+Math.max(0,num(v['bill'+i])),0),saved=Math.max(0,num(v.saved)),gap=Math.max(0,total-saved),days=Math.max(1,Math.floor(num(v.days)));return[{label:'Bills due',value:fmtCur(total)},{label:'Still to reserve',value:fmtCur(gap),emphasis:true},{label:'Set aside per day',value:fmtCur(gap/days)},{label:'Already covered',value:fmtCur(Math.min(total,saved))}] }},
    {id:'khataamount',name:'Khata · Udhaar Balance',fields:[{key:'direction',label:'Who owes?',type:'select',options:['They owe me','I owe them'],default:'They owe me'},{key:'amount',label:'Original amount',type:'number',default:''},{key:'paid',label:'Total payments received / made',type:'number',default:0},{key:'payments',label:'Number of partial payments',type:'number',default:0}],compute:v=>{const amount=Math.max(0,num(v.amount)),paid=Math.max(0,num(v.paid)),direction=v.direction||'They owe me';return[{label:'Direction',value:direction},{label:'Outstanding balance',value:fmtCur(Math.max(0,amount-paid)),emphasis:true},{label:'Payments recorded',value:fmtNum(Math.max(0,Math.floor(num(v.payments))))},{label:'Overpaid / credit',value:fmtCur(Math.max(0,paid-amount))}] }},
    {id:'splitsettlement',name:'Shared Bill · Custom Split & Settle',fields:[{key:'total',label:'Total bill',type:'number',default:''},{key:'shareA',label:'Person A share %',type:'number',default:25},{key:'shareB',label:'Person B share %',type:'number',default:25},{key:'shareC',label:'Person C share %',type:'number',default:25},{key:'shareD',label:'Person D share %',type:'number',default:25},{key:'paidA',label:'Person A paid',type:'number',default:0},{key:'paidB',label:'Person B paid',type:'number',default:0},{key:'paidC',label:'Person C paid',type:'number',default:0},{key:'paidD',label:'Person D paid',type:'number',default:0}],compute:v=>{const total=Math.max(0,num(v.total)),shares=[1,2,3,4].map(i=>Math.max(0,num(v['share'+String.fromCharCode(64+i)]))),paid=[1,2,3,4].map(i=>Math.max(0,num(v['paid'+String.fromCharCode(64+i)]))),shareTotal=shares.reduce((s,n)=>s+n,0),paidTotal=paid.reduce((s,n)=>s+n,0);if(Math.abs(shareTotal-100)>0.01)return[{label:'Split shares must total 100%',value:`Current total: ${fmtNum(shareTotal)}%`,emphasis:true}];if(Math.abs(paidTotal-total)>0.01)return[{label:'Payments must match the bill total',value:`Bill: ${fmtCur(total)} · Paid: ${fmtCur(paidTotal)}`,emphasis:true}];const results=[{label:'Equalized bill total',value:fmtCur(total),emphasis:true}];['A','B','C','D'].forEach((person,i)=>{const balance=paid[i]-total*shares[i]/100;results.push({label:`Person ${person} share`,value:fmtCur(total*shares[i]/100)});results.push({label:`Person ${person} settlement`,value:Math.abs(balance)<0.005?'Settled':balance>0?'Gets back '+fmtCur(balance):'Owes '+fmtCur(-balance)});});return results} },
    {id:'expensebook',name:'Business Expenses · Category & Balance',fields:[{key:'sales',label:'Sales / income',type:'number',default:0},{key:'rent',label:'Rent',type:'number',default:0},{key:'staff',label:'Staff & wages',type:'number',default:0},{key:'stock',label:'Stock / material purchases',type:'number',default:0},{key:'utility',label:'Utilities & phone',type:'number',default:0},{key:'transport',label:'Transport & delivery',type:'number',default:0},{key:'other',label:'Other expenses',type:'number',default:0},{key:'days',label:'Period length (days)',type:'number',default:30}],compute:v=>{const inc=num(v.sales),expense=num(v.rent)+num(v.staff)+num(v.stock)+num(v.utility)+num(v.transport)+num(v.other),net=inc-expense,days=Math.max(1,num(v.days));return[{label:'Total expenses',value:fmtCur(expense)},{label:'Net balance',value:fmtCur(net),emphasis:true},{label:'Average daily balance',value:fmtCur(net/days)},{label:'Expense ratio',value:fmtPct(inc?expense/inc*100:0)}]}},
    {id:'transportquote',name:'Transport · Trip & Delivery Cost',fields:[{key:'distance',label:'Distance (km)',type:'number',default:''},{key:'mileage',label:'Vehicle mileage (km/L)',type:'number',default:''},{key:'fuel',label:'Fuel price / L',type:'number',default:''},{key:'toll',label:'Toll & permits',type:'number',default:0},{key:'driver',label:'Driver / trip',type:'number',default:0},{key:'load',label:'Load (tonnes)',type:'number',default:0},{key:'rate',label:'Charge per tonne-km',type:'number',default:0}],compute:v=>{const d=num(v.distance),m=num(v.mileage),fuel=m>0?d/m*num(v.fuel):0,other=num(v.toll)+num(v.driver),cost=fuel+other,revenue=d*num(v.load)*num(v.rate);return[{label:'Fuel estimate',value:fmtCur(fuel)},{label:'Trip operating cost',value:fmtCur(cost),emphasis:true},{label:'Freight revenue estimate',value:fmtCur(revenue)},{label:'Trip balance',value:fmtCur(revenue-cost)}]}},
    {id:'factorybatch',name:'Small Factory · Unit Production Cost',fields:[{key:'material',label:'Raw materials / batch',type:'number',default:''},{key:'labor',label:'Direct labour / batch',type:'number',default:''},{key:'power',label:'Power & machine cost',type:'number',default:0},{key:'packaging',label:'Packaging / batch',type:'number',default:0},{key:'overhead',label:'Factory overhead / batch',type:'number',default:0},{key:'quantity',label:'Good units produced',type:'number',default:''},{key:'scrap',label:'Scrap / rejected units',type:'number',default:0},{key:'price',label:'Selling price / good unit',type:'number',default:''}],compute:v=>{const total=num(v.material)+num(v.labor)+num(v.power)+num(v.packaging)+num(v.overhead),good=Math.max(0,num(v.quantity)-num(v.scrap)),unit=good?total/good:0,sales=good*num(v.price);return[{label:'Production cost / batch',value:fmtCur(total)},{label:'Cost per good unit',value:fmtCur(unit),emphasis:true},{label:'Good units',value:fmtNum(good)},{label:'Batch gross profit estimate',value:fmtCur(sales-total)}]}},
  ]},
  { name:'Custom', items:[
    {id:'customcalc',name:'Custom Calculator Builder',fields:[{key:'customName',label:'Name your calculator',type:'text',default:'My Calculator',placeholder:'e.g. Custom Quote'},{key:'formula',label:'Formula · use A–H',type:'text',default:'(A+B)*C',placeholder:'(A+B)*C'},{key:'a',label:'A · input 1',type:'number',default:0},{key:'b',label:'B · input 2',type:'number',default:0},{key:'c',label:'C · input 3',type:'number',default:1},{key:'d',label:'D · input 4',type:'number',default:0},{key:'e',label:'E · input 5',type:'number',default:0},{key:'f',label:'F · input 6',type:'number',default:0},{key:'g',label:'G · input 7',type:'number',default:0},{key:'h',label:'H · input 8',type:'number',default:0}],compute:v=>{try{return[{label:escapeHtml(v.customName||'Custom result'),value:fmtNum(evalCustomFormula(v.formula,v)),emphasis:true},{label:'Formula',value:String(v.formula||'—')}] }catch(e){return[{label:'Formula help',value:e.message,emphasis:true}]}}},
  ]},  ];
  // The Expenses section is a calculation catalog only. Planning and reserve
  // workflows belong elsewhere, so keep them out of this category.
  const expensesCategory = CATEGORIES.find(c=>c.name==='Expenses & Personal Finance');
  expensesCategory.items = expensesCategory.items.filter(it=>!['monthlybudget','dailyspend','savingsgoalplan','emergencyfundplan','billreserve'].includes(it.id));
  const expenseCalc = expensesCategory.items.find(it=>it.id==='incomesummary');
  expenseCalc.name = 'Income & Expense Calculator';
  expenseCalc.fields = [
    {key:'opening',label:'Starting balance',type:'number',default:0},
    {key:'salary',label:'Salary / regular income',type:'number',default:0},
    {key:'business',label:'Business / freelance income',type:'number',default:0},
    {key:'rental',label:'Rental / investment income',type:'number',default:0},
    {key:'otherIncome',label:'Other income',type:'number',default:0},
    {key:'housing',label:'Housing / rent',type:'number',default:0},
    {key:'groceries',label:'Groceries / household',type:'number',default:0},
    {key:'utilities',label:'Utilities / phone / internet',type:'number',default:0},
    {key:'transport',label:'Transport / fuel',type:'number',default:0},
    {key:'health',label:'Health / medical',type:'number',default:0},
    {key:'education',label:'Education',type:'number',default:0},
    {key:'emi',label:'Loan / credit payments',type:'number',default:0},
    {key:'insurance',label:'Insurance',type:'number',default:0},
    {key:'subscriptions',label:'Subscriptions / recurring bills',type:'number',default:0},
    {key:'shopping',label:'Shopping / personal',type:'number',default:0},
    {key:'dining',label:'Dining / entertainment',type:'number',default:0},
    {key:'family',label:'Family / childcare',type:'number',default:0},
    {key:'travel',label:'Travel / other',type:'number',default:0},
    {key:'otherExpense',label:'Other expenses',type:'number',default:0},
    {key:'days',label:'Period length (days)',type:'number',default:30}
  ];
  expenseCalc.compute = v=>{
    const incomeKeys=['salary','business','rental','otherIncome'];
    const categories=[['Housing / rent','housing'],['Groceries / household','groceries'],['Utilities / phone / internet','utilities'],['Transport / fuel','transport'],['Health / medical','health'],['Education','education'],['Loan / credit payments','emi'],['Insurance','insurance'],['Subscriptions / recurring bills','subscriptions'],['Shopping / personal','shopping'],['Dining / entertainment','dining'],['Family / childcare','family'],['Travel / other','travel'],['Other expenses','otherExpense']];
    const income=incomeKeys.reduce((sum,key)=>sum+Math.max(0,num(v[key])),0);
    const expenses=categories.reduce((sum,[,key])=>sum+Math.max(0,num(v[key])),0);
    const net=income-expenses,opening=num(v.opening),days=Math.max(1,Math.floor(num(v.days)||30));
    const largest=categories.map(([label,key])=>({label,value:Math.max(0,num(v[key]))})).sort((a,b)=>b.value-a.value)[0];
    return [
      {label:'Total income',value:fmtCur(income)},
      {label:'Total expenses',value:fmtCur(expenses)},
      {label:'Income after expenses',value:fmtCur(net),emphasis:true},
      {label:'Balance after this period',value:fmtCur(opening+net)},
      {label:'Expense-to-income ratio',value:income?fmtPct(expenses/income*100):'Enter income'},
      {label:'Net savings rate',value:income?fmtPct(net/income*100):'Enter income'},
      {label:'Average expense per day',value:fmtCur(expenses/days)},
      {label:'Largest expense category',value:largest&&largest.value>0?`${largest.label} · ${fmtCur(largest.value)}`:'No expenses entered'}
    ];
  };
  const netWorthCalc=expensesCategory.items.find(it=>it.id==='networth');
  netWorthCalc.name='Assets & Net Worth Calculator';
  netWorthCalc.fields=[
    {key:'cash',label:'Cash on hand',type:'number',default:0},
    {key:'bank',label:'Bank balances',type:'number',default:0},
    {key:'deposits',label:'Fixed / recurring deposits',type:'number',default:0},
    {key:'investments',label:'Stocks / mutual funds',type:'number',default:0},
    {key:'retirement',label:'EPF / PPF / NPS / retirement',type:'number',default:0},
    {key:'property',label:'Property current market value',type:'number',default:0},
    {key:'vehicles',label:'Vehicles current resale value',type:'number',default:0},
    {key:'businessAssets',label:'Business ownership / assets',type:'number',default:0},
    {key:'jewellery',label:'Gold / jewellery resale value',type:'number',default:0},
    {key:'otherAssets',label:'Other assets',type:'number',default:0},
    {key:'homeLoan',label:'Home loan outstanding',type:'number',default:0},
    {key:'vehicleLoan',label:'Vehicle loan outstanding',type:'number',default:0},
    {key:'personalLoan',label:'Personal loans outstanding',type:'number',default:0},
    {key:'educationLoan',label:'Education loan outstanding',type:'number',default:0},
    {key:'cards',label:'Credit card balances',type:'number',default:0},
    {key:'businessDebt',label:'Business liabilities',type:'number',default:0},
    {key:'otherDebt',label:'Other liabilities',type:'number',default:0}
  ];
  netWorthCalc.compute=v=>{
    const assetGroups=[['Cash', 'cash'],['Bank', 'bank'],['Deposits','deposits'],['Stocks / funds','investments'],['Retirement','retirement'],['Property','property'],['Vehicles','vehicles'],['Business','businessAssets'],['Gold / jewellery','jewellery'],['Other assets','otherAssets']];
    const debtGroups=[['Home loan','homeLoan'],['Vehicle loan','vehicleLoan'],['Personal loans','personalLoan'],['Education loan','educationLoan'],['Credit cards','cards'],['Business liabilities','businessDebt'],['Other liabilities','otherDebt']];
    const sum=groups=>groups.reduce((total,[,key])=>total+Math.max(0,num(v[key])),0);
    const assets=sum(assetGroups),liabilities=sum(debtGroups),liquidAssets=['cash','bank','deposits','investments'].reduce((total,key)=>total+Math.max(0,num(v[key])),0);
    const largest=assetGroups.map(([label,key])=>({label,value:Math.max(0,num(v[key]))})).sort((a,b)=>b.value-a.value)[0];
    return [
      {label:'Total assets',value:fmtCur(assets)},
      {label:'Total liabilities',value:fmtCur(liabilities)},
      {label:'Estimated net worth',value:fmtCur(assets-liabilities),emphasis:true},
      {label:'Liquid assets',value:fmtCur(liquidAssets)},
      {label:'Liquid net worth',value:fmtCur(liquidAssets-liabilities)},
      {label:'Liabilities / assets',value:assets?fmtPct(liabilities/assets*100):'—'},
      {label:'Largest asset category',value:largest&&largest.value>0?`${largest.label} · ${fmtCur(largest.value)}`:'No assets entered'}
    ];
  };
  const CALC_MAP = {};
  CATEGORIES.forEach(c=> c.items.forEach(it=> CALC_MAP[it.id]=it));

return { categories: CATEGORIES, map: CALC_MAP };
})();

const catalog = __engine;
const all = catalog.categories.flatMap(category =>
  category.items.map(item => ({ id: item.id, name: item.name, category: category.name }))
);
const categoryOf = new Map(all.map(item => [item.id, item.category]));
const ids = new Set(all.map(item => item.id));
const numberFields = new Set(['number']);
const selectionFields = new Set(['select', 'pills', 'currency']);

const catalogSize = all.length;
const categories = catalog.categories.map(category => ({
  name: category.name,
  count: category.items.length,
}));

function listCalculators({ query = '', category = '', limit = 20, offset = 0 } = {}) {
  const q = query.toLowerCase().trim();
  const matches = all.filter(item =>
    (!q || `${item.name} ${item.id} ${item.category}`.toLowerCase().includes(q)) &&
    (!category || item.category.toLowerCase() === category.toLowerCase())
  );
  return {
    total: matches.length,
    catalogTotal: catalogSize,
    offset,
    calculators: matches.slice(offset, offset + limit),
    categories,
    website: 'https://seventaskcalculator.in/calculator',
  };
}

function availableOptions(field, values) {
  const options = typeof field.options === 'function' ? field.options(values) : (field.options ?? []);
  return options.map(option => typeof option === 'object' && option !== null
    ? { value: option.value, label: option.label ?? String(option.value) }
    : { value: option, label: String(option) });
}

function resolveDefault(field, values) {
  return typeof field.default === 'function' ? field.default(values) : field.default;
}

function getCalculator(id, selections = {}) {
  if (!ids.has(id)) throw new Error(`Unknown calculator: ${id}. Call list_calculators first.`);
  const item = catalog.map[id];
  const values = { ...selections };
  const fields = item.fields.map(field => {
    const fallback = resolveDefault(field, values);
    if (!(field.key in values)) values[field.key] = fallback;
    const details = {
      key: field.key,
      label: field.label,
      type: field.type,
      default: fallback ?? '',
    };
    if (selectionFields.has(field.type)) {
      let options = availableOptions(field, values);
      if (id === 'unitconverter' && field.key === 'cat') {
        options = options.filter(option => option.value !== 'Currency');
      }
      details.options = options;
    }
    if (field.placeholder) details.placeholder = field.placeholder;
    return details;
  });
  return { id, name: item.name, category: categoryOf.get(id), fields,
    notes: id === 'currency' ? 'Currency values use Frankfurter daily reference rates (not trading quotes).' : undefined };
}

function coerce(field, raw, values) {
  if (numberFields.has(field.type)) {
    if (raw === '' || raw === null) return '';
    const n = typeof raw === 'number' ? raw : Number(raw);
    if (!Number.isFinite(n) || Math.abs(n) > 1e12) throw new Error(`${field.label}: enter a finite number no larger than 1 trillion.`);
    return n;
  }
  if (selectionFields.has(field.type)) {
    const options = availableOptions(field, values);
    if (field.key === 'cat' && values.__calculatorId === 'unitconverter' && raw === 'Currency') {
      throw new Error('For currency rates, use the Currency Converter calculator instead.');
    }
    const match = options.find(option => String(option.value) === String(raw));
    if (!match) throw new Error(`${field.label}: choose one of ${options.map(o => o.value).join(', ')}.`);
    return match.value;
  }
  if (field.type === 'date') {
    if (raw === '') return '';
    if (typeof raw !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(raw)) throw new Error(`${field.label}: use YYYY-MM-DD.`);
    const [year, month, day] = raw.split('-').map(Number);
    const d = new Date(Date.UTC(year, month - 1, day));
    if (d.getUTCFullYear() !== year || d.getUTCMonth() + 1 !== month || d.getUTCDate() !== day) {
      throw new Error(`${field.label}: invalid calendar date.`);
    }
    return raw;
  }
  if (field.type === 'time') {
    if (raw === '') return '';
    if (typeof raw !== 'string' || !/^([01]\d|2[0-3]):[0-5]\d$/.test(raw)) throw new Error(`${field.label}: use HH:MM.`);
    return raw;
  }
  if (typeof raw !== 'string' || raw.length > 240) throw new Error(`${field.label}: enter text under 240 characters.`);
  return raw;
}

function cleanRows(rows) {
  if (!Array.isArray(rows) || rows.length > 100) throw new Error('Calculator returned an unexpected number of results.');
  return JSON.parse(JSON.stringify(rows, (_key, value) => {
    if (typeof value === 'number' && !Number.isFinite(value)) return null;
    return value;
  }));
}

function calculate(id, inputs = {}) {
  if (!ids.has(id)) throw new Error(`Unknown calculator: ${id}. Call list_calculators first.`);
  if (!inputs || Array.isArray(inputs) || typeof inputs !== 'object') throw new Error('inputs must be an object.');
  const item = catalog.map[id];
  const allowed = new Set(item.fields.map(field => field.key));
  const extra = Object.keys(inputs).filter(key => !allowed.has(key));
  if (extra.length) throw new Error(`Unrecognized fields: ${extra.join(', ')}. Call get_calculator to see field names.`);

  const values = { __calculatorId: id };
  for (const field of item.fields) {
    const raw = Object.hasOwn(inputs, field.key) ? inputs[field.key] : resolveDefault(field, values);
    values[field.key] = coerce(field, raw ?? '', values);
  }
  delete values.__calculatorId;

  // Avoid unbounded iteration in formulas when an input contains a huge tenure.
  if (Number(values.years) > 100 || Number(values.months) > 1200) {
    throw new Error('Tenure is limited to 100 years or 1200 months.');
  }
  const rows = item.compute(values);
    return {
      id,
      name: item.name,
      category: categoryOf.get(id),
      inputs: values,
      results: cleanRows(rows),
      source: 'SevenTask Calculator',
      website: 'https://seventaskcalculator.in/calculator',
      disclaimer: /Tax|Investment|Retirement|Loan|Credit|Health|Property|Savings|Market/.test(categoryOf.get(id))
        ? 'Illustrative estimate only. Check current rules, rates, and professional guidance before decisions.'
        : undefined,
    };
}

async function calculateCurrency({ from, to, amount }) {
  const codes = /^[A-Z]{3}$/;
  if (!codes.test(from) || !codes.test(to)) throw new Error('Use 3-letter ISO currency codes, such as USD and INR.');
  if (!Number.isFinite(amount) || Math.abs(amount) > 1e12) throw new Error('Enter a valid currency amount.');
  let quote = { rate: 1, date: new Date().toISOString().slice(0, 10) };
  if (from !== to) {
    const response = await fetch(`https://api.frankfurter.dev/v2/rate/${from.toLowerCase()}/${to.toLowerCase()}`, {
      signal: AbortSignal.timeout(7000),
      headers: { accept: 'application/json' },
    });
    if (!response.ok) throw new Error(`Currency provider is unavailable (${response.status}).`);
    quote = await response.json();
  }
  const rate = Number(quote.rate);
  if (!Number.isFinite(rate) || rate <= 0) throw new Error('Currency provider returned an invalid rate.');
  const formatted = new Intl.NumberFormat('en-IN', { maximumFractionDigits: 4 }).format(amount * rate);
  return {
    id: 'currency', name: 'Currency Converter', category: 'Currency',
    inputs: { from, to, value: amount },
    results: [
      { label: `${amount} ${from} converts to`, value: `${formatted} ${to}`, emphasis: true },
      { label: `1 ${from}`, value: `${rate} ${to}` },
      { label: 'Reference date', value: quote.date },
    ],
    source: 'Frankfurter daily reference rate',
    website: 'https://seventaskcalculator.in/calculator',
    disclaimer: 'Daily reference rate, not a live trading or bank quote.',
  };
}


const WIDGET_HTML = "<!doctype html>\n<html lang=\"en\">\n<head>\n  <meta charset=\"utf-8\" />\n  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1\" />\n  <meta name=\"color-scheme\" content=\"light dark\" />\n  <title>SevenTask Calculator</title>\n  <style>\n    :root { font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, \"Segoe UI\", sans-serif; color-scheme: light; }\n    * { box-sizing: border-box; }\n    body { margin: 0; padding: 4px; background: transparent; color: #121714; }\n    .card { border: 1px solid #dfe4df; background: #fff; border-radius: 22px; overflow: hidden; box-shadow: 0 9px 28px #1c322412; }\n    .top { background: #111a14; color: #fff; padding: 22px 24px 20px; }\n    .brandline { display: flex; align-items: center; justify-content: space-between; gap: 12px; }\n    .brand { display: flex; align-items: center; gap: 10px; font-size: 13px; font-weight: 800; letter-spacing: -.02em; }\n    .icon { width: 35px; height: 35px; border: 1px solid #526e5a; border-radius: 11px; display: grid; grid-template-columns: repeat(2, 6px); grid-template-rows: repeat(2, 6px); align-content: center; justify-content: center; gap: 4px; background: #19291e; }\n    .icon b { background: #a7eb8f; border-radius: 2px; }\n    .icon b:nth-child(2) { opacity: .56; }\n    .badge { color: #b2ddb7; border: 1px solid #46674f; border-radius: 999px; font-size: 10px; letter-spacing: .06em; font-weight: 700; padding: 6px 10px; text-transform: uppercase; white-space: nowrap; }\n    .eyebrow { margin: 24px 0 8px; color: #aec4b1; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: .14em; }\n    h1 { font-size: clamp(20px, 4.5vw, 28px); letter-spacing: -.045em; line-height: 1.16; margin: 0; font-weight: 800; }\n    .hero-value { margin-top: 18px; font-size: clamp(27px, 6.8vw, 39px); font-weight: 780; line-height: 1.18; color: #c7f8a9; letter-spacing: -.05em; overflow-wrap: anywhere; }\n    .hero-label { font-size: 12px; color: #c2d0c3; margin-top: 6px; }\n    .results { padding: 4px 23px 2px; }\n    .row { display: flex; align-items: flex-start; justify-content: space-between; gap: 14px; padding: 14px 1px; border-bottom: 1px solid #e9eee9; font-size: 13px; }\n    .row:last-child { border-bottom: 0; }\n    .row span:first-child { color: #5b6860; }\n    .row strong { text-align: right; font-weight: 800; color: #13251b; overflow-wrap: anywhere; }\n    .table-head { padding: 18px 24px 4px; font-weight: 800; font-size: 13px; }\n    .table-wrap { overflow-x: auto; padding: 0 23px 10px; }\n    table { border-collapse: collapse; font-size: 11px; width: 100%; min-width: 300px; }\n    th, td { padding: 9px 7px; border-bottom: 1px solid #e8eee7; text-align: right; }\n    th:first-child, td:first-child { text-align: left; }\n    th { color: #6d7d70; background: #f6f9f6; }\n    .foot { padding: 16px 23px 20px; background: #f6f9f5; border-top: 1px solid #e5ece5; }\n    .note { color: #6b796e; font-size: 11px; line-height: 1.5; margin: 0 0 13px; }\n    .actions { display: flex; gap: 8px; flex-wrap: wrap; }\n    button, a.button { border: 1px solid #cbd8ca; border-radius: 11px; background: #fff; padding: 10px 13px; font: inherit; font-size: 12px; font-weight: 750; color: #193521; text-decoration: none; cursor: pointer; display: inline-flex; align-items: center; justify-content: center; gap: 5px; }\n    button.primary { background: #16271b; color: #e2f8dc; border-color: #16271b; }\n    button:disabled { opacity: .55; cursor: wait; }\n    button:focus-visible, a:focus-visible, input:focus-visible { outline: 3px solid #83bb69; outline-offset: 2px; }\n    #editor { display: none; padding: 4px 23px 20px; background: #f9fbf8; }\n    #editor.open { display: block; }\n    #editor h2 { font-size: 15px; margin: 14px 0; }\n    .input-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(130px, 1fr)); gap: 11px; margin-bottom: 15px; }\n    label { display: flex; flex-direction: column; gap: 5px; font-size: 11px; color: #536558; }\n    input { min-width: 0; width: 100%; border: 1px solid #cbd7ca; border-radius: 9px; padding: 10px; font: inherit; font-size: 13px; background: #fff; color: #142219; }\n    #error { font-size: 12px; color: #9b3329; margin: 10px 0; min-height: 0; }\n    .empty { padding: 24px; font-size: 13px; line-height: 1.6; color: #55685b; }\n    .empty strong { color: #15351f; }\n    @media (prefers-color-scheme: dark) { .card { border-color: #46554a; } }\n    @media (max-width: 410px) { .top { padding: 18px; } .results, .table-wrap { padding-left: 17px; padding-right: 17px; } .foot, #editor { padding-left: 17px; padding-right: 17px; } }\n  </style>\n</head>\n<body>\n  <main class=\"card\">\n    <header class=\"top\">\n      <div class=\"brandline\">\n        <div class=\"brand\"><div class=\"icon\" aria-hidden=\"true\"><b></b><b></b><b></b><b></b></div><span>SevenTask Calculator</span></div>\n        <span class=\"badge\">Kawkab Tech Labs</span>\n      </div>\n      <div class=\"eyebrow\" id=\"category\">Calculation workspace</div>\n      <h1 id=\"title\">Calculate anything with clarity.</h1>\n      <div class=\"hero-value\" id=\"hero\">136+ tools</div>\n      <div class=\"hero-label\" id=\"hero-label\">Ask ChatGPT for a calculation</div>\n    </header>\n    <section id=\"results\" class=\"results\" aria-live=\"polite\"><div class=\"empty\">Your calculation will appear here. Try <strong>“Calculate EMI for ₹10 lakh at 9% for 5 years”</strong>.</div></section>\n    <section id=\"tables\"></section>\n    <form id=\"editor\" novalidate>\n      <h2>Edit inputs</h2>\n      <div id=\"fields\" class=\"input-grid\"></div>\n      <div id=\"error\" role=\"alert\"></div>\n      <button class=\"primary\" id=\"recalculate\" type=\"submit\">Recalculate →</button>\n    </form>\n    <footer class=\"foot\">\n      <p class=\"note\" id=\"note\">Built on the original SevenTask calculation engine.</p>\n      <div class=\"actions\">\n        <button id=\"edit\" type=\"button\" hidden>Edit values</button>\n        <a class=\"button\" href=\"https://seventaskcalculator.in/calculator\" target=\"_blank\" rel=\"noopener noreferrer\">Explore all calculators ↗</a>\n      </div>\n    </footer>\n  </main>\n  <script>\n    (() => {\n      const $ = id => document.getElementById(id);\n      let current = null;\n      let rpcId = 0;\n      const pending = new Map();\n      const rpcNotify = (method, params) => window.parent.postMessage({ jsonrpc: '2.0', method, params }, '*');\n      const rpcRequest = (method, params) => new Promise((resolve, reject) => {\n        const id = ++rpcId;\n        pending.set(id, { resolve, reject });\n        window.parent.postMessage({ jsonrpc: '2.0', id, method, params }, '*');\n      });\n\n      function update(reply) {\n        const data = reply?.structuredContent ?? reply;\n        if (!data || !Array.isArray(data.results)) return;\n        current = data;\n        $('category').textContent = data.category || 'SevenTask';\n        $('title').textContent = data.name || 'Calculation';\n        const focus = data.results.find(r => r.emphasis && r.type !== 'table') || data.results.find(r => r.type !== 'table');\n        $('hero').textContent = String(focus?.value ?? 'Complete');\n        $('hero-label').textContent = String(focus?.label ?? 'Result');\n        const rows = data.results.filter(r => r.type !== 'table' && r !== focus);\n        $('results').replaceChildren(...rows.map(row => {\n          const el = document.createElement('div'); el.className = 'row';\n          const label = document.createElement('span'); label.textContent = String(row.label ?? 'Result');\n          const value = document.createElement('strong'); value.textContent = String(row.value ?? '—');\n          el.append(label, value); return el;\n        }));\n        $('tables').replaceChildren();\n        for (const result of data.results.filter(row => row.type === 'table')) {\n          const heading = document.createElement('div'); heading.className = 'table-head'; heading.textContent = result.title || 'Breakdown';\n          const wrap = document.createElement('div'); wrap.className = 'table-wrap';\n          const table = document.createElement('table');\n          const columns = Object.keys((result.rows || [])[0] || {});\n          const thead = document.createElement('thead'), thRow = document.createElement('tr');\n          for (const col of columns) { const th = document.createElement('th'); th.textContent = col; thRow.append(th); }\n          thead.append(thRow); table.append(thead);\n          const tbody = document.createElement('tbody');\n          for (const item of (result.rows || []).slice(0, 120)) {\n            const tr = document.createElement('tr');\n            for (const col of columns) { const td = document.createElement('td'); td.textContent = String(item[col] ?? '—'); tr.append(td); }\n            tbody.append(tr);\n          }\n          table.append(tbody); wrap.append(table); $('tables').append(heading, wrap);\n        }\n        $('note').textContent = data.disclaimer || 'Powered by the SevenTask Calculator engine.';\n        $('edit').hidden = !data.inputs || !Object.keys(data.inputs).length;\n        $('editor').classList.remove('open');\n      }\n\n      window.addEventListener('message', event => {\n        if (event.source !== window.parent) return;\n        const message = event.data;\n        if (!message || message.jsonrpc !== '2.0') return;\n        if (typeof message.id === 'number') {\n          const resolver = pending.get(message.id);\n          if (!resolver) return;\n          pending.delete(message.id);\n          if (message.error) resolver.reject(message.error); else resolver.resolve(message.result);\n        } else if (message.method === 'ui/notifications/tool-result') update(message.params);\n      }, { passive: true });\n\n      const bridgeReady = rpcRequest('ui/initialize', {\n        appInfo: { name: 'seventask-results', version: '0.1.0' },\n        appCapabilities: {}, protocolVersion: '2026-01-26',\n      }).then(() => rpcNotify('ui/notifications/initialized', {})).catch(() => {});\n\n      if (window.openai?.toolOutput) update({ structuredContent: window.openai.toolOutput });\n\n      $('edit').addEventListener('click', () => {\n        if (!current) return;\n        $('fields').replaceChildren();\n        for (const [key, value] of Object.entries(current.inputs || {})) {\n          const label = document.createElement('label'); label.textContent = key.replaceAll(/([A-Z])/g, ' $1').replaceAll('_', ' ');\n          const field = document.createElement('input'); field.name = key;\n          field.type = typeof value === 'number' ? 'number' : 'text';\n          if (typeof value === 'number') field.step = 'any';\n          field.value = String(value ?? ''); label.append(field); $('fields').append(label);\n        }\n        $('error').textContent = '';\n        $('editor').classList.toggle('open');\n      });\n\n      $('editor').addEventListener('submit', async event => {\n        event.preventDefault();\n        if (!current) return;\n        const button = $('recalculate'); button.disabled = true;\n        $('error').textContent = '';\n        try {\n          await bridgeReady;\n          const inputs = {};\n          for (const field of $('fields').querySelectorAll('input')) {\n            inputs[field.name] = field.type === 'number' ? Number(field.value) : field.value;\n          }\n          const result = await rpcRequest('tools/call', { name: 'calculate', arguments: { calculator_id: current.id, inputs } });\n          if (result?.isError) throw new Error(result.content?.[0]?.text || 'Calculation error');\n          update(result);\n        } catch (error) { $('error').textContent = String(error?.message || error); }\n        finally { button.disabled = false; }\n      });\n    })();\n  </script>\n</body>\n</html>\n";

const ICON_BYTES = Uint8Array.from(atob("iVBORw0KGgoAAAANSUhEUgAABAAAAAQACAYAAAB/HSuDAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAKqySURBVHhe7N0HsBVF2sbxJWfJLhIkKHlFCYIZJRhQMK5KVDEAgmAWUDErgoAgIqAgiCKIAREMCGJWQAXTKhkkKTln6K/e2c/dpfsi99Jz5vRM/39VT1ll1b3TPZwzd85zZnr+pgAAAAAAQOL9Tf8fAAAAAAAgeSgAAAAAAADwAAUAAAAAAAAeoAAAAAAAAMADFAAAAAAAAHiAAgAAAAAAAA9QAAAAAAAA4AEKAAAAAAAAPEABAAAAAACABygAAAAAAADwAAUAAAAAAAAeoAAAAAAAAMADFAAAAAAAAHiAAgAAAAAAAA9QAAAAAAAA4AEKAAAAAAAAPEABAAAAAACABygAAAAAAADwAAUAAAAAAAAeoAAAAAAAAMADFAAAAAAAAHiAAgAAAAAAAA9QAAAAAAAA4AEKAAAAAAAAPEABAAAAAACABygAAAAAAADwAAUAAAAAAAAeoAAAAAAAAMADFAAAAAAAAHiAAgAAAAAAAA9QAAAAAAAA4AEKAAAAAAAAPEABAAAAAACABygAAAAAAADwAAUAAAAAAAAeoAAAAAAAAMADFAAAAAAAAHiAAgAAAAAAAA9QAAAAAAAA4AEKAAAAAAAAPEABAAAAAACABygAAAAAAADwAAUAAAAAAAAeoAAAAAAAAMADFAAAAAAAAHiAAgAAAAAAAA9QAAAAAAAA4AEKAAAAAAAAPEABAAAAAACABygAAAAAAADwAAUAAAAAAAAeoAAAAAAAAMADFAAAAAAAAHiAAgAAAAAAAA9QAAAAAAAA4AEKAAAAAAAAPEABAAAAAACABygAAAAAAADwAAUAAAAAAAAeoAAAAAAAAMADFAAAAAAAAHiAAgAAAAAAAA9QAAAAAAAA4AEKAAAAAAAAPEABAAAAAACABygAAAAAAADwAAUAAAAAAAAeoAAAAAAAAMADFAAAAAAAAHiAAgAAAAAAAA9QAAAAAAAA4AEKAAAAAAAAPEABAAAAAACABygAAAAAAADwAAUAAAAAAAAeoAAAAAAAAMADFAAAAAAAAHiAAgAAAAAAAA9QAAAAAAAA4AEKAAAAAAAAPEABAAAAAACABygAAAAAAADwAAUAAAAAAAAeoAAAAAAAAMADFAAAAAAAAHiAAgAAAAAAAA9QAAAAAAAA4AEKAAAAAAAAPEABAAAAAACABygAAAAAAADwAAUAAAAAAAAeoAAAAAAAAMADFAAAAAAAAHiAAgAAAAAAAA9QAAAAAAAA4AEKAAAAAAAAPEABAAAAAACABygAAAAAAADwAAUAAAAAAAAeoAAAAAAAAMADFAAAAAAAAHiAAgAAAAAAAA9QAAAAAAAA4AEKAAAAAAAAPEABAAAAAACABygAAAAAAADwAAUAAAAAAAAeoAAAAAAAAMADFAAAAAAAAHiAAgAAAAAAAA9QAAAAAAAA4AEKAAAAAAAAPEABAAAAAACABygAAAAAAADwAAUAAAAAAAAeoAAAAAAAAMADFAAAAAAAAHiAAgAAAAAAAA9QAAAAAAAA4AEKAADw3N69e9WmTZvUqlWr1MKFC9X333+vvvrqKzV9+nT1zjvvqHHjxqkRI0aowYMHq4EDB6pBgwYRQhyJvCflvSnvUXmvyntW3rvyHpb3sryn5b0t73F5rwMA/EYBAAAJtX//frV79261bds29fvvv6tZs2apCRMmqKeeekrdcsstqkWLFuq0005TJ598sjrxxBNVjRo1VOXKlVWFChVUmTJl1NFHH62KFCmiChQooHLlyqWyZcum/va3vxFCHIu8N+U9Ku9Vec/Ke7d06dLBe1ne0/Lelve4vNflPS/v/a5duwbHAjkmzJ49OzhGyLFCjhly7AAAJBMFAAAkgJy4L1q0SH355ZfBt4C9e/dWHTt2VBdccIGqXr26KlGihCpUqJDKkycPH+QJIUHkWCDHBDk2FC9ePDhWNGvWTHXq1Ck4howfPz64kkCOLXKMAQDEHwUAAMTQnj171M8//6wmTpwYnKj/85//DL7t00/wCSHENnJsufLKK4Njzdtvv63+9a9/cTsBAMQUBQAAxMSCBQuCb+R69uypLr300uDbOv1EnRBCUhm5akCOPZdddllwLJJjkqwzAACIBwoAAHCU3Isr37TJt26NGzdWxx9/vMqfP79xQk4IIemKrDsg6wzIMerJJ59Uv/zyS3DsAgC4iQIAAByyZcsW9dNPP6khQ4aoJk2aBAt6cc8+ISQOkWNV0aJF1bnnnquGDh0a3Ka0detW/TAHAEgjCgAASLN9+/YFK/TLCfPll1+ujjrqKOPEmhBC4hY5lsn6JHJskycN8HQBAEg/CgAASJMffvhB9evXL/jQX7ZsWePkmRBCkpJy5cqpK664QvXv3z+4ygkAkB4UAAAQoV27dqnJkycHC2hVrFjROEkmhJCkp1KlSsExUI6FckwEAESHAgAAIrB69Wo1btw4ddZZZ6l8+fIZJ8SEEOJb5FjYsGHD4Ngox0gAQOpRAABACs2bN08NHDhQ1a9f3zj5JYQQ8u80aNBADRo0SM2fP18/jAIAQkQBAAAp8N1336kePXqoE044wTjRJYQQknFq1aql7r33XjV37lz9sAoACAEFAACERFa4/uqrr9R1112njj32WOPElhBCSOZSvnx5df3116uvv/5aHThwQD/cAgCOEAUAAITgxx9/VO3bt+cRfoQQEmLkmHrjjTeqn3/+WT/sAgCOAAUAAFhYvny5euyxx1SpUqWME1dCCCHhpHTp0qp3795qxYoV+mEYAJAFFAAAcAT27t2rRo4cGSxcpZ+oEkIISU1OPfVUNWrUKLVv3z79sAwAyAQKAADIArkXddq0aerCCy9UuXLlMk5OCSGEpDa5c+dWzZs3VzNmzGB9AADIIgoAAMgkeTxV586dVYECBYwTUkIIIdGmUKFCqkuXLjw6EACygAIAAA5j1apVqm/fvsGq1PoJKCGEkPSmQoUKqn///mr16tX64RsAoKEAAIC/MGnSJHXGGWcYJ5yEEELcyplnnqneeecd/TAOAPgfFAAAkIGtW7eq+++/XxUuXNg4ySSEEOJmihQpoh566KHgGA4AMFEAAIBm7ty56vzzzzdOLAkhhMQjslDrDz/8oB/eAcB7FAAA8P9kNenRo0erihUrGieThBBC4pVKlSqpl19+WT/UA4DXKAAA4P8X+uvUqROP9iOEkARFjunypIDff/9dP+wDgJcoAAB475NPPlGnnnqqceJICCEkGTn99NPVZ599ph/+AcA7FAAAvLVjxw7Vr18/VaJECeNkkRBCSLJSsmRJNWDAgODYDwC+ogAA4KX58+erVq1aGSeIhBBCkh059sttXwDgIwoAAN754IMPVK1atYyTQkIIIX6kUaNG6pdfftH/PABA4lEAAPDKq6++yiX/hBBCVO3atdUXX3yh/5kAgESjAADgjeHDh6tChQoZJ4GEEEL8TIUKFdTbb7+t/7kAgMSiAADghf79+6s8efIYJ3+EEEL8jiwOOGbMGP3PBgAkEgUAgETbv3+/evDBB1XOnDmNkz5CCCFEUrBgQTVo0CD9TwgAJA4FAIDE2rlzp7rzzjtVtmzZjJM9Qggh5H+TO3du9eijj6oDBw7of04AIDEoAAAk0ubNm9VNN91knOARQgghh4oUxrfddltQIANAElEAAEic5cuXqyuuuMI4sSOEEEIyk3bt2qmlS5fqf14AIPYoAAAkyvz584PnO+snc4QQQkhWcs4551ACAEgcCgAAibFkyRLVuHFj4ySOEEIIOZJceumlau3atfqfGwCILQoAAImwevVqddFFFxknb4QQQohN2rdvz5oAABKDAgBA7K1fv557/iNIrly5glWyCSFuRd6b+vuVhBtZGHDv3r36nx8AiB0KAACxtm3bNtW2bVvjZI1kLkWKFFE1atQIbp1o3bq16ty5c/DoxF69eqknnnhCDRgwQA0bNky99NJLasKECer1118nhDgWeW/Ke1Teq/KelfeuvIflvSzv6VatWgXvcXmvy3tePw6QzOWhhx7S/wQBQOxQAACItXvuucc4SSMHJ3v27Cp//vzqtNNOU506dQo+HLzyyitq+vTpavbs2WrBggXqjz/+ULt27dJ3L4AEkMvX5T0u73V5z8t7X44BciyQY4IcG+QYIccK/fhB/hu50mLQoEH67gWAWKEAABBbTz/9dPDMZv0kzffkzZtXlS1bVjVo0EB16dJFjR8/Xi1atEht2rSJS1gBHESOCXJskGPEuHHjgmNG/fr1VZkyZYJjiX588T2yT+RqCwCIKwoAALH02muvqYIFCxonZ75G9sVZZ52lunbtGpyczps3T99lAJBpv/76a3AsueWWW4JjC8fb/6ZkyZJq0qRJ+i4DgFigAAAQO19++aUqXbq0cVLmY+rWrRvcBiEno5s3b9Z3FQBYk2OLHGPuvvtuVadOHeM45GPkKqvPP/9c31UA4DwKAACxIvew+n4CWq5cOXXzzTeryZMnq2XLlum7CABSZunSpcGxR45BcizSj08+pWbNmuqHH37QdxEAOI0CAEBsbNy4UV100UXGSZgPkftO5dt+WYBq+fLl3MsPIK3kGLRixQo1ePDg4Njk63oB5557rtqwYYO+ewDAWRQAAGJBVrFu3769cfKV9OTLl0+df/75atSoUWr79u36bgGAtJPHscoxSo5VcszSj2NJz2233ab2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sboS+Rs7ZcoUfdgAkGUUAACsjRs3zunVk+W+U5fIiea1115rjJMQQnxJhw4dnHus3WOPPWaM05XI39gJEyboQwaALKMAAGBtxIgRKkeOHMYJiyt54YUX9CGn1auvvur0FROEEJLqyNonb7zxhn54TCtZn0AfpyuRv7GjR4/WhwwAWUYBAMDaM888E6zwrJ+wuBL5wO0Kuey1du3axhgJIcS31KlTx6mV7ceMGWOM0aUMGTJEHzIAZBkFAABrTz75pHGi4lLefvttfchpc9999zldlhBCSFSRY+GDDz6oHybT5s033zTG6FKeeuopfcgAkGUUAACsPfDAA8aJikuZPn26PuS0kEc4lS1b1hgfIYT4mvLly6sffvhBP1ymxdSpU43xuZSHH35YHzIAZBkFAABrd911l3Gi4lK++uorfciR279/v+rZs6cxNkII8T1yZZQcI9NNHk+oj82l9OjRQx8yAGQZBQAAa507dzZOVFyJXGI6e/ZsfciRmzdvnipdurQxPkII8T1lypRRCxYs0A+bkZs1a5bKli2bMT5X0q1bN33IAJBlFAAArF133XXGiYorKViwYHDpfbr16tXLGBshhJB/56GHHtIPm5GbM2eOyps3rzE2V3LjjTfqQwaALKMAAGDt6quvNk5UXEnJkiXVzz//rA85UuvXr1cVKlQwxkYIIeTfkWPkhg0b9MNnpH788UdVrFgxY2yupFWrVvqQASDLKAAAWPvnP/9pnKi4kr///e/qX//6lz7kSI0bN07lypXLGFu6I990FSlSJNhHpUqVIoQkPPJel/e8i99yyzHy9ddf1w+fkZKyWPaRPjZXIn9rAcAWBQAAaxQAf82lKySqVKmi2rZtqwYMGKDGjh2rJk+erGbMmKE++eQT9fHHHxNCEhp5j8t7Xd7z8t6XY4AcCypXrmwcJ9KVdH/DTQEAwAcUAACsUQAc2pIlS1SlSpWMcUWdY489NniG9E8//aQPEYDH5JjQt29fVa5cOeO4EXWOP/54tXTpUn2IkaEAAOADCgAA1igADm306NEqd+7cxriiiqxofe2116r58+frQwOA/5BjhFwRkM5V8OXWhDFjxuhDiwwFAAAfUAAAsEYBcGi33367MaaoUqBAAfX444+rPXv26MMCAIMcKx577DGVP39+43gSVe666y59WJGhAADgAwoAANYoADK2Y8cO1bx5c2NMUSRPnjxq+PDh+pAA4LCGDRum8uXLZxxXosjFF1+sdu7cqQ8pEhQAAHxAAQDAGgVAxuSRUrLonj6mKPLwww/rwwGATHvkkUeM40oUqVatWtqO2RQAAHxAAQDAGgVAxt5777203P9/4YUXqm3btunDAYBM27p1q2rWrJlxfEl15MqDqVOn6sOJBAUAAB9QAACwRgGQsZdeeskYT6pz1FFHBY/7AgBb8vjAQoUKGceZVEceU5gOFAAAfEABAMAaBUDG5NFa+nhSnQ4dOrDoH4BQ7N69W91www3GcSbV6d+/vz6USFAAAPABBQAAaxQApv3796uuXbsa40ll5NLZN998Ux8KAByx119/PfIFAeXpKXIMjRoFAAAfUAAAsEYBYJJVrFu3bm2MJ5WpU6eOWrlypT4UADhiy5cvV7Vr1zaON6lMu3bt0vIkAAoAAD6gAABgjQLAJAtoXX755cZ4Uhm5VBcAwnbdddcZx5tURv6myDE0ahQAAHxAAQDAGgWAadOmTeqiiy4yxpPK8Og/AKnw0EMPGcebVKZ58+bBMTRqFAAAfEABAMAaBYBp/fr1qkmTJsZ4UpXs2bOrp59+Wh8GAFiTRfmyZctmHHdSlaZNmwbH0KhRAADwAQUAAGsUAKa1a9eqs846yxhPqpI7d241fPhwfRgAYG3YsGEqV65cxnEnVWnYsKFas2aNPoyUowAA4AMKAADWKABMcvJKAQAgCeTYEmUBIMdOCgAzFAAAwkABAMAaBYCJAgBAUlAAuBEKAABhoAAAYI0CwEQBACApKADcCAUAgDBQAACwRgFgogAAkBQUAG6EAgBAGCgAAFijADBRAABICgoAN0IBACAMFAAArFEAmCgAACQFBYAboQAAEAYKAADWKABMFAAAkoICwI1QAAAIAwUAAGsUACYKAABJQQHgRigAAISBAgCANQoAEwUAgKSgAHAjFAAAwkABAMAaBYCJAgBAUlAAuBEKAABhoAAAYI0CwEQBACApKADcCAUAgDBQAACwRgFgogAAkBQUAG6EAgBAGCgAAFijADBRAABICgoAN0IBACAMFAAArFEAmCgAACQFBYAboQAAEAYKAADWKABMFAAAkoICwI1QAAAIAwUAAGsUACYKAABJQQHgRigAAISBAgCANQoAEwUAgKSgAHAjFAAAwkABAMAaBYCJAgBAUlAAuBEKAABhoAAAYI0CwEQBACApKADcCAUAgDBQAACwRgFgogAAkBQUAG6EAgBAGCgAAFijADBRAABICgoAN0IBACAMFAAArFEAmCgAACQFBYAboQAAEAYKAADWKABMFAAAkoICwI1QAAAIAwUAAGsUACYKAABJQQHgRigAAISBAgCANQoAEwUAgKSgAHAjFAAAwkABAMAaBYCJAgBAUlAAuBEKAABhoAAAYI0CwEQBACApKADcCAUAgDBQAACwRgFgogAAkBQUAG6EAgBAGCgAAFijADBRAABICgoAN0IBACAMFAAArFEAmCgAACQFBYAboQAAEAYKAADWKABMFAAAkoICwI1QAAAIAwUAAGsUACYKAABJQQHgRigAAISBAgCANQoAEwUAgKSgAHAjFAAAwkABAMAaBYCJAgBAUlAAuBEKAABhoAAAYI0CwEQBACApKADcCAUAgDBQAACwRgFgogAAkBQUAG6EAgBAGCgAAFijADBRAABICgoAN0IBACAMFAAArFEAmCgAACQFBYAboQAAEAYKAADWKABMFAAAkoICwI1QAAAIAwUAAGsUACYKAABJQQHgRigAAISBAgCANQoAEwUAgKSgAHAjFAAAwkABAMAaBYCJAgBAUlAAuBEKAABhoAAAYI0CwEQBACApKADcCAUAgDBQAACwRgFgogAAkBQUAG6EAgBAGCgAAFijADBRAABICgoAN0IBACAMFAAArFEAmCgAACQFBYAboQAAEAYKAADWKABMFAAAkoICwI1QAAAIAwUAAGsUACYKAABJQQHgRigAAISBAgCANQoAEwUAgKSgAHAjFAAAwkABAMAaBYCJAgBAUlAAuBEKAABhoAAAYI0CwEQBACApKADcCAUAgDBQAACwRgFgogAAkBQUAG6EAgBAGCgAAFijADBRAABICgoAN0IBACAMFAAArFEAmCgAACQFBYAboQAAEAYKAADWKABMFAAAkoICwI1QAAAIAwUAAGsUACYKAABJQQHgRigAAISBAgCANQoAEwUAgKSgAHAjFAAAwkABAMAaBYCJAgBAUlAAuBEKAABhoAAAYI0CwEQBACApKADcCAUAgDBQAACwRgFgogAAkBQUAG6EAgBAGCgAAFijADBRAABICgoAN0IBACAMFAAArFEAmCgAACQFBYAboQAAEAYKAADWKABMFAAAkoICwI1QAAAIAwUAAGsUACYKAABJQQHgRigAAISBAgCANQoAEwUAgKSgAHAjFAAAwkABAMAaBYCJAgBAUlAAuBEKAABhoAAAYI0CwEQBACApKADcCAUAgDBQAACwRgFgogAAkBQUAG6EAgBAGCgAAFijADBRAABICgoAN0IBACAMFAAArFEAmCgAACQFBYAboQAAEAYKAADWKABMFAAAkoICwI1QAAAIAwUAAGsUACYKAABJQQHgRigAAISBAgCANQoAEwUAgKSgAHAjFAAAwkABAMAaBYCJAgBAUlAAuBEKAABhoAAAYI0CwEQBACApKADcCAUAgDBQAACwRgFgogAAkBQUAG6EAgBAGCgAAFijADBRAABICgoAN0IBACAMFAAArFEAmCgAACQFBYAboQAAEAYKAADWKABMFAAAkoICwI1QAAAIAwUAAGsUACYKAABJQQHgRigAAISBAgCANQoAEwUAgKSgAHAjFAAAwkABAMAaBYCJAgBAUlAAuBEKAABhoAAAYI0CwEQBACApKADcCAUAgDBQAACwRgFgWrt2beQFwPPPP68PAwCsRV0ANGzYkAIgg1AAAAgDBQAAaxQApvXr16smTZoY40lVsmfPrvr3768PAwCs9evXT2XLls047qQqTZs2VevWrdOHkXIUAAB8QAEAwBoFgGnz5s2qefPmxnhSmfvuu08fBgBY69mzp3G8SWVatGihNm3apA8j5SgAAPiAAgCANQoA07Zt29SVV15pjCeVue666/RhAIC1a6+91jjepDJXXXVVcAyNGgUAAB9QAACwRgFg2rVrl7rmmmuM8aQyp556anDrAQCERdYzkWOLfrxJZaTM3L17tz6UlKMAAOADCgAA1igATAcOHFC33367MZ5Upnjx4mrGjBn6UADgiE2fPl0VK1bMON6kMnfeeac+jEhQAADwAQUAAGsUABmTRfn08aQ6TzzxhD4MADhijz32mHGcSXUGDRqkDyMSFAAAfEABAMAaBUDGxo0bZ4wn1alcubJavHixPhQAyLKFCxeqSpUqGceZVGfChAn6UCJBAQDABxQAAKxRAGRs2rRpKn/+/MaYUp3rr79e7dmzRx8OAGTazp07Vdu2bY3jS6pToEAB9dFHH+nDiQQFAAAfUAAAsEYBkLFffvlFVa9e3RhTqpM9e3b1zDPP6MMBgExLxy1Mkpo1a6r58+frw4kEBQAAH1AA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J3ny5LF+vnnHjh2N30uOLJ06ddJ3b5aMGzdO5c6d2/i9JOuRMiWrt8XEDQUAAB9QAACwRgGQfm+88Uakj8hLalq3bq127Nih794skScCHHfcccbvJllL5cqV1eLFi/XdmyXyqLqrr77a+N0ka8mZM6d666239N2bOBQAAHxAAQDAGgVA+smjz/jm2S7HH3+8+vXXX/Vde0TGjBnDN88WkX03duxYfbceEflQJ/+2+jZI5tO5c+dMPxIzzigAAPiAAgCANQoAN8hCaZdccomxD8jhI6+TadOm6bvUyuOPP25sh2QuTzzxhL47rXz44YdOf7BzOZdeeqnasmWLvksTiQIAgA8oAABYowBwx2+//abOOussYz+QQ6dAgQLBveJh27dvn7rtttuM7ZG/zu23367279+v705rr776avBvrW+PHDpnnnlmsJiiLygAAPiAAgCANQoAt/z444+qSpUqxr4gZnLlyqUGDhyo78LQbNy4UV111VXGdknGadmyZfA4xVQZMGBAcD+7vl1iplq1asGxxCcUAAB8QAEAwBoFgHs+++wzVaNGDWN/kP9GPvw//PDDavfu3fruC5V8gyqXUevbJwdHbl9ZuXKlvvtCtWvXruDfnPUZ/jrVq1cPjiG+oQAA4AMKAADWKADc9NNPP6mmTZsa+4T8TZUoUUK98MILwWX6UZArAbp162aMg/w7Xbt2VRs2bNB3W0rI7QUjRowIXgP6OMjfVJMmTbz75v9PFAAAfEABAMAaBYC71qxZo9q1a2fsF58jj5f74IMP9F2VcvLBs3///qpgwYLGmHyN7AvZJ6m45/9w5DUgrwV9TD5HjhVyzPAVBQAAH1AAALBGAeA2uez53nvvDS551/ePb5EFEufMmaPvokhNmDBBlSlTxhibbylXrpx67bXX9N0Tqe+//16dccYZxth8S548eYJjxM6dO/Vd5BUKAAA+oAAAYI0CIB5efvllVadOHWMf+ZAiRYoEq8un+h7zzPrqq6+8XhdA5j5z5kx9t6SFrNEgT2uQ14g+Th9St25d9corr+i7xUsUAAB8QAEAwBoFQHzIYwL79OmjKlSoYOyrJCZv3ryqTZs2znzY/F+bN29Wr7/+ujrttNNU9uzZjbEnLTJH+bb9jTfeCObumq+//lq1bt06eM3oY09iKlasqJ566qngmIB/owAA4AMKAADWKADi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AMAHFAAArFEAuGXp0qV8+M9k8uXLp1566SV9F4Zm165d6qabbjK2SzJOx44d1e7du/XdGJpRo0YF/+b6domZunXrqt9++03fhYlGAQDABxQAAKxRALhDLjW/9NJLjf1ADp2SJUumbE2APn36cNl/FiKPp5N9lgryb1y8eHFjm+TQueyyy9SWLVv0XZlYFAAAfEABAMAaBYAb5PLmLl26GPuAHD7VqlUL/XXyyiuv8OSFI4jsM9l3Yfrll1+Cf2N9W+TwkWOKHFt8QAEAwAcUAACsUQCk3/79+9UTTzxhzJ9kPmeeeaZavXq1vmuPyPTp09XRRx9tbINkLrLvZJX+MKxYsUKdccYZxjZI5iNXZcjiiUlHAQDABxQAAKxRAKTf+++/z8JmIaRz587W96AvX75cnXjiicbvJlmL3IO+cuVKffdmCWswhJNChQqpDz/8UN+9iUMBAMAHFAAArFEApJd8yOEbznAiC8TJt/c2evbsafxecmS577779N2bJfKhlUX/wknDhg2DY02SUQAA8AEFAABrFADpNWLECBaaCzGXXHKJ2rFjh76bM2Xu3LmqYsWKxu8kR5ZKlSqpH3/8Ud/NmbJ9+3bVokUL43eSI4scY+QpCklGAQDABxQAAKxRAKTPhg0beORfyMmWLZuaNGmSvqsPa+/everWW281fh+xyx133BHs26x66623jN9F7FK/fv3gmJNUFAAAfEABAMAaBUD6PPXUU3z7n4KcdtppwTfIWTFz5kweM5eClChRQs2aNUvf3X9p27Zt6tRTTzV+F7GLHGv69eun7+7EoAAA4AMKAADWKADSY+HChapGjRrGnEk4ef755/VdfkiycGDbtm2N30HCybXXXpulxRmHDh1q/A4STv7xj3+oRYsW6bs8ESgAAPiAAgCANQqA9JAPqPp8SXiRRc8y+/zzefPm8RSGFKZAgQLBPs4M+Tc766yzjN9BwousO5JEFAAAfEABAMAaBUD0ZDXua665xphvKiMfwsqUKRMschd1ypcvH/nl9WXLllXfffedvuszFPU3znIptry2K1SoYOyrVEe2KduO+taTzF6R8c0336jSpUsbP5/KyGtTXqP6vooi8p6U96Y+plSmffv2WboiIy4oAAD4gAIAgDUKgOitWLEi+MChzzfsyIe8Zs2aqQEDBqi3335bffHFF+rbb78NPmRFFdme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LdWrV1cffvihvnsitWjRInXRRRcZY/MtRx11VHCMkGOFzygAAPiAAgCANQqAeJDnqp9zzjnGPvIhZcqUCVbkT/U95pklr8n27durvHnzGmNNemTO119/vfrll1/03ZIW8uSMRx99NHiN6GP1IY0aNVLvvfeevlu8RAEAwAcUAACsUQDEh3zYGTFihDrxxBONfZXEFC9eXHXt2lXNmzdP3xVpt2vXLvXRRx+pCy+8UOXLl88Ye9Iic5Rv22fMmBHM3TW//vqr6tKlS/Ca0ceexJx00klq5MiRwTEB/0YBAMAHFAAArFEAxI+c9D/++OPBZdj6PktCihYtqlq1aqVmz56tT905sjL9+PHj1VlnnWXMIylp2LBhMMdUP3EhDLNmzVItW7ZURYoUMeaRhMh7Xt77rlwN4xIKAAA+oAAAYI0CIL7kfnhZgV2+mS1durSx/+IUubT8lFNOUR06dAhud4ibbdu2qWHDhgXFRRKKGZlD69at1fDhw4O5xc2UKVOC15I8TjPut2rIe1ve4/IkCln3ABmjAADgAwoAANYoAOJvy5Ytwbflr7zySvDUAFkdPVeuXMb+dC3lypULvq0dPHiwmj59uvrtt9/0qcWOfEsur9lJkyaphx9+WDVt2lQVLlzYmLtrkTHKWOV++smTJwdziMM3/ocjryl5bQ0aNEhdffXVqmzZssbcXYu8d+U9fPvtt6tx48YF7215j+OvUQAA8AEFAABrFADJIiuB//7778EibV988YV655131JgxY9TAgQODbxC7d++uevToEVlke/fee6/q27eveuGFF4JnuMu983PmzFHLli2L9Pnx6bBx48bgSg25NP2DDz5Qr776qhoyZEiwqGHPnj2N/ZXqyDZl288991zw4VLGJGOTMcpYk2z79u3Ba05ee/IafP3114PXZJ8+fYLXaDreG/KelHJC3qNSvMh7Vt67f/zxh/er+mcVBQAAH1AAALBGAQAAiDsKAAA+oAAAYI0CAAAQdxQAAHxAAQDAGgUAACDuKAAA+IACAIA1CgAAQNxRAADwAQUAAGsUAACAuKMAAOADCgAA1igAAABxRwEAwAcUAACsUQAAAOKOAgCADygAAFijAAAAxB0FAAAfUAAAsEYBAACIOwoAAD6gAABgjQIAABB3FAAAfEABAMAaBQAAIO4oAAD4gAIAgDUKAABA3FEAAPAB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YAAAAACABAwAAAAAkIABAAAAABIwAAAAAEACBgAAAABIwAAAAAAACRgAAAAAIAEDAAAAACRgAAAAAIAEDAAAAACQgAEAAAAAEjAAAAAAQAIGAAAAAEjAAAAAAAAJGAAAAAAgAQMAAAAAJGAAAAAAgAQMAAAAAJCAAQAAAAASMAAAAABAAgYAAAAASMAAAAAAAAkYAAAAACABAwAAAAAkYAAAAACABAwAAAAAkIABAAAAABIwAAAAAEACBgAAAABIwAAAAAAACRgAAAAAIAEDAAAAACRgAAAAAIAEDAAAAACQgAEAAAAAEjAAAAAAQAIGAAAAAEjAAAAAAAAJGAAAAAAgAQMAAAAAJGAAAAAAgAQMAAAAAJCAAQAAAAASMAAAAABAAgYAAAAASMAAAAAAAAkYAAAAACABAwAAAAAkYAAAAACABAwAAAAAkIABAAAAABIwAAAAAEACBgAAAABIwAAAAAAACRgAAAAAIAEDAAAAACRgAAAAAIAEDAAAAACQgAEAAAAAEjAAAAAAQAIGAAAAAEjAAAAAAAAJGAAAAAAgAQMAAAAAJGAAAAAAgAQMAAAAAJCAAQAAAAASMAAAAABAAgYAAAAASMAAAAAAAAkYAAAAACABAwAAAAAkYAAAAACABAwAAAAAkIABAAAAABIwAAAAAEACBgAAAABIwAAAAAAACRgAAAAAIAEDAAAAACRgAAAAAIAEDAAAAACQgAEAAAAAEjAAAAAAQAIGAAAAAEjAAAAAAAAJGAAAAAAgAQMAAAAAJPAPkYamUQBg790AAAAASUVORK5CYII="), char => char.charCodeAt(0));

// Worker-native, stateless MCP Streamable HTTP adapter. The calculation
// catalog and branded HTML widget are injected by scripts/build-worker.mjs.
const MCP_URI = 'ui://seventask-calculator/results-v1.html';
const MCP_MIME = 'text/html;profile=mcp-app';
const INPUT_VALUE = { oneOf: [{ type: 'string' }, { type: 'number' }] };
const INPUTS = { type: 'object', additionalProperties: INPUT_VALUE };
const str = (maxLength = 80) => ({ type: 'string', maxLength });
const numSchema = (min, max, exclusiveMinimum = false) => ({
  type: 'number', ...(exclusiveMinimum ? { exclusiveMinimum: min } : { minimum: min }), maximum: max,
});
const schema = (properties, required = []) => ({ type: 'object', properties, required, additionalProperties: false });
const TOOL_UI = {
  ui: { resourceUri: MCP_URI },
  'openai/outputTemplate': MCP_URI,
  'openai/toolInvocation/invoking': 'Calculating with SevenTask…',
  'openai/toolInvocation/invoked': 'Calculation complete',
};
const tools = [
  {
    name: 'list_calculators', title: 'Find SevenTask calculators',
    description: `Search ${catalogSize} SevenTask calculators by name or category. Use calculator IDs with get_calculator and calculate.`,
    inputSchema: schema({ query: str(), category: str(), offset: { type: 'integer', minimum: 0, maximum: 1000 }, limit: { type: 'integer', minimum: 1, maximum: 30 } }),
  },
  {
    name: 'get_calculator', title: 'Get calculator input fields',
    description: 'Look up the field keys, defaults and choices for a calculator ID before calculating.',
    inputSchema: schema({ calculator_id: str(), selections: INPUTS }, ['calculator_id']),
  },
  {
    name: 'calculate', title: 'Run a SevenTask calculator',
    description: `Run any of ${catalogSize} original SevenTask calculators by calculator_id. Call get_calculator first. No inputs are stored.`,
    inputSchema: schema({ calculator_id: str(), inputs: INPUTS }, ['calculator_id']), _meta: TOOL_UI,
  },
  {
    name: 'calculate_emi', title: 'EMI and loan repayment',
    description: 'Calculate monthly loan EMI, total interest and total payment in INR.',
    inputSchema: schema({ loan_amount: numSchema(0, 1e12), annual_rate_percent: numSchema(0, 100), tenure_years: numSchema(0, 100, true) }, ['loan_amount', 'annual_rate_percent', 'tenure_years']), _meta: TOOL_UI,
  },
  {
    name: 'calculate_sip', title: 'SIP investment projection',
    description: 'Estimate future value of monthly SIP in INR. This is a projection, not a guaranteed return.',
    inputSchema: schema({ monthly_investment: numSchema(0, 1e12), annual_return_percent: numSchema(-100, 100), years: numSchema(0, 100, true) }, ['monthly_investment', 'annual_return_percent', 'years']), _meta: TOOL_UI,
  },
  {
    name: 'calculate_gst', title: 'GST inclusive or exclusive',
    description: 'Calculate Indian GST tax breakdown in INR. Confirm the applicable tax rate yourself.',
    inputSchema: schema({ amount: numSchema(0, 1e12), gst_rate_percent: { type: 'number', enum: [5, 12, 18, 28] }, mode: { type: 'string', enum: ['Inclusive', 'Exclusive'] } }, ['amount', 'gst_rate_percent', 'mode']), _meta: TOOL_UI,
  },
  {
    name: 'calculate_percentage', title: 'Percentage of a number',
    description: 'Find X percent of a value, and compare X as a percentage of that value.',
    inputSchema: schema({ percent: numSchema(-1e6, 1e6), of_value: numSchema(-1e12, 1e12) }, ['percent', 'of_value']), _meta: TOOL_UI,
  },
];
const toolByName = new Map(tools.map(tool => [tool.name, tool]));
const json = data => JSON.stringify(data);
const success = (id, result) => ({ jsonrpc: '2.0', id, result });
const rpcError = (id, code, message) => ({ jsonrpc: '2.0', id, error: { code, message } });
const errorResult = error => ({ isError: true, content: [{ type: 'text', text: error instanceof Error ? error.message : 'Calculation failed.' }] });

function validateValue(value, spec) {
  if (spec.oneOf) return spec.oneOf.some(child => validateValue(value, child));
  if (spec.type === 'number' || spec.type === 'integer') {
    if (typeof value !== 'number' || !Number.isFinite(value) || (spec.type === 'integer' && !Number.isInteger(value))) return false;
    if ('minimum' in spec && value < spec.minimum) return false;
    if ('exclusiveMinimum' in spec && value <= spec.exclusiveMinimum) return false;
    if ('maximum' in spec && value > spec.maximum) return false;
  } else if (spec.type === 'string') {
    if (typeof value !== 'string' || (spec.maxLength && value.length > spec.maxLength)) return false;
  } else if (spec.type === 'object') {
    if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
    if (spec.required?.some(key => !(key in value))) return false;
    for (const [key, val] of Object.entries(value)) {
      const prop = spec.properties?.[key] ?? spec.additionalProperties;
      if (!prop || prop === false || !validateValue(val, prop)) return false;
    }
  }
  if (spec.enum && !spec.enum.includes(value)) return false;
  return true;
}

function toolReply(result) {
  const primary = result.results.find(row => row.emphasis) ?? result.results[0];
  return {
    content: [{ type: 'text', text: `${result.name}: ${primary?.label ?? 'Result'} — ${primary?.value ?? 'See results'}${result.disclaimer ? `\n${result.disclaimer}` : ''}` }],
    structuredContent: result,
  };
}

async function executeTool(name, args = {}) {
  const tool = toolByName.get(name);
  if (!tool) return errorResult(new Error(`Unknown tool: ${name}`));
  if (!validateValue(args, tool.inputSchema)) return errorResult(new Error(`Invalid ${name} input. Check the tool schema.`));
  try {
    if (name === 'list_calculators') {
      const result = listCalculators(args);
      return { content: [{ type: 'text', text: json(result) }], structuredContent: result };
    }
    if (name === 'get_calculator') {
      const result = getCalculator(args.calculator_id, args.selections ?? {});
      return { content: [{ type: 'text', text: json(result) }], structuredContent: result };
    }
    let result;
    if (name === 'calculate') {
      const inputs = args.inputs ?? {};
      if (args.calculator_id === 'currency' || (args.calculator_id === 'unitconverter' && inputs.cat === 'Currency')) {
        result = await calculateCurrency({ from: String(inputs.from ?? 'USD').toUpperCase(), to: String(inputs.to ?? 'INR').toUpperCase(), amount: Number(inputs.value ?? 1) });
      } else result = calculate(args.calculator_id, inputs);
    } else if (name === 'calculate_emi') result = calculate('emi', { principal: args.loan_amount, rate: args.annual_rate_percent, years: args.tenure_years });
    else if (name === 'calculate_sip') result = calculate('sip', { monthly: args.monthly_investment, returnRate: args.annual_return_percent, years: args.years });
    else if (name === 'calculate_gst') result = calculate('gst', { amount: args.amount, rate: args.gst_rate_percent, type: args.mode });
    else result = calculate('percentage', { a: args.percent, b: args.of_value });
    return toolReply(result);
  } catch (error) { return errorResult(error); }
}

async function mcpMessage(message) {
  if (!message || message.jsonrpc !== '2.0' || typeof message.method !== 'string') {
    return rpcError(message?.id ?? null, -32600, 'Invalid JSON-RPC request');
  }
  if (!Object.hasOwn(message, 'id')) return null; // notifications need no response
  const { id, method, params = {} } = message;
  if (method === 'initialize') {
    return success(id, {
      protocolVersion: params.protocolVersion || '2025-06-18',
      capabilities: { tools: { listChanged: false }, resources: { listChanged: false } },
      serverInfo: {
        name: 'SevenTask Calculator by Kawkab Tech Labs', version: '0.1.0', websiteUrl: 'https://seventaskcalculator.in',
        icons: [{ src: 'https://seventask-calculator-mcp.kawkabtechlabs.workers.dev/icon.png', mimeType: 'image/png', sizes: ['1024x1024'] }],
      },
      instructions: 'Use list_calculators and get_calculator to discover inputs. Use calculate or direct tools. Financial/tax results are estimates.',
    });
  }
  if (method === 'ping') return success(id, {});
  if (method === 'tools/list') return success(id, { tools });
  if (method === 'tools/call') return success(id, await executeTool(params.name, params.arguments));
  if (method === 'resources/list') return success(id, { resources: [{ uri: MCP_URI, name: 'SevenTask Results', mimeType: MCP_MIME }] });
  if (method === 'resources/read') {
    if (params.uri !== MCP_URI) return rpcError(id, -32602, 'Unknown resource URI');
    return success(id, { contents: [{ uri: MCP_URI, mimeType: MCP_MIME, text: WIDGET_HTML, _meta: { ui: { prefersBorder: true } } }] });
  }
  if (method === 'prompts/list') return success(id, { prompts: [] });
  return rpcError(id, -32601, `Unknown method: ${method}`);
}

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'content-type, accept, mcp-session-id, mcp-protocol-version',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
  'Access-Control-Expose-Headers': 'Mcp-Session-Id',
  'Cache-Control': 'no-store',
};
const respondJson = (data, status = 200) => new Response(json(data), { status, headers: { ...cors, 'Content-Type': 'application/json; charset=utf-8' } });

export default {
  async fetch(request) {
    const pathname = new URL(request.url).pathname;
    if (pathname === '/icon.png' && request.method === 'GET') {
      return new Response(ICON_BYTES, { headers: { 'Content-Type': 'image/png', 'Cache-Control': 'public, max-age=3600', 'Access-Control-Allow-Origin': '*' } });
    }
    if ((pathname === '/' || pathname === '/healthz') && request.method === 'GET') {
      return respondJson({ name: 'SevenTask Calculator MCP', status: 'ok', calculators: catalogSize, categories: categories.length });
    }
    if (pathname !== '/mcp') return new Response('Not Found', { status: 404 });
    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors });
    if (request.method !== 'POST') return new Response('Method Not Allowed', { status: 405, headers: { ...cors, Allow: 'POST, OPTIONS' } });
    try {
      if (Number(request.headers.get('content-length') ?? 0) > 65536) return respondJson({ error: 'Body too large' }, 413);
      const raw = await request.text();
      if (raw.length > 65536) return respondJson({ error: 'Body too large' }, 413);
      const data = JSON.parse(raw);
      if (Array.isArray(data)) return respondJson(rpcError(null, -32600, 'Batch requests are not supported'));
      const reply = await mcpMessage(data);
      if (!reply) return new Response(null, { status: 202, headers: cors });
      return respondJson(reply);
    } catch (error) {
      console.error(json({ message: 'mcp_request_failed', error: error instanceof Error ? error.message : String(error) }));
      return respondJson(rpcError(null, -32700, 'Could not parse MCP request'), 400);
    }
  },
};
