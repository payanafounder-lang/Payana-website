/* ---------- PLAN TOGETHER ---------- */
const STC={Booked:'p-ok','To confirm':'p-warn',Planned:'p-mut',Idea:'p-bad'}, STN=['Idea','Planned','To confirm','Booked'];
function plan(){
  const t=T(S.planTrip)||TRIPS[0];
  return `<div class="cover" style="min-height:220px"><img src="${src(t.img)}" alt=""><a class="btn btn-glass back" href="#mytrips">← My trips</a>
   <div class="cover-in"><span class="eyebrow" style="color:var(--sun)">Plan together</span><h1 style="font-size:clamp(34px,5vw,56px)">${t.name}</h1><div class="meta">${t.dates} · ${t.people.length+1} going</div></div></div>
   <div style="display:flex;gap:10px;flex-wrap:wrap;margin:18px 0"><button class="btn btn-soft btn-sm" data-trusted>${I('pin')}Share with a trusted contact</button><button class="btn btn-line btn-sm" data-help>Get help</button></div>
   <div class="ptabs" role="tablist">${['Plan','Chat','Budget','People','Memories'].map(x=>`<button role="tab" data-ptab="${x.toLowerCase()}" aria-selected="${S.planTab===x.toLowerCase()}">${x}</button>`).join('')}</div>
   <div id="ptab"></div>`;
}
function planTab(){
  const t=T(S.planTrip)||TRIPS[0], k=S.planTab, me_=me().name;
  if(k==='plan'){const days=[...new Set(S.plan.map(p=>p[0]))];
    return `<div class="pgrid"><div class="card sec">${days.map(d=>`<h2 style="font-size:18px">${d==='Sat'?'Saturday':'Sunday'}</h2><div class="items">${S.plan.map((p,i)=>p[0]!==d?'':`<div class="item"><time>${p[1]}</time><div><b>${esc(p[2])}</b><small>Owner: ${esc(p[3])}</small></div><button class="pill st ${STC[p[4]]}" data-st="${i}" title="Change status">${p[4]}</button></div>`).join('')}</div>`).join('')}
     <form class="additem" id="addi"><input id="ai-t" placeholder="Time" aria-label="Time"><input id="ai-w" placeholder="Add an activity, e.g. Coffee at Kodava café" aria-label="Activity"><button class="btn btn-primary btn-sm">Add</button></form></div>
     <div class="card sec"><h2 style="font-size:18px">Status key</h2>${STN.slice().reverse().map(s=>`<div><span class="pill ${STC[s]}">${s}</span></div>`).join('')}<p style="color:var(--muted);font-size:13.5px">Tap a status to move it forward. Everyone in the group sees changes.</p></div></div>`}
  if(k==='chat') return `<div class="card sec"><div class="chat" id="chat">${S.chat.map(m=>msgHTML(m,me_)).join('')}</div><form class="send" id="sendf"><input id="cmsg" placeholder="Message the group" aria-label="Message"><button class="btn btn-primary">Send</button></form></div>`;
  if(k==='budget'){const rows=S.budget; const tot=rows.reduce((a,r)=>a+r[1],0);
    return `<div class="pgrid"><div class="card sec"><h2 style="font-size:18px">Estimated cost per person</h2><div style="overflow-x:auto"><table class="budget"><thead><tr><th>Item</th><th>Per person</th></tr></thead><tbody>${rows.map(r=>`<tr><td>${r[0]}</td><td>${rupee(r[1])}</td></tr>`).join('')}</tbody><tfoot><tr><td>Total</td><td>${rupee(tot)}</td></tr></tfoot></table></div><p style="color:var(--muted);font-size:13.5px">Estimates only. Payments happen outside the app.</p></div>
    <div class="card sec"><h2 style="font-size:18px">Who's handling what</h2>${S.handling.map((p,i)=>`<div class="person">${av(p[0],i)}<div><b>${p[0]}</b><small>${p[1]}</small></div></div>`).join('')}</div></div>`}
  if(k==='people') return `<div class="card sec">${[[me_,'You',true],...t.people].map((p,i)=>`<div class="person">${av(p[0],i)}<div><b>${esc(p[0])}${p[2]?'<span class="vf">✓</span>':''}</b><small>${p[1]}</small></div><a class="btn btn-line btn-sm" href="#messages">Message</a></div>`).join('')}</div>`;
  return `<div class="card sec"><h2 style="font-size:18px">Shared album</h2><div class="memgrid">${[t.img,...S.albumExtra].map(n=>`<img src="${src(n)}" alt="">`).join('')}<label class="add" for="memup">+ Add photos<input type="file" id="memup" accept="image/*" multiple hidden></label></div><p style="color:var(--muted);font-size:13.5px">After the trip, turn the album into a post with one tap.</p></div>`;
}
function msgHTML(m,me_){const mine=m[0]===me_; return `<div class="msg ${mine?'mine':''}"><div class="bub">${esc(m[1])}</div><small>${mine?'You':esc(m[0])} · ${m[2]||'now'}</small></div>`}
bind.plan=()=>{
  const draw=()=>{$('#ptab').innerHTML=planTab(); const c=$('#chat'); if(c) c.scrollTop=c.scrollHeight};
  draw();
  $('#view').addEventListener('click',e=>{
    const tb=e.target.closest('[data-ptab]'); if(tb){S.planTab=tb.dataset.ptab; $$('[data-ptab]').forEach(b=>b.setAttribute('aria-selected',b===tb)); draw()}
    const st=e.target.closest('[data-st]'); if(st){const p=S.plan[+st.dataset.st]; p[4]=STN[(STN.indexOf(p[4])+1)%STN.length]; draw()}
    if(e.target.closest('[data-trusted]')) demoToast('nothing was sent. In the real app this shares the itinerary and group list with your trusted contact.');
    if(e.target.closest('[data-help]')) demoToast('support isn\'t connected yet. In the real app this contacts the Payana team.');
  });
  $('#view').addEventListener('submit',e=>{e.preventDefault();
    if(e.target.id==='addi'){const w=$('#ai-w').value.trim(); if(!w) return; S.plan.push(['Sun',$('#ai-t').value.trim()||'—',w,me().name.split(' ')[0],'Idea']); draw(); demoToast('added to the plan on this page only')}
    if(e.target.id==='sendf'){const m=$('#cmsg').value.trim(); if(!m) return; S.chat.push([me().name,m,'now']); draw(); $('#cmsg')&&$('#cmsg').focus()}
  });
  $('#view').addEventListener('change',e=>{if(e.target.id==='memup'&&e.target.files.length) demoToast(`${e.target.files.length} photo${e.target.files.length>1?'s':''} selected. Nothing was uploaded.`)});
};
