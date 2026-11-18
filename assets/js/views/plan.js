/* ---------- PLAN TOGETHER ----------
   Budget (team change, 18 Nov): anyone in the group can add, change or remove items
   until the last day of the trip, then it locks. Every change is posted in the trip chat
   automatically, and everyone approves the new total again. The tab shows a dot while
   anyone hasn't approved. Each person can Approve or say Don't agree (with a reason that
   goes to the chat). Demo: changes and answers stay on this page only. */
const STC={Booked:'p-ok','To confirm':'p-warn',Planned:'p-mut',Idea:'p-bad'}, STN=['Idea','Planned','To confirm','Booked'];
function plan(){
  const t=T(S.planTrip)||TRIPS[0];
  return `<div class="cover" style="min-height:220px"><img src="${src(t.img)}" alt=""><a class="btn btn-glass back" href="#mytrips">← My trips</a>
   <div class="cover-in"><span class="eyebrow" style="color:var(--sun)">Plan together</span><h1 style="font-size:clamp(34px,5vw,56px)">${t.name}</h1><div class="meta">${t.dates} · ${t.people.length+1} going</div></div></div>
   <div style="display:flex;gap:10px;flex-wrap:wrap;margin:18px 0"><a class="btn btn-primary btn-sm" href="#tripday-${t.id}">${I('clock')}Trip day view</a><button class="btn btn-soft btn-sm" data-trusted>${I('pin')}Share with family</button><button class="btn btn-line btn-sm" data-help>Get help</button></div>
   <div class="ptabs" role="tablist">${['Plan','Chat','Budget','People','Memories'].map(x=>`<button role="tab" data-ptab="${x.toLowerCase()}" aria-selected="${S.planTab===x.toLowerCase()}">${x}${x==='Budget'&&!bAllOk(t)?'<span class="tabdot" aria-label="(waiting for approval)"></span>':''}</button>`).join('')}</div>
   <div id="ptab"></div>`;
}
function planTab(){
  const t=T(S.planTrip)||TRIPS[0], k=S.planTab, me_=me().name;
  if(k==='plan'){const days=[...new Set(S.plan.map(p=>p[0]))];
    return `<div class="pgrid"><div class="card sec">${days.map(d=>`<h2 style="font-size:18px">${d==='Sat'?'Saturday':'Sunday'}</h2><div class="items">${S.plan.map((p,i)=>p[0]!==d?'':`<div class="item"><time>${p[1]}</time><div><b>${esc(p[2])}</b><small>Owner: ${esc(p[3])}</small></div><button class="pill st ${STC[p[4]]}" data-st="${i}" title="Change status">${p[4]}</button></div>`).join('')}</div>`).join('')}
     <form class="additem" id="addi"><input id="ai-t" placeholder="Time" aria-label="Time"><input id="ai-w" placeholder="Add an activity, e.g. Coffee at Kodava café" aria-label="Activity"><button class="btn btn-primary btn-sm">Add</button></form></div>
     <div class="card sec"><h2 style="font-size:18px">Status key</h2>${STN.slice().reverse().map(s=>`<div><span class="pill ${STC[s]}">${s}</span></div>`).join('')}<p style="color:var(--muted);font-size:13.5px">Tap a status to move it forward. Everyone in the group sees changes.</p></div></div>`}
  if(k==='chat') return `<div class="card sec"><div class="chat" id="chat">${S.chat.map(m=>msgHTML(m,me_)).join('')}</div><form class="send" id="sendf"><input id="cmsg" placeholder="Message the group" aria-label="Message"><button class="btn btn-primary">Send</button></form></div>`;
  if(k==='budget') return budgetTab(t);
  if(k==='people') return `<div class="card sec">${[[me_,'You',true],...t.people].map((p,i)=>`<div class="person">${av(p[0],i)}<div><b>${esc(p[0])}${p[2]?'<span class="vf">✓</span>':''}</b><small>${p[1]}</small></div><a class="btn btn-line btn-sm" href="#messages">Message</a></div>`).join('')}</div>`;
  return `<div class="card sec"><h2 style="font-size:18px">Shared album</h2><div class="memgrid">${[t.img,...S.albumExtra].map(n=>`<img src="${src(n)}" alt="">`).join('')}<label class="add" for="memup">+ Add photos<input type="file" id="memup" accept="image/*" multiple hidden></label></div><p style="color:var(--muted);font-size:13.5px">After the trip, turn the album into a post with one tap.</p></div>`;
}
function msgHTML(m,me_){if(m[3]==='sys') return `<div class="msg-sys">${I('flag')}<div><p>${esc(m[1])}</p><small>${m[2]||'now'}${m[4]?` · <button class="linkbtn" data-ptab="budget">Check the budget</button>`:''}</small></div></div>`; const mine=m[0]===me_; return `<div class="msg ${mine?'mine':''}"><div class="bub">${esc(m[1])}</div><small>${mine?'You':esc(m[0])} · ${m[2]||'now'}</small></div>`}
bind.plan=()=>{
  const draw=()=>{$('#ptab').innerHTML=planTab(); const c=$('#chat'); if(c) c.scrollTop=c.scrollHeight};
  draw();
  $('#view').addEventListener('click',e=>{
    const tb=e.target.closest('[data-ptab]'); if(tb){S.planTab=tb.dataset.ptab; $$('.ptabs [data-ptab]').forEach(b=>b.setAttribute('aria-selected',b.dataset.ptab===S.planTab)); draw();
      // Phones show the whole chat on the page, so bring the newest message into view.
      if(S.planTab==='chat'){const last=$('#chat')&&$('#chat').lastElementChild; last&&last.scrollIntoView({block:'center'})}
      else $('.ptabs').scrollIntoView({block:'start'}); return}
    if(budgetClick(e,draw)) return;
    const st=e.target.closest('[data-st]'); if(st){const p=S.plan[+st.dataset.st]; p[4]=STN[(STN.indexOf(p[4])+1)%STN.length]; draw()}
    if(e.target.closest('[data-trusted]')) demoToast('nothing was sent. In the real app your main emergency contact gets a text with the plan and group list.');
    if(e.target.closest('[data-help]')) demoToast('support isn\'t connected yet. In the real app this contacts the Payana team.');
  });
  $('#view').addEventListener('submit',e=>{e.preventDefault(); if(budgetSubmit(e,draw)) return;
    if(e.target.id==='addi'){const w=$('#ai-w').value.trim(); if(!w) return; S.plan.push(['Sun',$('#ai-t').value.trim()||'—',w,me().name.split(' ')[0],'Idea']); draw(); demoToast('added to the plan on this page only')}
    if(e.target.id==='sendf'){const m=$('#cmsg').value.trim(); if(!m) return; S.chat.push([me().name,m,'now']); draw(); $('#cmsg')&&$('#cmsg').focus()}
  });
  $('#view').addEventListener('change',e=>{if(e.target.id==='memup'&&e.target.files.length) demoToast(`${e.target.files.length} photo${e.target.files.length>1?'s':''} selected. Nothing was uploaded.`)});
};

/* ---------- BUDGET: edit, approve, announce in chat ---------- */
const bGroup=t=>[me().name,...t.people.map(p=>p[0])];
const bTotal=()=>S.budget.reduce((a,r)=>a+r[1],0);
const bLastDay=t=>(t.dates.split('–').pop()||t.dates).replace(/·.*$/,'').trim();
function bApproved(){if(!S.bOk) S.bOk=new Set(bGroup(T(S.planTrip)||TRIPS[0])); return S.bOk}
function bAllOk(t){const ok=bApproved(); return bGroup(t).every(n=>ok.has(n))}
function bNo(){return S.bNo||(S.bNo=new Map())}
function bPost(text,ask){S.chat.push(['Payana',text,'now','sys',ask])}
function bChanged(what,who){const old=S.bPrevTotal, now=bTotal(), by=who||me().name; S.bOk=new Set([by]); bNo().clear(); S.bAsk=false;
  bPost(`${who||'You'} ${what}. New total ${rupee(now)} per person${old!==now?` (was ${rupee(old)})`:''}. Everyone needs to approve it again.`,true);
  if(!who) demoToast('budget changed and posted in the trip chat (this page only).')}
function budgetTab(t){
  const rows=S.budget, tot=bTotal(), grp=bGroup(t), ok=bApproved(), no=bNo(), n=grp.filter(x=>ok.has(x)).length, all=n===grp.length, mine=ok.has(me().name), ed=S.bEdit;
  const row=(r,i)=>ed===i?`<tr><td colspan="3"><form class="b-edit" id="bef" data-i="${i}"><label class="in" for="be-n">Item<input id="be-n" value="${esc(r[0])}"></label><label class="in" for="be-a">Per person (₹)<input id="be-a" type="number" inputmode="numeric" min="0" step="50" value="${r[1]}"></label><div class="b-acts"><button type="button" class="btn btn-line btn-sm" data-bcancel>Cancel</button><button class="btn btn-primary btn-sm">Save</button></div><p class="err" id="beerr" hidden></p></form></td></tr>`
    :`<tr><td>${esc(r[0])}</td><td>${rupee(r[1])}</td><td class="b-ctl"><button class="ibtn" data-bedit="${i}" aria-label="Change ${esc(r[0])}">✎</button><button class="ibtn" data-bdel="${i}" aria-label="Remove ${esc(r[0])}">✕</button></td></tr>`;
  return `<div class="pgrid"><div class="card sec"><h2 style="font-size:18px">Estimated cost per person</h2>
    <p class="hint" style="margin:0">Anyone in the group can change this until the last day of the trip (${esc(bLastDay(t))}). Then it locks. Every change is posted in the trip chat.</p>
    <div style="overflow-x:auto"><table class="budget b-tbl"><thead><tr><th>Item</th><th>Per person</th><th><span class="sr-only">Change</span></th></tr></thead><tbody>${rows.map(row).join('')}</tbody>
     <tfoot><tr><td>Total per person</td><td>${rupee(tot)}</td><td></td></tr><tr class="b-grp"><td>Whole group (${grp.length} people)</td><td>${rupee(tot*grp.length)}</td><td></td></tr></tfoot></table></div>
    <form class="b-add" id="baf"><input id="ba-n" placeholder="Add an item, e.g. Jeep to the viewpoint" aria-label="New item"><input id="ba-a" type="number" inputmode="numeric" min="0" step="50" placeholder="₹ per person" aria-label="Amount per person"><button class="btn btn-soft btn-sm">Add</button></form><p class="err" id="baerr" hidden></p>
    <p style="color:var(--muted);font-size:13.5px">Estimates only. Payments happen outside the app.</p></div>
   <div style="display:grid;gap:18px;align-content:start;min-width:0">
    <div class="card sec b-appr ${all?'ok':no.size?'bad':''}"><h2 style="font-size:18px">Group approval</h2>
     <div class="b-stat">${all?`${I('check')}<p><b>Everyone approved</b> ${rupee(tot)} per person.</p>`:`${I(no.size?'flag':'clock')}<p><b>${n} of ${grp.length} approved</b>${no.size?` · ${no.size} ${no.size>1?'don\'t':'doesn\'t'} agree`:''} · ${rupee(tot)} per person.</p>`}</div>
     ${grp.map((x,i)=>{const st=ok.has(x)?['p-ok','Approved']:no.has(x)?['p-bad','Not agreed']:['p-warn','Waiting']; return `<div class="person">${av(x,i)}<div><b>${x===me().name?'You':esc(x)}</b>${no.has(x)?`<small>“${esc(no.get(x))}”</small>`:''}</div><span class="pill ${st[0]}">${st[1]}</span></div>`}).join('')}
     ${S.bAsk?`<form class="b-no" id="bnf"><label class="in" for="bn-r">Why don't you agree?<textarea id="bn-r" rows="2" placeholder="e.g. The homestay is too expensive, can we find a cheaper one?"></textarea></label><p class="hint" style="font-size:13px;margin:0">Your reason is posted in the trip chat so the group can sort it out.</p><p class="err" id="bnerr" hidden></p><div class="b-acts"><button type="button" class="btn btn-line btn-sm" data-bnocancel>Cancel</button><button class="btn btn-sm danger-btn">Send</button></div></form>`
      :mine?`<p class="hint" style="margin:0">You approved this total. <button class="linkbtn" data-bnoask>Changed your mind?</button></p>`
      :`<p style="margin:4px 0 0;font-weight:700">Your answer${no.has(me().name)?' (you said you don\'t agree)':''}</p><div class="b-ans"><button class="btn btn-primary" data-bok>${I('check')}Approve ${rupee(tot)}</button><button class="btn btn-line" data-bnoask>Don't agree</button></div>`}
     <div class="b-demo"><span>Demo:</span><button class="linkbtn muted" data-bmember>someone else changes the budget</button>${all?'':`<button class="linkbtn muted" data-bsim>everyone else approves</button>`}</div>
     <p class="hint" style="font-size:13px">If the budget changes again, everyone answers again.</p></div></div></div>`;
}
function budgetClick(e,draw){
  if(!S.bPrevTotal) S.bPrevTotal=bTotal();
  const ed=e.target.closest('[data-bedit]'); if(ed){S.bEdit=+ed.dataset.bedit; draw(); const i=$('#be-a'); i&&i.focus(); return true}
  if(e.target.closest('[data-bcancel]')){S.bEdit=null; draw(); return true}
  const del=e.target.closest('[data-bdel]'); if(del){const r=S.budget[+del.dataset.bdel]; S.bPrevTotal=bTotal(); S.budget.splice(+del.dataset.bdel,1); S.bEdit=null; bChanged(`removed ${r[0]} (${rupee(r[1])})`); draw(); return true}
  if(e.target.closest('[data-bnoask]')){S.bAsk=true; draw(); const r=$('#bn-r'); r&&r.focus(); return true}
  if(e.target.closest('[data-bnocancel]')){S.bAsk=false; draw(); return true}
  if(e.target.closest('[data-bmember]')){const t=T(S.planTrip)||TRIPS[0], who=(t.people.find(p=>!/Host/.test(p[1]))||t.people[0])[0], i=S.budget.length>2?2:0, r=S.budget[i];
    if(!r){S.bPrevTotal=bTotal(); S.budget.push(['Food',1000]); bChanged('added Food: '+rupee(1000),who); route(); return true}
    S.bPrevTotal=bTotal(); const a=r[1]+200; S.budget[i]=[r[0],a]; bChanged(`changed ${r[0]}: ${rupee(r[1])} → ${rupee(a)}`,who); S.bEdit=null;
    route(); demoToast(`${who} changed the budget. You now see it as a group member would.`); return true}
  if(e.target.closest('[data-bok]')){const t=T(S.planTrip)||TRIPS[0]; bApproved().add(me().name); bNo().delete(me().name); bPost(`You approved the budget: ${rupee(bTotal())} per person.`); if(bAllOk(t)) bPost(`Everyone approved the budget: ${rupee(bTotal())} per person.`); route(); return true}
  if(e.target.closest('[data-bsim]')){const t=T(S.planTrip)||TRIPS[0]; bGroup(t).forEach(n=>{if(n!==me().name&&!bApproved().has(n)){bApproved().add(n); bNo().delete(n); S.chat.push([n,`${n} approved the budget: ${rupee(bTotal())} per person.`,'now','sys'])}}); if(bAllOk(t)) bPost(`Everyone approved the budget: ${rupee(bTotal())} per person.`); route(); return true}
  return false;
}
function budgetSubmit(e,draw){
  if(e.target.id==='bnf'){const why=$('#bn-r').value.trim(), er=$('#bnerr');
    if(why.length<3){er.textContent='Add a short reason so the group knows what to change.'; er.hidden=false; return true}
    bApproved().delete(me().name); bNo().set(me().name,why); S.bAsk=false;
    bPost(`You don't agree with the budget (${rupee(bTotal())} per person): "${why}"`,true); route(); demoToast('your answer was posted in the trip chat (this page only).'); return true}
  if(e.target.id==='bef'){const i=+e.target.dataset.i, r=S.budget[i], nm=$('#be-n').value.trim(), a=Math.round(+$('#be-a').value), er=$('#beerr');
    if(!nm){er.textContent='Give the item a name.'; er.hidden=false; return true}
    if(!(a>=0)||$('#be-a').value===''){er.textContent='Enter an amount in rupees.'; er.hidden=false; return true}
    S.bEdit=null; if(nm===r[0]&&a===r[1]){draw(); return true}
    S.bPrevTotal=bTotal(); const what=nm!==r[0]&&a===r[1]?`renamed ${r[0]} to ${nm}`:`changed ${r[0]}${nm!==r[0]?` (now ${nm})`:''}: ${rupee(r[1])} → ${rupee(a)}`;
    S.budget[i]=[nm,a]; bChanged(what); route(); return true}
  if(e.target.id==='baf'){const nm=$('#ba-n').value.trim(), raw=$('#ba-a').value, a=Math.round(+raw), er=$('#baerr');
    if(!nm||raw===''||!(a>=0)){er.textContent='Add an item name and an amount per person.'; er.hidden=false; return true}
    S.bPrevTotal=bTotal(); S.budget.push([nm,a]); bChanged(`added ${nm}: ${rupee(a)}`); route(); return true}
  return false;
}
