import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {boot} from './helpers.mjs';

test('the pictured category and budget controls live only in the left sidebar, with fixed top search',()=>{
 const b=boot();try{const {$,w}=b,rail=$('#categoryRail');assert(rail.contains($('#shopChannels')));assert(rail.contains($('.quick-browse')));assert.equal($('#main .shop-scenes'),null);assert.equal($('#main .quick-browse'),null);assert($('.header').contains($('#searchForm')));
 for(const l of w.document.querySelectorAll('link[rel=stylesheet]')){const name=l.getAttribute('href').split('/').at(-1);const style=w.document.createElement('style');style.textContent=fs.readFileSync('dist/assets/'+name,'utf8').replace(/^@charset[^;]+;\s*/,'');w.document.head.append(style);}
 const css=w.getComputedStyle($('.header'));assert.equal(css.position,'fixed');assert.equal(css.top,'0px');assert.equal(css.zIndex,'60');assert.equal($('#searchSubmit').type,'submit');assert.deepEqual(b.errors,[]);
 }finally{b.dom.window.close();}
});

test('desktop sidebar starts open, closes at exactly three idle seconds and is recoverable',()=>{
 const b=boot();try{const {$,w,click,advance}=b;assert(w.document.body.classList.contains('rail-open'));assert(!$('#categoryRail').inert);assert(!$('#main').inert);assert(!$('.header').inert);assert($('#railBackdrop').hidden);assert.equal($('#categoryRail').getAttribute('aria-modal'),null);
 click('#heroTitle');advance(2999);assert(w.document.body.classList.contains('rail-open'));advance(1);assert(!w.document.body.classList.contains('rail-open'));assert($('#categoryRail').inert);assert.equal($('#menuToggle').getAttribute('aria-expanded'),'false');assert.equal(w.document.activeElement.id,'heroTitle');
 click('#railReveal');assert(w.document.body.classList.contains('rail-open'));advance(2000);$('#search').focus();click('#search');advance(2999);assert(w.document.body.classList.contains('rail-open'));advance(1);assert(!w.document.body.classList.contains('rail-open'));assert.equal(w.document.activeElement.id,'search');assert.equal($('#railReveal').getAttribute('aria-expanded'),'false');assert.deepEqual(b.errors,[]);
 }finally{b.dom.window.close();}
});

test('mobile drawer idles for three seconds, restores focus and extends time for keyboard navigation',()=>{
 const b=boot({}, {width:390,height:844});try{const {$,w,click,advance}=b;assert($('#categoryRail').inert);$('#menuToggle').focus();click('#menuToggle');assert($('#main').inert);advance(2999);assert(w.document.body.classList.contains('rail-open'));
 $('#menuClose').dispatchEvent(new w.KeyboardEvent('keydown',{key:'Tab',bubbles:true,cancelable:true}));advance(2999);assert(w.document.body.classList.contains('rail-open'));advance(1);assert(!w.document.body.classList.contains('rail-open'));assert(!$('#main').inert);assert(!$('.header').inert);assert.equal(w.document.activeElement.id,'menuToggle');
 click('#menuToggle');click('.quick-browse [data-value="hundred"]');assert(!w.document.body.classList.contains('rail-open'));assert([...w.document.querySelectorAll('#products [data-product]')].every(el=>w.CATALOG.items.find(x=>x.id===Number(el.dataset.product)).price.max<=100));assert.deepEqual(b.errors,[]);
 }finally{b.dom.window.close();}
});

test('viewport changes preserve one active timeout and clean up inert states; entrance has none',()=>{
 const b=boot();try{const {$,w,click,advance}=b;click('#heroTitle');w.innerWidth=390;w.dispatchEvent(new w.Event('resize'));assert.equal($('#categoryRail').getAttribute('aria-modal'),'true');assert($('#main').inert);
 w.innerWidth=1280;w.dispatchEvent(new w.Event('resize'));assert.equal($('#categoryRail').getAttribute('aria-modal'),null);assert(!$('#main').inert);advance(3000);assert($('#categoryRail').inert);click('#backToEntry');advance(4000);assert($('#storefront').hidden);assert(!w.document.body.classList.contains('rail-open'));assert.deepEqual(b.errors,[]);
 }finally{b.dom.window.close();}
});
