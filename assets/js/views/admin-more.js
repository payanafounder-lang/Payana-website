/* ---------- ADMIN SECTIONS ADDED IN v1.5 (team only, demo) ----------
   User lookup, selfie verification queue, support tickets, reported reviews.
   Rule for reported reviews (team follow-up): remove reviews that break the rules
   (false, abusive, personal details, not from a real shared trip), not ones that are
   just negative. Every action needs a note for the action log. */
ADMIN_TABS.push(['users','Users'],['verify','Verification queue'],['tickets','Support tickets'],['reviews','Reported reviews']);
const TK={New:'p-bad','Waiting on user':'p-warn',Resolved:'p-ok'};
function admin_users(){
  const q=(S.adQ||'').toLowerCase(), L=S.adminUsers.filter(u=>!q||(u.name+u.user+u.id).toLowerCase().includes(q)), u=S.adminUsers.find(x=>x.id===S.adUser)||L[0];
  return `<div class="ph"><div><h1>Users</h1><p><span class="pill p-warn">Sample data</span></p></div><label class="in" for="adq" style="min-width:260px">Find<input id="adq" type="search" value="${esc(S.adQ||'')}" placeholder="Name, @username or user ID"></label></div>
   <div class="ad-split"><section class="card sec"><table class="ad-tbl"><thead><tr><th>ID</th><th>Name</th><th>Status</th><th>Joined</th></tr></thead><tbody>${L.map(x=>`<tr data-pick="u:${x.id}" class="${u&&x.id===u.id?'sel':''}"><td>${x.id}</td><td>${esc(x.name)} <small class="hint">@${esc(x.user)}</small></td><td><span class="pill ${x.status==='Active'?'p-ok':'p-bad'}">${x.status}</span></td><td>${x.joined}</td></tr>`).join('')||'<tr><td colspan="4" class="empty">No users match.</td></tr>'}</tbody></table></section>
    ${u?`<section class="card sec"><div class="person">${av(u.name,2,56)}<div><b style="font-size:18px">${esc(u.name)}</b><small>@${esc(u.user)} · ${esc(u.area)}</small></div><span class="pill ${u.status==='Active'?'p-ok':'p-bad'}">${u.status}</span></div>
     <dl class="kv">${[['User ID',u.id],['Joined',u.joined],['Phone',u.phone+' (hidden)'],['Verified',u.verified],['Consent',u.consent],['Trips',u.trips],['Reports',u.reports]].map(([k,v])=>`<dt>${k}</dt><dd>${esc(v)}</dd>`).join('')}</dl>
     ${u.tripRows.length?`<table class="ad-tbl" style="min-width:0"><thead><tr><th>Trip</th><th>Role</th><th>Status</th></tr></thead><tbody>${u.tripRows.map(r=>`<tr><td>${r[0]}</td><td>${r[1]}</td><td>${r[3]}</td></tr>`).join('')}</tbody></table>`:''}
     <h3 style="font-size:15px">History</h3><ul class="tips">${u.history.map(h=>`<li>${h[0]} · ${esc(h[1])} <small class="hint">(${h[2]})</small></li>`).join('')}</ul>
     <label class="in" for="adnote">Note for the action log<textarea id="adnote"></textarea></label>
     <div class="btns"><button class="btn btn-soft btn-sm" data-uact="Warning sent">Send warning</button><button class="btn btn-soft btn-sm" data-uact="Badge removed">Remove badge</button><button class="btn btn-sm danger-btn" data-uact="Account paused">Pause account</button></div>
     <p class="hint">Phone and email are shown only when needed. Every action is saved in the action log.</p></section>`:''}</div>`;
}
function admin_verify(){const Q=S.selfieQueue, v=Q[0];
  return `<div class="ph"><div><h1>Verification queue</h1><p><span class="pill p-warn">Sample data</span> · ${Q.length} waiting</p></div></div>
   ${v?`<section class="card sec" style="max-width:760px"><p><b>${esc(v.name)}</b> <span class="hint">@${esc(v.user)} · submitted ${v.when}</span></p>
    <div class="row2"><div><div class="ad-ph">Profile photo</div><small class="hint">Uploaded at sign-up</small></div><div><div class="ad-ph">Live selfie</div><small class="hint">Taken with head-turn check</small></div></div>
    <ul class="tips"><li>Same person in both photos?</li><li>Selfie is live, not a photo of a screen?</li><li>Photo shows an adult?</li></ul>
    <div class="btns"><button class="btn btn-sm forest-btn" data-vq="approved">Approve</button><button class="btn btn-soft btn-sm" data-vq="asked to retake">Ask to retake</button><button class="btn btn-sm danger-btn" data-vq="rejected and flagged">Reject &amp; flag</button></div>
    <p class="hint">Selfie is deleted [after the decision / after X days], as the Privacy Notice says. ID checks come from DigiLocker; uploaded ID photos (PAN, licence, passport) are deleted after review. No Aadhaar card photos.</p></section>`:emptyState('check','Queue is empty','All selfie checks are done.','')}`;
}
function admin_tickets(){return `<div class="ph"><div><h1>Support tickets</h1><p><span class="pill p-warn">Sample data</span></p></div></div>
  <section class="card sec">${S.tickets.map(t=>`<div class="setrow"><span><b>${t.id} · ${esc(t.title)}</b><small>${esc(t.who)} · ${t.via} · ${t.when}</small></span><span class="pill ${TK[t.status]}">${t.status}</span>${t.status!=='Resolved'?`<button class="btn btn-soft btn-sm" data-tkdone="${t.id}">Mark resolved</button>`:''}</div>`).join('')}
   <p class="hint">Anything about safety moves to Safety reports automatically.</p></section>`}
function admin_reviews(){const L=S.reportedReviews.filter(r=>r.status==='open');
  return `<div class="ph"><div><h1>Reported reviews</h1><p><span class="pill p-warn">Sample data</span> · ${L.length} open</p></div></div>
   <div class="note">Reviews stay visible while we check. Remove only reviews that break the rules (false claims, abuse, personal details, not from a real shared trip), not ones that are just negative.</div>
   ${L.length?L.map(r=>`<section class="card sec ad-rev"><div><p class="hint"><b style="color:var(--fg)">${r.id}</b> · review of <b style="color:var(--fg)">${esc(r.about)}</b> by ${esc(r.by)} · ${esc(r.trip)}</p>
     <blockquote><span class="stars-ro">${'★'.repeat(r.stars)}${'☆'.repeat(5-r.stars)}</span> "${esc(r.text)}"</blockquote><p class="hint"><b style="color:var(--fg)">Reported by ${esc(r.about.split(' ')[0])}:</b> ${esc(r.reason)} · ${r.when}</p></div>
     <div><dl class="kv">${r.checks.map(([k,v])=>`<dt>${k}</dt><dd>${v}</dd>`).join('')}</dl>
      <div class="btns" style="margin-top:12px"><button class="btn btn-sm danger-btn" data-rvact="removed" data-id="${r.id}">Remove review</button><button class="btn btn-soft btn-sm" data-rvact="personal details hidden" data-id="${r.id}">Hide personal details only</button><button class="btn btn-line btn-sm" data-rvact="kept" data-id="${r.id}">Keep review</button></div>
      <p class="hint">Both people are told the outcome. Repeat false reviews can lead to a warning.</p></div></section>`).join(''):emptyState('check','No reported reviews','Nothing to check right now.','')}`;
}
ADMIN_CLICK.push((e,draw)=>{
  const pk=e.target.closest('[data-pick^="u:"]'); if(pk){S.adUser=pk.dataset.pick.slice(2); draw(); return}
  const ua=e.target.closest('[data-uact]'); if(ua){if(!($('#adnote')||{}).value){demoToast('add a note first. Every action is saved in the action log.'); return} demoToast(ua.dataset.uact.toLowerCase()+' (sample user, nothing changed).'); return}
  const vq=e.target.closest('[data-vq]'); if(vq){const v=S.selfieQueue.shift(); draw(); demoToast(`${v.name}'s selfie ${vq.dataset.vq} (sample).`); return}
  const tk=e.target.closest('[data-tkdone]'); if(tk){S.tickets.find(t=>t.id===tk.dataset.tkdone).status='Resolved'; draw(); return}
  const rv=e.target.closest('[data-rvact]'); if(rv){S.reportedReviews.find(r=>r.id===rv.dataset.id).status=rv.dataset.rvact; draw(); demoToast(`review ${rv.dataset.rvact} (sample). Both people would be told.`)}
});
document.addEventListener('input',e=>{if(e.target.id==='adq'){S.adQ=e.target.value; const p=e.target.selectionStart; $('#adbody').innerHTML=adminBody(); const i=$('#adq'); i.focus(); i.setSelectionRange(p,p)}});
