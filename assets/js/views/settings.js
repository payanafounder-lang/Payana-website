/* ---------- SETTINGS (v1.2: edit profile, privacy & safety) ----------
   Team change (17 Nov): budget per trip and group size are NOT part of the profile;
   they are set on each trip. Reviews about you are always visible. */
const SET_TABS=[['edit','Edit profile'],['privacy','Privacy & safety']];
const SET_INTS=['Trekking','Coffee','Food','Photography','Heritage','Beaches','Camping','Wildlife','Rail'];
function settings(){
  if(!S.setTab) S.setTab='edit';
  const tabs=SET_TABS.map(([k,l])=>`<button data-stab="${k}" aria-current="${S.setTab===k}" class="${k==='delete'?'danger':''}">${l}</button>`).join('');
  return `<div class="ph"><div><h1>Settings</h1><p>Your profile, privacy and account</p></div></div>
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
     <div class="in">Pace<div class="radios">${['Relaxed','Balanced','Active'].map(p=>`<button type="button" class="chip" data-eppace="${p}" aria-pressed="${p===pace}">${p}</button>`).join('')}</div></div>
     <div class="in">Interests<div class="radios">${SET_INTS.map(i=>`<button type="button" class="chip" data-epint="${i}" aria-pressed="${P.tags.includes(i)}">${i}</button>`).join('')}</div></div>
     <p class="hint">Budget and group size are set on each trip, not on your profile.</p>
     <p class="err" id="eperr" hidden></p>
     <div class="actions"><a class="btn btn-line" href="#profile">Cancel</a><button class="btn btn-primary">Save changes</button></div></form>`}
  if(k==='privacy') return `<div class="card sec"><h2>Privacy &amp; safety</h2>
     <p class="hint">Your exact location is never shown to other people. Reviews about you are always visible on your profile, for everyone's safety.</p>
     ${[['priv-trips','Only friends can see which trips I\'m going on','Others still see the trip, not that you\'re on it',true],['priv-loc','Hide post locations until I\'m back','Applies to new posts',true],['priv-req','Only friends of friends can send me friend requests','',false]].map(([id,t,s,on])=>`<label class="setrow" for="${id}"><span><b>${t}</b>${s?`<small>${s}</small>`:''}</span><span class="toggle"><input type="checkbox" id="${id}" ${on?'checked':''}></span></label>`).join('')}
     <div class="setrow"><span><b>Trusted contact</b><small>${S.trusted?esc(S.trusted):'Gets your itinerary and group list when you share a trip'}</small></span><button class="btn btn-soft btn-sm" data-trusted-set>${S.trusted?'Change':'Add contact'}</button></div>
     ${S.trustedEdit?`<form class="inline-form" id="trustf"><label class="in" for="tc-in">Name and phone<input id="tc-in" value="${esc(S.trusted||'')}" placeholder="Amma · +91 98XXX XXXXX"></label><button class="btn btn-primary btn-sm">Save</button></form>`:''}
     <div class="setrow"><span><b>Verification</b><small>Phone and email verified</small></span><a class="btn btn-soft btn-sm" href="#settings" data-goverify>Get verified</a></div>
     <div class="setrow"><span><b>Download my data</b><small>A copy of your profile, posts and trips</small></span><button class="btn btn-line btn-sm" data-dl>Request</button></div>
    </div>
    <p class="hint" style="padding:0 4px">Payana team member? <a class="linkbtn" href="#admin">Open the admin dashboard (demo)</a></p>`;
  return '';
}
bind.settings=()=>{
  const v=$('#view'), draw=()=>{$('#setbody').innerHTML=setSection(); $$('[data-stab]').forEach(b=>b.setAttribute('aria-current',b.dataset.stab===S.setTab))};
  v.addEventListener('click',e=>{
    const t=e.target.closest('[data-stab]'); if(t){S.setTab=t.dataset.stab; draw(); return}
    const p=e.target.closest('[data-eppace]'); if(p){$$('[data-eppace]').forEach(x=>x.setAttribute('aria-pressed',x===p)); return}
    const i=e.target.closest('[data-epint]'); if(i){i.setAttribute('aria-pressed',i.getAttribute('aria-pressed')!=='true'); return}
    if(e.target.closest('[data-trusted-set]')){S.trustedEdit=!S.trustedEdit; draw(); const i=$('#tc-in'); i&&i.focus()}
    if(e.target.closest('[data-goverify]')){e.preventDefault(); if(typeof verify==='function') location.hash='verify'; else demoToast('verification comes in version 1.3')}
    if(e.target.closest('[data-dl]')) demoToast('no data was exported. In the real app we email you a download link.');
  });
  v.addEventListener('change',e=>{if(e.target.closest('.setrow')&&e.target.type==='checkbox') demoToast('setting changed on this page only')});
  v.addEventListener('submit',e=>{
    if(e.target.id==='trustf'){e.preventDefault(); S.trusted=$('#tc-in').value.trim()||null; S.trustedEdit=false; draw(); demoToast(S.trusted?'trusted contact saved on this page only. Nothing was sent.':'trusted contact removed'); return}
    if(e.target.id!=='editf') return; e.preventDefault();
    const name=$('#ep-name').value.trim(), err=$('#eperr');
    if(name.length<2){err.textContent='Add your full name so travellers know who they\'re meeting.'; err.hidden=false; return}
    const u=me(); u.name=name; store.set('user',u); window.__u=u;
    const pace=($('[data-eppace][aria-pressed="true"]')||{}).dataset; const ints=$$('[data-epint][aria-pressed="true"]').map(x=>x.dataset.epint);
    S.profile.bio=$('#ep-bio').value.trim(); S.profile.langs=$('#ep-lang').value.trim(); S.profile.tags=[(pace?pace.eppace:'Relaxed')+' pace',...ints];
    location.hash='profile'; demoToast('profile updated on this device only.');
  });
};
