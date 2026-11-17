/* ---------- INVITE FRIENDS SHEET (v1.5, shared) ----------
   openInvite(tripId): share the trip link or invite Payana friends.
   People you invite still need your approval to join. Demo: nothing is sent. */
function openInvite(id){
  const t=T(id)||TRIPS[0], link=location.href.split('#')[0]+'#t-'+t.id, invited=new Set();
  const m=document.createElement('div'); m.className='modal iv-modal'; m.setAttribute('role','dialog'); m.setAttribute('aria-modal','true'); m.setAttribute('aria-labelledby','iv-t');
  const draw=()=>{m.innerHTML=`<div class="sheet iv-sheet"><div class="sheet-top"><h2 id="iv-t" style="font-size:24px">Invite friends to ${esc(t.name)}</h2><button class="x" aria-label="Close">×</button></div>
    <p class="hint">People you invite still need your approval to join. ${t.seats} spots.</p>
    <div class="iv-share">${[['WhatsApp','chat'],['Instagram','photo'],['Text message','comment'],['Copy link','share']].map(([l,ic])=>`<button data-ivs="${l}"><span>${I(ic)}</span>${l}</button>`).join('')}</div>
    <label class="iv-link"><span class="sr-only">Trip link</span><input readonly value="${esc(link)}"><button class="btn btn-sm forest-btn" data-ivs="Copy link">Copy</button></label>
    <h3 style="font-size:16px">Your Payana friends</h3><div style="display:grid;gap:10px;max-height:40vh;overflow:auto">${S.friends.map((p,i)=>{const done=invited.has(p[0]); return `<div class="person">${av(p[0],i)}<div><b>${esc(p[0])}</b><small>${esc(p[1])}</small></div><button class="btn ${done?'btn-soft':'btn-primary'} btn-sm" data-ivf="${esc(p[0])}" ${done?'disabled':''}>${done?'Invited':'Invite'}</button></div>`}).join('')}</div></div>`};
  draw(); document.body.appendChild(m);
  const close=()=>{m.remove(); removeEventListener('keydown',k)}, k=e=>{if(e.key==='Escape') close()}; addEventListener('keydown',k);
  m.addEventListener('click',e=>{if(e.target===m||e.target.closest('.x')) return close();
    const s=e.target.closest('[data-ivs]'); if(s){if(s.dataset.ivs==='Copy link'){try{navigator.clipboard.writeText(link)}catch(_){} demoToast('link copied. It opens the trip preview for people without an account.')} else demoToast(s.dataset.ivs+' isn\'t connected yet. Nothing was shared.')}
    const f=e.target.closest('[data-ivf]'); if(f){invited.add(f.dataset.ivf); draw(); demoToast('no invite was sent (demo).')}});
}
