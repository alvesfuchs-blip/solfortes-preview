/* DOM-contract tests with minimal mocks; not a browser or visual audit. */
'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const core=require('../lp/solar-residencial/core.js');
let passed=0;
function test(name,run){run();passed++;console.log('PASS '+name);}
function formFixture(){
 const ids={};let focus=null;
 function element(id){return {id,value:'',attrs:{},listeners:{},textContent:'',type:'',autocomplete:'off',addEventListener(name,fn){this.listeners[name]=fn;},setAttribute(name,value){this.attrs[name]=value;},focus(){focus=id;},closest(){return this.details||null;}};}
 for(const key of ['name','city','uf','reason','channel','contact','note']){ids[key]=element(key);ids[key+'-error']=element(key+'-error');}
 ids.channel.value='phone';ids['contact-label']=element('contact-label');ids.status=element('status');ids['consent-status']=element('consent-status');
 const form=element('form');
 const consent=['analytics','reject'].map(action=>Object.assign(element(action),{dataset:{consent:action}}));
 const document={getElementById:id=>ids[id],querySelector:()=>form,querySelectorAll:()=>consent};
 function FormData(){return ['name','city','uf','reason','channel','contact','note'].map(key=>[key,ids[key].value]);}
 vm.runInNewContext(fs.readFileSync(require.resolve('../lp/solar-residencial/app.js'),'utf8'),{document,FormData,LPCore:core});
 return {ids,consent,focus:()=>focus,submit(){let prevented=false;form.listeners.submit({preventDefault(){prevented=true;}});assert.ok(prevented);},channel(value){ids.channel.value=value;ids.channel.listeners.change();}};
}
test('Invalid form focuses first field and shows linked errors',()=>{const f=formFixture();f.submit();assert.equal(f.focus(),'name');assert.equal(f.ids.name.attrs['aria-invalid'],'true');assert.ok(f.ids['name-error'].textContent);});
test('Valid data clears errors and focuses capture-OFF status',()=>{const f=formFixture();f.submit();for(const [k,v] of Object.entries({name:'Fictício',city:'Teste',uf:'SP',reason:'installation',contact:'11912345678'}))f.ids[k].value=v;f.submit();assert.equal(f.ids.name.attrs['aria-invalid'],'false');assert.equal(f.ids['name-error'].textContent,'');assert.equal(f.focus(),'status');assert.match(f.ids.status.textContent,/Nenhuma solicitação foi enviada/);});
test('Channel changes preserve separate drafts without enabling autofill',()=>{const f=formFixture();f.ids.contact.value='11912345678';f.channel('email');assert.equal(f.ids.contact.value,'');assert.equal(f.ids.contact.type,'email');assert.equal(f.ids.contact.autocomplete,'off');f.ids.contact.value='teste@example.invalid';f.channel('whatsapp');assert.equal(f.ids.contact.value,'11912345678');assert.equal(f.ids.contact.type,'tel');f.channel('email');assert.equal(f.ids.contact.value,'teste@example.invalid');});
test('Invalid hidden optional note opens disclosure before focus',()=>{const f=formFixture();for(const [k,v] of Object.entries({name:'Fictício',city:'Teste',uf:'SP',reason:'installation',contact:'11912345678',note:'x'.repeat(501)}))f.ids[k].value=v;f.ids.note.details={open:false};f.submit();assert.equal(f.ids.note.details.open,true);assert.equal(f.focus(),'note');});
test('Consent demo makes no promise of installed trackers',()=>{const f=formFixture();f.consent[0].listeners.click();assert.match(f.ids['consent-status'].textContent,/Nenhum rastreador/);f.consent[1].listeners.click();assert.match(f.ids['consent-status'].textContent,/sem analytics ou anúncios/);});
function menuFixture(){
 const callbacks={},windowCallbacks={},attrs={'aria-expanded':'false'},classes=new Set();let focused=false;
 const classList={add:x=>classes.add(x),remove:x=>classes.delete(x),contains:x=>classes.has(x),toggle(x,on){if(on)classes.add(x);else classes.delete(x);}};
 const toggle={addEventListener:(e,fn)=>callbacks['toggle:'+e]=fn,getAttribute:n=>attrs[n],setAttribute:(n,v)=>attrs[n]=v,contains:()=>false,focus:()=>focused=true};
 const nav={classList,addEventListener:(e,fn)=>callbacks['nav:'+e]=fn,contains:()=>false};
 const document={documentElement:{classList},querySelector:q=>q==='.menu-toggle'?toggle:q==='.main-nav'?nav:null,querySelectorAll:()=>[],getElementById:()=>null,addEventListener:(e,fn)=>callbacks[e]=fn};
 const window={matchMedia:q=>({matches:false,addEventListener:(e,fn)=>windowCallbacks[q]=fn})};
 vm.runInNewContext(fs.readFileSync(require.resolve('../assets/site.js'),'utf8'),{document,window});
 return {callbacks,windowCallbacks,attrs,classes,focused:()=>focused};
}
test('Menu opens with accessible state and Escape restores focus',()=>{const f=menuFixture();f.callbacks['toggle:click']();assert.equal(f.attrs['aria-expanded'],'true');assert.ok(f.classes.has('is-open'));f.callbacks.keydown({key:'Escape'});assert.equal(f.attrs['aria-expanded'],'false');assert.equal(f.focused(),true);});
test('Menu closes for navigation, outside click and desktop breakpoint',()=>{const f=menuFixture();for(const close of [()=>f.callbacks['nav:click']({target:{closest:()=>true}}),()=>f.callbacks.click({target:{}}),()=>f.windowCallbacks['(min-width:701px)']()]){f.callbacks['toggle:click']();close();assert.equal(f.attrs['aria-expanded'],'false');assert.equal(f.attrs['aria-label'],'Abrir menu');}});
console.log(JSON.stringify({scope:'Mock DOM contracts only',passed,failed:0}));
