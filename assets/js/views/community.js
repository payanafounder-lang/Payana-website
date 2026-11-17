/* ---------- INSIDE A COMMUNITY (v1.4) ----------
   #community-<index>. Demo: sample posts and rules; join/leave on this page only. */
function community(i){
  const k=+i||0, c=S.comms[k]||S.comms[0], posts=(S.commPosts[k]||[]), tab=S.cmTab||'posts';
  const trips=TRIPS.filter(t=>t.interests.some(x=>/Trek|Sunrise/.test(x))||k!==0).slice(0,3);
  let body='';
  if(tab==='posts') body=`<a class="card composer" href="#create">${av(me().name,0,40)}<span>Share a tip or photo with ${esc(c[0])}…</span></a>
    ${posts.length?posts.map((p,j)=>{const t=p.trip&&T(p.trip); return `<article class="card sec cm-post"><div class="person">${av(p.who,j)}<div><b><a href="#u-${slug(p.who)}">${esc(p.who)}</a></b><small>${p.time}</small></div>${p.tip?'<span class="pill p-mut">Travel tip</span>':''}</div><p>${esc(p.text)}</p>
      ${t?`<a class="mtrip" href="#trip-${t.id}" style="margin:0"><img src="${src(t.img)}" alt=""><div><b>${t.name}</b><small>${t.dates} · ${rupee(t.budget)} · ${t.seats} seats</small></div><span>View trip</span></a>`:''}
      <div class="acts" style="border:0;padding:0"><button>${I('heart')}${p.likes}</button><button>${I('comment')}${p.com}</button></div></article>`}).join(''):`<div class="card empty">No posts yet. Be the first to share a tip.</div>`}`;
  if(tab==='trips') body=`<div class="tgrid">${trips.map(t=>tripCard(t,true)).join('')}</div>`;
  if(tab==='members') body=`<div class="card sec">${S.friends.slice(0,5).map((p,j)=>`<div class="person">${av(p[0],j)}<div><b><a href="#u-${slug(p[0])}">${esc(p[0])}</a></b><small>${esc(p[1])}${j===2?' · moderator':''}</small></div></div>`).join('')}<p class="hint">and ${c[2].replace(' members','')} more</p></div>`;
  if(tab==='about') body=`<div class="card sec"><h2 style="font-size:20px">Group rules</h2><ol class="rulelist">${S.commRules.map(r=>`<li>${esc(r)}</li>`).join('')}</ol><p class="hint">Moderated by Meera R. and Payana. <button class="linkbtn" data-cm-report>Report this community</button></p></div>`;
  return `<div class="cover cm-cover"><img src="${src(c[1])}" alt=""><a class="btn btn-glass back" href="#communities">← Communities</a>
    <div class="cover-in"><span class="eyebrow" style="color:var(--sun)">Community · Bengaluru</span><h1 style="font-size:clamp(34px,5vw,56px)">${esc(c[0])}</h1><div class="meta">${c[2]}</div>
     <div class="btns"><button class="btn ${c[3]?'btn-glass':'btn-primary'}" data-cmjoin>${c[3]?'Joined ✓':'Join'}</button><a class="btn btn-glass" href="#newtrip">${I('plus')}Create a trip here</a></div></div></div>
   <div class="radios" role="tablist" style="margin:18px 0">${[['posts','Posts'],['trips','Trips'],['members','Members'],['about','About & rules']].map(([x,l])=>`<button class="chip" role="tab" data-cmtab="${x}" aria-pressed="${tab===x}">${l}</button>`).join('')}</div>
   <div style="display:grid;gap:16px">${body}</div>`;
}
bind.community=i=>{const c=S.comms[+i||0]||S.comms[0];
  $('#view').addEventListener('click',e=>{
    const t=e.target.closest('[data-cmtab]'); if(t){S.cmTab=t.dataset.cmtab; route(); return}
    if(e.target.closest('[data-cmjoin]')){c[3]=!c[3]; demoToast(c[3]?`joined ${c[0]} on this page only`:`left ${c[0]}`); route()}
    if(e.target.closest('[data-cm-report]')) openReport({what:'post',name:c[0]});
  });
};
