import {drawConstellations} from './constellations.ba45722b93c0.mjs';
const TAU=Math.PI*2;

// Bake the distant sky once; nearby stars and constellation light change each frame.
export function createNightSky(width,height,options={}){
  const light=options.light===true,crimson=options.tone==='crimson',factor=options.intensity==='quiet'?.55:options.intensity==='balanced'?.8:1.3;
  const plate=document.createElement('canvas');
  const ratio=Math.min(devicePixelRatio||1,1.35);
  plate.width=Math.round(width*ratio);plate.height=Math.round(height*ratio);
  const ctx=plate.getContext('2d');
  const mobile=width<600;
  const sparks=Array.from({length:Math.round((mobile?28:58)*factor)},()=>({x:Math.random()*width,y:Math.random()*height,r:.5+Math.random()*.9,phase:Math.random()*TAU,depth:.25+Math.random()*.75}));
  if(!ctx)return {plate:null,sparks,light,charts:options.charts!==false};
  ctx.setTransform(ratio,0,0,ratio,0,0);
  const night=ctx.createLinearGradient(0,0,width*.4,height);
  night.addColorStop(0,light?'#f0f5fc':'#020712');night.addColorStop(.45,light?'#f9f6f0':'#08132d');night.addColorStop(1,light?'#f9f6f0':'#030817');
  ctx.fillStyle=night;ctx.fillRect(0,0,width,height);
  ctx.globalCompositeOperation=light?'source-over':'screen';
  const clouds=[
    [.12,.29,.35,.14,'50,80,150',.07],
    [.35,.18,.4,.2,light?'50,72,150':'70,65,170',.2],
    [.72,.35,.35,.19,light?'96,66,156':crimson?'143,43,83':'122,47,178',.23],
    [.88,.58,.32,.25,light?'39,111,149':crimson?'115,39,94':'59,91,177',.14],
    [.52,.44,.27,.15,'122,144,212',.16],
    [.28,.57,.2,.13,'55,112,146',.11]
  ];
  for(const [x,y,rx,ry,color,rawAlpha]of clouds){
    const alpha=rawAlpha*(light?.23:1.5);
    ctx.save();ctx.translate(x*width,y*height);ctx.rotate(-.36);ctx.scale(rx*width,ry*height);
    const glow=ctx.createRadialGradient(0,0,0,0,0,1);
    glow.addColorStop(0,`rgba(${color},${alpha})`);glow.addColorStop(.42,`rgba(${color},${alpha*.55})`);glow.addColorStop(1,`rgba(${color},0)`);
    ctx.fillStyle=glow;ctx.fillRect(-1,-1,2,2);ctx.restore();
  }
  // A diffuse, broken galactic spine is baked with the sky instead of rebuilt per frame.
  if(!light)for(let i=0;i<34;i++){
    const u=i/33,x=u*width,y=height*(.68-u*.49)+Math.sin(u*7)*height*.04,r=Math.min(width,height)*(.06+(i%4)*.012);
    const fog=ctx.createRadialGradient(x,y,0,x,y,r);
    fog.addColorStop(0,`rgba(${crimson?'210,74,122':'130,143,235'},.055)`);fog.addColorStop(.35,`rgba(${crimson?'117,37,86':'83,53,147'},.045)`);fog.addColorStop(1,'rgba(0,0,0,0)');
    ctx.fillStyle=fog;ctx.fillRect(x-r,y-r,r*2,r*2);
  }
  for(let i=0;i<Math.round((mobile?600:1550)*factor);i++){
    const u=Math.random(),spread=(Math.random()+Math.random()+Math.random()-1.5)*height*.13;
    const x=u*width,y=height*(.57-u*.36)+spread;
    const warm=i%11===0;ctx.fillStyle=`rgba(${light?'105,137,178':warm?(crimson?'250,148,177':'205,158,245'):'145,180,231'},${.07+Math.random()*.22})`;
    ctx.fillRect(x,y,.5+Math.random()*.8,.5+Math.random()*.8);
  }
  ctx.globalCompositeOperation='source-over';
  for(let i=0;i<Math.round((mobile?220:550)*factor);i++){
    const x=Math.random()*width,y=Math.random()*height,r=Math.random()<.06?1.1:.25+Math.random()*.55;
    ctx.fillStyle=`rgba(${light?'99,135,172':i%9===0?'250,220,186':'212,228,255'},${.2+Math.random()*.65})`;
    ctx.beginPath();ctx.arc(x,y,r,0,TAU);ctx.fill();
    if(r>1){ctx.fillStyle='rgba(175,207,255,.16)';ctx.beginPath();ctx.arc(x,y,3.4,0,TAU);ctx.fill();}
  }
  return {plate,sparks,light,charts:options.charts!==false};
}

export function paintNightSky(ctx,scene,width,height,phase,travel=0){
  ctx.globalAlpha=1;ctx.globalCompositeOperation='source-over';
  const light=scene.light;ctx.fillStyle=light?'#f9f6f0':'#020712';ctx.fillRect(0,0,width,height);
  if(scene.plate){
    const zoom=1.025+travel*.12,dx=width*(zoom-1)*.5+Math.sin(phase*.22)*width*.005,dy=height*(zoom-1)*.45+Math.cos(phase*.17)*height*.005;
    ctx.drawImage(scene.plate,-dx,-dy,width*zoom,height*zoom);
  }
  ctx.globalCompositeOperation=light?'source-over':'screen';
  if(scene.charts&&!light)drawConstellations(ctx,width,height,phase,travel);
  for(const s of scene.sparks){
    ctx.fillStyle=`rgba(${light?'91,131,172':'222,239,255'},${.25+(.5+.5*Math.sin(phase*2+s.phase))*.55})`;
    const x=s.x+Math.sin(phase*.12+s.phase)*width*.011*s.depth,y=s.y+Math.cos(phase*.10+s.phase)*height*.014*s.depth;
    ctx.beginPath();ctx.arc(x,y,s.r,0,TAU);ctx.fill();
    if(!light&&s.r>1.25){ctx.strokeStyle=`rgba(190,220,255,${.08+(.5+.5*Math.sin(phase+s.phase))*.16})`;ctx.lineWidth=.6;ctx.beginPath();ctx.moveTo(x-3.5,y);ctx.lineTo(x+3.5,y);ctx.moveTo(x,y-3.5);ctx.lineTo(x,y+3.5);ctx.stroke();}
  }
  ctx.globalCompositeOperation='source-over';ctx.globalAlpha=1;
}
