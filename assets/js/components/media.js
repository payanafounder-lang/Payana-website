/* ---------- MEDIA (photos and videos in posts) ----------
   Shared by the feed, Create post, the full post page (#post-<id>) and profile grids.
   - carousel(p): Instagram-style swipe carousel. Shows every photo whole, at its real
     shape (between 4:5 and 1.91:1), with a blurred fill instead of cropping.
   - openEditor / openVideoEditor: crop, rotate, straighten, flip, adjust, filters;
     video trim, adjust and sound. Everything runs in the browser.
   - postMenu(p): the ⋯ menu. Your posts: edit, edit photo, delete. Others: report, hide.
   A post's photos live in p.media: numbers (img/<n>.webp), or {t:'i'|'v', s, w, h, ...}
   for uploads. Demo: uploads and edits stay on this page only and are never uploaded. */
/* ---------- MEDIA: shared helpers ---------- */
const DIM=new Map();
const clampAR=r=>Math.min(1.91,Math.max(.8,r||.8));
const msrc=x=>{const s=String(x); return /^(data:|blob:|img\/|https?:)/.test(s)?s:`img/${s}.webp`};
function mitems(p){return (p.media||(p.img!=null?[p.img]:[])).map(m=>m&&typeof m==='object'?m:{t:'i',s:msrc(m),raw:m})}
// Keep p.img (used by Saved and older screens) pointing at the first photo.
function syncImg(p){const f=mitems(p)[0]; if(!f||f.t==='v') delete p.img; else p.img=f.raw!=null?f.raw:f.s}
const vfilter=a=>a?`brightness(${1+a.b/100}) contrast(${1+a.c/100}) saturate(${1+a.s/100})`:'none';
function carousel(p,opt={}){
  const M=mitems(p); if(!M.length) return '';
  const f=M[0], r=f.w?f.w/f.h:DIM.get(f.s);
  return `<div class="car${opt.cls?' '+opt.cls:''}" data-car style="--arn:${clampAR(r)}"${r?'':' data-ar-pending'}>
   <div class="car-track">${M.map((m,i)=>`<div class="car-slide">${m.t==='v'
     ?`<video class="car-main" src="${m.s}" playsinline loop muted preload="metadata" data-trim="${m.trim?m.trim.join(','):''}" style="filter:${vfilter(m.adj)}"></video><button class="car-play" type="button" data-play aria-label="Play video">${I('play')}</button>${m.noSound?'':`<button class="car-mute" type="button" data-mute aria-label="Turn sound on">${I('mute')}</button>`}`
     :`<img class="car-bg" src="${m.s}" alt="" aria-hidden="true"><img class="car-main" src="${m.s}" alt="${esc(opt.alt||'')}"${i?' loading="lazy"':''} draggable="false">`}</div>`).join('')}</div>
   ${M.length>1?`<span class="car-count">1/${M.length}</span><button class="car-nav prev" type="button" data-cnav="-1" aria-label="Previous" hidden>‹</button><button class="car-nav next" type="button" data-cnav="1" aria-label="Next">›</button><div class="car-dots">${M.map((_,i)=>`<i class="${i?'':'on'}"></i>`).join('')}</div>`:''}
   <span class="heartpop" aria-hidden="true">${I('heart')}</span></div>`;
}
function carIdx(c){const t=c&&c.querySelector('.car-track'); return t&&t.clientWidth?Math.round(t.scrollLeft/t.clientWidth):0}
function carUpd(c){const n=c.querySelectorAll('.car-slide').length, i=carIdx(c), ct=c.querySelector('.car-count'); if(ct) ct.textContent=`${i+1}/${n}`;
  c.querySelectorAll('.car-dots i').forEach((d,k)=>d.classList.toggle('on',k===i));
  const pv=c.querySelector('.prev'), nx=c.querySelector('.next'); if(pv){pv.hidden=i===0; nx.hidden=i===n-1}
  c.querySelectorAll('video').forEach((v,k)=>{if(k!==i&&!v.paused){v.pause(); v.parentNode.classList.remove('playing')}});
  const strip=c.parentNode&&c.parentNode.querySelector('.cstrip'); if(strip) strip.querySelectorAll('.cth').forEach((t,k)=>t.classList.toggle('on',k===i))}
function carGo(c,i){if(!c) return; const t=c.querySelector('.car-track'), n=c.querySelectorAll('.car-slide').length; t.scrollTo({left:Math.max(0,Math.min(n-1,i))*t.clientWidth,behavior:reduce?'auto':'smooth'})}
function carSet(c,i){if(!c) return; requestAnimationFrame(()=>{const t=c.querySelector('.car-track'); t.scrollLeft=i*t.clientWidth; carUpd(c)})}
function heartPop(c){const h=c&&c.querySelector('.heartpop'); if(!h) return; h.classList.remove('go'); void h.offsetWidth; h.classList.add('go')}
function dblTap(e,fn){const sl=e.target.closest('.car-slide'); if(!sl||e.target.closest('button')||sl.querySelector('video')) return false;
  const now=Date.now(); if(dblTap.el===sl&&now-dblTap.t<320){dblTap.t=0; fn(sl); return true} dblTap.t=now; dblTap.el=sl; return false}
document.addEventListener('scroll',e=>{const t=e.target; if(t.classList&&t.classList.contains('car-track')){cancelAnimationFrame(t._r); t._r=requestAnimationFrame(()=>carUpd(t.parentNode))}},true);
function arReady(el,r){const sv=el.getAttribute('src'); if(r) DIM.set(sv,r); const c=el.closest('[data-ar-pending]'); if(c&&r&&el.closest('.car-slide')===c.querySelector('.car-slide')){c.style.setProperty('--arn',clampAR(r)); c.removeAttribute('data-ar-pending')}}
document.addEventListener('load',e=>{const im=e.target; if(im.tagName==='IMG'&&im.classList.contains('car-main')) arReady(im,im.naturalWidth/im.naturalHeight)},true);
document.addEventListener('loadedmetadata',e=>{const v=e.target; if(v.tagName!=='VIDEO'||!v.classList.contains('car-main')) return; arReady(v,v.videoWidth/v.videoHeight); const tr=v.dataset.trim; if(tr) v.currentTime=+tr.split(',')[0]},true);
document.addEventListener('timeupdate',e=>{const v=e.target, tr=v.dataset&&v.dataset.trim; if(!tr) return; const [a,b]=tr.split(',').map(Number); if(v.currentTime>b||v.currentTime<a-.25) v.currentTime=a},true);
document.addEventListener('click',e=>{
  const nb=e.target.closest('[data-cnav]'); if(nb){const c=nb.closest('[data-car]'); carGo(c,carIdx(c)+(+nb.dataset.cnav)); return}
  const mu=e.target.closest('[data-mute]'); if(mu){const v=mu.closest('.car-slide').querySelector('video'); v.muted=!v.muted; mu.innerHTML=I(v.muted?'mute':'vol'); mu.setAttribute('aria-label',v.muted?'Turn sound on':'Mute'); return}
  const pl=e.target.closest('[data-play]')||e.target.closest('.car-slide video,.ed-vbox video'); if(pl){const box=pl.closest('.car-slide,.ed-vbox'), v=box.querySelector('video'); if(v.paused){v.play().catch(()=>{}); box.classList.add('playing')} else {v.pause(); box.classList.remove('playing')}}
});

/* ---------- MODAL STACK ---------- */
const MODALS=[];
function openModal(html,{label='',cls='',onClose,onKey}={}){
  const m=document.createElement('div'); m.className='modal '+cls; m.setAttribute('role','dialog'); m.setAttribute('aria-modal','true'); m.setAttribute('aria-label',label); m.innerHTML=html; document.body.appendChild(m);
  const prev=document.activeElement;
  const o={m,onKey,close(){if(o.done) return; o.done=true; m.remove(); MODALS.splice(MODALS.indexOf(o),1); removeEventListener('hashchange',o.close); onClose&&onClose(); if(prev&&prev.isConnected&&prev.focus) prev.focus({preventScroll:true})}};
  MODALS.push(o); addEventListener('hashchange',o.close);
  m.addEventListener('click',e=>{if(e.target===m||e.target.closest('[data-close]')) o.close()});
  return o;
}
addEventListener('keydown',e=>{const o=MODALS[MODALS.length-1]; if(!o) return; if(e.key==='Escape'){e.stopImmediatePropagation(); e.preventDefault(); o.close(); return} o.onKey&&o.onKey(e)},true);

/* ---------- FILE READING ---------- */
function loadImg(f){return new Promise(res=>{const u=URL.createObjectURL(f), im=new Image();
  im.onload=()=>{const k=Math.min(1,2048/Math.max(im.naturalWidth,im.naturalHeight)), W=Math.round(im.naturalWidth*k), H=Math.round(im.naturalHeight*k), c=document.createElement('canvas'); c.width=W; c.height=H; const x=c.getContext('2d'); x.fillStyle='#fff'; x.fillRect(0,0,W,H); x.drawImage(im,0,0,W,H); URL.revokeObjectURL(u); const s=c.toDataURL('image/jpeg',.9); res({t:'i',s,orig:s,w:W,h:H})};
  im.onerror=()=>{URL.revokeObjectURL(u); res(null)}; im.src=u})}
function loadVid(f){return new Promise(res=>{const u=URL.createObjectURL(f), v=document.createElement('video'); v.preload='metadata'; v.muted=true;
  v.onloadedmetadata=()=>res(v.videoWidth?{t:'v',s:u,w:v.videoWidth,h:v.videoHeight,dur:v.duration}:null); v.onerror=()=>{URL.revokeObjectURL(u); res(null)}; v.src=u})}
async function readMedia(files){const out=[];
  for(const f of files){
    if(f.type.startsWith('video/')||/\.(mp4|mov|webm|m4v)$/i.test(f.name)){if(f.size>200*1024*1024){toast(`${f.name} is over 200 MB`); continue} const v=await loadVid(f); v?out.push(v):toast(`Couldn't play ${f.name} in this browser. Try MP4.`)}
    else {const i=await loadImg(f); i?out.push(i):toast(`Couldn't open ${f.name}. Try JPG, PNG or WebP.`)}
  } return out}
function editMedia(m,done,opt={}){(m.t==='v'?openVideoEditor:openEditor)(m,{...opt,onDone:done})}
function thumbHTML(m,i,rm){return `<div class="cth" data-ci="${i}" role="button" tabindex="0" aria-label="Show item ${i+1}">${m.t==='v'?`<video src="${m.s}#t=0.1" muted playsinline preload="metadata"></video><span class="cth-v">${I('play')}</span>`:`<img src="${m.s}" alt="">`}<span class="cth-n">${i+1}</span><button type="button" class="cth-ed" data-cedit="${i}" aria-label="Edit item ${i+1}">${I('edit')}</button>${rm?`<button type="button" class="cth-rm" data-crm="${i}" aria-label="Remove item ${i+1}">×</button>`:''}</div>`}

/* ---------- PHOTO EDITOR ---------- */
const ADJ=[['b','Brightness',-100],['c','Contrast',-100],['s','Saturation',-100],['w','Warmth',-100],['f','Fade',0],['v','Vignette',0]];
const FLT=[['Normal',{}],['Vivid',{c:15,s:35}],['Warm',{w:35,s:10,b:4}],['Cool',{w:-35,c:6}],['Golden',{w:22,b:8,s:15,v:25}],['Mono',{s:-100,c:15}],['Faded',{f:45,c:-15,s:-15}],['Drama',{c:35,s:-10,v:45,b:-6}]];
const RAT=[['orig','Original'],['1','Square'],['0.8','4:5'],['1.7778','16:9']];
const ED0=()=>({rot:0,flip:false,str:0,ar:'orig',zoom:1,px:0,py:0,b:0,c:0,s:0,w:0,f:0,v:0,flt:'Normal'});
function applyAdj(x,W,H,e){
  if(!(e.b||e.c||e.s||e.w||e.f||e.v)) return;
  const d=x.getImageData(0,0,W,H), p=d.data, B=e.b*.7, C=e.c>=0?1+e.c/100:1+e.c/150, S_=1+e.s/100, Wm=e.w*.28, F=e.f/100, V=e.v/100, L=new Float32Array(256);
  for(let i=0;i<256;i++) L[i]=(i+B-128)*C+128;
  for(let y=0;y<H;y++){const dy=(y-H/2)/(H/2), dy2=dy*dy;
    for(let xx=0;xx<W;xx++){const i=(y*W+xx)*4; let r=L[p[i]], g=L[p[i+1]], b=L[p[i+2]];
      if(S_!==1){const l=.299*r+.587*g+.114*b; r=l+(r-l)*S_; g=l+(g-l)*S_; b=l+(b-l)*S_}
      if(Wm){r+=Wm; g+=Wm*.15; b-=Wm}
      if(F){r=r*(1-.25*F)+40*F; g=g*(1-.25*F)+38*F; b=b*(1-.25*F)+34*F}
      if(V){const dx=(xx-W/2)/(W/2), k=1-V*.55*(dx*dx+dy2)/2; r*=k; g*=k; b*=k}
      p[i]=r; p[i+1]=g; p[i+2]=b}}
  x.putImageData(d,0,0);
}
function openEditor(item,opt={}){
  const e=Object.assign(ED0(),item.ed||{}); if(opt.lock) e.ar=String(opt.lock);
  let tab='crop', ready=false, cmp=false, fw=0, fh=0, raf=0, ro=null; const img=new Image();
  const o=openModal(`<div class="ed" data-tab="crop">
   <header class="ed-top"><button type="button" class="ghost" data-close>Cancel</button><b>${esc(opt.title||'Edit photo')}</b><button type="button" class="btn btn-primary btn-sm" data-done>Done</button></header>
   <div class="ed-stage"><div class="ed-frame${opt.round?' round':''}"><canvas aria-label="Photo preview. Drag to reposition, pinch or scroll to zoom."></canvas><div class="ed-grid"></div></div>
    <p class="ed-load">Loading photo…</p><button type="button" class="ed-cmp" data-cmp aria-label="Hold to see the original">${I('eye')}<span>Hold to compare</span></button></div>
   <div class="ed-tools"><div class="ed-tabs" role="tablist">${[['crop','crop','Crop'],['adjust','sliders','Adjust'],['filters','magic','Filters']].map(([k,ic,l])=>`<button type="button" role="tab" data-tab="${k}" aria-selected="${k==='crop'}">${I(ic)}${l}</button>`).join('')}</div><div class="ed-pane"></div></div></div>`,
   {cls:'ed-modal',label:opt.title||'Edit photo',onClose:()=>{ro&&ro.disconnect(); cancelAnimationFrame(raf)}});
  const m=o.m, cv=m.querySelector('canvas'), ctx=cv.getContext('2d',{willReadFrequently:true}), stage=m.querySelector('.ed-stage'), pane=m.querySelector('.ed-pane');
  const dims=()=>e.rot%180?[img.height,img.width]:[img.width,img.height];
  const R=()=>{const [iw,ih]=dims(); return e.ar==='orig'?iw/ih:+e.ar};
  const scale=(W,H,ed)=>{const [iw,ih]=dims(), a=ed.str*Math.PI/180, ca=Math.abs(Math.cos(a)), sa=Math.abs(Math.sin(a)); return [Math.max((W*ca+H*sa)/iw,(W*sa+H*ca)/ih)*ed.zoom,iw,ih]};
  const ok=(px,py)=>{const W=R(), H=1, [s,iw,ih]=scale(W,H,e), a=e.str*Math.PI/180, c=Math.cos(a), sn=Math.sin(a);
    for(const [x,y] of [[-1,-1],[1,-1],[1,1],[-1,1]]){const cx=x*W/2-px*W, cy=y*H/2-py*H, u=cx*c+cy*sn, v=-cx*sn+cy*c; if(Math.abs(u)>iw*s/2+1e-6||Math.abs(v)>ih*s/2+1e-6) return false} return true};
  const clampPan=()=>{if(ok(e.px,e.py)) return; let lo=0,hi=1; for(let k=0;k<24;k++){const mid=(lo+hi)/2; ok(e.px*mid,e.py*mid)?lo=mid:hi=mid} e.px*=lo; e.py*=lo};
  const clampFrom=(x0,y0)=>{const tx=e.px, ty=e.py, srch=(f)=>{let lo=0,hi=1; for(let k=0;k<20;k++){const mid=(lo+hi)/2; f(mid)?lo=mid:hi=mid} return lo};
    let x=ok(tx,y0)?tx:x0+(tx-x0)*srch(t=>ok(x0+(tx-x0)*t,y0)); let y=ok(x,ty)?ty:y0+(ty-y0)*srch(t=>ok(x,y0+(ty-y0)*t)); e.px=x; e.py=y};
  function paint(x,W,H,ed,adj){const [s]=scale(W,H,ed), sg=ed.flip?-1:1; x.save(); x.setTransform(1,0,0,1,0,0); x.fillStyle='#000'; x.fillRect(0,0,W,H);
    x.translate(W/2+ed.px*W,H/2+ed.py*H); x.scale(sg,1); x.rotate(sg*(ed.str+ed.rot)*Math.PI/180); x.imageSmoothingEnabled=true; x.imageSmoothingQuality='high';
    x.drawImage(img,-img.width*s/2,-img.height*s/2,img.width*s,img.height*s); x.restore(); if(adj) applyAdj(x,W,H,ed)}
  const draw=()=>{if(!ready) return; cancelAnimationFrame(raf); raf=requestAnimationFrame(()=>paint(ctx,cv.width,cv.height,e,!cmp))};
  function layout(){if(!ready) return; const W=stage.clientWidth-32, H=stage.clientHeight-32, r=R(); if(W<=0||H<=0) return;
    if(W/H>r){fh=H; fw=H*r} else {fw=W; fh=W/r} fw=Math.max(40,Math.floor(fw)); fh=Math.max(40,Math.floor(fh));
    const d=Math.min(2,devicePixelRatio||1); cv.width=Math.round(fw*d); cv.height=Math.round(fh*d); cv.style.width=fw+'px'; cv.style.height=fh+'px'; draw()}
  const sl=(k,l,mn,mx,v,u='')=>`<div class="ed-row"><label for="eds-${k}">${l}<output id="edo-${k}">${v>0&&mn<0?'+':''}${v}${u}</output></label><input type="range" id="eds-${k}" data-k="${k}" min="${mn}" max="${mx}" step="1" value="${v}"></div>`;
  function thumbs(){pane.querySelectorAll('.ed-flt canvas').forEach((c,i)=>{const x=c.getContext('2d'); paint(x,c.width,c.height,{...e,px:0,py:0,b:0,c:0,s:0,w:0,f:0,v:0,...FLT[i][1]},true)})}
  function panel(){
    if(tab==='crop') pane.innerHTML=`${opt.lock?'':`<div class="ed-row"><span class="ed-lab">Aspect ratio</span><div class="ed-chips">${RAT.map(([v,l])=>`<button type="button" class="ed-chip" data-ar="${v}" aria-pressed="${e.ar===v}">${l}</button>`).join('')}</div></div>`}
      ${sl('zoom','Zoom',100,400,Math.round(e.zoom*100),'%')}${sl('str','Straighten',-45,45,e.str,'°')}
      <div class="ed-row"><span class="ed-lab">Rotate and flip</span><div class="ed-chips"><button type="button" class="ed-chip" data-act="rl">${I('rotl')}Left</button><button type="button" class="ed-chip" data-act="rr">${I('rotr')}Right</button><button type="button" class="ed-chip" data-act="flip" aria-pressed="${e.flip}">${I('flip')}Flip</button></div></div>
      <p class="ed-note">Drag the photo to choose what stays in the frame.</p><button type="button" class="ed-reset" data-act="rcrop">Reset crop</button>`;
    else if(tab==='adjust') pane.innerHTML=ADJ.map(([k,l,mn])=>sl(k,l,mn,100,e[k])).join('')+`<p class="ed-note">Double-tap a slider to reset it.</p><button type="button" class="ed-reset" data-act="radj">Reset adjustments</button>`;
    else {pane.innerHTML=`<div class="ed-flts">${FLT.map(([n],i)=>`<button type="button" class="ed-flt" data-flt="${i}" aria-pressed="${e.flt===n}"><canvas width="140" height="140"></canvas>${n}</button>`).join('')}</div><p class="ed-note">Fine-tune any filter in Adjust.</p>`; if(ready) thumbs()}
  }
  const syncOut=k=>{const r=pane.querySelector('#eds-'+k), out=pane.querySelector('#edo-'+k); if(!r) return; const v=k==='zoom'?Math.round(e.zoom*100):e[k]; r.value=v; out.textContent=(v>0&&+r.min<0?'+':'')+v+(k==='zoom'?'%':k==='str'?'°':'')};
  m.addEventListener('click',ev=>{
    const tb=ev.target.closest('[data-tab]'); if(tb&&tb.closest('.ed-tabs')){tab=tb.dataset.tab; m.querySelector('.ed').dataset.tab=tab; m.querySelectorAll('.ed-tabs button').forEach(b=>b.setAttribute('aria-selected',b===tb)); panel(); return}
    const ar=ev.target.closest('[data-ar]'); if(ar){e.ar=ar.dataset.ar; e.px=e.py=0; layout(); panel(); return}
    const fl=ev.target.closest('[data-flt]'); if(fl){const [n,v]=FLT[+fl.dataset.flt]; Object.assign(e,{b:0,c:0,s:0,w:0,f:0,v:0},v,{flt:n}); pane.querySelectorAll('[data-flt]').forEach(b=>b.setAttribute('aria-pressed',b===fl)); draw(); return}
    const ac=ev.target.closest('[data-act]'); if(ac){const a=ac.dataset.act;
      if(a==='rl'||a==='rr'){e.rot=(e.rot+(a==='rr'?90:270))%360; e.px=e.py=0; layout()}
      if(a==='flip'){e.flip=!e.flip; e.px=-e.px; ac.setAttribute('aria-pressed',e.flip); draw()}
      if(a==='rcrop'){Object.assign(e,{rot:0,flip:false,str:0,zoom:1,px:0,py:0}); if(!opt.lock) e.ar='orig'; layout(); panel()}
      if(a==='radj'){Object.assign(e,{b:0,c:0,s:0,w:0,f:0,v:0,flt:'Normal'}); panel(); draw()}
      return}
    if(ev.target.closest('[data-done]')&&ready){const r=R(); let W,H;
      if(opt.out){[W,H]=opt.out} else {const [iw,ih]=dims(), Lg=Math.round(Math.min(1600,Math.max(iw,ih)/Math.max(1,e.zoom*.75))); if(r>=1){W=Lg; H=Math.round(Lg/r)} else {H=Lg; W=Math.round(Lg*r)}}
      const c=document.createElement('canvas'); c.width=W; c.height=H; paint(c.getContext('2d'),W,H,e,true);
      const out={t:'i',s:c.toDataURL('image/jpeg',.88),orig:item.orig||item.s,ed:{...e},w:W,h:H}; o.close(); opt.onDone&&opt.onDone(out)}
  });
  pane.addEventListener('input',ev=>{const k=ev.target.dataset.k; if(!k) return; const v=+ev.target.value;
    if(k==='zoom'){e.zoom=v/100; clampPan()} else {e[k]=v; if(k==='str') clampPan()} syncOut(k); draw()});
  pane.addEventListener('dblclick',ev=>{const k=ev.target.dataset&&ev.target.dataset.k; if(!k) return; if(k==='zoom') e.zoom=1; else e[k]=0; clampPan(); syncOut(k); draw()});
  const pts=new Map(); let st=null;
  const snap=()=>({px:e.px,py:e.py,zoom:e.zoom,pts:new Map(pts)});
  cv.addEventListener('pointerdown',ev=>{cv.setPointerCapture(ev.pointerId); pts.set(ev.pointerId,[ev.clientX,ev.clientY]); st=snap()});
  cv.addEventListener('pointermove',ev=>{if(!st||!pts.has(ev.pointerId)) return; pts.set(ev.pointerId,[ev.clientX,ev.clientY]);
    if(pts.size===1&&st.pts.size===1){const [x0,y0]=[...st.pts.values()][0], ox=e.px, oy=e.py; e.px=st.px+(ev.clientX-x0)/fw; e.py=st.py+(ev.clientY-y0)/fh; clampFrom(ox,oy); draw()}
    else if(pts.size>=2&&st.pts.size>=2){const a=[...pts.values()], b=[...st.pts.values()], d=Math.hypot(a[0][0]-a[1][0],a[0][1]-a[1][1]), d0=Math.hypot(b[0][0]-b[1][0],b[0][1]-b[1][1])||1; e.zoom=Math.min(4,Math.max(1,st.zoom*d/d0)); clampPan(); syncOut('zoom'); draw()}});
  const up=ev=>{pts.delete(ev.pointerId); st=pts.size?snap():null}; cv.addEventListener('pointerup',up); cv.addEventListener('pointercancel',up);
  stage.addEventListener('wheel',ev=>{if(!ready) return; ev.preventDefault(); e.zoom=Math.min(4,Math.max(1,e.zoom*Math.exp(-ev.deltaY*.0015))); clampPan(); syncOut('zoom'); draw()},{passive:false});
  const cb=m.querySelector('[data-cmp]'), cOn=ev=>{ev.preventDefault(); cmp=true; draw()}, cOff=()=>{if(cmp){cmp=false; draw()}};
  cb.addEventListener('pointerdown',cOn); ['pointerup','pointerleave','pointercancel'].forEach(t=>cb.addEventListener(t,cOff)); cb.addEventListener('contextmenu',ev=>ev.preventDefault());
  img.onload=()=>{ready=true; m.querySelector('.ed-load').remove(); layout(); panel(); ro=new ResizeObserver(layout); ro.observe(stage)};
  img.onerror=()=>{toast("Couldn't open this photo"); o.close()};
  img.src=item.orig||item.s; panel(); m.querySelector('[data-done]').focus();
}

/* ---------- VIDEO EDITOR ---------- */
function openVideoEditor(item,opt={}){
  const it={...item,adj:{b:0,c:0,s:0,...(item.adj||{})}}; let tab='trim', d=it.dur, a=0, b=0;
  const fmt=t=>{t=Math.max(0,t||0); return Math.floor(t/60)+':'+String(Math.floor(t%60)).padStart(2,'0')+'.'+Math.floor((t%1)*10)};
  const o=openModal(`<div class="ed" data-tab="trim"><header class="ed-top"><button type="button" class="ghost" data-close>Cancel</button><b>Edit video</b><button type="button" class="btn btn-primary btn-sm" data-done>Done</button></header>
   <div class="ed-stage"><div class="ed-vbox"><video src="${it.s}" playsinline preload="auto" muted style="filter:${vfilter(it.adj)}"></video><button type="button" class="car-play" data-play aria-label="Play">${I('play')}</button></div></div>
   <div class="ed-tools"><div class="ed-tabs" role="tablist">${[['trim','scissors','Trim'],['adjust','sliders','Adjust'],['sound','vol','Sound']].map(([k,ic,l])=>`<button type="button" role="tab" data-tab="${k}" aria-selected="${k==='trim'}">${I(ic)}${l}</button>`).join('')}</div><div class="ed-pane"></div></div></div>`,{cls:'ed-modal',label:'Edit video'});
  const m=o.m, v=m.querySelector('video'), pane=m.querySelector('.ed-pane'); v.muted=!!it.noSound;
  const fin=()=>d&&isFinite(d);
  const sl=(k,l,mn,mx,val,step=1,txt)=>`<div class="ed-row"><label for="evs-${k}">${l}<output id="evo-${k}">${txt??((val>0&&mn<0?'+':'')+val)}</output></label><input type="range" id="evs-${k}" data-k="${k}" min="${mn}" max="${mx}" step="${step}" value="${val}"></div>`;
  const tl=()=>{const s=pane.querySelector('.ed-tl span'); if(s){s.style.left=a/d*100+'%'; s.style.width=(b-a)/d*100+'%'} const n=pane.querySelector('#evlen'); if(n) n.textContent='Length '+fmt(b-a); v.dataset.trim=fin()?`${a},${b}`:''};
  function panel(){
    if(tab==='trim') pane.innerHTML=fin()?`<div class="ed-tl"><span></span></div>${sl('ts','Start',0,d.toFixed(1),a.toFixed(1),.1,fmt(a))}${sl('te','End',0,d.toFixed(1),b.toFixed(1),.1,fmt(b))}<p class="ed-note" id="evlen"></p><button type="button" class="ed-reset" data-act="rtrim">Use full video</button>`:`<p class="ed-note">Trimming isn't available for this video format.</p>`;
    else if(tab==='adjust') pane.innerHTML=[['b','Brightness'],['c','Contrast'],['s','Saturation']].map(([k,l])=>sl(k,l,-100,100,it.adj[k])).join('')+`<button type="button" class="ed-reset" data-act="radj">Reset adjustments</button>`;
    else pane.innerHTML=`<label class="toggle"><input type="checkbox" id="evsound"${it.noSound?'':' checked'}>Keep the original sound</label><p class="ed-note">Friends can turn sound on while watching. Switch this off to post the video silent.</p>`;
    if(tab==='trim') tl();
  }
  const init=()=>{d=v.duration; if(!fin()) d=0; const tr=it.trim; a=tr?tr[0]:0; b=tr?tr[1]:d; if(tr) v.currentTime=a; panel()};
  v.readyState>=1?init():v.addEventListener('loadedmetadata',init,{once:true});
  v.addEventListener('timeupdate',()=>{if(fin()&&(v.currentTime>b||v.currentTime<a-.25)) v.currentTime=a});
  m.addEventListener('click',ev=>{
    const tb=ev.target.closest('[data-tab]'); if(tb&&tb.closest('.ed-tabs')){tab=tb.dataset.tab; m.querySelectorAll('.ed-tabs button').forEach(x=>x.setAttribute('aria-selected',x===tb)); panel(); return}
    const ac=ev.target.closest('[data-act]'); if(ac){if(ac.dataset.act==='rtrim'){a=0; b=d} else {it.adj={b:0,c:0,s:0}; v.style.filter='none'} panel(); return}
    if(ev.target.closest('[data-done]')){const keep=fin()&&(a>.05||b<d-.05); o.close(); opt.onDone&&opt.onDone({...it,trim:keep?[+a.toFixed(1),+b.toFixed(1)]:null})}
  });
  pane.addEventListener('input',ev=>{const k=ev.target.dataset.k;
    if(ev.target.id==='evsound'){it.noSound=!ev.target.checked; v.muted=it.noSound; return}
    if(!k) return; let val=+ev.target.value;
    if(k==='ts'){a=Math.min(val,b-.5); a=Math.max(0,a); ev.target.value=a; pane.querySelector('#evo-ts').textContent=fmt(a); v.currentTime=a; tl(); return}
    if(k==='te'){b=Math.max(val,a+.5); b=Math.min(d,b); ev.target.value=b; pane.querySelector('#evo-te').textContent=fmt(b); v.currentTime=Math.max(a,b-1); tl(); return}
    it.adj[k]=val; pane.querySelector('#evo-'+k).textContent=(val>0?'+':'')+val; v.style.filter=vfilter(it.adj)});
}

/* ---------- POST OPTIONS (⋯ menu) ---------- */
const isMine=p=>p.who===me().name;
const gridEntryId=e=>e&&typeof e==='object'&&!Array.isArray(e)?e.id:`g${Array.isArray(e)?e[0]:e}-${slug(me().name)}`;
function removePost(p){S.posts=S.posts.filter(x=>x.id!==p.id); S.gridPosts=(S.gridPosts||[]).filter(x=>x.id!==p.id); S.myPosts=S.myPosts.filter(e=>gridEntryId(e)!==p.id)}
function postMenu(p,cb={}){
  const M=mitems(p), ix=Math.min(cb.idx||0,Math.max(0,M.length-1)), cur=M[ix];
  const opts=isMine(p)?[['edit','edit','Edit post'],...(cur?[['media',cur.t==='v'?'scissors':'crop',cur.t==='v'?'Edit this video':(M.length>1?'Edit this photo':'Edit photo')]]:[]),['story','plus','Add to your story'],['link','link','Copy link'],['delete','trash','Delete post','bad']]
                     :[['story','plus','Add to your story'],['link','link','Copy link'],['hide','eyeoff','Not interested'],['report','flag','Report post','bad']];
  const o=openModal(`<div class="msheet">${opts.map(([k,ic,l,c])=>`<button type="button" data-o="${k}" class="${c||''}">${I(ic)}${l}</button>`).join('')}<button type="button" data-close>Cancel</button></div>`,{cls:'msheet-wrap',label:'Post options'});
  o.m.addEventListener('click',ev=>{const b=ev.target.closest('[data-o]'); if(!b) return; const k=b.dataset.o; o.close();
    if(k==='link'){copyText(location.href.split('#')[0]+'#post-'+p.id); toast('Link copied')}
    else if(k==='story') storyFrom({post:p});
    else if(k==='report') openReport({what:'post',name:'this post'});
    else if(k==='hide'){S.posts=S.posts.filter(x=>x!==p); cb.onDelete&&cb.onDelete(); demoToast('post hidden on this page only.')}
    else if(k==='edit') editPost(p,()=>cb.onEdit&&cb.onEdit(null));
    else if(k==='media') editMedia(cur,it=>{const arr=mitems(p); arr[ix]=it; p.media=arr; syncImg(p); p.edited=true; cb.onEdit&&cb.onEdit(ix); demoToast((it.t==='v'?'video':'photo')+' updated on this page only.')});
    else if(k==='delete') confirmDel(p,cb.onDelete);
  });
}
function confirmDel(p,after){
  const o=openModal(`<div class="msheet"><h3>Delete this post?</h3><p>It will be removed from your profile and your friends' feeds. You can't undo this.</p><button type="button" class="bad" data-yes>Delete</button><button type="button" data-close>Cancel</button></div>`,{cls:'msheet-wrap',label:'Delete post'});
  o.m.querySelector('[data-yes]').onclick=()=>{removePost(p); o.close(); after&&after(); demoToast('post deleted on this page only.')};
}
function editPost(p,after){
  let media=mitems(p).map(x=>({...x}));
  const o=openModal(`<form class="sheet" id="epost" style="width:min(520px,100%)"><div class="sheet-top"><h2 style="font-size:22px">Edit post</h2><button type="button" class="x" data-close aria-label="Close">×</button></div>
    <div id="epm" class="cmp"></div>
    <label class="in" for="epcap">Caption<textarea id="epcap" maxlength="2200" placeholder="Write a caption">${esc(p.text||'')}</textarea></label>
    <label class="in" for="eploc">Location<input id="eploc" value="${esc(p.where||'')}" maxlength="60"></label>
    <div style="display:flex;gap:10px;justify-content:flex-end"><button type="button" class="btn btn-line btn-sm" data-close>Cancel</button><button class="btn btn-primary btn-sm">Save changes</button></div></form>`,{label:'Edit post'});
  const box=o.m.querySelector('#epm');
  const drawM=(k=0)=>{box.innerHTML=media.length?`${carousel({media})}<div class="cmp-bar"><span>Tap ✎ on a photo to crop, rotate or adjust it${media.length>1?' · swipe to see all':''}</span></div><div class="cstrip">${media.map((x,j)=>thumbHTML(x,j,media.length>1)).join('')}</div>`:''; const c=box.querySelector('[data-car]'); if(c) carSet(c,k)};
  drawM();
  box.addEventListener('click',ev=>{const ed=ev.target.closest('[data-cedit]'), rm=ev.target.closest('[data-crm]'), th=ev.target.closest('[data-ci]');
    if(ed){const j=+ed.dataset.cedit; editMedia(media[j],it=>{media[j]=it; drawM(j)}); return}
    if(rm){const j=+rm.dataset.crm; media.splice(j,1); drawM(Math.min(j,media.length-1)); return}
    if(th) carGo(box.querySelector('[data-car]'),+th.dataset.ci)});
  o.m.querySelector('#epost').onsubmit=ev=>{ev.preventDefault(); const t=o.m.querySelector('#epcap').value.trim();
    if(!t&&!media.length){toast('Add a caption or keep at least one photo'); return}
    p.text=t; p.where=o.m.querySelector('#eploc').value.trim()||p.where; p.media=media; syncImg(p); p.edited=true; o.close(); after&&after(); demoToast('post updated on this page only.')};
}

/* ---------- PROFILE GRID TILE ----------
   The whole photo at its real shape, never cut off: a blurred copy fills the rest of the tile. */
function tileInner(p){const M=mitems(p), f=M[0];
  if(!f) return `<span class="ptile txt">${esc((p.text||'').slice(0,90))}</span>`;
  return `<span class="ptile">${f.t==='v'
    ?`<video src="${f.s}#t=${f.trim?f.trim[0]+.1:.1}" muted playsinline preload="metadata" style="filter:${vfilter(f.adj)}"></video>`
    :`<img class="ptile-bg" src="${f.s}" alt="" aria-hidden="true"><img class="ptile-main" src="${f.s}" alt="" loading="lazy">`}
   ${M.length>1?`<span class="ptile-ic">${I('stack')}</span>`:f.t==='v'?`<span class="ptile-ic">${I('play','class="play"')}</span>`:''}
   <span class="ptile-hv" aria-hidden="true"><span>${I('heart')}${p.likes+(S.liked.has(p.id)?1:0)}</span><span>${I('comment')}${p.com}</span></span></span>`}
