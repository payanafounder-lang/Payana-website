/* ---------- MY TRIPS ---------- */
function mytrips(){
  const mine=Object.entries(S.joined);
  const list=mine.length?mine.filter(([id])=>T(id)).map(([id,st])=>{const t=T(id); return `<a class="upbanner card" href="${st==='approved'?'#plan':'#trip-'+id}" data-plan="${st==='approved'?id:''}"><img src="${src(t.img)}" alt=""><div><b style="font-size:18px">${t.name}</b><br><small style="color:var(--muted)">${t.dates} · ${rupee(t.budget)} / person</small></div><span class="pill ${st==='approved'||st==='hosting'?'p-ok':'p-warn'}">${st==='hosting'?'Hosting · '+(HOSTREQ[id]||[]).length+((HOSTREQ[id]||[]).length===1?' request':' requests'):st==='approved'?'Going · open planner':'Waiting for approval'}</span></a>`}).join(''):'';
  return `<div class="ph"><div><h1>My trips</h1><p>Trips you're hosting, going on or waiting to join</p></div><div style="display:flex;gap:8px;flex-wrap:wrap"><a class="btn btn-line" href="#explore">${I('compass')}Find a trip</a><a class="btn btn-primary" href="#newtrip">${I('plus')}Create a trip</a></div></div>
   <div style="display:grid;gap:12px">${list}
   <a class="upbanner card" href="#plan" data-plan="coorg"><img src="${src(T('coorg').img)}" alt=""><div><b style="font-size:18px">Coorg (demo planner)</b><br><small style="color:var(--muted)">Sat 7 – Sun 8 Nov · 4 going</small></div><span class="pill p-ok">Open planner</span></a>
   <div class="card sec"><h2 style="font-size:18px">Past trips</h2><div class="pgridimg">${S.pastTrips.map(n=>`<img src="${src(n)}" alt="">`).join('')}</div></div></div>`;
}
bind.mytrips=()=>$('#view').addEventListener('click',e=>{const a=e.target.closest('[data-plan]'); if(a&&a.dataset.plan){S.planTrip=a.dataset.plan; store.set('planTrip',S.planTrip)}});
