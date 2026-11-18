/* ---------- SETTINGS (v1.2: edit profile, privacy & safety) ----------
   Team change (17 Nov): budget per trip and group size are NOT part of the profile;
   they are set on each trip. Reviews about you are always visible.
   Team changes (18 Nov): Settings opens from the profile page (like Instagram), not the menu.
   Gender has no "Prefer not to say" option. Emergency contacts: a main contact plus an
   alternative number, family or friend. */
const SET_TABS=[['edit','Edit profile'],['privacy','Privacy & safety']];
// Later versions add sections: SET_EXTRA[key]=()=>html and click handlers in SET_CLICK.
const SET_EXTRA={}, SET_CLICK=[];
const SET_INTS=['Trekking','Coffee','Food','Photography','Heritage','Beaches','Camping','Wildlife','Rail'];
function settings(){
  if(!S.setTab) S.setTab='edit';
  const tabs=SET_TABS.map(([k,l])=>`<button data-stab="${k}" aria-current="${S.setTab===k}" class="${k==='delete'?'danger':''}">${l}</button>`).join('');
  return `<div class="ph"><div><a class="linkbtn" href="#profile" style="font-size:14px">← Back to profile</a><h1>Settings</h1><p>Your profile, privacy and account</p></div></div>
   <div class="set-grid"><nav class="card set-nav" aria-label="Settings sections">${tabs}</nav><div id="setbody" style="display:grid;gap:20px;min-width:0">${setSection()}</div></div>`;
}
function setSection(){
  const k=S.setTab, u=me(), P=S.profile;
  if(k==='edit'){const pace=(P.tags.find(t=>/pace/i.test(t))||'Relaxed pace').replace(' pace','');
    return `<form class="card sec" id="editf"><h2>Edit profile</h2>
     <div class="row2"><label class="in" for="ep-name">Full name<input id="ep-name" value="${esc(u.name)}" autocomplete="name"></label>
      <label class="in" for="ep-user">Username<input id="ep-user" value="@${esc(u.name.toLowerCase().replace(/\s+/g,'.'))}"></label></div>
     <div class="row2"><label class="in" for="ep-city">City<input id="ep-city" value="Bengaluru"></label>
      <label class="in" for="ep-lang">Languages you speak<input id="ep-lang" value="${esc(P.langs||'')}"></label></div>
     <label class="in" for="ep-bio">Short bio<textarea id="ep-bio">${esc(P.bio)}</textarea></label>
     <label class="in" for="ep-gen">Gender (optional)<select id="ep-gen">${['','Woman','Man','Non-binary'].map(g=>`<option value="${g}" ${(P.gender||'')===g?'selected':''}>${g||'Not set'}</option>`).join('')}</select><small class="hint" style="font-weight:400">Only used for women-only trips. Not shown on your profile unless you choose.</small></label>
     <div class="in">Pace<div class="radios">${['Relaxed','Balanced','Active'].map(p=>`<button type="button" class="chip" data-eppace="${p}" aria-pressed="${p===pace}">${p}</button>`).join('')}</div></div>
     <div class="in">Interests<div class="radios">${SET_INTS.map(i=>`<button type="button" class="chip" data-epint="${i}" aria-pressed="${P.tags.includes(i)}">${i}</button>`).join('')}</div></div>
     <p class="hint">Budget and group size are set on each trip, not on your profile.</p>
     <p class="err" id="eperr" hidden></p>
     <div class="actions"><a class="btn btn-line" href="#profile">Cancel</a><button class="btn btn-primary">Save changes</button></div></form>`}
  if(k==='privacy') return `<div class="card sec"><h2>Privacy &amp; safety</h2>
     <p class="hint">Your exact location is never shown to other people. Reviews about you are always visible on your profile, for everyone's safety.</p>
     ${[['priv-trips','Only friends can see which trips I\'m going on','Others still see the trip, not that you\'re on it',true],['priv-loc','Hide post locations until I\'m back','Applies to new posts',true],['priv-req','Only friends of friends can send me friend requests','',false]].map(([id,t,s,on])=>`<label class="setrow" for="${id}"><span><b>${t}</b>${s?`<small>${s}</small>`:''}</span><span class="toggle"><input type="checkbox" id="${id}" ${on?'checked':''}></span></label>`).join('')}
     ${emergencyHTML()}
     <div class="setrow"><span><b>Verification</b><small>${typeof verifiedCount==='function'?verifiedCount()+' of 4 checks done':'Phone and email verified'}</small></span><a class="btn btn-soft btn-sm" href="#verify" data-goverify>Get verified</a></div>
     <div class="setrow"><span><b>Download my data</b><small>A copy of your profile, posts and trips</small></span><button class="btn btn-line btn-sm" data-dl>Request</button></div>
    </div>
    <p class="hint" style="padding:0 4px">Payana team member? <a class="linkbtn" href="#admin">Open the admin dashboard (demo)</a></p>`;
  return SET_EXTRA[k]?SET_EXTRA[k]():'';
}
bind.settings=()=>{
  const v=$('#view'), draw=()=>{$('#setbody').innerHTML=setSection(); $$('[data-stab]').forEach(b=>b.setAttribute('aria-current',b.dataset.stab===S.setTab))};
  v.addEventListener('click',e=>{
    const t=e.target.closest('[data-stab]'); if(t){S.setTab=t.dataset.stab; draw(); return}
    const p=e.target.closest('[data-eppace]'); if(p){$$('[data-eppace]').forEach(x=>x.setAttribute('aria-pressed',x===p)); return}
    const i=e.target.closest('[data-epint]'); if(i){i.setAttribute('aria-pressed',i.getAttribute('aria-pressed')!=='true'); return}
    const ec=e.target.closest('[data-ec-edit]'); if(ec){S.ecEdit=S.ecEdit===+ec.dataset.ecEdit?null:+ec.dataset.ecEdit; draw(); const i=$('#ec-name'); i&&i.focus(); return}
    const ex=e.target.closest('[data-ec-del]'); if(ex){const c=S.emergency.splice(+ex.dataset.ecDel,1)[0]; S.ecEdit=null; draw(); demoToast(`${c.name} removed from emergency contacts (this page only).`); return}
    if(e.target.closest('[data-ec-cancel]')){S.ecEdit=null; draw(); return}
    if(e.target.closest('[data-goverify]')){e.preventDefault(); location.hash='verify'}
    if(e.target.closest('[data-dl]')) demoToast('no data was exported. In the real app we email you a download link.');
    SET_CLICK.forEach(h=>h(e,draw));
  });
  v.addEventListener('change',e=>{if(e.target.closest('.setrow')&&e.target.type==='checkbox') demoToast('setting changed on this page only')});
  v.addEventListener('submit',e=>{
    if(e.target.id==='ecf'){e.preventDefault(); const name=$('#ec-name').value.trim(), rel=$('#ec-rel').value, ph=$('#ec-phone').value.replace(/[\s-]/g,'').replace(/^(\+91|0)/,''), err=$('#ecerr');
      if(name.length<2){err.textContent='Add their name.'; err.hidden=false; return}
      if(!rel){err.textContent='Choose whether they\'re family or a friend.'; err.hidden=false; return}
      if(!/^[6-9]\d{9}$/.test(ph)){err.textContent='Enter a 10-digit Indian mobile number.'; err.hidden=false; return}
      if(S.emergency.some((c,i)=>i!==S.ecEdit&&c.phone===ph)){err.textContent='This number is already saved. Add a different number.'; err.hidden=false; return}
      const c={name,rel,phone:ph}; if(S.ecEdit<S.emergency.length) S.emergency[S.ecEdit]=c; else S.emergency.push(c);
      S.ecEdit=null; draw(); demoToast(`${name} saved as an emergency contact on this page only. Nothing was sent.`); return}
    if(e.target.id!=='editf') return; e.preventDefault();
    const name=$('#ep-name').value.trim(), err=$('#eperr');
    if(name.length<2){err.textContent='Add your full name so travellers know who they\'re meeting.'; err.hidden=false; return}
    const u=me(); u.name=name; store.set('user',u); window.__u=u;
    const pace=($('[data-eppace][aria-pressed="true"]')||{}).dataset; const ints=$$('[data-epint][aria-pressed="true"]').map(x=>x.dataset.epint);
    S.profile.gender=$('#ep-gen').value; S.profile.bio=$('#ep-bio').value.trim(); S.profile.langs=$('#ep-lang').value.trim(); S.profile.tags=[(pace?pace.eppace:'Relaxed')+' pace',...ints];
    location.hash='profile'; demoToast('profile updated on this device only.');
  });
};

/* ---------- EMERGENCY CONTACTS (team change, 18 Nov) ----------
   A main contact plus an alternative number, each family or a friend. The main contact
   gets the itinerary when you share a trip; both show on the trip-day screen.
   Demo: kept on this page only. Live: stored on the user's account; only the user sees them. */
const EC_REL=['Family','Friend'];
function ecFmt(p){return '+91 '+p.slice(0,5)+' '+p.slice(5)}
function emergencyHTML(){
  const L=S.emergency, ed=S.ecEdit, lab=i=>i===0?'Main contact':'Alternative number';
  const form=i=>{const c=L[i]||{}; return `<form class="inline-form ec-form" id="ecf"><div class="row2"><label class="in" for="ec-name">Name<input id="ec-name" value="${esc(c.name||'')}" placeholder="e.g. Amma, Rohit" autocomplete="off"></label>
     <label class="in" for="ec-rel">They are your<select id="ec-rel"><option value="">Choose</option>${EC_REL.map(r=>`<option ${c.rel===r?'selected':''}>${r}</option>`).join('')}</select></label></div>
     <label class="in" for="ec-phone">Mobile number<input id="ec-phone" type="tel" inputmode="numeric" value="${c.phone||''}" placeholder="98XXX XXXXX" autocomplete="off"></label>
     <p class="err" id="ecerr" hidden></p><div class="actions"><button type="button" class="btn btn-line btn-sm" data-ec-cancel>Cancel</button><button class="btn btn-primary btn-sm">Save ${i===0?'contact':'number'}</button></div></form>`};
  const rows=L.map((c,i)=>`<div class="setrow"><span><b>${lab(i)} · ${esc(c.name)}</b><small>${c.rel} · ${ecFmt(c.phone)}</small></span><span class="btns"><button class="btn btn-soft btn-sm" data-ec-edit="${i}">Change</button><button class="btn btn-line btn-sm" data-ec-del="${i}" aria-label="Remove ${esc(c.name)}">✕</button></span></div>${ed===i?form(i):''}`).join('');
  const add=L.length<2?`<div class="setrow"><span><b>${lab(L.length)}</b><small>${L.length?'A second family member or friend, in case the first can\'t be reached':'Family or a friend. Gets your itinerary when you share a trip'}</small></span><button class="btn btn-soft btn-sm" data-ec-edit="${L.length}">${L.length?'Add number':'Add contact'}</button></div>${ed===L.length?form(L.length):''}`:'';
  return `<div class="ec-box"><h3 style="font-size:16px;margin:14px 0 2px">Emergency contacts</h3><p class="hint" style="margin:0">Only you see these. They show on your trip-day screen so you can call them fast. In danger right now? Call 112.</p>${rows}${add}</div>`;
}
