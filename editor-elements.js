'use strict';
// Editable vector shapes share the editor's transforms, styling, history and export.
const decorationNames={pixelCloud:'도트 구름',cloud:'둥근 구름',pixelHeart:'픽셀 하트',pixelHeartOutline:'픽셀 하트 테두리',pixelHeartShine:'픽셀 하트 반짝',heart:'둥근 하트',doodleHeart:'낙서 하트',pixelSpark:'픽셀 빛',sparkCluster:'반짝임 모음',paw:'발바닥 스티커',pawOutline:'발바닥 윤곽선',swirl:'회오리',wonkyStar:'삐뚤빼뚤 별',longCurve:'긴 고리 곡선',cat:'고양이 윤곽선',catSticker:'고양이 스티커',swirlThick:'통통 회오리'};
Object.assign(assetNames,decorationNames);
const originalAssetDraw=drawAsset;
function decorationPath(c,k){
 c.beginPath();
 const polygon=points=>{points.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));c.closePath();};
 const heart=()=>{c.moveTo(0,43);c.bezierCurveTo(-12,30,-48,5,-44,-17);c.bezierCurveTo(-41,-43,-11,-44,0,-23);c.bezierCurveTo(11,-44,41,-43,44,-17);c.bezierCurveTo(48,5,12,30,0,43);c.closePath();};
 if(k.startsWith('pixelHeart'))polygon([[-45,-25],[-35,-25],[-35,-35],[-15,-35],[-15,-25],[-5,-25],[-5,-15],[5,-15],[5,-25],[15,-25],[15,-35],[35,-35],[35,-25],[45,-25],[45,5],[35,5],[35,15],[25,15],[25,25],[15,25],[15,35],[5,35],[5,45],[-5,45],[-5,35],[-15,35],[-15,25],[-25,25],[-25,15],[-35,15],[-35,5],[-45,5]]);
 else if(k==='pixelCloud')polygon([[-50,5],[-40,5],[-40,-10],[-25,-10],[-25,-30],[-10,-30],[-10,-40],[10,-40],[10,-30],[25,-30],[25,-15],[40,-15],[40,0],[50,0],[50,25],[40,25],[40,35],[-40,35],[-40,25],[-50,25]]);
 else if(k==='cloud'){c.moveTo(-32,32);c.bezierCurveTo(-58,32,-59,-7,-34,-10);c.bezierCurveTo(-39,-43,7,-51,17,-23);c.bezierCurveTo(37,-35,54,-17,45,0);c.bezierCurveTo(65,16,47,34,31,32);c.closePath();}
 else if(k==='heart')heart();
 else if(k==='doodleHeart'){c.moveTo(1,40);c.bezierCurveTo(-11,24,-45,3,-39,-21);c.bezierCurveTo(-35,-43,-9,-31,-2,-14);c.bezierCurveTo(7,-42,39,-45,42,-22);c.bezierCurveTo(48,0,24,22,1,40);c.closePath();}
 else if(k==='wonkyStar')polygon([[-8,-47],[9,-15],[45,-22],[24,5],[39,38],[3,24],[-27,46],[-24,10],[-48,-9],[-17,-16]]);
 else if(k==='pixelSpark')polygon([[0,-48],[8,-48],[8,-24],[16,-24],[16,-16],[24,-16],[24,-8],[48,-8],[48,0],[24,0],[24,8],[16,8],[16,16],[8,16],[8,40],[0,40],[0,16],[-8,16],[-8,8],[-16,8],[-16,0],[-40,0],[-40,-8],[-16,-8],[-16,-16],[-8,-16],[-8,-24],[0,-24]]);
 else if(k==='paw'||k==='pawOutline'){
  for(const [x,y,rx,ry,a]of [[-33,-13,11,15,-.5],[-13,-32,11,15,-.2],[13,-32,11,15,.2],[33,-13,11,15,.5]]){c.moveTo(x+Math.cos(a)*rx,y+Math.sin(a)*rx);c.ellipse(x,y,rx,ry,a,0,Math.PI*2);c.closePath();}
  c.moveTo(-28,24);c.bezierCurveTo(-28,11,-13,-1,0,-1);c.bezierCurveTo(13,-1,28,11,28,24);c.bezierCurveTo(29,44,15,45,0,36);c.bezierCurveTo(-15,45,-29,44,-28,24);c.closePath();
 }
 else if(k==='swirl'||k==='swirlStar'||k==='swirlThick'){
  c.moveTo(-45,-33);c.bezierCurveTo(-12,-45,1,-4,-13,4);c.bezierCurveTo(-29,14,-32,-6,-14,-10);c.bezierCurveTo(8,-16,29,17,13,26);c.bezierCurveTo(-3,35,-7,15,12,10);c.bezierCurveTo(31,5,43,29,43,44);
 }
 else if(k==='longCurve'){c.moveTo(-49,24);c.bezierCurveTo(-35,24,-21,19,-16,0);c.bezierCurveTo(-10,-24,-23,-36,-23,-12);c.bezierCurveTo(-23,16,12,1,20,8);c.bezierCurveTo(35,22,41,12,49,16);}
 else if(k==='catSticker'){
  c.moveTo(-22,30);c.bezierCurveTo(-12,33,-12,25,-22,24);c.bezierCurveTo(-38,22,-38,39,-24,40);c.bezierCurveTo(-11,41,-8,29,-18,25);
  c.bezierCurveTo(-34,24,-38,12,-31,3);c.quadraticCurveTo(-25,-5,-16,-10);c.lineTo(-3,-23);c.quadraticCurveTo(0,-26,4,-22);c.lineTo(13,-14);c.lineTo(25,-22);c.quadraticCurveTo(29,-25,31,-19);c.lineTo(36,-7);c.bezierCurveTo(49,3,49,19,35,25);
  c.bezierCurveTo(25,20,14,26,18,34);c.bezierCurveTo(22,43,37,40,37,31);c.bezierCurveTo(37,25,24,26,25,31);c.quadraticCurveTo(26,34,31,32);
  c.moveTo(-33,22);c.bezierCurveTo(-50,26,-42,-1,-42,-15);c.bezierCurveTo(-41,-32,-49,-39,-54,-32);
  for(const px of [0,19]){c.moveTo(px+2.4,2);c.ellipse(px,2,2.4,5.3,0,0,Math.PI*2);}
 }
 else if(k==='cat'){
  c.moveTo(-23,34);c.bezierCurveTo(-14,37,-14,29,-24,28);c.bezierCurveTo(-40,26,-40,42,-25,43);c.bezierCurveTo(-13,44,-8,35,-17,28);
  c.bezierCurveTo(-36,28,-42,17,-36,5);c.bezierCurveTo(-32,-3,-25,-8,-20,-12);c.lineTo(-12,-25);c.quadraticCurveTo(-9,-30,-5,-25);c.lineTo(5,-16);c.lineTo(18,-25);c.quadraticCurveTo(23,-29,26,-23);c.lineTo(33,-9);c.bezierCurveTo(48,2,47,22,31,28);
  c.bezierCurveTo(17,24,10,33,16,39);c.bezierCurveTo(23,47,38,41,34,33);c.bezierCurveTo(32,28,20,30,23,35);c.quadraticCurveTo(25,37,29,35);
 }
}
const openDecorations=new Set(['swirl','swirlThick','swirlStar','longCurve','cat','catSticker','doodleHeart','pawOutline','pixelHeartOutline']);
function drawCameraUI(c,x){
 const w=x.w,h=x.h,u=Math.min(w/16,h/9),edge=u*.6,font=u*.27;
 c.save();c.strokeStyle=x.stroke;c.fillStyle=x.stroke;c.lineWidth=x.lineWidth??2;
 function corners(cx,cy,ww,hh,len){c.beginPath();for(const sx of [-1,1])for(const sy of [-1,1]){const px=cx+sx*ww/2,py=cy+sy*hh/2;c.moveTo(px-sx*len,py);c.lineTo(px,py);c.lineTo(px,py-sy*len);}if(c.lineWidth>0)c.stroke();}
 corners(0,0,w,h,edge);corners(0,0,u*1.3,u*1.3,u*.3);
 c.font=`700 ${font}px sans-serif`;c.textBaseline='top';c.textAlign='left';c.fillText('REC',-w/2+u*.52,-h/2+u*.13,w*.22);
 c.save();c.fillStyle='#ff365c';c.beginPath();c.arc(-w/2+u*.3,-h/2+u*.29,u*.085,0,Math.PI*2);c.fill();c.restore();
 c.textAlign='right';c.fillText(x.label??'AUTO  ISO 200',w/2-u*.22,-h/2+u*.13,w*.4);c.restore();
}
const cameraParts={cameraCorners:'카메라 모서리',cameraRec:'REC 표시',cameraInfo:'AUTO ISO 200',cameraFocus:'가운데 초점 표시'};
Object.assign(assetNames,cameraParts);
function drawCameraPart(c,x){
 const w=x.w,h=x.h,k=x.asset;c.save();c.strokeStyle=x.stroke;c.fillStyle=x.stroke;c.lineWidth=x.lineWidth??2;
 if(k==='cameraCorners'||k==='cameraFocus'){const len=Math.min(w,h)*(k==='cameraFocus'?.24:.15);c.beginPath();for(const sx of [-1,1])for(const sy of [-1,1]){const px=sx*w/2,py=sy*h/2;c.moveTo(px-sx*len,py);c.lineTo(px,py);c.lineTo(px,py-sy*len);}if(x.lineWidth>0)c.stroke();}
 else {const rec=k==='cameraRec';c.font=`700 ${h*.72}px sans-serif`;c.textBaseline='middle';c.textAlign=rec?'left':'center';c.fillText(x.label??(rec?'REC':'AUTO  ISO 200'),rec?-w*.22:0,0,rec?w*.72:w);if(rec){c.fillStyle=x.fill||'#ff365c';c.beginPath();c.arc(-w*.39,0,Math.min(h*.18,w*.09),0,Math.PI*2);c.fill();}}
 c.restore();
}
drawAsset=function(c,x){
 if(x.asset==='camera')return drawCameraUI(c,x);
 if(cameraParts[x.asset])return drawCameraPart(c,x);
 const k=x.asset;if(!decorationNames[k])return originalAssetDraw(c,x);
 c.save();c.scale(x.w/100,x.h/100);c.fillStyle=x.fill;c.strokeStyle=x.stroke;c.lineWidth=(x.lineWidth??2)*100/Math.max(1,Math.min(x.w,x.h));c.lineJoin=k.startsWith('pixel')?'miter':'round';c.lineCap='round';
 const stroke=()=>{if(x.lineWidth>0){if(['cat','catSticker','swirlThick'].includes(k)&&x.outerWidth>0){c.save();c.lineWidth+=2*x.outerWidth*100/Math.max(1,Math.min(x.w,x.h));c.strokeStyle=x.outerColor||'#ffffff';c.stroke();c.restore();}c.stroke();if(k==='catSticker'){c.save();c.strokeStyle=x.outerColor||'#ffffff';c.lineWidth=Math.max(.7,c.lineWidth*.22);c.stroke();c.restore();}}};
 if(k==='sparkCluster'){
  for(const [px,py,size]of [[-9,8,63],[31,-29,25],[34,33,19]]){c.save();c.translate(px,py);shapePath(c,'sparkle',size,size);if(!x.hollow)c.fill();stroke();c.restore();}
 }else{
  decorationPath(c,k);if(!x.hollow&&!openDecorations.has(k))c.fill();stroke();
  if(k==='pixelHeartShine'&&!x.hollow){c.save();c.globalAlpha*=.8;c.fillStyle='#ffffff';c.fillRect(-27,-25,10,10);c.fillRect(-37,-15,10,15);c.restore();}
  if(k==='cat'){
   c.beginPath();c.moveTo(-37,19);c.bezierCurveTo(-55,24,-43,-7,-43,-22);c.bezierCurveTo(-43,-39,-56,-44,-59,-35);stroke();
   for(const px of [-5,15]){c.beginPath();c.ellipse(px,1,3,6,0,0,Math.PI*2);stroke();}
  }
 }
 c.restore();
};
function addLibraryAsset(kind){
 if(busy)return;if(layers.length>=40){message('요소는 최대 40개예요.');return;}
 if(cameraParts[kind]){remember();const sizes={cameraCorners:[W*.9,H*.8],cameraRec:[H*.45,H*.16],cameraInfo:[H*1.1,H*.16],cameraFocus:[H*.3,H*.3]},[w,h]=sizes[kind];const x={id:nextId++,type:'asset',asset:kind,name:assetNames[kind],x:W/2,y:H/2,w,h,baseW:w,baseH:h,scale:100,rotation:0,opacity:100,flip:false,fill:'#ff365c',stroke:'#ffffff',lineWidth:2,hollow:true,label:kind==='cameraRec'?'REC':kind==='cameraInfo'?'AUTO  ISO 200':''};layers.push(x);selectLayer(x);return;}
 if(!decorationNames[kind]){$('assetType').value=kind;$('addAsset').onclick();return;}
 remember();const h=H*.55,w=kind==='longCurve'?W*.7:['cloud','pixelCloud'].includes(kind)?h*1.7:h;
 const x={id:nextId++,type:'asset',asset:kind,name:assetNames[kind],x:W/2,y:H/2,w,h,baseW:w,baseH:h,scale:100,rotation:0,opacity:100,flip:false,fill:'#c6a7ed',stroke:'#8865aa',lineWidth:2,hollow:openDecorations.has(kind),label:''};
 if(kind==='swirlThick'){x.lineWidth=9;x.stroke='#c1a3df';x.outerWidth=1.5;x.outerColor='#ffffff';}if(kind==='catSticker'){x.lineWidth=5;x.stroke='#ff78ab';x.outerWidth=1.5;x.outerColor='#ffffff';}
 layers.push(x);selected=x.id;chosen=new Set([selected]);$('editGradient').checked=false;refresh();
}
const elementCategories={all:'전체',shape:'도형',ui:'UI 소재',cloud:'구름',heart:'하트',light:'빛 / 별',doodle:'낙서'};
const elementGroups={shape:['rect','round','ellipse','triangle','trapezoid','parallelogram','line'],ui:['card','player','window','label','cameraCorners','cameraRec','cameraInfo','cameraFocus'],cloud:['pixelCloud','cloud'],heart:['pixelHeart','pixelHeartOutline','pixelHeartShine','heart','doodleHeart'],light:['star','wonkyStar','sparkle','pixelSpark','sparkCluster','dots','ring'],doodle:['paw','pawOutline','swirl','swirlThick','longCurve','cat','catSticker']};
let elementCategory='all';
function renderElementLibrary(){
 const root=$('elementGrid');root.replaceChildren();
 for(const [category,kinds]of Object.entries(elementGroups)){if(elementCategory!=='all'&&elementCategory!==category)continue;
  for(const kind of kinds){
   const button=document.createElement('button');button.type='button';button.className='element-card';button.title=assetNames[kind]+' 추가';button.setAttribute('aria-label',button.title);
   const preview=document.createElement('canvas');preview.width=240;preview.height=144;preview.setAttribute('aria-hidden','true');const c=preview.getContext('2d');c.translate(120,72);
   const wide=['cloud','pixelCloud','longCurve','player','window','label','cameraCorners','cameraRec','cameraInfo','dots','line'].includes(kind);
   drawAsset(c,{type:'asset',asset:kind,w:wide?172:91,h:kind==='longCurve'?65:91,fill:'#c6a7ed',stroke:'#735096',lineWidth:kind==='swirlThick'?8:kind==='catSticker'?4:2.5,outerWidth:['swirlThick','catSticker'].includes(kind)?1.5:0,outerColor:'#ffffff',hollow:openDecorations.has(kind)||kind==='ring',opacity:100,label:kind==='cameraRec'?'REC':kind==='cameraInfo'?'AUTO ISO 200':kind==='player'?'NOW PLAYING':kind==='label'?'YOUR NAME':''});
   const name=document.createElement('span');name.textContent=assetNames[kind];button.append(preview,name);button.onclick=()=>addLibraryAsset(kind);root.append(button);
  }
 }
 for(const button of $('elementTabs').children){const active=button.dataset.category===elementCategory;button.classList.toggle('active',active);button.setAttribute('aria-pressed',String(active));}
}
for(const [key,name]of Object.entries(elementCategories)){const button=document.createElement('button');button.type='button';button.textContent=name;button.dataset.category=key;button.onclick=()=>{elementCategory=key;renderElementLibrary();};$('elementTabs').append(button);}
$('toggleElements').onclick=()=>{const panel=$('elementLibrary');panel.hidden=!panel.hidden;$('toggleElements').setAttribute('aria-expanded',String(!panel.hidden));};
$('closeElements').onclick=()=>{$('elementLibrary').hidden=true;$('toggleElements').setAttribute('aria-expanded','false');};
// Paint only the background margins: foreground layers can still overlap them.
bg.marginColor='#ffffff';
const backgroundBeforeMargin=background;
background=function(c,w,h,b){backgroundBeforeMargin(c,w,h,b);if(b.transparent)return;const pad=h*b.margin/100;if(pad<=0)return;c.save();c.filter='none';c.fillStyle=b.marginColor||'#ffffff';c.fillRect(0,0,w,pad);c.fillRect(0,h-pad,w,pad);c.restore();};
const syncBgBeforeMargin=syncBg;
syncBg=function(){syncBgBeforeMargin();$('marginColor').value=bg.marginColor||'#ffffff';};
bindHistoryInput($('marginColor'),()=>{bg.marginColor=$('marginColor').value;draw();});
const syncObjectBeforeOutline=syncObject;
syncObject=function(){syncObjectBeforeOutline();const x=item();$('catOutlineControls').hidden=!['cat','catSticker','swirlThick'].includes(x?.asset)||x?.type!=='asset';if(x){$('catOuterWidth').value=x.outerWidth||0;$('catOuterColor').value=x.outerColor||'#ffffff';}};
for(const [id,key]of [['catOuterWidth','outerWidth'],['catOuterColor','outerColor']])bindHistoryInput($(id),()=>{const x=item();if(!x||x.locked||!['cat','catSticker','swirlThick'].includes(x.asset))return;x[key]=key==='outerWidth'?Math.max(0,Math.min(30,Number($(id).value)||0)):$(id).value;draw();});
renderElementLibrary();syncBg();refresh();

function centerOnCanvas(axis){
 if(busy)return;const xs=selectedLayers(true);if(!xs.length)return;const b=selectionBounds(xs),dx=W/2-(b.left+b.right)/2,dy=H/2-(b.top+b.bottom)/2;remember();for(const x of xs){if(axis!=='y')x.x+=dx;if(axis!=='x')x.y+=dy;}refresh();
}
$('centerHorizontal').onclick=()=>centerOnCanvas('x');
$('centerVertical').onclick=()=>centerOnCanvas('y');
$('center').onclick=()=>centerOnCanvas('both');
