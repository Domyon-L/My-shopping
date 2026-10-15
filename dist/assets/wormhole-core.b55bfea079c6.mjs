// A decorative cinematic passage, not a relativistic simulation.
// Geometry uses the caller's progress; this module owns no clock.
const TAU=Math.PI*2;
const clamp=x=>Math.max(0,Math.min(1,Number.isFinite(x)?x:0));
const smooth=x=>{const p=clamp(x);return p*p*(3-2*p);};
const wrap=x=>((x%1)+1)%1;
const extent=x=>Math.max(1,Math.min(16384,Number.isFinite(x)?x:1));

export function wormholeFrame(progress,width,height){
 const p=clamp(progress),w=extent(width),h=extent(height),short=Math.min(w,h);
 const approach=smooth(p/.52),warp=smooth((p-.22)/.43),radius=short*.235*(1+approach*2.65);
 return {p,w,h,cx:w*.5+Math.sin(p*TAU)*short*.025,cy:h*.43+Math.sin(p*Math.PI)*short*.021,
  radius,core:radius*.385,phase:p*TAU*1.4,holeAlpha:1-smooth((p-.34)/.30),warp,
  travel:p*.35+p*p*1.6,flash:smooth((p-.88)/.12)*.42};
}

// All wall elements share this curved axis and angular coordinate.
function wallPoint(frame,z,angle){
 const short=Math.min(frame.w,frame.h),depth=1-z,r=short*.062/z;
 const bend=depth*short*.115*Math.sin(z*3.2+frame.phase*.15);
 const lift=depth*short*.075*Math.cos(z*2.6+frame.phase*.12);
 const cx=frame.cx+bend,cy=frame.cy+lift,turn=frame.p*1.8+depth*4.4;
 const a=angle+turn,distort=1+Math.sin(a*3+z*5+frame.phase)*.025;
 const x=Math.cos(a)*r*distort,y=Math.sin(a)*r*(.79+z*.21)*distort;
 const tilt=.13*Math.sin(z*2.6+frame.p*.8),c=Math.cos(tilt),s=Math.sin(tilt);
 return {x:cx+x*c-y*s,y:cy+x*s+y*c,cx,cy,r};
}

export function wormholeMesh(frame,count=18,segments=48){
 const n=Math.max(4,Math.min(24,Math.round(Number.isFinite(count)?count:18))),m=Math.max(12,Math.min(64,Math.round(Number.isFinite(segments)?segments:48)));
 return Array.from({length:n},(_,i)=>{
  const z=.045+wrap(i/n-frame.travel)*.955,axis=wallPoint(frame,z,0);
  const alpha=clamp((1-z)*1.35)*smooth((z-.045)/.08)*frame.warp;
  const points=Array.from({length:m},(_,j)=>{const q=wallPoint(frame,z,j/m*TAU);return {x:q.x,y:q.y};});
  return {z,r:axis.r,cx:axis.cx,cy:axis.cy,alpha,points};
 }).sort((a,b)=>b.z-a.z);
}

export function paintBlackHole(ctx,f,crimson=false){
 if(f.holeAlpha<.005)return;
 const hot=crimson?'255,105,137':'222,146,255',cool='113,220,255',pearl='230,225,255';
 ctx.save();ctx.translate(f.cx,f.cy);ctx.globalAlpha=f.holeAlpha;ctx.globalCompositeOperation='screen';
 const glow=ctx.createRadialGradient(0,0,f.core*.9,0,0,f.radius*1.48);
 glow.addColorStop(0,'rgba(0,0,0,0)');glow.addColorStop(.23,`rgba(${hot},.11)`);glow.addColorStop(.52,'rgba(92,72,179,.07)');glow.addColorStop(1,'rgba(18,15,46,0)');
 ctx.fillStyle=glow;ctx.fillRect(-f.radius*1.5,-f.radius*1.5,f.radius*3,f.radius*3);
 ctx.save();ctx.rotate(-.23);
 // Broad dim bands support sharp filaments instead of equally bright circles.
 for(let k=0;k<8;k++){
  const r=f.radius*(.57+k*.078);
  ctx.strokeStyle=`rgba(${k<3?cool:hot},${.022+(7-k)*.003})`;ctx.lineWidth=f.radius*(.10-k*.006);
  ctx.beginPath();ctx.ellipse(0,0,r,r*.225,0,0,TAU);ctx.stroke();
 }
 for(let k=0;k<18;k++){
  const r=f.radius*(.56+k*.034),phase=f.phase*(.36+k*.012)+k*.46;
  ctx.strokeStyle=`rgba(${k%4===0?cool:hot},${.075+(k%5)*.018})`;ctx.lineWidth=.65+(k%4)*.38;
  ctx.beginPath();ctx.ellipse(0,0,r,r*.225,0,phase,phase+Math.PI*(.82+(k%3)*.32));ctx.stroke();
 }
 // A lighter near side and a restrained cyan crest establish disk depth.
 const front=ctx.createLinearGradient(-f.radius,0,f.radius,0);
 front.addColorStop(0,`rgba(${hot},.10)`);front.addColorStop(.37,`rgba(${hot},.42)`);front.addColorStop(.70,`rgba(${cool},.58)`);front.addColorStop(1,`rgba(${cool},.06)`);
 for(let k=0;k<7;k++){
  const r=f.radius*(.65+k*.052);ctx.strokeStyle=front;ctx.lineWidth=k===3?2.4:.85;
  ctx.beginPath();ctx.ellipse(0,0,r,r*.225,0,.02,Math.PI-.02);ctx.stroke();
 }
 for(let k=0;k<48;k++){
  const angle=k/48*TAU+f.phase*(.40+(k%5)*.065),r=f.radius*(.59+(k%11)*.046),tail=.018+(k%4)*.006;
  ctx.strokeStyle=`rgba(${k%5===0?pearl:k%3===0?cool:hot},${.15+(k%4)*.055})`;ctx.lineWidth=.55+(k%4)*.25;
  ctx.beginPath();ctx.moveTo(Math.cos(angle)*r,Math.sin(angle)*r*.225);ctx.lineTo(Math.cos(angle+tail)*r,Math.sin(angle+tail)*r*.225);ctx.stroke();
 }
 ctx.restore();
 // A separate upper lensing arch rises from behind the inclined disk.
 for(let k=0;k<7;k++){
  ctx.strokeStyle=`rgba(${k%3===0?cool:hot},${.34-k*.038})`;ctx.lineWidth=k===1?2.1:.75+k*.12;
  ctx.beginPath();ctx.ellipse(0,-f.core*.025,f.core*(1.10+k*.029),f.core*(1.23+k*.037),-.035,Math.PI*.99,Math.PI*2.01);ctx.stroke();
 }
 // The opaque shadow is the final disk layer; no filament crosses its centre.
 ctx.globalCompositeOperation='source-over';ctx.fillStyle='#010106';ctx.beginPath();ctx.arc(0,0,f.core,0,TAU);ctx.fill();
 const rim=ctx.createRadialGradient(0,0,f.core,0,0,f.core*1.13);
 rim.addColorStop(0,'rgba(0,0,0,0)');rim.addColorStop(.13,`rgba(${pearl},.55)`);rim.addColorStop(.35,`rgba(${hot},.25)`);rim.addColorStop(1,`rgba(${hot},0)`);
 ctx.fillStyle=rim;ctx.beginPath();ctx.arc(0,0,f.core*1.13,0,TAU);ctx.fill();
 ctx.restore();
}

export function paintWormhole(ctx,f,rings,crimson=false){
 if(f.warp<.003||!rings.length)return;
 ctx.save();ctx.globalCompositeOperation='screen';
 const hot=crimson?'255,100,139':'208,136,255',cool='110,210,255';
 // Translucent ribbons occupy the wall between sections, capped at 8 sectors.
 for(let i=0;i<rings.length-1;i++){
  const far=rings[i],near=rings[i+1],n=Math.min(far.points.length,near.points.length),alpha=Math.min(far.alpha,near.alpha);
  for(let j=0;j<8;j++){
   const a=Math.floor(j/8*n),b=Math.floor((j+.42)/8*n)%n;
   ctx.fillStyle=`rgba(${j%3===0?hot:cool},${alpha*(j%2?.026:.016)})`;ctx.beginPath();
   ctx.moveTo(far.points[a].x,far.points[a].y);ctx.lineTo(far.points[b].x,far.points[b].y);ctx.lineTo(near.points[b].x,near.points[b].y);ctx.lineTo(near.points[a].x,near.points[a].y);ctx.closePath();ctx.fill();
  }
 }
 for(let i=0;i<rings.length;i++){
  const ring=rings[i],n=ring.points.length,offset=Math.floor(wrap(f.p*.8+i*.137)*n),length=Math.max(3,Math.floor(n*.14));
  ctx.strokeStyle=`rgba(${i%3===0?hot:cool},${ring.alpha*.16})`;ctx.lineWidth=.45+(1-ring.z)*.75;
  ctx.beginPath();ring.points.forEach((point,j)=>j?ctx.lineTo(point.x,point.y):ctx.moveTo(point.x,point.y));ctx.closePath();ctx.stroke();
  ctx.strokeStyle=`rgba(${i%2?hot:'166,230,255'},${ring.alpha*.48})`;ctx.lineWidth=.75+(1-ring.z)*1.5;
  ctx.beginPath();for(let j=0;j<length;j++){const point=ring.points[(offset+j)%n];if(j)ctx.lineTo(point.x,point.y);else ctx.moveTo(point.x,point.y);}ctx.stroke();
 }
 // Fixed angular coordinates through winding sections create helical rails.
 for(let j=0;j<16;j++){
  ctx.strokeStyle=`rgba(${j%4===0?hot:cool},${f.warp*(j%4===0?.23:.10)})`;ctx.lineWidth=j%4===0?1.25:.6;ctx.beginPath();
  rings.forEach((ring,i)=>{const point=ring.points[Math.floor(j/16*ring.points.length)];if(i)ctx.lineTo(point.x,point.y);else ctx.moveTo(point.x,point.y);});ctx.stroke();
 }
 // Short light trails follow the curved wall toward its vanishing point.
 // Fade at both depth boundaries rather than popping in or out of view.
 for(let k=0;k<40;k++){
  const z=.055+wrap(k*.61803398875+f.travel*.72)*.91,angle=k/40*TAU;
  const alpha=smooth((z-.055)/.12)*smooth((.965-z)/.19)*f.warp;
  ctx.strokeStyle=`rgba(${k%5===0?hot:'181,228,255'},${alpha*.59})`;ctx.lineWidth=.65+(1-z)*1.25;ctx.beginPath();
  for(let j=0;j<6;j++){const q=wallPoint(f,Math.max(.045,z-(5-j)*.0045),angle);if(j)ctx.lineTo(q.x,q.y);else ctx.moveTo(q.x,q.y);}ctx.stroke();
 }
 // Soft local entry light leaves the far aperture dark, with no white flash.
 const short=Math.min(f.w,f.h),aperture=wallPoint(f,.98,0),glow=ctx.createRadialGradient(aperture.cx,aperture.cy,short*.027,aperture.cx,aperture.cy,short*.24);
 glow.addColorStop(0,'rgba(2,3,12,0)');glow.addColorStop(.30,`rgba(${hot},${f.warp*.07})`);glow.addColorStop(.63,`rgba(${cool},${f.warp*.035})`);glow.addColorStop(1,'rgba(10,15,40,0)');
 ctx.fillStyle=glow;ctx.fillRect(0,0,f.w,f.h);ctx.restore();
}
