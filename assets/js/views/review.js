/* ---------- AFTER-TRIP REVIEW (v1.3) ----------
   Team change (17 Nov): every travel mate gets their own stars, "travel again?" and a
   written review. Reviews are public on their profile (always visible). The private
   safety box goes only to Payana's safety team. */
const RV={};
function stars(name,val,label){return `<div class="stars" role="radiogroup" aria-label="${esc(label)}">${[1,2,3,4,5].map(n=>`<button type="button" role="radio" aria-checked="${n===val}" aria-label="${n} star${n>1?'s':''}" data-star="${esc(name)}" data-n="${n}" class="${n<=val?'on':''}">${I('star')}</button>`).join('')}</div>`}
function review(id){
  const t=T(id)||T('chikkamagaluru'); if(!RV[t.id]) RV[t.id]={happened:'yes',trip:4,good:new Set(['Great group']),mates:{}};
  const r=RV[t.id], mates=t.people.filter(p=>p[0]!==me().name);
  if(r.sent) return `<div class="rv-done card sec"><span class="big-ok">${I('check')}</span><h1>Thanks for reviewing ${esc(t.name)}</h1><p class="hint">Your reviews would now show on each person's profile. <b>Demo:</b> nothing was posted.</p><div class="actions" style="justify-content:center"><a class="btn btn-primary" href="#explore">Find your next trip</a><a class="btn btn-line" href="#mytrips">My trips</a></div></div>`;
  mates.forEach(p=>{if(!r.mates[p[0]]) r.mates[p[0]]={stars:0,again:'',text:''}});
  return `<div class="cover" style="min-height:240px"><img src="${src(t.img)}" alt=""><a class="btn btn-glass back" href="#mytrips">← My trips</a><div class="cover-in"><span class="eyebrow" style="color:var(--sun)">Welcome back</span><h1 style="font-size:clamp(34px,5vw,54px)">How was ${esc(t.name)}?</h1><div class="meta">${t.dates} · ${t.people.length} travellers</div></div></div>
   <form id="rvf" class="rv-form">
    <section class="card sec"><h2>Did the trip happen?</h2><div class="radios">${[['yes','Yes, I went'],['cancelled','It was cancelled'],['no','I didn\'t go']].map(([k,l])=>`<button type="button" class="chip" data-hap="${k}" aria-pressed="${r.happened===k}">${l}</button>`).join('')}</div></section>
    ${r.happened!=='yes'?`<section class="card sec"><p class="hint">Thanks for letting us know. If something went wrong, tell us below or <button type="button" class="linkbtn" data-rv-report>report it</button>.</p></section>`:`
    <section class="card sec"><h2>Rate the trip</h2>${stars('__trip',r.trip,'Trip rating')}
     <p style="font-weight:600">What went well?</p><div class="radios">${['Great group','Plan was clear','On budget','Felt safe','Good pace'].map(k=>`<button type="button" class="chip" data-good="${k}" aria-pressed="${r.good.has(k)}">${k}</button>`).join('')}</div></section>
    <section class="card sec"><h2>Review your travel mates</h2><p class="hint">Reviews show on their profile for everyone to see, even if their account is private. Keep it honest and kind. For anything unsafe, use the private box below.</p>
     ${mates.map((p,i)=>{const m=r.mates[p[0]], f=p[0].split(' ')[0]; return `<div class="rv-mate"><div class="person">${av(p[0],i)}<div><b>${esc(p[0])}</b><small>${esc(p[1])}</small></div></div>
      <div class="rv-line">${stars(p[0],m.stars,'Rating for '+p[0])}<span class="hint">Travel again?</span><div class="radios">${['Yes','Not sure','No'].map(a=>`<button type="button" class="chip" data-again="${esc(p[0])}" data-v="${a}" aria-pressed="${m.again===a}">${a}</button>`).join('')}</div></div>
      <label class="in" for="rvt${i}">Your review of ${esc(f)}<textarea id="rvt${i}" data-rvtext="${esc(p[0])}" placeholder="What was it like travelling with ${esc(f)}?">${esc(m.text)}</textarea></label></div>`}).join('')}</section>`}
    <section class="card sec" style="background:var(--surface-2)"><h2>Anything that made you uncomfortable?</h2><p class="hint">Private. Only Payana's safety team sees this.</p><label class="in" for="rv-safe"><span class="sr-only">Private safety feedback</span><textarea id="rv-safe"></textarea></label></section>
    <p class="err" id="rverr" hidden></p>
    <div class="actions"><a class="btn btn-soft" href="#plan" data-plan="${t.id}">Add photos to Memories</a><button class="btn btn-primary">Submit review</button></div></form>`;
}
bind.review=id=>{
  const t=T(id)||T('chikkamagaluru'), r=RV[t.id], v=$('#view');
  v.addEventListener('click',e=>{
    const h=e.target.closest('[data-hap]'); if(h){r.happened=h.dataset.hap; route(); return}
    const s=e.target.closest('[data-star]'); if(s){const n=+s.dataset.n; if(s.dataset.star==='__trip') r.trip=n; else r.mates[s.dataset.star].stars=n;
      s.parentElement.querySelectorAll('[data-star]').forEach(b=>{b.classList.toggle('on',+b.dataset.n<=n); b.setAttribute('aria-checked',+b.dataset.n===n)}); return}
    const g=e.target.closest('[data-good]'); if(g){const k=g.dataset.good; r.good.has(k)?r.good.delete(k):r.good.add(k); g.setAttribute('aria-pressed',r.good.has(k)); return}
    const a=e.target.closest('[data-again]'); if(a){r.mates[a.dataset.again].again=a.dataset.v; $$(`[data-again="${CSS.escape(a.dataset.again)}"]`).forEach(x=>x.setAttribute('aria-pressed',x===a)); return}
    if(e.target.closest('[data-rv-report]')) openReport({what:'trip',name:t.name});
    const pl=e.target.closest('[data-plan]'); if(pl){S.planTrip=pl.dataset.plan; store.set('planTrip',S.planTrip)}
  });
  v.addEventListener('input',e=>{const ta=e.target.closest('[data-rvtext]'); if(ta) r.mates[ta.dataset.rvtext].text=ta.value});
  v.addEventListener('submit',e=>{e.preventDefault();
    if(r.happened==='yes'){const missing=Object.entries(r.mates).filter(([,m])=>!m.stars).map(([n])=>n.split(' ')[0]);
      if(missing.length){const er=$('#rverr'); er.textContent='Give stars to '+missing.join(', ')+'.'; er.hidden=false; er.scrollIntoView({block:'center'}); return}}
    S.reviewed=S.reviewed||{}; S.reviewed[t.id]=true; r.sent=true; route(); demoToast('reviews not posted. In the real app they appear on each person\'s profile.')});
};
