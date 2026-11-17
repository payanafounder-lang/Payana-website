/* ---------- TRIP DAY (v1.6) ----------
   #tripday-<trip>: one phone-first screen for the day itself. Meeting point, who has
   reached, "I've reached", share with family, call 112, and today's timeline.
   Demo: statuses change on this page only; nothing is sent. Live location is NOT used. */
const TD={};
function tripday(id){
  const t=T(id)||T('coorg'); if(!TD[t.id]) TD[t.id]={me:false,people:t.people.map((p,i)=>[p[0],/Host/.test(p[1]),i<2?'reached':i===2?'way':'not'])};
  const d=TD[t.id], host=(t.people.find(p=>/Host/.test(p[1]))||t.people[0])[0], reached=d.people.filter(p=>p[2]==='reached').length+(d.me?1:0);
  const ST={reached:['p-ok','Reached'],way:['p-warn','On the way'],not:['p-mut','Not yet']};
  const plan=S.plan.filter(p=>p[0]==='Sat');
  return `<div class="td"><header class="td-h"><a class="ibtn" href="#plan" aria-label="Back to the plan" style="color:inherit">←</a><div><span class="eyebrow" style="color:var(--sun)">Trip day · ${t.dates.split('–')[0].trim()}</span><h1>${esc(t.name)}</h1></div></header>
   <section class="card sec"><span class="eyebrow">Next · meeting point</span><h2 style="font-size:20px">${esc(plan[0]?plan[0][2]:'Meeting point')}, ${plan[0]?plan[0][1]:'6:00'}</h2><p class="hint">Gate 2, near the parking. The host's car details are in the group chat.</p>
    <div class="row2"><button class="btn btn-soft" data-td="dir">${I('pin')}Directions</button><button class="btn btn-soft" data-td="call">${I('phone')}Call ${esc(host.split(' ')[0])}</button></div></section>
   <section class="card sec"><div style="display:flex;align-items:center"><h2 style="font-size:18px">Who's here</h2><span class="hint" style="margin-left:auto">${reached} of ${d.people.length+1}</span></div>
    ${d.people.map((p,i)=>`<div class="person">${av(p[0],i)}<div><b>${esc(p[0])}</b><small>${p[1]?'Host':'&nbsp;'}</small></div><span class="pill ${ST[p[2]][0]}">${ST[p[2]][1]}</span></div>`).join('')}
    <div class="person">${av(me().name,7)}<div><b>You</b><small>&nbsp;</small></div><span class="pill ${d.me?'p-ok':'p-mut'}">${d.me?'Reached':'Not yet'}</span></div></section>
   <section class="card sec td-safe"><div class="row2"><button class="btn ${d.me?'btn-soft':'forest-btn'} td-big" data-td="reached">${d.me?'✓ You\'ve reached':'I\'ve reached'}<small>Tell the group</small></button><button class="btn btn-soft td-big" data-td="share">Share with family<small>Itinerary + group</small></button></div>
    <a class="btn danger-btn td-112" href="tel:112">${I('phone')}Emergency · call 112</a><p class="hint" style="text-align:center">Feeling unsafe but not an emergency? <button class="linkbtn" data-td="help">Get help from Payana</button></p></section>
   <section class="card sec"><h2 style="font-size:16px">Today</h2><ol class="td-tl">${plan.map(p=>`<li><time>${p[1]}</time><span>${esc(p[2])}</span><span class="pill ${STC[p[4]]}">${p[4]}</span></li>`).join('')}</ol></section>
   <p class="hint" style="text-align:center">Payana doesn't track your location. Share it in the group chat only if you want to.</p></div>`;
}
bind.tripday=id=>{const t=T(id)||T('coorg'), d=TD[t.id];
  $('#view').addEventListener('click',e=>{const b=e.target.closest('[data-td]'); if(!b) return; const k=b.dataset.td;
    if(k==='reached'){d.me=!d.me; route(); if(d.me) demoToast('the group would see you\'ve reached. Nothing was sent.')}
    if(k==='share') demoToast('nothing was sent. In the real app your trusted contact gets the plan and the group list.');
    if(k==='dir') demoToast('maps aren\'t connected in the demo.');
    if(k==='call') demoToast('in-app calling isn\'t connected in the demo. Your number stays private.');
    if(k==='help') openReport({what:'person',name:'a problem on this trip',block:false});
  });
};
