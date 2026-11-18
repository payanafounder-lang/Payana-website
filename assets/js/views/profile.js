/* ---------- PROFILE ----------
   Team changes (18 Nov): Settings opens from here, like Instagram (no Settings item in the menu).
   There's no separate Friends page: tap the Friends count for your friends and friend requests. */
function profile(){
  const u=me(), ini=u.name.split(' ').map(x=>x[0]).join('').slice(0,2).toUpperCase();
  const tabs=['Posts','Saved','Reviews','Tagged']; if(!['posts','saved','reviews','tagged'].includes(S.profTab)) S.profTab='posts';
  let body='';
  if(S.profTab==='posts') body=`<div class="pgridimg">${S.myPosts.map(n=>`<img src="${src(n)}" alt="">`).join('')}</div>`;
  else if(S.profTab==='saved') body=savedBody();
  else if(S.profTab==='reviews') body=`<div style="display:grid;gap:12px">${S.profile.reviews.map((r,i)=>`<div class="card sec"><div class="person">${av(r[0],i)}<div><b>${r[0]}</b><small>${r[2]}</small></div><span style="color:var(--sun)">★★★★★</span></div><p>${r[1]}</p></div>`).join('')}</div>`;
  else body=`<div class="pgridimg">${S.profile.tagged.map(n=>`<img src="${src(n)}" alt="">`).join('')}</div>`;
  return `<div class="pcover"><img src="${src(S.profile.cover)}" alt=""></div>
   <div class="phead"><div class="bigav">${esc(ini)}</div><div class="who"><h1>${esc(u.name)}<span class="vf" style="width:22px;height:22px;font-size:13px">✓</span></h1><small>@${esc(u.name.toLowerCase().replace(/\s+/g,'.'))} · Bengaluru</small></div>
    <div class="btns"><button class="btn btn-soft btn-sm" data-edit>Edit profile</button><a class="btn btn-line btn-sm" href="#settings">${I('gear')}Settings</a><button class="btn btn-line btn-sm" data-more>More</button></div></div>
   <div class="stats"><button class="stat" data-stat="posts"><b>${S.myPosts.length}</b><small>Posts</small></button><button class="stat" data-stat="friends"><b>${S.friends.length}</b><small>Friends</small></button><a class="stat" href="#mytrips" style="text-decoration:none;color:inherit"><b>${S.profile.tripsDone}</b><small>Trips done</small></a></div>
   <div style="display:grid;gap:14px;padding:0 20px 20px"><p style="max-width:60ch">${esc(S.profile.bio)}</p>
    <div class="tags">${S.profile.tags.map(x=>`<span class="tag">${esc(x)}</span>`).join('')}</div>
    <a class="upbanner" href="#trip-${S.profile.upcoming.trip}"><img src="${src(S.profile.upcoming.img)}" alt=""><div><span class="eyebrow">Upcoming trip</span><br><b style="font-size:17px">${esc(S.profile.upcoming.label)}</b></div><span class="btn btn-primary btn-sm">View trip</span></a></div>
   <div class="subtabs" role="tablist">${tabs.map(x=>`<button role="tab" data-prof="${x.toLowerCase()}" aria-selected="${S.profTab===x.toLowerCase()}">${x}</button>`).join('')}</div>${body}`;
}
function friendSheet(){
  const m=document.createElement('div'); m.className='modal'; m.setAttribute('role','dialog'); m.setAttribute('aria-modal','true'); m.setAttribute('aria-label','Friends');
  const reqs=()=>S.requests.length?`<div class="fs-reqs"><h3 style="font-size:15px">Friend requests · ${S.requests.length}</h3>${reqHTML()}</div>`:'';
  const list=q=>S.friends.filter(p=>p[0].toLowerCase().includes(q)).map((p,i)=>`<div class="person">${av(p[0],i)}<div><b>${p[0]}</b><small>${p[1]}</small></div><a class="btn btn-line btn-sm" href="#messages">Message</a></div>`).join('')||'<p style="color:var(--muted);font-size:14px">No friends match that name.</p>';
  m.innerHTML=`<div class="sheet" style="width:min(420px,100%)"><div class="sheet-top"><h2 style="font-size:22px">Friends · ${S.friends.length}</h2><button class="x" aria-label="Close">×</button></div>
   <div id="fsr">${reqs()}</div><label class="in" for="fsq" style="font-weight:400"><input id="fsq" placeholder="Search friends" autocomplete="off"></label><div id="fsl" style="display:grid;gap:12px;max-height:50vh;overflow:auto">${list('')}</div>
   <a class="linkbtn" href="#search" style="font-size:14px">Find people you may know →</a></div>`;
  document.body.appendChild(m); const close=()=>{m.remove(); removeEventListener('keydown',esc_); removeEventListener('hashchange',close)};
  const esc_=e=>{if(e.key==='Escape')close()};
  m.addEventListener('click',e=>{if(e.target===m||e.target.closest('.x')) return close();
    const a=e.target.closest('[data-acc]'), d=e.target.closest('[data-dec]'); if(!a&&!d) return;
    const p=S.requests.splice(+(a||d).dataset[a?'acc':'dec'],1)[0]; if(a) S.friends.unshift([p[0],'New friend']);
    demoToast(a?`you and ${p[0]} are now friends (sample request, this page only)`:'request declined (sample request, this page only)');
    m.querySelector('#fsr').innerHTML=reqs(); m.querySelector('#fsl').innerHTML=list(m.querySelector('#fsq').value.trim().toLowerCase());
    m.querySelector('h2').textContent=`Friends · ${S.friends.length}`; const n=$('.stat[data-stat="friends"] b'); if(n) n.textContent=S.friends.length}); addEventListener('keydown',esc_); addEventListener('hashchange',close);
  m.querySelector('#fsq').oninput=e=>m.querySelector('#fsl').innerHTML=list(e.target.value.trim().toLowerCase());
  m.querySelector('#fsq').focus();
}
bind.profile=()=>{if(S.openFriends){S.openFriends=false; setTimeout(friendSheet,0)} $('#view').addEventListener('click',e=>{if(S.profTab==='saved'&&savedClick(e)) return; const st=e.target.closest('[data-stat]'); if(st){if(st.dataset.stat==='friends') friendSheet(); else {S.profTab=st.dataset.stat; route(); setTimeout(()=>$('.subtabs').scrollIntoView({behavior:'smooth',block:'start'}),50)} return}const b=e.target.closest('[data-prof]'); if(b){S.profTab=b.dataset.prof; route()} if(e.target.closest('[data-edit]')){location.hash='editprofile'} if(e.target.closest('[data-more]'))demoToast('others see Report and Block here')});}
