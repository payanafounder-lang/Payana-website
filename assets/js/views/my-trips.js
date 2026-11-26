/* ---------- MY TRIPS ----------
   Team change (26 Nov): once a trip is planned (you're going or hosting), every person gets a
   Leave button here, beside Share. It opens #manage-<trip>-leave: members give a reason and leave;
   a host has to hand hosting to someone else first (or cancel the trip). Trips you left are listed
   below. Demo: nobody is told, and the Coorg demo trip can be brought back with Undo. */
function mytrips(){
  const mine=Object.entries(S.joined);
  const shb=id=>`<button type="button" class="upshare" data-tshare="${id}" aria-label="Share the ${esc(T(id).name)} trip">${I('share')}<span>Share</span></button>`;
  const lvb=id=>`<a class="upshare upleave" href="#manage-${id}-leave" aria-label="Leave the ${esc(T(id).name)} trip group">${I('out')}<span>Leave</span></a>`;
  const list=mine.length?mine.filter(([id])=>T(id)).map(([id,st])=>{const t=T(id); return `<div class="upw"><a class="upbanner card" href="${st==='approved'?'#plan':'#trip-'+id}" data-plan="${st==='approved'?id:''}"><img src="${src(t.img)}" alt=""><div><b style="font-size:18px">${t.name}</b><br><small style="color:var(--muted)">${t.dates} · ${rupee(t.budget)} / person</small></div><span class="pill ${st==='approved'||st==='hosting'?'p-ok':st==='cancelled'?'p-bad':'p-warn'}">${st==='cancelled'?'Cancelled':st==='hosting'?'Hosting · '+(HOSTREQ[id]||[]).length+((HOSTREQ[id]||[]).length===1?' request':' requests'):st==='approved'?'Going · open planner':'Waiting for approval'}</span></a><div class="upacts">${shb(id)}${st==='approved'||st==='hosting'?lvb(id):''}</div></div>`}).join(''):'';
  const left=S.left.filter(id=>T(id)&&!S.joined[id]);
  return `<div class="ph"><div><h1>My trips</h1><p>Trips you're hosting, going on or waiting to join</p></div><div style="display:flex;gap:8px;flex-wrap:wrap"><a class="btn btn-line" href="#explore">${I('compass')}Find a trip</a><a class="btn btn-primary" href="#newtrip">${I('plus')}Create a trip</a></div></div>
   <div style="display:grid;gap:12px">${list}
   ${S.left.includes('coorg')?'':`<div class="upw"><a class="upbanner card" href="#plan" data-plan="coorg"><img src="${src(T('coorg').img)}" alt=""><div><b style="font-size:18px">Coorg (demo planner)</b><br><small style="color:var(--muted)">Sat 7 – Sun 8 Nov · 4 going</small></div><span class="pill p-ok">Open planner</span></a><div class="upacts">${shb('coorg')}${lvb('coorg')}</div></div>
   <a class="linkbtn" href="#manage-coorg" style="font-size:14px;justify-self:start">Demo: manage the Coorg trip as its host →</a>`}
   ${left.length?`<section class="card sec"><h2 style="font-size:18px">Trips you left</h2><div class="leftlist">${left.map(id=>{const t=T(id); return `<div class="person"><img class="lthumb" src="${src(t.img)}" alt=""><div><b>${esc(t.name)}</b><small>${t.dates} · You left this group</small></div><div class="btns"><a class="btn btn-line btn-sm" href="#trip-${id}">View trip</a>${id==='coorg'?'<button type="button" class="btn btn-soft btn-sm" data-rejoin="coorg">Undo (demo)</button>':''}</div></div>`}).join('')}</div></section>`:''}
   ${S.reviewed&&S.reviewed.chikkamagaluru?'':`<a class="upbanner card rv-banner" href="#review-chikkamagaluru"><img src="${src(T('chikkamagaluru').img)}" alt=""><div><span class="eyebrow">Back from a trip?</span><br><b style="font-size:18px">Review Chikkamagaluru</b><br><small style="color:var(--muted)">Rate the trip and your travel mates</small></div><span class="btn btn-primary btn-sm">Write review</span></a>`}
   <div class="card sec"><h2 style="font-size:18px">Past trips</h2><div class="pgridimg">${S.pastTrips.map(n=>`<img src="${src(n)}" alt="">`).join('')}</div></div></div>`;
}
bind.mytrips=()=>$('#view').addEventListener('click',e=>{
  const r=e.target.closest('[data-rejoin]'); if(r){S.left=S.left.filter(x=>x!==r.dataset.rejoin); store.set('left',S.left); route(); demoToast('you\'re back in the Coorg group'); return}
  const a=e.target.closest('[data-plan]'); if(a&&a.dataset.plan){S.planTrip=a.dataset.plan; store.set('planTrip',S.planTrip)}});
