/* Deterministic source tests. Lifecycle mocks do not certify a GPU/browser. */
'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const root=path.resolve(__dirname,'..');
const core=require(path.join(root,'lp/solar-residencial/core.js'));
const geom=require(path.join(root,'assets/solar-3d.js'));
const results=[];
function test(name,fn){try{fn();results.push({name,status:'pass'});}catch(e){results.push({name,status:'fail',message:e.message});process.exitCode=1;}}
const good={name:'Pessoa Teste',city:'Cidade Teste',uf:'RJ',reason:'installation',channel:'phone',contact:'(21) 91234-5678',note:''};
test('Valid phone remains capture disabled',()=>assert.equal(core.preview(good).state,'disabled'));
test('Valid e-mail remains capture disabled',()=>assert.equal(core.preview({...good,channel:'email',contact:'qa@example.invalid'}).state,'disabled'));
test('Empty required data rejected',()=>assert.deepEqual(Object.keys(core.validate({})).sort(),['channel','city','name','reason','uf']));
test('Name and city whitespace rejected',()=>{const e=core.validate({...good,name:'  ',city:'  '});assert.ok(e.name&&e.city);});
test('Name and city max length enforced',()=>{const e=core.validate({...good,name:'x'.repeat(121),city:'x'.repeat(121)});assert.ok(e.name&&e.city);});
test('Name and city boundary accepted',()=>assert.equal(core.preview({...good,name:'x'.repeat(120),city:'x'.repeat(120)}).state,'disabled'));
test('UF, reason and channel constrained',()=>{const e=core.validate({...good,uf:'XX',reason:'bad',channel:'sms'});assert.ok(e.uf&&e.reason&&e.channel);});
test('Brazilian phone formats accepted',()=>{for(const p of ['21912345678','+55 (21) 91234-5678','5521912345678','(11) 2345-6789'])assert.equal(core.preview({...good,contact:p}).state,'disabled',p);});
test('Invalid DDD, letters and foreign phones rejected',()=>{for(const p of ['00123456789','(20) 91234-5678','(21) abc123456','+1 415 555 1234','2191234567'])assert.ok(core.validate({...good,contact:p}).contact,p);});
test('Invalid e-mail rejected',()=>{for(const p of ['bad','x@','x@y','x y@example.invalid'])assert.ok(core.validate({...good,channel:'email',contact:p}).contact,p);});
test('Note length boundary enforced',()=>{assert.equal(core.preview({...good,note:'x'.repeat(500)}).state,'disabled');assert.ok(core.validate({...good,note:'x'.repeat(501)}).note);});
test('Consent demonstrations keep advertising off',()=>{assert.deepEqual(core.consentReducer({},'analytics'),{analytics:true,ads:false});assert.deepEqual(core.consentReducer({analytics:true,ads:true},'reject'),{analytics:false,ads:false});});
test('Mesh finite and vertex stride correct',()=>{const m=geom.geometry();assert.ok(m.length>0&&m.length%30===0);assert.ok([...m].every(Number.isFinite));});
test('Projection finite in portrait and landscape',()=>{for(const aspect of [.5,1,2])for(const yaw of [-.88,-.48,-.08]){const p=geom.project(geom.geometry(),yaw,aspect);assert.ok(p.length>0);assert.ok(p.every(f=>f.points.flat().every(Number.isFinite)&&f.depths.every(x=>x>0)));}});
test('Software rasterizer produces visible pixels',()=>{const p=new Uint8ClampedArray(80*60*4);geom.rasterize(geom.project(geom.geometry(),-.48,4/3),80,60,p,new Float32Array(80*60));assert.ok(p.some((v,i)=>i%4===3&&v===255));});

function rendererFixture(kind='webgl',reduced=false){
 const callbacks={},canvasEvents={},docEvents={},raf=new Map(),classes=new Set();let serial=0,draws=0,mutation;
 const media={matches:reduced,addEventListener:(type,fn)=>{callbacks.media=fn;}};
 const fallback={hidden:false,setAttribute(){this.hidden=true;},removeAttribute(){this.hidden=false;}};
 const gl={VERTEX_SHADER:1,FRAGMENT_SHADER:2,COMPILE_STATUS:3,LINK_STATUS:4,ARRAY_BUFFER:5,STATIC_DRAW:6,FLOAT:7,DEPTH_TEST:8,COLOR_BUFFER_BIT:16,DEPTH_BUFFER_BIT:32,TRIANGLES:9,
  createShader:()=>({}),shaderSource(){},compileShader(){},getShaderParameter:()=>kind!=='shader-failure',deleteShader(){},createProgram:()=>({}),attachShader(){},linkProgram(){},getProgramParameter:()=>true,deleteProgram(){},useProgram(){},createBuffer:()=>({}),bindBuffer(){},bufferData(){},deleteBuffer(){},getAttribLocation:()=>0,enableVertexAttribArray(){},vertexAttribPointer(){},getUniformLocation:(_,n)=>n,enable(){},clearColor(){},viewport(){},clear(){},uniform1f(){},drawArrays(){draws++;}};
 const context2d={createImageData:(w,h)=>({data:new Uint8ClampedArray(w*h*4)}),putImageData(){draws++;}};
 const canvas={dataset:{},hidden:true,width:80,height:60,parentElement:{querySelector:()=>fallback},getBoundingClientRect:()=>({width:80,height:60}),getContext:t=>t==='webgl'?(kind==='webgl'||kind==='shader-failure'?gl:null):(kind==='canvas2d'?context2d:null),addEventListener:(e,fn)=>{canvasEvents[e]=fn;}};
 const document={hidden:false,documentElement:{classList:{contains:x=>classes.has(x)}},querySelectorAll:()=>[canvas],addEventListener:(e,fn)=>{docEvents[e]=fn;}};
 const window={devicePixelRatio:1,matchMedia:()=>media,requestAnimationFrame:fn=>{raf.set(++serial,fn);return serial;},cancelAnimationFrame:id=>raf.delete(id),addEventListener(){}};
 class MutationObserver{constructor(fn){mutation=fn;}observe(){}}
 const ctx={window,document,MutationObserver,Float32Array,Uint8ClampedArray,Math};
 vm.runInNewContext(fs.readFileSync(path.join(root,'assets/solar-3d.js'),'utf8'),ctx);
 return {canvas,fallback,media,callbacks,classes,raf,canvasEvents,docEvents,document,draws:()=>draws,mutate:()=>mutation(),tick:t=>{const calls=[...raf.values()];raf.clear();calls.forEach(fn=>fn(t));}};
}
test('Mock WebGL initializes and schedules movement',()=>{const f=rendererFixture();assert.equal(f.canvas.dataset.renderer,'webgl');assert.equal(f.canvas.hidden,false);assert.equal(f.fallback.hidden,true);assert.ok(f.raf.size);f.tick(100);f.tick(200);assert.ok(f.draws()>2);});
test('Mock pause cancels movement and resume restarts',()=>{const f=rendererFixture();f.classes.add('motion-paused');f.mutate();assert.equal(f.raf.size,0);f.classes.delete('motion-paused');f.mutate();assert.equal(f.raf.size,1);});
test('Mock reduced motion never schedules animation',()=>{const f=rendererFixture('webgl',true);assert.equal(f.raf.size,0);f.media.matches=false;f.callbacks.media();assert.equal(f.raf.size,1);f.media.matches=true;f.callbacks.media();assert.equal(f.raf.size,0);});
test('Mock document visibility stops and resumes animation',()=>{const f=rendererFixture();f.document.hidden=true;f.docEvents.visibilitychange();assert.equal(f.raf.size,0);f.document.hidden=false;f.docEvents.visibilitychange();assert.equal(f.raf.size,1);});
test('Mock WebGL context loss falls back and recovery renders',()=>{const f=rendererFixture();let prevented=false;f.canvasEvents.webglcontextlost({preventDefault(){prevented=true;}});assert.ok(prevented);assert.equal(f.canvas.dataset.renderer,'static');assert.equal(f.fallback.hidden,false);assert.equal(f.raf.size,0);f.canvasEvents.webglcontextrestored();assert.equal(f.canvas.dataset.renderer,'webgl');assert.equal(f.canvas.hidden,false);assert.equal(f.fallback.hidden,true);});
test('Mock unavailable WebGL uses actual Canvas2D rasterization',()=>{const f=rendererFixture('canvas2d');assert.equal(f.canvas.dataset.renderer,'canvas2d');assert.equal(f.canvas.dataset.rendererReason,'webgl-unavailable');assert.ok(f.draws());});
test('Mock unavailable canvas contexts retain SVG fallback',()=>{const f=rendererFixture('none');assert.equal(f.canvas.dataset.renderer,'static');assert.equal(f.canvas.hidden,true);assert.equal(f.fallback.hidden,false);});
test('Mock shader failure retains SVG fallback',()=>{const f=rendererFixture('shader-failure');assert.equal(f.canvas.dataset.renderer,'static');assert.equal(f.canvas.dataset.rendererReason,'shader-compile');});
test('Team heading and role labels use visible official sand color',()=>{const css=fs.readFileSync(path.join(root,'assets/style.css'),'utf8');for(const name of ['technician-entry','team-roles']){const rule=css.match(new RegExp('\\.'+name+'\\{([^}]+)\\}'))[1];assert.ok(rule.includes('color:var(--sand)'),name);}});
console.log(JSON.stringify({scope:'Source-level deterministic tests; renderer lifecycle uses mocks, not browser/GPU certification',passed:results.filter(x=>x.status==='pass').length,failed:results.filter(x=>x.status==='fail').length,results},null,2));
