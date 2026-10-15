import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {JSDOM,VirtualConsole} from 'jsdom';
import * as core from '../dist/catalog-core.mjs';
const html=fs.readFileSync('dist/index.html');
import {boot} from './helpers.mjs';
test('Chinese entry, themes, constellations and pet menu work and persist',()=>{
 const b=boot();try{const {w,$,click,drawing,frames}=b;assert.equal(w.document.documentElement.lang,'zh-CN');assert.equal(w.document.documentElement.dataset.theme,'dark');assert.equal($('.product-list').children.length,24);assert.equal($('#totalStat').textContent,'1000');
 click('#themeToggle');assert.equal(w.document.documentElement.dataset.theme,'light');assert.equal(w.localStorage.getItem('boutique-theme'),'light');assert.equal($('#themeToggle').getAttribute('aria-label'),'切换黑夜主题');click('#backToEntry');
 const point=new w.MouseEvent('pointerdown',{clientX:100,clientY:200,bubbles:true});w.document.dispatchEvent(point);const frame=frames.values().next().value;assert(frame);frame(1000);assert(drawing.arc>0);assert(drawing.stroke>0);assert(drawing.line>0);
 click('#snowToggle');assert($('#snow').hidden);assert.equal(w.localStorage.getItem('domyon-effects'),'false');click('#snowToggle');assert(!$('#snow').hidden);
 click('#petBuddy');assert(!$('#petPanel').hidden);assert($('#petPanel').querySelector('[data-pet-action="discover"]'));assert.deepEqual(b.errors,[]);
 }finally{b.dom.window.close();}
 const again=boot({'boutique-theme':'light','domyon-effects':'false'});assert.equal(again.w.document.documentElement.dataset.theme,'light');assert(again.$('#snow').hidden);again.dom.window.close();
});
test('category, subcategory, search, reset, pagination and new-product shortcuts are interactive',()=>{
 const b=boot();try{const {w,$,click,change}=b;assert(!$('#nextPage').disabled);const first=$('.product-card').dataset.product;click('#nextPage');assert.notEqual($('.product-card').dataset.product,first);click('#prevPage');assert.equal($('.product-card').dataset.product,first);click('[data-type="数码科技"]');assert.equal($('#groupSelect').value,'');change('#groupSelect','影音设备');change('#categorySelect','入耳式耳机');assert([...w.document.querySelectorAll('.product-row')].every(r=>r.textContent.includes('AirPods')));
 click('#reset');assert.equal($('#resultCount').textContent,'1000 件');$('#search').value='100元以内 收纳';$('#searchForm').dispatchEvent(new w.Event('submit',{bubbles:true,cancelable:true}));assert.equal($('#resultCount').textContent,'39 件');assert([...w.document.querySelectorAll('#products .product-card')].every(n=>w.CATALOG.items.find(x=>x.id===Number(n.dataset.product)).price.max<=100));
 click('#clearSearch');assert.equal($('#resultCount').textContent,'1000 件');click('[data-shortcut="new"]');assert.equal($('#resultCount').textContent,'154 件');assert.equal($('.product-list').children.length,24);assert([...w.document.querySelectorAll('#products .product-card')].every(n=>w.CATALOG.items.find(x=>x.id===Number(n.dataset.product)).isNew));
 click('[data-scope="documented"]');assert.equal($('#resultCount').textContent,'160 件');click('#standardsButton');assert($('#standardsDialog').open);assert($('#auditSummary').textContent.includes('未核价'));click('[data-close="standardsDialog"]');assert(!$('#standardsDialog').open);
 $('#search').value='不存在xyz';$('#searchForm').dispatchEvent(new w.Event('submit',{bubbles:true,cancelable:true}));assert($('.empty'));click('[data-reset]');assert.equal($('#resultCount').textContent,'1000 件');assert.deepEqual(b.errors,[]);
 }finally{b.dom.window.close();}
});
test('product detail, source links, favorites and three-item comparison behave correctly',()=>{
 const b=boot();try{const {w,$,click}=b;const showProduct=id=>{$('#search').value=w.CATALOG.items.find(x=>x.id===id).product;$('#searchForm').dispatchEvent(new w.Event('submit',{bubbles:true,cancelable:true}));};$('#search').value='AirPods';$('#searchForm').dispatchEvent(new w.Event('submit',{bubbles:true,cancelable:true}));click('[data-detail="1002"]');assert($('#detailDialog').open);assert($('#detailTitle').textContent.includes('AirPods Pro 3'));assert($('#detailContent').textContent.includes('实物测试：未进行'));const sources=[...w.document.querySelectorAll('#detailContent .source-link')];assert(sources.length);assert(sources.every(a=>a.href.startsWith('https:')&&a.rel.includes('noopener')));
 click('#nextDetail');assert(!$('#detailTitle').textContent.includes('AirPods Pro 3'));click('#prevDetail');assert($('#detailTitle').textContent.includes('AirPods Pro 3'));click('#detailContent [data-favorite="1002"]');assert.equal($('#favCount').textContent,'1');assert(w.localStorage.getItem('boutique-favorites-v2').includes('1002'));
 w.document.dispatchEvent(new w.KeyboardEvent('keydown',{key:'Escape',bubbles:true}));assert(!$('#detailDialog').open);showProduct(1003);click('[data-favorite="1003"]');click('#clearSearch');click('[data-scope="favorites"]');assert.equal($('#resultCount').textContent,'2 件');click('[data-favorite="1003"]');assert.equal($('#resultCount').textContent,'1 件');click('[data-scope="documented"]');
 for(const id of [1002,1003,1005,1012]){showProduct(id);click('[data-compare="'+id+'"]');}assert.equal($('#compareCount').textContent,'3 / 3');assert($('#toast').textContent.includes('最多对比'));
 click('#compareOpen');assert($('#compareDialog').open);assert.equal(w.document.querySelectorAll('.compare-table thead th').length,4);assert($('#compareContent').textContent.includes('跨品类'));click('[data-close="compareDialog"]');click('#clearCompare');assert($('#compareTray').hidden);assert.deepEqual(b.errors,[]);
 }finally{b.dom.window.close();}
 const saved=boot({'boutique-favorites-v2':'[664,548,1002,99999,"oops"]'});assert.equal(saved.$('#favCount').textContent,'1');saved.click('[data-scope="favorites"]');assert(saved.$('.product-title').textContent.includes('AirPods Pro 3'));saved.dom.window.close();
});
test('budget controls include clearly dated historical prices by default and can restrict exports to current sourced prices',async()=>{
 const b=boot();try{const {w,$,click,change}=b;change('#budgetSelect','0-50');assert.equal($('#resultCount').textContent,'222 件');click('#moreFilters');assert($('#filterDialog').open);$('#includeHistory').checked=true;$('#includeHistory').dispatchEvent(new w.Event('change',{bubbles:true}));assert.equal(parseInt($('#resultCount').textContent),222);$('#includeHistory').checked=false;$('#includeHistory').dispatchEvent(new w.Event('change',{bubbles:true}));assert.equal($('#resultCount').textContent,'92 件');click('[data-close="filterDialog"]');click('#exportButton');assert.equal(w.__download,'精品之城-当前商品.csv');
 const text=await new Promise((resolve,reject)=>{const reader=new w.FileReader();reader.onload=()=>resolve(reader.result);reader.onerror=reject;reader.readAsText(w.__export);});assert(String(text).includes('SAMLA'));assert(!String(text).includes('AirPods Pro 3'));assert.equal(String(text).trim().split('\r\n').length,93);assert.deepEqual(b.errors,[]);
 }finally{b.dom.window.close();}
});
test('entry declares UTF-8 before Chinese content and every referenced local production asset exists',()=>{
 assert.equal(html[0],0xef);assert.equal(html[1],0xbb);assert.equal(html[2],0xbf);const text=html.toString('utf8');assert(text.indexOf('charset="utf-8"')<1024);assert(!text.includes('\ufffd'));assert(!text.includes('{{PET}}'));
 const d=new JSDOM(html);for(const el of d.window.document.querySelectorAll('link[href],script[src]')){const p=el.getAttribute('href')||el.getAttribute('src');assert(p.startsWith('./'));assert(fs.existsSync('dist/'+p.slice(2)),p);}
 const ids=[...d.window.document.querySelectorAll('[id]')].map(x=>x.id);assert.equal(ids.length,new Set(ids).size);d.window.close();
});
