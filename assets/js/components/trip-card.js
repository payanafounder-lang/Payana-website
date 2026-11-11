/* ---------- SHARED TRIP CARD ---------- */
const FITL={strong:'Strong fit',good:'Good fit',partial:'Partial fit'};
function tripCard(t,linkable){
  const p=t.people;
  return `<${linkable?`a href="#trip-${t.id}"`:'article'} class="trip">
    <img src="${src(t.img)}" alt="${esc(t.name)}" loading="lazy">
    <span class="fit ${t.fit}"><b></b>${FITL[t.fit]}</span>${t.km?`<span class="km">${t.km} km</span>`:'<span class="km">New</span>'}
    <div class="trip-card"><h3>${t.name}</h3>
      <div class="meta"><span>${t.dates}</span><span>${rupee(t.budget)} / person</span><span>${t.seats} seats</span></div>
      <ul class="why">${t.why.map(w=>`<li>✓ ${w}</li>`).join('')}${t.miss.map(w=>`<li class="miss">! ${w}</li>`).join('')}</ul>
      <div class="trip-foot"><div class="faces">${p.slice(0,3).map((x,i)=>av(x[0],i)).join('')}${p.length>3?`<span class="av" style="background:#E8D7C3">+${p.length-3}</span>`:''}</div>
      <span class="btn join" ${linkable?'':`data-trip="${t.id}" role="button" tabindex="0"`}>${linkable?'View trip':'Request to join'}</span></div>
    </div></${linkable?'a':'article'}>`;
}
