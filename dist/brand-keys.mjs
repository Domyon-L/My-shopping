export function brandKey(value){
 const v=String(value||'').normalize('NFKC').trim().toLowerCase().replace(/\s+/g,'');
 if(/ikea|宜家/.test(v))return 'ikea';
 if(/casio|卡西欧/.test(v))return 'casio';
 if(/nike|耐克/.test(v))return 'nike';
 if(/muji|无印良品/.test(v))return 'muji';
 if(/apple|苹果/.test(v))return 'apple';
 return v;
}
