import {brandKey} from './brand-keys.d90428947558.mjs';
import {DAILY_TYPES} from './taxonomy-core.e0b955ae256f.mjs';
export const TYPE_ORDER=DAILY_TYPES;
export const BANDS=[['0-50','50 元以下',0,50],['50-100','50–100 元',50,100],['100-300','100–300 元',100,300],['300-600','300–600 元',300,600],['600-1000','600–1000 元',600,1000],['1000-2000','1000–2000 元',1000,2000],['2000+','2000 元及以上',2000,Infinity]];
export const freshState=()=>({q:'',brand:'',type:'',group:'',category:'',scope:'all',budget:'',max:null,sort:'recommended',personalized:true,scene:'',history:true,priceKind:'',page:1,valueMode:'',valueFirst:false,preferredTypes:[]});
export function catalogNavigation(items,state,favorites=[],now=new Date()){
  const pool=filterCatalog(items,{...state,type:'',group:'',category:'',sort:'name'},favorites,now);
  const choices=(xs,key)=>[...new Set(xs.map(x=>x[key]))].filter(Boolean).sort((a,b)=>a.localeCompare(b,'zh-CN')).map(value=>({value,count:xs.filter(x=>x[key]===value).length}));
  const typed=pool.filter(x=>!state.type||x.type===state.type);
  const grouped=typed.filter(x=>!state.group||x.group===state.group);
  return {types:[{value:'',count:pool.length},...TYPE_ORDER.map(value=>({value,count:pool.filter(x=>x.type===value).length})).filter(x=>x.count)],groups:choices(typed,'group'),categories:choices(grouped,'category')};
}
export function priceMid(p){return Number.isFinite(p.min)&&Number.isFinite(p.max)?(p.min+p.max)/2:null;}
export function dated(p,now=new Date()){const t=Date.parse(p.observed_at+'T00:00:00+08:00');return !Number.isFinite(t)||t>now.getTime()||(now.getTime()-t)>30*86400000;}
export function priceUsable(p,history=false,now=new Date()){return p.currency==='CNY'&&priceMid(p)!==null&&((p.kind==='documented'&&!dated(p,now))||(history&&p.kind==='historical'));}
export function isListed(x,now=new Date()){
  const p=x.price;
  if(x.review?.status==='merged'||!p||p.currency!=='CNY'||priceMid(p)===null||p.min<=0||p.max<p.min)return false;
  if(p.kind==='historical'&&x.review?.status==='pending'){
    const stamp=Date.parse((p.observed_at||'')+'T00:00:00+08:00');
    return Number.isFinite(stamp)&&stamp<=now.getTime();
  }
  if(x.review?.status!=='documented'||!evidenceTier(x,now)||!priceUsable(p,false,now))return false;
  try{const u=new URL(x.price.url);return u.protocol==='https:'&&!u.username&&!u.password;}catch{return false;}
}
export function budgetLabel(p){const n=priceMid(p);return n===null?'价格待核验':BANDS.find(b=>n>=b[2]&&n<b[3])?.[1]||'价格待核验';}
export function parseSearch(q){let max=null;const re=/(?:预算\s*)?(\d+(?:\.\d+)?)\s*(?:元|块|¥)?\s*(?:以下|以内|内|封顶)/;const m=q.match(re);if(m)max=Number(m[1]);return {q:q.replace(re,'').trim(),max};}
// These are evidence/relevance rules, never an asserted product quality score.
export function productURL(x){
  for(const source of x.source?.urls||[]){try{const u=new URL(source.url);if(u.protocol==='https:'&&!u.username&&!u.password)return u.href;}catch{}}
  return '';
}
export function evidenceTier(x,now=new Date()){
  const stamp=Date.parse((x.source?.checked_at||'')+'T00:00:00+08:00');
  const complete=x.review?.status==='documented'&&x.model&&productURL(x)&&Object.keys(x.specs||{}).length&&x.limits?.length&&Number.isFinite(stamp)&&stamp<=now.getTime();
  if(!complete)return 0;
  return now.getTime()-stamp<=180*86400000?2:1;
}
export function preferenceProfile(items,favorites){
  const selected=items.filter(x=>favorites.includes(x.id)&&x.review?.status!=='merged');
  return {categories:new Set(selected.map(x=>x.category)),types:new Set(selected.map(x=>x.type))};
}
export function recommendationReasons(x,s,profile,now=new Date()){
  if(!evidenceTier(x,now))return ['资料待补全，暂不列入优先推荐'];
  const reasons=[evidenceTier(x,now)===2?'型号与来源已核验':'来源资料待复核'];
  if(s.scene&&(x.tags||[]).includes(s.scene))reasons.push('适合'+s.scene);
  if(s.personalized&&profile?.categories.has(x.category))reasons.push('符合收藏品类');
  else if(s.personalized&&profile?.types.has(x.type))reasons.push('与你收藏的分类相关');
  if(priceUsable(x.price,false,now))reasons.push(s.budget||parseSearch(s.q).max!==null?'近期标价符合预算':'有近期人民币标价');
  else reasons.push('规格与适用限制可查');
  return reasons.slice(0,3);
}
export function rankCatalog(xs,s,profile,now=new Date()){
  if(s.valueFirst&&s.sort==='recommended'){
    const affordable=xs.filter(x=>x.price.max<=100),near=xs.filter(x=>x.price.max>100&&x.price.max<=120),rest=xs.filter(x=>x.price.max>120);
    return [...rankCatalog(affordable,{...s,valueFirst:false},profile,now),...rankCatalog(near,{...s,valueFirst:false},profile,now),...rankCatalog(rest,{...s,valueFirst:false},profile,now)];
  }
  const affinity=x=>!s.personalized?0:profile.categories.has(x.category)?2:profile.types.has(x.type)||s.preferredTypes?.includes(x.type)?1:0;
  const completeness=x=>Math.min(Object.keys(x.specs||{}).length,4)+(x.limits?.length?1:0);
  const byEvidence=(a,b)=>evidenceTier(b,now)-evidenceTier(a,now)||Number(priceUsable(b.price,false,now))-Number(priceUsable(a.price,false,now))||completeness(b)-completeness(a)||String(b.source?.checked_at||'').localeCompare(a.source?.checked_at||'')||a.id-b.id;
  if(s.sort!=='recommended')return xs.sort(byEvidence);
  // Diversity penalties apply inside each evidence tier only. Unverified records
  // can never outrank verified ones through personalization or novelty.
  const ranked=[],typeCounts=new Map(),brandCounts=new Map();
  for(const tier of [2,1,0]){
    const pool=xs.filter(x=>evidenceTier(x,now)===tier);
    if(!tier){
      const typeOrder=s.personalized?[...TYPE_ORDER].sort((a,b)=>Number(s.preferredTypes?.includes(b)||profile.types.has(b))-Number(s.preferredTypes?.includes(a)||profile.types.has(a))):TYPE_ORDER;
      const buckets=typeOrder.map(type=>pool.filter(x=>x.type===type).sort((a,b)=>a.id-b.id));
      while(buckets.some(xs=>xs.length))for(const xs of buckets)if(xs.length)ranked.push(xs.shift());
      ranked.push(...pool.filter(x=>!TYPE_ORDER.includes(x.type)).sort((a,b)=>a.id-b.id));continue;
    }
    while(pool.length){
      const priority=x=>affinity(x)*3-(typeCounts.get(x.type)||0)*2-(brandCounts.get(x.brand)||0);
      pool.sort((a,b)=>priority(b)-priority(a)||byEvidence(a,b));
      const x=pool.shift();ranked.push(x);typeCounts.set(x.type,(typeCounts.get(x.type)||0)+1);brandCounts.set(x.brand,(brandCounts.get(x.brand)||0)+1);
    }
  }
  return ranked;
}
export function filterCatalog(items,s,favorites=[],now=new Date()){
  const {q,max}=parseSearch(s.q);const cap=s.max??max;const band=BANDS.find(b=>b[0]===s.budget);
  let xs=items.filter(x=>isListed(x,now)&&(!s.brand||brandKey(x.brand)===s.brand)&&(!s.type||x.type===s.type)&&(!s.group||x.group===s.group)&&(!s.category||x.category===s.category)&&(!s.scene||(x.tags||[]).includes(s.scene))&&(s.scope!=='documented'||x.review.status==='documented')&&(s.scope!=='new'||x.isNew)&&(s.scope!=='pending'||x.review.status==='pending')&&(s.scope!=='favorites'||favorites.includes(x.id)));
  if(s.personalOnly&&s.preferredTypes?.length)xs=xs.filter(x=>s.preferredTypes.includes(x.type));
  if(s.valueMode==='hundred')xs=xs.filter(x=>priceUsable(x.price,s.history,now)&&x.price.max<=100);
  if(s.valueMode==='upgrade')xs=xs.filter(x=>evidenceTier(x,now)>0&&priceUsable(x.price,false,now)&&x.price.max>100&&x.price.max<=300&&x.purchase?.upgrade);
  if(q){const tokens=q.toLowerCase().split(/\s+/);xs=xs.filter(x=>{const h=[x.brand,x.product,x.model,x.type,x.legacy_type,x.group,x.category,x.variant,...x.tags,...Object.values(x.specs)].join(' ').toLowerCase();return tokens.every(t=>h.includes(t));});}
  if(s.priceKind)xs=xs.filter(x=>s.priceKind==='unknown'?x.price.kind==='unknown':s.priceKind==='documented'?x.price.kind==='documented'&&!dated(x.price,now):x.price.kind==='historical');
  if(band||cap!==null)xs=xs.filter(x=>{if(!priceUsable(x.price,s.history,now))return false;const n=priceMid(x.price);return (!band||(n>=band[2]&&n<band[3]))&&(cap===null||x.price.max<=cap);});
  const n=x=>priceUsable(x.price,s.history,now)?priceMid(x.price):null;
  if(['recommended','evidence'].includes(s.sort))return rankCatalog(xs,s,preferenceProfile(items,favorites),now);
  xs.sort((a,b)=>{if(s.sort==='price-asc'||s.sort==='price-desc'){let aa=n(a),bb=n(b);if(aa===null||bb===null)return (aa===null)-(bb===null);return s.sort==='price-asc'?aa-bb:bb-aa;}if(s.sort==='name')return a.product.localeCompare(b.product,'zh-CN');return (b.review.status==='documented')-(a.review.status==='documented')||Number(b.isNew)-Number(a.isNew)||a.id-b.id;});
  return xs;
}
export function comparable(items){return items.length>1&&items.every(x=>x.type===items[0].type&&x.category===items[0].category);}
export function money(p){const n=priceMid(p);return n===null?'待核价':p.min===p.max?'¥'+Number(p.min).toLocaleString('zh-CN'):'¥'+p.min+'–'+p.max;}
