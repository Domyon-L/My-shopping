export const PERSONAL_TYPES=['数码科技','家居生活','服饰穿搭','运动户外','学习办公','玩具潮玩'];
export const PERSONAL_SCENES=['','办公','学生','宿舍','通勤','桌面','运动','户外'];
export function normalizePreferences(raw={}){
  const x=raw&&typeof raw==='object'&&!Array.isArray(raw)?raw:{};
  return {nickname:typeof x.nickname==='string'?x.nickname.trim().slice(0,18):'',budget:[50,100,120,200,300].includes(x.budget)?x.budget:100,
    interests:Array.isArray(x.interests)?[...new Set(x.interests.filter(v=>PERSONAL_TYPES.includes(v)))].slice(0,6):[],
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
  const terms=q.trim().toLowerCase().split(/\s+/).filter(Boolean);if(!terms.length)return [];
  return items.filter(x=>terms.every(t=>[x.product,x.brand,x.model,x.category].join(' ').toLowerCase().includes(t)))
    .sort((a,b)=>Number(withinBudget(b))-Number(withinBudget(a))||a.id-b.id).slice(0,limit);
}
