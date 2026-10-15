export const PORTAL_MS=1500;
export function normalizePortalDuration(value){
  if(typeof value!=='number'||!Number.isFinite(value))return PORTAL_MS;
  return Math.round(Math.max(500,Math.min(3000,value))/100)*100;
}
export const PET_SIZE=128;
export function projectTunnel(seed,progress,width,height){
  const p=Math.max(0,Math.min(1,progress));
  const travel=p*.28+p*p*1.22;
  const z=.08+(((seed.z-travel)%1+1)%1)*.92;
  const focal=Math.min(width,height)*.82;
  const cx=width*.5+Math.sin(p*Math.PI*2)*width*.012,cy=height*.45+Math.sin(p*Math.PI)*height*.014;
  const angle=(seed.angle||0)+p*.22,cos=Math.cos(angle),sin=Math.sin(angle);
  const sx=seed.x*cos-seed.y*sin,sy=seed.x*sin+seed.y*cos;
  const tailZ=z+.018+p*p*.13;
  return {x:cx+sx*focal/z,y:cy+sy*focal/z,tailX:cx+sx*focal/tailZ,tailY:cy+sy*focal/tailZ,size:Math.min(width<600?74:110,12/z),alpha:Math.min(1,(1-z)*2.3),rotation:angle,z,cx,cy};
}
export function clampPetPosition(x,y,width,height,size=PET_SIZE){
  return {x:Math.min(Math.max(8,Number.isFinite(x)?x:8),Math.max(8,width-size-8)),y:Math.min(Math.max(8,Number.isFinite(y)?y:8),Math.max(8,height-size-8))};
}
export function portalURL(raw){try{const u=new URL(raw);return u.protocol==='https:'&&!u.username&&!u.password?u.href:null;}catch{return null;}}
