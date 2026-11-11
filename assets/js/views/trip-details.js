/* ---------- TRIP DETAILS ---------- */
function trip(id){
  const t=T(id)||TRIPS[0], st=S.joined[t.id];
  return `<div class="cover"><img src="${src(t.img)}" alt="${t.name}"><a class="btn btn-glass back" href="#explore">← Explore</a>
   <div class="cover-in"><span class="fit ${t.fit}" style="position:static;justify-self:start"><b></b>${FITL[t.fit]}</span><h1>${t.name}</h1>
    <div class="facts"><div class="fact"><small>Dates</small><b>${t.dates}</b></div><div class="fact"><small>Budget</small><b>${rupee(t.budget)} / person</b></div><div class="fact"><small>Pace</small><b>${t.pace}</b></div><div class="fact"><small>Group</small><b>${t.seats} seats left</b></div></div></div></div>
  <div class="tdgrid"><div>
   <section class="card sec"><h2>${st==='hosting'?'What this trip is about':'Why this trip fits you'}</h2><ul class="checks">
    ${t.why.map(w=>`<li><span class="ic p-ok">✓</span>${w}</li>`).join('')}${t.miss.map(w=>`<li><span class="ic p-warn">!</span>${w}</li>`).join('')}
    ${t.km?`<li><span class="ic p-mut">${t.km}</span>km from Bengaluru</li>`:''}</ul></section>
   <section class="card sec"><h2>Rough plan</h2><div class="days">${t.plan.map(d=>`<div class="day"><small>${d[0]}</small><div><b>${d[1]}</b><ul>${d[2].map(x=>`<li>${esc(x)}</li>`).join('')}</ul></div></div>`).join('')}</div></section>
   <section class="card sec"><h2>Who's going</h2>${t.people.map((p,i)=>`<div class="person">${av(p[0],i)}<div><b>${p[0]}${p[2]?'<span class="vf" title="Verified">✓</span>':''}</b><small>${p[1]}</small></div>${p[2]?'<span class="pill p-ok">Verified</span>':'<span class="pill p-mut">Not verified</span>'}</div>`).join('')}</section>
  </div>
  <aside class="reqbox" style="display:grid;gap:16px">
   <section class="card sec" id="reqsec">${reqBox(t,st)}</section>
   <section class="card sec"><h2 style="font-size:18px">Safety tips</h2><ul class="tips"><li>Chat with the group in the app before you travel.</li><li>Share the itinerary with a trusted contact.</li><li>Meet in a public place for the first time.</li></ul><button class="linkbtn" style="justify-self:start;font-size:14px" data-report>Report this trip</button></section>
  </aside></div>`;
}
function reqBox(t,st){
  if(st==='hosting'){const rq=HOSTREQ[t.id]||[];
    return `<div class="statusbox p-ok"><b>You're hosting this trip</b><span>It's live in Explore. You approve who joins.</span></div>
     <h2 style="font-size:18px">Join requests · ${rq.length}</h2>
     ${rq.length?rq.map((p,i)=>`<div class="person">${av(p[0],i+1)}<div><b>${p[0]}<span class="vf">✓</span></b><small>${p[1]}</small></div><div class="btns"><button class="btn btn-primary btn-sm" data-happ="${i}">Approve</button><button class="btn btn-line btn-sm" data-hdec="${i}" aria-label="Decline">✕</button></div></div>`).join(''):'<p style="color:var(--muted);font-size:14px">No pending requests right now.</p>'}
     <a class="btn btn-primary" href="#plan" data-plan="${t.id}">Open trip planner</a><button class="linkbtn" style="font-size:14px" data-share-trip>Share trip link</button>`}
  if(st==='approved') return `<div class="statusbox p-ok"><b>You're in!</b><span>${t.host} approved your request. The group chat and planner are open.</span></div><a class="btn btn-primary" href="#plan" data-plan="${t.id}">Open trip planner</a>`;
  if(st==='requested') return `<div class="statusbox p-warn"><b>Request sent</b><span>${t.host} and the group will review it. Most hosts reply within a day.</span></div><button class="btn btn-soft" data-approve>Demo: host approves</button><button class="linkbtn" style="font-size:14px" data-cancel>Cancel request</button>`;
  return `<h2>Request to join</h2><p style="color:var(--muted);font-size:14.5px">Hosted by <b style="color:var(--fg)">${t.host}</b>${t.hv?'<span class="vf">✓</span>':''}. The host and group approve each request.</p>
   <form class="fm" id="joinf"><label class="in" for="jmsg">Message to the group<textarea id="jmsg" placeholder="Hi! I'm into ${t.interests[0].toLowerCase()} and free those dates…"></textarea></label>
   <label class="check" for="jrules"><input type="checkbox" id="jrules"><span>I'll follow the trip plan and Payana's Community Rules.</span></label><p class="err" id="jerr" hidden></p>
   <button class="btn btn-primary" type="submit">Send request</button></form>`;
}
bind.trip=id=>{const t=T(id)||TRIPS[0]; const sec=$('#reqsec');
  sec.addEventListener('submit',e=>{e.preventDefault(); if(!$('#jrules').checked){$('#jerr').textContent='Tick the box to agree to the rules.'; $('#jerr').hidden=false; return} S.joined[t.id]='requested'; store.set('joined',S.joined); sec.innerHTML=reqBox(t,'requested'); demoToast('request recorded on this device only. Nothing was sent to '+t.host+'.')});
  sec.addEventListener('click',e=>{
    if(e.target.closest('[data-approve]')){S.joined[t.id]='approved'; store.set('joined',S.joined); sec.innerHTML=reqBox(t,'approved'); demoToast(`simulated approval from ${t.host}. Welcome to the group!`)}
    if(e.target.closest('[data-cancel]')){delete S.joined[t.id]; store.set('joined',S.joined); sec.innerHTML=reqBox(t)}
    const pl=e.target.closest('[data-plan]'); if(pl){S.planTrip=pl.dataset.plan; store.set('planTrip',S.planTrip)}
    const ha=e.target.closest('[data-happ]'), hd=e.target.closest('[data-hdec]');
    if(ha||hd){const p=HOSTREQ[t.id].splice(+(ha||hd).dataset[ha?'happ':'hdec'],1)[0]; if(ha){t.people.push([p[0],p[1].split(' · ')[0],true]); t.seats=Math.max(t.group-t.people.length,0)+' of '+t.group} demoToast(ha?`${p[0]} approved (sample request). In the real app they'd now see the group chat.`:'sample request declined'); route()}
    if(e.target.closest('[data-share-trip]')) demoToast('sharing isn\'t connected yet. No link was copied.');
  });
  $('[data-report]').onclick=()=>demoToast('reports aren\'t sent yet. In the real app our team reviews every report.');
};
