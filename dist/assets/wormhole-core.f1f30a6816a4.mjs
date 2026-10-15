// Stylized cinematic geometry; this is decorative, not a relativistic simulation.
const TAU=Math.PI*2;
const clamp=x=>Math.max(0,Math.min(1,Number.isFinite(x)?x:0));
const smooth=x=>{const p=clamp(x);return p*p*(3-2*p);};

export function wormholeFrame(progress,width,height){
 const p=clamp(progress),w=Math.max(1,Number.isFinite(width)?width:1),h=Math.max(1,Number.isFinite(height)?height:1),short=Math.min(w,h);
 const approach=smooth(p/.52),warp=smooth((p-.22)/.43),radius=short*.235*(1+approach*2.65);
 return {p,w,h,cx:w*.5+Math.sin(p*TAU)*short*.016,cy:h*.43+Math.sin(p*Math.PI)*short*.014,
  radius,core:radius*.41,phase:p*TAU*1.4,holeAlpha:1-smooth((p-.34)/.30),warp,
  travel:p*.35+p*p*1.6,flash:smooth((p-.90)/.10)};
}

export function wormholeMesh(frame,count=18,segments=48){
 const n=Math.max(4,Math.min(24,Math.round(Number.isFinite(count)?count:18))),m=Math.max(12,Math.min(64,Math.round(Number.isFinite(segments)?segments:48))),short=Math.min(frame.w,frame.h);
 return Array.from({length:n},(_,i)=>{
  const z=.045+(((i/n-frame.travel)%1+1)%1)*.955,r=short*.06/z;
  const cx=frame.cx+Math.sin(z*4.5+frame.p*2.1)*short*.06*(1-z),cy=frame.cy+Math.cos(z*3.7+frame.p*1.4)*short*.045*(1-z);
  const turn=frame.p*1.8+(1-z)*2.4,alpha=clamp((1-z)*1.35)*frame.warp;
  const points=Array.from({length:m},(_,j)=>{
   const a=j/m*TAU+turn,distort=1+Math.sin(a*3+z*5+frame.phase)*.035;
   return {x:cx+Math.cos(a)*r*distort,y:cy+Math.sin(a)*r*distort};
  });
  return {z,r,cx,cy,alpha,points};
 }).sort((a,b)=>b.z-a.z);
}

export function paintBlackHole(ctx,f,crimson=false){
 if(f.holeAlpha<.005)return;
 const hot=crimson?'255,95,129':'243,164,255',cool='104,225,255';
 ctx.save();ctx.translate(f.cx,f.cy);ctx.globalAlpha=f.holeAlpha;ctx.globalCompositeOperation='screen';
 const glow=ctx.createRadialGradient(0,0,f.core*.85,0,0,f.radius*1.55);
 glow.addColorStop(0,`rgba(${hot},.22)`);glow.addColorStop(.25,`rgba(${hot},.12)`);glow.addColorStop(.55,'rgba(126,82,237,.08)');glow.addColorStop(1,'rgba(30,20,68,0)');
 ctx.fillStyle=glow;ctx.fillRect(-f.radius*1.6,-f.radius*1.6,f.radius*3.2,f.radius*3.2);
 // Slanted accretion filaments move around the same dark, open core.
 for(let k=0;k<18;k++){
  const r=f.radius*(.66+k*.024),a=f.phase*.7+k*.24;
  ctx.strokeStyle=`rgba(${k%3===0?cool:hot},${.10+(k%4)*.035})`;ctx.lineWidth=k%5===0?2.4:1.05;
  ctx.beginPath();ctx.ellipse(0,0,r,r*.31,-.20,a,a+Math.PI*(.7+(k%3)*.3));ctx.stroke();
 }
 // Orbital dust follows the slanted disk, giving its light a clear direction.
 for(let k=0;k<64;k++){
  const angle=k/64*TAU+f.phase*(.45+(k%5)*.07),r=f.radius*(.65+(k%9)*.041);
  const x=Math.cos(angle)*r,y=Math.sin(angle)*r*.31;
  ctx.save();ctx.rotate(-.20);ctx.strokeStyle=`rgba(${k%4?hot:cool},${.20+(k%3)*.09})`;ctx.lineWidth=.7+(k%4)*.3;
  ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(Math.cos(angle+.025)*r,Math.sin(angle+.025)*r*.31);ctx.stroke();ctx.restore();
 }
 // The bent back of the disk forms a tall lensing arc around the silhouette.
 for(let k=0;k<5;k++){
  ctx.strokeStyle=`rgba(${k%2?cool:hot},${.23-k*.035})`;ctx.lineWidth=1.1+k*.5;
  ctx.beginPath();ctx.ellipse(0,-f.core*.03,f.core*(1.34+k*.025),f.core*(1.46+k*.025),-.06,Math.PI*.98,Math.PI*2.02);ctx.stroke();
 }
 ctx.globalCompositeOperation='source-over';ctx.fillStyle='#010106';ctx.beginPath();ctx.arc(0,0,f.core,0,TAU);ctx.fill();
 const halo=ctx.createRadialGradient(0,0,f.core*.97,0,0,f.core*1.14);
 halo.addColorStop(0,'rgba(0,0,0,0)');halo.addColorStop(.22,'rgba(248,225,255,.82)');halo.addColorStop(.46,`rgba(${hot},.36)`);halo.addColorStop(1,`rgba(${hot},0)`);
 ctx.fillStyle=halo;ctx.beginPath();ctx.arc(0,0,f.core*1.14,0,TAU);ctx.fill();
 ctx.globalCompositeOperation='screen';
 for(let k=0;k<7;k++){
  const r=f.radius*(.73+k*.035);ctx.strokeStyle=`rgba(${k%2?hot:cool},${.48-k*.052})`;ctx.lineWidth=k===2?2.5:1.1;
  ctx.beginPath();ctx.ellipse(0,0,r,r*.32,-.20,0,Math.PI);ctx.stroke();
 }
 // The nearest light band crosses in front of the opaque event horizon.
 ctx.strokeStyle=`rgba(${hot},.72)`;ctx.lineWidth=2.8;ctx.beginPath();ctx.ellipse(0,0,f.radius*.91,f.radius*.16,-.20,.10,Math.PI-.10);ctx.stroke();
 ctx.restore();
}

export function paintWormhole(ctx,f,rings,crimson=false){
 if(f.warp<.003)return;
 ctx.save();ctx.globalCompositeOperation='screen';
 const hot=crimson?'255,92,130':'208,130,255';
 for(let i=0;i<rings.length;i++){
  const ring=rings[i];ctx.strokeStyle=`rgba(${i%3===0?hot:'100,199,255'},${ring.alpha*.38})`;ctx.lineWidth=.45+(1-ring.z)*1.15;
  ctx.beginPath();ring.points.forEach((point,j)=>j?ctx.lineTo(point.x,point.y):ctx.moveTo(point.x,point.y));ctx.closePath();ctx.stroke();
 }
 // Broken energy arcs and moving glints distinguish the tunnel wall from a flat grid.
 for(let i=0;i<rings.length;i++){
  const ring=rings[i],n=ring.points.length,offset=Math.floor((f.p*37+i*5)%n),length=Math.max(3,Math.floor(n*.15));
  ctx.strokeStyle=`rgba(${i%2?hot:'153,230,255'},${ring.alpha*.68})`;ctx.lineWidth=.8+(1-ring.z)*1.8;
  ctx.beginPath();for(let j=0;j<length;j++){const a=ring.points[(offset+j)%n];if(j)ctx.lineTo(a.x,a.y);else ctx.moveTo(a.x,a.y);}ctx.stroke();
  for(let k=0;k<3;k++){const point=ring.points[(offset+k*Math.floor(n/3))%n];ctx.fillStyle=`rgba(202,233,255,${ring.alpha*.58})`;ctx.beginPath();ctx.arc(point.x,point.y,.6+(1-ring.z)*1.7,0,TAU);ctx.fill();}
 }
 // Continuous helical rails reveal depth and curvature rather than flat rings.
 for(let j=0;j<16;j++){
  ctx.strokeStyle=`rgba(${j%3===0?hot:'110,227,255'},${f.warp*(j%4===0?.25:.12)})`;ctx.lineWidth=j%4===0?1.2:.65;ctx.beginPath();
  rings.forEach((ring,i)=>{const point=ring.points[Math.floor(j/16*ring.points.length)];if(i)ctx.lineTo(point.x,point.y);else ctx.moveTo(point.x,point.y);});ctx.stroke();
 }
 const rim=ctx.createRadialGradient(f.cx,f.cy,0,f.cx,f.cy,Math.min(f.w,f.h)*.2);
 rim.addColorStop(0,'rgba(11,8,26,0)');rim.addColorStop(.5,`rgba(${hot},.06)`);rim.addColorStop(1,'rgba(33,24,60,0)');ctx.fillStyle=rim;ctx.fillRect(0,0,f.w,f.h);
 ctx.restore();
}
