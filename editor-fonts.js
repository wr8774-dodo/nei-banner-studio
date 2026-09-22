'use strict';
const bannerFonts=[['Jua','주아 · 둥근 제목'],['Dongle','동글 · 통통한 글씨'],['Cute Font','큐트 폰트 · 귀여운 글씨'],['Gaegu','개구 · 자유로운 손글씨'],['Gamja Flower','감자꽃 · 부드러운 손글씨'],['Hi Melody','하이 멜로디 · 아기자기'],['Single Day','싱글 데이 · 둥근 손글씨'],['Do Hyeon','도현 · 또렷한 제목'],['Black Han Sans','검은고딕 · 두꺼운 제목'],['Galmuri11','갈무리11 · 도트 글씨']];
const fontRequests=new Map();
for(const [family,label]of bannerFonts){const o=document.createElement('option');o.value=`"${family}"`;o.textContent=label;$('font').append(o);}
function loadBannerFont(family,text='네이 배너 ABC'){
 const entry=bannerFonts.find(([name])=>`"${name}"`===family);if(!entry)return Promise.resolve();
 const name=entry[0];if(!fontRequests.has(name)){
 const promise=new Promise((resolve,reject)=>{const link=document.createElement('link');link.rel='stylesheet';link.href=name==='Galmuri11'?'https://cdn.jsdelivr.net/npm/galmuri/dist/galmuri.css':`https://fonts.googleapis.com/css2?family=${encodeURIComponent(name).replace(/%20/g,'+')}&display=swap`;link.onload=()=>resolve();link.onerror=()=>{link.remove();reject(new Error('글꼴 연결 실패'));};document.head.append(link);});
 fontRequests.set(name,promise);promise.catch(()=>fontRequests.delete(name));
 }
 return Promise.race([fontRequests.get(name).then(()=>document.fonts.load(`400 48px ${family}`,text||'네이')).then(faces=>{if(!faces.length)throw new Error('글꼴을 불러오지 못했어요.');}),new Promise((_,reject)=>setTimeout(()=>reject(new Error('글꼴 로딩 시간이 초과됐어요.')),15000))]);
}
let fontLoadTicket=0;
async function updateBannerFont(){const x=item();if(!x||x.type!=='text')return;const ticket=++fontLoadTicket;$('fontStatus').textContent='글꼴 불러오는 중…';try{await loadBannerFont(x.font,x.text);if(ticket!==fontLoadTicket)return;$('fontPreview').style.fontFamily=x.font;$('fontPreview').textContent=x.text||'네이의 배너 스튜디오';$('fontStatus').textContent='';draw();}catch(e){if(ticket===fontLoadTicket)$('fontStatus').textContent='글꼴을 불러오지 못했어요. 인터넷 연결을 확인하고 다시 선택해 주세요.';}}
$('font').addEventListener('input',updateBannerFont);$('font').addEventListener('change',updateBannerFont);$('text').addEventListener('input',updateBannerFont);
const fontsSyncBefore=syncObject;syncObject=function(){fontsSyncBefore();const x=item();if(x?.type==='text'){$('fontPreview').style.fontFamily=x.font;$('fontPreview').textContent=x.text||'네이의 배너 스튜디오';}};
const exportBeforeFonts=exportImage;
exportImage=async function(split){try{await Promise.all(layers.filter(x=>x.type==='text'&&!x.hidden).map(x=>loadBannerFont(x.font,x.text)));return await exportBeforeFonts(split);}catch(e){message('글꼴을 불러오지 못해 저장을 멈췄어요. 연결을 확인한 뒤 다시 저장해 주세요.');}};
