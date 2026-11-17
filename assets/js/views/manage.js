/* ---------- MANAGE A TRIP (v1.3) ----------
   Host: edit details, approve/remove people, hand over hosting, cancel.
   Team change (17 Nov): cancelling first offers to make someone else the host
   (they must accept), then needs a reason and a message the whole group sees.
   Member (not host): leave the trip, also with a reason.
   Demo: changes stay on this page only. */
const CANCEL_REASONS=['Personal or family emergency','Weather or road conditions','Not enough people','Booking fell through','Safety concern','Other'];
const WHO_JOIN=[['all','Everyone (I approve each request)'],['women','Women-only (selfie-verified)'],['verified','Verified people only'],['fof','Friends and friends of friends']];
let mgPanel=null;
function manage(id){
  const t=T(id)||T('coorg'), st=S.joined[t.id], host=st!=='approved'&&st!=='requested';
  if(t.cancelled) return `<div class="card sec mg-cancelled"><span class="pill p-bad" style="justify-self:start">Cancelled</span><h1>${esc(t.name)} was cancelled</h1><p class="hint">Reason shared with the group: <b>${esc(t.cancelled.reason)}</b></p><p>"${esc(t.cancelled.msg)}"</p><p class="hint"><b>Demo:</b> nobody was told. In the real app everyone gets a notification and the trip leaves Explore.</p><a class="btn btn-primary" href="#mytrips" style="justify-self:start">Back to My trips</a></div>`;
  if(!host) return memberView(t);
  const others=t.people.filter(p=>p[0]!==me().name&&!/Host/.test(p[1])), rq=HOSTREQ[t.id]||[];
  if(t.handover) mgPanel=null;
  return `<div class="ph"><div><h1>Manage: ${esc(t.name)}</h1><p>${t.dates} · ${t.seats} spots · <span class="pill p-ok">${st==='hosting'?'You\'re the host':'Demo: host view'}</span></p></div><a class="btn btn-line btn-sm" href="#trip-${t.id}">View trip page</a></div>
   <div class="mg-grid"><form class="card sec" id="mgf"><h2>Edit trip details</h2>
     <label class="in" for="mg-name">Trip name<input id="mg-name" value="${esc(t.name)}"></label>
     <div class="row2"><label class="in" for="mg-dates">Dates<input id="mg-dates" value="${esc(t.dates)}"></label><label class="in" for="mg-bud">Budget per person (₹)<input id="mg-bud" type="number" min="500" step="100" value="${t.budget}"></label></div>
     <div class="row2"><label class="in" for="mg-grp">Group size<select id="mg-grp">${[2,3,4,5,6,8,10,12].map(n=>`<option ${n===t.group?'selected':''}>${n}</option>`).join('')}</select></label>
      <label class="in" for="mg-pace">Pace<select id="mg-pace">${['Relaxed','Balanced','Active'].map(p=>`<option ${p===t.pace?'selected':''}>${p}</option>`).join('')}</select></label></div>
     <label class="in" for="mg-who">Who can join<select id="mg-who">${WHO_JOIN.map(([k,l])=>`<option value="${k}" ${(t.who||'all')===k?'selected':''}>${l}</option>`).join('')}</select></label>
     <label class="in" for="mg-rules">Group rules<textarea id="mg-rules">${esc(t.rules||'No smoking in the car. Share costs equally on the day.')}</textarea></label>
     <p class="hint">Changing dates or budget notifies everyone in the group.</p><div class="actions"><button class="btn btn-primary">Save changes</button></div></form>
    <div style="display:grid;gap:20px;align-content:start;min-width:0">
     <section class="card sec"><h2>People · ${t.people.length}</h2>${t.people.map((p,i)=>`<div class="person">${av(p[0],i)}<div><b>${esc(p[0])}</b><small>${esc(p[1])}</small></div>${/Host/.test(p[1])?'<span class="pill p-ok">Host</span>':`<button class="btn btn-line btn-sm" data-mgrm="${esc(p[0])}">Remove</button>`}</div>`).join('')}
      ${rq.length?`<h3 style="font-size:15px">Waiting for approval · ${rq.length}</h3>${rq.map((p,i)=>`<div class="person">${av(p[0],i+3)}<div><b>${esc(p[0])}</b><small>${esc(p[1])}</small></div><div class="btns"><button class="btn btn-primary btn-sm" data-mgok="${i}">Approve</button><button class="btn btn-line btn-sm" data-mgno="${i}" aria-label="Decline">✕</button></div></div>`).join('')}`:''}
      <button class="btn btn-soft btn-sm" style="justify-self:start" data-invite="${t.id}">Invite friends</button></section>
     <section class="card sec mg-plans"><h2 style="color:var(--bad-fg)">Change of plans</h2>
      ${t.handover?`<div class="note ok">${I('clock')}<p>Waiting for <b>${esc(t.handover)}</b> to accept hosting. They have 24 hours. <button class="linkbtn" data-mgundo>Cancel request</button></p></div>`:`
      <div class="setrow" style="border-top:0;padding-top:0"><span><b>Hand over hosting</b><small>Make someone else the host and stay in or leave the trip</small></span><button class="btn btn-soft btn-sm" data-mgpanel="handover">Choose host</button></div>
      <div class="setrow"><span><b style="color:var(--bad-fg)">Cancel this trip</b><small>You'll need to give a reason</small></span><button class="btn btn-sm p-bad" data-mgpanel="cancel" aria-expanded="${mgPanel==='cancel'}">Cancel trip</button></div>`}
      <p class="hint">Repeated last-minute cancellations can limit your account.</p></section>
     ${mgPanel?cancelPanel(t,others):''}</div></div>`;
}
function cancelPanel(t,others){
  const sel=`<label class="in" for="mg-newhost">New host<select id="mg-newhost">${others.map(p=>`<option>${esc(p[0])}</option>`).join('')}</select></label>`;
  const handover=others.length?`<div class="note ok mg-ho"><div style="display:grid;gap:10px;width:100%"><b>Keep the trip going: make someone else the host</b>${sel}<small>They have to accept before you're removed as host.</small><button type="button" class="btn btn-sm forest-btn" data-mgask style="justify-self:start">Ask them to host</button></div></div>`:'<p class="hint">Nobody else has joined yet, so the trip can\'t be handed over.</p>';
  if(mgPanel==='handover') return `<section class="card sec mg-panel"><h2>Hand over hosting</h2>${handover}<button type="button" class="linkbtn muted" data-mgclose>Close</button></section>`;
  return `<form class="card sec mg-panel" id="mgcx" aria-labelledby="mgcx-h"><span class="eyebrow" style="color:var(--bad-fg)">Before you cancel</span><h2 id="mgcx-h">${t.people.length} people are going</h2><p class="hint">The trip can still happen if someone else hosts it.</p>
    ${handover}
    <fieldset class="rp-opts"><legend>Still want to cancel? Tell the group why <span style="color:var(--bad-fg)">(required)</span></legend>${CANCEL_REASONS.map((r,i)=>`<label class="rp-opt"><input type="radio" name="cxr" value="${i}">${r}</label>`).join('')}</fieldset>
    <label class="in" for="mg-msg">Message to the group<textarea id="mg-msg" placeholder="Sorry everyone, …"></textarea></label>
    <p class="hint">Everyone sees your reason. Settle any money already shared outside the app. A safety concern also goes to Payana's safety team.</p><p class="err" id="mgerr" hidden></p>
    <div class="actions"><button type="button" class="btn btn-line" data-mgclose>Keep the trip</button><button class="btn danger-btn">Cancel trip and tell everyone</button></div></form>`;
}
function memberView(t){
  return `<div class="ph"><div><h1>${esc(t.name)}</h1><p>${t.dates} · You're going</p></div><a class="btn btn-line btn-sm" href="#trip-${t.id}">View trip page</a></div>
   <form class="card sec" id="mglv" style="max-width:640px"><h2>Leave this trip</h2><p class="hint">Tell ${esc(t.host.split(' ')[0])} and the group why, so they can plan. Leave as early as you can.</p>
    <fieldset class="rp-opts"><legend>Reason <span style="color:var(--bad-fg)">(required)</span></legend>${['Personal or family emergency','My dates changed','Budget changed','Not comfortable with the group','Other'].map((r,i)=>`<label class="rp-opt"><input type="radio" name="lvr" value="${i}">${r}</label>`).join('')}</fieldset>
    <label class="in" for="lv-msg">Message to the group (optional)<textarea id="lv-msg"></textarea></label><p class="hint">Not comfortable with someone? You can also <button type="button" class="linkbtn" data-lvrep>report it privately</button>.</p><p class="err" id="lverr" hidden></p>
    <div class="actions"><a class="btn btn-line" href="#trip-${t.id}">Stay in the trip</a><button class="btn danger-btn">Leave trip</button></div></form>`;
}
bind.manage=id=>{
  const t=T(id)||T('coorg'), v=$('#view'), err=(sel,m)=>{const e=$(sel); e.textContent=m; e.hidden=false};
  v.addEventListener('click',e=>{
    const p=e.target.closest('[data-mgpanel]'); if(p){mgPanel=mgPanel===p.dataset.mgpanel?null:p.dataset.mgpanel; route(); setTimeout(()=>{const x=$('.mg-panel'); x&&x.scrollIntoView({behavior:'smooth',block:'start'})},30); return}
    if(e.target.closest('[data-mgclose]')){mgPanel=null; route(); return}
    if(e.target.closest('[data-mgask]')){t.handover=$('#mg-newhost').value; mgPanel=null; route(); demoToast(`no request was sent. In the real app ${t.handover} gets a "become the host" notification.`); return}
    if(e.target.closest('[data-mgundo]')){t.handover=null; route(); return}
    const rm=e.target.closest('[data-mgrm]'); if(rm){t.people=t.people.filter(x=>x[0]!==rm.dataset.mgrm); route(); demoToast(rm.dataset.mgrm+' removed on this page only. In the real app they\'re told privately.'); return}
    const ok=e.target.closest('[data-mgok]'), no=e.target.closest('[data-mgno]');
    if(ok||no){const x=HOSTREQ[t.id].splice(+(ok||no).dataset[ok?'mgok':'mgno'],1)[0]; if(ok) t.people.push([x[0],x[1].split(' · ')[0],true]); route(); demoToast(ok?x[0]+' approved (sample request)':'sample request declined'); return}
    if(e.target.closest('[data-lvrep]')) openReport({what:'person',name:'someone in this group'});
    const inv=e.target.closest('[data-invite]'); if(inv){typeof openInvite==='function'?openInvite(inv.dataset.invite):demoToast('invites come in version 1.5')}
  });
  v.addEventListener('submit',e=>{e.preventDefault();
    if(e.target.id==='mgf'){const n=$('#mg-name').value.trim(); if(!n) return; t.name=n; t.dates=$('#mg-dates').value.trim()||t.dates; t.budget=+$('#mg-bud').value||t.budget; t.group=+$('#mg-grp').value; t.pace=$('#mg-pace').value; t.who=$('#mg-who').value; t.rules=$('#mg-rules').value; route(); demoToast('trip updated on this page only. Nobody was notified.')}
    if(e.target.id==='mgcx'){const r=$('input[name=cxr]:checked'), m=$('#mg-msg').value.trim(); if(!r) return err('#mgerr','Pick a reason. The group sees it.'); if(m.length<5) return err('#mgerr','Write a short message to the group.');
      t.cancelled={reason:CANCEL_REASONS[+r.value],msg:m}; S.joined[t.id]='cancelled'; store.set('joined',S.joined); mgPanel=null; route()}
    if(e.target.id==='mglv'){if(!$('input[name=lvr]:checked')) return err('#lverr','Pick a reason so the group can plan.'); delete S.joined[t.id]; store.set('joined',S.joined); location.hash='mytrips'; demoToast('you left the trip on this page only. Nobody was told.')}
  });
};
