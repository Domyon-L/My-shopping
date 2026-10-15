import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {freshState,filterCatalog,evidenceTier,productURL,preferenceProfile,recommendationReasons,priceUsable,isListed} from '../dist/catalog-core.mjs';
const {items}=JSON.parse(fs.readFileSync('catalog/reviewed-catalog.json','utf8'));
const now=new Date('2026-10-14T12:00:00+08:00');
test('recommendation keeps evidence tiers intact and diversifies the first six',()=>{
 const ranked=filterCatalog(items,freshState(),[],now);assert.equal(ranked.length,1000);assert.equal(ranked.length,items.filter(x=>isListed(x,now)).length);assert(ranked.slice(0,6).every(x=>evidenceTier(x,now)===2));assert(new Set(ranked.slice(0,6).map(x=>x.type)).size>=3);
 assert.deepEqual(ranked.map(x=>x.id),filterCatalog(items,freshState(),[],now).map(x=>x.id));
 const pending=items.find(x=>x.review.status==='pending');assert(evidenceTier(pending,now)===0);assert.equal(recommendationReasons(pending,freshState(),null,now)[0],'资料待补全，暂不列入优先推荐');
});
test('favorites affect verified recommendations only and can be disabled',()=>{
 const favorites=[1003];const ranked=filterCatalog(items,freshState(),favorites,now);assert.equal(ranked[0].category,'平板电脑');
 const verifiedCount=items.filter(x=>isListed(x,now)&&evidenceTier(x,now)===2).length;assert(verifiedCount>6);
 assert(ranked.slice(0,verifiedCount).every(x=>evidenceTier(x,now)===2));assert(ranked.slice(verifiedCount).every(x=>evidenceTier(x,now)===0));
 assert.deepEqual(filterCatalog(items,{...freshState(),personalized:false},favorites,now).map(x=>x.id),filterCatalog(items,freshState(),[],now).map(x=>x.id));
 const reason=recommendationReasons(ranked[0],freshState(),preferenceProfile(items,favorites),now);assert(reason.includes('符合收藏品类'));
});
test('old, incomplete and future-dated source evidence cannot be presented as fresh',()=>{
 const base=structuredClone(items.find(x=>x.id===1005));const dated=structuredClone(base);dated.source.checked_at='2025-01-01';assert.equal(evidenceTier(dated,now),1);
 const bad=structuredClone(base);bad.source.urls=[{url:'javascript:alert(1)'}];assert.equal(evidenceTier(bad,now),0);assert.equal(productURL(bad),'');
 const future=structuredClone(base);future.source.checked_at='2027-01-01';assert.equal(evidenceTier(future,now),0);
 const noModel=structuredClone(base);noModel.model='';assert.equal(evidenceTier(noModel,now),0);
 assert.equal(filterCatalog([dated,base,bad],freshState(),[],now)[0].source.checked_at,'2026-10-11');
});
test('recommendation respects search, scenario, price dates and budget boundaries',()=>{
 const s={...freshState(),scene:'办公',type:'数码科技'};assert(filterCatalog(items,s,[],now).every(x=>x.tags.includes('办公')&&x.type==='数码科技'));
 const storage=filterCatalog(items,{...freshState(),q:'100元以内 收纳',history:false},[548],now);
 const searchable=x=>[x.brand,x.product,x.model,x.type,x.group,x.category,x.variant,...x.tags,...Object.values(x.specs)].join(' ').toLowerCase();
 const expected=items.filter(x=>isListed(x,now)&&priceUsable(x.price,false,now)&&x.price.max<=100&&searchable(x).includes('收纳'));
 assert(expected.length>1);assert.deepEqual(storage.map(x=>x.id).sort((a,b)=>a-b),expected.map(x=>x.id).sort((a,b)=>a-b));assert(storage.some(x=>x.id===683));
 assert.equal(filterCatalog(items,{...freshState(),budget:'0-50',history:false},[],new Date('2027-01-01')).length,0);
 const futurePrice={...items.find(x=>x.id===683).price,observed_at:'2027-01-01'};assert(!priceUsable(futurePrice,false,now));
});
