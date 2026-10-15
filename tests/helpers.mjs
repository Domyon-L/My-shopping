import fs from 'node:fs';
import assert from 'node:assert/strict';
import {JSDOM,VirtualConsole} from 'jsdom';
import * as personalCore from '../dist/personal-core.mjs';
import * as wormhole from '../dist/wormhole-core.mjs';
import * as brandCore from '../dist/brand-core.mjs';
import * as core from '../dist/catalog-core.mjs';
import * as experienceCore from '../dist/experience-core.mjs';
import * as shopIcons from '../dist/shop-icons.mjs';
const html=fs.readFileSync('dist/index.html');
const data=fs.readFileSync('dist/catalog-data.js','utf8');
const app=fs.readFileSync('dist/app.mjs','utf8').replace(/^import[^\n]*\n/gm,'');
export function boot(saved={},options={}){
 const errors=[],frames=new Map(),drawing={arc:0,ellipse:0,blackCores:0,stroke:0,line:0,paths:0,linearGradients:0,plates:0,invalid:0},vc=new VirtualConsole();vc.on('jsdomError',err=>errors.push(err.message));
 const dom=new JSDOM(html,{url:'https://example.test/shoppers/',contentType:'text/html; charset=utf-8',runScripts:'outside-only',pretendToBeVisual:true,virtualConsole:vc}),w=dom.window;
 w.__brand=brandCore;w.__core=core;w.__personal=personalCore;w.__experience=experienceCore;w.__wormhole=wormhole;w.scrollTo=function(){};let clock=0,nextTimer=0;const timers=new Map();w.setTimeout=(fn,delay)=>{timers.set(++nextTimer,{fn,at:clock+(delay||0)});return nextTimer;};w.clearTimeout=id=>timers.delete(id);const advance=ms=>{clock+=ms;for(const [id,t] of [...timers])if(t.at<=clock){timers.delete(id);t.fn();}};w.performance.now=()=>clock;Object.defineProperty(w,'innerWidth',{value:options.width||1280,writable:true});Object.defineProperty(w,'innerHeight',{value:options.height||800,writable:true});w.HTMLElement.prototype.scrollIntoView=function(){};
 w.HTMLDialogElement.prototype.showModal=function(){this.setAttribute('open','');};w.HTMLDialogElement.prototype.close=function(){if(!this.open)return;this.removeAttribute('open');const emit=()=>this.dispatchEvent(new w.Event('close'));if(options.asyncClose)w.setTimeout(emit,10);else emit();};
 w.matchMedia=()=>({matches:!!options.reduce,addEventListener(){}});let frameId=0;w.requestAnimationFrame=fn=>{frames.set(++frameId,fn);return frameId;};w.cancelAnimationFrame=id=>frames.delete(id);
 w.__icons=shopIcons;w.Path2D=class{constructor(path){this.path=path;}};
 const finite=(...v)=>{if(v.some(n=>typeof n==='number'&&!Number.isFinite(n)))drawing.invalid++;};
 const ctx={setTransform:finite,clearRect:finite,fillRect:finite,save(){},restore(){},translate:finite,rotate:finite,scale:finite,fillText(){},drawImage(...v){drawing.plates++;finite(...v);},createLinearGradient(...v){drawing.linearGradients++;finite(...v);return {addColorStop(){}};},createRadialGradient(...v){finite(...v);return {addColorStop(){}};},beginPath(){},closePath(){},arc(...v){drawing.arc++;finite(...v);},ellipse(...v){drawing.arc++;drawing.ellipse++;finite(...v);},fill(){if(this.fillStyle==='#010106')drawing.blackCores++;},stroke(path){drawing.stroke++;if(path)drawing.paths++;},lineTo(...v){drawing.line++;finite(...v);},moveTo(...v){drawing.line++;finite(...v);}};w.HTMLCanvasElement.prototype.getContext=()=>ctx;
 w.eval('(function(){'+fs.readFileSync('dist/constellations.mjs','utf8').replace(/^export /gm,'')+';window.__constellations={CONSTELLATIONS,constellationLayout,drawConstellations};})()');
 w.eval('(function(){const {drawConstellations}=window.__constellations;'+fs.readFileSync('dist/night-sky.mjs','utf8').replace(/^import[^\n]*\n/gm,'').replace(/^export /gm,'')+';window.__night={createNightSky,paintNightSky};})()');
 for(const [k,v] of Object.entries(saved))w.localStorage.setItem(k,v);
 w.URL.createObjectURL=b=>{w.__export=b;return 'blob:test';};w.URL.revokeObjectURL=()=>{};w.HTMLAnchorElement.prototype.click=function(){w.__download=this.download;};
 w.eval(w.document.querySelector('head script').textContent);w.eval(data);w.eval(fs.readFileSync('dist/brand-data.js','utf8'));if(options.catalog)w.CATALOG=options.catalog;w.eval('(function(){const {brandKey,brandDirectory}=window.__brand;const {TYPE_ORDER,BANDS,freshState,filterCatalog,catalogNavigation,parseSearch,money,budgetLabel,dated,comparable,productURL,evidenceTier,preferenceProfile,recommendationReasons,isListed}=window.__core;const {normalizePreferences,PERSONAL_TYPES,withinBudget,upgradeReason,personalMatch,suggestions}=window.__personal;const {shopIcon}=window.__icons;'+app+'})()');w.eval('(function(){const {PORTAL_MS,PET_SIZE,clampPetPosition,projectTunnel,normalizePortalDuration}=window.__experience;const {wormholeFrame,wormholeMesh,paintBlackHole,paintWormhole}=window.__wormhole;const {SHOP_ICON_PATHS}=window.__icons;const {createNightSky,paintNightSky}=window.__night;'+fs.readFileSync('dist/experience.mjs','utf8').replace(/^import[^\n]*\n/gm,'')+'})()');
 if(!options.entry){w.document.getElementById('entryBrowse').click();advance(1500);advance(10);}
 const $=s=>w.document.querySelector(s),click=s=>{assert($(s),'Missing '+s);$(s).click();},change=(s,v)=>{$(s).value=v;$(s).dispatchEvent(new w.Event('change',{bubbles:true}));};
 return {w,dom,$,click,change,errors,frames,drawing,advance};
}
