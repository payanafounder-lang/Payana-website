/* ---------- FEED ---------- */
function postHTML(p){
  const t=p.trip&&T(p.trip), lf=p.lfc&&T(p.lfc), liked=S.liked.has(p.id), saved=S.saved.has(p.id);
  return `<article class="card post" data-post="${p.id}">
   <div class="post-h">${av(p.who,p.id)}<div><b><a href="#u-${slug(p.who)}">${esc(p.who)}</a>${p.v?'<span class="vf" title="Verified">✓</span>':''}</b><small>${esc(p.where)} · ${esc(p.time)}${p.edited?' · Edited':''}</small></div><span class="pill p-mut ptype">${esc(p.type)}</span><button type="button" class="pmore" data-pmenu aria-label="Post options">${I('dots')}</button></div>
   ${carousel(p,{alt:p.where?`Photo from ${p.where}`:''})}
   <div class="post-b"><p>${esc(p.text)}</p>
    ${lf?`<div class="lfc"><span class="eyebrow">Looking for companions</span><h4>${lf.name} · ${lf.dates}</h4><div class="meta" style="color:var(--muted)"><span>${rupee(lf.budget)} / person</span><span>${lf.pace} pace</span><span>${lf.seats} seats</span></div><a class="btn btn-primary btn-sm" style="justify-self:start" href="#trip-${lf.id}">View trip and request to join</a></div>`:''}
    ${t?`<div class="linked"><span>${I('pin','style="width:16px;height:16px;vertical-align:-3px"')} Going again · ${t.name}, ${t.dates.split('–')[0].trim()}</span><a class="linkbtn" href="#trip-${t.id}">View trip →</a></div>`:''}
   </div>
   <div class="acts"><button data-like class="${liked?'on':''}" aria-pressed="${liked}">${I('heart')}<span>${p.likes+(liked?1:0)}</span></button><a href="#post-${p.id}" class="actlink">${I('comment')}${p.com}</a><button data-share>${I('share')}Share</button><button data-save class="save ${saved?'on':''}" aria-pressed="${saved}">${I('save')}${saved?'Saved':'Save'}</button></div>
  </article>`;
}
function feed(){
  const u=me();
  return `<div class="feed"><div style="min-width:0">
   <div class="ph"><div><h1>Hi ${esc(u.name.split(' ')[0])}</h1><p>Your friends' trips and stories</p></div></div>
   <div class="stories">${TRIPS.slice(0,6).map((t,i)=>`<a class="story" href="#trip-${t.id}"><span class="ring"><img src="${src(t.img)}" alt=""></span><span><b>${t.host.split(' ')[0]}</b><br><small>${t.name}</small></span></a>`).join('')}</div>
   <div class="card composer">${av(u.name,0,40)}<a href="#create">Share a trip, photo or tip…</a><a href="#create" class="btn btn-soft btn-sm" style="flex:none;background:var(--chip);color:var(--fg)">${I('photo')}</a></div>
   <div class="posts" id="posts">${S.posts.map(postHTML).join('')}</div></div>
   <aside class="rail">
    <div class="card box"><h3>Friend requests <a href="#friends">See all</a></h3><div id="reqs">${reqHTML()}</div></div>
    <div class="card box"><h3>People you may know</h3>${S.suggest.map((p,i)=>`<div class="person">${av(p[0],i+2)}<div><b><a href="#u-${slug(p[0])}">${p[0]}</a></b><small>${p[1]}</small></div><button class="btn btn-soft btn-sm" data-add="${i}">Add friend</button></div>`).join('')}</div>
    <div class="card box"><h3>Your communities <a href="#communities">Browse</a></h3>${S.comms.slice(0,3).map((c,i)=>`<div class="comm"><img src="${src(c[1])}" alt=""><div><b>${c[0]}</b><small>${c[2]}</small></div></div>`).join('')}</div>
   </aside></div>`;
}
function reqHTML(){return S.requests.length?S.requests.map((p,i)=>`<div class="person" style="margin-bottom:10px">${av(p[0],i+3)}<div><b>${p[0]}</b><small>${p[1]}</small></div><div class="btns"><button class="btn btn-primary btn-sm" data-acc="${i}">Accept</button><button class="btn btn-line btn-sm" data-dec="${i}" aria-label="Decline">✕</button></div></div>`).join(''):'<p style="color:var(--muted);font-size:14px">No pending requests.</p>'}
// Re-draw one post (after a like, save or edit) without jumping back to its first photo.
function rePost(el,p){const c=el.querySelector('[data-car]'), k=c?carIdx(c):0, w=document.createElement('div'); w.innerHTML=postHTML(p).trim(); const n=w.firstElementChild; el.replaceWith(n); const c2=n.querySelector('[data-car]'); if(c2&&k) carSet(c2,k); return n}
function bindPosts(root){
  root.addEventListener('click',e=>{const post=e.target.closest('[data-post]'); if(!post) return; const id=post.dataset.post, p=S.posts.find(x=>String(x.id)===id); if(!p) return;
    const el=()=>root.querySelector(`[data-post="${id}"]`);
    // Double-tap a photo to like it, like Instagram.
    if(dblTap(e,sl=>{if(!S.liked.has(p.id)){S.liked.add(p.id); heartPop(rePost(post,p).querySelector('[data-car]'))} else heartPop(sl.closest('[data-car]'))})) return;
    if(e.target.closest('[data-pmenu]')){const c=post.querySelector('[data-car]'); postMenu(p,{idx:carIdx(c),onEdit:k=>{const x=el(); if(!x) return; const n=rePost(x,p); if(k!=null) carSet(n.querySelector('[data-car]'),k)},onDelete:()=>{const x=el(); x&&x.remove()}}); return}
    if(e.target.closest('[data-like]')){S.liked.has(p.id)?S.liked.delete(p.id):S.liked.add(p.id); rePost(post,p)}
    else if(e.target.closest('[data-save]')){S.saved.has(p.id)?S.saved.delete(p.id):S.saved.add(p.id); rePost(post,p); demoToast(S.saved.has(p.id)?'saved on this page only':'removed from saved')}
    else if(e.target.closest('[data-share]')){demoToast('sharing isn\'t connected yet. The real app will copy a link to this post.')}
    else if(e.target.closest('[data-cmt]')){demoToast('comments come in the full app.')}
  });
}
function bindReqs(){
  document.addEventListener('click',reqClick);
}
function reqClick(e){const a=e.target.closest('[data-acc]'), d=e.target.closest('[data-dec]'), ad=e.target.closest('[data-add]');
  if(a||d){const i=+(a||d).dataset[a?'acc':'dec']; const p=S.requests.splice(i,1)[0]; if(a)S.friends.unshift([p[0],'New friend']); demoToast(a?`you and ${p[0]} are now friends (sample request, this page only)`:'request declined (sample request, this page only)'); $$('#reqs').forEach(r=>r.innerHTML=reqHTML()); }
  if(ad){ad.textContent='Requested'; ad.disabled=true; demoToast('no request was sent. In the real app they need to accept it.')}
}
document.addEventListener('click',reqClick);
bind.feed=()=>bindPosts($('#posts'));
