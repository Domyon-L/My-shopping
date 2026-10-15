import {PORTAL_MS,PET_SIZE,clampPetPosition,projectTunnel,normalizePortalDuration} from './experience-core.mjs';
import {wormholeFrame,wormholeMesh,paintBlackHole,paintWormhole} from './wormhole-core.mjs';
import {SHOP_ICON_PATHS} from './shop-icons.mjs';
import {createNightSky,paintNightSky} from './night-sky.mjs';
const $=id=>document.getElementById(id);
const read=(key,fallback)=>{try{return JSON.parse(localStorage.getItem(key))??fallback;}catch{return fallback;}};
const save=(key,value)=>{try{localStorage.setItem(key,JSON.stringify(value));}catch{}};
const reduce=matchMedia('(prefers-reduced-motion: reduce)');
let effects=read('domyon-effects',true)!==false;
const emit=(name,detail)=>document.dispatchEvent(new CustomEvent(name,{detail}));
let shopping=false;
const entry=$('entryScreen'),storefront=$('storefront');
storefront.inert=true;entry.inert=false;
function enterShop(selection={}){shopping=true;entry.hidden=true;entry.inert=true;storefront.hidden=false;storefront.inert=false;document.body.classList.add('shop-active');petWrap.hidden=true;petPanel.hidden=true;emit('city:enter',selection);sizeSky();syncEffects();window.scrollTo({top:0,behavior:'instant'});$('heroTitle').focus({preventScroll:true});if(!mobile())openRail(false);}
function returnToEntry(){shopping=false;closeRail(false);document.querySelectorAll('dialog[open]').forEach(d=>d.close());storefront.hidden=true;storefront.inert=true;entry.hidden=false;entry.inert=false;document.body.classList.remove('shop-active');petWrap.hidden=read('domyon-pet-hidden',false)===true;petPanel.hidden=true;sizeSky();syncEffects();window.scrollTo({top:0,behavior:'instant'});$('entrySearch').focus({preventScroll:true});}
const scrollToCatalog=()=>{$('products').scrollIntoView({behavior:reduce.matches?'auto':'smooth',block:'start'});$('products').focus({preventScroll:true});};

// A native modal keeps the transition above product-detail dialogs, with focus containment.
const portal=$('portalDialog'),durationInput=$('portalDuration'),durationValue=$('portalDurationValue');
let preferredDuration=normalizePortalDuration(read('domyon-portal-duration',PORTAL_MS));
let portalTimer=0,portalFrame=0,portalAction=null,portalOpener=null,portalStart=0,activeDuration=PORTAL_MS,portalPainter=null;
function updateDuration(persist=false){
  durationInput.value=String(preferredDuration/1000);
  durationValue.value=(preferredDuration/1000).toFixed(1)+' 秒';
  durationInput.setAttribute('aria-valuetext',durationValue.value);
  durationInput.style.setProperty('--duration-fill',((preferredDuration-500)/2500*100)+'%');
  if(persist)save('domyon-portal-duration',preferredDuration);
}
durationInput.addEventListener('input',()=>{preferredDuration=normalizePortalDuration(Number(durationInput.value)*1000);updateDuration(true);});
durationInput.addEventListener('change',()=>{preferredDuration=normalizePortalDuration(Number(durationInput.value)*1000);updateDuration(true);});
updateDuration();
function cleanupPortal(restore=true){clearTimeout(portalTimer);cancelAnimationFrame(portalFrame);portalTimer=portalFrame=0;portalPainter=null;portalAction=null;portal.classList.remove('travelling');if(restore)portalOpener?.focus?.({preventScroll:true});}
function cancelPortal(){cleanupPortal();if(portal.open)portal.close();}
function finishPortal(){const action=portalAction;if(!action||!portal.open){cleanupPortal(false);return;}cleanupPortal(false);portal.close();action();}
function startPortal(action){if(portal.open)return;portalAction=action;portalOpener=document.activeElement;activeDuration=preferredDuration;portal.style.setProperty('--portal-duration',activeDuration+'ms');portal.style.setProperty('--portal-arrival-duration',Math.round(activeDuration*.16)+'ms');portal.style.setProperty('--portal-arrival-delay',Math.round(activeDuration*.84)+'ms');portal.showModal();syncEffects();portalStart=performance.now();portal.classList.add('travelling');portalTimer=setTimeout(finishPortal,activeDuration);drawTunnel();}
portal.addEventListener('close',()=>{if(!portal.open){cleanupPortal(!!portalAction);syncEffects();}});portal.addEventListener('cancel',cancelPortal);
$('portalSkip').addEventListener('click',finishPortal);$('portalCancel').addEventListener('click',cancelPortal);
function beginEntry(selection={}){if(shopping)return;startPortal(()=>enterShop(selection));}
$('entrySearchForm').addEventListener('submit',e=>{e.preventDefault();beginEntry({q:$('entrySearch').value.trim()});});
$('entryBrowse').addEventListener('click',()=>beginEntry());$('entryFavorites').addEventListener('click',()=>beginEntry({scope:'favorites'}));
$('entryChannels').addEventListener('click',e=>{const button=e.target.closest('[data-entry-type]');if(button)beginEntry({type:button.dataset.entryType});});
$('backToEntry').addEventListener('click',returnToEntry);
function drawTunnel(){
 const canvas=$('portalCanvas'),ctx=canvas.getContext('2d');portal.classList.toggle('canvas-unavailable',!ctx);if(!ctx||reduce.matches||!effects||document.hidden)return;
 const w=innerWidth,h=innerHeight,dpr=Math.min(devicePixelRatio||1,w<600?1.4:1.6);canvas.width=w*dpr;canvas.height=h*dpr;
 const crimson=document.documentElement.dataset.cosmicTone==='crimson';
 const night=createNightSky(w,h,{intensity:document.documentElement.dataset.intensity,tone:crimson?'crimson':'galaxy'});
 const colors=['108,227,255','143,174,255',crimson?'255,100,132':'226,155,255','225,239,255'];
 const seed=i=>{const a=Math.random()*Math.PI*2,r=.08+Math.random()*.76;return {x:Math.cos(a)*r,y:Math.sin(a)*r,z:Math.random(),angle:0,color:colors[i%colors.length]};};
 const stars=Array.from({length:w<600?160:340},(_,i)=>seed(i));
 const icons=Array.from({length:w<600?8:16},(_,i)=>({...seed(i),z:(i+.3)/(w<600?8:16),path:typeof Path2D==='function'?new Path2D(SHOP_ICON_PATHS[i%SHOP_ICON_PATHS.length]):null}));
 const draw=t=>{
  portalFrame=0;if(!portal.open||reduce.matches||!effects||document.hidden)return;
  const p=Math.max(0,Math.min((t-portalStart)/activeDuration,1)),f=wormholeFrame(p,w,h);
  ctx.setTransform(dpr,0,0,dpr,0,0);paintNightSky(ctx,night,w,h,p*2.6,p);
  const shade=ctx.createRadialGradient(f.cx,f.cy,0,f.cx,f.cy,Math.max(w,h)*.60);shade.addColorStop(0,'rgba(2,1,10,.80)');shade.addColorStop(.32,'rgba(10,4,28,.30)');shade.addColorStop(1,'rgba(0,0,6,.35)');ctx.fillStyle=shade;ctx.fillRect(0,0,w,h);
  paintWormhole(ctx,f,wormholeMesh(f,w<600?14:22,w<600?36:56),crimson);ctx.globalCompositeOperation='screen';
  for(const s of stars){
   const point=projectTunnel({...s,angle:p*.9+(1-s.z)*p*.3},p,w,h);
   if(point.x<-80||point.y<-80||point.x>w+80||point.y>h+80)continue;
   ctx.strokeStyle=`rgba(${s.color},${point.alpha*.78})`;ctx.lineWidth=.5+(1-point.z)*1.5;
   ctx.beginPath();ctx.moveTo(point.tailX,point.tailY);ctx.lineTo((point.tailX+point.x)*.5-(point.y-f.cy)*.018,(point.tailY+point.y)*.5+(point.x-f.cx)*.018);ctx.lineTo(point.x,point.y);ctx.stroke();
   if(point.z>.35){ctx.fillStyle=`rgba(${s.color},${point.alpha})`;ctx.beginPath();ctx.arc(point.x,point.y,1.1,0,Math.PI*2);ctx.fill();}
  }
  for(const s of icons){
   const point=projectTunnel({...s,angle:p*.8},p,w,h);
   if(point.alpha<.04||point.x<-point.size||point.y<-point.size||point.x>w+point.size||point.y>h+point.size||Math.hypot(point.x-f.cx,point.y-f.cy)<f.core*1.5*f.holeAlpha)continue;
   ctx.save();ctx.translate(point.x,point.y);ctx.rotate(point.rotation+(1-point.z)*.5);ctx.scale(point.size/30,point.size/30);ctx.translate(-12,-12);ctx.globalAlpha=point.alpha*.45;ctx.strokeStyle=`rgb(${s.color})`;ctx.lineWidth=1.25;ctx.lineCap='round';ctx.lineJoin='round';if(s.path)ctx.stroke(s.path);ctx.restore();
  }
  ctx.globalCompositeOperation='source-over';paintBlackHole(ctx,f,crimson);
  if(f.flash>0){const arrival=ctx.createRadialGradient(f.cx,f.cy,0,f.cx,f.cy,Math.max(w,h)*.75);arrival.addColorStop(0,`rgba(196,222,255,${f.flash*.32})`);arrival.addColorStop(.25,`rgba(119,133,239,${f.flash*.13})`);arrival.addColorStop(1,'rgba(34,22,62,0)');ctx.fillStyle=arrival;ctx.fillRect(0,0,w,h);}
  ctx.globalAlpha=1;portalFrame=requestAnimationFrame(draw);
 };portalPainter=draw;portalFrame=requestAnimationFrame(draw);
}

// Desktop navigation stays beside the catalogue; phones use a focus-contained drawer.
const rail=$('categoryRail'),menu=$('menuToggle'),reveal=$('railReveal'),backdrop=$('railBackdrop');const mobile=()=>innerWidth<=900;
const railBackground=[document.querySelector('header'),$('main'),$('petWrap'),document.querySelector('.mobile-dock'),$('compareTray'),document.querySelector('.skip'),reveal].filter(Boolean);
let railReturn=null,railTimer=0;
function armRailIdle(){clearTimeout(railTimer);railTimer=0;if(!shopping||document.hidden||!document.body.classList.contains('rail-open'))return;railTimer=setTimeout(()=>closeRail(rail.contains(document.activeElement)),3000);}
function railMode(){const modal=mobile();railBackground.forEach(el=>el.inert=modal);backdrop.hidden=!modal;if(modal){rail.setAttribute('role','dialog');rail.setAttribute('aria-modal','true');}else{rail.removeAttribute('role');rail.removeAttribute('aria-modal');}}
function closeRail(restore=true){clearTimeout(railTimer);railTimer=0;document.body.classList.remove('rail-open');for(const b of [menu,reveal])b.setAttribute('aria-expanded','false');backdrop.hidden=true;rail.removeAttribute('role');rail.removeAttribute('aria-modal');rail.inert=true;railBackground.forEach(el=>el.inert=false);if(restore)(railReturn?.isConnected?railReturn:menu).focus?.();}
function openRail(focus=true){if(!shopping)return;railReturn=focus?document.activeElement:menu;rail.inert=false;document.body.classList.add('rail-open');for(const b of [menu,reveal])b.setAttribute('aria-expanded','true');railMode();armRailIdle();if(focus)$('menuClose').focus();}
menu.addEventListener('click',()=>document.body.classList.contains('rail-open')?closeRail():openRail());reveal.addEventListener('click',()=>openRail());$('menuClose').addEventListener('click',()=>closeRail());backdrop.addEventListener('click',()=>closeRail());
document.addEventListener('city:categories',()=>openRail());
rail.addEventListener('click',e=>{if(e.target.closest('[data-type],[data-value]')){closeRail();scrollToCatalog();}else if(e.target.closest('[data-personal-open],[data-brand-open]'))closeRail(false);});
$('standardsButton').addEventListener('click',()=>closeRail(false));
document.addEventListener('click',armRailIdle,true);
document.addEventListener('keydown',e=>{armRailIdle();if(!document.body.classList.contains('rail-open'))return;if(e.key==='Escape'){e.preventDefault();closeRail();}else if(e.key==='Tab'&&mobile()){const buttons=[...rail.querySelectorAll('button:not([disabled])')];const first=buttons[0],last=buttons.at(-1);if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}}});
document.addEventListener('visibilitychange',armRailIdle);
window.addEventListener('resize',()=>{if(document.body.classList.contains('rail-open')){railMode();armRailIdle();}else rail.inert=true;});closeRail(false);
document.querySelectorAll('[data-mobile]').forEach(b=>b.addEventListener('click',()=>{const action=b.dataset.mobile;if(action==='categories')openRail();if(action==='discover'){emit('city:discover');}if(action==='favorites'){emit('city:favorites');scrollToCatalog();}if(action==='entrance')returnToEntry();}));

// One viewport-sized coordinate system for mouse, pen and touch dragging.
const petWrap=$('petWrap'),petBuddy=$('petBuddy'),petPanel=$('petPanel');
let position=read('domyon-pet-position',null),drag=null,suppressClick=false;
const viewport=()=>({width:window.visualViewport?.width||innerWidth,height:window.visualViewport?.height||innerHeight});
function positionPet(x,y,persist=false){const v=viewport();position=clampPetPosition(x,y,v.width,v.height);petWrap.style.left=position.x+'px';petWrap.style.top=position.y+'px';const panelWidth=v.width<=370?220:v.width<=600?240:260;petPanel.style.left=Math.min(Math.max(8,position.x>v.width/2?position.x+PET_SIZE-panelWidth:position.x),Math.max(8,v.width-panelWidth-8))+'px';petPanel.style.top=Math.min(Math.max(8,position.y>v.height/2?position.y-300:position.y+PET_SIZE+4),Math.max(8,v.height-300))+'px';if(persist)save('domyon-pet-position',position);}
function resetPet(){const v=viewport();positionPet(v.width-PET_SIZE-(mobile()?18:70),v.height-PET_SIZE-(mobile()?88:90),true);petPanel.hidden=true;petBuddy.setAttribute('aria-expanded','false');}
$('petRestore').addEventListener('click',()=>{petWrap.hidden=false;save('domyon-pet-hidden',false);resetPet();petBuddy.focus();});
if(position&&Number.isFinite(position.x)&&Number.isFinite(position.y))positionPet(position.x,position.y);else resetPet();
petWrap.hidden=read('domyon-pet-hidden',false)===true;
petBuddy.setAttribute('aria-label','小引好物精灵：拖动可移动，点击打开菜单，方向键也可移动');petBuddy.setAttribute('aria-controls','petPanel');petBuddy.setAttribute('aria-expanded','false');
$('petBubble').innerHTML='<b>小引</b>';
petBuddy.addEventListener('pointerdown',e=>{if(e.button!==0||e.isPrimary===false)return;drag={id:e.pointerId,x:e.clientX,y:e.clientY,px:position.x,py:position.y,moved:false};suppressClick=false;petBuddy.setPointerCapture?.(e.pointerId);petPanel.hidden=true;petBuddy.setAttribute('aria-expanded','false');});
petBuddy.addEventListener('pointermove',e=>{if(!drag||drag.id!==e.pointerId)return;const dx=e.clientX-drag.x,dy=e.clientY-drag.y;if(Math.hypot(dx,dy)>5)drag.moved=true;if(drag.moved){petWrap.classList.add('dragging');positionPet(drag.px+dx,drag.py+dy);}});
function endDrag(e){if(!drag||e.pointerId!==drag.id)return;suppressClick=drag.moved;save('domyon-pet-position',position);drag=null;petWrap.classList.remove('dragging');if(petBuddy.hasPointerCapture?.(e.pointerId))petBuddy.releasePointerCapture(e.pointerId);}
petBuddy.addEventListener('pointerup',endDrag);petBuddy.addEventListener('pointercancel',endDrag);petBuddy.addEventListener('lostpointercapture',endDrag);
petBuddy.addEventListener('click',e=>{if(suppressClick&&e.detail!==0){suppressClick=false;return;}suppressClick=false;petPanel.hidden=!petPanel.hidden;petBuddy.setAttribute('aria-expanded',String(!petPanel.hidden));petBuddy.classList.remove('is-excited');requestAnimationFrame(()=>petBuddy.classList.add('is-excited'));});
petBuddy.addEventListener('keydown',e=>{const step=e.shiftKey?40:15;const delta={ArrowLeft:[-step,0],ArrowRight:[step,0],ArrowUp:[0,-step],ArrowDown:[0,step]}[e.key];if(delta){e.preventDefault();positionPet(position.x+delta[0],position.y+delta[1],true);}if(e.key==='Home'){e.preventDefault();resetPet();}});
petPanel.addEventListener('click',e=>{const action=e.target.closest('[data-pet-action]')?.dataset.petAction;if(!action)return;if(action==='discover')beginEntry({scope:'all'});if(action==='favorites')beginEntry({scope:'favorites'});if(action==='reset')resetPet();if(action==='hide'){petWrap.hidden=true;save('domyon-pet-hidden',true);$('petRestore').focus();}petPanel.hidden=true;petBuddy.setAttribute('aria-expanded','false');});
document.addEventListener('pointerdown',e=>{if(!petWrap.contains(e.target)){petPanel.hidden=true;petBuddy.setAttribute('aria-expanded','false');}});
document.addEventListener('keydown',e=>{if(e.key==='Escape'){petPanel.hidden=true;petBuddy.setAttribute('aria-expanded','false');}});
window.addEventListener('resize',()=>positionPet(position.x,position.y));window.visualViewport?.addEventListener('resize',()=>positionPet(position.x,position.y));

// Ambient constellation, pointer response and occasional meteors. No scrolling blockers.
const sky=$('snow'),ctx=sky.getContext('2d');let w=0,h=0,stars=[],meteors=[],nightScene=null,raf=0,last=0,nextMeteor=0,pointer={x:-1000,y:-1000};
function sizeSky(){w=innerWidth;h=innerHeight;const dpr=Math.min(devicePixelRatio||1,1.6);sky.width=w*dpr;sky.height=h*dpr;nightScene=createNightSky(w,h,{light:document.documentElement.dataset.theme==='light',charts:!shopping,intensity:document.documentElement.dataset.intensity,tone:document.documentElement.dataset.cosmicTone});ctx?.setTransform(dpr,0,0,dpr,0,0);stars=Array.from({length:Math.round((w<600?58:w<1100?90:130)*(document.documentElement.dataset.intensity==='quiet'?.45:document.documentElement.dataset.intensity==='balanced'?.75:1))},()=>({x:Math.random()*w,y:Math.random()*h,v:.04+Math.random()*.1,r:.4+Math.random()*.8,p:Math.random()*7}));}
function drawSky(t){raf=0;if(!ctx||!effects||reduce.matches||document.hidden||portal.open)return;if(last&&t-last<33){raf=requestAnimationFrame(drawSky);return;}const dt=Math.min((t-last)/16.667,2)||1;last=t;paintNightSky(ctx,nightScene,w,h,t*.00014);const light=document.documentElement.dataset.theme==='light';
  for(let i=0;i<stars.length;i++){const s=stars[i];s.y=(s.y-s.v*dt+h)%h;s.x=(s.x+Math.sin(t*.00015+s.p)*.1*dt+w)%w;ctx.fillStyle=light?'rgba(19,81,126,.55)':`rgba(139,208,255,${.35+Math.sin(t*.0008+s.p)*.25})`;ctx.beginPath();ctx.arc(s.x,s.y,s.r,0,Math.PI*2);ctx.fill();
    const dx=pointer.x-s.x,dy=pointer.y-s.y;if(dx*dx+dy*dy<16000){ctx.strokeStyle=light?'rgba(10,113,158,.16)':'rgba(99,232,255,.22)';ctx.beginPath();ctx.moveTo(s.x,s.y);ctx.lineTo(pointer.x,pointer.y);ctx.stroke();}
    if(i%3===0&&stars[i+1]){const n=stars[i+1];if(Math.hypot(s.x-n.x,s.y-n.y)<120){ctx.strokeStyle=light?'rgba(20,101,147,.14)':'rgba(129,157,255,.18)';ctx.beginPath();ctx.moveTo(s.x,s.y);ctx.lineTo(n.x,n.y);ctx.stroke();}}
  }
  if(t>nextMeteor){meteors.push({x:Math.random()*w,y:Math.random()*h*.35,life:1});nextMeteor=t+(shopping?12000:6000)+Math.random()*8000;}
  for(const m of meteors){m.x+=8*dt;m.y+=3*dt;m.life-=.018*dt;ctx.strokeStyle=`rgba(${light?'15,111,167':document.documentElement.dataset.cosmicTone==='crimson'?'255,99,142':'143,207,255'},${Math.max(0,m.life)*.6})`;ctx.lineWidth=1.2;ctx.beginPath();ctx.moveTo(m.x,m.y);ctx.lineTo(m.x-100,m.y-37.5);ctx.stroke();}meteors=meteors.filter(m=>m.life>0);raf=requestAnimationFrame(drawSky);
}
function syncEffects(){cancelAnimationFrame(raf);raf=0;const animate=effects&&!reduce.matches;if(!animate||document.hidden){cancelAnimationFrame(portalFrame);portalFrame=0;}else if(portal.open&&portalPainter&&!portalFrame){portalFrame=requestAnimationFrame(portalPainter);}sky.hidden=!animate;document.documentElement.classList.toggle('effects-off',!animate);$('snowToggle').setAttribute('aria-pressed',String(effects));$('snowToggle').setAttribute('aria-label',effects?'关闭星空动效':'开启星空动效');if(animate&&!portal.open&&!document.hidden){last=0;raf=requestAnimationFrame(drawSky);}}
$('snowToggle').addEventListener('click',()=>{effects=!effects;save('domyon-effects',effects);syncEffects();});
reduce.addEventListener('change',()=>{syncEffects();if(reduce.matches)cancelAnimationFrame(portalFrame);});document.addEventListener('visibilitychange',syncEffects);window.addEventListener('resize',()=>{sizeSky();if(portal.open){cancelAnimationFrame(portalFrame);portalFrame=0;drawTunnel();}});window.addEventListener('pagehide',()=>{cancelAnimationFrame(raf);if(portal.open)portal.close();cleanupPortal();});window.addEventListener('pageshow',syncEffects);
window.addEventListener('pointermove',e=>{if(e.pointerType==='touch')return;pointer={x:e.clientX,y:e.clientY};if(!drag){const r=petBuddy.getBoundingClientRect();petBuddy.style.setProperty('--look-x',Math.max(-3,Math.min(3,(e.clientX-r.left-47)/90))+'px');petBuddy.style.setProperty('--look-y',Math.max(-2,Math.min(2,(e.clientY-r.top-47)/90))+'px');}},{passive:true});document.addEventListener('pointerleave',()=>{pointer={x:-1000,y:-1000};});
sizeSky();syncEffects();
document.addEventListener('city:effects',e=>{effects=e.detail===true;save('domyon-effects',effects);syncEffects();});
document.addEventListener('city:theme',()=>{sizeSky();syncEffects();});document.addEventListener('city:preferences',()=>{sizeSky();syncEffects();});
// Visible by default. An unsupported observer cannot hide content.
if('IntersectionObserver' in window){const observer=new IntersectionObserver(entries=>{for(const e of entries)if(e.isIntersecting){e.target.classList.add('has-arrived');observer.unobserve(e.target);}},{threshold:.08});const observe=()=>document.querySelectorAll('.product-row,.featured-card').forEach(el=>observer.observe(el));document.addEventListener('catalog:render',observe);observe();}
