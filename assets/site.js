'use strict';
(() => {
 const root=document.documentElement;
 root.classList.add('js-menu');
 const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
 const toggle=document.querySelector('.menu-toggle');
 const nav=document.querySelector('.main-nav');
 if(toggle&&nav){
  const close=()=>{nav.classList.remove('is-open');toggle.setAttribute('aria-expanded','false');toggle.setAttribute('aria-label','Abrir menu');};
  toggle.addEventListener('click',()=>{const open=toggle.getAttribute('aria-expanded')!=='true';toggle.setAttribute('aria-expanded',String(open));toggle.setAttribute('aria-label',open?'Fechar menu':'Abrir menu');nav.classList.toggle('is-open',open);});
  nav.addEventListener('click',e=>{if(e.target.closest('a'))close();});
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&toggle.getAttribute('aria-expanded')==='true'){close();toggle.focus();}});
  document.addEventListener('click',e=>{if(!nav.contains(e.target)&&!toggle.contains(e.target))close();});
  window.matchMedia('(min-width:701px)').addEventListener('change',close);
 }
 if('IntersectionObserver' in window&&!reduced.matches){
  root.classList.add('js-reveal');
  const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('in-view');observer.unobserve(entry.target);}}),{threshold:.08,rootMargin:'0px 0px 20px 0px'});
  document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));
  reduced.addEventListener('change',e=>{if(e.matches){root.classList.remove('js-reveal');observer.disconnect();}});
 }
 const motions=[...document.querySelectorAll('.motion-toggle')];
 const syncMotion=()=>motions.forEach(button=>{const paused=root.classList.contains('motion-paused');button.setAttribute('aria-pressed',String(paused));button.textContent=paused?'Retomar movimento':'Pausar movimento';});
 motions.forEach(button=>button.addEventListener('click',()=>{root.classList.toggle('motion-paused');syncMotion();}));
 const scenes=[...document.querySelectorAll('.solar-stage')];
 if(scenes.length){
  const visible=new Set();
  const updateScene=()=>scenes.forEach(scene=>scene.classList.toggle('scene-running',visible.has(scene)&&!document.hidden&&!reduced.matches));
  if('IntersectionObserver' in window){const watcher=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting)visible.add(entry.target);else visible.delete(entry.target);});updateScene();},{threshold:.05});scenes.forEach(scene=>watcher.observe(scene));}
  else{scenes.forEach(scene=>visible.add(scene));updateScene();}
  document.addEventListener('visibilitychange',updateScene);reduced.addEventListener('change',updateScene);
  root.classList.add('js-solar-motion');
 }
 const solutions=[...document.querySelectorAll('.solution-item')];
 solutions.forEach(item=>item.addEventListener('toggle',()=>{if(item.open)solutions.forEach(other=>{if(other!==item)other.open=false;});}));
 const sticky=document.querySelector('.mobile-sticky');
 const form=document.getElementById('avaliacao');
 const heroCta=document.querySelector('.mobile-hero-cta');
 if(sticky&&form&&heroCta&&'IntersectionObserver' in window){
  let formVisible=false,heroVisible=true;
  const update=()=>{const editing=/^(INPUT|SELECT|TEXTAREA)$/.test(document.activeElement?.tagName||'');const show=!formVisible&&!heroVisible&&!editing;sticky.hidden=!show;sticky.inert=!show;sticky.setAttribute('aria-hidden',String(!show));sticky.classList.toggle('visible',show);};
  const watcher=new IntersectionObserver(entries=>{for(const entry of entries){if(entry.target===form)formVisible=entry.isIntersecting;else heroVisible=entry.isIntersecting;}update();},{threshold:0});
  watcher.observe(form);watcher.observe(heroCta);document.addEventListener('focusin',update);document.addEventListener('focusout',()=>setTimeout(update,0));
 }
})();
