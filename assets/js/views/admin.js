/* ---------- ADMIN & SAFETY DASHBOARD (team only, v1.2) ----------
   Demo: sample queue, actions change this page only. Live: a separate, access-controlled
   internal tool. Never ship admin screens inside the public member app without staff login. */
const ADMIN_TABS=[['reports','Safety reports']];
// Later admin sections push their tab here and add click handlers to ADMIN_CLICK.
const ADMIN_CLICK=[];
const SEV={high:['p-bad','High'],medium:['p-warn','Medium'],low:['p-ok','Low']};
function admin(){
  if(!S.adTab) S.adTab='reports';
  return `<div class="ad-shell"><nav class="ad-nav" aria-label="Admin"><a class="brand" href="#feed"><svg><use href="#mark"/></svg>Payana Admin</a>
    ${ADMIN_TABS.map(([k,l])=>`<button data-adtab="${k}" aria-current="${S.adTab===k}">${l}</button>`).join('')}<a class="ad-exit" href="#settings">← Back to the app</a></nav>
   <div class="ad-main" id="adbody">${adminBody()}</div></div>`;
}
function adminBody(){
  const fn=window['admin_'+S.adTab]; return fn?fn():'';
}
function admin_reports(){
  if(!S.adRep) S.adRep=S.reports[0].id; if(!S.adRepF) S.adRepF='open';
  const L=S.reports.filter(r=>r.status===S.adRepF), r=S.reports.find(x=>x.id===S.adRep)||L[0];
  const open=S.reports.filter(x=>x.status==='open');
  return `<div class="ph"><div><h1>Safety reports</h1><p><span class="pill p-warn">Sample data</span></p></div></div>
   <div class="ad-tiles"><div class="card"><small>Open reports</small><b>${open.length}</b></div><div class="card"><small>High severity</small><b style="color:var(--bad-fg)">${open.filter(x=>x.sev==='high').length}</b></div><div class="card"><small>Avg. first response</small><b>[hrs]</b></div><div class="card"><small>Completed trips (30 days)</small><b>[#]</b></div></div>
   <div class="ad-split"><section class="card sec"><div class="radios">${[['open','Open'],['review','In review'],['closed','Closed']].map(([k,l])=>`<button class="chip" data-repf="${k}" aria-pressed="${S.adRepF===k}">${l}</button>`).join('')}</div>
     <div style="overflow-x:auto"><table class="ad-tbl"><thead><tr><th>ID</th><th>Type</th><th>Reported</th><th>Severity</th><th>Age</th><th>Owner</th></tr></thead><tbody>
     ${L.length?L.map(x=>`<tr data-rep="${x.id}" class="${r&&x.id===r.id?'sel':''}" tabindex="0"><td>${x.id}</td><td>${esc(x.kind)}</td><td>${esc(x.target)}</td><td><span class="pill ${SEV[x.sev][0]}">${SEV[x.sev][1]}</span></td><td>${x.age}</td><td>${esc(x.owner)}</td></tr>`).join(''):`<tr><td colspan="6" class="empty">Nothing here.</td></tr>`}</tbody></table></div></section>
    ${r?`<section class="card sec"><h2 style="font-size:18px">${r.id} · ${esc(r.kind)} <span class="pill ${SEV[r.sev][0]}">${SEV[r.sev][1]}</span></h2><p class="hint">${esc(r.detail)}</p>
     <dl class="kv">${r.facts.map(([k,v])=>`<dt>${k}</dt><dd>${esc(v)}</dd>`).join('')}</dl>
     <div class="note">Messages and evidence are shown to moderators only and kept as a record.</div>
     <label class="in" for="adnote">Note for the action log<textarea id="adnote" placeholder="Why you took this action"></textarea></label>
     <div class="btns wrap-btns"><button class="btn btn-soft btn-sm" data-adact="warn">Send warning</button><button class="btn btn-soft btn-sm" data-adact="remove">Remove from trip</button><button class="btn btn-sm danger-btn" data-adact="suspend">Pause account</button><button class="btn btn-line btn-sm" data-adact="close">Close, no action</button></div>
     <p class="hint">Status: <b>${{open:'Open',review:'In review',closed:'Closed'}[r.status]}</b>${r.log?` · Last action: ${esc(r.log)}`:''}</p></section>`:''}</div>`;
}
bind.admin=()=>{
  const draw=()=>{$('#adbody').innerHTML=adminBody(); $$('[data-adtab]').forEach(b=>b.setAttribute('aria-current',b.dataset.adtab===S.adTab))};
  const v=$('#view');
  v.addEventListener('click',e=>{
    const t=e.target.closest('[data-adtab]'); if(t){S.adTab=t.dataset.adtab; draw(); return}
    const f=e.target.closest('[data-repf]'); if(f){S.adRepF=f.dataset.repf; S.adRep=null; draw(); return}
    const row=e.target.closest('[data-rep]'); if(row){S.adRep=row.dataset.rep; draw(); return}
    const a=e.target.closest('[data-adact]'); if(a){const r=S.reports.find(x=>x.id===S.adRep)||S.reports.find(x=>x.status===S.adRepF); if(!r) return;
      const note=($('#adnote')||{}).value||'';
      if(a.dataset.adact!=='close'&&!note.trim()){demoToast('add a note first. Every action is saved in the action log.'); $('#adnote').focus(); return}
      const L={warn:'Warning sent',remove:'Removed from trip',suspend:'Account paused',close:'Closed, no action'}; r.log=L[a.dataset.adact]; r.status=a.dataset.adact==='warn'?'review':'closed'; r.owner='You';
      demoToast(L[a.dataset.adact].toLowerCase()+' (sample report, this page only). Nothing was sent.'); draw()}
    ADMIN_CLICK.forEach(h=>h(e,draw));
  });
  v.addEventListener('keydown',e=>{const row=e.target.closest('[data-rep]'); if(row&&e.key==='Enter'){S.adRep=row.dataset.rep; draw()}});
};
