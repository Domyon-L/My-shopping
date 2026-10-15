// Query aliases describe shopping vocabulary; they never change product facts.
const groups=[
 {keys:['裤子','裤装','pants','trousers'],matches:['长裤','短裤','休闲裤','牛仔裤','运动裤','工装裤','西裤']},
 {keys:['衣服','衣裳','服装'],matches:['T恤','Polo衫','衬衫','卫衣','针织衫','夹克','棉服','羽绒服','防晒衣','背心','外套','家居服','睡衣']},
 {keys:['鞋子','鞋履'],matches:['跑步鞋','板鞋','凉鞋','拖鞋','篮球鞋','运动鞋']},
 {keys:['袜子','袜'],matches:['袜']},
 {keys:['牛仔裤','jeans'],matches:['牛仔裤']},
 {keys:['运动裤'],matches:['运动裤','运动长裤','运动束脚裤','训练长裤']},
 {keys:['长裤'],matches:['长裤','休闲裤','牛仔裤','工装裤','西裤','束脚裤','锥形裤']},
 {keys:['t恤','t-shirt','tshirt','体恤'],matches:['T恤']},
 {keys:['充电宝','移动电源'],matches:['充电宝','移动电源']},
 {keys:['充电头','充电器','电源适配器'],matches:['充电头','充电器','电源适配器']},
 {keys:['插线板','排插','接线板'],matches:['插线板','排插','接线板']},
 {keys:['u盘','优盘','usb闪存盘'],matches:['U盘','闪存盘','U盘存储']},
 {keys:['洗面奶','洗面乳','洁面乳'],matches:['洗面奶','洗面乳','洁面乳','洁面泡沫','洁面啫喱','洁面']},
 {keys:['洗发水','洗发液','洗发露'],matches:['洗发水','洗发液','洗发露']},
 {keys:['纸巾','面巾纸'],matches:['抽纸','卷纸','面巾纸','纸巾']},
 {keys:['卫生纸','卷纸'],matches:['卫生纸','卷纸']},
 {keys:['抽纸'],matches:['抽纸','盒装面巾纸']},
 {keys:['饭盒','便当盒','餐盒'],matches:['饭盒','便当盒','餐盒']},
 {keys:['水瓶','水壶'],matches:['水瓶','水壶','运动水壶']},
 {keys:['水杯','杯子'],matches:['水杯','保温杯','随行杯','水壶','杯子']},
 {keys:['收纳盒','储物盒'],matches:['收纳盒','储物盒','收纳箱']},
 {keys:['雨伞','伞'],matches:['雨伞','遮阳伞']},
 {keys:['男款','男式','男生','男士'],matches:['男士','男款','男式'],extra:true},
 {keys:['女款','女式','女生','女士'],matches:['女士','女款','女式'],extra:true},
 {keys:['耐克','nike'],matches:['Nike','耐克']},
 {keys:['宜家','ikea'],matches:['IKEA','宜家']},
 {keys:['无印良品','muji'],matches:['MUJI','无印良品']},
 {keys:['卡西欧','casio'],matches:['CASIO','卡西欧']},
 {keys:['苹果','apple'],matches:['Apple','苹果']},
 {keys:['迪卡侬','decathlon'],matches:['迪卡侬','Decathlon']},
 {keys:['阿迪达斯','adidas'],matches:['阿迪达斯','adidas']},
 {keys:['安踏','anta'],matches:['安踏','ANTA']},
 {keys:['优衣库','uniqlo'],matches:['优衣库','UNIQLO']}
];
export const normalizeSearch=value=>String(value??'').normalize('NFKC').toLowerCase().replace(/[‐‑‒–—−]/g,'-').replace(/\s+/g,' ').trim();
const compact=value=>normalizeSearch(value).replace(/[^\p{L}\p{N}]/gu,'');
const aliases=new Map(groups.flatMap(g=>g.keys.map(k=>[normalizeSearch(k),{...g,matches:g.matches.map(normalizeSearch)}])));
const fillers=new Set(['我想买','我想找','帮我找','帮我买','给我推荐','帮我推荐','帮我选','想买','想找','买点','买个','推荐','购买','一个','一件','一条','一双','一款','一些','适合','的']);
const lexicons=new WeakMap();
export function parseSearch(value){
 let q=String(value??'').normalize('NFKC'),caps=[];
 const amount='(\\d+(?:\\.\\d+)?)',currency='(?:元|块钱?|人民币)?';
 const patterns=[new RegExp('(?:预算\\s*)?[¥￥]?\\s*'+amount+'\\s*'+currency+'\\s*(?:以下|以内|内|封顶)','g'),new RegExp('(?:预算\\s*)?(?:不超过|不高于|最多|<=|≤)\\s*[¥￥]?\\s*'+amount+'\\s*'+currency,'g')];
 for(const re of patterns)q=q.replace(re,(whole,n)=>{const cap=Number(n);if(!Number.isFinite(cap))return whole;caps.push(cap);return ' ';});
 return {q:q.replace(/\s+/g,' ').trim(),max:caps.length?Math.min(...caps):null};
}
function lexicon(items){
 if(lexicons.has(items))return lexicons.get(items);
 const words=new Set([...aliases.keys(),...fillers,'运动','休闲','通勤','办公','学生','宿舍','户外','桌面','儿童','婴童','速干','纯棉','直筒','宽松','保温','蓝牙','无线','有线']);
 for(const x of items)for(const value of [x.brand,x.model,x.type,x.legacy_type,x.group,x.category,...(x.tags||[])]){
  const word=normalizeSearch(value);if(word)words.add(word);
  for(const part of word.match(/[\p{Script=Han}]+/gu)||[])if(part.length>1)words.add(part);
 }
 const index=new Map();
 for(const word of words){const first=word[0];if(!index.has(first))index.set(first,[]);index.get(first).push(word);}
 for(const words of index.values())words.sort((a,b)=>b.length-a.length);
 lexicons.set(items,index);return index;
}
export function searchTerms(value,items=[]){
 const text=normalizeSearch(parseSearch(value).q),index=lexicon(items),terms=[],best=Array(text.length+1);let unknown='';
 best[text.length]={unknown:0,count:0};
 // Prefer a complete known-word path: 运动 + 裤子 beats 运动裤 + 子.
 for(let i=text.length-1;i>=0;i--){
  const c=text[i],tail=best[i+1];
  if(/[\s,，。;；:：!?！？()（）]/.test(c)){best[i]={unknown:tail.unknown,count:tail.count,part:null,next:i+1};continue;}
  let choice={unknown:tail.unknown+1,count:tail.count+1,part:{text:c,unknown:true},next:i+1};
  const candidates=(index.get(c)||[]).filter(word=>text.startsWith(word,i));
  const latin=text.slice(i).match(/^[a-z0-9]+(?:[-+./°][a-z0-9]+)*/);if(latin)candidates.push(latin[0]);
  for(const word of candidates){const next=best[i+word.length],candidate={unknown:next.unknown,count:next.count+1,part:{text:word},next:i+word.length};if(candidate.unknown<choice.unknown||candidate.unknown===choice.unknown&&candidate.count<choice.count)choice=candidate;}
  best[i]=choice;
 }
 const flush=()=>{if(unknown){terms.push(unknown);unknown='';}};
 for(let i=0;i<text.length;i=best[i].next){const part=best[i].part;if(part?.unknown)unknown+=part.text;else{flush();if(part&&!fillers.has(part.text))terms.push(part.text);}}
 flush();return [...new Set(terms)];
}
export function createSearchMatcher(items,value){
 const parsed=parseSearch(value),query=normalizeSearch(parsed.q),terms=searchTerms(parsed.q,items);
 const cache=new WeakMap();
 function score(x){
  if(cache.has(x))return cache.get(x);
  const fields=[[x.product,72],[x.model,70],[x.category,60],[x.brand,55],[x.variant,38],[x.group,25],[x.type,12],[x.legacy_type,12]].map(([text,weight])=>({text:normalizeSearch(text),compact:compact(text),weight}));
  const extra=normalizeSearch([...(x.tags||[]),...(x.fit||[]),...Object.values(x.specs||{})].join(' '));
  let total=0;
  for(const term of terms){
   let best=0;const alias=aliases.get(term),spellings=[term,...(alias?.matches||[])];
   for(const spelling of new Set(spellings)){
    const joined=compact(spelling);
    for(const f of fields)if(f.text.includes(spelling)||(joined&&f.compact.includes(joined)))best=Math.max(best,f.weight-(spelling===term?0:5));
    if((!alias||alias.extra)&&extra.includes(spelling))best=Math.max(best,10);
   }
   if(!best){cache.set(x,0);return 0;}total+=best;
  }
  // Unknown meaningful words stay mandatory; no unrelated fallback products.
  if(query&&!terms.length){cache.set(x,0);return 0;}
  if(query&&fields.slice(0,2).some(f=>f.text===query||f.compact===compact(query)))total+=1000;
  cache.set(x,terms.length?total:1);return cache.get(x);
 }
 return {...parsed,terms,score};
}
