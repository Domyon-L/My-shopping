import test from 'node:test';
import assert from 'node:assert/strict';
import {boot} from './helpers.mjs';
import {clampPetPosition,portalURL,PORTAL_MS,PET_SIZE} from '../dist/experience-core.mjs';
function point(w,element,type,x,y,extra={}){element.dispatchEvent(new w.MouseEvent(type,{bubbles:true,cancelable:true,clientX:x,clientY:y,button:0,...extra}));}
test('first load is an independent entrance; store is inert and companion is outside it',()=>{
 const b=boot({}, {entry:true});try{const {$,w}=b;assert(!$('#entryScreen').hidden);assert($('#storefront').hidden);assert($('#storefront').inert);assert(!$('#petWrap').hidden);assert(!$('#storefront').contains($('#petWrap')));assert(!$('#main').contains($('#enterCity')));assert(!w.document.body.classList.contains('shop-active'));assert(!$('#entryScreen').inert);assert.deepEqual(b.errors,[]);}finally{b.dom.window.close();}
});
test('entrance passage lasts 1500ms, cancellation stays outside, skip enters only once',()=>{
 const b=boot({}, {entry:true});try{const {w,$,click,advance}=b;assert.equal(PORTAL_MS,1500);click('#enterCity');assert($('#portalDialog').open);advance(1499);assert($('#storefront').hidden);click('#portalCancel');advance(2000);assert($('#storefront').hidden);assert(!$('#portalDialog').open);
 click('#entryBrowse');click('#entryBrowse');advance(1499);assert($('#storefront').hidden);advance(1);assert(!$('#storefront').hidden);assert($('#entryScreen').hidden);assert($('#entryScreen').inert);assert($('#petWrap').hidden);assert(!$('#snow').hidden);assert.equal($('#resultCount').textContent,'1000 件');assert.equal(w.document.activeElement.id,'heroTitle');
 click('#backToEntry');assert($('#storefront').hidden);assert(!$('#petWrap').hidden);click('#enterCity');click('#portalSkip');assert(!$('#storefront').hidden);assert.deepEqual(b.errors,[]);
 }finally{b.dom.window.close();}
});
test('gateway search and categories apply to the shopping catalog after entry',()=>{
 const b=boot({}, {entry:true});try{const {w,$,click,advance}=b;$('#entrySearch').value='100元以内 收纳';$('#entrySearchForm').dispatchEvent(new w.Event('submit',{bubbles:true,cancelable:true}));advance(1500);assert.equal($('#resultCount').textContent,'39 件');assert([...w.document.querySelectorAll('#products .product-card')].every(n=>w.CATALOG.items.find(x=>x.id===Number(n.dataset.product)).price.max<=100));assert.equal($('#search').value,'100元以内 收纳');
 click('#backToEntry');click('[data-entry-type="服饰穿搭"]');advance(1500);assert($('#breadcrumb').textContent.includes('服饰穿搭'));assert(!$('#storefront').hidden);assert.deepEqual(b.errors,[]);
 }finally{b.dom.window.close();}
});
test('cards open local details and evidence links never reopen the star passage',()=>{
 const b=boot();try{const {w,$,click}=b;assert.equal(w.document.querySelectorAll('#products a').length,0);click('#products .card-detail');assert($('#detailDialog').open);
 const a=$('#detailPriceSource .source-link');assert(a.href.startsWith('https:'));assert.equal(a.target,'_blank');assert(a.rel.includes('noopener'));assert(!a.hasAttribute('data-portal'));assert($('#petWrap').hidden);
 let intercepted=true;a.addEventListener('click',e=>{intercepted=e.defaultPrevented;e.preventDefault();},{once:true});a.dispatchEvent(new w.MouseEvent('click',{bubbles:true,cancelable:true}));assert(!intercepted);assert(!$('#portalDialog').open);
 assert.equal(portalURL('javascript:alert(1)'),null);assert.equal(portalURL('https://user:pass@example.com'),null);assert.deepEqual(b.errors,[]);
 }finally{b.dom.window.close();}
});
test('mobile category drawer contains focus and restores shopping controls',()=>{
 const b=boot({}, {width:390,height:844});try{const {w,$,click}=b;assert($('#categoryRail').inert);click('#menuToggle');assert(w.document.body.classList.contains('rail-open'));assert(!$('#railBackdrop').hidden);assert.equal($('#categoryRail').getAttribute('aria-modal'),'true');assert($('#main').inert);assert(!$('#categoryRail').inert);
 $('#menuClose').focus();w.document.dispatchEvent(new w.KeyboardEvent('keydown',{key:'Tab',shiftKey:true,bubbles:true,cancelable:true}));assert.equal(w.document.activeElement.id,'standardsButton');click('[data-type="学习办公"]');assert(!w.document.body.classList.contains('rail-open'));assert(!$('#main').inert);assert($('#breadcrumb').textContent.includes('学习办公'));
 click('[data-mobile="categories"]');w.document.dispatchEvent(new w.KeyboardEvent('keydown',{key:'Escape',bubbles:true}));assert($('#railBackdrop').hidden);click('[data-mobile="favorites"]');assert($('#listTitle').textContent.includes('我的收藏'));click('[data-mobile="entrance"]');assert(!$('#entryScreen').hidden);assert($('#storefront').hidden);assert(!$('#petWrap').hidden);assert.deepEqual(b.errors,[]);
 }finally{b.dom.window.close();}
});
test('outer companion drags across the screen, persists and has a visible recovery control',()=>{
 const b=boot({}, {entry:true,width:390,height:844});let saved;try{const {w,$,click}=b;assert.equal(PET_SIZE,128);const pet=$('#petBuddy'),wrap=$('#petWrap');const start={x:parseFloat(wrap.style.left),y:parseFloat(wrap.style.top)};
 point(w,pet,'pointerdown',start.x+30,start.y+30);point(w,pet,'pointermove',35,80);point(w,pet,'pointerup',35,80);point(w,pet,'click',35,80,{detail:1});assert($('#petPanel').hidden);assert(parseFloat(wrap.style.left)<start.x);assert(parseFloat(wrap.style.top)<start.y);
 point(w,pet,'pointerdown',35,80);point(w,pet,'pointermove',9999,9999);point(w,pet,'pointerup',9999,9999);assert.equal(parseFloat(wrap.style.left),254);assert.equal(parseFloat(wrap.style.top),708);saved=w.localStorage.getItem('domyon-pet-position');
 pet.dispatchEvent(new w.KeyboardEvent('keydown',{key:'ArrowLeft',bubbles:true}));assert.equal(parseFloat(wrap.style.left),239);w.innerWidth=320;w.innerHeight=568;w.dispatchEvent(new w.Event('resize'));assert(parseFloat(wrap.style.left)<=184);assert(parseFloat(wrap.style.top)<=432);
 click('#petBuddy');assert(!$('#petPanel').hidden);click('[data-pet-action="hide"]');assert(wrap.hidden);click('#petRestore');assert(!wrap.hidden);assert.equal(w.document.activeElement.id,'petBuddy');assert.deepEqual(b.errors,[]);
 }finally{b.dom.window.close();}
 const again=boot({'domyon-pet-position':saved},{entry:true,width:390,height:844});assert.equal(parseFloat(again.$('#petWrap').style.left),254);again.dom.window.close();assert.deepEqual(clampPetPosition(-100,-100,320,568),{x:8,y:8});
});
test('reduced motion and delayed native close events preserve navigation and cancellation',()=>{
 const b=boot({}, {entry:true,reduce:true,asyncClose:true,width:320,height:568});try{const {w,$,click,advance}=b;assert($('#snow').hidden);click('#enterCity');advance(1500);advance(10);assert(!$('#portalDialog').open);assert.equal(w.document.activeElement.id,'heroTitle');
 click('#backToEntry');click('#entryBrowse');advance(1499);$('#portalDialog').close();advance(1);advance(10);assert($('#storefront').hidden);assert(!$('#entryScreen').hidden);assert.deepEqual(b.errors,[]);
 }finally{b.dom.window.close();}
});
test('returning to the entrance closes detail and keeps selected comparisons outside the gate',()=>{
 const b=boot();try{const {$,click,advance}=b;click('[data-scope="documented"]');$('#search').value='AirPods';$('#searchForm').dispatchEvent(new b.w.Event('submit',{bubbles:true,cancelable:true}));click('[data-compare="1002"]');assert(!$('#compareTray').hidden);assert($('#storefront').contains($('#compareTray')));click('[data-detail="1002"]');assert($('#detailDialog').open);click('#backToEntry');assert(!$('#detailDialog').open);assert($('#storefront').hidden);click('#entryBrowse');advance(1500);assert(!$('#compareTray').hidden);assert(!$('#storefront').hidden);assert.deepEqual(b.errors,[]);
 }finally{b.dom.window.close();}
});
