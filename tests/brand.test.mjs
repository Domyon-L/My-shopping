import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {boot} from './helpers.mjs';
import {brandKey,brandDirectory,validBrandPick} from '../dist/brand-core.mjs';
import {filterCatalog,freshState,isListed} from '../dist/catalog-core.mjs';
const {items}=JSON.parse(fs.readFileSync('catalog/reviewed-catalog.json'));
const {picks}=JSON.parse(fs.readFileSync('catalog/brand-picks.json'));
const now=new Date('2026-10-14T12:00:00+08:00');
test('brand aliases unify historical and reviewed names without hiding the complete catalogue',()=>{
 assert.equal(brandKey('无印良品'),brandKey('MUJI 无印良品'));assert.equal(brandKey('耐克'),brandKey('Nike 耐克'));
 const dir=brandDirectory(items,picks,'',now);assert.equal(dir.reduce((sum,g)=>sum+g.count,0),1000);assert.equal(dir.filter(g=>g.picks.length).length,4);
 for(const b of dir){const xs=filterCatalog(items,{...freshState(),brand:b.key},[],now);assert.equal(xs.length,b.count);assert(xs.every(x=>brandKey(x.brand)===b.key));}
 assert.equal(brandDirectory(items,picks,'宜家',now).length,1);assert.equal(brandDirectory(items,picks,'MUJI',now).length,1);
});
test('a scoped brand pick requires currently priced same-category same-brand alternatives',()=>{
 for(const p of picks)assert(validBrandPick(p,items,now));
 const pick=structuredClone(picks[0]);pick.alternatives=[{product_id:1003,tradeoff:'invalid'}];assert(!validBrandPick(pick,items,now));
 assert(!validBrandPick(picks[0],items,new Date('2026-12-01')));
 assert(!validBrandPick({...picks[0],claim_scope:'global_best'},items,now));
 const old=items.find(x=>x.review.status==='pending');assert(!validBrandPick({...picks[0],product_id:old.id},items,now));
});
test('brand home cards open reason, alternatives and evidence; browse keeps brand counts aligned',()=>{
 const b=boot();try{const {$,w,click}=b;assert.equal(w.document.querySelectorAll('#brandPicks .brand-pick').length,4);
 click('#brandPicks [data-brand-open="casio"]');assert($('#brandDialog').open);assert($('#brandProfile').textContent.includes('88元'));assert($('#brandProfile').textContent.includes('考试'));assert($('#brandProfile a[href^="https://www.casio.com.cn/"]'));
 click('#brandProfile [data-detail="2123"]');assert(!$('#brandDialog').open);assert($('#detailDialog').open);assert($('#detailTitle').textContent.includes('fx-82'));click('[data-close="detailDialog"]');
 click('[data-brand-open]');click('[data-brand-choice="casio"]');const count=filterCatalog(w.CATALOG.items,{...freshState(),brand:'casio'}).length;click('[data-brand-browse="casio"]');assert.equal($('#resultCount').textContent,count+' 件');assert($('#activeChips').textContent.includes('CASIO'));click('#reset');assert.equal($('#resultCount').textContent,'1000 件');assert.deepEqual(b.errors,[]);
 }finally{b.dom.window.close();}
});
test('all brand names stay searchable while unverified brands receive no made-up winner',()=>{
 const b=boot({}, {width:320});try{b.click('[data-brand-open]');const dir=brandDirectory(b.w.CATALOG.items,picks),pending=dir.find(g=>!g.documented&&!g.picks.length);assert(pending);
 b.$('#brandSearch').value=pending.label;b.$('#brandSearch').dispatchEvent(new b.w.Event('input',{bubbles:true}));assert(b.$('#brandDirectory button'));b.$('#brandDirectory button').click();assert(b.$('#brandProfile').textContent.includes('待核对'));assert.equal(b.$('#brandProfile .brand-profile-card'),null);assert(b.$('#brandProfile [data-brand-browse]'));
 assert.equal(b.w.document.querySelectorAll('#brandPicks img').length,0);assert.deepEqual(b.errors,[]);
 }finally{b.dom.window.close();}
});
test('the 154 additions all have source/date identity, and upgrades explain an actual use case',()=>{
 const batch=items.filter(x=>x.isNew);assert.equal(batch.length,154);assert.equal(new Set(batch.map(x=>brandKey(x.brand)+':'+x.model)).size,154);
 assert.equal(batch.filter(x=>x.price.max<=100).length,139);for(const x of batch){assert(isListed(x,now));assert.equal(x.source.checked_at,'2026-10-14');assert.equal(x.price.observed_at,'2026-10-14');assert.equal(x.review.physical_tested,false);if(x.price.max>100){assert(x.purchase.upgrade);assert(x.purchase.source_urls?.length);assert(x.purchase.source_urls.every(u=>x.source.urls.some(s=>s.url===u)));}}
});
