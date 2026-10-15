import test from 'node:test';
import assert from 'node:assert/strict';
import {boot} from './helpers.mjs';

test('reference cards stay local, details include all four sections, and hidden saved products do not reappear',()=>{
 const b=boot({'boutique-favorites-v2':'[1001,1002]','boutique-compare-v2':'[1001,1002]'});try{
  const {$,w,click}=b;
  assert.equal(w.CATALOG.items.length,1000);assert.equal($('#activeChips').children.length,0);assert($('#reset').hidden);assert.equal($('#favCount').textContent,'1');assert.equal($('#compareCount').textContent,'1 / 3');
  assert(!$('#compareNames').textContent.includes('MX Master'));
  assert.equal(w.document.querySelectorAll('#products a').length,0);
  for(const card of w.document.querySelectorAll('.product-card')){assert(card.querySelector('.product-price strong').textContent.startsWith('¥'));assert(card.querySelector('.reference-label').textContent.includes('参考'));assert(!/待核价|访问商品官网/.test(card.textContent));}
  click('[data-scope="favorites"]');assert.equal($('#resultCount').textContent,'1 件');click('#products .card-detail');
  assert($('#detailDialog').open);assert(!$('#portalDialog').open);
  for(const id of ['detailOverview','detailSpecs','detailUsage','detailPriceSource'])assert($('#'+id));
  assert($('#detailUsage').textContent.includes('五种尺寸'));assert($('#detailPriceSource').textContent.includes('1,899'));
  assert($('#detailSpecs').querySelectorAll('dt').length>=7);
  assert(JSON.parse(w.localStorage.getItem('boutique-favorites-v2')).includes(1001));
  assert.deepEqual(b.errors,[]);
 }finally{b.dom.window.close();}
});


test('restored historical cards open complete local details without fake source links or verification dates',()=>{
 const b=boot({}, {width:320,height:568});try{
  const {$,w,click}=b;
  const x=w.CATALOG.items.find(x=>x.price.kind==='historical');
  $('#search').value=x.product;$('#searchForm').dispatchEvent(new w.Event('submit',{bubbles:true,cancelable:true}));
  const card=w.document.querySelector('[data-product="'+x.id+'"]');assert(card);assert(card.textContent.includes('历史参考价'));assert(card.textContent.includes(x.price.observed_at));assert(!card.textContent.includes('核对 '+x.price.observed_at));
  click('[data-product="'+x.id+'"] .card-detail');assert($('#detailDialog').open);
  assert($('#detailPriceSource').textContent.includes('历史参考价'));assert($('#detailPriceSource').textContent.includes('原记录日期'));assert($('#detailPriceSource').textContent.includes('未保存价格来源'));
  assert($('#detailSpecs').textContent.includes('未保存'));assert.equal($('#detailContent').querySelectorAll('a').length,0);assert(!$('#detailContent').textContent.includes('null'));assert(!$('#detailContent').textContent.includes('undefined'));assert.deepEqual(b.errors,[]);
 }finally{b.dom.window.close();}
});
