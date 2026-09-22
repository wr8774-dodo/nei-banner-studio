'use strict';
Object.assign(bg,{cloudColor:'#ffffff',cloudSize:100,cloudDensity:55,cloudLayout:'full',cloudSoftness:35,cloudPixel:8,cloudSeed:7319});
const beforeCloudBackground=background,beforeCloudSync=syncBg;
let cloudCache=null;
function cloudRandom(seed){let n=seed>>>0;return ()=>{n=(Math.imul(1664525,n)+1013904223)>>>0;return n/4294967296;};}
function cloudTexture(w,h,b){
 const pixel=b.mode==='cloudPixel',step=pixel?Math.max(2,b.cloudPixel||8):1;
 const ratio=pixel?Math.min(1/step,2048/w,1200/h):Math.min(1,1600/w,1000/h);
 const width=Math.max(1,Math.ceil(w*ratio)),height=Math.max(1,Math.ceil(h*ratio));
 const key=JSON.stringify([width,height,pixel,b.cloudColor,b.cloudSize,b.cloudDensity,b.cloudSoftness,b.cloudSeed,b.cloudLayout]);
 if(cloudCache?.key===key)return cloudCache.canvas;
 const out=document.createElement('canvas');out.width=width;out.height=height;const c=out.getContext('2d'),r=cloudRandom(b.cloudSeed||7319),size=(b.cloudSize||100)/100,full=b.cloudLayout==='full',count=b.cloudDensity===0?0:Math.round((full?3:4)+(b.cloudDensity??55)*(full?.32:.2));
 // Overlapping lobes extend beyond the edges; a repeatable seed prevents flicker.
 for(let i=0;i<count;i++){
  const columns=Math.ceil(count/3),x=full?((i%columns+.2+r()*.6)/columns)*width:(i/(count-1)*1.2-.1)*width+(r()-.5)*width/count;
  const lower=i%4!==0,baseY=full?height*((Math.floor(i/columns)+r()*.9)/3):lower?height*(.98+r()*.23):height*(-.26+r()*.12);
  const rx=height*(.35+r()*.65)*size*(full?.72:1),ry=height*(.14+r()*.2)*size*(full?.85:1);
  c.save();c.globalAlpha=full?.88+r()*.12:.6+r()*.35;c.fillStyle=b.cloudColor||'#ffffff';
  c.filter=pixel?'none':`blur(${Math.max(.1,(b.cloudSoftness??35)/100*height*.13)}px)`;
  c.beginPath();
  for(let j=0;j<8;j++){const px=x+(j-3.5)*rx*.24,py=baseY+(r()-.5)*ry*.6,ax=rx*(.22+r()*.13),ay=ry*(.5+r()*.7);c.moveTo(px+ax,py);c.ellipse(px,py,ax,ay,0,0,Math.PI*2);}
  c.fill();c.restore();
 }
 cloudCache={key,canvas:out};return out;
}
background=function(c,w,h,b){
 if(!['cloud','cloudPixel'].includes(b.mode)||b.image)return beforeCloudBackground(c,w,h,b);
 beforeCloudBackground(c,w,h,{...b,mode:'linear',angle:90,stops:[{color:b.color1,pos:0},{color:b.color2,pos:100}]});if(b.transparent)return;
 const pad=h*b.margin/100,inner=h-pad*2;if(inner<=0)return;
 c.save();c.beginPath();c.rect(0,pad,w,inner);c.clip();c.filter=`hue-rotate(${b.hue}deg) saturate(${b.saturation}%) brightness(${b.brightness}%)`;c.imageSmoothingEnabled=b.mode!=='cloudPixel';c.drawImage(cloudTexture(w,inner,b),0,pad,w,inner);c.restore();
};
syncBg=function(){beforeCloudSync();const active=['cloud','cloudPixel'].includes(bg.mode)&&!bg.image;$('cloudControls').hidden=!active;$('cloudLayout').value=bg.cloudLayout||'edges';$('cloudPixelWrap').hidden=bg.mode!=='cloudPixel';$('cloudSoftnessWrap').hidden=bg.mode==='cloudPixel';for(const k of ['cloudColor','cloudSize','cloudDensity','cloudSoftness','cloudPixel'])$(k).value=bg[k];};
const beforeCloudMode=$('bgMode').onchange;
$('bgMode').onchange=()=>{beforeCloudMode();if(['cloud','cloudPixel'].includes(bg.mode)&&!bg.cloudInitialized){bg.cloudInitialized=true;bg.color1='#73b9df';bg.color2='#d6eafa';}syncBg();draw();};
for(const k of ['cloudColor','cloudSize','cloudDensity','cloudSoftness','cloudPixel'])bindHistoryInput($(k),()=>{bg[k]=k==='cloudColor'?$(k).value:Number($(k).value);draw();});
$('cloudLayout').onchange=()=>{remember();bg.cloudLayout=$('cloudLayout').value;draw();};
$('shuffleClouds').onclick=()=>{if(busy)return;remember();bg.cloudSeed=Math.floor(Math.random()*4294967295);draw();};
syncBg();draw();
