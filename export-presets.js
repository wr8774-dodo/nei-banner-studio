'use strict';
(()=>{
 const row=document.querySelector('.sizebuttons');
 for(const [label,w,h,cols,rows,mode]of [['상단 배너',2320,338,1,1,'top'],['하단 2분할',1440,150,2,1,'bottom'],['하단 4분할',1440,300,2,2,'bottom'],['하단 6분할',1440,450,2,3,'bottom']]){
 const b=document.createElement('button');b.textContent=label;b.dataset.size=`${w},${h}`;b.onclick=()=>{resize(w,h);$('cols').value=cols;$('rows').value=rows;$('savePurpose').value=mode;draw();update();};row.prepend(b);
 }
 const section=document.createElement('section');section.className='settings';section.innerHTML=`<h2>저장 형식 · 용량</h2><label>용도<select id="savePurpose"><option value="free">일반 이미지 · 용량 제한 없음</option><option value="top">상단 배너 · 최대 10MB</option><option value="bottom">하단 배너 · 한 장당 최대 200KB</option></select></label><label>형식<select id="saveFormat"><option value="auto">자동 · PNG 우선, 용량 초과 시 JPG</option><option value="png">PNG · 투명 배경 지원</option><option value="jpg">JPG · 용량 절약</option></select></label><p id="saveHint" class="small muted"></p>`;
 document.querySelector('.work').insertBefore(section,$('status'));
 function update(){$('saveHint').textContent=$('savePurpose').value==='bottom'?'권장: 한 장 720×150px · 분할 저장 시 각 파일의 용량을 확인해요. 정지 이미지 PNG/JPG 저장을 지원해요.':$('savePurpose').value==='top'?'권장: 2320×338px · 파일 크기를 확인한 뒤 저장해요.':'원하는 크기로 저장해요. JPG를 선택하면 투명한 부분은 흰색으로 저장돼요.';}
 $('savePurpose').onchange=update;update();$('export').textContent='이미지 저장 ↓';$('split').textContent='분할 이미지 · ZIP 저장 ↓';
 const rgbaBlob=(c,type,q)=>new Promise((resolve,reject)=>c.toBlob(b=>b?resolve(b):reject(Error('이미지 변환에 실패했어요.')),type,q));
 async function encode(c,limit,format){
 if(format!=='jpg'){const b=await rgbaBlob(c,'image/png');if(b.size<=limit)return {blob:b,ext:'png'};if(format==='png')throw Error('PNG가 용량 제한을 넘었어요. 저장 형식을 자동 또는 JPG로 바꿔주세요.');
 const pixels=c.getContext('2d').getImageData(0,0,c.width,c.height).data;for(let i=3;i<pixels.length;i+=4)if(pixels[i]<255)throw Error('투명 PNG가 용량 제한을 넘었어요. 배경을 채우거나 JPG를 선택해주세요. JPG는 투명 부분이 흰색으로 저장돼요.');}
 const jpg=document.createElement('canvas');jpg.width=c.width;jpg.height=c.height;const jc=jpg.getContext('2d');jc.fillStyle='#fff';jc.fillRect(0,0,jpg.width,jpg.height);jc.drawImage(c,0,0);
 let best=null;for(const q of [.98,.94,.9,.84,.76,.65,.5,.35,.2]){const b=await rgbaBlob(jpg,'image/jpeg',q);if(b.size<=limit){best=b;break;}}jpg.width=jpg.height=0;if(!best)throw Error('용량 제한을 맞추지 못했어요. 이미지 크기를 줄여주세요.');return {blob:best,ext:'jpg'};
 }
 exportImage=async function(split){if(busy)return;busy=true;const controls=[...document.querySelectorAll('button,input,select,textarea')],disabled=controls.map(n=>n.disabled);controls.forEach(n=>n.disabled=true);let out;
 try{
 await Promise.all(layers.filter(x=>x.type==='text'&&!x.hidden).map(x=>loadBannerFont(x.font,x.text)));
 const purpose=$('savePurpose').value,limit=purpose==='bottom'?200000:purpose==='top'?10000000:Infinity,format=$('saveFormat').value;
 if(purpose==='bottom'&&split&&getCount('cols')*getCount('rows')>6)throw Error('하단 배너는 최대 6장까지 등록할 수 있어요. 분할 수를 줄여주세요.');
 out=document.createElement('canvas');out.width=W;out.height=H;paint(out,false);
 if(!split){const {blob,ext}=await encode(out,limit,format);download(blob,`banner-${W}x${H}.${ext}`);message(`${ext.toUpperCase()} 저장 · ${(blob.size/1000).toFixed(1)}KB`);}
 else{const cols=getCount('cols'),rows=getCount('rows'),files=[];let maxBytes=0;for(let r=0;r<rows;r++)for(let col=0;col<cols;col++){
 const x=Math.floor(col*W/cols),y=Math.floor(r*H/rows),w=Math.floor((col+1)*W/cols)-x,h=Math.floor((r+1)*H/rows)-y,tile=document.createElement('canvas');tile.width=w;tile.height=h;tile.getContext('2d').drawImage(out,x,y,w,h,0,0,w,h);
 const {blob,ext}=await encode(tile,limit,format);maxBytes=Math.max(maxBytes,blob.size);files.push({name:`banner-${String(r*cols+col+1).padStart(2,'0')}.${ext}`,data:new Uint8Array(await blob.arrayBuffer())});tile.width=tile.height=0;message(`분할 저장 준비 · ${files.length}/${cols*rows}`);
 }download(makeZip(files),`banner-${cols}x${rows}.zip`);message(`${files.length}장 저장 · 가장 큰 파일 ${(maxBytes/1000).toFixed(1)}KB · 위쪽 왼쪽부터 오른쪽 순서예요.`);}
 }catch(e){message(e.message||'저장에 실패했어요.');}finally{if(out)out.width=out.height=0;busy=false;controls.forEach((n,i)=>n.disabled=disabled[i]);}
 };
})();
