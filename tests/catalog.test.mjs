import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {BANDS,freshState,filterCatalog,priceUsable,priceMid,parseSearch,isListed} from '../dist/catalog-core.mjs';
const {items,meta}=JSON.parse(fs.readFileSync('catalog/reviewed-catalog.json','utf8'));
const now=new Date('2026-10-14T12:00:00+08:00');
const listed=items.filter(x=>isListed(x,now));
const current=listed.filter(x=>x.price.kind==='documented');
const historical=listed.filter(x=>x.price.kind==='historical');
const byId=xs=>xs.map(x=>x.id).sort((a,b)=>a-b);
const searchable=x=>[x.brand,x.product,x.model,x.type,x.group,x.category,x.variant,...x.tags,...Object.values(x.specs)].join(' ').toLowerCase();
test('all catalog records carry review status; new entries have model evidence and no invented ratings',()=>{
 assert.equal(items.length,1016);assert.equal(new Set(items.map(x=>x.id)).size,items.length);
 assert.equal(meta.total_records,items.length);assert.equal(meta.original_count,850);assert.equal(meta.target_visible_count,1000);assert.equal(meta.visible_count,1000);assert.equal(listed.length,meta.visible_count);
 for(const x of items){assert(x.type&&x.group&&x.category);assert(x.review.checked_at);assert.equal(x.review.physical_tested,false);assert(!('rating' in x));assert(!('score' in x));}
 const batch=items.filter(x=>x.isNew);assert.equal(batch.length,154);assert.equal(batch.length,meta.new_count);
 for(const x of batch){assert.equal(x.review.status,'documented');assert(x.model&&x.variant);assert(Object.keys(x.specs).length);assert(x.limits.length);assert(x.source.checked_at);assert(x.source.urls.length);for(const s of x.source.urls)assert.equal(new URL(s.url).protocol,'https:');}
 assert.deepEqual(byId(filterCatalog(items,{...freshState(),scope:'documented'},[],now)),byId(listed.filter(x=>x.review.status==='documented')));
 assert.deepEqual(byId(filterCatalog(items,freshState(),[],now)),byId(listed));
 assert.deepEqual(byId(filterCatalog(items,{...freshState(),scope:'pending'},[],now)),byId(listed.filter(x=>x.review.status==='pending')));
});
test('price bands do not overlap and cover exact thresholds',()=>{
 const thresholds=[0,49.99,50,99.99,100,299.99,300,599.99,600,999.99,1000,1999.99,2000,100000];
 for(const n of thresholds)assert.equal(BANDS.filter(b=>n>=b[2]&&n<b[3]).length,1);
 assert.equal(BANDS.find(b=>50>=b[2]&&50<b[3])[0],'50-100');
});
test('public catalog distinguishes original historical references from sourced current prices and excludes unknown prices',()=>{
 const base=structuredClone(items.find(x=>x.id===683));
 const variants=[{kind:'unknown',min:null,max:null},{kind:'historical'},{url:null},{currency:'USD'},{observed_at:'2025-01-01'},{min:-1},{max:0}].map((changes,i)=>({...structuredClone(base),id:5000+i,price:{...base.price,...changes}}));
 assert(variants.every(x=>!isListed(x,now)));
 for(const s of [freshState(),{...freshState(),history:true,budget:'0-50'},{...freshState(),scope:'favorites'},{...freshState(),scope:'pending'}])assert(filterCatalog(variants,s,variants.map(x=>x.id),now).length===0);
 assert.equal(filterCatalog([base,...variants],freshState(),[],now).length,1);
 const source=fs.readFileSync('dist/catalog-data.js','utf8');const published=JSON.parse(source.slice('window.CATALOG = '.length).trim().slice(0,-1));
 assert.equal(published.items.length,1000);assert.deepEqual(byId(published.items),byId(listed));assert(published.items.every(x=>isListed(x,now)));
 assert.equal(published.items.filter(x=>x.price.kind==='documented').length,meta.documented_price_count);
 const historical=published.items.filter(x=>x.price.kind==='historical');assert.equal(historical.length,meta.historical_price_count);
 const legacy=new Map(JSON.parse(fs.readFileSync('catalog/legacy-original.json','utf8')).map(x=>[x.id,x]));
 for(const x of historical){const old=legacy.get(x.id);assert.deepEqual([x.price.min,x.price.max,x.price.observed_at],[old.price.min,old.price.max,old.price.updated_at]);assert.equal(x.review.status,'pending');assert.equal(x.price.url,null);}
 const old=historical[0];assert(isListed(old,now));
 for(const changes of [{observed_at:null},{observed_at:'2027-01-01'},{currency:'USD'},{min:0},{max:-1}])assert(!isListed({...old,price:{...old.price,...changes}},now));
 assert(!isListed({...old,review:{status:'merged'}},now));
});
test('current, historical, unknown and expired prices use separate filter rules',()=>{
 const currentPrice=items.find(x=>x.id===683).price,unknown=items.find(x=>x.id===1001).price;
 assert(priceUsable(currentPrice,false,now));assert(!priceUsable(unknown,true,now));
 const old=items.find(x=>x.price.kind==='historical').price;assert(!priceUsable(old,false,now));assert(priceUsable(old,true,now));
 assert(!priceUsable(currentPrice,false,new Date('2026-12-01T00:00:00Z')));
 const low=filterCatalog(items,{...freshState(),budget:'0-50',history:false},[],now);
 const expectedLow=current.filter(x=>priceUsable(x.price,false,now)&&priceMid(x.price)>=0&&priceMid(x.price)<50);
 assert(expectedLow.length>2);assert.deepEqual(byId(low),byId(expectedLow));assert(low.some(x=>x.id===683));assert(low.some(x=>x.id===1012));
 const expectedHistory=[...current,...historical].filter(x=>priceUsable(x.price,true,now)&&priceMid(x.price)>=0&&priceMid(x.price)<50);
 assert.deepEqual(byId(filterCatalog(items,{...freshState(),budget:'0-50',history:true},[],now)),byId(expectedHistory));
 const sorted=filterCatalog(items,{...freshState(),sort:'price-asc',history:false},[],now);
 const priced=sorted.filter(x=>priceUsable(x.price,false,now));
 assert.deepEqual(byId(priced),byId(current));assert.equal(sorted[0].price.min,Math.min(...current.map(x=>priceMid(x.price))));
 for(let i=1;i<priced.length;i++)assert(priceMid(priced[i-1].price)<=priceMid(priced[i].price));
 assert(sorted.slice(priced.length).every(x=>!priceUsable(x.price,false,now)));
});
test('Chinese budget search combines limits with keywords and hierarchy filters',()=>{
 assert.deepEqual(parseSearch('预算300元以内 鼠标'),{q:'鼠标',max:300});
 assert.deepEqual(parseSearch('100.5元以下 收纳'),{q:'收纳',max:100.5});
 const storage=filterCatalog(items,{...freshState(),q:'100元以内 收纳',history:false},[],now);
 const expectedStorage=current.filter(x=>priceUsable(x.price,false,now)&&x.price.max<=100&&searchable(x).includes('收纳'));
 assert(expectedStorage.length>1);assert.deepEqual(byId(storage),byId(expectedStorage));assert(storage.some(x=>x.id===683));
 assert.equal(filterCatalog(items,{...freshState(),q:'300元以内 鼠标',history:false},[],now).length,0);
 const xs=filterCatalog(items,{...freshState(),type:'家居生活',group:'餐厨水具',category:'食品盒'},[],now);assert(xs.length);assert(xs.every(x=>x.type==='家居生活'&&x.group==='餐厨水具'&&x.category==='食品盒'));
 assert.equal(filterCatalog(items,{...freshState(),q:'不存在的商品xyz'},[],now).length,0);
});
