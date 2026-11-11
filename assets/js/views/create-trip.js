/* ---------- CREATE A TRIP ---------- */
const HOSTREQ={};
const COVERS=S.covers;
let tcover=COVERS[0], tints=new Set(), tpace='Relaxed';
function newtrip(){
  tcover=COVERS[0]; tints=new Set(); tpace='Relaxed';
  const ints=['Trekking','Food','Coffee','Rafting','Heritage','Rail','Photography','Wildlife','Beaches','Camping'];
  return `<div class="ph"><div><h1>Create a trip</h1><p>Set the plan and who you'd like to travel with. You approve everyone who joins.</p></div><a class="btn btn-line" href="#mytrips">Cancel</a></div>
  <form class="cgrid" id="ntf" novalidate><div style="display:grid;gap:20px;min-width:0">
   <div class="card sec"><h2 style="font-size:20px">The trip</h2>
    <label class="in" for="nt-dest">Destination<input id="nt-dest" list="dests2" placeholder="e.g. Gokarna"><datalist id="dests2"><option value="Coorg"><option value="Gokarna"><option value="Hampi"><option value="Wayanad"><option value="Pondicherry"><option value="Ooty"></datalist></label>
    <div class="row2"><label class="in" for="nt-start">Start date<input id="nt-start" type="date"></label><label class="in" for="nt-end">End date<input id="nt-end" type="date"></label></div>
    <label class="in" for="nt-desc">Rough plan<textarea id="nt-desc" placeholder="One activity per line, e.g.&#10;Leave Bengaluru 6 am&#10;Beach trek to Om beach&#10;Sunset at Kudle"></textarea></label>
   </div>
   <div class="card sec"><h2 style="font-size:20px">Who should come</h2>
    <div class="row2"><label class="in" for="nt-budget">Budget per person (₹)<input id="nt-budget" type="number" inputmode="numeric" min="500" step="100" placeholder="4500"></label>
     <label class="in" for="nt-group">Group size, including you<select id="nt-group">${[2,3,4,5,6,8,10,12].map(n=>`<option ${n===6?'selected':''}>${n}</option>`).join('')}</select></label></div>
    <div class="in">Pace<div class="radios">${['Relaxed','Active'].map(p=>`<button type="button" class="chip" data-tpace="${p}" aria-pressed="${p==='Relaxed'}">${p}</button>`).join('')}</div></div>
    <div class="in">Interests<div class="radios">${ints.map(k=>`<button type="button" class="chip" data-tint="${k}" aria-pressed="false">${k}</button>`).join('')}</div></div>
    <label class="toggle"><input type="checkbox" id="nt-ver">Only verified travellers can request</label>
   </div>
   <div class="card sec"><h2 style="font-size:20px">Cover photo</h2>
    <div class="memgrid" id="covers" style="grid-template-columns:repeat(5,1fr)">${COVERS.map((n,i)=>`<button type="button" data-cover="${n}" aria-pressed="${i===0}" style="padding:0;border:3px solid ${i===0?'var(--terra)':'transparent'};border-radius:14px;cursor:pointer;background:none"><img src="${src(n)}" alt="" style="border-radius:10px"></button>`).join('')}</div>
    <label class="btn btn-soft btn-sm" for="nt-file" style="justify-self:start">${I('photo')}Upload your own<input type="file" id="nt-file" accept="image/*" hidden></label>
   </div>
   <p class="err" id="nterr" hidden></p>
  </div>
  <div class="card sec" style="position:sticky;top:24px"><span class="eyebrow">Preview</span><div id="ntprev"></div>
   <button class="btn btn-primary" type="submit">Publish trip</button><p style="color:var(--muted);font-size:13px">Your trip appears in Explore. People send requests, and you approve or decline each one.</p></div></form>`;
}
const fmtD=d=>new Date(d+'T00:00').toLocaleDateString('en-IN',{weekday:'short',day:'numeric',month:'short'});
function draftTrip(){
  const dest=$('#nt-dest').value.trim(), a=$('#nt-start').value, b=$('#nt-end').value, g=+$('#nt-group').value, bud=+$('#nt-budget').value||0;
  const days=a&&b?Math.round((new Date(b)-new Date(a))/864e5)+1:0;
  const lines=$('#nt-desc').value.split('\n').map(x=>x.trim()).filter(Boolean);
  return {id:'mine'+Date.now().toString(36),name:dest||'Your destination',img:tcover,km:0,
    dates:a?(days>1?`${fmtD(a)} – ${fmtD(b)}`:`${fmtD(a)} · day trip`):'Pick your dates',len:days<=1?'day':days<=2?'weekend':'long',
    budget:bud,pace:tpace,seats:`${g-1} of ${g}`,group:g,fit:'strong',host:me().name,hv:true,interests:[...tints].length?[...tints]:['Travel'],
    why:['Your trip',...[...tints].slice(0,2)],miss:[],plan:[[days>1?'Day 1':'Day',lines[0]||'Plan to be shared with the group',lines.slice(1)]],
    people:[[me().name,'Host',true]],a,b,dest};
}
bind.newtrip=()=>{
  const v=$('#view'), prev=()=>{const t=draftTrip(); $('#ntprev').innerHTML=tripCard(t,false).replace('class="trip"','class="trip" style="min-height:400px;pointer-events:none"')};
  prev();
  v.addEventListener('input',prev);
  v.addEventListener('click',e=>{
    const c=e.target.closest('[data-cover]'); if(c){tcover=+c.dataset.cover; $$('[data-cover]').forEach(x=>{x.setAttribute('aria-pressed',x===c); x.style.borderColor=x===c?'var(--terra)':'transparent'}); prev()}
    const p=e.target.closest('[data-tpace]'); if(p){tpace=p.dataset.tpace; $$('[data-tpace]').forEach(x=>x.setAttribute('aria-pressed',x===p)); prev()}
    const i=e.target.closest('[data-tint]'); if(i){const k=i.dataset.tint; tints.has(k)?tints.delete(k):tints.add(k); i.setAttribute('aria-pressed',tints.has(k)); prev()}
  });
  $('#nt-file').onchange=e=>{const f=e.target.files[0]; if(!f) return; const r=new FileReader(); r.onload=()=>{tcover=r.result; $$('[data-cover]').forEach(x=>x.style.borderColor='transparent'); prev()}; r.readAsDataURL(f)};
  $('#ntf').addEventListener('submit',e=>{e.preventDefault(); const t=draftTrip(), err=$('#nterr'); let m='';
    if(!t.dest) m='Add a destination.'; else if(!t.a||!t.b) m='Pick a start and end date.'; else if(t.b<t.a) m='The end date is before the start date.'; else if(t.budget<500) m='Add a budget per person of at least ₹500.';
    if(m){err.textContent=m; err.hidden=false; err.scrollIntoView({block:'center'}); return}
    delete t.a; delete t.b; delete t.dest;
    TRIPS.unshift(t); S.joined[t.id]='hosting'; store.set('joined',S.joined);
    HOSTREQ[t.id]=demoCopy(S.hostRequests);
    location.hash='trip-'+t.id; demoToast('trip published on this page only (gone after reload). Two sample join requests added.');
  });
};
