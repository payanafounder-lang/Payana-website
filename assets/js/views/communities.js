/* ---------- COMMUNITIES ---------- */
function communities(){
  return `<div class="ph"><div><h1>Communities</h1><p>Groups built around how you like to travel</p></div></div><div class="cgrid3">${S.comms.map((c,i)=>`<article class="card ccard"><img src="${src(c[1])}" alt=""><div class="box"><b style="font:800 19px var(--f-display)">${c[0]}</b><small style="color:var(--muted)">${c[2]}</small><button class="btn ${c[3]?'btn-line':'btn-primary'} btn-sm" data-comm="${i}" style="justify-self:start">${c[3]?'Joined':'Join'}</button></div></article>`).join('')}</div>`;
}
bind.communities=()=>$('#view').addEventListener('click',e=>{const b=e.target.closest('[data-comm]'); if(!b) return; const c=S.comms[+b.dataset.comm]; c[3]=!c[3]; demoToast(c[3]?`joined ${c[0]} on this page only`:`left ${c[0]}`); route()});
