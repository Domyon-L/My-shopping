// Decorative chart-space outlines, not a location- or time-based sky simulation.
export const CONSTELLATIONS=[
  {
    id:'big-dipper',color:'174,219,255',
    stars:[
      {name:'Dubhe',x:.98,y:.04,r:1.65},
      {name:'Merak',x:1,y:.64,r:1.45},
      {name:'Phecda',x:.61,y:.72,r:1.45},
      {name:'Megrez',x:.58,y:.22,r:1.05},
      {name:'Alioth',x:.4,y:.15,r:1.7},
      {name:'Mizar',x:.22,y:.25,r:1.6},
      {name:'Alkaid',x:0,y:.65,r:1.6}
    ],
    edges:[[0,1],[1,2],[2,3],[3,0],[3,4],[4,5],[5,6]]
  },
  {
    id:'aries',color:'208,196,255',
    stars:[
      {name:'41 Arietis',x:0,y:.10,r:1.2},
      {name:'Hamal',x:.7,y:.13,r:1.75,color:'255,223,175'},
      {name:'Sheratan',x:.94,y:.48,r:1.4},
      {name:'Mesarthim',x:1,y:.72,r:1.15}
    ],
    edges:[[0,1],[1,2],[2,3]]
  },
  {id:'cassiopeia',color:'177,199,255',stars:[{x:0,y:.4,r:1.1},{x:.25,y:.8,r:1.3},{x:.48,y:.22,r:1.5},{x:.75,y:.75,r:1.15},{x:1,y:.15,r:1.4}],edges:[[0,1],[1,2],[2,3],[3,4]]},
  {id:'lyra',color:'212,195,245',stars:[{x:.12,y:0,r:1.9},{x:.25,y:.45,r:1},{x:.87,y:.5,r:1.1},{x:.78,y:1,r:1.2},{x:.13,y:.9,r:1}],edges:[[0,1],[1,2],[2,3],[3,4],[4,1]]}
];

export function constellationLayout(width,height,phase=0,travel=0){
  const mobile=width<600,p=Math.max(0,Math.min(1,travel)),zoom=1+p*.12;
  const drift=Math.sin(phase*.22)*Math.min(width,height)*.004;
  return CONSTELLATIONS.map((group,index)=>{
    const big=index===0;
    const size=mobile
      ?Math.min(width*(big?.37:.29),height*(big?.21:.17))
      :Math.min(width*(big?.24:.18),height*(big?.28:.23),big?340:260);
    const anchorX=width*([mobile?.27:.17,mobile?.76:.83,.2,.81][index]);
    const anchorY=height*([mobile?.19:.27,mobile?.29:.3,mobile?.81:.79,mobile?.78:.74][index]);
    const stars=group.stars.map(s=>({
      ...s,
      x:width*.5+(anchorX+(s.x-.5)*size+drift-width*.5)*zoom,
      y:height*.45+(anchorY+(s.y-.38)*size-height*.45)*zoom,
      r:s.r*(mobile?1:1.2)
    }));
    return {...group,stars};
  });
}

export function drawConstellations(ctx,width,height,phase=0,travel=0){
  const groups=constellationLayout(width,height,phase,travel);
  ctx.save();ctx.globalCompositeOperation='screen';ctx.globalAlpha=1;
  ctx.lineCap='round';ctx.lineWidth=width<600?.8:1;
  for(let i=0;i<groups.length;i++){
    const group=groups[i];
    ctx.strokeStyle=`rgba(${group.color},${.24+Math.sin(phase*.65+i)*.025})`;
    ctx.beginPath();
    for(const [from,to]of group.edges){
      const a=group.stars[from],b=group.stars[to];ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);
    }
    ctx.stroke();
    for(let j=0;j<group.stars.length;j++){
      const star=group.stars[j],color=star.color||group.color;
      const alpha=.74+Math.sin(phase*1.4+j*.9+i)*.12;
      const glow=ctx.createRadialGradient(star.x,star.y,0,star.x,star.y,star.r*7);
      glow.addColorStop(0,`rgba(${color},${alpha*.6})`);
      glow.addColorStop(.22,`rgba(${color},${alpha*.15})`);glow.addColorStop(1,`rgba(${color},0)`);
      ctx.fillStyle=glow;ctx.beginPath();ctx.arc(star.x,star.y,star.r*7,0,Math.PI*2);ctx.fill();
      ctx.fillStyle=`rgba(${color},${alpha})`;ctx.beginPath();ctx.arc(star.x,star.y,star.r,0,Math.PI*2);ctx.fill();
      ctx.fillStyle=`rgba(246,251,255,${alpha})`;ctx.beginPath();ctx.arc(star.x,star.y,star.r*.46,0,Math.PI*2);ctx.fill();
    }
  }
  ctx.restore();
}
