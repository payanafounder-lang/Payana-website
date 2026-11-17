/* ---------- WELCOME STEPS AFTER SIGN-UP (v1.3) ----------
   4 steps that fill the travel profile used for matching. Budget and group size are
   not asked here; they belong to each trip (team review, 17 Nov). */
let wcStep=1;
const WC={pace:'Balanced',ints:new Set(['Trekking']),free:new Set(['Weekends']),places:new Set()};
const WC_INTS=['Trekking','Coffee','Waterfalls','Food','Heritage','Beaches','Photography','Camping','Road trips','Wildlife'];
const WC_PLACES=['Coorg','Chikkamagaluru','Mysuru','Gokarna','Hampi','Wayanad','Ooty','Dandeli','Pondicherry','Kodaikanal'];
function welcome(){wcStep=1; return `<div class="focus-page wc-grid"><aside class="wc-photo"><img src="${src(6074)}" alt=""><a class="brand" href="#feed" style="color:#FFF8EE"><svg><use href="#mark"/></svg>Payana</a><ol class="wc-steps" id="wcsteps"></ol></aside><main class="wc-main" id="wcbody"></main></div>`}
function wcBody(){
  const chips=(set,list,key)=>list.map(k=>`<button type="button" class="chip" data-wc="${key}" data-v="${k}" aria-pressed="${set.has?set.has(k):set===k}">${k}</button>`).join('');
  const head=(t,s)=>`<div class="wc-prog" role="progressbar" aria-label="Setup progress" aria-valuemin="1" aria-valuemax="4" aria-valuenow="${wcStep}"><span style="width:${wcStep*25}%"></span></div><span class="eyebrow">Step ${wcStep} of 4</span><h1>${t}</h1><p class="lead">${s}</p>`;
  let b='';
  if(wcStep===1) b=head(`Welcome, ${esc(me().name.split(' ')[0])}`,'A few details so travellers know who they\'re meeting.')+`<div class="fm"><label class="in" for="wc-city">Where do you live?<input id="wc-city" value="Bengaluru"></label><label class="in" for="wc-lang">Languages you speak<input id="wc-lang" placeholder="Kannada, English"></label><label class="in" for="wc-bio">A line about you (optional)<textarea id="wc-bio" placeholder="Weekend trekker, happiest on a hill at sunrise"></textarea></label></div>`;
  if(wcStep===2) b=head('How do you like to travel?','We use this to suggest trips and people who fit you. You can change it anytime in Settings.')+`<div class="wc-q"><p>Your pace</p><div class="radios">${chips(WC.pace,['Relaxed','Balanced','Active'],'pace')}</div></div><div class="wc-q"><p>What do you enjoy? <span class="hint">Pick up to 5</span></p><div class="radios">${chips(WC.ints,WC_INTS,'ints')}</div></div><div class="wc-q"><p>When are you usually free?</p><div class="radios">${chips(WC.free,['Weekends','Long weekends','Weekdays'],'free')}</div></div>`;
  if(wcStep===3) b=head('Where would you like to go?','Pick a few places. We\'ll tell you when trips there are forming.')+`<div class="radios">${chips(WC.places,WC_PLACES,'places')}</div>`;
  if(wcStep===4) b=head('Add a photo and get verified','Verified travellers get more trip approvals. You can do this later from Settings.')+`<div class="wc-photo-pick"><span class="bigav">${esc(me().name.split(' ').map(x=>x[0]).join('').slice(0,2).toUpperCase())}</span><label class="btn btn-soft" for="wc-ph">${I('photo')}Add profile photo<input type="file" id="wc-ph" accept="image/*" hidden></label></div><a class="card wc-verify" href="#verify" data-wcverify>${I('shield')}<span><b>Get verified</b><small>Phone, selfie and ID with DigiLocker. About 2 minutes.</small></span><span class="pill p-warn">Recommended</span></a>`;
  return b+`<p class="err" id="wcerr" hidden></p><div class="wc-nav">${wcStep>1?'<button class="btn btn-line" data-wcback>Back</button>':''}<button class="btn btn-primary" data-wcnext>${wcStep<4?'Continue':'Finish and explore trips'}</button>${wcStep<4?'<button class="linkbtn muted" data-wcskip>Skip for now</button>':''}</div>`;
}
function wcDraw(){
  $('#wcsteps').innerHTML=['About you','How you travel','Places you\'d like to go','Photo and verification'].map((s,i)=>`<li class="${i+1<wcStep?'done':i+1===wcStep?'on':''}" ${i+1===wcStep?'aria-current="step"':''}>${s}</li>`).join('');
  $('#wcbody').innerHTML=wcBody(); scrollTo({top:0,behavior:'instant'});
}
function wcSave(){const P=S.profile;
  if(wcStep===1){const l=$('#wc-lang').value.trim(), b=$('#wc-bio').value.trim(); if(l) P.langs=l; if(b) P.bio=b}
  if(wcStep===2) P.tags=[WC.pace+' pace',...WC.ints];
}
bind.welcome=()=>{wcDraw();
  $('#view').addEventListener('click',e=>{
    const c=e.target.closest('[data-wc]'); if(c){const k=c.dataset.wc, v=c.dataset.v;
      if(k==='pace'){WC.pace=v; $$('[data-wc="pace"]').forEach(x=>x.setAttribute('aria-pressed',x===c))}
      else{const set=WC[k]; if(set.has(v)) set.delete(v); else {if(k==='ints'&&set.size>=5){demoToast('pick up to 5 interests'); return} set.add(v)} c.setAttribute('aria-pressed',set.has(v))}
      return}
    if(e.target.closest('[data-wcback]')){wcStep--; wcDraw()}
    if(e.target.closest('[data-wcnext]')||e.target.closest('[data-wcskip]')){
      if(e.target.closest('[data-wcnext]')){if(wcStep===2&&!WC.ints.size){const er=$('#wcerr'); er.textContent='Pick at least one thing you enjoy.'; er.hidden=false; return} wcSave()}
      if(wcStep<4){wcStep++; wcDraw()} else {store.set('welcomed',true); location.hash=pending||'explore'; pending=null; demoToast('profile set up on this device only.')}}
    if(e.target.closest('[data-wcverify]')) store.set('welcomed',true);
  });
  $('#view').addEventListener('change',e=>{if(e.target.id==='wc-ph'&&e.target.files[0]) demoToast('photo shown on this page only. Nothing was uploaded.')});
};
