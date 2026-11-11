/* ---------- EXPLORE ---------- */
function explore(){
  const f=S.f, ints=['Trekking','Food','Coffee','Rafting','Heritage','Rail','Photography','Wildlife'];
  return `<div class="ph"><div><h1>Explore trips</h1><p>Trips forming near Bengaluru, ranked by how well they fit you</p></div><a class="btn btn-primary" href="#newtrip">${I('plus')}Create a trip</a></div>
  <div class="card filters">
   <div class="frow"><span class="flabel">Length</span>${[['all','Any'],['day','Day trip'],['weekend','Weekend'],['long','3+ days']].map(([k,l])=>`<button class="chip" data-len="${k}" aria-pressed="${f.len===k}">${l}</button>`).join('')}</div>
   <div class="frow"><span class="flabel">Budget</span><div class="range"><label for="budget" class="sr" hidden>Max budget</label><input type="range" id="budget" min="2000" max="10000" step="500" value="${f.max}"><output id="bout">up to ${rupee(f.max)}</output></div></div>
   <div class="frow"><span class="flabel">Pace</span>${['all','Relaxed','Active'].map(k=>`<button class="chip" data-pace="${k}" aria-pressed="${f.pace===k}">${k==='all'?'Any':k}</button>`).join('')}
     <label class="toggle" style="margin-left:auto"><input type="checkbox" id="ver" ${f.ver?'checked':''}>Verified hosts only</label></div>
   <div class="frow"><span class="flabel">Interests</span>${ints.map(k=>`<button class="chip" data-int="${k}" aria-pressed="${f.ints.has(k)}">${k}</button>`).join('')}</div>
  </div>
  <p class="count" id="count"></p><div class="tgrid" id="results"></div>`;
}
function renderResults(){
  const f=S.f, order={strong:0,good:1,partial:2};
  const r=TRIPS.filter(t=>(f.len==='all'||t.len===f.len)&&t.budget<=f.max&&(f.pace==='all'||t.pace===f.pace)&&(!f.ver||t.hv)&&(!f.ints.size||t.interests.some(i=>f.ints.has(i)))).sort((a,b)=>order[a.fit]-order[b.fit]);
  $('#count').textContent=`${r.length} trip${r.length===1?'':'s'} match your filters`;
  $('#results').innerHTML=r.length?r.map(t=>tripCard(t,true)).join(''):`<div class="card empty" style="grid-column:1/-1">No trips match these filters. Try a higher budget or clear an interest.</div>`;
}
bind.explore=()=>{renderResults();
  $('#view').addEventListener('click',e=>{const c=e.target.closest('.chip'); if(!c) return; const f=S.f;
    if(c.dataset.len){f.len=c.dataset.len; $$('[data-len]').forEach(x=>x.setAttribute('aria-pressed',x===c))}
    if(c.dataset.pace){f.pace=c.dataset.pace; $$('[data-pace]').forEach(x=>x.setAttribute('aria-pressed',x===c))}
    if(c.dataset.int){f.ints.has(c.dataset.int)?f.ints.delete(c.dataset.int):f.ints.add(c.dataset.int); c.setAttribute('aria-pressed',f.ints.has(c.dataset.int))}
    renderResults()});
  $('#budget').oninput=e=>{S.f.max=+e.target.value; $('#bout').textContent='up to '+rupee(S.f.max); renderResults()};
  $('#ver').onchange=e=>{S.f.ver=e.target.checked; renderResults()};
};
