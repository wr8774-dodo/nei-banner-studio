'use strict';
// Numeric companions use the same events as sliders, including grouped history.
(()=>{
 const valueProperty=Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value');
 function enhance(range){
  if(range.dataset.numericControl)return;
  range.dataset.numericControl='true';
  const number=document.createElement('input');number.type='number';number.className='range-number';
  number.min=range.min||'0';number.max=range.max||'100';number.step=range.step||'1';number.value=range.value;
  number.setAttribute('aria-label',(range.getAttribute('aria-label')||range.closest('label')?.textContent.replace(/\s+/g,' ').trim()||'조절 값')+' 숫자 입력');
  const row=document.createElement('span');row.className='range-with-number';range.before(row);row.append(range,number);
  let editing=false;
  const sync=()=>{if(!editing)number.value=range.value;number.disabled=range.disabled;};
  Object.defineProperty(range,'value',{configurable:true,get(){return valueProperty.get.call(this);},set(value){valueProperty.set.call(this,value);sync();}});
  const emit=type=>range.dispatchEvent(new Event(type,{bubbles:true}));
  number.addEventListener('focus',()=>{editing=true;emit('focus');});
  function apply(commit){
   if(range.matches(':disabled'))return;
   const v=number.valueAsNumber,lo=Number(range.min||0),hi=Number(range.max||100);
   if(Number.isFinite(v)&&(commit||(v>=lo&&v<=hi))){range.value=Math.max(lo,Math.min(hi,v));emit('input');}
   if(commit){editing=false;sync();emit('change');}
  }
  number.addEventListener('input',()=>apply(false));
  number.addEventListener('change',()=>apply(true));
  number.addEventListener('blur',()=>{editing=false;sync();});
  number.addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();apply(true);number.blur();}});
  range.addEventListener('input',sync);range.addEventListener('change',sync);
  new MutationObserver(sync).observe(range,{attributes:true,attributeFilter:['disabled']});
  sync();
 }
 function scan(){document.querySelectorAll('input[type="range"]').forEach(enhance);}
 scan();new MutationObserver(scan).observe(document.body,{childList:true,subtree:true});
})();
