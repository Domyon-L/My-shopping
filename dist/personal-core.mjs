import {DAILY_TYPES,LEGACY_INTEREST_TYPES} from './taxonomy-core.mjs';
import {filterCatalog,freshState} from './catalog-core.mjs';
export const PERSONAL_TYPES=DAILY_TYPES;
export const PERSONAL_SCENES=['','办公','学生','宿舍','通勤','桌面','运动','户外'];
export function normalizePreferences(raw={}){
  const x=raw&&typeof raw==='object'&&!Array.isArray(raw)?raw:{};
  const selected=Array.isArray(x.interests)?x.interests.filter(v=>typeof v==='string'):[];
  const old=Array.isArray(x.legacy_interests)?x.legacy_interests.filter(v=>Object.hasOwn(LEGACY_INTEREST_TYPES,v)):x.schema_version===21?[]:selected.filter(v=>Object.hasOwn(LEGACY_INTEREST_TYPES,v));
  const migrated=x.schema_version===21?selected:selected.flatMap(v=>LEGACY_INTEREST_TYPES[v]||[v]);
  return {schema_version:21,legacy_interests:[...new Set(old)],nickname:typeof x.nickname==='string'?x.nickname.trim().slice(0,18):'',budget:[50,100,120,200,300].includes(x.budget)?x.budget:100,
    interests:[...new Set(migrated.filter(v=>PERSONAL_TYPES.includes(v)))].slice(0,12),
    scene:PERSONAL_SCENES.includes(x.scene)?x.scene:'',accent:['blue','violet','coral'].includes(x.accent)?x.accent:'blue',
    cosmicTone:['galaxy','crimson'].includes(x.cosmicTone)?x.cosmicTone:'galaxy',
    intensity:['quiet','balanced','rich'].includes(x.intensity)?x.intensity:'rich'};
}
export function withinBudget(x,cap=100){return x?.price?.currency==='CNY'&&Number.isFinite(x.price.max)&&x.price.max<=cap&&x.price.min>0;}
export function upgradeReason(x){return x.review?.status==='documented'&&typeof x.purchase?.upgrade==='string'&&x.purchase.upgrade.trim()?x.purchase.upgrade:null;}
export function personalMatch(x,prefs,favorites=[],items=[]){
  const types=new Set([...prefs.interests,...items.filter(v=>favorites.includes(v.id)).map(v=>v.type)]);
  return (!types.size||types.has(x.type))&&(!prefs.scene||(x.tags||[]).includes(prefs.scene));
}
export function suggestions(items,q,limit=5){
  if(!q.trim())return [];
  return filterCatalog(items,{...freshState(),q,valueFirst:true}).slice(0,limit);
}
