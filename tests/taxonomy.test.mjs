import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {TYPE_ORDER,freshState,filterCatalog,isListed} from '../dist/catalog-core.mjs';
import {normalizePreferences} from '../dist/personal-core.mjs';
import {boot} from './helpers.mjs';
const {items,meta}=JSON.parse(fs.readFileSync('catalog/reviewed-catalog.json'));
const plan=JSON.parse(fs.readFileSync('catalog/taxonomy-proposal-v21.json'));
const key=x=>JSON.stringify([x.legacy_type||x.type,x.group,x.category]);
const now=new Date('2026-10-15T15:00:00+08:00');

test('all 1016 records have one daily use route, with 1000 visible and no duplicate records',()=>{
 assert.equal(TYPE_ORDER.length,12);assert.deepEqual(Object.keys(JSON.parse(fs.readFileSync('catalog/categories.json'))),TYPE_ORDER);assert.equal(new Set(TYPE_ORDER).size,12);assert.equal(meta.visible_count,1000);assert.equal(items.length,1016);assert.equal(new Set(items.map(x=>x.id)).size,1016);
 const map=new Map(plan.mapping.map(x=>[JSON.stringify([x.from.type,x.from.group,x.from.category]),x.to])),overrides=new Map(plan.id_overrides.map(x=>[x.id,x.to]));
 for(const x of items){assert(x.legacy_type);assert(TYPE_ORDER.includes(x.type));assert.equal(x.type,overrides.get(x.id)||map.get(key(x)));}
 const eligible=items.filter(x=>isListed(x,now));const groups=TYPE_ORDER.map(type=>filterCatalog(items,{...freshState(),type},[],now));assert.equal(groups.flat().length,eligible.length);assert.equal(new Set(groups.flat().map(x=>x.id)).size,1000);assert(groups.every(g=>g.length));
 const by=id=>items.find(x=>x.id===id);for(const [id,type]of [[2112,'餐厨水具'],[2084,'数码家电'],[2091,'服饰鞋包'],[2113,'服饰鞋包'],[745,'数码家电'],[339,'健康用品'],[712,'清洁纸品']])assert.equal(by(id).type,type);
});

test('classification alone cannot upgrade pending records or refresh old prices',()=>{
 const old=new Map(JSON.parse(fs.readFileSync('catalog/legacy-original.json')).map(x=>[x.id,x]));
 for(const x of items.filter(x=>x.review.status==='pending')){const p=old.get(x.id).price;assert.deepEqual([x.price.min,x.price.max,x.price.observed_at],[p.min,p.max,p.updated_at]);assert.equal(x.review.physical_tested,false);}
 for(const name of ['ikea-a','ikea-b','sports','tech']){const file=JSON.parse(fs.readFileSync('catalog/additions-'+name+'.json')),source=Array.isArray(file)?file:file.items;for(const x of source){const target=items.find(v=>v.id===x.id);assert.deepEqual(target.price,x.price);assert.deepEqual(target.source,x.source);assert.deepEqual(target.review,x.review);}}
 assert.equal(filterCatalog(items,{...freshState(),scope:'documented',type:'健康用品'},[],now).length,0);
});

test('old interests migrate without losing saved settings and new interests do not expand again',()=>{
 const x=normalizePreferences({nickname:'小星',budget:50,interests:['家居生活','数码科技','运动户外'],accent:'coral',cosmicTone:'crimson',intensity:'quiet'});assert.equal(x.schema_version,21);assert(x.interests.includes('家居日用'));assert(x.interests.includes('餐厨水具'));assert(x.interests.includes('数码家电'));assert(x.interests.includes('服饰鞋包'));assert.deepEqual(x.legacy_interests,['家居生活','数码科技','运动户外']);assert.equal(x.budget,50);assert.equal(x.cosmicTone,'crimson');assert.equal(x.accent,'coral');assert.deepEqual(normalizePreferences(x),x);
 const sports=normalizePreferences({schema_version:21,interests:['运动户外']});assert.deepEqual(sports.interests,['运动户外']);
 const b=boot({'domyon-preferences':JSON.stringify(x)});try{b.click('.personal-header');assert(b.$('#personalInterests [value="家居日用"]').checked);assert(b.$('#personalInterests [value="餐厨水具"]').checked);assert.equal(b.$('#resultCount').textContent,'1000 件');assert.deepEqual(b.errors,[]);}finally{b.dom.window.close();}
});
