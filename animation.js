'use strict';
(()=>{
 const el=id=>document.getElementById(id),ac=el('animCanvas');let active=0,count=1,aw=420,ah=420,playing=true,clock=0,last=0,visible=true,exporting=false,uploading=false,animDrag=null;
 const cards=[{image:null,file:'',zoom:100,x:0,y:0,borderColor:'#cbbbea',border:3,size:85}];
 const controls={animZoom:'zoom',animX:'x',animY:'y',animBorderColor:'borderColor',animBorder:'border',animSize:'size'};
 const stringKeys=['borderColor'];
 const status=s=>el('animStatus').textContent=s;
 function sync(){const c=cards[0];for(const [id,key]of Object.entries(controls))el(id).value=c[key];for(const id of ['animZoom','animBorder','animSize'])el(id+'Value').textContent=el(id).value+'%';el('animFileName').textContent=c.file||'동영상을 넣으면 원 안에서 재생돼요.';}
 function layout(i){return {x:aw/count*(i+.5),y:ah/2,d:Math.min(aw/count,ah)*cards[i].size/100};}
 function front(c,card,d){if(card.image){const f=Math.max(d/card.image.videoWidth,d/card.image.videoHeight)*card.zoom/100,w=card.image.videoWidth*f,h=card.image.videoHeight*f;const x=(w-d)*card.x/200,y=(h-d)*card.y/200;c.drawImage(card.image,-w/2+x,-h/2+y,w,h);}else{c.fillStyle='#f4f3f8';c.fillRect(-d/2,-d/2,d,d);c.fillStyle=card.borderColor;c.textAlign='center';c.textBaseline='middle';c.font=`600 ${Math.max(10,d*.12)}px sans-serif`;c.fillText('동영상 넣기',0,0);}}
 function scene(target,time){const c=target.getContext('2d');c.clearRect(0,0,aw,ah);if(!el('animTransparent').checked){c.fillStyle='white';c.fillRect(0,0,aw,ah);}const card=cards[0],g=layout(0);c.save();c.translate(g.x,g.y);c.save();c.beginPath();c.arc(0,0,g.d/2,0,Math.PI*2);c.clip();front(c,card,g.d);ProfileFX.overlay(c,g.d,time%ProfileFX.total(Number(el('animDuration').value)||4));c.restore();ProfileFX.ring(c,card,g.d,time);c.restore();}
 function render(t){scene(ac,t);}
 let previewSeeking=false,lastPreview=0,videoURL=null,seekPending=Promise.resolve(),previewRevision=0;
 function seekVideo(time){const v=cards[0].image;if(!v)return Promise.resolve();const target=Math.max(0,Math.min(v.duration-.001,time));const run=()=>new Promise((resolve,reject)=>{if(Math.abs(v.currentTime-target)<.0001&&v.readyState>=2){resolve();return;}const timer=setTimeout(()=>done(Error('영상 프레임을 읽는 시간이 초과됐어요.')),12000);function done(error){clearTimeout(timer);v.removeEventListener('seeked',ok);v.removeEventListener('error',fail);error?reject(error):resolve();}function ok(){done();}function fail(){done(Error('영상을 읽지 못했어요.'));}v.addEventListener('seeked',ok);v.addEventListener('error',fail);try{v.currentTime=target;}catch(e){done(e);}});seekPending=seekPending.catch(()=>{}).then(run);return seekPending;}
 function sourceTime(t){const length=Math.max(.01,Number(el('animDuration').value)||.01),cycle=ProfileFX.total(length);return Math.max(0,Number(el('animStart').value)||0)+((t%cycle)%length);}
 async function tick(t){requestAnimationFrame(tick);if(last&&playing&&visible&&!exporting&&!uploading&&!animDrag)clock+=(t-last)/1000;last=t;if(!visible||exporting||uploading||!playing||animDrag||previewSeeking||t-lastPreview<1000/15)return;previewSeeking=true;lastPreview=t;const time=clock,revision=previewRevision;try{await seekVideo(sourceTime(time));if(!exporting&&revision===previewRevision)render(time);}catch(e){playing=false;el('animPlay').textContent='재생';status(e.message);}finally{previewSeeking=false;}}
 function trim(){const v=cards[0].image;if(!v)return;let start=Number(el('animStart').value),duration=Number(el('animDuration').value);if(!Number.isFinite(start))start=0;if(!Number.isFinite(duration))duration=4;start=Math.min(Math.max(0,v.duration-.1),Math.max(0,start));duration=Math.max(.01,Math.min(10,v.duration-start,Math.max(.1,duration)));el('animStart').value=Math.round(start*1000)/1000;el('animDuration').value=Math.round(duration*1000)/1000;el('animStart').max=Math.max(0,v.duration-.1);clock=0;seekVideo(start).then(()=>{if(!exporting)render(0);}).catch(e=>status(e.message));}
 function mode(on){visible=on;document.body.classList.toggle('animation-mode',on);el('bannerEditor').hidden=on;el('avatarEditor').hidden=!on;for(const [id,sel]of [['bannerTab',!on],['avatarTab',on]]){el(id).classList.toggle('active',sel);el(id).setAttribute('aria-pressed',String(sel));}if(on)render(clock);else draw();}
 el('bannerTab').onclick=()=>mode(false);el('avatarTab').onclick=()=>mode(true);el('animPlay').onclick=()=>{playing=!playing;el('animPlay').textContent=playing?'일시 정지':'재생';};
 for(const [id,key]of Object.entries(controls))el(id).oninput=()=>{let v=stringKeys.includes(key)?el(id).value:Number(el(id).value);if(typeof v==='number'){if(!Number.isFinite(v))return;const min=Number(el(id).min),max=Number(el(id).max);if(el(id).type!=='select-one')v=Math.max(min,Math.min(max,v));}cards[active][key]=v;for(const k of ['animZoom','animBorder','animSize'])el(k+'Value').textContent=el(k).value+'%';if(['zoom','x','y'].includes(key)){clock=0;renderFront();}else render(clock);};

 el('animResize').onclick=()=>{const w=Number(el('animWidth').value),h=Number(el('animHeight').value);if(!Number.isInteger(w)||!Number.isInteger(h)||w<160||h<160||w>1200||h>800){status('가로 160~1,200px, 세로 160~800px로 입력해주세요.');return;}aw=w;ah=h;ac.width=w;ac.height=h;render(clock);status(`전체 크기를 ${w} × ${h}px로 변경했어요.`);};
 for(const id of ['animTransparent','animFPS'])el(id).onchange=()=>render(clock);el('animStart').onchange=trim;el('animDuration').onchange=trim;
 el('animRecenter').onclick=()=>{Object.assign(cards[active],{x:0,y:0,zoom:100});sync();renderFront();};
 el('animUpload').onclick=()=>el('animFile').click();el('animFile').onchange=async e=>{const file=e.target.files[0];e.target.value='';if(!file||exporting||uploading)return;if(file.size>250*1024*1024){status('250MB 이하의 동영상을 넣어주세요.');return;}uploading=true;el('animUpload').disabled=true;status('동영상을 불러오는 중…');let url=null;try{url=URL.createObjectURL(file);const video=document.createElement('video');video.muted=true;video.playsInline=true;video.preload='auto';await new Promise((resolve,reject)=>{const timer=setTimeout(()=>done(Error('동영상을 열지 못했어요. MP4(H.264) 또는 WebM으로 시도해주세요.')),20000);const ready=()=>done();const fail=()=>done(Error('이 형식은 브라우저에서 재생할 수 없어요. MP4(H.264) 또는 WebM으로 시도해주세요.'));function done(error){clearTimeout(timer);video.removeEventListener('loadeddata',ready);video.removeEventListener('error',fail);error?reject(error):resolve();}video.addEventListener('loadeddata',ready);video.addEventListener('error',fail);video.src=url;video.load();});if(!Number.isFinite(video.duration)||video.duration<=0||!video.videoWidth)throw Error('영상 길이를 읽지 못했어요. 다른 동영상을 넣어주세요.');await seekPending.catch(()=>{});if(videoURL)URL.revokeObjectURL(videoURL);videoURL=url;url=null;Object.assign(cards[0],{image:video,file:file.name,zoom:100,x:0,y:0});clock=0;el('animStart').value=0;el('animDuration').value=Math.min(4,video.duration);el('animStart').max=Math.max(0,video.duration-.1);el('animVideoInfo').textContent=`영상 ${video.duration.toFixed(2)}초 · ${video.videoWidth} × ${video.videoHeight}px · GIF에는 소리가 포함되지 않아요`;sync();render(0);status('동영상을 넣었어요. 사용할 시작 지점과 길이를 정하고 GIF로 저장하세요.');}catch(e){status(e.message||'동영상을 열지 못했어요.');}finally{if(url)URL.revokeObjectURL(url);uploading=false;el('animUpload').disabled=false;}};
 function renderFront(){render(0);}
 ac.onpointerdown=e=>{if(exporting)return;const r=ac.getBoundingClientRect(),x=(e.clientX-r.left)/r.width*aw;active=Math.min(count-1,Math.max(0,Math.floor(x/(aw/count))));sync();const c=cards[active];animDrag={px:e.clientX,py:e.clientY,x:c.x,y:c.y};ac.setPointerCapture(e.pointerId);renderFront();};
 ac.onpointermove=e=>{if(!animDrag||!cards[active].image)return;const c=cards[active],d=layout(active).d,f=Math.max(d/c.image.videoWidth,d/c.image.videoHeight)*c.zoom/100,ratio=aw/ac.getBoundingClientRect().width,extraX=c.image.videoWidth*f-d,extraY=c.image.videoHeight*f-d;c.x=extraX>0?Math.max(-100,Math.min(100,animDrag.x+(e.clientX-animDrag.px)*ratio/extraX*200)):0;c.y=extraY>0?Math.max(-100,Math.min(100,animDrag.y+(e.clientY-animDrag.py)*ratio/extraY*200)):0;el('animX').value=Math.round(c.x);el('animY').value=Math.round(c.y);renderFront();};ac.onpointerup=ac.onpointercancel=()=>animDrag=null;
 async function save(kind){
 if(exporting||uploading)return;
 if(!cards[0].image){status('동영상 하나를 넣어주세요.');return;}
 const start=Number(el('animStart').value),length=Number(el('animDuration').value);
 if(!Number.isFinite(start)||!Number.isFinite(length)||start<0||length<=0||length>10||start+length>cards[0].image.duration+.001){status('영상 길이 안에서 시작 지점과 사용 길이(최대 10초)를 정해주세요.');return;}
 exporting=true;const nodes=[...document.querySelectorAll('button,input,select,textarea')],disabled=nodes.map(n=>n.disabled);nodes.forEach(n=>n.disabled=true);
 const out=document.createElement('canvas');out.width=aw;out.height=ah;
 try{
 await seekPending;if(ProfileFX.settings.effect!=='none')await ProfileFX.ready();
 if(kind==='png'){await seekVideo(sourceTime(clock));scene(out,clock);const blob=await toBlob(out);if(blob.size>=10000000)throw Error('10MB를 넘었어요. 크기를 줄여주세요.');download(blob,'circle-profile.png');status(`현재 장면 PNG 저장 · ${(blob.size/1000).toFixed(1)}KB`);return;}
 const duration=ProfileFX.total(length),chosenFPS=Number(el('animFPS').value),c=out.getContext('2d',{willReadFrequently:true});
 const attempts=kind==='apng'?[{fps:chosenFPS,colors:255}]:[{fps:chosenFPS,colors:255},{fps:Math.min(chosenFPS,10),colors:191},{fps:Math.min(chosenFPS,7),colors:127},{fps:Math.min(chosenFPS,5),colors:95}];
 let blob=null,used=null;
 for(let attempt=0;attempt<attempts.length;attempt++){
 const opts=attempts[attempt],frames=Math.max(1,Math.ceil(opts.fps*duration));
 if(aw*ah*frames>50000000)throw Error('처리할 영상이 너무 커요. 420×420px로 맞추거나 사용 길이를 줄여주세요.');
 const encoder=kind==='apng'?new LosslessAPNG(frames):new LoopGIF(aw,ah,opts.colors);
 for(let frame=0;frame<frames;frame++){
 const t=frame/opts.fps;await seekVideo(sourceTime(t));scene(out,t);
 const delay=Math.max(1,Math.round(Math.min(duration,(frame+1)/opts.fps)*100)-Math.round(frame*100/opts.fps));
 if(kind==='apng')await encoder.addFrame(out,delay);else encoder.addFrame(c.getImageData(0,0,aw,ah).data,delay);
 status(`${kind==='apng'?'APNG':'GIF'} 만드는 중 · ${attempt+1}차 · ${Math.round((frame+1)/frames*100)}%`);await new Promise(r=>setTimeout(r,0));
 }
 blob=encoder.finish();used=opts;if(kind==='apng'||blob.size<2000000)break;
 }
 if(kind==='gif'&&blob.size>=2000000)throw Error('2MB 미만으로 맞추지 못했어요. 영상 길이나 닉네임 표시 시간을 줄여 다시 저장해주세요.');
 download(blob,kind==='apng'?'circle-video.apng':'circle-video.gif');
 status(`${kind==='apng'?'APNG 보관용':'GIF'} 저장 · ${(blob.size/1000000).toFixed(2)}MB · ${aw}×${ah}px · ${used.fps}fps${kind==='apng'?' (SOOP 업로드는 GIF를 사용해주세요.)':''}`);
 }catch(e){status(e.message||'저장하지 못했어요. 다시 시도해주세요.');}
 finally{out.width=out.height=0;exporting=false;nodes.forEach((n,i)=>n.disabled=disabled[i]);render(clock);}
 }
 function restartPreview(){clock=0;last=0;previewRevision++;const revision=previewRevision;seekVideo(sourceTime(0)).then(()=>{if(!exporting&&revision===previewRevision)render(0);}).catch(e=>status(e.message));}
 ProfileFX.onChange(restart=>{if(exporting)return;if(restart)restartPreview();el('fxLength').textContent=`전체 반복 길이: ${ProfileFX.total(Number(el('animDuration').value)||4).toFixed(1)}초 · 반복 시작 시 영상도 처음으로 돌아가요`;if(!restart)render(clock);});
 el('fxRestart').onclick=()=>{if(exporting||uploading)return;el('animStart').value=0;playing=true;el('animPlay').textContent='일시 정지';restartPreview();};
 el('animDuration').addEventListener('change',()=>{el('fxLength').textContent=`전체 반복 길이: ${ProfileFX.total(Number(el('animDuration').value)||4).toFixed(1)}초`;});
 el('fxLength').textContent=`전체 반복 길이: ${ProfileFX.total(4).toFixed(1)}초`;
 window.addEventListener('load',()=>ProfileFX.ready().catch(()=>{}));
 el('animAPNG').onclick=()=>save('apng');el('animGIF').onclick=()=>save('gif');el('animPNG').onclick=()=>save('png');
 sync();mode(false);requestAnimationFrame(tick);
 if(document.modelContext?.registerTool)try{Promise.resolve(document.modelContext.registerTool({name:'configure_video_clip',description:'Set the start and duration of the uploaded video for one circular GIF. Does not export.',inputSchema:{type:'object',properties:{start:{type:'number',minimum:0},duration:{type:'number',minimum:0.1,maximum:10}},required:['start','duration'],additionalProperties:false},annotations:{readOnlyHint:false},async execute(input){if(exporting||uploading)throw Error('Editor busy');const v=cards[0].image;if(!v)throw Error('Upload a video first');if(!input||Object.keys(input).some(k=>!['start','duration'].includes(k))||!Number.isFinite(input.start)||!Number.isFinite(input.duration)||input.start<0||input.duration<.1||input.duration>10||input.start+input.duration>v.duration)throw Error('Invalid clip range');el('animStart').value=input.start;el('animDuration').value=input.duration;clock=0;await seekVideo(input.start);mode(true);render(0);return {start:input.start,duration:input.duration};}})).catch(()=>{});}catch(e){}
})();
