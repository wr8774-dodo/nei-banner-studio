'use strict';
// The same time-based renderer is used for preview and exported frames.
window.ProfileFX=(()=>{
 const settings={patternFrameMode:'solid',patternFrameColor2:'#b3a0ed',patternFrameColor3:'#fff5c7',patternFrameColors:2,patternFrame:'#e7a6b2',ring:'broken',ringColor:'#efb5d1',motion:'pause',pause:.55,spin:true,loopSync:true,speed:1,direction:1,effect:'heart',nickname:'네이',font:'Jua',text:'#ffffff',edge:'#9b426f',background:'#efb5d1',accent:'#ffffff',at:2.5,hold:2,size:22};
 const cloudArt=new Image();
 const cloudReady=new Promise((resolve,reject)=>{cloudArt.onload=()=>resolve();cloudArt.onerror=()=>reject(new Error('구름 배경을 불러오지 못했어요. 새로고침해주세요.'));});
 cloudArt.src='assets/profile-clouds.png';cloudReady.catch(()=>{});
 const host=document.querySelector('.avatar-controls'),panel=document.createElement('section');
 panel.className='profile-fx';panel.innerHTML=`<details open><summary>회전 테두리</summary><label>틀 모양<select id="fxRing"><option value="none">틀 없음</option><option value="solid">심플 원형</option><option value="broken" selected>두 색 이어진 원형 링</option><option value="double">이중 링</option><option value="dots">점선 링</option><option value="hearts">하트 링</option><option value="stars">별 링</option></select></label><label class="check"><input id="fxSpin" type="checkbox" checked>테두리 회전</label><label>테두리 두 번째 색<input id="fxRingColor" type="color" value="#efb5d1"></label><label>회전 방식<select id="fxMotion"><option value="pause" selected>반 바퀴 회전 후 멈춤</option><option value="continuous">계속 회전</option></select></label><label>멈춤 시간 (초)<input id="fxPause" type="number" min="0" max="3" step="0.05" value="0.55"></label><label>회전 속도<input id="fxSpeed" type="range" min="0" max="3" step="0.1" value="1"></label><label class="check"><input id="fxLoopSync" type="checkbox" checked>링 주기에 GIF 길이 맞춤</label><p class="small muted">속도와 멈춤 시간은 그대로 유지해요. 켜면 링이 온전한 바퀴 수를 돌도록 GIF 길이를 늘리고, 안쪽 영상은 반복해요. 끄면 반복 경계에서 링 위치가 바뀔 수 있어요.</p><p id="fxRotationTiming" class="small muted" aria-live="polite"></p><label>방향<select id="fxDirection"><option value="1">시계 방향</option><option value="-1">반시계 방향</option></select></label><p class="small muted">테두리 색·두께·원 크기는 위에서 조절해요.</p></details><details open><summary>배경 · 닉네임 등장</summary><label>연출<select id="fxEffect"><option value="none">사용 안 함</option><option value="heart" selected>구름·하트 스티커</option><option value="cloud">구름 뭉게</option><option value="stars">별빛 반짝</option><option value="spin">회전 전환</option><option value="ribbon">리본 팝업</option><option value="argyle">아가일 하트</option><option value="gingham">깅엄 체크</option></select></label><div id="fxPatternControls" hidden><label>틀 채우기<select id="fxPatternFrameMode"><option value="solid">단색</option><option value="gradient">회전 그라데이션</option></select></label><label>틀 색 1<input id="fxPatternFrame" type="color" value="#e7a6b2"></label><div id="fxFrameGradientControls" hidden><label>그라데이션 색 개수<select id="fxPatternFrameColors"><option value="2">2색</option><option value="3">3색</option></select></label><div class="two"><label>틀 색 2<input id="fxPatternFrameColor2" type="color" value="#b3a0ed"></label><label id="fxFrameColor3Wrap" hidden>틀 색 3<input id="fxPatternFrameColor3" type="color" value="#fff5c7"></label></div><p class="small muted">위쪽 회전 테두리에서 회전 켜기·속도·방향·멈춤 방식을 조절해요.</p></div><p class="small muted">모든 배경 연출에 선택한 틀과 색이 적용돼요.</p></div><label>닉네임<input id="fxNickname" type="text" maxlength="24" value="네이" placeholder="두 줄은 / 로 구분: 구래 / 유노야"></label><label>글꼴<select id="fxFont"></select></label><div class="two"><label>글자색<input id="fxText" type="color" value="#ffffff"></label><label>글자 테두리<input id="fxEdge" type="color" value="#9b426f"></label><label>배경색<input id="fxBackground" type="color" value="#efb5d1"></label><label>장식색<input id="fxAccent" type="color" value="#ffffff"></label></div><label>글자 크기<input id="fxSize" type="range" min="10" max="36" value="22"></label><label>연출 시작 (초)<input id="fxAt" type="number" min="0" max="10" step="0.1" value="2.5"></label><label>닉네임 표시 시간 (초)<input id="fxHold" type="number" min="0.5" max="5" step="0.1" value="2"></label><button id="fxRestart" class="full" type="button">처음부터 미리보기</button><p id="fxLength" class="small muted"></p><p id="fxFontStatus" class="small muted" role="status"></p></details>`;
 host.append(panel);
 const fonts=[['Jua','주아'],['Dongle','동글'],['Cute Font','큐트폰트'],['Gaegu','개구'],['Gamja Flower','감자꽃'],['Hi Melody','하이멜로디'],['Single Day','싱글데이'],['Do Hyeon','도현'],['Black Han Sans','검은고딕'],['Galmuri11','갈무리11']];
 for(const [value,label] of fonts){const o=document.createElement('option');o.value=value;o.textContent=label;document.getElementById('fxFont').append(o);}
 let changed=()=>{},fontJob=Promise.resolve();
 function fontLoad(){fontJob=(async()=>{if(typeof loadBannerFont==='function')await loadBannerFont('"'+settings.font+'"',settings.nickname||'네이');})();fontJob.then(()=>{document.getElementById('fxFontStatus').textContent='';changed(false);}).catch(()=>{document.getElementById('fxFontStatus').textContent='글꼴을 불러오지 못했어요. 다시 선택해주세요.';});return fontJob;}
 for(const key of Object.keys(settings)){const node=document.getElementById('fx'+key[0].toUpperCase()+key.slice(1));node.addEventListener('input',()=>{if(node.type==='checkbox')settings[key]=node.checked;else if(typeof settings[key]==='number'){const n=Number(node.value);if(!Number.isFinite(n))return;settings[key]=Math.max(Number(node.min||-Infinity),Math.min(Number(node.max||Infinity),n));}else settings[key]=node.value;updateRotationTiming();if(key==='font'||key==='nickname')fontLoad();document.getElementById('fxPatternControls').hidden=false;document.getElementById('fxFrameGradientControls').hidden=settings.patternFrameMode!=='gradient';document.getElementById('fxFrameColor3Wrap').hidden=settings.patternFrameColors!==3;changed(true);});}
 document.getElementById('fxRestart').onclick=()=>changed(true);
 function total(clip){
 const base=['none','cleanFrame'].includes(settings.effect)?clip:Math.max(clip,settings.at+.65+settings.hold+.55);
 if(!settings.loopSync||!settings.spin||settings.speed<=0||settings.ring==='none')return base;
 const period=settings.motion==='continuous'?Math.PI*2/(settings.speed*1.4):2*(1.2/settings.speed+settings.pause);
 return Math.max(1,Math.ceil(base/period-1e-10))*period;
 }
 function heart(c,x,y,s){c.beginPath();c.moveTo(x,y+s*.55);c.bezierCurveTo(x-s*1.1,y-s*.12,x-s*.5,y-s*.95,x,y-s*.4);c.bezierCurveTo(x+s*.5,y-s*.95,x+s*1.1,y-s*.12,x,y+s*.55);c.closePath();}
 function star(c,x,y,r,rotation=0){c.beginPath();for(let i=0;i<10;i++){const a=rotation+i*Math.PI/5-Math.PI/2,s=i%2?r*.43:r;i?c.lineTo(x+Math.cos(a)*s,y+Math.sin(a)*s):c.moveTo(x+Math.cos(a)*s,y+Math.sin(a)*s);}c.closePath();}
 function rotationTiming(){
 return {moving:1.2/Math.max(.001,settings.speed),pause:settings.pause,turn:Math.PI*2/(Math.max(.001,settings.speed)*1.4)};
 }
 function updateRotationTiming(){
 const node=document.getElementById('fxRotationTiming');if(!node)return;
 const t=rotationTiming();
 node.textContent=!settings.spin||settings.speed<=0?'회전 정지':'속도 유지 · '+(settings.motion==='continuous'?'한 바퀴 '+t.turn.toFixed(2)+'초':'반 바퀴 '+t.moving.toFixed(2)+'초 → 멈춤 '+t.pause.toFixed(2)+'초')+' · GIF '+total(Number(document.getElementById('animDuration').value)||4).toFixed(2)+'초';
 }
 updateRotationTiming();
 document.getElementById('animDuration').addEventListener('input',updateRotationTiming);
 function ringAngle(t){
 if(!settings.spin||settings.speed<=0)return 0;
 if(settings.motion==='continuous')return t*settings.speed*1.4*settings.direction;
 const moving=1.2/settings.speed,cycle=moving+settings.pause;
 const n=Math.floor(t/cycle),u=Math.min(1,Math.max(0,(t-n*cycle)/moving));
 const ramp=.12;const smooth=u<ramp?u*u/(2*ramp*(1-ramp)):u>1-ramp?1-(1-u)*(1-u)/(2*ramp*(1-ramp)):(u-ramp/2)/(1-ramp);
 return (n+smooth)*Math.PI*settings.direction;
 }
 function ring(c,card,d,t){if(card.border<=0||settings.ring==='none')return;const w=d*card.border/100,r=d/2-w*1.5,a=ringAngle(t);c.save();c.rotate(a);c.lineWidth=w;let ink=settings.patternFrame;if(settings.patternFrameMode==='gradient'){const colors=[settings.patternFrame,settings.patternFrameColor2];if(settings.patternFrameColors===3)colors.push(settings.patternFrameColor3);const grad=c.createConicGradient?c.createConicGradient(-Math.PI/2,0,0):c.createLinearGradient(-d/2,0,d/2,0);colors.forEach((v,i)=>grad.addColorStop(i/colors.length,v));grad.addColorStop(1,colors[0]);ink=grad;}c.strokeStyle=ink;c.fillStyle=ink;c.lineCap='round';const arc=(rad,start,end)=>{c.beginPath();c.arc(0,0,Math.max(1,rad),start,end);c.stroke();};switch(settings.ring){case 'solid':arc(r,0,Math.PI*2);break;case 'broken':c.lineCap='butt';c.strokeStyle=settings.ringColor;arc(r,0,Math.PI*2);c.strokeStyle=ink;for(let i=0;i<4;i++)arc(r,i*Math.PI/2+.13,(i+1)*Math.PI/2-.13);break;case 'double':for(let i=0;i<3;i++)arc(r,i*Math.PI*2/3,i*Math.PI*2/3+1.7);c.rotate(-a*2);c.lineWidth=w*.6;for(let i=0;i<3;i++)arc(r-w*1.8,i*Math.PI*2/3+.3,i*Math.PI*2/3+1.9);break;case 'dots':for(let i=0;i<28;i++){const q=i*Math.PI/14;c.beginPath();c.arc(Math.cos(q)*r,Math.sin(q)*r,Math.max(.5,w*.55),0,Math.PI*2);c.fill();}break;default:for(let i=0;i<12;i++){c.save();c.rotate(i*Math.PI/6);settings.ring==='hearts'?heart(c,0,-r,w*1.4):star(c,0,-r,w*1.45);c.fill();c.restore();}}c.restore();}
 const ease=x=>1-Math.pow(1-Math.max(0,Math.min(1,x)),3);
 function overlay(c,d,t){if(['none','cleanFrame'].includes(settings.effect))return;if(['argyle','gingham'].includes(settings.effect)){patternScene(c,d,t);return;}if(settings.effect==='heart'){heartScene(c,d,t);return;}const q=t-settings.at;if(q<0||q>.65+settings.hold+.55)return;const intro=ease(q/.65),exit=1-ease((q-.65-settings.hold)/.55),amount=intro*exit;if(amount<=0)return;
 c.save();c.globalAlpha*=exit;
 // Reveal the second scene as a growing circle, then dissolve back to the video.
 c.beginPath();c.arc(0,0,d*.73*intro,0,Math.PI*2);c.clip();
 const gr=c.createRadialGradient(-d*.2,-d*.3,0,0,0,d*.8);gr.addColorStop(0,settings.accent);gr.addColorStop(.8,settings.background);c.fillStyle=gr;c.fillRect(-d/2,-d/2,d,d);
 c.save();if(settings.effect==='spin')c.rotate((1-intro)*Math.PI*2+t*.15);
 for(let i=0;i<20;i++){const a=i*2.399+t*.17,rad=d*(.18+(i%5)*.07),x=Math.cos(a)*rad,y=Math.sin(a)*rad,s=d*(.025+(i%3)*.012);c.globalAlpha=exit*(.2+.3*(.5+.5*Math.sin(t*2+i)));c.fillStyle=settings.accent;
 if(settings.effect==='cloud'){const yy=y+Math.sin(t+i)*d*.025;c.beginPath();c.ellipse(x,yy,s*2.5,s*1.1,0,0,Math.PI*2);c.ellipse(x-s,yy-s*.6,s*1.3,s*1.3,0,0,Math.PI*2);c.ellipse(x+s*.6,yy-s*.8,s*1.5,s*1.4,0,0,Math.PI*2);c.fill();}
 else {if(settings.effect==='stars'||settings.effect==='spin')star(c,x,y,s*(.7+.3*Math.sin(t*3+i)),t*.3);else heart(c,x,y,s);c.fill();}}
 c.restore();
 const nt=Math.max(0,(q-.32)/.5),pop=nt<1?1+Math.pow(2,-8*nt)*Math.sin((nt-.15)*Math.PI*5):1;
 if(q>.32){c.save();c.scale(Math.max(.01,pop),Math.max(.01,pop));c.globalAlpha*=Math.min(1,nt*5);if(settings.effect==='ribbon'){c.fillStyle=settings.accent;c.beginPath();c.moveTo(-d*.42,-d*.13);c.lineTo(d*.42,-d*.13);c.lineTo(d*.35,0);c.lineTo(d*.42,d*.13);c.lineTo(-d*.42,d*.13);c.lineTo(-d*.35,0);c.closePath();c.fill();}
 let fs=d*settings.size/100;c.font=`${fs}px "${settings.font}", sans-serif`;const text=settings.nickname||'네이',mw=d*.77,measured=c.measureText(text).width;if(measured>mw){fs*=mw/measured;c.font=`${fs}px "${settings.font}", sans-serif`;}c.textAlign='center';c.textBaseline='middle';c.lineJoin='round';c.strokeStyle=settings.edge;c.lineWidth=Math.max(2,fs*.13);c.strokeText(text,0,0);c.fillStyle=settings.text;c.fillText(text,0,0);c.restore();}
 c.restore();
 // Brief white burst around the transition center.
 if(q<.65){c.save();c.globalAlpha*=Math.sin(Math.PI*q/.65)*.8;c.fillStyle=settings.accent;for(let i=0;i<9;i++){const a=i*Math.PI*2/9,rr=d*.38*intro;c.beginPath();c.arc(Math.cos(a)*rr,Math.sin(a)*rr,d*.15*(1-q/.65),0,Math.PI*2);c.fill();}c.restore();}
 }
 function scallop(c,r,phase){
 c.beginPath();for(let i=0;i<=240;i++){const a=i/240*Math.PI*2,rr=r*(1+.055*Math.cos(a*12+phase));const x=Math.cos(a)*rr,y=Math.sin(a)*rr;i?c.lineTo(x,y):c.moveTo(x,y);}c.closePath();
 }
 function heartScene(c,d,t){
 const q=t-settings.at,end=.65+settings.hold,finish=end+.55;if(q<0||q>=finish)return;
 const enter=ease(q/.58),leave=ease((q-end)/.55);
 c.save();c.globalAlpha*=1-leave;c.translate(leave*d*.7,0);
 scallop(c,d*.76*enter,q*.6);c.clip();
 c.fillStyle=settings.background;c.fillRect(-d,-d,d*2,d*2);
 if(cloudArt.complete&&cloudArt.naturalWidth){
 const zoom=1.08-.06*ease(q/3),sz=d*zoom;c.save();c.translate(Math.sin(q*.4)*d*.009,Math.cos(q*.35)*d*.007);c.drawImage(cloudArt,-sz/2,-sz/2,sz,sz);c.restore();
 c.save();c.globalCompositeOperation='soft-light';c.globalAlpha*=.18;c.fillStyle=settings.background;c.fillRect(-d/2,-d/2,d,d);c.restore();
 }
 // Tiny distant hearts and larger foreground hearts travel at different speeds.
 for(let i=0;i<7;i++){
 const a=i*2.399+.15*Math.sin(q*.5+i),r=d*(.25+(i%4)*.075),x=Math.cos(a)*r,y=Math.sin(a)*r-Math.sin(q*.9+i)*d*.024;
 c.save();c.translate(x,y);c.rotate(Math.sin(i+q*.6)*.28);c.globalAlpha*=i%3===0?.45:.2;
 heart(c,0,0,d*(.025+(i%3)*.014));c.fillStyle=settings.accent;c.fill();c.restore();
 }
 // Four-point glints, kept away from the nickname's center.
 for(let i=0;i<7;i++){const a=i*2.4,r=d*(.28+(i%2)*.12),z=d*.019*(.6+.4*Math.sin(q*3+i));c.save();c.translate(Math.cos(a)*r,Math.sin(a)*r);c.fillStyle=settings.accent;c.beginPath();c.moveTo(0,-z*2);c.quadraticCurveTo(z*.2,-z*.2,z,0);c.quadraticCurveTo(z*.2,z*.2,0,z*2);c.quadraticCurveTo(-z*.2,z*.2,-z,0);c.quadraticCurveTo(-z*.2,-z*.2,0,-z*2);c.fill();c.restore();}
 const v=(q-.78)/.36;
 if(v>0){const u=Math.min(1,v),back=1+2.70158*Math.pow(u-1,3)+1.70158*Math.pow(u-1,2);
 c.save();c.translate(0,0);c.scale(Math.max(.01,back),Math.max(.01,back));c.rotate(-.035);c.globalAlpha*=Math.min(1,v*4);
 const lines=(settings.nickname||'네이').split('/').map(x=>x.trim()).filter(Boolean).slice(0,2);if(!lines.length)lines.push('네이');
 let fs=d*settings.size/100*1.35;c.font=`900 ${fs}px "${settings.font}", sans-serif`;
 const width=Math.max(...lines.map(x=>c.measureText(x).width));if(width>d*.73)fs*=d*.73/width;
 c.font=`900 ${fs}px "${settings.font}", sans-serif`;c.textAlign='center';c.textBaseline='middle';c.lineJoin='round';
 lines.forEach((line,i)=>{const y=(i-(lines.length-1)/2)*fs*1.03;
 c.strokeStyle=settings.edge;c.lineWidth=fs*.25;c.strokeText(line,0,y+d*.012);
 c.strokeStyle=settings.accent;c.lineWidth=fs*.21;c.strokeText(line,0,y);
 c.strokeStyle=settings.edge;c.lineWidth=fs*.115;c.strokeText(line,0,y);
 const g=c.createLinearGradient(0,y-fs/2,0,y+fs/2);g.addColorStop(0,settings.text);g.addColorStop(1,settings.background);c.fillStyle=g;c.fillText(line,0,y);
 });c.restore();}
 c.restore();
 // A connected cloud puff expands, then clears to expose the new background.
 if(q<.48){c.save();c.globalAlpha*=Math.pow(1-q/.48,2);c.fillStyle=settings.accent;const spread=d*.64*ease(q/.48);for(let i=0;i<10;i++){const a=i*Math.PI/5;c.beginPath();c.arc(Math.cos(a)*spread,Math.sin(a)*spread,d*.13,0,Math.PI*2);c.fill();}c.restore();}
 }
 function patternScene(c,d,t){
 const q=t-settings.at,end=.65+settings.hold;
 if(q<0||q>end+.55)return;
 const opacity=ease(q/.4)*(1-ease((q-end)/.55));
 c.save();c.globalAlpha*=opacity;c.fillStyle=settings.background;c.fillRect(-d/2,-d/2,d,d);
 const cell=d/(settings.effect==='argyle'?5:7),drift=(q*cell*.12)%cell;
 c.save();c.translate(drift,drift*.35);c.fillStyle=settings.accent;
 if(settings.effect==='gingham'){
 c.globalAlpha*=.4;
 for(let i=-6;i<=5;i++){c.fillRect(i*cell*2,-d,cell,d*2);c.fillRect(-d,i*cell*2, d*2,cell);}
 }else{
 c.globalAlpha*=.42;
 for(let row=-5;row<=5;row++)for(let col=-5;col<=5;col++){
 const x=col*cell,y=row*cell;
 c.beginPath();c.moveTo(x,y-cell/2);c.lineTo(x+cell/2,y);c.lineTo(x,y+cell/2);c.lineTo(x-cell/2,y);c.closePath();c.fill();
 }
 c.globalAlpha=opacity*.32;c.strokeStyle=settings.accent;c.lineWidth=d*.0025;c.setLineDash([d*.008,d*.009]);
 for(let i=-7;i<=7;i++){c.beginPath();c.moveTo(i*cell-d,-d);c.lineTo(i*cell+d,d);c.stroke();c.beginPath();c.moveTo(i*cell+d,-d);c.lineTo(i*cell-d,d);c.stroke();}
 c.setLineDash([]);c.globalAlpha=opacity*.5;
 for(let i=0;i<13;i++){const x=Math.sin(i*5.2)*d*.43,y=Math.cos(i*3.7)*d*.44;heart(c,x,y,d*.022);c.fill();}
 }
 c.restore();
 const n=ease((q-.48)/.32);if(n>0){
 c.save();c.globalAlpha*=n;c.scale(.92+.08*n,.92+.08*n);
 const lines=(settings.nickname||'네이').split('/').map(x=>x.trim()).filter(Boolean).slice(0,2);if(!lines.length)lines.push('네이');
 let fs=d*settings.size/100;c.font=`${fs}px "${settings.font}", sans-serif`;
 const width=Math.max(...lines.map(x=>c.measureText(x).width));if(width>d*.72)fs*=d*.72/width;
 c.font=`${fs}px "${settings.font}", sans-serif`;c.textAlign='center';c.textBaseline='middle';c.lineJoin='round';
 lines.forEach((line,i)=>{const y=(i-(lines.length-1)/2)*fs*1.08;c.strokeStyle=settings.edge;c.lineWidth=Math.max(1,fs*.12);c.strokeText(line,0,y);c.fillStyle=settings.text;c.fillText(line,0,y);});c.restore();
 }c.restore();
 }
 return {settings,total,ring,ringAngle,overlay,onChange(fn){changed=fn;},ready:()=>Promise.all([fontLoad(),settings.effect==='heart'?cloudReady:Promise.resolve()])};
})();
