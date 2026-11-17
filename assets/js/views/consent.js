/* ---------- SAFETY CONSENT BEFORE YOU START (v1.3) ----------
   Shown once after sign-up, before the welcome steps. All four boxes are required.
   Demo: the consent record (version, time, boxes) is kept in this browser only.
   Live: store it server-side with the user; show again when the terms change. */
const CONSENT_VERSION='1.0-draft';
const CONSENT_BOXES=[
  'I am 18 years of age or older.',
  'I agree to the <a href="#legal-safety" target="_blank">Safety Terms</a>, <a href="#legal-terms" target="_blank">Terms of Use</a> and <a href="#legal-rules" target="_blank">Community Rules</a>.',
  'I have read the <a href="#legal-privacy" target="_blank">Privacy Notice</a> and consent to Payana using my data as it describes.',
  'I understand Payana doesn\'t run trips or screen every user, and I\'m responsible for my own safety decisions.'];
function consent(){
  return `<div class="focus-page cs-bg"><img src="${src(6068)}" alt="">
   <div class="cs-panel"><span class="eyebrow">Before you join</span><h1>Before you travel with Payana</h1>
    <p class="lead">Payana helps you meet people and plan trips together. Most travellers here are strangers to each other at first, so please read these points.</p>
    <div class="cs-grid"><ol class="cs-points">${[['You must be 18 or older.','Payana is for adults only.'],['We can\'t guarantee anyone\'s identity or behaviour.','Badges and reviews lower risk; they don\'t remove it.'],['Meet smart.','Meet first in a public place, tell someone your plans, and keep your own ID, money and way home.'],['Respect is required.','Harassment, hate, scams and fake profiles get removed and may be reported to police.'],['Report and block anytime.','In an emergency call <b>112</b> first, then report in the app.']].map(([b,t])=>`<li><span><b>${b}</b> ${t}</span></li>`).join('')}</ol>
     <form class="card sec" id="csf"><fieldset><legend>Please confirm</legend>${CONSENT_BOXES.map((t,i)=>`<label class="check" for="cs${i}"><input type="checkbox" id="cs${i}" data-req><span>${t}</span></label>`).join('')}</fieldset>
      <label class="check" for="cs-news"><input type="checkbox" id="cs-news"><span>Optional: send me trip ideas and Payana updates.</span></label>
      <button class="btn btn-primary" id="csgo" disabled>Agree and continue</button><p class="hint" id="cshint" style="text-align:center">Tick all four boxes to continue</p>
      <div class="cs-foot"><a class="linkbtn" href="#legal-safety" target="_blank">Read full Safety Terms</a><button type="button" class="linkbtn muted" data-cs-no>Not now</button></div>
      <p class="hint" style="font-size:12px">You can withdraw consent or delete your account anytime from Settings → Privacy. Version [1.0], effective [date].</p></form></div></div></div>`;
}
bind.consent=()=>{
  const f=$('#csf'), upd=()=>{const all=$$('[data-req]').every(x=>x.checked); $('#csgo').disabled=!all; $('#cshint').hidden=all};
  f.addEventListener('change',upd);
  f.addEventListener('submit',e=>{e.preventDefault(); if($('#csgo').disabled) return;
    store.set('consent',{version:CONSENT_VERSION,at:new Date().toISOString(),updates:$('#cs-news').checked});
    location.hash='welcome'});
  $('[data-cs-no]').onclick=()=>{AuthService.signOut(); location.hash='top'; demoToast('no account was created.')};
};
// After sign-up: send new members through consent → welcome before the app.
function needsConsent(){return !store.get('consent')}
