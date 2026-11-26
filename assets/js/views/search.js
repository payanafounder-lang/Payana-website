/* ---------- SEARCH PEOPLE, TRIPS AND COMMUNITIES (v1.5) ----------
   #search. Demo: searches the sample data in this page. Live: server-side search that
   respects privacy settings (people who allow only friends of friends, blocked users). */
// Wraps the first match of q in <mark> so people can see why a result came up.
function srHL(text,q){const t=String(text), i=q?t.toLowerCase().indexOf(q):-1; if(i<0) return esc(t);
  return esc(t.slice(0,i))+'<mark>'+esc(t.slice(i,i+q.length))+'</mark>'+esc(t.slice(i+q.length))}
function allPeople(){const m=new Map(); [...S.friends.map(p=>[p[0],p[1],'friend']),...S.suggest.map(p=>[p[0],p[1],'']),...S.requests.map(p=>[p[0],p[1],'']),...Object.values(S.people).map(p=>[p.name,p.area,''])].forEach(p=>{if(!m.has(p[0])) m.set(p[0],p)}); return [...m.values()]}
function search(){
  return `<div class="ph"><div><h1>Search</h1><p>Find people, trips and communities</p></div></div>
   <label class="hp-search sr-box">${I('search')}<span class="sr-only">Search Payana</span><input id="sq" type="search" enterkeyhint="search" aria-controls="sres" value="${esc(S.sq||'')}" placeholder="People, trips or communities" autocomplete="off"></label>
   <div class="radios" role="group" aria-label="Result type" style="margin:16px 0" id="stabs"></div><div id="sres" aria-live="polite"></div>`;
}
// auto=true when the search words change: if the open tab has no matches but another tab does,
// jump to the first tab with results (e.g. "Coorg" opens Trips instead of "No people for Coorg").
function searchDraw(auto){
  const q=(S.sq||'').trim().toLowerCase(), blocked=(S.blocked||[]).map(b=>b[0]);
  const P=q?allPeople().filter(p=>!blocked.includes(p[0])&&(p[0].toLowerCase().includes(q)||slug(p[0]).includes(q.replace(/^@/,'')))):[];
  const Tr=q?TRIPS.filter(t=>(t.name+' '+t.interests.join(' ')).toLowerCase().includes(q)):[];
  const C=q?S.comms.map((c,i)=>[c,i]).filter(([c])=>c[0].toLowerCase().includes(q)):[];
  const cnt={people:P.length,trips:Tr.length,comms:C.length};
  if(auto&&q&&!cnt[S.sTab||'people']){const k=['people','trips','comms'].find(k=>cnt[k]); if(k) S.sTab=k}
  const tab=S.sTab||'people';
  $('#stabs').innerHTML=[['people','People',P.length],['trips','Trips',Tr.length],['comms','Communities',C.length]].map(([k,l,n])=>`<button class="chip" data-stab2="${k}" aria-pressed="${tab===k}">${l}${q?' · '+n:''}</button>`).join('');
  if(!q){$('#sres').innerHTML=`<h2 class="nt-h">Recent searches</h2><div class="radios">${(S.recentQ||['Coorg','Weekend Trekkers','rohit']).map(r=>`<button class="chip" data-recent="${esc(r)}">${esc(r)}</button>`).join('')}</div>`; return}
  const none=w=>emptyState('search',`No ${w} for "${esc(S.sq)}"`,'Check the spelling, or try a place or interest instead.','');
  if(tab==='people') $('#sres').innerHTML=P.length?`<div class="card sec">${P.map((p,i)=>{const fr=p[2]==='friend', rq=(S.friendReq||[]).includes(p[0]); return `<div class="person">${av(p[0],i)}<div><b><a href="#u-${slug(p[0])}">${srHL(p[0],q)}</a></b><small>@${slug(p[0]).replace(/-/g,'.')} · ${esc(p[1])}</small></div>${fr?'<a class="btn btn-soft btn-sm" href="#messages">Message</a>':`<button class="btn ${rq?'btn-line':'btn-primary'} btn-sm" data-sadd="${esc(p[0])}">${rq?'Cancel request':'Add friend'}</button>`}</div>`}).join('')}<p class="hint">People who allow only friends of friends to find them show here only if you share a friend. Blocked people never show.</p></div>`:none('people');
  if(tab==='trips') $('#sres').innerHTML=Tr.length?`<div class="tgrid">${Tr.map(t=>tripCard(t,true)).join('')}</div>`:none('trips');
  if(tab==='comms') $('#sres').innerHTML=C.length?`<div class="card sec">${C.map(([c,i])=>`<a class="comm" href="#community-${i}" style="text-decoration:none"><img src="${src(c[1])}" alt=""><div><b>${srHL(c[0],q)}</b><small>${c[2]}</small></div></a>`).join('')}</div>`:none('communities');
}
bind.search=()=>{searchDraw(); const inp=$('#sq'); inp.focus();
  let tmr; inp.addEventListener('input',()=>{S.sq=inp.value; clearTimeout(tmr); tmr=setTimeout(()=>{searchDraw(true); const q=inp.value.trim(); if(q.length>2){S.recentQ=[q,...(S.recentQ||[]).filter(x=>x!==q)].slice(0,5)}},150)});
  $('#view').addEventListener('click',e=>{
    const t=e.target.closest('[data-stab2]'); if(t){S.sTab=t.dataset.stab2; searchDraw(); return}
    const r=e.target.closest('[data-recent]'); if(r){S.sq=r.dataset.recent; inp.value=S.sq; searchDraw(true); return}
    const a=e.target.closest('[data-sadd]'); if(a){S.friendReq=S.friendReq||[]; const n=a.dataset.sadd, i=S.friendReq.indexOf(n); i<0?S.friendReq.push(n):S.friendReq.splice(i,1); searchDraw(); demoToast(i<0?'no request was sent. In the real app they need to accept it.':'request cancelled')}
  });
};

// Keyboard shortcut: "/" or Ctrl/Cmd+K opens search from any app screen (shown as the "/" hint in the sidebar).
addEventListener('keydown',e=>{
  if($('#app').hidden||!$('#modal').hidden||(typeof MODALS!=='undefined'&&MODALS.length)) return;
  const t=e.target, typing=t&&(/^(input|textarea|select)$/i.test(t.tagName)||t.isContentEditable);
  const cmdK=(e.metaKey||e.ctrlKey)&&!e.altKey&&e.key.toLowerCase()==='k', slash=e.key==='/'&&!typing&&!e.metaKey&&!e.ctrlKey&&!e.altKey;
  if(!cmdK&&!slash) return;
  e.preventDefault(); if(location.hash==='#search') $('#sq')&&$('#sq').focus(); else location.hash='search';
});
