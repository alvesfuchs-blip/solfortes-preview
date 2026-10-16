'use strict';
const form=document.querySelector('form');
const channel=document.getElementById('channel');
const contact=document.getElementById('contact');
let previousChannel=channel.value;
const contactDrafts={phone:'',email:''};
channel.addEventListener('change',()=>{const previousKind=previousChannel==='email'?'email':'phone';const nextKind=channel.value==='email'?'email':'phone';contactDrafts[previousKind]=contact.value;if(previousKind!==nextKind)contact.value=contactDrafts[nextKind];previousChannel=channel.value;contact.type=channel.value==='email'?'email':'tel';contact.autocomplete=channel.value==='email'?'email':'tel';document.getElementById('contact-label').textContent=channel.value==='email'?'E-mail':'Telefone com DDD';contact.placeholder=channel.value==='email'?'nome@example.invalid':'(00) 00000-0000';});
form.addEventListener('submit',(event)=>{
 event.preventDefault();
 const data=Object.fromEntries(new FormData(form)); const result=LPCore.preview(data);
 for(const key of ['name','city','uf','reason','channel','contact','note']) {const el=document.getElementById(key);el.setAttribute('aria-invalid',String(Boolean(result.errors[key])));document.getElementById(key+'-error').textContent=result.errors[key]||'';}
 const status=document.getElementById('status');status.textContent=result.state==='invalid'?'Confira os campos destacados.':result.message;
 if(result.state==='invalid'){const first=document.getElementById(Object.keys(result.errors)[0]);const group=first.closest?.('details');if(group)group.open=true;first.focus();}else status.focus();
});
let consent={analytics:false,ads:false};
for(const button of document.querySelectorAll('[data-consent]'))button.addEventListener('click',()=>{consent=LPCore.consentReducer(consent,button.dataset.consent);document.getElementById('consent-status').textContent=consent.analytics?'Preferência de demonstração: analytics permitido nesta aba. Nenhum rastreador está instalado.':'Preferência: sem analytics ou anúncios. Nenhum rastreador está instalado.';});
