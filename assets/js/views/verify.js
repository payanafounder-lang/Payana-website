/* ---------- VERIFICATION (v1.3) ----------
   Team change (17 Nov): government ID uses DigiLocker as the main option. A PAN card,
   driving licence or passport photo can be uploaded instead. Aadhaar card photos are
   NOT accepted: unlicensed private companies may not collect or keep Aadhaar copies.
   Demo: every check is simulated and stored in this browser only.
   Live: DigiLocker via a registered requester or a KYC partner; selfie via a liveness vendor. */
function vState(){if(!S.verif) S.verif=store.get('verif')||{phone:true,email:true,selfie:false,id:null}; return S.verif}
function verifiedCount(){const v=vState(); return ['phone','email','selfie'].filter(k=>v[k]).length+(v.id==='digilocker'||v.id==='doc-ok'?1:0)}
function verify(){
  const v=vState(), row=(ic,title,sub,right,cls='')=>`<div class="card vf-row ${cls}"><span class="vf-ic">${I(ic)}</span><div class="vf-txt"><b>${title}</b><small>${sub}</small></div>${right}</div>`;
  const ok='<span class="pill p-ok">Verified</span>';
  const idBox=v.id==='digilocker'?row('shield','Government ID','Verified with DigiLocker. We kept only your name, date of birth and that the check passed.',ok)
   :v.id==='doc'?row('shield','Government ID','Your ID photo is with our team. It is deleted after the check.','<span class="pill p-warn">In review</span>')
   :`<div class="card vf-row vf-col"><div class="vf-head"><span class="vf-ic accent">${I('shield')}</span><div class="vf-txt"><b>Government ID</b><small>Optional. Gets you the "ID verified" badge, which many hosts ask for.</small></div></div>
     <div class="vf-opt main"><div><b>Verify with DigiLocker</b><small>Recommended. You log in to DigiLocker and approve sharing your name, date of birth and photo. No card photo needed, and we never see your full Aadhaar number.</small></div><button class="btn btn-sm forest-btn" data-vf="digilocker">Continue with DigiLocker</button></div>
     <div class="vf-opt"><div><b>No DigiLocker? Upload another ID</b><small>Photo of your PAN card, driving licence or passport. Our team checks it, then the photo is deleted. We don't accept Aadhaar card photos.</small></div><label class="btn btn-soft btn-sm" for="vf-file">Upload ID<input type="file" id="vf-file" accept="image/*" hidden></label></div></div>`;
  return `<div class="ph"><div><h1>Get verified</h1><p>Verified travellers get more trip approvals. Hosts can choose to accept only verified people.</p></div><a class="btn btn-line btn-sm" href="#settings">Back to settings</a></div>
   <div class="vf-grid"><div class="vf-list">
    ${row('phone','Phone number','+91 98XXX XXX21',ok)}
    ${row('chat','Email','Verified at sign-up',ok)}
    ${v.selfie?row('user','Selfie check','Matched to your profile photos',ok):row('user','Selfie check','Take a quick selfie so we can match it to your profile photos. Takes about a minute.','<button class="btn btn-primary btn-sm" data-vf="selfie">Take selfie</button>','hl')}
    ${idBox}</div>
    <aside style="display:grid;gap:16px;align-content:start"><div class="card sec vf-prev"><small class="hint">How your profile will look</small><span class="bigav vf-av">${esc(me().name.split(' ').map(x=>x[0]).join('').slice(0,2).toUpperCase())}${verifiedCount()>=3?'<span class="vf big">✓</span>':''}</span><b>${esc(me().name)}</b><small class="hint">${verifiedCount()} of 4 checks done</small></div>
     <div class="card sec" style="background:var(--surface-2)"><h2 style="font-size:17px">What a badge means</h2><ul class="tips"><li>We checked that item at one point in time.</li><li>It is not a background check.</li><li>Selfies and ID photos are used only for the check, then [deleted / kept for X days].</li><li>From DigiLocker we keep only your name, date of birth and that the check passed.</li></ul></div></aside></div>`;
}
bind.verify=()=>{
  const v=vState(), save=()=>{store.set('verif',v); route()};
  $('#view').addEventListener('click',e=>{const b=e.target.closest('[data-vf]'); if(!b) return;
    if(b.dataset.vf==='selfie'){b.disabled=true; b.textContent='Checking…'; setTimeout(()=>{v.selfie=true; save(); demoToast('selfie check simulated. No camera was used and nothing was stored.')},900)}
    if(b.dataset.vf==='digilocker'){b.disabled=true; b.textContent='Opening DigiLocker…'; setTimeout(()=>{v.id='digilocker'; save(); demoToast('DigiLocker is not connected yet. This only simulates a passed check.')},1100)}
  });
  $('#view').addEventListener('change',e=>{if(e.target.id==='vf-file'&&e.target.files[0]){v.id='doc'; save(); demoToast('nothing was uploaded. In the real app our team checks the photo, then deletes it.')}});
};
