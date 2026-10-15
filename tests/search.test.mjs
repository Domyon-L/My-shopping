import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {freshState,filterCatalog,isListed,parseSearch} from '../dist/catalog-core.mjs';
import {searchTerms} from '../dist/search-core.mjs';
import {suggestions} from '../dist/personal-core.mjs';
import {boot} from './helpers.mjs';
const {items}=JSON.parse(fs.readFileSync('catalog/reviewed-catalog.json'));
const now=new Date('2026-10-15T23:10:00+08:00');
const search=(q,state={})=>filterCatalog(items,{...freshState(),q,...state},[],now);
const ids=xs=>xs.map(x=>x.id).sort((a,b)=>a-b);
const pants=items.filter(x=>isListed(x,now)&&x.type==='服饰鞋包'&&x.group==='下装'&&/裤/.test(x.category));
function submit(b,q){b.$('#search').value=q;b.$('#searchForm').dispatchEvent(new b.w.Event('submit',{bubbles:true,cancelable:true}));}

test('everyday pants query finds all actual outer trousers, while specific subtypes stay specific',()=>{
 assert.equal(pants.length,32);assert.deepEqual(ids(search('裤子')),ids(pants));assert.deepEqual(ids(search('pants')),ids(pants));
 assert(search('短裤').length>0);assert(search('短裤').every(x=>x.category==='短裤'));
 assert(!search('裤子').some(x=>['内裤','游泳'].includes(x.category)));
 for(const q of ['衣服','鞋子','袜子','充电宝','洗面奶','洗发露','杯子'])assert(search(q).length>0,q);
 assert(search('充电宝').every(x=>/移动电源|充电宝/.test(x.product+' '+x.category)));
 assert.equal(search('裤子不存在的品牌xyz').length,0);assert.equal(search('不存在的商品xyz').length,0);
});

test('Chinese compound queries preserve brand and use constraints without swallowing unknown words',()=>{
 assert.deepEqual(searchTerms('男士运动裤子',items),['男士','运动','裤子']);
 const active=search('男士运动裤子');assert(active.length>0);assert(active.every(x=>pants.some(p=>p.id===x.id)&&/运动/.test(x.product+' '+x.category+' '+x.tags.join(' '))));
 assert.deepEqual(ids(search('优衣库裤子')),ids(pants.filter(x=>/优衣库|UNIQLO/i.test(x.brand+' '+x.product))));
 const affordable=search('我想买一条优衣库的裤子100元以内');assert(affordable.length>0);assert(affordable.every(x=>/优衣库|UNIQLO/i.test(x.brand+' '+x.product)&&x.price.max<=100));
 assert.deepEqual(ids(search('ＵＮＩＱＬＯ 裤子')),ids(search('优衣库裤子')));
 assert.equal(search('裤子火星布料不存在').length,0);
});

test('budget variants share hard upper-bound rules and never relax evidence or price eligibility',()=>{
 for(const q of ['100元以内裤子','裤子 预算100元以下','不超过100元 裤子','裤子 ≤100元','１００元以内 裤子']){
  const xs=search(q);assert(xs.length>0,q);assert.deepEqual(ids(xs),ids(pants.filter(x=>x.price.max<=100)));assert(xs.every(x=>x.price.max<=100));
 }
 assert.deepEqual(parseSearch('预算300元以内 鼠标'),{q:'鼠标',max:300});
 assert.deepEqual(parseSearch('裤子 100元以内 不超过80元'),{q:'裤子',max:80});
 assert(search('裤子 100元以内',{max:300}).every(x=>x.price.max<=100));
 assert.equal(search('裤子 100元以内',{history:false}).length,0,'historical references cannot become sourced current prices');
 assert(search('裤子').every(x=>x.review.status==='pending'&&x.price.kind==='historical'));
});

test('model normalization and relevance keep exact identity first and explicit price sorting intact',()=>{
 const model=search('fx991cncwii');assert.equal(model.length,1);assert.equal(model[0].id,1005);
 assert.deepEqual(ids(search('fx–991CN CW II')),ids(model));
 const x=items.find(x=>x.id===132);assert.equal(search(x.product)[0].id,x.id);
 const ascending=search('裤子',{sort:'price-asc'});for(let i=1;i<ascending.length;i++)assert(ascending[i-1].price.min+ascending[i-1].price.max<=ascending[i].price.min+ascending[i].price.max);
 for(const q of ['裤子','优衣库裤子','100元以内 裤子','充电宝'])assert.deepEqual(suggestions(items.filter(x=>isListed(x)),q).map(x=>x.id),filterCatalog(items.filter(x=>isListed(x)),{...freshState(),q,valueFirst:true}).slice(0,5).map(x=>x.id));
});

test('global header search clears stale categories, collection scopes, scenes and price filters',()=>{
 const b=boot();try{
  b.click('[data-type="数码家电"]');b.change('#sceneSelect','办公');b.change('#priceKindSelect','documented');b.change('#budgetSelect','0-50');b.click('[data-scope="favorites"]');
  submit(b,'裤子');assert.equal(b.$('#resultCount').textContent,pants.length+' 件');assert.equal(b.$('#budgetSelect').value,'');assert.equal(b.$('#sceneSelect').value,'');assert.equal(b.$('#priceKindSelect').value,'');assert.equal(b.$('[data-scope="all"]').getAttribute('aria-pressed'),'true');
  assert.equal(b.$('#categories [data-type=""] small').textContent,String(pants.length));assert.equal(b.$('#categories [data-type="服饰鞋包"] small').textContent,String(pants.length));
  assert(b.$('#searchResultSummary').textContent.includes('全部商品'));assert.equal(b.$('#sortSelect [value="recommended"]').textContent,'相关度优先');
  b.click('#clearSearch');assert.equal(b.$('#resultCount').textContent,'1000 件');assert(b.$('#searchResultSummary').hidden);assert.deepEqual(b.errors,[]);
 }finally{b.dom.window.close();}
});

test('Chinese composition is not interrupted and suggestions use the same complete global search',()=>{
 const b=boot({}, {width:390});try{
  const {$,w,advance}=b;b.click('[data-scope="favorites"]');
  $('#search').dispatchEvent(new w.CompositionEvent('compositionstart',{bubbles:true}));$('#search').value='ku';$('#search').dispatchEvent(new w.InputEvent('input',{bubbles:true,isComposing:true}));advance(1000);assert.equal($('#resultCount').textContent,'0 件');assert.equal($('#search').value,'ku');
  $('#search').value='裤子';$('#search').dispatchEvent(new w.CompositionEvent('compositionend',{bubbles:true}));assert(!$('#searchSuggestions').hidden);advance(160);assert.equal($('#resultCount').textContent,pants.length+' 件');
  const first=$('#searchSuggestions button').dataset.suggest;b.click('#searchSuggestions button');assert($('#products [data-product="'+first+'"]'));assert($('#searchSuggestions').hidden);assert.deepEqual(b.errors,[]);
 }finally{b.dom.window.close();}
});

test('entrance and phone header return the same pants inventory and budget cap',()=>{
 const b=boot({}, {entry:true,width:320,height:568});try{
  b.$('#entrySearch').value='100元以内裤子';b.$('#entrySearchForm').dispatchEvent(new b.w.Event('submit',{bubbles:true,cancelable:true}));b.advance(1500);b.advance(10);
  const expected=search('100元以内裤子');assert.equal(b.$('#resultCount').textContent,expected.length+' 件');assert.deepEqual([...b.w.document.querySelectorAll('#products [data-product]')].map(x=>Number(x.dataset.product)).sort((a,b)=>a-b),ids(expected));
  submit(b,'裤子');assert.equal(b.$('#resultCount').textContent,pants.length+' 件');assert.equal(b.$('#products').children.length,24);assert(!b.$('#loadMore').hidden);assert.deepEqual(b.errors,[]);
 }finally{b.dom.window.close();}
});

test('storefront removes outer frame gutters and the filter panel cannot float over product cards',()=>{
 const b=boot({}, {width:1920,height:1080});try{
  for(const l of b.w.document.querySelectorAll('link[rel=stylesheet]')){const style=b.w.document.createElement('style');style.textContent=fs.readFileSync('dist/'+l.getAttribute('href').slice(2),'utf8').replace(/^@charset[^;]+;\s*/,'');b.w.document.head.append(style);}
  for(const theme of ['dark','light'])for(const open of [false,true])for(const query of ['', '裤子','不存在的商品xyz']){
   b.w.document.documentElement.dataset.theme=theme;b.w.document.body.classList.toggle('rail-open',open);submit(b,query);
   const workspace=b.w.getComputedStyle(b.$('.workspace')),main=b.w.getComputedStyle(b.$('#main')),deck=b.w.getComputedStyle(b.$('.control-deck'));
   assert.equal(workspace.width,'100%');assert.equal(workspace.maxWidth,'none');assert.equal(workspace.margin,'0px');assert.equal(main.padding,'0px');assert.equal(deck.position,'relative');assert.equal(deck.top,'auto');assert.equal(deck.borderRadius,'0');
  }
  assert(b.$('.empty'));assert.equal(b.w.getComputedStyle(b.$('.empty')).gridColumn,'1/-1');assert.deepEqual(b.errors,[]);
 }finally{b.dom.window.close();}
});
