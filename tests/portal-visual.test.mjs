import test from 'node:test';
import assert from 'node:assert/strict';
import {wormholeFrame,wormholeMesh,paintBlackHole,paintWormhole} from '../dist/wormhole-core.mjs';

// A command recorder checks composition semantics and numeric validity without
// claiming that a mocked Canvas proves the browser's rendered appearance.
function recorder(){
 const commands=[],stack=[];let path=[],state={globalAlpha:1,globalCompositeOperation:'source-over',lineWidth:1,fillStyle:'#000',strokeStyle:'#000'};
 const values=args=>{for(const n of args)if(typeof n==='number')assert(Number.isFinite(n),'Canvas receives finite coordinates');};
 const ctx={commands,
  save(){stack.push({...state});},restore(){assert(stack.length);state=stack.pop();},
  translate(...a){values(a);},rotate(...a){values(a);},
  beginPath(){path=[];},closePath(){path.push(['close']);},
  moveTo(...a){values(a);path.push(['move',...a]);},lineTo(...a){values(a);path.push(['line',...a]);},
  arc(...a){values(a);assert(a[2]>0);path.push(['arc',...a]);},
  ellipse(...a){values(a);assert(a[2]>0&&a[3]>0);path.push(['ellipse',...a]);},
  fill(){commands.push({kind:'fill',path:[...path],...state});},
  stroke(){assert(Number.isFinite(state.lineWidth)&&state.lineWidth>0);commands.push({kind:'stroke',path:[...path],...state});},
  fillRect(...a){values(a);commands.push({kind:'rect',args:a,...state});},
  createRadialGradient(...a){values(a);assert(a[2]>=0&&a[5]>a[2]);const g={kind:'radial',args:a,stops:[],addColorStop(at,color){assert(at>=0&&at<=1);this.stops.push([at,color]);}};return g;},
  createLinearGradient(...a){values(a);return {kind:'linear',args:a,stops:[],addColorStop(at,color){assert(at>=0&&at<=1);this.stops.push([at,color]);}};}
 };
 for(const key of Object.keys(state))Object.defineProperty(ctx,key,{get:()=>state[key],set:value=>{if(key==='globalAlpha')assert(Number.isFinite(value)&&value>=0&&value<=1);state[key]=value;}});
 ctx.balanced=()=>stack.length===0;
 return ctx;
}

test('black-hole shadows occlude every disk filament while a separate outer rim remains visible',()=>{
 for(const [w,h] of [[320,568],[1440,900]])for(const p of [0,.1,.3,.48]){
  const f=wormholeFrame(p,w,h),ctx=recorder();paintBlackHole(ctx,f);
  const coreIndex=ctx.commands.findIndex(c=>c.kind==='fill'&&c.fillStyle==='#010106');
  assert(coreIndex>0,'the disk has an opaque core');
  const core=ctx.commands[coreIndex];assert.equal(core.globalCompositeOperation,'source-over');assert.equal(core.path[0][0],'arc');
  assert.equal(core.path[0][3],f.core);
  assert(!ctx.commands.slice(coreIndex+1).some(c=>c.kind==='stroke'),'no luminous disk stroke covers the dark core');
  const rim=ctx.commands.slice(coreIndex+1).find(c=>c.fillStyle?.kind==='radial');
  assert(rim&&rim.fillStyle.args[2]>=f.core,'the final halo starts outside the opaque core');
  assert(ctx.commands.some(c=>c.path?.some(a=>a[0]==='ellipse'&&a[4]>a[3])),'a tall lensing arc is distinct from the flat disk');
  assert(ctx.balanced());
 }
});

test('tunnel geometry stays finite and bounded at hostile viewport and mesh inputs',()=>{
 for(const [w,h]of [[0,-1],[NaN,Infinity],[Number.MAX_VALUE,Number.MAX_VALUE],[320,568],[1440,900]])for(const p of [-Infinity,NaN,0,.37,.73,1,Infinity]){
  const f=wormholeFrame(p,w,h);assert(Object.values(f).every(Number.isFinite));assert(f.w<=16384&&f.h<=16384);
  assert(f.flash>=0&&f.flash<=.5,'arrival glow is bounded below a full-bright flash');
  const rings=wormholeMesh(f,1e50,1e50);assert.equal(rings.length,24);assert(rings.every(r=>r.points.length===64));
  assert(rings.every(r=>Number.isFinite(r.r)&&r.alpha>=0&&r.alpha<=1));
  assert(rings.every(r=>r.points.every(q=>Number.isFinite(q.x)&&Number.isFinite(q.y)&&Math.abs(q.x)<4*Math.max(f.w,f.h)&&Math.abs(q.y)<4*Math.max(f.w,f.h))));
 }
});

test('curved tunnel walls and moving light trails have a fixed per-frame drawing budget',()=>{
 for(const [w,h]of [[320,568],[1440,900]])for(const p of [.35,.6,.85,1])for(const crimson of [false,true]){
  const f=wormholeFrame(p,w,h),rings=wormholeMesh(f,24,64),ctx=recorder();
  paintWormhole(ctx,f,rings,crimson);paintBlackHole(ctx,f,crimson);
  const operations=ctx.commands.reduce((n,c)=>n+(c.path?.length||1),0);
  assert(operations<4500,'draw work is bounded independently of viewport size or duration');
  assert(ctx.commands.filter(c=>c.kind==='fill'&&c.path.some(a=>a[0]==='line')).length>40,'the curved tunnel has actual wall surfaces, beyond flat rings');
  const centres=rings.map(r=>r.cx);assert(Math.max(...centres)-Math.min(...centres)>Math.min(w,h)*.02,'the tunnel bends across depth');
  assert(ctx.balanced());
 }
});
