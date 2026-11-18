/* ---------- POST WITH COMMENTS (v1.4) ----------
   #post-<id>. Demo: comments you add stay on this page only.
   Team change (18 Nov): photos in profile grids (yours, someone else's, Tagged) open the
   full post here. Grid photos get a post record the first time they're shown. */
const GRID_CAP={6046:['Jeep ride up to the estate. Worth the bumpy road for that view.','Coorg'],6047:['Mysuru Palace early on a Sunday, before the crowds.','Mysuru'],
  6074:['Wildflowers all along the lake trail. Slow walk, no rush.','Ooty'],6058:['First dive. Nervous for ten minutes, then never wanted to come up.','Netrani Island'],
  6064:['Rope bridges in the canopy. The group cheered me across the last one.','Coorg'],6071:['A night on a houseboat in the backwaters.','Alappuzha'],
  6056:['Dandeli rafting. Everyone fell in at least once.','Dandeli'],6045:['Nilgiri toy train. Left-side window seat going up.','Ooty'],
  6073:['Blue train over the arched bridge. Timed it perfectly.','Nilgiris'],6054:['Three of us, one summit, one very windy selfie.','Kudremukh'],
  6062:['Snow day with the group.','Manali'],6084:['Campfire by the lake, last night of the trip.','Chikkamagaluru']};
function gridPost(img,who){S.gridPosts=S.gridPosts||[];
  let p=[...S.posts,...S.gridPosts].find(x=>x.img===img&&x.who===who);
  if(!p){const c=GRID_CAP[img]||['','Bengaluru']; p={id:typeof img==='number'?`g${img}-${slug(who)}`:'g'+Date.now()+S.gridPosts.length,who,v:true,where:c[1],time:'Earlier',type:'Photo',img,text:c[0],likes:12+(((+img)||7)%57),com:0}; S.gridPosts.push(p)}
  return p;
}
// A grid of photos that each open their post. who: a name, or (i)=>name for mixed grids like Tagged.
function postGrid(imgs,who){return `<div class="pgridimg">${imgs.map((n,i)=>{const p=gridPost(n,typeof who==='function'?who(i):who); return `<a href="#post-${p.id}" aria-label="Open post${p.text?': '+esc(p.text.slice(0,50)):''}"><img src="${src(n)}" alt=""></a>`}).join('')}</div>`}
// Grid post ids look like g6046-asha-rao, so a link still works after a reload.
function findPost(id){const all=[...S.posts,...(S.gridPosts||[])], hit=all.find(x=>String(x.id)===String(id)); if(hit) return hit;
  const m=/^g(\d+)-(.+)$/.exec(id||''); if(m){const sl=m[2], names=[me().name,...S.friends.map(f=>f[0]),...Object.values(S.people||{}).map(p=>p.name)];
    const who=names.find(n=>slug(n)===sl)||(typeof personData==='function'?personData(sl).name:sl); return gridPost(+m[1],who)}
  return S.posts[0]}
function post(id){
  if(S.cmPost!==id){S.cmReplyTo=null; S.cmPost=id}
  const p=findPost(id), cm=S.comments[p.id]||(S.comments[p.id]=[]);
  const one=(c,i,reply)=>`<div class="cm ${reply?'reply':''}">${av(c[0],i+(reply?3:0),reply?32:40)}<div><div class="cm-b"><b><a href="#u-${slug(c[0])}">${esc(c[0])}</a></b> ${esc(c[1])}</div>
    <div class="cm-a"><button data-cmlike>Like</button>${reply?'':`<button data-cmreply="${i}">Reply</button>`}<button data-cmrep="${esc(c[0])}">Report</button><small>${c[2]}</small></div></div></div>`;
  return `<button class="btn btn-line btn-sm" data-psback style="margin-bottom:14px">← Back</button>
   <article class="card ps-grid">${p.img?`<img src="${src(p.img)}" alt="">`:`<div class="ps-noimg">${esc(p.type)}</div>`}
    <div class="ps-side"><div class="post-h" style="padding:0">${av(p.who,p.id)}<div><b><a href="#u-${slug(p.who)}">${esc(p.who)}</a>${p.v?'<span class="vf">✓</span>':''}</b><small>${esc(p.where)} · ${esc(p.time)}</small></div><button class="ibtn" aria-label="Report post" data-psrep style="margin-left:auto">${I('flag')}</button></div>
     <p>${esc(p.text)}</p>${p.trip&&T(p.trip)?`<a class="linked" href="#trip-${p.trip}" style="text-decoration:none">Going again · ${T(p.trip).name} <b style="color:var(--accent)">View trip →</b></a>`:''}
     <div class="acts" data-post="${p.id}" style="padding:4px 0"><button data-like class="${S.liked.has(p.id)?'on':''}">${I('heart')}<span>${p.likes+(S.liked.has(p.id)?1:0)}</span></button><button>${I('comment')}${cm.reduce((n,c)=>n+1+c[3].length,0)}</button><button data-share>${I('share')}Share</button><button data-save class="save ${S.saved.has(p.id)?'on':''}">${I('save')}${S.saved.has(p.id)?'Saved':'Save'}</button></div>
     <section class="cm-list" aria-label="Comments">${cm.length?cm.map((c,i)=>one(c,i)+c[3].map((r,j)=>one(r,j,true)).join('')).join(''):'<p class="hint">No comments yet. Start the conversation.</p>'}</section>
     <form class="send" id="cmf">${av(me().name,0,36)}<input id="cm-in" placeholder="${S.cmReplyTo!=null&&cm[S.cmReplyTo]?'Reply to '+esc(cm[S.cmReplyTo][0].split(' ')[0])+'…':'Write a comment…'}" aria-label="Write a comment"><button class="btn btn-primary btn-sm">Post</button></form>
     <p class="hint" style="font-size:12.5px">Only friends can comment on this post. Be kind. Comments that break the Community Rules are removed.</p></div></article>`;
}
bind.post=id=>{const p=findPost(id), cm=S.comments[p.id]; S.cmReplyTo=null;
  const v=$('#view');
  v.addEventListener('click',e=>{
    if(e.target.closest('[data-psback]')){history.length>1?history.back():(location.hash='feed'); return}
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
    S.cmReplyTo=null; route(); demoToast('comment shown on this page only. Nobody else can see it.')});
};
