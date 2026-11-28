/* ---------- MENTIONS & TAGS (28 Nov) ----------
   Team change: anyone on Payana can mention or tag anyone else, not only friends.
   - Posts: "Tag people" field (search everyone, chips) + type @ in a caption for suggestions.
   - Stories: the @mention sticker lists everyone, with a search box.
   Mentions and tags link to that person's profile (#u-<slug>); your own goes to #profile.
   Blocked people are left out of suggestions. Demo: nobody is notified. */
const handle=n=>slug(n).replace(/-/g,'.');
function everyone(){const m=new Map(), meN=me().name, blocked=(S.blocked||[]).map(b=>b[0]),
  add=(n,sub)=>{if(n&&n!==meN&&!blocked.includes(n)&&!m.has(n)) m.set(n,{name:n,h:handle(n),sub:sub||'On Payana'})};
  S.friends.forEach(p=>add(p[0],`Friend · ${p[1]}`));
  allPeople().forEach(p=>add(p[0],p[1]));
  TRIPS.forEach(t=>t.people.forEach(p=>add(p[0],`${p[1]} · ${t.name} trip`)));
  S.posts.forEach(p=>add(p.who,p.where));
  return [...m.values()].sort((a,b)=>a.name.localeCompare(b.name))}
function findPeople(q,skip=[]){q=String(q||'').toLowerCase().trim().replace(/^@/,'');
  return everyone().filter(p=>!skip.includes(p.name)&&(!q||p.name.toLowerCase().includes(q)||p.h.includes(q))).slice(0,8)}
const mentionHref=n=>n===me().name?'#profile':`#u-${slug(n)}`;
// Caption text with @handles turned into profile links (only handles that match a real person).
function mentionText(t){const P=everyone(), meN=me().name;
  return esc(t||'').replace(/(^|[^\w.@])@([a-z0-9](?:[a-z0-9.]*[a-z0-9])?)/gi,(all,pre,h)=>{const l=h.toLowerCase(), p=P.find(x=>x.h===l)||(handle(meN)===l?{name:meN}:null);
    return p?`${pre}<a class="mtag" href="${mentionHref(p.name)}">@${esc(h)}</a>`:all})}
function tagsHTML(p){return p.tags&&p.tags.length?`<p class="ptags">${I('users','style="width:15px;height:15px;vertical-align:-3px"')} with ${p.tags.map(n=>`<a class="mtag" href="${mentionHref(n)}">${esc(n)}</a>`).join(', ')}</p>`:''}
const macRow=(p,i,sel)=>`<button type="button" role="option" aria-selected="${i===sel}" data-mpick="${esc(p.name)}">${av(p.name,p.name.length)}<span><b>${esc(p.name)}</b><small>@${esc(p.h)} · ${esc(p.sub)}</small></span></button>`;
// Story sticker list (dark sheet)
const menList=q=>{const L=findPeople(q); return L.length?L.map(p=>`<button type="button" data-pick="${esc(p.name)}">${av(p.name,p.name.length)}<span><b>${esc(p.name)}</b><small>@${esc(p.h)} · ${esc(p.sub)}</small></span></button>`).join(''):'<p class="se-sh-n">No one on Payana matches that name.</p>'};
/* Type @ in a caption to get suggestions from everyone on Payana */
function mentionAC(el){if(!el||el.dataset.mac) return; el.dataset.mac=1;
  const box=document.createElement('div'); box.className='mac'; box.hidden=true; box.setAttribute('role','listbox'); box.setAttribute('aria-label','People to mention');
  (el.closest('label')||el).after(box);
  let L=[], idx=0;
  const find=()=>{const v=el.value.slice(0,el.selectionStart), m=/(^|\s)@([a-z0-9.]*)$/i.exec(v); return m?{q:m[2],at:v.length-m[2].length-1}:null};
  const draw=()=>{const c=find(); L=c?findPeople(c.q):[]; if(!L.length){box.hidden=true; return} idx=Math.min(idx,L.length-1);
    box.innerHTML=L.map((p,i)=>macRow(p,i,idx)).join('')+'<p>Anyone on Payana can be mentioned</p>'; box.hidden=false};
  const pick=n=>{const c=find(); if(!c) return; const ins='@'+handle(n)+' ', a=el.value.slice(0,c.at), b=el.value.slice(el.selectionStart);
    el.value=a+ins+b; const pos=(a+ins).length; el.focus(); el.setSelectionRange(pos,pos); box.hidden=true};
  el.addEventListener('input',()=>{idx=0; draw()});
  el.addEventListener('click',draw);
  el.addEventListener('keydown',e=>{if(box.hidden) return;
    if(e.key==='ArrowDown'||e.key==='ArrowUp'){e.preventDefault(); idx=(idx+(e.key==='ArrowDown'?1:-1)+L.length)%L.length; draw()}
    else if(e.key==='Enter'||e.key==='Tab'){e.preventDefault(); pick(L[idx].name)}
    else if(e.key==='Escape'){e.preventDefault(); e.stopPropagation(); box.hidden=true}});
  el.addEventListener('blur',()=>setTimeout(()=>{box.hidden=true},150));
  box.addEventListener('mousedown',e=>e.preventDefault());
  box.addEventListener('click',e=>{const b=e.target.closest('[data-mpick]'); if(b) pick(b.dataset.mpick)})}
/* "Tag people" field on a post: chips + search over everyone on Payana */
function tagPicker(wrap,list,tags){if(!wrap) return; const inp=wrap.querySelector('input'); let L=[], idx=0;
  const chips=()=>{wrap.querySelectorAll('.tchip').forEach(c=>c.remove());
    tags.forEach((n,i)=>inp.insertAdjacentHTML('beforebegin',`<span class="tchip">${esc(n)}<button type="button" data-tx="${i}" aria-label="Remove ${esc(n)}">×</button></span>`));
    inp.placeholder=tags.length?'Tag someone else':'Search anyone on Payana'};
  const draw=()=>{const q=inp.value; L=q.trim()?findPeople(q,tags):[];
    if(!L.length){if(q.trim()){list.innerHTML='<p>No one on Payana matches that name</p>'; list.hidden=false} else list.hidden=true; return}
    idx=Math.min(idx,L.length-1); list.innerHTML=L.map((p,i)=>macRow(p,i,idx)).join(''); list.hidden=false};
  const add=n=>{if(tags.length>=20){toast('You can tag up to 20 people'); return} if(!tags.includes(n)) tags.push(n); inp.value=''; list.hidden=true; chips(); inp.focus()};
  inp.addEventListener('input',()=>{idx=0; draw()});
  inp.addEventListener('keydown',e=>{
    if(e.key==='Backspace'&&!inp.value&&tags.length){tags.pop(); chips(); return}
    if(list.hidden||!L.length){if(e.key==='Enter') e.preventDefault(); return}
    if(e.key==='ArrowDown'||e.key==='ArrowUp'){e.preventDefault(); idx=(idx+(e.key==='ArrowDown'?1:-1)+L.length)%L.length; draw()}
    else if(e.key==='Enter'){e.preventDefault(); add(L[idx].name)}
    else if(e.key==='Escape'){e.preventDefault(); e.stopPropagation(); list.hidden=true}});
  inp.addEventListener('blur',()=>setTimeout(()=>{list.hidden=true},150));
  list.addEventListener('mousedown',e=>e.preventDefault());
  list.addEventListener('click',e=>{const b=e.target.closest('[data-mpick]'); if(b) add(b.dataset.mpick)});
  wrap.addEventListener('click',e=>{const x=e.target.closest('[data-tx]'); if(x){tags.splice(+x.dataset.tx,1); chips(); inp.focus(); return} if(e.target===wrap) inp.focus()});
  chips()}
