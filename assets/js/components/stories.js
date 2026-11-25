/* ---------- STORIES ----------
   Added 25 Nov 2026. Instagram-style stories: a row at the top of the feed, a full-screen viewer,
   an editor (text, fonts, colours, stickers, drawing, backgrounds) and a share sheet for posts and trips.
   Demo: stories are kept in this browser only (photos as data, videos only until the page is closed).
   Live: upload media to storage and save the story (with its layers) on the server.
   Stories are kept in S.stories, completely apart from S.posts / S.myPosts.
   Each item lives for 24 hours from the moment it is shared, then it is dropped
   from the active stories row, the viewer and storage. */
const DAY=864e5, HR=36e5;
function seedStories(){const n=Date.now(); return [
  {id:'sd1',who:'Meera R.',at:n-1.4*HR,t:'i',s:'img/6084.webp',cap:'Back in Coorg 🌿',where:'Coorg',bg:'blur',fit:{x:0,y:0,z:1},D:[],
   L:[{id:'a1',k:'text',txt:'Back in Coorg 🌿',font:'modern',col:'#FBF3E6',m:1,al:'c',x:.5,y:.2,r:-3,s:1},{id:'a2',k:'stk',st:'loc',v:'Coorg',sty:0,x:.32,y:.8,r:0,s:1},{id:'a3',k:'stk',st:'men',v:'Ananya K.',sty:1,x:.68,y:.87,r:3,s:.9},{id:'a4',k:'stk',st:'tag',v:'coorgdiaries',sty:2,x:.5,y:.72,r:0,s:.85}]},
  {id:'sd2',who:'Meera R.',at:n-1.1*HR,t:'i',s:'img/6066.webp',cap:'',where:'Coorg'},
  {id:'sd3',who:'Ananya K.',at:n-3*HR,t:'i',s:'img/6046.webp',cap:'Estate walk before breakfast',where:'Coorg'},
  {id:'sd4',who:'Rohit S.',at:n-7*HR,t:'i',s:'img/6050.webp',cap:'Sunday ride, anyone joining next week?',where:'Nandi Hills',bg:'blur',fit:{x:0,y:0,z:1},D:[],
   L:[{id:'c1',k:'text',txt:'Sunday ride 🏍️\nanyone joining next week?',font:'classic',col:'#111111',m:1,al:'c',x:.5,y:.22,r:0,s:.95},{id:'c2',k:'stk',st:'loc',v:'Nandi Hills',sty:2,x:.5,y:.8,r:0,s:1},{id:'c3',k:'stk',st:'men',v:'Meera R.',sty:0,x:.5,y:.88,r:0,s:.85}]},
  {id:'sd5',who:'Sana G.',at:n-15*HR,t:'i',s:'img/6062.webp',cap:'Sunrise at Mullayanagiri',where:'Chikkamagaluru',bg:'blur',fit:{x:0,y:0,z:1},D:[],
   L:[{id:'b1',k:'text',txt:'Sunrise at\nMullayanagiri',font:'hand',col:'#FFFFFF',m:0,al:'c',x:.5,y:.18,r:0,s:1.1},{id:'b2',k:'stk',st:'loc',v:'Chikkamagaluru',sty:1,x:.5,y:.78,r:-2,s:.95},{id:'b3',k:'stk',st:'tag',v:'trekking',sty:0,x:.5,y:.86,r:0,s:.85}]},
  {id:'sd6',who:'Sana G.',at:n-14.6*HR,t:'i',s:'img/6063.webp',cap:'Worth the 4 am alarm',where:'Chikkamagaluru'},
  {id:'sd7',who:'Arjun J.',at:n-22.5*HR,t:'i',s:'img/6073.webp',cap:'Overnight train to Hampi',where:'Hampi'},
  {id:'sd8',who:'Pranav N.',at:n-27*HR,t:'i',s:'img/6087.webp',cap:'Shared more than 24 hours ago, so it never shows',where:'Ooty'}
]}
S.stories=[...seedStories(),...(store.get('stories')||[]).map(x=>({...x,mine:true}))];
S.svSeen=new Set(store.get('storySeen')||[]);
S.svMuted=false;
const isLive=x=>Date.now()-x.at<DAY;
function saveStories(){store.set('stories',S.stories.filter(x=>x.mine&&!/^blob:/.test(x.s)).map(({id,at,t,s,w,h,dur,trim,adj,noSound,cap,where,vis,L,D,bg,fit,alt,card})=>({id,at,t,s,w,h,dur,trim,adj,noSound,cap,where,vis,L,D,bg,fit,alt,card})))}
function pruneStories(){const b=S.stories.length; S.stories=S.stories.filter(x=>{if(isLive(x)) return true; if(/^blob:/.test(x.s)) URL.revokeObjectURL(x.s); return false});
  if(S.stories.length!==b){saveStories(); return true} return false}
pruneStories();
const myLive=()=>S.stories.filter(x=>x.mine&&isLive(x));
const ago=t=>{const m=Math.max(0,Math.floor((Date.now()-t)/6e4)); return m<1?'Just now':m<60?m+'m':Math.floor(m/60)+'h'};
const left=t=>{const m=Math.max(0,Math.ceil((t+DAY-Date.now())/6e4)); return m<60?`${m} min`:`${Math.floor(m/60)} h ${m%60?m%60+' min':''}`.trim()};
const seenAll=a=>a.every(x=>S.svSeen.has(x.id));
/* Groups in the order they appear in the row: you first, then unseen, then most recent. */
function storyOrder(){pruneStories(); const g=new Map();
  S.stories.filter(isLive).sort((a,b)=>a.at-b.at).forEach(x=>{const k=x.mine?'__me':x.who; g.has(k)||g.set(k,[]); g.get(k).push(x)});
  const me_=g.has('__me')?[{k:'__me',a:g.get('__me')}]:[];
  const rest=[...g].filter(([k])=>k!=='__me').map(([k,a])=>({k,a})).sort((x,y)=>(seenAll(x.a)-seenAll(y.a))||(y.a[y.a.length-1].at-x.a[x.a.length-1].at));
  return [...me_,...rest]}
const sthumb=x=>x.t==='v'?`<video src="${x.s}#t=0.1" muted playsinline preload="metadata"></video>`:`<img src="${x.s}" alt="">`;
function storiesRow(){const u=me(), O=storyOrder(), mine=O.find(o=>o.k==='__me');
  const meHTML=mine
    ?`<div class="story"><span class="sw"><button type="button" class="ring${seenAll(mine.a)?' seen':''}" data-sv="__me" aria-label="View your story">${sthumb(mine.a[mine.a.length-1])}</button><a class="addb" href="#story" aria-label="Add to your story">${I('plus')}</a></span><span><b>Your story</b><br><small>${ago(mine.a[mine.a.length-1].at)}</small></span></div>`
    :`<a class="story" href="#story" aria-label="Add to your story"><span class="sw"><span class="ring none">${u.photo?`<img src="${u.photo}" alt="">`:av(u.name,0)}</span><span class="addb">${I('plus')}</span></span><span><b>Your story</b><br><small>Add</small></span></a>`;
  return `<div class="stories" id="stories">${meHTML}${O.filter(o=>o.k!=='__me').map(o=>{const last=o.a[o.a.length-1];
    return `<button type="button" class="story" data-sv="${esc(o.k)}" aria-label="View ${esc(o.k)}'s story"><span class="sw"><span class="ring${seenAll(o.a)?' seen':''}">${sthumb(o.a.find(x=>!S.svSeen.has(x.id))||o.a[0])}</span></span><span><b>${esc(o.k.split(' ')[0])}</b><br><small>${ago(last.at)}</small></span></button>`}).join('')}</div>`}
let hadMine=myLive().length>0;
function refreshStories(){const r=$('#stories'); if(r) r.outerHTML=storiesRow();
  const has=myLive().length>0; if(has!==hadMine){hadMine=has; if(location.hash==='#profile'&&!MODALS.length) route()}}
/* Drop expired stories while the page is open. */
setInterval(()=>{pruneStories(); if(!MODALS.length) refreshStories()},30000);
document.addEventListener('visibilitychange',()=>{if(!document.hidden&&pruneStories()&&!MODALS.length) refreshStories()});
document.addEventListener('click',e=>{const b=e.target.closest('[data-sv]'); if(!b||b.closest('.modal')) return; e.preventDefault(); openStories(b.dataset.sv)});

/* ---------- STORY VIEWER ---------- */
function openStories(key){
  let O=storyOrder(), gi=O.findIndex(o=>o.k===key); if(gi<0){toast('This story has expired'); refreshStories(); return}
  const first=g=>{const k=g.k==='__me'?-1:g.a.findIndex(x=>!S.svSeen.has(x.id)); return k<0?0:k};
  let ii=first(O[gi]), paused=false, held=false, raf=0, holdT=0, vid=null, el=0;
  const o=openModal(`<div class="sv-stage"><button type="button" class="sv-arrow" data-svp aria-label="Previous story">‹</button><div class="sv" id="sv"></div><button type="button" class="sv-arrow" data-svn aria-label="Next story">›</button></div>`,
    {label:'Stories',cls:'sv-wrap',onClose:()=>{cancelAnimationFrame(raf); clearTimeout(holdT); if(vid) vid.pause(); refreshStories()},
     onKey:e=>{if(e.target.closest&&e.target.closest('input')) return; if(e.key==='ArrowRight'){e.preventDefault(); next()} else if(e.key==='ArrowLeft'){e.preventDefault(); prev()} else if(e.key===' '){e.preventDefault(); setPause(!paused)}}});
  const box=o.m.querySelector('#sv');
  /* Remove anything that expired while the viewer was open. */
  function fix(){const curG=O[gi], cur=curG&&curG.a[ii];
    O.forEach(g=>g.a=g.a.filter(isLive)); const keep=O.filter(g=>g.a.length);
    if(!keep.length){o.close(); toast('These stories have expired'); return false}
    if(!curG||!curG.a.length){let ng=-1; for(let k=gi+1;k<O.length;k++) if(O[k].a.length){ng=keep.indexOf(O[k]); break}
      if(ng<0){o.close(); return false} O=keep; gi=ng; ii=first(O[gi]); return true}
    const k=curG.a.indexOf(cur); ii=k<0?0:k; O=keep; gi=O.indexOf(curG); return true}
  function setPause(p){paused=p; if(vid){p?vid.pause():vid.play().catch(()=>{})} const b=box.querySelector('[data-svpause]'); if(b){b.innerHTML=p?I('play'):'❚❚'; b.setAttribute('aria-label',p?'Play':'Pause')}}
  function show(){cancelAnimationFrame(raf); if(vid){vid.pause(); vid=null} if(!fix()) return;
    pruneStories();
    const g=O[gi], x=g.a[ii], mine=g.k==='__me', u=me(), name=mine?u.name:g.k;
    S.svSeen.add(x.id); store.set('storySeen',[...S.svSeen].slice(-400));
    paused=false; el=0;
    const nu=Array.isArray(x.L);
    box.innerHTML=`<div class="sv-media">${nu?`${x.t==='v'?'':`<img class="sv-bg" src="${x.s}" alt="" aria-hidden="true">`}${storyCanvas(x,false)}`:x.t==='v'
        ?`<video src="${x.s}" playsinline preload="auto" style="filter:${vfilter(x.adj)}"></video>`
        :`<img class="sv-bg" src="${x.s}" alt="" aria-hidden="true"><img src="${x.s}" alt="${esc(x.cap||name+'\'s story')}" draggable="false">`}</div>
      <div class="sv-tap" data-tap aria-hidden="true"></div>
      <div class="sv-top"><div class="sv-bars">${g.a.map((_,k)=>`<span><i style="width:${k<ii?100:0}%"></i></span>`).join('')}</div>
       <div class="sv-h">${mine&&u.photo?`<span class="av"><img src="${u.photo}" alt=""></span>`:av(name,mine?0:name.length)}<div><b>${esc(mine?'Your story':name)}</b> <small>· ${ago(x.at)}</small>${mine&&x.vis==='Friends only'?'<br><small>Friends only</small>':''}</div><span class="sp"></span>
        ${x.t==='v'&&!x.noSound?`<button type="button" class="sv-ib" data-svmute aria-label="${S.svMuted?'Turn sound on':'Mute'}">${I(S.svMuted?'mute':'vol')}</button>`:''}
        <button type="button" class="sv-ib" data-svpause aria-label="Pause" style="font-size:15px">❚❚</button>
        ${mine?`<button type="button" class="sv-ib" data-svdel aria-label="Delete this story">${I('trash')}</button>`:''}
        <button type="button" class="sv-ib" data-close aria-label="Close stories">×</button></div>
       <div class="sv-confirm" data-svconf hidden><span>Delete this story?</span><button type="button" class="btn btn-primary btn-sm" data-svdelok>Delete</button><button type="button" class="btn btn-line btn-sm" style="color:#fff;border-color:rgba(255,255,255,.5)" data-svdelno>Keep</button></div></div>
      <div class="sv-cap${nu?' nu':''}">${!nu&&x.where?`<span class="sv-loc">${I('pin')}${esc(x.where)}</span>`:''}${!nu&&x.cap?`<p>${esc(x.cap)}</p>`:''}
       ${mine?`<small class="sv-exp">Disappears in ${left(x.at)}</small>`
         :`<form class="sv-reply" data-svreply><input placeholder="Reply to ${esc(name.split(' ')[0])}…" maxlength="300" aria-label="Reply to ${esc(name)}"><button class="sv-ib" aria-label="Send reply">${I('share')}</button></form>`}</div>`;
    o.m.querySelector('[data-svp]').disabled=gi===0&&ii===0;
    const bar=box.querySelectorAll('.sv-bars i')[ii];
    vid=box.querySelector('video');
    if(vid){const a=x.trim?x.trim[0]:0, b0=x.trim?x.trim[1]:(x.dur||60), end=Math.min(b0,a+60), v=vid;
      v.muted=!!x.noSound||S.svMuted;
      const start=()=>{try{v.currentTime=a}catch(e){} v.play().catch(()=>{if(!v.muted){v.muted=true; S.svMuted=true; const mb=box.querySelector('[data-svmute]'); if(mb) mb.innerHTML=I('mute'); v.play().catch(()=>{})}})};
      v.readyState>=1?start():v.addEventListener('loadedmetadata',start,{once:true});
      const tick=()=>{if(vid!==v) return; const d=Math.max(.1,end-a), p=(v.currentTime-a)/d; bar.style.width=Math.max(0,Math.min(100,p*100))+'%';
        if(v.ended||v.currentTime>=end-.05){next(); return} raf=requestAnimationFrame(tick)};
      raf=requestAnimationFrame(tick);
    } else {let last=performance.now(); const D=5000;
      const tick=now=>{if(!paused) el+=now-last; last=now; bar.style.width=Math.min(100,el/D*100)+'%'; if(el>=D){next(); return} raf=requestAnimationFrame(tick)};
      raf=requestAnimationFrame(tick)}
  }
  function next(){const g=O[gi]; if(ii<g.a.length-1) ii++; else if(gi<O.length-1){gi++; ii=first(O[gi])} else {o.close(); return} show()}
  function prev(){if(ii>0) ii--; else if(gi>0){gi--; ii=0} else ii=0; show()}
  o.m.querySelector('[data-svn]').onclick=next;
  o.m.querySelector('[data-svp]').onclick=prev;
  /* Tap left third = back, elsewhere = forward, press and hold = pause */
  box.addEventListener('pointerdown',e=>{if(!e.target.closest('[data-tap]')) return; held=false; clearTimeout(holdT); holdT=setTimeout(()=>{held=true; setPause(true); box.classList.add('held')},220)});
  const release=e=>{clearTimeout(holdT); if(held){held=false; box.classList.remove('held'); setPause(false); e&&e.preventDefault(); return true} return false};
  box.addEventListener('pointerup',e=>{if(!e.target.closest('[data-tap]')) return; if(release(e)) return;
    const go=document.elementsFromPoint(e.clientX,e.clientY).map(el=>el.closest&&el.closest('[data-go],[data-act],.sl[data-post]')).find(Boolean); if(go){stickerTap(go); return}
    const r=box.getBoundingClientRect(); (e.clientX-r.left<r.width/3)?prev():next()});
  box.addEventListener('pointercancel',()=>release());
  /* Tapping a sticker: a trip opens the trip; a location, mention or hashtag opens a panel and pauses the story */
  function stickerTap(el){if(el.dataset.go){location.hash=el.dataset.go; return}
    if(el.dataset.post){location.hash='post-'+el.dataset.post; return}
    const x=O[gi]&&O[gi].a[ii]; if(!x) return; setPause(true); const old=box.querySelector('[data-svi]'); old&&old.remove();
    box.insertAdjacentHTML('beforeend',`<div class="svi-wrap" data-svi><div class="svi" role="dialog" aria-label="${esc(el.getAttribute('aria-label')||'Details')}">${stInfo(el.dataset.act,el.dataset.v,x.id)}</div></div>`);
    sviAt=Date.now(); const f=box.querySelector('.svi-x'); f&&f.focus({preventScroll:true})}
  /* The tap that opened the panel also fires a click a moment later; ignore it so it can't hit a link in the panel */
  let sviAt=0; box.addEventListener('click',e=>{if(Date.now()-sviAt<450&&e.target.closest('[data-svi]')){e.preventDefault(); e.stopImmediatePropagation()}},true);
  const sviClose=()=>{const w=box.querySelector('[data-svi]'); if(w){w.remove(); setPause(false); return true} return false};
  box.addEventListener('keydown',e=>{if((e.key==='Enter'||e.key===' ')&&e.target.matches&&e.target.matches('[data-go],[data-act],.sl[data-post]')){e.preventDefault(); e.stopPropagation(); stickerTap(e.target)}});
  box.addEventListener('pointerleave',()=>{if(held) release()});
  box.addEventListener('contextmenu',e=>e.preventDefault());
  box.addEventListener('click',e=>{
    if(e.target.closest('[data-svix]')||e.target.matches('[data-svi]')){sviClose(); return}
    const jp=e.target.closest('[data-svjump]'); if(jp){const id=jp.dataset.svjump; O=storyOrder(); const g=O.findIndex(o=>o.a.some(y=>y.id===id)); if(g<0){toast('This story has expired'); sviClose(); return} gi=g; ii=O[g].a.findIndex(y=>y.id===id); show(); return}
    const ms=e.target.closest('[data-svmsg]'); if(ms){const n=ms.dataset.svmsg; let i=S.dms.findIndex(d=>d.name===n);
      if(i<0){const f=S.friends.find(p=>p[0]===n); S.dms.unshift({name:n,v:true,sub:f?`Friend · ${f[1]}`:'On Payana',unread:0,msgs:[]}); i=0}
      S.msgSel=i; S.msgJump=true; if(location.hash==='#messages'){o.close(); route()} else location.hash='messages'; return}
    if(e.target.closest('[data-svpause]')) return setPause(!paused);
    if(e.target.closest('[data-svmute]')){S.svMuted=!S.svMuted; if(vid) vid.muted=S.svMuted; const b=e.target.closest('[data-svmute]'); b.innerHTML=I(S.svMuted?'mute':'vol'); b.setAttribute('aria-label',S.svMuted?'Turn sound on':'Mute'); return}
    if(e.target.closest('[data-svdel]')){setPause(true); box.querySelector('[data-svconf]').hidden=false; return}
    if(e.target.closest('[data-svdelno]')){box.querySelector('[data-svconf]').hidden=true; setPause(false); return}
    if(e.target.closest('[data-svdelok]')){const x=O[gi].a[ii]; if(/^blob:/.test(x.s)) URL.revokeObjectURL(x.s); S.stories=S.stories.filter(y=>y.id!==x.id); saveStories();
      O[gi].a.splice(ii,1); toast('Story deleted'); if(!O[gi].a.length){O.splice(gi,1); ii=0; if(!O.length||gi>=O.length){o.close(); return}} else ii=Math.min(ii,O[gi].a.length-1); show(); return}
  });
  box.addEventListener('focusin',e=>{if(e.target.closest('[data-svreply]')) setPause(true)});
  box.addEventListener('focusout',e=>{if(e.target.closest('[data-svreply]')&&!box.querySelector('[data-svconf]:not([hidden])')) setPause(false)});
  box.addEventListener('submit',e=>{if(!e.target.closest('[data-svreply]')) return; e.preventDefault(); const inp=e.target.querySelector('input'), tx=inp.value.trim(); if(!tx) return;
    const g=O[gi], d=S.dms.find(m=>m.name===g.k); const msg=['me',`Replied to your story: ${tx}`,new Date().toTimeString().slice(0,5),'Today'];
    if(d&&Array.isArray(d.msgs)) d.msgs.push(msg);
    inp.value=''; inp.blur(); toast(`Reply sent to ${g.k.split(' ')[0]}`)});
  show();
}

/* ---------- STORY CANVAS (shared by the story editor and the story viewer) ----------
   A story is a 9:16 frame: background, the photo/video (movable and zoomable), a drawing layer, then text and sticker layers.
   Positions are fractions of the frame (x,y 0..1), so a story looks the same at any screen size. */
const SFONTS=[['classic','Classic','var(--f-body)',700,''],['modern','Modern','var(--f-display)',800,''],['strong','Strong','"Bebas Neue",var(--f-display)',400,''],['type','Typewriter','var(--f-mono)',500,''],['elegant','Elegant','"Playfair Display",Georgia,serif',600,'italic'],['hand','Handwritten','Caveat,cursive',700,''],['neon','Neon','Pacifico,cursive',400,'']];
const SCOLS=['#FFFFFF','#111111','#C4552D','#F2C14E','#FBF3E6','#1F4D3A','#3F7A4F','#E36F3F','#EF4444','#EC4899','#A855F7','#3B82F6','#0EA5E9','#22C55E'];
const SBGS=[['blur','Photo blur'],['#120c08','Dark'],['#FBF3E6','Cream'],['#C4552D','Terracotta'],['#1F4D3A','Forest'],['linear-gradient(160deg,#C4552D,#F2C14E)','Sunset'],['linear-gradient(160deg,#1F4D3A,#7FB77E)','Ghats'],['linear-gradient(160deg,#0EA5E9,#1E3A8A)','Sea'],['linear-gradient(160deg,#1E1B4B,#7C3AED)','Night']];
const SEMO='🏔️ 🌄 🏕️ 🌊 🏖️ 🌴 🚗 🏍️ 🚂 ✈️ 🎒 🧭 🗺️ 📍 ☕ 🍛 🥥 🌧️ ☀️ 🌙 ⭐ 🔥 💛 ❤️ 😍 🤩 😎 🥳 🙌 👋 📸 🎶'.split(' ');
const SART=['Weekend mode','Looking for travel mates','Road trip!','Chai break','Namma Bengaluru','Find me on Payana'];
const SSTY={loc:4,men:4,tag:4,time:3,date:3,trip:3,art:4,emoji:1,post:3};
const lum=h=>{const n=parseInt(String(h).slice(1),16); if(isNaN(n)) return 1; return (.299*(n>>16&255)+.587*(n>>8&255)+.114*(n&255))/255};
const nid=()=>Math.random().toString(36).slice(2,9);
const clamp=(v,a,b)=>Math.min(b,Math.max(a,v));
const SV=p=>`<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${p}</svg>`;
const SIC={smile:SV('<circle cx="12" cy="12" r="9"/><path d="M8.5 14.5c1.8 2 5.2 2 7 0M9 9.5h.01M15 9.5h.01"/>'),pen:SV('<path d="M4 20l4-1L19 8l-3-3L5 16z"/><path d="M14 7l3 3"/>'),
  palette:SV('<path d="M12 3a9 9 0 1 0 0 18c1.2 0 1.8-.8 1.8-1.7 0-1.3-1.1-1.6-1.1-2.7 0-.9.7-1.6 1.6-1.6H17a4 4 0 0 0 4-4C21 6.5 17 3 12 3z"/><circle cx="7.5" cy="11" r="1"/><circle cx="10" cy="7" r="1"/><circle cx="15" cy="7.5" r="1"/>'),
  undo:SV('<path d="M9 14L4 9l5-5"/><path d="M4 9h11a5 5 0 0 1 0 10h-3"/>'),eraser:SV('<path d="M7 20h11M5 15l9-9 5 5-7 7H8z"/>'),marker:SV('<path d="M9 15l-4 5h5l2-2M9 15l7-11 4 3-7 11z"/>'),neon:SV('<path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1"/><circle cx="12" cy="12" r="3"/>'),
  c:SV('<path d="M4 6h16M7 12h10M5 18h14"/>'),l:SV('<path d="M4 6h16M4 12h10M4 18h14"/>'),r:SV('<path d="M4 6h16M10 12h10M6 18h14"/>'),send:SV('<path d="M5 12h14M13 6l6 6-6 6"/>')};
const tvars=c=>`--c:${c};--tc:${lum(c)>.62?'#111':'#fff'};--tb:${lum(c)<.32?'rgba(255,255,255,.75)':'rgba(20,12,7,.52)'}`;
function smBox(x){const a=(x.w&&x.h)?x.w/x.h:9/16, F=9/16; let W,H; if(a>=F){W=100; H=F/a*100} else {H=100; W=a/F*100} return {W,H,cover:Math.max(100/W,100/H)}}
const defFit=x=>{const b=smBox(x); return {x:0,y:0,z:b.cover<=1.2?+b.cover.toFixed(3):1}};
function smStyle(x){const b=smBox(x), p=x.fit||{x:0,y:0,z:1};
  return `width:${b.W}%;height:${b.H}%;left:${50+p.x*100}%;top:${50+p.y*100}%;transform:translate(-50%,-50%) scale(${p.z})${x.w&&x.h?'':';object-fit:contain'}${x.t==='v'?`;filter:${vfilter(x.adj)}`:''}`}
const slPos=l=>`left:${l.x*100}%;top:${l.y*100}%;transform:translate(-50%,-50%) rotate(${l.r||0}deg) scale(${l.s||1});--s:${l.s||1}`;
function slText(l){return `<span style="${tvars(l.col||'#FFFFFF')}">${esc(l.txt).replace(/\n/g,'<br>')}</span>`}
function slSticker(l){const s=l.sty||0, v=esc(l.v||'');
  if(l.st==='loc') return `<span class="sk-pill sp${s}">${I('pin')}${v.toUpperCase()}</span>`;
  if(l.st==='men') return `<span class="sk-pill sp${s}">@${v}</span>`;
  if(l.st==='tag') return `<span class="sk-pill sp${s}">#${v}</span>`;
  if(l.st==='time'||l.st==='date') return `<span class="sk-big sb${s}">${v}</span>`;
  if(l.st==='trip'){const t=T(l.v)||TRIPS[0]; return `<span class="sk-trip st${s}"><img src="${msrc(t.img)}" alt=""><span><b>${esc(t.name)}</b><small>${esc(t.dates)}</small><em>Join my trip ›</em></span></span>`}
  if(l.st==='art') return `<span class="sk-art sa${s}">${v}</span>`;
  if(l.st==='post'){const w=esc(l.pw||''), ini=esc(String(l.pw||'').split(' ').map(x=>x[0]).join('').slice(0,2)), med=l.pi?(l.pvid?`<video src="${esc(l.pi)}#t=0.1" muted playsinline preload="metadata"></video>`:`<img src="${esc(l.pi)}" alt="">`):'';
    return `<span class="sk-post spo${s}"><span class="spo-h"><i class="spo-av">${ini}</i><b>${w}</b></span>${med||`<span class="spo-big">${esc(l.pt||'')}</span>`}${med&&l.pt?`<span class="spo-t">${esc(l.pt.length>90?l.pt.slice(0,88)+'…':l.pt)}</span>`:''}</span>`}
  return `<span class="sk-emo">${v}</span>`}
function slHTML(l,edit){const cls=l.k==='text'?`sl sl-t f-${l.font||'classic'} m${l.m||0} al-${l.al||'c'}`:`sl sl-s sk-${l.st}`;
  const lab=l.k==='text'?`Text: ${l.txt}`:l.st==='emoji'?`Sticker ${l.v}`:l.st==='trip'?`Trip sticker: ${(T(l.v)||{}).name||''}`:l.st==='post'?`Post by ${l.pw||''}`:`Sticker: ${l.v}`;
  return `<div class="${cls}" style="${slPos(l)}" data-lid="${l.id}"${edit?` tabindex="0" aria-label="${esc(lab)}. Drag to move."`:['loc','men','tag','trip','post'].includes(l.st)?` role="button" tabindex="0" aria-label="${esc(lab)}. Open."`:` aria-hidden="true"`}${!edit&&l.st==='trip'?` data-go="trip-${esc(l.v)}"`:''}${!edit&&['loc','men','tag'].includes(l.st)?` data-act="${l.st}" data-v="${esc(l.v)}"`:''}${!edit&&l.st==='post'?` data-post="${esc(l.v)}"`:''}>${l.k==='text'?slText(l):slSticker(l)}${edit?`<button type="button" class="sl-hx" tabindex="-1" aria-label="Delete">×</button><span class="sl-hd" aria-hidden="true">↻</span>`:''}</div>`}
const pathD=p=>{if(!p.length) return ''; const f=p[0], l=p[p.length-1]; if(p.length<3) return `M${f[0]} ${f[1]}L${l[0]+.5} ${l[1]+.5}`;
  let d=`M${f[0]} ${f[1]}`; for(let i=1;i<p.length-1;i++) d+=`Q${p[i][0]} ${p[i][1]} ${(p[i][0]+p[i+1][0])/2} ${(p[i][1]+p[i+1][1])/2}`; return d+`L${l[0]} ${l[1]}`};
function strokeSVG(k){const d=pathD(k.p), w=k.w;
  if(k.b==='neon') return `<g><path d="${d}" stroke="${k.c}" stroke-width="${w*2.8}" opacity=".22"/><path d="${d}" stroke="${k.c}" stroke-width="${w*1.6}" opacity=".55"/><path d="${d}" stroke="#fff" stroke-width="${w*.55}"/></g>`;
  return `<g><path d="${d}" stroke="${k.c}" stroke-width="${k.b==='marker'?w*1.8:w}"${k.b==='marker'?' opacity=".5" stroke-linecap="square"':''}/></g>`}
const drawSVG=D=>`<svg class="sc-draw" viewBox="0 0 900 1600" preserveAspectRatio="none" aria-hidden="true">${(D||[]).map(strokeSVG).join('')}</svg>`;
function storyCanvas(x,edit){const bg=x.bg||'blur';
  const bgH=bg==='blur'?(x.t==='v'?`<div class="sc-bg" style="background:#120c08"></div>`:`<img class="sc-blur" src="${x.s}" alt="" aria-hidden="true">`):`<div class="sc-bg" style="background:${bg}"></div>`;
  const med=x.card?'':x.t==='v'?`<video class="sc-m" src="${x.s}" playsinline ${edit?'autoplay muted loop':'preload="auto"'} style="${smStyle(x)}"></video>`
    :`<img class="sc-m" src="${x.s}" alt="${esc(x.alt||'')}" draggable="false" style="${smStyle(x)}">`;
  return `<div class="sc${edit?' sc-edit':''}">${bgH}${med}${drawSVG(x.D)}${(x.L||[]).map(l=>slHTML(l,edit)).join('')}</div>`}
const storyAlt=x=>(x.L||[]).filter(l=>l.k==='text'||['loc','men','tag','art'].includes(l.st)).map(l=>l.k==='text'?l.txt:l.v).join(' · ').slice(0,200);

/* What opens when a friend taps a location, mention or hashtag sticker in a story */
function stInfo(k,v,curId){const lv=String(v).toLowerCase(), first=n=>String(n).split(' ')[0];
  const live=S.stories.filter(x=>isLive(x)&&x.id!==curId), has=(x,st)=>(x.L||[]).some(l=>l.st===st&&String(l.v).toLowerCase()===lv);
  const thumbs=a=>`<div class="svi-st">${a.slice(0,10).map(x=>`<button type="button" data-svjump="${x.id}" aria-label="Open ${esc(x.mine?'your':first(x.who)+'\'s')} story"><span class="svi-ring">${sthumb(x)}</span><small>${esc(x.mine?'You':first(x.who))}</small></button>`).join('')}</div>`;
  const trip=t=>`<a class="svi-trip" href="#trip-${t.id}"><img src="${msrc(t.img)}" alt=""><span><b>${esc(t.name)}</b><small>${esc(t.dates)} · ${esc(t.seats)} going · host ${esc(first(t.host))}</small></span><em>Open</em></a>`;
  const head=(ic,t,sub)=>`<div class="svi-h">${ic}<div><b>${t}</b><small>${sub}</small></div><button type="button" class="svi-x" data-svix aria-label="Close">×</button></div>`;
  const tripFor=w=>TRIPS.filter(t=>{const n=t.name.toLowerCase(); return w.includes(n)||n.includes(w)});
  if(k==='loc'){const tr=tripFor(lv), ss=live.filter(x=>(x.where||'').toLowerCase()===lv||has(x,'loc'));
    return head(`<span class="svi-ic">${I('pin')}</span>`,esc(v),'Place')
      +(tr.length?`<p class="svi-l">Trips to ${esc(v)}</p>${tr.map(trip).join('')}`:`<p class="svi-n">No Payana trips to ${esc(v)} are forming yet.</p>`)
      +(ss.length?`<p class="svi-l">Stories from ${esc(v)} · ${ss.length}</p>${thumbs(ss)}`:'')
      +`<div class="svi-btns">${tr.length?`<a class="btn btn-line btn-sm" href="#explore">Explore all trips</a>`:`<a class="btn btn-primary btn-sm" href="#newtrip">${I('plus')}Plan a trip to ${esc(v)}</a>`}</div>`}
  if(k==='men'){const f=S.friends.find(p=>p[0]===v), tr=TRIPS.filter(t=>t.host===v||t.people.some(p=>p[0]===v)), ss=live.filter(x=>!x.mine&&x.who===v), meN=me().name===v;
    return head(av(v,v.length),esc(v),meN?'You':f?`Friend · ${esc(f[1])}`:'On Payana')
      +(tr.length?`<p class="svi-l">Trips with ${esc(first(v))}</p>${tr.map(trip).join('')}`:`<p class="svi-n">${esc(first(v))} isn't on any trips right now.</p>`)
      +`<div class="svi-btns">${meN?`<a class="btn btn-line btn-sm" href="#profile">Your profile</a>`:`<a class="btn btn-line btn-sm" href="#u-${slug(v)}">View profile</a><button type="button" class="btn btn-primary btn-sm" data-svmsg="${esc(v)}">${I('chat')}Message ${esc(first(v))}</button>`}${ss.length?`<button type="button" class="btn btn-line btn-sm" data-svjump="${(ss.find(x=>!S.svSeen.has(x.id))||ss[0]).id}">View ${esc(first(v))}'s story</button>`:''}</div>`}
  const ss=live.filter(x=>has(x,'tag')), tr=TRIPS.filter(t=>lv.includes(t.name.toLowerCase())||t.interests.some(i=>lv.includes(i.toLowerCase())));
  return head(`<span class="svi-ic">#</span>`,'#'+esc(v),`${ss.length+1} ${ss.length?'stories':'story'} right now`)
    +(ss.length?`<p class="svi-l">Other stories with #${esc(v)}</p>${thumbs(ss)}`:`<p class="svi-n">This is the only story with #${esc(v)} right now.</p>`)
    +(tr.length?`<p class="svi-l">Related trips</p>${tr.map(trip).join('')}`:'')
    +`<div class="svi-btns"><a class="btn btn-line btn-sm" href="#explore">Explore trips</a></div>`}

/* ---------- STORY EDITOR ---------- */
function openStoryEditor(items,{onShare}={}){
  const prep=m=>({...m,L:m.L||[],D:m.D||[],bg:m.bg||(m.t==='v'?'#120c08':'blur'),fit:m.fit||defFit(m)});
  let A=items.map(prep), cur=0, sel=null, mode='edit', vis='Everyone', TX=null; const DR={b:'pen',c:'#FFFFFF',w:14};
  const o=openModal(`<div class="se">
   <div class="se-main"><div class="se-frame">
    <div class="se-cv"></div><i class="se-guide v" aria-hidden="true"></i><i class="se-guide h" aria-hidden="true"></i>
    <div class="se-ui">
     <button type="button" class="se-ib se-x" data-sx aria-label="Close without sharing">×</button>
     <div class="se-tools" role="toolbar" aria-label="Story tools">
      <button type="button" data-tool="text"><b class="se-aa">Aa</b><span>Text</span></button>
      <button type="button" data-tool="stk">${SIC.smile}<span>Stickers</span></button>
      <button type="button" data-tool="draw">${SIC.pen}<span>Draw</span></button>
      <button type="button" data-tool="bg">${SIC.palette}<span>Background</span></button>
      <button type="button" data-tool="adj">${I('sliders')}<span class="se-adjl">Edit photo</span></button>
     </div>
     <p class="se-hint">Tap anywhere to add text · drag to move · pinch or use the ↻ handle to resize and rotate</p>
    </div>
    <div class="se-trash" aria-hidden="true">${I('trash')}</div>
    <div class="se-text" hidden>
     <div class="se-tbar"><button type="button" class="se-tbtn" data-tal aria-label="Text alignment"></button><button type="button" class="se-tbtn" data-tbg aria-label="Text background style"></button><span class="se-sp"></span><button type="button" class="btn btn-primary btn-sm" data-tdone>Done</button></div>
     <div class="se-frow" role="radiogroup" aria-label="Font">${SFONTS.map(([k,l,f,w,st])=>`<button type="button" class="se-fc" data-tf="${k}" style="font-family:${f.replace(/"/g,'&quot;')};font-weight:${w};font-style:${st||'normal'}">${l}</button>`).join('')}</div>
     <div class="se-crow" role="radiogroup" aria-label="Text colour">${SCOLS.map(c=>`<button type="button" class="se-sw" data-tc="${c}" style="background:${c}" aria-label="Colour ${c}"></button>`).join('')}<label class="se-sw se-cc" aria-label="Pick any colour"><input type="color" data-tcc value="#ffffff"></label></div>
     <input type="range" class="se-vsl" data-tsz min="40" max="320" value="100" aria-label="Text size">
     <div class="se-twrap"><div class="se-tw"><span class="se-te" spellcheck="false" role="textbox" aria-multiline="true" aria-label="Story text"></span></div></div>
    </div>
    <div class="se-draw" hidden>
     <div class="se-pad"></div>
     <div class="se-tbar"><div class="se-brs" role="radiogroup" aria-label="Brush">${[['pen','Pen',SIC.pen],['marker','Marker',SIC.marker],['neon','Neon',SIC.neon],['eraser','Eraser',SIC.eraser]].map(([k,l,ic])=>`<button type="button" class="se-tbtn" data-br="${k}" aria-label="${l}" title="${l}">${ic}</button>`).join('')}</div><span class="se-sp"></span><button type="button" class="se-tbtn" data-dundo aria-label="Undo last line">${SIC.undo}</button><button type="button" class="btn btn-primary btn-sm" data-ddone>Done</button></div>
     <div class="se-crow" role="radiogroup" aria-label="Brush colour">${SCOLS.map(c=>`<button type="button" class="se-sw" data-dc="${c}" style="background:${c}" aria-label="Colour ${c}"></button>`).join('')}<label class="se-sw se-cc" aria-label="Pick any colour"><input type="color" data-dcc value="#ffffff"></label></div>
     <input type="range" class="se-vsl" data-dsz min="4" max="48" value="14" aria-label="Brush size">
    </div>
    <div class="se-sheet" hidden></div>
    <div class="se-conf" hidden role="alertdialog" aria-label="Discard this story?"><div><b>Discard this story?</b><p>Your photos and edits won't be saved.</p><button type="button" class="btn btn-primary" data-cfyes>Discard</button><button type="button" class="btn btn-line" data-cfno>Keep editing</button></div></div>
   </div></div>
   <div class="se-bottom"><div class="se-strip"></div>
    <div class="se-share"><button type="button" class="se-visb" data-vis aria-label="Who can see this"></button><button type="button" class="btn btn-primary" data-share></button></div></div>
   <input type="file" id="sefile" accept="image/*,video/*" multiple hidden>
  </div>`,{cls:'se-modal',label:'Create your story',onKey:key,onClose:()=>{P.clear()}});
  const m=o.m, fr=m.querySelector('.se-frame'), cvw=m.querySelector('.se-cv'), txo=m.querySelector('.se-text'), te=m.querySelector('.se-te'), tw=m.querySelector('.se-tw'),
    drw=m.querySelector('.se-draw'), pad=m.querySelector('.se-pad'), sheet=m.querySelector('.se-sheet'), conf=m.querySelector('.se-conf'), trash=m.querySelector('.se-trash'),
    gv=m.querySelector('.se-guide.v'), gh=m.querySelector('.se-guide.h'), strip=m.querySelector('.se-strip');
  te.contentEditable='plaintext-only'; if(te.contentEditable!=='plaintext-only') te.contentEditable='true';
  const realClose=o.close, shut=()=>{o.close=realClose; realClose()};
  o.close=()=>{if(mode==='text') return commitText(); if(mode==='draw') return closeDraw(); if(mode==='stk'||mode==='bg') return closeSheet();
    if(!conf.hidden){conf.hidden=true; return} if(sel){sel=null; markSel(); return} conf.hidden=false; conf.querySelector('[data-cfno]').focus()};
  const X=()=>A[cur], LY=id=>X().L.find(l=>l.id===id), elOf=id=>cvw.querySelector(`.sl[data-lid="${id}"]`);
  function render(){cvw.innerHTML=storyCanvas(X(),true); markSel();
    fr.classList.toggle('has-layers',X().L.length>0||X().D.length>0);
    m.querySelector('.se-adjl').textContent=X().t==='v'?'Edit video':'Edit photo'; m.querySelector('[data-tool="adj"]').hidden=!!X().card;
    strip.innerHTML=A.map((x,i)=>`<button type="button" class="se-th${i===cur?' on':''}" data-si="${i}" aria-label="Story ${i+1} of ${A.length}"${i===cur?' aria-current="true"':''}>${x.t==='v'?`<video src="${x.s}#t=0.1" muted playsinline preload="metadata"></video>`:`<img src="${x.s}" alt="">`}${A.length>1?`<span class="se-th-rm" data-srm="${i}" aria-label="Remove story ${i+1}">×</span>`:''}</button>`).join('')
      +(A.length<10?`<label class="se-add" for="sefile" title="Add more" aria-label="Add more photos or videos">${I('plus')}</label>`:'');
    m.querySelector('[data-vis]').innerHTML=`${I(vis==='Everyone'?'users':'eye')}<span>${vis}</span>`;
    m.querySelector('[data-share]').innerHTML=`${A.length>1?`Share ${A.length} stories`:'Share to story'}${SIC.send}`}
  function markSel(){cvw.querySelectorAll('.sl').forEach(el=>el.classList.toggle('on',el.dataset.lid===sel))}
  const applyL=l=>{const el=elOf(l.id); if(el) el.style.cssText=slPos(l)};
  const applyP=()=>{const im=cvw.querySelector('.sc-m'); if(im) im.style.cssText=smStyle(X())};
  function select(l){sel=l?l.id:null; if(l){const L=X().L, i=L.indexOf(l); if(i<L.length-1){L.splice(i,1); L.push(l); const el=elOf(l.id); el&&el.parentNode.appendChild(el)}} markSel()}
  function addLayer(l){X().L.push(l); sel=l.id; render()}
  function removeLayer(id){X().L=X().L.filter(l=>l.id!==id); if(sel===id) sel=null; render()}

  /* ----- move, pinch, rotate ----- */
  const P=new Map(); let G=null;
  const ang=(a,b)=>Math.atan2(b[1]-a[1],b[0]-a[0])*180/Math.PI;
  const snapR=r=>{const n=Math.round(r/90)*90; return Math.abs(r-n)<4?n:r};
  const two=M=>[...M.values()].slice(0,2);
  function restart(){if(!G) return; G.pts=new Map(P); const t=G.l||X().fit; G.o={x:t.x,y:t.y,r:t.r||0,s:t.s||1,z:t.z||1}}
  cvw.addEventListener('pointerdown',e=>{if(mode!=='edit'||e.button>0) return;
    if(e.target.closest('.sl-hx')){e.preventDefault(); const id=e.target.closest('.sl').dataset.lid; removeLayer(id); return}
    const le=e.target.closest('.sl'), hd=e.target.closest('.sl-hd');
    try{cvw.setPointerCapture(e.pointerId)}catch(_){} P.set(e.pointerId,[e.clientX,e.clientY]);
    if(P.size===1){const l=le?LY(le.dataset.lid):null; const was=l&&sel===l.id; if(l) select(l);
      G={type:hd?'handle':l?'layer':'photo',l,was,t0:Date.now(),moved:false}; restart()}
    else if(P.size===2&&G&&G.type!=='handle'){restart(); G.moved=true}});
  cvw.addEventListener('pointermove',e=>{if(!G||!P.has(e.pointerId)) return; P.set(e.pointerId,[e.clientX,e.clientY]);
    const R=fr.getBoundingClientRect(), g=G, t=g.l;
    if(g.type==='handle'){const c=[R.left+t.x*R.width,R.top+t.y*R.height], p0=[...g.pts.values()][0], p=[e.clientX,e.clientY];
      const d0=Math.hypot(p0[0]-c[0],p0[1]-c[1])||1, d=Math.hypot(p[0]-c[0],p[1]-c[1]); t.s=clamp(g.o.s*d/d0,.2,8); t.r=snapR(g.o.r+ang(c,p)-ang(c,p0)); g.moved=true; applyL(t); return}
    if(P.size>=2&&g.pts.size>=2){const [a1,a2]=two(P), [b1,b2]=two(g.pts), d=Math.hypot(a1[0]-a2[0],a1[1]-a2[1]), d0=Math.hypot(b1[0]-b2[0],b1[1]-b2[1])||1;
      const mx=((a1[0]+a2[0])-(b1[0]+b2[0]))/2/R.width, my=((a1[1]+a2[1])-(b1[1]+b2[1]))/2/R.height;
      if(t){t.s=clamp(g.o.s*d/d0,.2,8); t.r=snapR(g.o.r+ang(a1,a2)-ang(b1,b2)); t.x=g.o.x+mx; t.y=g.o.y+my; applyL(t)}
      else {const p=X().fit; p.z=clamp(g.o.z*d/d0,.3,6); p.x=g.o.x+mx; p.y=g.o.y+my; applyP()} return}
    const p0=g.pts.get(e.pointerId); if(!p0) return; const dx=e.clientX-p0[0], dy=e.clientY-p0[1];
    if(!g.moved&&Math.hypot(dx,dy)<6) return; if(!g.moved){g.moved=true; fr.classList.add('dragging')}
    if(t){let nx=g.o.x+dx/R.width, ny=g.o.y+dy/R.height; const sx=Math.abs(nx-.5)<.015, sy=Math.abs(ny-.5)<.012; if(sx) nx=.5; if(sy) ny=.5;
      t.x=clamp(nx,-.1,1.1); t.y=clamp(ny,-.1,1.1); gv.classList.toggle('show',sx); gh.classList.toggle('show',sy);
      const tr=trash.getBoundingClientRect(), hot=Math.hypot(e.clientX-(tr.left+tr.width/2),e.clientY-(tr.top+tr.height/2))<56;
      g.hot=hot; trash.classList.add('show'); trash.classList.toggle('hot',hot); applyL(t); const el=elOf(t.id); if(el) el.style.opacity=hot?.4:''}
    else {const p=X().fit; p.x=clamp(g.o.x+dx/R.width,-1,1); p.y=clamp(g.o.y+dy/R.height,-1,1); applyP()}});
  const up=(e,cancel)=>{if(!P.has(e.pointerId)) return; P.delete(e.pointerId); if(P.size){restart(); return}
    const g=G; G=null; if(!g) return; fr.classList.remove('dragging'); gv.classList.remove('show'); gh.classList.remove('show'); trash.classList.remove('show','hot');
    if(cancel) return;
    if(g.l&&g.hot){removeLayer(g.l.id); return}
    if(!g.moved&&Date.now()-g.t0<450){
      if(g.type==='layer'){const l=g.l; if(l.k==='text') openText(l); else if(g.was&&(SSTY[l.st]||1)>1){l.sty=((l.sty||0)+1)%SSTY[l.st]; const el=elOf(l.id); if(el){el.outerHTML=slHTML(l,true); markSel()}}}
      else if(g.type==='photo'){if(sel){sel=null; markSel()} else {const R=fr.getBoundingClientRect(); openText(null,[clamp((e.clientX-R.left)/R.width,.15,.85),clamp((e.clientY-R.top)/R.height,.1,.9)])}}}};
  cvw.addEventListener('pointerup',e=>up(e)); cvw.addEventListener('pointercancel',e=>up(e,true));
  cvw.addEventListener('wheel',e=>{if(mode!=='edit') return; e.preventDefault(); const le=e.target.closest('.sl'), l=le?LY(le.dataset.lid):sel?LY(sel):null, dl=e.deltaY||e.deltaX;
    if(l){if(e.shiftKey) l.r=snapR((l.r||0)+(dl>0?4:-4)); else l.s=clamp(l.s*Math.exp(-dl*.0015),.2,8); applyL(l)}
    else {const p=X().fit; p.z=clamp(p.z*Math.exp(-dl*.0015),.3,6); applyP()}},{passive:false});
  cvw.addEventListener('focusin',e=>{const le=e.target.closest('.sl'); if(le&&sel!==le.dataset.lid){sel=le.dataset.lid; markSel()}});
  function key(e){if(mode!=='edit'||!sel||!conf.hidden) return; if(e.target.closest&&e.target.closest('input,[contenteditable]')) return; const l=LY(sel); if(!l) return;
    const k=e.key; if(k==='Delete'||k==='Backspace'){e.preventDefault(); removeLayer(l.id); return}
    if(k==='Enter'){e.preventDefault(); if(l.k==='text') openText(l); else if((SSTY[l.st]||1)>1){l.sty=((l.sty||0)+1)%SSTY[l.st]; render()} return}
    const st=e.shiftKey?.05:.01, A_={ArrowLeft:[-st,0],ArrowRight:[st,0],ArrowUp:[0,-st],ArrowDown:[0,st]}[k];
    if(A_){l.x+=A_[0]; l.y+=A_[1]} else if(k==='+'||k==='=') l.s=Math.min(8,l.s*1.08); else if(k==='-') l.s=Math.max(.2,l.s/1.08); else if(k==='[') l.r-=5; else if(k===']') l.r+=5; else return;
    e.preventDefault(); applyL(l)}

  /* ----- text ----- */
  function openText(l,pos){closeSheet(true); mode='text'; sel=null; markSel();
    TX=l?{...l}:{id:nid(),k:'text',txt:'',font:'classic',col:'#FFFFFF',m:0,al:'c',x:pos?pos[0]:.5,y:pos?pos[1]:.42,r:0,s:1};
    if(l){const el=elOf(l.id); el&&el.classList.add('editing')}
    te.textContent=TX.txt; drawText(); txo.hidden=false; fr.classList.add('mode-text');
    setTimeout(()=>{te.focus(); const r=document.createRange(); r.selectNodeContents(te); r.collapse(false); const s=getSelection(); s.removeAllRanges(); s.addRange(r)},30)}
  function drawText(){const d=TX; tw.className=`se-tw sl-t f-${d.font} m${d.m} al-${d.al}`; tw.style.transform=`scale(${d.s})`; te.style.cssText=tvars(d.col);
    txo.querySelector('[data-tal]').innerHTML=SIC[d.al]; txo.querySelector('[data-tbg]').innerHTML=`<span class="se-abox m${d.m}" style="${tvars(d.col)}">A</span>`;
    txo.querySelectorAll('[data-tf]').forEach(b=>b.setAttribute('aria-pressed',b.dataset.tf===d.font));
    txo.querySelectorAll('[data-tc]').forEach(b=>b.setAttribute('aria-pressed',b.dataset.tc.toLowerCase()===d.col.toLowerCase()));
    txo.querySelector('[data-tsz]').value=Math.round(d.s*100)}
  function commitText(){if(mode!=='text') return; const d=TX; d.txt=te.innerText.replace(/ /g,' ').replace(/^\n+|\n+$/g,'').slice(0,300);
    txo.hidden=true; fr.classList.remove('mode-text'); mode='edit'; te.blur(); TX=null;
    const L=X().L, i=L.findIndex(z=>z.id===d.id);
    if(!d.txt.trim()){if(i>=0) L.splice(i,1); sel=null} else {if(i>=0) L[i]=d; else L.push(d); sel=d.id}
    render()}
  txo.addEventListener('mousedown',e=>{if(e.target.closest('button,.se-sw')) e.preventDefault()});
  txo.addEventListener('click',e=>{const t=e.target;
    if(t.closest('[data-tdone]')||t===txo||t.classList.contains('se-twrap')) return commitText();
    if(t.closest('[data-tal]')){TX.al={c:'l',l:'r',r:'c'}[TX.al]; return drawText()}
    if(t.closest('[data-tbg]')){TX.m=(TX.m+1)%4; return drawText()}
    const f=t.closest('[data-tf]'); if(f){TX.font=f.dataset.tf; return drawText()}
    const c=t.closest('[data-tc]'); if(c){TX.col=c.dataset.tc; return drawText()}});
  txo.addEventListener('input',e=>{if(e.target.matches('[data-tcc]')){TX.col=e.target.value; drawText()} else if(e.target.matches('[data-tsz]')){TX.s=+e.target.value/100; tw.style.transform=`scale(${TX.s})`}});
  te.addEventListener('paste',e=>{e.preventDefault(); const t=(e.clipboardData||window.clipboardData).getData('text'); document.execCommand('insertText',false,t)});
  te.addEventListener('keydown',e=>{if(e.key==='Enter'&&(e.metaKey||e.ctrlKey)){e.preventDefault(); commitText()}});

  /* ----- drawing ----- */
  let stroke=null, live=null;
  const reSvg=()=>{const s=cvw.querySelector('.sc-draw'); if(s) s.outerHTML=drawSVG(X().D)};
  function drawBar(){drw.querySelectorAll('[data-br]').forEach(b=>b.setAttribute('aria-pressed',b.dataset.br===DR.b));
    drw.querySelectorAll('[data-dc]').forEach(b=>b.setAttribute('aria-pressed',b.dataset.dc.toLowerCase()===DR.c.toLowerCase()));
    drw.querySelector('[data-dsz]').value=DR.w; drw.querySelector('[data-dundo]').disabled=!X().D.length}
  function openDraw(){closeSheet(true); mode='draw'; sel=null; markSel(); drw.hidden=false; fr.classList.add('mode-draw'); drawBar()}
  function closeDraw(){mode='edit'; drw.hidden=true; fr.classList.remove('mode-draw'); render()}
  const ptOf=e=>{const R=fr.getBoundingClientRect(); return [Math.round((e.clientX-R.left)/R.width*900),Math.round((e.clientY-R.top)/R.height*1600)]};
  const erase=pt=>{const n=X().D.length; X().D=X().D.filter(k=>!k.p.some(q=>Math.hypot(q[0]-pt[0],q[1]-pt[1])<k.w+26)); if(X().D.length!==n){reSvg(); drawBar()}};
  pad.addEventListener('pointerdown',e=>{if(stroke) return; try{pad.setPointerCapture(e.pointerId)}catch(_){} const pt=ptOf(e);
    if(DR.b==='eraser'){stroke={er:true,id:e.pointerId}; erase(pt); return}
    stroke={c:DR.c,w:DR.w,b:DR.b,p:[pt],id:e.pointerId}; X().D.push(stroke); const s=cvw.querySelector('.sc-draw'); s.insertAdjacentHTML('beforeend',strokeSVG(stroke)); live=s.lastElementChild});
  pad.addEventListener('pointermove',e=>{if(!stroke||stroke.id!==e.pointerId) return; const pt=ptOf(e); if(stroke.er) return erase(pt);
    const l=stroke.p[stroke.p.length-1]; if(Math.hypot(pt[0]-l[0],pt[1]-l[1])<4) return; stroke.p.push(pt); const d=pathD(stroke.p); live.querySelectorAll('path').forEach(p=>p.setAttribute('d',d))});
  const endStroke=e=>{if(!stroke||stroke.id!==e.pointerId) return; if(!stroke.er) delete stroke.id; stroke=null; live=null; drawBar()};
  pad.addEventListener('pointerup',endStroke); pad.addEventListener('pointercancel',endStroke);
  drw.addEventListener('click',e=>{const t=e.target;
    if(t.closest('[data-ddone]')) return closeDraw();
    if(t.closest('[data-dundo]')){X().D.pop(); reSvg(); return drawBar()}
    const b=t.closest('[data-br]'); if(b){DR.b=b.dataset.br; return drawBar()}
    const c=t.closest('[data-dc]'); if(c){DR.c=c.dataset.dc; if(DR.b==='eraser') DR.b='pen'; return drawBar()}});
  drw.addEventListener('input',e=>{if(e.target.matches('[data-dcc]')){DR.c=e.target.value; if(DR.b==='eraser') DR.b='pen'; drawBar()} else if(e.target.matches('[data-dsz]')) DR.w=+e.target.value});

  /* ----- stickers and background sheets ----- */
  const now=new Date(), tm=now.toTimeString().slice(0,5), dt=now.toLocaleDateString('en-IN',{weekday:'short',day:'numeric',month:'short'}).toUpperCase();
  const shHead=(t,back)=>`<div class="se-sh-h">${back?`<button type="button" class="se-tbtn" data-shb aria-label="Back to stickers">‹</button>`:''}<b>${t}</b><button type="button" class="se-tbtn" data-shx aria-label="Close">×</button></div>`;
  const stkHome=()=>`${shHead('Stickers')}<div class="se-sk-grid">
     <button type="button" data-sk="loc" aria-label="Location sticker"><span class="sk-pill sp0">${I('pin')}LOCATION</span></button>
     <button type="button" data-sk="men" aria-label="Mention a friend"><span class="sk-pill sp1">@MENTION</span></button>
     <button type="button" data-sk="trip" aria-label="Share one of your trips"><span class="sk-pill sp1">🧭 MY TRIP</span></button>
     <button type="button" data-sk="tag" aria-label="Hashtag sticker"><span class="sk-pill sp2">#HASHTAG</span></button>
     <button type="button" data-sk="time" aria-label="Time sticker"><span class="sk-big sb1">${tm}</span></button>
     <button type="button" data-sk="date" aria-label="Date sticker"><span class="sk-big sb0">${dt}</span></button></div>
    <p class="se-sh-l">Payana</p><div class="se-art">${SART.map((t,i)=>`<button type="button" data-art="${i}"><span class="sk-art sa${i%4}">${t}</span></button>`).join('')}</div>
    <p class="se-sh-l">Emoji</p><div class="se-emo">${SEMO.map(x=>`<button type="button" data-emo="${x}" aria-label="${x}">${x}</button>`).join('')}</div>
    <p class="se-sh-n">Tap a sticker on your story to change its style. Drag it to the bin to remove it.</p>`;
  const sub={
    loc:()=>`${shHead('Location',1)}<form class="se-shf" data-shf="loc"><input class="se-in" maxlength="40" placeholder="Search or type a place" aria-label="Place" autocomplete="off"><button class="btn btn-primary btn-sm">Add</button></form><div class="se-chips">${[...new Set(['Bengaluru',...TRIPS.map(t=>t.name),'Nandi Hills','Hampi'])].map(n=>`<button type="button" class="ed-chip" data-pick="${esc(n)}">${I('pin')}${esc(n)}</button>`).join('')}</div>`,
    men:()=>`${shHead('Mention a friend',1)}<div class="se-list">${S.friends.map(([n,w])=>`<button type="button" data-pick="${esc(n)}">${av(n,n.length)}<span><b>${esc(n)}</b><small>${esc(w)}</small></span></button>`).join('')}</div><p class="se-sh-n">Only friends can be mentioned.</p>`,
    tag:()=>`${shHead('Hashtag',1)}<form class="se-shf" data-shf="tag"><input class="se-in" maxlength="30" placeholder="weekendtrip" aria-label="Hashtag" autocomplete="off"><button class="btn btn-primary btn-sm">Add</button></form><div class="se-chips">${['payana','weekendtrip','coorgdiaries','travelmates','nammabengaluru','roadtrip'].map(n=>`<button type="button" class="ed-chip" data-pick="${n}">#${n}</button>`).join('')}</div>`,
    trip:()=>`${shHead('Share a trip',1)}<div class="se-list">${TRIPS.map(t=>`<button type="button" data-pick="${t.id}"><img src="${msrc(t.img)}" alt=""><span><b>${esc(t.name)}</b><small>${esc(t.dates)} · ${esc(t.seats)} going</small></span></button>`).join('')}</div><p class="se-sh-n">Friends can tap the sticker to open the trip and ask to join.</p>`};
  let subK=null;
  const bgPanel=()=>{const x=X(); return `${shHead('Background and layout')}<p class="se-sh-l">Background</p><div class="se-bgs">${SBGS.filter(([v])=>!(v==='blur'&&x.t==='v')).map(([v,l])=>`<button type="button" data-bgv="${esc(v)}" aria-pressed="${x.bg===v}" aria-label="${l}">${v==='blur'?`<img src="${x.s}" alt="">`:`<span style="background:${v}"></span>`}<small>${l}</small></button>`).join('')}</div>
    ${x.card?'':`<p class="se-sh-l">${x.t==='v'?'Video':'Photo'} size</p><div class="ed-chips"><button type="button" class="ed-chip" data-fit="fit">Fit whole ${x.t==='v'?'video':'photo'}</button><button type="button" class="ed-chip" data-fit="fill">Fill the screen</button><button type="button" class="ed-chip" data-fit="ctr">Centre</button></div>
    <p class="se-sh-n">You can also drag the ${x.t==='v'?'video':'photo'} to move it, and pinch or scroll to zoom.</p>`}`};
  function openSheet(k){if(mode==='text') commitText(); if(mode==='draw') closeDraw(); mode=k; subK=null; sel=null; markSel(); sheet.innerHTML=k==='stk'?stkHome():bgPanel(); sheet.hidden=false; fr.classList.add('mode-sheet'); const f=sheet.querySelector('button:not([data-shx])'); f&&f.focus({preventScroll:true})}
  function closeSheet(quiet){if(sheet.hidden) return; sheet.hidden=true; fr.classList.remove('mode-sheet'); if(!quiet) mode='edit'}
  const addStk=(st,v)=>{closeSheet(); addLayer({id:nid(),k:'stk',st,v,sty:0,x:.5,y:st==='trip'?.66:.45,r:st==='art'?-4:0,s:1})};
  sheet.addEventListener('click',e=>{const t=e.target;
    if(t.closest('[data-shx]')) return closeSheet();
    if(t.closest('[data-shb]')){subK=null; sheet.innerHTML=stkHome(); return}
    const sk=t.closest('[data-sk]'); if(sk){const k=sk.dataset.sk; if(k==='time') return addStk('time',tm); if(k==='date') return addStk('date',dt);
      subK=k; sheet.innerHTML=sub[k](); const i=sheet.querySelector('input'); i&&i.focus(); return}
    const ar=t.closest('[data-art]'); if(ar) return addStk('art',SART[+ar.dataset.art]);
    const em=t.closest('[data-emo]'); if(em) return addStk('emoji',em.dataset.emo);
    const pk=t.closest('[data-pick]'); if(pk&&subK) return addStk(subK,pk.dataset.pick);
    const bg=t.closest('[data-bgv]'); if(bg){X().bg=bg.dataset.bgv; render(); sheet.querySelectorAll('[data-bgv]').forEach(b=>b.setAttribute('aria-pressed',b===bg)); return}
    const ft=t.closest('[data-fit]'); if(ft){const p=X().fit, c=smBox(X()).cover; if(ft.dataset.fit==='fit') Object.assign(p,{x:0,y:0,z:1}); else if(ft.dataset.fit==='fill') Object.assign(p,{x:0,y:0,z:+c.toFixed(3)}); else Object.assign(p,{x:0,y:0}); applyP()}});
  sheet.addEventListener('submit',e=>{e.preventDefault(); const f=e.target.closest('[data-shf]'), v=f.querySelector('input').value.trim().replace(/^#/,'').replace(/\s+/g,f.dataset.shf==='tag'?'':' '); if(!v) return f.querySelector('input').focus(); addStk(f.dataset.shf,v)});

  /* ----- toolbar, items, share ----- */
  m.addEventListener('click',e=>{const t=e.target;
    if(t.closest('[data-sx]')) return o.close();
    if(t.closest('[data-cfno]')){conf.hidden=true; return}
    if(t.closest('[data-cfyes]')) return shut();
    const tl=t.closest('[data-tool]'); if(tl){const k=tl.dataset.tool;
      if(k==='text') return openText(null); if(k==='draw') return mode==='draw'?closeDraw():openDraw();
      if(k==='stk'||k==='bg') return mode===k?closeSheet():openSheet(k);
      if(k==='adj'){closeSheet(); const j=cur; editMedia(A[j],it=>{const ch=it.t==='i'&&(it.w!==A[j].w||it.h!==A[j].h); A[j]={...A[j],...it}; if(ch) A[j].fit=defFit(A[j]); render()}); return}}
    const rm=t.closest('[data-srm]'); if(rm){e.stopPropagation(); const j=+rm.dataset.srm; if(A[j].t==='v') URL.revokeObjectURL(A[j].s); A.splice(j,1); if(cur>=A.length||cur>j) cur=Math.max(0,cur-1); sel=null; render(); return}
    const th=t.closest('[data-si]'); if(th){if(mode==='text') commitText(); if(mode==='draw') closeDraw(); closeSheet(); cur=+th.dataset.si; sel=null; render(); return}
    if(t.closest('[data-vis]')){vis=vis==='Everyone'?'Friends only':'Everyone'; render(); toast(vis==='Everyone'?'Everyone on Payana can see this story':'Only your friends can see this story'); return}
    if(t.closest('[data-share]')){if(mode==='text') commitText(); const out=A, v=vis; shut(); onShare&&onShare(out,v)}});
  m.querySelector('#sefile').addEventListener('change',async e=>{const f=[...e.target.files]; e.target.value=''; const room=10-A.length; if(!f.length) return; if(room<=0) return toast('You can add up to 10 at a time');
    if(f.length>room) toast(`Up to 10 at a time. Added the first ${room}.`); const got=await readMedia(f.slice(0,room)); if(!got.length) return; A.push(...got.map(prep)); cur=A.length-got.length; sel=null; render()});
  render();
  m.querySelector('[data-tool="text"]').focus({preventScroll:true});
}

/* ---------- SAVE NEW STORIES, and ADD A POST OR TRIP TO YOUR STORY ---------- */
function saveNewStories(A,vis,go){const n=Date.now();
  A.forEach((x,i)=>S.stories.push({id:`st${n}-${i}`,mine:true,at:n+i,t:x.t,s:x.s,w:x.w,h:x.h,dur:x.dur,trim:x.trim||null,adj:x.adj||null,noSound:!!x.noSound,cap:'',
    where:((x.L||[]).find(l=>l.st==='loc')||{}).v||'',vis,L:x.L,D:(x.D||[]).map(({c,w,b,p})=>({c,w,b,p})),bg:x.bg,fit:x.fit,alt:storyAlt(x),card:!!x.card}));
  saveStories(); const k=A.length;
  if(go&&location.hash!=='#feed'){hadMine=true; location.hash='feed'} else refreshStories();
  demoToast(`added ${k>1?k+' stories':'to your story'} for 24 hours. Kept on this device only.`)}
function cardBg(){const c=document.createElement('canvas'); c.width=90; c.height=160; const x=c.getContext('2d'), g=x.createLinearGradient(0,0,90,160); g.addColorStop(0,'#C4552D'); g.addColorStop(1,'#F2C14E'); x.fillStyle=g; x.fillRect(0,0,90,160); return c.toDataURL('image/jpeg',.85)}
/* Opens the story editor with the post or trip as a card; the person can still add text, stickers and drawings before sharing. */
function storyFrom({post,trip}){let it;
  if(post){const f=mitems(post)[0], img=f&&f.t!=='v'?f.s:'';
    it={t:'i',s:img||cardBg(),w:9,h:16,card:true,bg:'blur',L:[{id:nid(),k:'stk',st:'post',v:String(post.id),sty:0,x:.5,y:.47,r:0,s:1,pw:post.who,pi:f?f.s:'',pvid:!!(f&&f.t==='v'),pt:String(post.text||'').slice(0,160)}]}}
  else {const t=T(trip)||TRIPS[0]; it={t:'i',s:msrc(t.img),w:9,h:16,card:true,bg:'blur',L:[{id:nid(),k:'stk',st:'trip',v:t.id,sty:0,x:.5,y:.5,r:0,s:1.35}]}}
  openStoryEditor([it],{onShare:(A,v)=>saveNewStories(A,v)})}
function shareSheet(p){shareTo('post',p)}
/* One share sheet for posts and trips: your story, WhatsApp, Instagram, copy link, and the phone's own share menu */
function copyText(t){try{if(navigator.clipboard&&navigator.clipboard.writeText) return navigator.clipboard.writeText(t).catch(()=>fallbackCopy(t))}catch(_){} fallbackCopy(t)}
function fallbackCopy(t){const a=document.createElement('textarea'); a.value=t; a.setAttribute('readonly',''); a.style.cssText='position:fixed;opacity:0;top:0'; document.body.appendChild(a); a.select(); try{document.execCommand('copy')}catch(_){} a.remove()}
function shareTo(kind,obj){
  const base=location.href.split('#')[0]; let url,title,sub,text,img,story;
  if(kind==='trip'){const t=obj; url=base+'#t-'+t.id; title=`${t.name} trip`; sub=`${t.dates} · ${rupee(t.budget)} / person · ${t.seats} seats left`;
    text=`Join me on this Payana trip to ${t.name}: ${t.dates}, ${rupee(t.budget)} per person, ${t.seats} seats left.`; img=msrc(t.img); story={trip:t.id}}
  else {const p=obj, f=mitems(p)[0], who=p.who; url=base+'#post-'+p.id; title=`${who}'s post`; sub=p.where||'Payana';
    text=`See ${isMine(p)?'my':who+'\'s'} post on Payana${p.where?' from '+p.where:''}.`; img=f&&f.t!=='v'?f.s:''; story={post:p}}
  const full=`${text}\n${url}`, wa='https://wa.me/?text='+encodeURIComponent(full);
  let file=null; if(img&&navigator.canShare) fetch(img).then(r=>r.blob()).then(b=>{const ext=(b.type.split('/')[1]||'jpg').replace('jpeg','jpg'), f=new File([b],`payana-${kind}.${ext}`,{type:b.type||'image/jpeg'}); try{if(navigator.canShare({files:[f]})) file=f}catch(_){}}).catch(()=>{});
  const o=openModal(`<div class="msheet shs"><div class="shs-h">${img?`<img src="${img}" alt="">`:`<span class="shs-ph">${I('share')}</span>`}<div><b>${esc(title)}</b><small>${esc(sub)}</small></div></div>
    <div class="shs-row">
     <button type="button" data-o="story"><span class="shs-ic shs-st">${I('plus')}</span>Your story</button>
     <a data-o="wa" href="${wa}" target="_blank" rel="noopener"><span class="shs-ic shs-wa">${I('chat')}</span>WhatsApp</a>
     <button type="button" data-o="ig"><span class="shs-ic shs-ig">${I('photo')}</span>Instagram</button>
     <button type="button" data-o="link"><span class="shs-ic">${I('link')}</span>Copy link</button>
     ${navigator.share?`<button type="button" data-o="more"><span class="shs-ic">${I('dots')}</span>More</button>`:''}
    </div><button type="button" data-close>Cancel</button></div>`,{cls:'msheet-wrap',label:`Share ${title}`});
  o.m.addEventListener('click',ev=>{const b=ev.target.closest('[data-o]'); if(!b) return; const k=b.dataset.o;
    if(k==='wa'){setTimeout(()=>o.close(),0); toast('Opening WhatsApp…'); return}
    if(k!=='more'&&k!=='ig') o.close();
    if(k==='story') storyFrom(story);
    else if(k==='link'){copyText(url); toast('Link copied')}
    else if(k==='more'){o.close(); navigator.share({title,text,url}).catch(()=>{})}
    else if(k==='ig'){o.close();
      /* Websites can't post to Instagram directly. On phones the system share sheet lists Instagram (Stories, Feed, Messages);
         elsewhere we copy the text and link and open Instagram so it can be pasted. */
      if(file){navigator.share({files:[file],title,text:full}).catch(()=>{}); return}
      if(navigator.share&&/Android|iPhone|iPad/i.test(navigator.userAgent)){navigator.share({title,text,url}).catch(()=>{}); return}
      copyText(full); window.open('https://www.instagram.com/','_blank','noopener'); toast('Link copied. Paste it into an Instagram story or message.')}
  })}
document.addEventListener('click',e=>{const b=e.target.closest('[data-tshare]'); if(!b) return; e.preventDefault(); e.stopPropagation(); const t=T(b.dataset.tshare); if(t) shareTo('trip',t)});
