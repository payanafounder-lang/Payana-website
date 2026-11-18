/* ---------- SAVED (v1.5) ----------
   Posts and trips you saved. Only you can see them.
   Team change (18 Nov): Saved is a tab on your profile (like Instagram), not a menu item.
   Old #saved links open that tab.
   Demo: saved items live on this page only (reset on reload). */
function savedBody(){
  const f=S.svF||'all', posts=S.posts.filter(p=>S.saved.has(p.id)), trips=TRIPS.filter(t=>(S.savedTrips||new Set()).has(t.id));
  const items=[...(f!=='posts'?trips.map(t=>`<a class="card sv-item" href="#trip-${t.id}"><img src="${src(t.img)}" alt=""><div><span class="eyebrow">Trip</span><h2>${esc(t.name)}</h2><small>${t.dates} · ${rupee(t.budget)} · ${t.seats} seats</small></div><button class="sv-x" data-unsave-trip="${t.id}" aria-label="Remove from saved">${I('save')}</button></a>`):[]),
    ...(f!=='trips'?posts.map(p=>`<a class="card sv-item" href="#post-${p.id}">${p.img?`<img src="${src(p.img)}" alt="">`:`<div class="sv-tip">${esc(p.text)}</div>`}<div><span class="eyebrow">${esc(p.type)} · ${esc(p.who)}</span><h2>${esc(p.text.slice(0,60))}${p.text.length>60?'…':''}</h2></div><button class="sv-x" data-unsave-post="${p.id}" aria-label="Remove from saved">${I('save')}</button></a>`):[])];
  return `<p class="hint" style="margin:0 0 10px">${I('lock')} Only you can see what you save.</p>
   <div class="radios" role="group" aria-label="Filter" style="margin-bottom:18px">${[['all','All',posts.length+trips.length],['trips','Trips',trips.length],['posts','Posts',posts.length]].map(([k,l,n])=>`<button class="chip" data-svf="${k}" aria-pressed="${f===k}">${l} · ${n}</button>`).join('')}</div>
   ${items.length?`<div class="sv-grid">${items.join('')}</div>`:emptyState('save','Nothing saved yet','Tap Save on a post or a trip to keep it here for later.','<a class="btn btn-primary" href="#explore">Explore trips</a><a class="btn btn-soft" href="#feed">Home feed</a>')}`;
}
function savedClick(e){
  const f=e.target.closest('[data-svf]'); if(f){S.svF=f.dataset.svf; route(); return true}
  const ut=e.target.closest('[data-unsave-trip]'), up=e.target.closest('[data-unsave-post]');
  if(ut||up){e.preventDefault(); if(ut) S.savedTrips.delete(ut.dataset.unsaveTrip); else S.saved.delete(+up.dataset.unsavePost); route(); demoToast('removed from saved'); return true}
}
