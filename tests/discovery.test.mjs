import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {JSDOM,VirtualConsole} from 'jsdom';
import {boot} from './helpers.mjs';
import {normalizePreferences,withinBudget,upgradeReason} from '../dist/personal-core.mjs';
import {filterCatalog,freshState} from '../dist/catalog-core.mjs';
const {items}=JSON.parse(fs.readFileSync('catalog/reviewed-catalog.json','utf8'));
const now=new Date('2026-10-14T12:00:00+08:00');

test('default browsing preserves inventory while the first page stays within 100 yuan',()=>{
 const b=boot();try{
  const {$,w,click}=b;assert.equal($('#resultCount').textContent,'1000 件');
  for(const card of w.document.querySelectorAll('#products .product-card'))assert(withinBudget(w.CATALOG.items.find(x=>x.id===Number(card.dataset.product))));
  assert.equal($('#valuePicks').children.length,3);assert.equal(w.document.querySelectorAll('.quick-browse [aria-pressed=true]').length,1);
  click('.quick-browse [data-value="hundred"]');const expected=w.CATALOG.items.filter(x=>withinBudget(x)).length;assert.equal($('#resultCount').textContent,expected+' 件');
  click('.quick-browse [data-value=""]');assert.equal($('#resultCount').textContent,'1000 件');assert.deepEqual(b.errors,[]);
 }finally{b.dom.window.close();}
});

test('hard budget searches use the range upper bound and upgrades require current evidence and a reason',()=>{
 const base=items.find(x=>x.price.kind==='historical');
 const x=structuredClone(base);x.price.min=89;x.price.max=129;
 assert(!withinBudget(x));assert.equal(filterCatalog([x],{...freshState(),q:'100元以内'},[],now).length,0);
 const within=structuredClone(x);within.price.max=100;assert.equal(filterCatalog([within],{...freshState(),q:'100元以内'},[],now).length,1);
 const upgraded=filterCatalog(items,{...freshState(),valueMode:'upgrade'},[],now);
 assert.equal(upgraded.length,16);assert(upgraded.some(x=>x.id===1005));assert(upgraded.every(x=>upgradeReason(x)&&x.price.kind==='documented'&&x.price.max<=300));
 assert.equal(filterCatalog(items,{...freshState(),valueMode:'upgrade'},[],new Date('2027-01-01')).length,0);
 const b=boot();try{b.click('.quick-browse [data-value="upgrade"]');assert.equal(b.$('#resultCount').textContent,'16 件');b.$('#search').value='fx-991CN CW II';b.$('#searchForm').dispatchEvent(new b.w.Event('submit',{bubbles:true,cancelable:true}));assert.equal(b.$('#resultCount').textContent,'1 件');assert(b.$('.purchase-note.upgrade').textContent.includes('中文自然书写'));assert(b.$('.product-price').textContent.includes('218'));b.click('.card-detail');assert(b.$('.detail-purchase').textContent.includes('考试'));assert.deepEqual(b.errors,[]);}finally{b.dom.window.close();}
});

test('search suggestions support keyboard focus, selection, explicit submit and clearing',()=>{
 const b=boot({}, {width:320});try{
  const {$,w,click,advance}=b;assert.equal($('#searchSubmit').type,'submit');
  $('#search').value='SAMLA';$('#search').dispatchEvent(new w.Event('input',{bubbles:true}));assert(!$('#searchSuggestions').hidden);
  $('#search').dispatchEvent(new w.KeyboardEvent('keydown',{key:'ArrowDown',bubbles:true,cancelable:true}));assert(w.document.activeElement.hasAttribute('data-suggest'));
  click('#searchSuggestions button');advance(100);assert($('#searchSuggestions').hidden);assert.equal($('#resultCount').textContent,'1 件');
  click('#clearSearch');assert.equal($('#search').value,'');assert.equal($('#resultCount').textContent,'1000 件');assert.deepEqual(b.errors,[]);
 }finally{b.dom.window.close();}
});

test('personal preferences persist and affect only the requested personal discovery scope',()=>{
 const b=boot();let saved;try{
  const {$,w,click}=b;click('.personal-header');assert($('#personalDialog').open);
  $('#personalNickname').value='小星';$('#personalBudget').value='50';$('#personalScene').value='宿舍';$('#personalIntensity').value='quiet';
  $('#personalInterests [value="家居生活"]').checked=true;$('#personalForm [name=accent][value=coral]').checked=true;
  $('#personalForm').dispatchEvent(new w.Event('submit',{bubbles:true,cancelable:true}));saved=w.localStorage.getItem('domyon-preferences');
  assert.equal(w.document.documentElement.dataset.accent,'coral');assert.equal(w.document.documentElement.dataset.intensity,'quiet');assert($('#personalGreeting').textContent.includes('小星'));assert.equal($('#resultCount').textContent,'1000 件');
  click('[data-close="personalDialog"]');click('#personalDiscover');assert.equal($('#resultCount').textContent,'2 件');
  assert([...w.document.querySelectorAll('#products .product-card')].every(n=>{const x=w.CATALOG.items.find(x=>x.id===Number(n.dataset.product));return x.type==='家居生活'&&x.tags.includes('宿舍')&&withinBudget(x,50)&&x.review.status==='documented';}));
  $('.header .brand').dispatchEvent(new w.MouseEvent('click',{bubbles:true,cancelable:true}));assert.equal($('#resultCount').textContent,'1000 件');assert.deepEqual(b.errors,[]);
 }finally{b.dom.window.close();}
 const again=boot({'domyon-preferences':saved});try{assert(again.$('#personalGreeting').textContent.includes('小星'));assert.equal(again.w.document.documentElement.dataset.accent,'coral');assert.equal(again.$('#resultCount').textContent,'1000 件');}finally{again.dom.window.close();}
 assert.deepEqual(normalizePreferences({budget:-1,interests:['unknown'],accent:'bad',intensity:'bad'}),normalizePreferences());
});

test('recent views are deduplicated, reopen local details and can be cleared',()=>{
 const b=boot();try{const {$,w,click}=b;
  const viewedId=$('#valuePicks [data-detail]').dataset.detail;click('#valuePicks [data-detail="'+viewedId+'"]');click('[data-close="detailDialog"]');click('#valuePicks [data-detail="'+viewedId+'"]');click('[data-close="detailDialog"]');assert.equal($('#recentCount').textContent,'1');
  click('#recentShortcut');assert($('#personalDialog').open);click('#recentProducts [data-detail="'+viewedId+'"]');assert(!$('#personalDialog').open);assert($('#detailDialog').open);
  click('[data-close="detailDialog"]');click('#recentShortcut');click('#clearRecent');assert.equal($('#recentCount').textContent,'0');assert.equal(w.localStorage.getItem('domyon-recent'),'[]');assert.deepEqual(b.errors,[]);
 }finally{b.dom.window.close();}
});

test('shopping sky stays active, pauses for a passage and respects effects and reduced motion preferences',()=>{
 const b=boot();try{const {$,w,click,frames,drawing}=b;assert(!$('#snow').hidden);assert.equal(frames.size,1);
  for(const [id,fn]of [...frames]){frames.delete(id);fn(1000);}assert(drawing.plates>0);assert.equal(drawing.invalid,0);
  click('.personal-header');$('#personalEffects').checked=false;$('#personalForm').dispatchEvent(new w.Event('submit',{bubbles:true,cancelable:true}));assert($('#snow').hidden);assert.equal(frames.size,0);
  $('#personalEffects').checked=true;$('#personalForm').dispatchEvent(new w.Event('submit',{bubbles:true,cancelable:true}));assert(!$('#snow').hidden);assert.equal(frames.size,1);assert.deepEqual(b.errors,[]);
 }finally{b.dom.window.close();}
 const reduced=boot({}, {reduce:true});try{assert(reduced.$('#snow').hidden);assert.equal(reduced.frames.size,0);}finally{reduced.dom.window.close();}
});

test('daylight can be selected at the entrance without entering the store',()=>{
 const b=boot({}, {entry:true,width:320});try{b.click('#entryThemeToggle');assert.equal(b.w.document.documentElement.dataset.theme,'light');assert(b.$('#storefront').hidden);assert.equal(b.w.localStorage.getItem('boutique-theme'),'light');assert.equal(b.$('meta[name=theme-color]').content,'#f9f6f0');assert.deepEqual(b.errors,[]);}finally{b.dom.window.close();}
});

test('all production styles parse and shopping styles keep the sky visible until explicitly hidden',()=>{
 const errors=[],vc=new VirtualConsole();vc.on('jsdomError',e=>errors.push(e.message));
 const dom=new JSDOM('<!doctype html><html data-theme="dark"><body class="shop-active"><canvas id="snow"></canvas></body></html>',{virtualConsole:vc});
 try{
  for(const f of ['pet.css','app.css','cosmic.css','storefront.css','tech.css','refined.css','discovery.css','cyber.css']){const style=dom.window.document.createElement('style');style.textContent=fs.readFileSync('dist/'+f,'utf8').replace(/^@charset[^;]+;\s*/,'');dom.window.document.head.append(style);}
  const sky=dom.window.document.getElementById('snow');assert.equal(dom.window.getComputedStyle(sky).display,'block');sky.hidden=true;assert.equal(dom.window.getComputedStyle(sky).display,'none');assert.deepEqual(errors,[]);
 }finally{dom.window.close();}
});
