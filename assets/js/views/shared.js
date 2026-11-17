/* ---------- SHARED TRIP LINK FOR VISITORS (public, v1.4) ----------
   #t-<trip id>: what someone sees after opening a trip link from WhatsApp without an
   account. Shows enough to decide; full names, chat and meeting point stay private. */
function sharedTrip(id){
  const t=T(id)||TRIPS[0], host=t.people.find(p=>/Host/.test(p[1]))||t.people[0];
  return `<section class="cover sh-cover"><img src="${src(t.img)}" alt=""><div class="cover-in"><div class="sh-glass"><p>A Payana traveller shared this trip with you</p><h1>${esc(t.name)}</h1>
    <div class="facts"><div class="fact"><small>Dates</small><b>${t.dates}</b></div><div class="fact"><small>Budget</small><b>About ${rupee(t.budget)}</b></div><div class="fact"><small>Group</small><b>${t.seats} spots</b></div><div class="fact"><small>Pace</small><b>${t.pace}</b></div></div>
    <div class="btns"><button class="btn btn-primary" data-sh-join>Sign up free to request a spot</button><button class="btn btn-glass" data-sh-login>I have an account</button></div></div></div></section>
   <div class="tdgrid" style="margin-top:0"><section class="card sec"><h2>Rough plan</h2><div class="days">${t.plan.map(d=>`<div class="day"><small>${d[0]}</small><div><b>${d[1]}</b><ul>${d[2].map(x=>`<li>${esc(x)}</li>`).join('')}</ul></div></div>`).join('')}</div><p class="hint">Full plan, meeting point and group chat open after the host approves you.</p></section>
    <aside style="display:grid;gap:16px;align-content:start"><section class="card sec"><h2 style="font-size:18px">Who's going</h2><div class="faces">${t.people.map((p,i)=>`<span class="av" style="background:${COL[i%COL.length]}">${esc(p[0][0])}</span>`).join('')}</div>
      <p class="hint">Hosted by ${esc(host[0].split(' ')[0])}${t.hv?' (verified)':''}. Full names, profiles and reviews show after you sign up.</p></section>
     <section class="card sec" style="background:var(--surface-2)"><h2 style="font-size:18px">How joining works</h2><ol class="tips"><li>Sign up and verify your phone</li><li>Send a short request to the host</li><li>The host approves you</li><li>Plan and chat together</li></ol></section>
     <section class="wa-prev"><h2>How the link looks on WhatsApp</h2><div class="wa-card"><img src="${src(t.img)}" alt=""><div><b>${esc(t.name)} · Payana</b><small>${t.dates} · ${rupee(t.budget)} · ${t.seats} spots</small><small>withpayana.com</small></div></div></section></aside></div>`;
}
bind.sharedTrip=id=>{const t=T(id)||TRIPS[0];
  $('#pview').addEventListener('click',e=>{
    if(e.target.closest('[data-sh-join]')){pending='trip-'+t.id; if(authed()) location.hash=pending; else openM('signup')}
    if(e.target.closest('[data-sh-login]')){pending='trip-'+t.id; if(authed()) location.hash=pending; else openM('login')}
  });
};
