/* ---------- SEARCH PEOPLE, TRIPS AND COMMUNITIES (v1.5) ----------
   #search. Demo: searches the sample data in this page. Live: server-side search that
   respects privacy settings (people who allow only friends of friends, blocked users). */
function allPeople(){const m=new Map(); [...S.friends.map(p=>[p[0],p[1],'friend']),...S.suggest.map(p=>[p[0],p[1],'']),...S.requests.map(p=>[p[0],p[1],'']),...Object.values(S.people).map(p=>[p.name,p.area,''])].forEach(p=>{if(!m.has(p[0])) m.set(p[0],p)}); return [...m.values()]}
function search(){
  return `<div class="ph"><div><h1>Search</h1><p>Find people, trips and communities</p></div></div>
   <label class="hp-search sr-box">${I('search')}<span class="sr-only">Search Payana</span><input id="sq" type="search" value="${esc(S.sq||'')}" placeholder="Name, @username, place or community" autocomplete="off"></label>
   <div class="radios" role="group" aria-label="Result type" style="margin:16px 0" id="stabs"></div><div id="sres"></div>`;
}
function searchDraw(){
  const q=(S.sq||'').trim().toLowerCase(), tab=S.sTab||'people', blocked=(S.blocked||[]).map(b=>b[0]);
  const P=q?allPeople().filter(p=>!blocked.includes(p[0])&&(p[0].toLowerCase().includes(q)||slug(p[0]).includes(q.replace(/^@/,'')))):[];
  const Tr=q?TRIPS.filter(t=>(t.name+' '+t.interests.join(' ')).toLowerCase().includes(q)):[];
  const C=q?S.comms.map((c,i)=>[c,i]).filter(([c])=>c[0].toLowerCase().includes(q)):[];
  $('#stabs').innerHTML=[['people','People',P.length],['trips','Trips',Tr.length],['comms','Communities',C.length]].map(([k,l,n])=>`<button class="chip" data-stab2="${k}" aria-pressed="${tab===k}">${l}${q?' · '+n:''}</button>`).join('');
  if(!q){$('#sres').innerHTML=`<h2 class="nt-h">Recent searches</h2><div class="radios">${(S.recentQ||['Coorg','Weekend Trekkers','rohit']).map(r=>`<button class="chip" data-recent="${esc(r)}">${esc(r)}</button>`).join('')}</div>`; return}
  const none=w=>emptyState('search',`No ${w} for "${esc(S.sq)}"`,'Check the spelling, or try a place or interest instead.','');
  if(tab==='people') $('#sres').innerHTML=P.length?`<div class="card sec">${P.map((p,i)=>{const fr=p[2]==='friend', rq=(S.friendReq||[]).includes(p[0]); return `<div class="person">${av(p[0],i)}<div><b><a href="#u-${slug(p[0])}">${esc(p[0])}</a></b><small>@${slug(p[0]).replace(/-/g,'.')} · ${esc(p[1])}</small></div>${fr?'<a class="btn btn-soft btn-sm" href="#messages">Message</a>':`<button class="btn ${rq?'btn-line':'btn-primary'} btn-sm" data-sadd="${esc(p[0])}">${rq?'Cancel request':'Add friend'}</button>`}</div>`}).join('')}<p class="hint">People who allow only friends of friends to find them show here only if you share a friend. Blocked people never show.</p></div>`:none('people');
  if(tab==='trips') $('#sres').innerHTML=Tr.length?`<div class="tgrid">${Tr.map(t=>tripCard(t,true)).join('')}</div>`:none('trips');
  if(tab==='comms') $('#sres').innerHTML=C.length?`<div class="card sec">${C.map(([c,i])=>`<a class="comm" href="#community-${i}" style="text-decoration:none"><img src="${src(c[1])}" alt=""><div><b>${esc(c[0])}</b><small>${c[2]}</small></div></a>`).join('')}</div>`:none('communities');
}
bind.search=()=>{searchDraw(); const inp=$('#sq'); inp.focus();
  let tmr; inp.addEventListener('input',()=>{S.sq=inp.value; clearTimeout(tmr); tmr=setTimeout(()=>{searchDraw(); const q=inp.value.trim(); if(q.length>2){S.recentQ=[q,...(S.recentQ||[]).filter(x=>x!==q)].slice(0,5)}},150)});
  $('#view').addEventListener('click',e=>{
    const t=e.target.closest('[data-stab2]'); if(t){S.sTab=t.dataset.stab2; searchDraw(); return}
    const r=e.target.closest('[data-recent]'); if(r){S.sq=r.dataset.recent; inp.value=S.sq; searchDraw(); return}
    const a=e.target.closest('[data-sadd]'); if(a){S.friendReq=S.friendReq||[]; const n=a.dataset.sadd, i=S.friendReq.indexOf(n); i<0?S.friendReq.push(n):S.friendReq.splice(i,1); searchDraw(); demoToast(i<0?'no request was sent. In the real app they need to accept it.':'request cancelled')}
  });
};
