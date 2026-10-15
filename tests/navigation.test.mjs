import test from 'node:test';
import assert from 'node:assert/strict';
import {boot} from './helpers.mjs';
import {freshState,filterCatalog,catalogNavigation} from '../dist/catalog-core.mjs';
const now=new Date('2026-10-14T12:00:00+08:00');

test('classification counts follow scope and search; zero-result categories are not offered',()=>{
 const b=boot();try{
  const {$,w,click,change}=b;
  click('[data-scope="documented"]');
  const checkNavigation=state=>{
   const expected=catalogNavigation(w.CATALOG.items,state,[],now);
   assert.deepEqual([...w.document.querySelectorAll('#categories [data-type]')].map(x=>({value:x.dataset.type,count:Number(x.querySelector('small').textContent)})),expected.types);
   assert.deepEqual([...$('#categorySelect').options].filter(o=>o.value&&!o.disabled).map(o=>o.value),expected.categories.map(x=>x.value));
   assert(expected.types.filter(x=>x.value).every(x=>x.count>0));
  };
  checkNavigation({...freshState(),scope:'documented'});
  assert.equal($('#categories [data-type="健康用品"]'),null);
  $('#search').value='AirPods';$('#searchForm').dispatchEvent(new w.Event('submit',{bubbles:true,cancelable:true}));
  checkNavigation({...freshState(),q:'AirPods'});
  const searched=filterCatalog(w.CATALOG.items,{...freshState(),q:'AirPods'},[],now);assert(searched.length>1);
  assert.equal($('#categories [data-type=""] small').textContent,String(searched.length));
  assert.equal($('#categories [data-type="数码家电"] small').textContent,String(searched.length));
  assert.equal(w.document.querySelectorAll('#categories [data-type]').length,2);
  assert.deepEqual([...$('#categorySelect').options].filter(o=>o.value&&!o.disabled).map(o=>o.value),[...new Set(searched.map(x=>x.category))].sort((a,b)=>a.localeCompare(b,'zh-CN')));
  click('#categories [data-type="数码家电"]');assert.equal($('#resultCount').textContent,searched.length+' 件');
  click('#clearSearch');click('[data-scope="documented"]');change('#budgetSelect','100-300');change('#sceneSelect','学生');
  const budgetState={...freshState(),scope:'documented',budget:'100-300',scene:'学生'};
  const budgetMatches=filterCatalog(w.CATALOG.items,budgetState,[],now);assert(budgetMatches.length>1);assert(budgetMatches.every(x=>x.type==='学习办公'));
  checkNavigation(budgetState);assert.equal($('#categories [data-type="学习办公"] small').textContent,String(budgetMatches.length));
  assert.deepEqual(b.errors,[]);
 }finally{b.dom.window.close();}
});

test('empty favorites have no misleading classifications; sidebar reset opens populated categories',()=>{
 const b=boot();try{
  const {$,w,click,advance}=b;
  click('[data-scope="favorites"]');
  assert.equal(w.document.querySelectorAll('#categories [data-type]:not([disabled])').length,0);
  assert($('#groupSelect').disabled);assert($('#categorySelect').disabled);
  $('#search').value='不存在的旧查询';$('#search').dispatchEvent(new w.Event('input',{bubbles:true}));
  click('.quick-browse [data-value=""]');click('#menuToggle');click('.shop-scenes [data-type="家居日用"]');
  advance(100);
  const home=w.CATALOG.items.filter(x=>x.type==='家居日用');assert(home.length>24);assert(home.some(x=>x.id===683));assert(!home.some(x=>x.id===1012));
  assert.equal($('#resultCount').textContent,home.length+' 件');
  assert.equal($('#search').value,'');
  assert.equal($('[data-scope="all"]').getAttribute('aria-pressed'),'true');
  assert([...w.document.querySelectorAll('.product-row')].every(x=>x.querySelector('.product-sub').textContent.includes('家居日用')));
  assert.deepEqual(b.errors,[]);
 }finally{b.dom.window.close();}
});

test('product previews are consistently absent on every catalog page and in details',()=>{
 const b=boot();try{
  const {$,w,click}=b,seen=new Set(),pages=Math.ceil(w.CATALOG.items.length/24);
  assert.equal(w.CATALOG.items.length,1000);assert.equal(pages,42);
  for(let i=0;i<pages;i++){
   assert.equal(w.document.querySelectorAll('#products img,.product-picture,.media-fallback').length,0);
   for(const row of w.document.querySelectorAll('#products [data-product]')){assert(!seen.has(Number(row.dataset.product)));seen.add(Number(row.dataset.product));}
   assert.equal($('#nextPage').disabled,i===pages-1);
   if(i<pages-1)click('#nextPage');
  }
  assert.equal(seen.size,w.CATALOG.items.length);
  click('#reset');$('#search').value='SAMLA';$('#searchForm').dispatchEvent(new w.Event('submit',{bubbles:true,cancelable:true}));click('[data-detail="683"]');
  assert.equal($('#detailContent').querySelectorAll('img').length,0);
  assert.deepEqual(b.errors,[]);
 }finally{b.dom.window.close();}
});
