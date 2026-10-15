import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {JSDOM} from 'jsdom';
import {boot} from './helpers.mjs';
import {wormholeFrame,wormholeMesh} from '../dist/wormhole-core.mjs';
import {normalizePreferences} from '../dist/personal-core.mjs';
import {LEGACY_INTEREST_TYPES} from '../dist/taxonomy-core.mjs';

function renderFrame(b,t){for(const [id,fn]of [...b.frames]){b.frames.delete(id);fn(t);}}

test('the opening black hole enlarges and fades into a curved, helical tunnel',()=>{
 const start=wormholeFrame(0,1440,900),approach=wormholeFrame(.3,1440,900),flight=wormholeFrame(.8,1440,900);
 assert.equal(start.holeAlpha,1);assert.equal(start.warp,0);assert(approach.core>start.core*2);assert.equal(flight.holeAlpha,0);assert.equal(flight.warp,1);
 const rings=wormholeMesh(flight,22,56);assert.equal(rings.length,22);assert(rings.every(x=>x.points.length===56));
 const angles=rings.map(r=>Math.atan2(r.points[0].y-r.cy,r.points[0].x-r.cx));assert(Math.max(...angles)-Math.min(...angles)>.5,'Rails must twist across depth');
 assert(new Set(rings.map(r=>Math.round(r.cx))).size>5,'Ring centres must reveal a curved tunnel');
 for(const [w,h]of [[320,568],[390,844],[1440,900]])for(const p of [-1,0,.25,.5,.75,1,2,NaN]){
  const f=wormholeFrame(p,w,h);assert(Object.values(f).every(Number.isFinite));assert(f.core>0&&f.radius>f.core);
  for(const ring of wormholeMesh(f)){assert(ring.r>0&&ring.alpha>=0&&ring.alpha<=1);assert(ring.points.every(v=>Number.isFinite(v.x)&&Number.isFinite(v.y)));}
 }
 assert.equal(wormholeMesh(flight,Infinity,NaN).length,18);
});

test('the passage actually draws a dark silhouette, elliptical disks and tunnel rails on phone and desktop',()=>{
 for(const [width,height]of [[320,568],[1440,900]]){
  const b=boot({}, {entry:true,width,height});try{
   b.click('#enterCity');renderFrame(b,150);assert(b.drawing.blackCores>0);assert(b.drawing.ellipse>=20);
   const lines=b.drawing.line,cores=b.drawing.blackCores;renderFrame(b,1200);assert(b.drawing.line>lines+200);assert.equal(b.drawing.blackCores,cores);assert.equal(b.drawing.invalid,0);
   b.click('#portalCancel');const elliptic=b.drawing.ellipse;renderFrame(b,1250);assert.equal(b.drawing.ellipse,elliptic);assert(b.$('#storefront').hidden);assert.deepEqual(b.errors,[]);
  }finally{b.dom.window.close();}
 }
});

test('background visibility pauses and resumes the same passage without resetting its finish time',()=>{
 const b=boot({}, {entry:true});try{
  const {$,w,click,advance,frames}=b;click('#enterCity');assert.equal(frames.size,1);renderFrame(b,100);
  Object.defineProperty(w.document,'hidden',{value:true,configurable:true});w.document.dispatchEvent(new w.Event('visibilitychange'));assert.equal(frames.size,0);
  advance(1000);assert($('#portalDialog').open);
  Object.defineProperty(w.document,'hidden',{value:false,configurable:true});w.document.dispatchEvent(new w.Event('visibilitychange'));assert.equal(frames.size,1);renderFrame(b,1000);
  advance(499);assert($('#portalDialog').open);advance(1);assert(!$('#portalDialog').open);assert(!$('#storefront').hidden);assert.equal(frames.size,1);assert.deepEqual(b.errors,[]);
 }finally{b.dom.window.close();}
});

test('resizing during the passage replaces its drawing surface without adding frames or changing duration',()=>{
 const b=boot({}, {entry:true,width:320,height:568});try{
  const {$,w,click,advance}=b;click('#entryBrowse');advance(400);w.innerWidth=1440;w.innerHeight=900;w.dispatchEvent(new w.Event('resize'));assert.equal(b.frames.size,1);assert.equal($('#portalCanvas').width,1440);
  renderFrame(b,900);assert.equal(b.drawing.invalid,0);advance(1099);assert($('#portalDialog').open);advance(1);assert(!$('#storefront').hidden);assert.deepEqual(b.errors,[]);
 }finally{b.dom.window.close();}
});

test('effects can stop and resume a passage while its calm fallback and controls remain available',()=>{
 const b=boot({}, {entry:true});try{
  const {$,w,click,advance}=b;click('#entryBrowse');assert($('#portalDialog .hole-fallback'));w.document.dispatchEvent(new w.CustomEvent('city:effects',{detail:false}));assert.equal(b.frames.size,0);assert(w.document.documentElement.classList.contains('effects-off'));assert($('#portalSkip'));
  advance(500);w.document.dispatchEvent(new w.CustomEvent('city:effects',{detail:true}));assert.equal(b.frames.size,1);advance(999);assert($('#portalDialog').open);advance(1);assert(!$('#storefront').hidden);assert.deepEqual(b.errors,[]);
 }finally{b.dom.window.close();}
});

test('galaxy and crimson moods persist while existing budget, interest and daylight preferences remain valid',()=>{
 const old=normalizePreferences({nickname:'小星',budget:50,interests:['家居生活'],accent:'coral'});assert.equal(old.cosmicTone,'galaxy');assert.equal(old.budget,50);assert.equal(old.accent,'coral');assert.equal(normalizePreferences({cosmicTone:'invalid'}).cosmicTone,'galaxy');
 assert.equal(old.schema_version,21);assert.deepEqual(old.legacy_interests,['家居生活']);assert.deepEqual(old.interests,LEGACY_INTEREST_TYPES['家居生活']);assert.deepEqual(normalizePreferences(old),old);
 const b=boot();let saved;try{
  b.click('.personal-header');b.$('#personalCosmicTone').value='crimson';b.$('#personalForm').dispatchEvent(new b.w.Event('submit',{bubbles:true,cancelable:true}));saved=b.w.localStorage.getItem('domyon-preferences');assert.equal(b.w.document.documentElement.dataset.cosmicTone,'crimson');assert.equal(b.$('#resultCount').textContent,'1000 件');assert.deepEqual(b.errors,[]);
 }finally{b.dom.window.close();}
 const again=boot({'domyon-preferences':saved,'boutique-theme':'light'},{entry:true});try{assert.equal(again.w.document.documentElement.dataset.cosmicTone,'crimson');assert.equal(again.w.document.documentElement.dataset.theme,'light');assert.deepEqual(again.errors,[]);}finally{again.dom.window.close();}
});

test('cyber styling is scoped to night and static fallback works with motion disabled',()=>{
 const dom=new JSDOM('<!doctype html><html data-theme="dark"><body><div class="cyber-emblem"></div><div id="portalDialog"><canvas id="portalCanvas"></canvas><div class="hole-fallback"></div></div></body></html>');try{
  const {document}=dom.window;for(const f of ['refined.css','discovery.css','cyber.css']){const style=document.createElement('style');style.textContent=fs.readFileSync('dist/'+f,'utf8').replace(/^@charset[^;]+;\s*/,'');document.head.append(style);}
  assert.equal(dom.window.getComputedStyle(document.documentElement).getPropertyValue('--bg'),'#040610');assert.equal(dom.window.getComputedStyle(document.querySelector('.cyber-emblem')).display,'block');
  document.documentElement.dataset.theme='light';assert.equal(dom.window.getComputedStyle(document.documentElement).getPropertyValue('--bg'),'#f9f6f0');assert.equal(dom.window.getComputedStyle(document.querySelector('.cyber-emblem')).display,'none');
  document.documentElement.classList.add('effects-off');assert.equal(dom.window.getComputedStyle(document.getElementById('portalCanvas')).display,'none');assert.notEqual(dom.window.getComputedStyle(document.querySelector('.hole-fallback')).display,'none');
 }finally{dom.window.close();}
});
