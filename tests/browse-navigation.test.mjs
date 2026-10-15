import test from 'node:test';
import assert from 'node:assert/strict';
import {boot} from './helpers.mjs';

function search(b,text){b.$('#search').value=text;b.$('#searchForm').dispatchEvent(new b.w.Event('submit',{bubbles:true,cancelable:true}));}

test('phone Discover returns to the complete catalog after restrictive filters and favorites',()=>{
 const b=boot({}, {width:390,height:844});try{
  const {$,w,click,change}=b;
  click('[data-scope="favorites"]');change('#budgetSelect','0-50');search(b,'不存在的商品xyz');
  click('[data-mobile="discover"]');
  assert.equal($('#resultCount').textContent,w.CATALOG.items.length+' 件');
  assert.equal($('#products').children.length,24);assert(!$('#loadMore').hidden);
  assert.equal($('#search').value,'');assert.equal($('#budgetSelect').value,'');assert.equal($('#activeChips').children.length,0);
  assert($('#filterFields').hidden);assert.equal($('[data-scope="all"]').getAttribute('aria-pressed'),'true');
  assert.equal($('[data-mobile="discover"]').getAttribute('aria-current'),'page');
  click('[data-mobile="favorites"]');assert.equal($('[data-mobile="favorites"]').getAttribute('aria-current'),'page');assert.equal($('[data-mobile="discover"]').getAttribute('aria-current'),'false');
  assert.deepEqual(b.errors,[]);
 }finally{b.dom.window.close();}
});

test('outer companion discovery enters the complete catalog while the explicit curated tab stays filtered',()=>{
 const b=boot({}, {entry:true,width:320,height:568});try{
  const {$,w,click,advance}=b;
  click('#petBuddy');click('[data-pet-action="discover"]');assert($('#portalDialog').open);advance(1500);
  assert.equal($('#resultCount').textContent,w.CATALOG.items.length+' 件');assert($('#petWrap').hidden);assert(!$('#storefront').hidden);
  click('[data-scope="documented"]');assert.equal($('#resultCount').textContent,w.CATALOG.items.filter(x=>x.price.kind==='documented').length+' 件');
  assert.deepEqual(b.errors,[]);
 }finally{b.dom.window.close();}
});

test('the shopping brand restores the complete homepage without reopening the star entrance',()=>{
 const b=boot({}, {width:390,height:844});try{
  const {$,w,click}=b;
  click('[data-scope="favorites"]');search(b,'不存在的商品xyz');
  $('.header .brand').dispatchEvent(new w.MouseEvent('click',{bubbles:true,cancelable:true}));
  assert.equal($('#resultCount').textContent,w.CATALOG.items.length+' 件');assert.equal($('#search').value,'');
  assert.equal(w.document.activeElement.id,'heroTitle');assert(!$('#portalDialog').open);assert($('#entryScreen').hidden);assert($('#petWrap').hidden);
  assert.deepEqual(b.errors,[]);
 }finally{b.dom.window.close();}
});
