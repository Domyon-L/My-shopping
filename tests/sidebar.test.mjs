import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {boot} from './helpers.mjs';
function point(b,target,type,x=400,y=220,pointerType='mouse'){
 const e=new b.w.MouseEvent(type,{bubbles:true,cancelable:true,clientX:x,clientY:y,button:0});Object.defineProperty(e,'pointerType',{value:pointerType});target.dispatchEvent(e);
}
function open(b){return b.w.document.body.classList.contains('rail-open');}

test('category and budget controls have one sidebar home, fixed search and an invisible edge target',()=>{
 const b=boot();try{const {$,w}=b,rail=$('#categoryRail');assert(rail.contains($('#shopChannels')));assert(rail.contains($('.quick-browse')));assert.equal($('#main .shop-scenes'),null);assert.equal($('#main .quick-browse'),null);assert($('.header').contains($('#searchForm')));assert.equal($('.rail-reveal'),null);
 for(const l of w.document.querySelectorAll('link[rel=stylesheet]')){const name=l.getAttribute('href').split('/').at(-1);const style=w.document.createElement('style');style.textContent=fs.readFileSync('dist/assets/'+name,'utf8').replace(/^@charset[^;]+;\s*/,'');w.document.head.append(style);}
 const css=w.getComputedStyle($('.header')),edge=w.getComputedStyle($('#railReveal'));assert.equal(css.position,'fixed');assert.equal(css.top,'0px');assert.equal(edge.opacity,'0');assert.equal(edge.width,'14px');assert.equal($('#railReveal').querySelector('svg,b'),null);assert.deepEqual(b.errors,[]);
 }finally{b.dom.window.close();}
});

test('pointer presence keeps navigation open indefinitely, including while a category is clicked',()=>{
 const b=boot();try{const {$,w,click,advance}=b;assert(open(b));point(b,$('#categoryRail'),'pointerenter',110,220);advance(20000);assert(open(b));
 point(b,$('#categories [data-type="数码家电"]'),'pointerdown',110,220);click('#categories [data-type="数码家电"]');point(b,w,'pointerup',110,220);advance(10000);assert(open(b));assert($('#breadcrumb').textContent.includes('数码家电'));assert(!$('#main').inert);assert(!$('.header').inert);
 point(b,w.document.body,'pointermove',450,240);advance(2999);assert(open(b));advance(1);assert(!open(b));assert($('#categoryRail').inert);assert.deepEqual(b.errors,[]);
 }finally{b.dom.window.close();}
});

test('hidden navigation returns on left-edge hover without a click or focus theft',()=>{
 const b=boot();try{const {$,w,advance}=b;point(b,w.document.body,'pointermove',500,240);advance(3000);assert(!open(b));$('#search').focus();point(b,w.document.body,'pointermove',3,230);assert(open(b));assert.equal(w.document.activeElement.id,'search');advance(12000);assert(open(b));
 point(b,w.document.body,'pointermove',420,230);advance(3000);assert(!open(b));assert.equal(w.document.activeElement.id,'search');assert.equal($('#railReveal').getAttribute('aria-expanded'),'false');assert.deepEqual(b.errors,[]);
 }finally{b.dom.window.close();}
});

test('a held press and repeated outside clicks suspend or restart hiding',()=>{
 const b=boot();try{const {$,w,click,advance}=b;point(b,w.document.body,'pointermove',450,230);point(b,w.document.body,'pointerdown');advance(6000);assert(open(b));point(b,w,'pointerup');
 advance(2900);click('#heroTitle');advance(2900);click('#heroTitle');advance(2999);assert(open(b));advance(1);assert(!open(b));assert.deepEqual(b.errors,[]);
 }finally{b.dom.window.close();}
});

test('keyboard focus is protected until it leaves navigation, without leaving a visible handle',()=>{
 const b=boot();try{const {$,w,advance}=b;point(b,w.document.body,'pointermove',400,220);advance(3000);assert(!open(b));$('#search').dispatchEvent(new w.KeyboardEvent('keydown',{key:'Tab',bubbles:true}));$('#railReveal').focus();assert(open(b));assert.equal(w.document.activeElement.id,'menuClose');advance(10000);assert(open(b));$('#search').focus();advance(3000);assert(!open(b));assert.equal(w.document.activeElement.id,'search');assert.deepEqual(b.errors,[]);
 }finally{b.dom.window.close();}
});

test('phone touch navigation stays accessible and still closes after choosing a budget',()=>{
 const b=boot({}, {width:390,height:844});try{const {$,w,click,advance}=b;assert($('#categoryRail').inert);$('#menuToggle').focus();click('#menuToggle');assert($('#main').inert);
 point(b,$('#categoryRail'),'pointerenter',10,220,'touch');advance(3000);assert(!open(b));assert(!$('#main').inert);assert.equal(w.document.activeElement.id,'menuToggle');click('#menuToggle');click('.quick-browse [data-value="hundred"]');assert(!open(b));assert([...w.document.querySelectorAll('#products [data-product]')].every(el=>w.CATALOG.items.find(x=>x.id===Number(el.dataset.product)).price.max<=100));assert.deepEqual(b.errors,[]);
 }finally{b.dom.window.close();}
});

test('leaving the shopping scene clears hover state and pending hiding',()=>{
 const b=boot();try{const {$,w,click,advance}=b;point(b,$('#categoryRail'),'pointerenter',100,220);w.innerWidth=390;w.dispatchEvent(new w.Event('resize'));assert.equal($('#categoryRail').getAttribute('aria-modal'),'true');assert($('#main').inert);w.innerWidth=1280;w.dispatchEvent(new w.Event('resize'));assert(!$('#main').inert);point(b,w.document.body,'pointermove',500,220);click('#backToEntry');advance(10000);assert($('#storefront').hidden);assert(!open(b));point(b,w.document.body,'pointermove',2,220);assert(!open(b));assert.deepEqual(b.errors,[]);
 }finally{b.dom.window.close();}
});
