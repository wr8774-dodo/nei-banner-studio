'use strict';
(()=>{
 const $=id=>document.getElementById(id),host=document.querySelector('.avatar-controls'),work=document.querySelector('.avatar-work');
 function section(title,subtitle,open=false){const d=document.createElement('section');d.className='avatar-panel';d.open=open;const s=document.createElement('header');const strong=document.createElement('strong');strong.textContent=title;const small=document.createElement('span');small.textContent=subtitle;s.className='avatar-panel-heading';s.append(strong,small);const body=document.createElement('div');body.className='avatar-panel-body';d.append(s,body);return {d,body};}
 const video=section('01  영상','파일 · 위치 · 재생 구간',true),frame=section('02  원형 틀','색상 · 그라데이션 · 회전'),effect=section('03  배경과 닉네임','패턴 · 글씨 · 등장 시간');
 host.append(video.d,frame.d,effect.d);
 const move=(body,id,label=false)=>{const node=$(id);body.append(label?node.closest('label'):node);};
 for(const id of ['animUpload','animFile','animFileName'])move(video.body,id);
 move(video.body,'animZoom',true);video.body.append($('animX').closest('.two'));move(video.body,'animRecenter');
 const exportBox=work.querySelector('.settings');video.body.append($('animStart').closest('.anim-grid'));move(video.body,'animVideoInfo');
 move(frame.body,'animSize',true);move(frame.body,'animBorder',true);move(frame.body,'animBorderColor',true);
 const fx=document.querySelector('.profile-fx'),parts=[...fx.children];
 for(const node of [...parts[0].children])if(node.tagName!=='SUMMARY')frame.body.append(node);
 for(const node of [...parts[1].children])if(node.tagName!=='SUMMARY')effect.body.append(node);
 frame.body.append($('fxPatternControls'));
 const fxRestart=$('fxRestart');fxRestart.classList.remove('full');fxRestart.textContent='처음부터 재생';work.querySelector('.sectionhead').append(fxRestart);
 host.replaceChildren($('animSelected'),video.d,frame.d,effect.d);
 const exportPanel=section('04  저장','크기 · 형식 · 다운로드',true);exportBox.before(exportPanel.d);for(const n of [...exportBox.children])if(!n.classList?.contains('sectionhead'))exportPanel.body.append(n);exportBox.remove();
 $('animAPNG').classList.remove('primary');$('animGIF').classList.add('primary');$('animGIF').textContent='GIF 저장 · 2MB 미만';$('animPNG').textContent='현재 장면 PNG';$('animAPNG').textContent='APNG 보관용';
 exportPanel.body.querySelector('.anim-exports').prepend($('animGIF'));
 $('animBorderColor').closest('label').hidden=true;
 frame.body.prepend($('fxRing').closest('label'));
 $('fxRing').closest('label').after($('fxPatternControls'));
 $('fxPatternControls').hidden=false;
 $('fxPatternFrame').closest('label').firstChild.textContent='틀 색 1';
 function update(){const kind=$('fxEffect').value;
 $('fxRingColor').closest('label').hidden=$('fxRing').value!=='broken';
 $('fxPause').closest('label').hidden=$('fxMotion').value!=='pause';
 const off=kind==='none';for(const id of ['fxNickname','fxFont','fxSize','fxAt','fxHold'])$(id).closest('label').hidden=off;
 $('fxText').closest('.two').hidden=off;
 }
 $('fxRing').addEventListener('input',update);
 $('fxEffect').addEventListener('input',update);$('fxMotion').addEventListener('input',update);update();
})();
