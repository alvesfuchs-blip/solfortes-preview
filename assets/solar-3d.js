/* Solfortes V3: original low-poly WebGL geometry; no dependency or network request. */
(function(scope){
'use strict';
const palette={sand:[.886,.871,.827],ink:[.125,.118,.118],brown:[.306,.255,.231],orange:[1,.427,.141],panel:[.11,.18,.22]};
function rotate(p,a){return [p[0],p[1]*Math.cos(a)-p[2]*Math.sin(a),p[1]*Math.sin(a)+p[2]*Math.cos(a)];}
function geometry(){
 const data=[];
 function tri(a,b,c,color,glow=0){
  const u=b.map((v,i)=>v-a[i]),v=c.map((n,i)=>n-a[i]);
  let n=[u[1]*v[2]-u[2]*v[1],u[2]*v[0]-u[0]*v[2],u[0]*v[1]-u[1]*v[0]],l=Math.hypot(...n);
  if(l<1e-8)return;
  n=n.map(x=>x/l);
  for(const p of [a,b,c])data.push(...p,...n,...color,glow);
 }
 function box(center,size,color,angle=0){
  const ps=[[-1,-1,-1],[1,-1,-1],[1,1,-1],[-1,1,-1],[-1,-1,1],[1,-1,1],[1,1,1],[-1,1,1]].map(p=>rotate(p.map((n,i)=>n*size[i]/2),angle).map((n,i)=>n+center[i]));
  for(const f of [[0,3,2,1],[4,5,6,7],[0,4,7,3],[1,2,6,5],[0,1,5,4],[3,7,6,2]]){tri(ps[f[0]],ps[f[1]],ps[f[2]],color);tri(ps[f[0]],ps[f[2]],ps[f[3]],color);}
 }
 // Beveled architectural plinth, warmer than the house walls.
 const outline=[[-2.5,-1.65],[-2.3,-1.85],[2.3,-1.85],[2.5,-1.65],[2.5,1.65],[2.3,1.85],[-2.3,1.85],[-2.5,1.65]];
 for(let i=0;i<outline.length;i++){
  const p=outline[i],q=outline[(i+1)%outline.length],top=[p[0],-.025,p[1]],next=[q[0],-.025,q[1]];
  tri([0,-.025,0],next,top,[.73,.70,.64]);
  tri(top,next,[q[0],-.14,q[1]],[.43,.38,.33]);tri(top,[q[0],-.14,q[1]],[p[0],-.14,p[1]],[.43,.38,.33]);
 }
 // Baked contact shadow: shallow opaque layers, no expensive dynamic shadow pass.
 for(let i=0;i<4;i++)box([-.34,-.017+i*.003,-.1],[3.22-i*.1,.002,2.35-i*.1],[.66-i*.035,.63-i*.035,.57-i*.035]);
 box([-.45,.575,0],[2.85,1.15,1.85],[.92,.90,.85]);
 // Gable roof with fascia and a narrow ridge cap.
 const roof=[[-2.04,1.15,-1.1],[1.14,1.15,-1.1],[-2.04,1.85,0],[1.14,1.85,0],[-2.04,1.15,1.1],[1.14,1.15,1.1]];
 for(const f of [[0,1,3],[0,3,2],[2,3,5],[2,5,4],[0,2,4],[1,5,3]])tri(...f.slice().reverse().map(i=>roof[i]),[.26,.24,.23]);
 box([-.45,1.14,1.1],[3.18,.075,.075],[.34,.30,.27]);
 box([-.45,1.14,-1.1],[3.18,.075,.075],[.34,.30,.27]);
 box([-.45,1.86,0],[3.2,.045,.075],[.40,.36,.32]);
 // Individual raised modules with subtle frames and a reflected strip.
 for(let x=0;x<4;x++)for(let z=0;z<2;z++){
  const px=-1.57+x*.73,pz=.29+z*.48,py=1.85-pz*.636+.05;
  box([px,py,pz],[.65,.042,.43],[.34,.40,.42],.566);
  box([px,py+.025,pz],[.61,.012,.395],[.10,.19,.23],.566);
  for(let k=-1;k<=1;k++)box([px+k*.145,py+.048,pz],[.006,.004,.38],[.41,.51,.53],.566);
  box([px-.22,py+.048,pz],[.035,.004,.37],[.22,.33,.37],.566);
 }
 // Deep window reveals, slim mullions and glass highlights.
 for(const x of [-1.35,-.55]){
  box([x,.65,.94],[.61,.57,.045],[.34,.31,.28]);
  box([x,.65,.967],[.53,.49,.018],[.13,.23,.27]);
  box([x,.65,.981],[.022,.49,.012],[.79,.77,.71]);
  box([x-.18,.65,.985],[.025,.44,.006],[.37,.48,.50]);
 }
 box([.987,.65,-.30],[.03,.57,.68],[.34,.31,.28]);
 box([1.006,.65,-.30],[.012,.49,.60],[.13,.23,.27]);
 box([1.015,.65,-.30],[.006,.49,.022],[.79,.77,.71]);
 box([.31,.45,.944],[.49,.9,.045],[.34,.28,.23]);
 for(let k=-2;k<=2;k++)box([.31+k*.075,.45,.972],[.012,.86,.008],[.42,.35,.28]);
 box([.43,.46,.985],[.025,.10,.02],palette.orange);
 box([.31,.025,1.04],[.65,.05,.25],[.54,.49,.42]);
 // Storage enclosure: quiet industrial design, conceptual rather than a real product.
 box([1.70,.43,.3],[.57,.86,.55],[.20,.20,.19]);
 box([1.70,.46,.585],[.47,.70,.025],[.37,.34,.30]);
 box([1.70,.76,.606],[.22,.035,.012],palette.orange);
 for(let k=0;k<4;k++)box([1.70,.30+k*.055,.604],[.30,.012,.007],[.23,.22,.21]);
 box([1.70,.89,.3],[.59,.06,.57],[.78,.76,.70]);
 box([1.12,.69,.5],[.17,.36,.29],[.89,.40,.15]);
 box([1.215,.69,.5],[.02,.23,.19],[.32,.29,.26]);
 box([1.13,.08,.68],[.045,.04,.55],palette.orange);
 box([1.43,.08,.93],[.64,.04,.045],palette.orange);
 box([1.73,.08,.77],[.045,.04,.32],palette.orange);
 // Front deck with restrained wood rhythm; compact planted strip.
 for(let k=0;k<9;k++)box([-1.43+k*.27,.012,1.43],[.255,.035,.64],[.43+(k%2)*.025,.34+(k%2)*.02,.27+(k%2)*.02]);
 box([-2.12,.12,.65],[.43,.27,1.4],[.40,.37,.31]);
 box([-2.12,.26,.65],[.35,.02,1.30],[.24,.24,.19]);
 function sphere(c,r,color,glow=0){
  const point=(a,b)=>[c[0]+r*Math.cos(a)*Math.cos(b),c[1]+r*Math.sin(a),c[2]+r*Math.cos(a)*Math.sin(b)];
  for(let i=0;i<8;i++)for(let j=0;j<12;j++){const a=-Math.PI/2+i*Math.PI/8,b=j*Math.PI/6;
   tri(point(a,b),point(a+Math.PI/8,b),point(a+Math.PI/8,b+Math.PI/6),color,glow);
   tri(point(a,b),point(a+Math.PI/8,b+Math.PI/6),point(a,b+Math.PI/6),color,glow);}
 }
 for(const z of [.18,.66,1.1])sphere([-2.12,.41,z],.23,[.41,.44,.32]);
 sphere([-1.8,2.65,-.4],.25,palette.orange,.35);
 return new Float32Array(data);
}
// Software projection uses the same triangles, camera, lighting and perspective.
// A per-pixel software depth buffer handles overlapping panels and roof faces.
function project(mesh,yaw,aspect){
 const c=Math.cos(yaw),s=Math.sin(yaw),polygons=[];
 const turn=(x,y,z)=>[c*x+s*z,y,-s*x+c*z];
 for(let i=0;i<mesh.length;i+=30){
  const points=[],depths=[];let depth=0;
  for(let k=0;k<3;k++){
   const j=i+k*10,p=turn(mesh[j],mesh[j+1],mesh[j+2]);p[1]-=.8;
   const y=.883*p[1]-.469*p[2],z=.469*p[1]+.883*p[2],d=7.6-z;
   points.push([p[0]*2.15/aspect/d,y*2.15/d]);depths.push(d);depth+=d/3;
  }
  const n=turn(mesh[i+3],mesh[i+4],mesh[i+5]);
  const light=.48+.52*Math.max((-n[0]*.4+n[1]*.9+n[2])/Math.sqrt(1.97),0);
  const shade=light*(1-mesh[i+9])+mesh[i+9];
  const color=[6,7,8].map(k=>Math.round(255*mesh[i+k]*shade));
  polygons.push({points,depths,depth,color});
 }
 return polygons.sort((a,b)=>b.depth-a.depth);
}
// Small software depth buffer: correct occlusion, without antialiased seams between faces.
function rasterize(faces,width,height,pixels,depthBuffer){
 pixels.fill(0);depthBuffer.fill(0);
 for(const face of faces){
  const p=face.points.map(v=>[(v[0]+1)*width/2,(1-v[1])*height/2]);
  const [a,b,c]=p,area=(b[1]-c[1])*(a[0]-c[0])+(c[0]-b[0])*(a[1]-c[1]);
  if(Math.abs(area)<1e-7)continue;
  const minX=Math.max(0,Math.floor(Math.min(a[0],b[0],c[0]))),maxX=Math.min(width-1,Math.ceil(Math.max(a[0],b[0],c[0])));
  const minY=Math.max(0,Math.floor(Math.min(a[1],b[1],c[1]))),maxY=Math.min(height-1,Math.ceil(Math.max(a[1],b[1],c[1])));
  const dx0=(b[1]-c[1])/area,dy0=(c[0]-b[0])/area,dx1=(c[1]-a[1])/area,dy1=(a[0]-c[0])/area;
  for(let y=minY;y<=maxY;y++){
   let w0=dx0*(minX+.5-c[0])+dy0*(y+.5-c[1]),w1=dx1*(minX+.5-c[0])+dy1*(y+.5-c[1]);
   for(let x=minX;x<=maxX;x++,w0+=dx0,w1+=dx1){
    const w2=1-w0-w1;
    if(w0< -1e-8||w1< -1e-8||w2< -1e-8)continue;
    const inverse=w0/face.depths[0]+w1/face.depths[1]+w2/face.depths[2],index=y*width+x;
    if(inverse<=depthBuffer[index])continue;
    depthBuffer[index]=inverse;const k=index*4;
    pixels[k]=face.color[0];pixels[k+1]=face.color[1];pixels[k+2]=face.color[2];pixels[k+3]=255;
   }
  }
 }
 return pixels;
}
const vertex='attribute vec3 position;attribute vec3 normal;attribute vec3 color;attribute float glow;uniform float yaw;uniform float aspect;varying vec3 tint;void main(){float c=cos(yaw),s=sin(yaw);mat3 turn=mat3(c,0.,-s,0.,1.,0.,s,0.,c);vec3 p=turn*position; p.y-=.8;float cp=.883,sp=.469;vec3 eye=vec3(p.x,cp*p.y-sp*p.z,sp*p.y+cp*p.z);float depth=7.6-eye.z;gl_Position=vec4(eye.x*2.15/aspect,eye.y*2.15,depth*.98-.2,depth);vec3 n=turn*normal;float light=.48+.52*max(dot(normalize(n),normalize(vec3(-.4,.9,1.))),0.);tint=color*mix(light,1.,glow);}';
const fragment='precision mediump float;varying vec3 tint;void main(){gl_FragColor=vec4(tint,1.);}';
function start(canvas){
 const fallback=canvas.parentElement.querySelector('.geometry-fallback');
 const media=scope.matchMedia('(prefers-reduced-motion: reduce)');
 let gl,context2d,mesh2d,image2d,depth2d,program,count,buffer,yaw,aspect,displayAspect=1,raf=0,last=0,phase=0,visible=true,failed=false;
 function stop(){if(raf)scope.cancelAnimationFrame(raf);raf=0;}
 function fail(reason='initialization-failed'){canvas.dataset.rendererReason=reason;stop();failed=true;canvas.hidden=true;if(fallback)fallback.removeAttribute('hidden');canvas.dataset.renderer='static';}
 function software(){
  context2d=canvas.getContext('2d',{alpha:true});
  if(!context2d)return fail('webgl-unavailable');
  mesh2d=geometry();canvas.hidden=false;failed=false;
  resize();draw();if(fallback)fallback.setAttribute('hidden','');
  canvas.dataset.renderer='canvas2d';canvas.dataset.rendererReason='webgl-unavailable';
  sync();
 }
 function initialize(){
  const pendingShaders=[];
  try{
   gl=canvas.getContext('webgl',{alpha:true,antialias:true,powerPreference:'low-power',preserveDrawingBuffer:false});
   if(!gl)return software();
   function shader(type,source){const s=gl.createShader(type);pendingShaders.push(s);gl.shaderSource(s,source);gl.compileShader(s);if(!gl.getShaderParameter(s,gl.COMPILE_STATUS))throw Error('shader-compile');return s;}
   program=gl.createProgram();const vs=shader(gl.VERTEX_SHADER,vertex),fs=shader(gl.FRAGMENT_SHADER,fragment);
   gl.attachShader(program,vs);gl.attachShader(program,fs);gl.linkProgram(program);if(!gl.getProgramParameter(program,gl.LINK_STATUS))throw Error('program-link');
   gl.deleteShader(vs);gl.deleteShader(fs);pendingShaders.length=0;gl.useProgram(program);buffer=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buffer);const mesh=geometry();count=mesh.length/10;gl.bufferData(gl.ARRAY_BUFFER,mesh,gl.STATIC_DRAW);
   for(const [name,size,offset] of [['position',3,0],['normal',3,12],['color',3,24],['glow',1,36]]){const loc=gl.getAttribLocation(program,name);gl.enableVertexAttribArray(loc);gl.vertexAttribPointer(loc,size,gl.FLOAT,false,40,offset);}
   yaw=gl.getUniformLocation(program,'yaw');aspect=gl.getUniformLocation(program,'aspect');gl.enable(gl.DEPTH_TEST);gl.clearColor(0,0,0,0);
   canvas.hidden=false;failed=false;resize();draw();if(fallback)fallback.setAttribute('hidden','');canvas.dataset.renderer='webgl';sync();
  }catch(error){if(gl){pendingShaders.forEach(s=>gl.deleteShader(s));if(buffer)gl.deleteBuffer(buffer);if(program)gl.deleteProgram(program);}fail(['shader-compile','program-link'].includes(error.message)?error.message:'initialization-failed');}
 }
 function resize(){if((!gl&&!context2d)||failed)return;const rect=canvas.getBoundingClientRect(),w=Math.max(1,rect.width),h=Math.max(1,rect.height),scale=Math.min(context2d?1.6:(scope.devicePixelRatio||1),context2d?1.6:(rect.width<=500?1:1.5),(context2d?900:1280)/w,(context2d?900:1000)/h);displayAspect=w/h;canvas.width=Math.max(1,Math.round(w*scale));canvas.height=Math.max(1,Math.round(h*scale));if(gl)gl.viewport(0,0,canvas.width,canvas.height);if(context2d){image2d=context2d.createImageData(canvas.width,canvas.height);depth2d=new Float32Array(canvas.width*canvas.height);}draw();}
 function draw(){
  if(failed)return;
  const angle=-.48+Math.sin(phase)*.4;
  if(context2d){
   rasterize(project(mesh2d,angle,displayAspect),canvas.width,canvas.height,image2d.data,depth2d);
   context2d.putImageData(image2d,0,0);
   return;
  }
  if(!gl)return;gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);gl.uniform1f(yaw,-.48+Math.sin(phase)*.4);gl.uniform1f(aspect,displayAspect);gl.drawArrays(gl.TRIANGLES,0,count);}
 function moving(){return !failed&&visible&&!document.hidden&&!media.matches&&!document.documentElement.classList.contains('motion-paused');}
 function frame(t){raf=0;if(!moving())return;if(!last)last=t;if(t-last>=33){phase+=Math.min(t-last,100)/4500;last=t;draw();}raf=scope.requestAnimationFrame(frame);}
 function sync(){stop();last=0;if(moving())raf=scope.requestAnimationFrame(frame);else if(media.matches){phase=0;draw();}}
 canvas.addEventListener('webglcontextlost',e=>{e.preventDefault();fail('context-lost');});
 canvas.addEventListener('webglcontextrestored',initialize);
 media.addEventListener('change',sync);document.addEventListener('visibilitychange',sync);
 new MutationObserver(sync).observe(document.documentElement,{attributes:true,attributeFilter:['class']});
 if('IntersectionObserver' in scope)new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;sync();},{threshold:.03}).observe(canvas.parentElement);
 if('ResizeObserver' in scope)new ResizeObserver(resize).observe(canvas.parentElement);else scope.addEventListener('resize',resize);
 initialize();
}
if(typeof module!=='undefined'&&module.exports)module.exports={geometry,rotate,project,rasterize,vertex,fragment};
else document.querySelectorAll('[data-solar-geometry]').forEach(start);
})(typeof window!=='undefined'?window:globalThis);
