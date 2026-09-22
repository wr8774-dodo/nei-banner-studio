'use strict';
// Editable cloud geometry: cached per layer, reused by preview and full-resolution export.
const cloudLayerCache=new Map(),cloudAssetBefore=drawAsset;
const cloudPalettes={lavender:['#caa5ef','#dfbff6','#ead5fa','#f9f1ff','#fffaff'],pink:['#efa5c6','#f4bbd3','#f8d5df','#fff1ed'],sky:['#b9d8ed','#d7e7f2','#edf4fa','#ffffff']};
let stackLayout='full';
let stackColors=[...cloudPalettes.lavender];
function chosenCloudColors(){return [...stackColors];}
function cloudLayerTexture(x){
 const pixel=x.cloudPixel>0,step=pixel?x.cloudPixel:1,w=Math.min(1000,Math.max(20,Math.round(x.w/step))),h=Math.min(600,Math.max(20,Math.round(x.h/step)));
 const key=JSON.stringify([w,h,x.fill,x.cloudSeed,x.cloudPixel]);if(cloudLayerCache.has(key))return cloudLayerCache.get(key);
 const out=document.createElement('canvas');out.width=w;out.height=h;const c=out.getContext('2d'),r=cloudRandom(x.cloudSeed),lobes=[];
 for(let i=0;i<14;i++)lobes.push({x:w*(.2+.6*i/13),y:h*(.5+(r()-.5)*.24),rx:w*(.07+r()*.055),ry:h*(.14+r()*.15)});
 if(pixel){c.beginPath();for(const b of lobes){c.moveTo(b.x+b.rx,b.y);c.ellipse(b.x,b.y,b.rx,b.ry,0,0,Math.PI*2);}const g=c.createLinearGradient(0,0,0,h);g.addColorStop(0,'#ffffff');g.addColorStop(.45,x.fill);c.fillStyle=g;c.fill();}
 else { // Dense centers with translucent wisps, avoiding a uniform blurred silhouette.
 for(let pass=0;pass<3;pass++)for(const b of lobes){const xx=b.x+(r()-.5)*w*.07,yy=b.y+(r()-.5)*h*.09,rr=b.ry*(1.1-pass*.17);c.save();c.translate(xx,yy);c.scale(b.rx/rr,1);const g=c.createRadialGradient(0,-rr*.12,0,0,0,rr);g.addColorStop(0,x.fill+'ff');g.addColorStop(.4,x.fill+'dd');g.addColorStop(.75,x.fill+'55');g.addColorStop(1,x.fill+'00');c.fillStyle=g;c.fillRect(-rr,-rr,rr*2,rr*2);c.restore();}}
 if(cloudLayerCache.size>80)cloudLayerCache.clear();cloudLayerCache.set(key,out);return out;
}
drawAsset=function(c,x){if(x.asset!=='stackCloud')return cloudAssetBefore(c,x);c.save();c.imageSmoothingEnabled=!x.cloudPixel;c.drawImage(cloudLayerTexture(x),-x.w/2,-x.h/2,x.w,x.h);c.restore();};
function makeStackCloud(i,n,seed,layout,palette,size,pixel){const r=cloudRandom(seed+i*9871),columns=Math.ceil(n/2),row=Math.floor(i/columns);let px=(i%columns+.3+r()*.4)/columns,py=.2+row*.6+(r()-.5)*.3;
 if(layout==='bottom')py=.92+(r()-.5)*.2;
 if(layout==='sides'){px=i%2?.98-r()*.12:r()*.12;py=(Math.floor(i/2)+.5)/Math.ceil(n/2);}
 const w=W*(layout==='sides'?.36:.42)*size*(.85+r()*.35),h=H*(layout==='bottom'?1.1:1.8)*size*(.8+r()*.4);
 return {id:nextId++,type:'asset',asset:'stackCloud',cloudStack:true,name:`구름 ${i+1}`,x:px*W,y:py*H,w,h,baseW:w,baseH:h,scale:100,rotation:0,opacity:100,flip:false,fill:palette[i%palette.length],stroke:'#ffffff',lineWidth:0,cloudPixel:pixel,cloudSeed:seed+i*9871};}
// Balanced shuffled bags keep every chosen color represented without a left-to-right ramp.
function mixedCloudColors(palette,count,seed){
 const r=cloudRandom(seed),result=[];while(result.length<count){const bag=[...palette];for(let i=bag.length-1;i>0;i--){const j=Math.floor(r()*(i+1));[bag[i],bag[j]]=[bag[j],bag[i]];}if(bag.length>1&&bag[0]===result.at(-1)){const j=bag.findIndex(v=>v!==bag[0]);if(j>0)[bag[0],bag[j]]=[bag[j],bag[0]];}result.push(...bag);}return result.slice(0,count);
}
function applyCloudStack(randomize=false){if(busy)return;const n=Number($('stackAmount').value),others=layers.filter(x=>!x.cloudStack);if(others.length+n>40){alert('전체 레이어가 40개를 넘지 않도록 구름량을 줄여 주세요.');return;}remember();const seed=randomize?Math.floor(Math.random()*1e9):7319,pal=chosenCloudColors(),size=Number($('stackSize').value)/100,pixel=Number($('stackPixel').value);const clouds=Array.from({length:n},(_,i)=>makeStackCloud(i,n,seed,stackLayout,pal,size,pixel));const colors=mixedCloudColors(pal,n,seed^0x5bd1e995);clouds.forEach((x,i)=>x.fill=colors[i]);layers=[...clouds,...others];if(['cloud','cloudPixel'].includes(bg.mode)){bg.mode='linear';bg.image=null;}bg.cloudStackSeed=seed;selected=clouds.at(-1).id;chosen.clear();chosen.add(selected);syncBg();refresh();}
$('applyCloudStack').onclick=()=>applyCloudStack();$('shuffleCloudStack').onclick=()=>applyCloudStack(true);
$('stackStyle').onchange=()=>{$('stackPixel').value=$('stackStyle').value==='pixel'?6:0;};$('stackPixel').addEventListener('input',()=>{$('stackStyle').value=Number($('stackPixel').value)>0?'pixel':'natural';});
$('addStackCloud').onclick=()=>{if(layers.length>=40||busy)return;remember();const x=makeStackCloud(0,1,Math.floor(Math.random()*1e9),'full',[stackColors[layers.filter(x=>x.cloudStack).length%stackColors.length]],Number($('stackSize').value)/100,Number($('stackPixel').value));x.x=W/2;x.y=H/2;layers.push(x);selectLayer(x);};
for(const [layout,label]of [['full','화면 가득'],['bottom','아래쪽'],['sides','양옆']]){const b=document.createElement('button');b.type='button';b.setAttribute('aria-pressed',layout===stackLayout?'true':'false');const cv=document.createElement('canvas');cv.width=210;cv.height=56;const c=cv.getContext('2d');c.fillStyle='#cfb1ef';c.fillRect(0,0,210,56);const idBefore=nextId;for(let i=0;i<10;i++){const x=makeStackCloud(i,10,7319,layout,cloudPalettes.lavender,1,5);c.save();c.scale(210/W,56/H);drawLayer(c,x);c.restore();}nextId=idBefore;const t=document.createElement('span');t.textContent=label;b.append(cv,t);b.onclick=()=>{stackLayout=layout;for(const v of $('cloudPresetCards').children)v.setAttribute('aria-pressed',v===b?'true':'false');};$('cloudPresetCards').append(b);}
const cloudSyncBefore=syncObject;
syncObject=function(){cloudSyncBefore();const x=item();if(x?.asset==='stackCloud'){$('kind').textContent='구름 · 채우기 색으로 색상 변경';}};
const cloudDrawLayerBefore=drawLayer;
drawLayer=function(c,x){if(x.asset!=='stackCloud')return cloudDrawLayerBefore(c,x);c.save();const pad=H*bg.margin/100;c.beginPath();c.rect(0,pad,W,Math.max(0,H-pad*2));c.clip();cloudDrawLayerBefore(c,x);c.restore();};

function renderStackColors(){
 const root=$('stackColors');root.replaceChildren();
 stackColors.forEach((color,i)=>{const row=document.createElement('div');row.className='stack-color-row';const label=document.createElement('label');label.textContent=`구름 색 ${i+1}`;const input=document.createElement('input');input.type='color';input.value=color;input.setAttribute('aria-label',`구름 색 ${i+1}`);input.oninput=()=>{stackColors[i]=input.value;};label.append(input);const remove=document.createElement('button');remove.type='button';remove.textContent='삭제';remove.setAttribute('aria-label',`구름 색 ${i+1} 삭제`);remove.disabled=stackColors.length<=2;remove.onclick=()=>{if(stackColors.length<=2)return;stackColors.splice(i,1);renderStackColors();};row.append(label,remove);root.append(row);});
 $('addStackColor').disabled=stackColors.length>=8;
}
$('addStackColor').onclick=()=>{if(stackColors.length>=8)return;stackColors.push('#ffffff');renderStackColors();};
$('stackPalette').onchange=()=>{stackColors=[...cloudPalettes[$('stackPalette').value]];renderStackColors();};
function isCloudLayer(x){return x.cloudStack||['cloud','pixelCloud'].includes(x.asset);}
function removeClouds(all){
 if(busy)return;const ids=new Set(layers.filter(x=>isCloudLayer(x)&&(all||chosen.has(x.id))).map(x=>x.id));const backgroundCloud=all&&['cloud','cloudPixel'].includes(bg.mode);
 if(!ids.size&&!backgroundCloud)return;remember();layers=layers.filter(x=>!ids.has(x.id));for(const id of ids)chosen.delete(id);if(ids.has(selected))selected=[...chosen].at(-1)||null;if(backgroundCloud)bg.mode='linear';syncBg();refresh();
}
$('removeSelectedClouds').onclick=()=>removeClouds(false);$('removeAllClouds').onclick=()=>removeClouds(true);
renderStackColors();

$('shuffleCloudColors').onclick=()=>{
 if(busy)return;const clouds=layers.filter(x=>x.cloudStack&&!x.locked);if(!clouds.length)return;
 const palette=chosenCloudColors(),seed=Math.floor(Math.random()*4294967295);let colors=mixedCloudColors(palette,clouds.length,seed);
 if(colors.every((v,i)=>v===clouds[i].fill)&&new Set(palette).size>1){colors=colors.map(v=>palette[(palette.indexOf(v)+1)%palette.length]);}
 remember();clouds.forEach((x,i)=>x.fill=colors[i]);refresh();
};

function cloudColorBrightness(hex){
 const rgb=[1,3,5].map(i=>parseInt(hex.slice(i,i+2),16)/255).map(v=>v<=.04045?v/12.92:((v+.055)/1.055)**2.4);
 return rgb[0]*.2126+rgb[1]*.7152+rgb[2]*.0722;
}
function orderCloudColors(axis){
 if(busy)return;const clouds=layers.filter(x=>x.cloudStack&&!x.locked);if(!clouds.length)return;
 const palette=chosenCloudColors().sort((a,b)=>cloudColorBrightness(a)-cloudColorBrightness(b));
 const positions=clouds.map(x=>x[axis]),low=Math.min(...positions),high=Math.max(...positions);
 remember();for(const x of clouds){const t=high===low?0:(x[axis]-low)/(high-low);x.fill=palette[Math.round(t*(palette.length-1))];}refresh();
}
$('cloudColorsHorizontal').onclick=()=>orderCloudColors('x');
$('cloudColorsVertical').onclick=()=>orderCloudColors('y');
