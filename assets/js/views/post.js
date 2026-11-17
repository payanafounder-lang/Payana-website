/* ---------- POST WITH COMMENTS (v1.4) ----------
   #post-<id>. Demo: comments you add stay on this page only. */
function post(id){
  const p=S.posts.find(x=>x.id===+id)||S.posts[0], cm=S.comments[p.id]||(S.comments[p.id]=[]);
  const one=(c,i,reply)=>`<div class="cm ${reply?'reply':''}">${av(c[0],i+(reply?3:0),reply?32:40)}<div><div class="cm-b"><b><a href="#u-${slug(c[0])}">${esc(c[0])}</a></b> ${esc(c[1])}</div>
    <div class="cm-a"><button data-cmlike>Like</button>${reply?'':`<button data-cmreply="${i}">Reply</button>`}<button data-cmrep="${esc(c[0])}">Report</button><small>${c[2]}</small></div></div></div>`;
  return `<a class="btn btn-line btn-sm" href="#feed" style="margin-bottom:14px">← Back to feed</a>
   <article class="card ps-grid">${p.img?`<img src="${src(p.img)}" alt="">`:`<div class="ps-noimg">${esc(p.type)}</div>`}
    <div class="ps-side"><div class="post-h" style="padding:0">${av(p.who,p.id)}<div><b><a href="#u-${slug(p.who)}">${esc(p.who)}</a>${p.v?'<span class="vf">✓</span>':''}</b><small>${esc(p.where)} · ${esc(p.time)}</small></div><button class="ibtn" aria-label="Report post" data-psrep style="margin-left:auto">${I('flag')}</button></div>
     <p>${esc(p.text)}</p>${p.trip&&T(p.trip)?`<a class="linked" href="#trip-${p.trip}" style="text-decoration:none">Going again · ${T(p.trip).name} <b style="color:var(--accent)">View trip →</b></a>`:''}
     <div class="acts" data-post="${p.id}" style="padding:4px 0"><button data-like class="${S.liked.has(p.id)?'on':''}">${I('heart')}<span>${p.likes+(S.liked.has(p.id)?1:0)}</span></button><button>${I('comment')}${cm.reduce((n,c)=>n+1+c[3].length,0)}</button><button data-share>${I('share')}Share</button><button data-save class="save ${S.saved.has(p.id)?'on':''}">${I('save')}${S.saved.has(p.id)?'Saved':'Save'}</button></div>
     <section class="cm-list" aria-label="Comments">${cm.length?cm.map((c,i)=>one(c,i)+c[3].map((r,j)=>one(r,j,true)).join('')).join(''):'<p class="hint">No comments yet. Start the conversation.</p>'}</section>
     <form class="send" id="cmf">${av(me().name,0,36)}<input id="cm-in" placeholder="${S.cmReplyTo!=null?'Reply to '+esc(cm[S.cmReplyTo][0].split(' ')[0])+'…':'Write a comment…'}" aria-label="Write a comment"><button class="btn btn-primary btn-sm">Post</button></form>
     <p class="hint" style="font-size:12.5px">Only friends can comment on this post. Be kind. Comments that break the Community Rules are removed.</p></div></article>`;
}
bind.post=id=>{const p=S.posts.find(x=>x.id===+id)||S.posts[0], cm=S.comments[p.id]; S.cmReplyTo=null;
  const v=$('#view');
  v.addEventListener('click',e=>{
    const r=e.target.closest('[data-cmreply]'); if(r){S.cmReplyTo=+r.dataset.cmreply; $('#cm-in').placeholder='Reply to '+cm[S.cmReplyTo][0].split(' ')[0]+'…'; $('#cm-in').focus(); return}
    const rp=e.target.closest('[data-cmrep]'); if(rp){openReport({what:'post',name:'a comment by '+rp.dataset.cmrep}); return}
    if(e.target.closest('[data-psrep]')){openReport({what:'post',name:'this post'}); return}
    const lk=e.target.closest('[data-cmlike]'); if(lk){lk.textContent=lk.textContent==='Like'?'Liked':'Like'; lk.classList.toggle('on'); return}
    if(e.target.closest('[data-like]')){S.liked.has(p.id)?S.liked.delete(p.id):S.liked.add(p.id); route(); return}
    if(e.target.closest('[data-save]')){S.saved.has(p.id)?S.saved.delete(p.id):S.saved.add(p.id); route(); demoToast(S.saved.has(p.id)?'saved on this page only':'removed from saved'); return}
    if(e.target.closest('[data-share]')) demoToast('sharing isn\'t connected yet.');
  });
  $('#cmf').addEventListener('submit',e=>{e.preventDefault(); const t=$('#cm-in').value.trim(); if(!t) return;
    if(S.cmReplyTo!=null) cm[S.cmReplyTo][3].push([me().name,t,'now']); else cm.push([me().name,t,'now',[]]);
    route(); demoToast('comment shown on this page only. Nobody else can see it.')});
};
