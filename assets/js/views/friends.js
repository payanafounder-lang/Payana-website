/* ---------- FRIENDS ---------- */
function friends(){
  return `<div class="ph"><div><h1>Friends</h1><p>Friends only, no followers. Both people have to agree.</p></div></div>
   <div class="pgrid"><div class="card sec"><h2 style="font-size:18px">Your friends · ${S.friends.length}</h2>${S.friends.map((p,i)=>`<div class="person">${av(p[0],i)}<div><b>${p[0]}</b><small>${p[1]}</small></div><div class="btns"><a class="btn btn-line btn-sm" href="#messages">Message</a></div></div>`).join('')}</div>
   <div style="display:grid;gap:18px"><div class="card box"><h3>Requests</h3><div id="reqs">${reqHTML()}</div></div>
   <div class="card box"><h3>People you may know</h3>${S.suggest.map((p,i)=>`<div class="person">${av(p[0],i+2)}<div><b>${p[0]}</b><small>${p[1]}</small></div><button class="btn btn-soft btn-sm" data-add="${i}">Add friend</button></div>`).join('')}</div></div></div>`;
}
