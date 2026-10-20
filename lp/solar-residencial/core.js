(function(root){
'use strict';
const MAX_NAME=120;
function validate(x){
 const errors={};
 if(!String(x.name||'').trim()||String(x.name).length>MAX_NAME) errors.name='Informe como podemos chamar você (até 120 caracteres).';
 if(!String(x.city||'').trim()||String(x.city).length>120) errors.city='Informe o município do imóvel (até 120 caracteres).';
 if(!/^(AC|AL|AP|AM|BA|CE|DF|ES|GO|MA|MT|MS|MG|PA|PB|PR|PE|PI|RJ|RN|RS|RO|RR|SC|SP|SE|TO)$/.test(x.uf||'')) errors.uf='Escolha a UF.';
 if(!['installation','comparison','support','other'].includes(x.reason)) errors.reason='Escolha sua necessidade.';
 if(!['phone','whatsapp','email'].includes(x.channel)) errors.channel='Escolha como prefere receber retorno.';
 if(x.channel==='email') { if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(x.contact||''))||String(x.contact).length>254) errors.contact='Confira seu e-mail.'; }
 else if(['phone','whatsapp'].includes(x.channel)) { const raw=String(x.contact||'').trim(); let p=raw.replace(/[\s().-]/g,''); const format=/^\+?[0-9\s().-]+$/.test(raw); if(p.startsWith('+55'))p=p.slice(3); else if(!p.startsWith('+')&&p.startsWith('55')&&(p.length===12||p.length===13))p=p.slice(2); const ddds=new Set('11 12 13 14 15 16 17 18 19 21 22 24 27 28 31 32 33 34 35 37 38 41 42 43 44 45 46 47 48 49 51 53 54 55 61 62 63 64 65 66 67 68 69 71 73 74 75 77 79 81 82 83 84 85 86 87 88 89 91 92 93 94 95 96 97 98 99'.split(' ')); if(!format||!ddds.has(p.slice(0,2))||!/^\d{2}(?:[2-5]\d{7}|9\d{8})$/.test(p))errors.contact='Informe um telefone brasileiro com DDD válido.'; }
 if(String(x.note||'').length>500) errors.note='Use até 500 caracteres.';
 return errors;
}
function consentReducer(state,action){if(action==='reject')return {analytics:false,ads:false};if(action==='analytics')return {analytics:true,ads:false};return {analytics:false,ads:false};}
function preview(x){const errors=validate(x);return Object.keys(errors).length?{state:'invalid',errors}:{state:'disabled',errors:{},message:'Campos conferidos nesta página. Nenhuma solicitação foi enviada. Integração Headless pendente.'};}
// Test-only in-memory adapter. No transport, storage, production endpoint or success state.
// The page continues to call preview(); creating this adapter cannot enable capture.
function createSimulation(options={}){
 const scenario=['error','uncertain','disabled'].includes(options.scenario)?options.scenario:'disabled';
 const delay=Math.min(1000,Math.max(0,Number(options.delayMs)||0));
 let current={state:'idle',errors:{},simulated:true,captureEnabled:false};
 const snapshot=()=>({...current,errors:{...current.errors}});
 async function run(input){
  if(current.state==='pending')return snapshot();
  const checked=preview(input);
  if(checked.state==='invalid'){current={...checked,simulated:true,captureEnabled:false};return snapshot();}
  current={state:'pending',errors:{},simulated:true,captureEnabled:false,message:'Simulação em andamento. Nenhum dado será enviado.'};
  await new Promise(resolve=>setTimeout(resolve,delay));
  const messages={
   disabled:'Simulação concluída. Captação desligada. Nenhuma solicitação foi enviada.',
   error:'Erro simulado. Nenhuma solicitação foi enviada. Confira os campos antes de repetir a simulação.',
   uncertain:'Resultado incerto simulado. Nenhuma solicitação foi enviada. Em uma integração futura, consulte o estado antes de repetir.'
  };
  current={state:scenario,errors:{},simulated:true,captureEnabled:false,message:messages[scenario]};
  return snapshot();
 }
 return Object.freeze({run,getState:snapshot});
}
const api={validate,preview,consentReducer,createSimulation}; if(typeof module==='object'&&module.exports)module.exports=api;else root.LPCore=api;
})(typeof window==='object'?window:globalThis);
