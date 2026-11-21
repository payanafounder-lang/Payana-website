/* ---------- SOMEONE ELSE'S PROFILE (v1.4) ----------
   #u-<slug>. Team change (17 Nov): reviews from travel mates are ALWAYS visible, even on
   private accounts, with no option to hide them, so people can decide before joining a
   trip. Posts can be friends-only; you can still request to join their trips.
   Team follow-up: every review can be reported, and the person reviewed can post one reply. */
function personData(sl){
  if(S.people[sl]) return S.people[sl];
  const f=[...S.friends,...S.suggest,...S.requests].find(p=>slug(p[0])===sl), name=f?f[0]:sl.replace(/-/g,' ').replace(/\b\w/g,c=>c.toUpperCase());
  return S.people[sl]={name,user:sl.replace(/-/g,'.'),area:f?f[1]:'Bengaluru',v:'Phone verified',cover:6074,bio:'',tags:[],posts:0,friends:0,trips:0,mutual:[],upcoming:null,postsPrivate:true,reviews:[]};
}
const isFriend=n=>S.friends.some(f=>f[0]===n);
function person(sl){
  const P=personData(sl), fr=isFriend(P.name), req=(S.friendReq||[]).includes(P.name), first=P.name.split(' ')[0];
  const avg=P.reviews.length?(P.reviews.reduce((a,r)=>a+r.stars,0)/P.reviews.length):0, again=P.reviews.filter(r=>r.stars>=4).length;
  const t=P.upcoming&&T(P.upcoming), blocked=(S.blocked||[]).some(b=>b[0]===P.name);
  if(blocked) return `<div class="card empty" style="max-width:560px;margin:40px auto"><h2 style="font-size:22px;color:var(--fg)">You blocked ${esc(P.name)}</h2><p>They can't see your profile or message you.</p><button class="btn btn-line btn-sm" data-unblock style="margin-top:12px">Unblock</button></div>`;
  return `<div class="pcover"><img src="${src(P.cover)}" alt=""></div>
   <div class="phead"><div class="bigav" style="background:#E8D7C3">${esc(P.name.split(' ').map(x=>x[0]).join('').slice(0,2).toUpperCase())}</div><div class="who"><h1>${esc(P.name)}${/selfie|ID/.test(P.v)?'<span class="vf" style="width:22px;height:22px;font-size:13px">✓</span>':''}</h1><small>@${esc(P.user)} · ${esc(P.area)} · ${esc(P.v)}</small></div>
    <div class="btns">${fr?'<span class="btn btn-soft btn-sm" aria-disabled="true">Friends ✓</span>':`<button class="btn btn-primary btn-sm" data-addf ${req?'disabled':''}>${req?'Requested':'Add friend'}</button>`}<a class="btn btn-soft btn-sm" href="#messages">Message</a>
     <details class="mmore"><summary class="btn btn-line btn-sm" aria-label="More options" style="list-style:none">⋯</summary><div class="mmenu"><button data-pshare>Share profile</button><button class="danger" data-prep>Report ${esc(first)}</button><button class="danger" data-pblock>Block ${esc(first)}</button></div></details></div></div>
   <div class="op-grid"><aside style="display:grid;gap:16px;align-content:start">
     <section class="card sec"><div class="stats" style="padding:0;justify-content:space-around"><div><b>${P.posts}</b><small>Posts</small></div><div><b>${P.friends}</b><small>Friends</small></div><div><b>${P.trips}</b><small>Trips done</small></div></div>
      ${P.mutual.length?`<p class="hint">Friends with ${P.mutual.slice(0,2).map(esc).join(', ')}${P.mutual.length>2?` and ${P.mutual.length-2} other`:''}</p>`:''}${P.bio?`<p>${esc(P.bio)}</p>`:''}${langLine(P.langs)}${P.tags.length?`<div class="tags">${P.tags.map(x=>`<span class="tag">${esc(x)}</span>`).join('')}</div>`:''}</section>
     ${P.reviews.length?`<section class="card sec op-score"><div><b>${avg.toFixed(1)}</b><span class="stars-ro">${'★'.repeat(Math.round(avg))}${'☆'.repeat(5-Math.round(avg))}</span></div><p>From ${P.reviews.length} review${P.reviews.length>1?'s':''} · ${again} of ${P.reviews.length} would travel with ${esc(first)} again</p></section>`:''}</aside>
    <div style="display:grid;gap:16px;align-content:start;min-width:0">
     ${t?`<a class="upbanner card" href="#trip-${t.id}"><img src="${src(t.img)}" alt=""><div><span class="eyebrow">Upcoming trip</span><br><b style="font-size:17px">${t.name}</b><br><small style="color:var(--muted)">${t.dates} · ${t.seats} seats</small></div><span class="btn btn-primary btn-sm">Request to join</span></a>`:''}
     <section class="card sec" aria-labelledby="rvh"><div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap"><h2 id="rvh" style="font-size:20px">Reviews from travel mates</h2><span class="pill p-mut">Always visible</span></div>
      <p class="hint">Reviews show on every profile, even private ones, so you can decide before joining a trip with someone. The person reviewed can post one reply, and anyone can report a false or abusive review.</p>
      ${P.reviews.length?P.reviews.map((r,i)=>`<div class="op-rev"><div class="person">${av(r.who,i)}<div><b><a href="#u-${slug(r.who)}">${esc(r.who)}</a></b><small>${esc(r.trip)} · ${r.when}</small></div><span class="stars-ro" aria-label="${r.stars} out of 5 stars">${'★'.repeat(r.stars)}${'☆'.repeat(5-r.stars)}</span></div>
        <p>${esc(r.text)}</p>${r.reply?`<div class="op-reply"><b>Reply from ${esc(first)}</b><p>${esc(r.reply)}</p></div>`:''}${r.removed?'<p class="hint"><i>Reported. Our team is checking this review.</i></p>':`<button class="linkbtn muted" data-revrep="${i}" style="font-size:13px">Report review</button>`}</div>`).join(''):`<p class="hint"><i>No reviews yet. ${esc(first)} gets reviews after their first trip on Payana.</i></p>`}</section>
     ${P.postsPrivate&&!fr?`<div class="card sec op-lock"><span class="vf-ic" style="background:var(--chip);color:var(--muted)">${I('lock')}</span><div><b>Posts are for friends only</b><p class="hint">You can still request to join ${esc(first)}'s trips without being friends.</p></div><button class="btn btn-primary btn-sm" data-addf ${req?'disabled':''}>${req?'Requested':'Add friend'}</button></div>`:postGrid(S.myPosts.slice(0,6),P.name)}
    </div></div>`;
}
bind.person=sl=>{const P=personData(sl);
  $('#view').addEventListener('click',e=>{
    if(e.target.closest('[data-addf]')){S.friendReq=S.friendReq||[]; S.friendReq.push(P.name); route(); demoToast('no request was sent. In the real app they need to accept it.'); return}
    const rv=e.target.closest('[data-revrep]'); if(rv){const r=P.reviews[+rv.dataset.revrep]; openReport({what:'review',name:'review by '+r.who,onSent:()=>{r.removed=true; route()}}); return}
    if(e.target.closest('[data-prep]')){e.target.closest('details').open=false; openReport({what:'person',name:P.name}); return}
    if(e.target.closest('[data-pblock]')){S.blocked=S.blocked||[]; S.blocked.unshift([P.name,'Blocked just now']); route(); demoToast(P.name+' blocked on this page only.'); return}
    if(e.target.closest('[data-unblock]')){S.blocked=S.blocked.filter(b=>b[0]!==P.name); route(); return}
    if(e.target.closest('[data-pshare]')){e.target.closest('details').open=false; demoToast('sharing isn\'t connected yet. No link was copied.')}
  });
};
