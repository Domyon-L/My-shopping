import {brandKey} from './brand-keys.d90428947558.mjs';
import {isListed,evidenceTier,priceUsable} from './catalog-core.34704ae06033.mjs';
export {brandKey};
export function validBrandPick(pick,items,now=new Date()){
 const selected=items.find(x=>x.id===pick.product_id);
 const eligible=x=>x&&isListed(x,now)&&evidenceTier(x,now)>0&&priceUsable(x.price,false,now)&&brandKey(x.brand)===brandKey(pick.brand)&&x.category===pick.category;
 return eligible(selected)&&pick.claim_scope==='compared_models'&&pick.reason&&pick.scope&&pick.criteria?.length&&pick.limitations?.length&&pick.alternatives?.length&&pick.alternatives.every(a=>eligible(items.find(x=>x.id===a.product_id))&&a.tradeoff);
}
export function brandDirectory(items,picks=[],query='',now=new Date()){
 const groups=new Map();
 for(const x of items.filter(x=>isListed(x,now))){const key=brandKey(x.brand);if(!groups.has(key))groups.set(key,{key,label:x.brand,count:0,documented:0,picks:[]});const g=groups.get(key);g.count++;if(evidenceTier(x,now)&&priceUsable(x.price,false,now))g.documented++;}
 for(const p of picks){const g=groups.get(brandKey(p.brand));if(g&&validBrandPick(p,items,now)){g.label=p.brand;g.picks.push(p);}}
 const q=brandKey(query);
 return [...groups.values()].filter(g=>!query||g.key.includes(q)||g.label.toLowerCase().includes(query.toLowerCase())).sort((a,b)=>Number(!!b.picks.length)-Number(!!a.picks.length)||a.label.localeCompare(b.label,'zh-CN'));
}
