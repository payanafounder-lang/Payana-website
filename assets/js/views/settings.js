/* ---------- SETTINGS (v1.2: edit profile, privacy & safety) ----------
   Team change (17 Nov): budget per trip and group size are NOT part of the profile;
   they are set on each trip. Reviews about you are always visible.
   Team changes (18 Nov): Settings opens from the profile page (like Instagram), not the menu.
   Edit profile is its own page (#editprofile), not a Settings section, so the two don't mix.
   Gender has no "Prefer not to say" option. Emergency contacts: a main contact plus an
   alternative number, family or friend.
   Team change (27 Nov): Log out lives here only (bottom of the Settings list), not in the menu or phone top bar. */
const SET_TABS=[['privacy','Privacy & safety']];
// Later versions add sections: SET_EXTRA[key]=()=>html and click handlers in SET_CLICK.
const SET_EXTRA={}, SET_CLICK=[];
const SET_INTS=['Trekking','Coffee','Food','Photography','Heritage','Beaches','Camping','Wildlife','Rail'];
function settings(){
  if(!S.setTab||!SET_TABS.some(t=>t[0]===S.setTab)) S.setTab=SET_TABS[0][0];
  const tabs=SET_TABS.map(([k,l])=>`<button data-stab="${k}" aria-current="${S.setTab===k}" class="${k==='delete'?'danger':''}">${l}</button>`).join('');
  return `<div class="ph"><div><a class="linkbtn" href="#profile" style="font-size:14px">← Back to profile</a><h1>Settings</h1><p>Account, privacy, notifications and blocked people</p></div></div>
   <div class="set-grid"><nav class="card set-nav" aria-label="Settings sections">${tabs}<button type="button" class="set-out" data-logout><svg class="i"><use href="#i-out"/></svg>Log out</button></nav><div id="setbody" style="display:grid;gap:20px;min-width:0">${setSection()}</div></div>
   <div class="card set-out-row"><button type="button" class="btn btn-line" data-logout><svg class="i"><use href="#i-out"/></svg>Log out</button></div>`;
}
function setSection(){
  const k=S.setTab;
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

/* ---------- EDIT PROFILE (own page, team change 18 Nov) ----------
   #editprofile, opened from the Edit profile button on your profile. Only what others
   see about you: banner, profile photo, name, username, city, languages, bio, gender, pace and interests.
   Photo and banner (23 Nov): picked from the device, cropped in the page (photo square, banner 3:1)
   and kept on this device only. Live: upload to storage and save the URL on the profile.
   Account, privacy and the rest stay in Settings. */
function editprofile(){
  const u=me(), P=S.profile, pace=(P.tags.find(t=>/pace/i.test(t))||'Relaxed pace').replace(' pace','');
  return `<div class="ph"><div><a class="linkbtn" href="#profile" style="font-size:14px">← Back to profile</a><h1>Edit profile</h1><p>What other travellers see about you</p></div></div>
   <div class="ep-wrap">`+EP_FORM(u,P,pace)+`</div>`;
}
const EP_FORM=(u,P,pace)=>`<form class="card sec" id="editf">
     <div class="ep-media"><div class="ep-cover" id="ep-cover" role="button" tabindex="0" aria-label="Change banner"><img id="ep-cimg" src="${src(u.cover||P.cover)}" alt="Banner preview">
       <button type="button" class="ep-pill ep-crst" id="ep-crm"${u.cover?'':' hidden'}>Reset</button><span class="ep-pill ep-cchg">${I('photo')}Change banner</span><input type="file" id="ep-cfile" accept="image/*" hidden></div>
      <div class="ep-avrow"><button type="button" class="ep-av" id="ep-av" aria-label="Change profile photo"></button>
       <div class="ep-avtxt"><div class="ep-avacts"><label class="linkbtn" for="ep-pfile" id="ep-plab">${u.photo?'Change photo':'Add profile photo'}</label><input type="file" id="ep-pfile" accept="image/*" hidden><button type="button" class="linkbtn ep-rm" id="ep-prm"${u.photo?'':' hidden'}>Remove</button></div>
        <small class="hint">Use a clear photo of your face. It helps travellers trust who they're meeting.</small></div></div></div>
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
     <div class="actions"><a class="btn btn-line" href="#profile">Cancel</a><button class="btn btn-primary">Save changes</button></div></form>`;
/* Crop an image file to w×h (centre) and return a JPEG data URL. */
function cropImage(file,w,h,cb){if(!file||!file.type.startsWith('image/')){toast('Please choose an image'); return}
  const r=new FileReader(); r.onload=()=>{const img=new Image(); img.onload=()=>{const c=document.createElement('canvas'); c.width=w; c.height=h;
    let sw=img.width, sh=sw*h/w; if(sh>img.height){sh=img.height; sw=sh*w/h}
    c.getContext('2d').drawImage(img,(img.width-sw)/2,(img.height-sh)/2,sw,sh,0,0,w,h); cb(c.toDataURL('image/jpeg',.82))}; img.src=r.result}; r.readAsDataURL(file)}
const initials=n=>String(n||'You').split(' ').filter(Boolean).map(x=>x[0]).join('').slice(0,2).toUpperCase();
bind.editprofile=()=>{const v=$('#view'), u0=me(); let photo=u0.photo||null, cover=u0.cover||null;
  const drawAv=()=>{$('#ep-av').innerHTML=(photo?`<img src="${photo}" alt="">`:esc(initials($('#ep-name').value||u0.name)))+`<span class="ep-cam" aria-hidden="true">${I('photo')}</span>`; $('#ep-prm').hidden=!photo; $('#ep-plab').textContent=photo?'Change photo':'Add profile photo'};
  const drawCov=()=>{$('#ep-cimg').src=src(cover||S.profile.cover); $('#ep-crm').hidden=!cover};
  drawAv();
  $('#ep-av').onclick=()=>$('#ep-pfile').click();
  $('#ep-prm').onclick=()=>{photo=null; $('#ep-pfile').value=''; drawAv()};
  $('#ep-name').addEventListener('input',()=>{if(!photo) drawAv()});
  // Team change (24 Nov): pick the framing in the photo editor instead of an automatic centre crop.
  const pick=async(e,lock,out,title,done)=>{const f=e.target.files[0]; e.target.value=''; if(!f) return; if(!f.type.startsWith('image/')){toast('Please choose an image'); return}
    const it=await loadImg(f); if(!it){toast("Couldn't open that photo. Try a JPG or PNG."); return} openEditor(it,{lock,out,title,round:lock===1,onDone:r=>done(r.s)})};
  $('#ep-pfile').onchange=e=>pick(e,1,[400,400],'Profile photo',d=>{photo=d; drawAv()});
  $('#ep-cover').onclick=e=>{if(e.target.closest('#ep-crm')) return; $('#ep-cfile').click()};
  $('#ep-cover').onkeydown=e=>{if((e.key==='Enter'||e.key===' ')&&e.target.id==='ep-cover'){e.preventDefault(); $('#ep-cfile').click()}};
  $('#ep-crm').onclick=()=>{cover=null; $('#ep-cfile').value=''; drawCov()};
  $('#ep-cfile').onchange=e=>pick(e,3,[1200,400],'Position your banner',d=>{cover=d; drawCov()});
  v.addEventListener('click',e=>{
    const p=e.target.closest('[data-eppace]'); if(p){$$('[data-eppace]').forEach(x=>x.setAttribute('aria-pressed',x===p)); return}
    const i=e.target.closest('[data-epint]'); if(i){i.setAttribute('aria-pressed',i.getAttribute('aria-pressed')!=='true'); return}
  });
  v.addEventListener('submit',e=>{
    if(e.target.id!=='editf') return; e.preventDefault();
    const name=$('#ep-name').value.trim(), err=$('#eperr');
    if(name.length<2){err.textContent='Add your full name so travellers know who they\'re meeting.'; err.hidden=false; return}
    const u=me(); u.name=name; if(photo) u.photo=photo; else delete u.photo; if(cover) u.cover=cover; else delete u.cover; store.set('user',u); window.__u=u;
    const pace=($('[data-eppace][aria-pressed="true"]')||{}).dataset; const ints=$$('[data-epint][aria-pressed="true"]').map(x=>x.dataset.epint);
    S.profile.gender=$('#ep-gen').value; S.profile.bio=$('#ep-bio').value.trim(); S.profile.langs=$('#ep-lang').value.trim(); S.profile.tags=[(pace?pace.eppace:'Relaxed')+' pace',...ints];
    location.hash='profile'; demoToast('profile updated on this device only.');
  });
};
