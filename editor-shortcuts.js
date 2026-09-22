'use strict';
(()=>{
 let clipboard=[];
 const clone=v=>Array.isArray(v)?v.map(clone):v&&Object.getPrototypeOf(v)===Object.prototype?Object.fromEntries(Object.entries(v).map(([k,x])=>[k,clone(x)])):v;
 function choose(xs){chosen=new Set(xs.map(x=>x.id));selected=xs.at(-1)?.id||null;$('editGradient').checked=false;refresh();}
 function copyLayers(src,offset=true){if(!src.length)return [];if(src.length+layers.length>40){message('복사하면 40개를 넘어요. 요소를 줄여주세요.');return [];}
 remember();const groups=new Map();const copies=src.map(x=>{if(x.group&&!groups.has(x.group))groups.set(x.group,'group-'+groupSerial++);return {...clone(x),id:nextId++,x:x.x+(offset?W*.02:0),y:x.y+(offset?H*.04:0),locked:false,group:x.group?groups.get(x.group):null};});layers.push(...copies);choose(copies);return copies;}
 const bar=document.createElement('div');bar.innerHTML='<div class="two"><button id="selectAllElements">전체 선택</button><button id="selectCloudElements">구름 모두 선택</button></div><div class="two"><button id="selectSameElements">같은 종류 선택</button><button id="clearElements">선택 해제</button></div><div class="two"><button id="lockElements">선택 모두 잠금</button><button id="unlockElements">선택 잠금 해제</button></div><p class="small muted">Shift+클릭: 여러 개 선택 · Ctrl+A: 전체 선택 · Ctrl+C/V: 복사/붙여넣기 · Alt+드래그: 복제 이동</p>';
 $('selectionInfo').before(bar);
 $('selectAllElements').onclick=()=>{if(!busy)choose(layers);};
 $('selectCloudElements').onclick=()=>{if(!busy)choose(layers.filter(x=>x.cloudStack||/cloud/i.test(x.asset||'')));};
 $('selectSameElements').onclick=()=>{const x=item();if(!busy&&x)choose(layers.filter(y=>y.type===x.type&&y.asset===x.asset));};
 $('clearElements').onclick=()=>{if(!busy)choose([]);};
 for(const [id,value] of [['lockElements',true],['unlockElements',false]])$(id).onclick=()=>{const xs=selectedLayers();if(busy||!xs.length)return;remember();xs.forEach(x=>x.locked=value);refresh();message(`${xs.length}개 ${value?'잠금':'잠금 해제'} 완료`);};
 window.addEventListener('keydown',e=>{if(busy||document.body.classList.contains('animation-mode')||e.target.closest?.('input,textarea,select,[contenteditable="true"]')||!(e.ctrlKey||e.metaKey))return;const k=e.key.toLowerCase();if(!['a','c','v'].includes(k))return;if(k==='v'&&!clipboard.length)return;e.preventDefault();if(k==='a')choose(layers);if(k==='c'){clipboard=selectedLayers().map(clone);message(`${clipboard.length}개 복사했어요.`);}if(k==='v')copyLayers(clipboard);});
 const down=canvas.onpointerdown;
 canvas.onpointerdown=e=>{if(!e.altKey||busy||e.button!==0)return down(e);const p=point(e),hit=[...layers].reverse().find(x=>{if(x.hidden||x.locked)return false;const l=local(p,x),g=geometry(x);return Math.abs(l.x)<=g.w/2&&Math.abs(l.y)<=g.h/2;});if(!hit)return down(e);e.preventDefault();canvas.focus();if(!chosen.has(hit.id))selectLayer(hit);const copies=copyLayers(selectedLayers(true),false);if(!copies.length)return;drag={mode:'multiMove',start:p,items:copies.map(x=>({...x}))};canvas.setPointerCapture(e.pointerId);};
})();
