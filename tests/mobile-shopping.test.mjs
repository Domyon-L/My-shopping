import test from 'node:test';
import assert from 'node:assert/strict';
import {boot} from './helpers.mjs';
import {projectTunnel} from '../dist/experience-core.mjs';

test('mobile loads successive products without duplicates and keeps filters collapsed until requested',()=>{
 const b=boot({}, {width:390,height:844});try{
  const {$,w,click,change}=b;
  assert($('#filterFields').hidden);assert($('#filterFields').inert);assert($('#pageButtons').hidden);
  const first=[...w.document.querySelectorAll('.product-card')].map(n=>n.dataset.product);assert.equal(first.length,24);
  click('#loadMore');const next=[...w.document.querySelectorAll('.product-card')].map(n=>n.dataset.product);
  assert.equal(next.length,48);assert.equal(new Set(next).size,48);assert.deepEqual(next.slice(0,24),first);
  click('#mobileFiltersToggle');assert(!$('#filterFields').hidden);assert(!$('#filterFields').inert);assert.equal($('#mobileFiltersToggle').getAttribute('aria-expanded'),'true');
  change('#budgetSelect','0-50');assert.equal($('#resultCount').textContent,'222 件');assert(!$('#loadMore').hidden);assert.equal($('#filterBadge').textContent,'1');
  click('#applyMobileFilters');assert($('#filterFields').hidden);assert.equal(w.document.activeElement.id,'products');
  w.innerWidth=1280;w.dispatchEvent(new w.Event('resize'));assert(!$('#filterFields').hidden);assert(!$('#pageButtons').hidden);assert($('#loadMore').hidden);
  assert.deepEqual(b.errors,[]);
 }finally{b.dom.window.close();}
});

test('phone sidebar categories and complete-catalog shortcut expose real inventory',()=>{
 const b=boot({}, {width:320,height:568});try{
  const {$,w,click}=b;assert.equal(w.document.querySelectorAll('#shopChannels [data-type]').length,12);
  assert.equal(w.document.querySelectorAll('#shopChannels [data-type] .channel-icon svg').length,12);
  click('[data-scope="favorites"]');click('.quick-browse [data-value=""]');click('#menuToggle');click('.shop-scenes [data-type="数码科技"]');assert.equal($('#resultCount').textContent,'72 件');
  assert(!$('#loadMore').hidden);assert.equal($('#products').children.length,24);
  click('#menuToggle');click('.quick-browse [data-value=""]');assert.equal($('#resultCount').textContent,'1000 件');assert(!w.document.body.classList.contains('rail-open'));click('#menuToggle');assert(!$('#categoryRail').inert);
  assert.deepEqual(b.errors,[]);
 }finally{b.dom.window.close();}
});

test('tunnel icons move with star flow and stop after cancellation',()=>{
 const b=boot({}, {entry:true,width:1440,height:900});try{
  const {$,click,frames,drawing}=b;click('#enterCity');
  for(const [id,fn]of [...frames]){frames.delete(id);fn(450);}
  assert(drawing.paths>0,'The tunnel must actually draw product category paths');assert(drawing.line>200);
  const count=drawing.paths;click('#portalCancel');assert(!$('#portalDialog').open);assert($('#storefront').hidden);
  for(const [id,fn]of [...frames]){frames.delete(id);fn(800);}
  assert.equal(drawing.paths,count);assert.deepEqual(b.errors,[]);
 }finally{b.dom.window.close();}
});

test('perspective projection grows towards the viewer and stays finite across viewport sizes',()=>{
 const seed={x:.2,y:.1,z:.8};
 const far=projectTunnel(seed,0,1440,900),near=projectTunnel(seed,.16,1440,900);
 assert(near.size>far.size);assert(Math.hypot(near.x-near.cx,near.y-near.cy)>Math.hypot(far.x-far.cx,far.y-far.cy));
 assert(Math.hypot(near.tailX-near.cx,near.tailY-near.cy)<Math.hypot(near.x-near.cx,near.y-near.cy));
 for(const [width,height]of [[320,568],[390,844],[1440,900]])for(const progress of [0,.25,.5,.75,1]){
  const f=projectTunnel(seed,progress,width,height);assert(Object.values(f).every(Number.isFinite));assert(f.alpha>=0&&f.alpha<=1);assert(f.size>0&&f.size<=(width<600?74:110));
 }
});
