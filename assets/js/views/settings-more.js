/* ---------- SETTINGS SECTIONS ADDED IN v1.5 ----------
   Account & login, notification settings, blocked people, delete account.
   Demo: nothing changes outside this page. */
SET_TABS.unshift(['account','Account & login']);
SET_TABS.push(['notif','Notification settings'],['blocked','Blocked people'],['help','Help & support'],['delete','Delete account']);
const NT_PREFS=[['Join requests and approvals',[1,1,0]],['Trip plan changes and reminders',[1,1,1]],['Messages',[1,0,0]],['Friend requests',[1,0,0]],['Likes and comments',[1,0,0]],['Trip ideas and Payana news',[0,0,0]]];
SET_EXTRA.account=()=>`<div class="card sec"><h2>Account &amp; login</h2><p class="hint">Changing your phone or email needs a code sent to the old one first.</p>
  ${[['Phone','+91 98XXX XXX21 · verified','Change','phone'],['Email',esc(me().name.split(' ')[0].toLowerCase())+'@example.com · verified','Change','email'],['Password','Last changed 2 months ago','Change password','pw'],['Google sign-in','Connected','Disconnect','google'],['Where you\'re logged in','This browser · Laptop, 3 days ago','Log out other devices','devices']].map(([a,b,c,k])=>`<div class="setrow"><span><b>${a}</b><small>${b}</small></span><button class="btn btn-soft btn-sm" data-acct="${k}">${c}</button></div>`).join('')}</div>`;
SET_EXTRA.notif=()=>`<div class="card sec"><h2>Notification settings</h2><p class="hint">Safety alerts and login codes are always sent and can't be turned off.</p>
  <div style="overflow-x:auto"><table class="nt-tbl"><thead><tr><th>Tell me about</th><th>In app</th><th>Email</th><th>SMS</th></tr></thead><tbody>${NT_PREFS.map(([l,v],i)=>`<tr><td>${l}</td>${v.map((on,j)=>`<td><input type="checkbox" ${on?'checked':''} aria-label="${l}: ${['in app','email','SMS'][j]}" data-ntp="${i}-${j}"></td>`).join('')}</tr>`).join('')}</tbody></table></div>
  <label class="setrow" for="quiet"><span><b>Quiet hours</b><small>No alerts 11 pm – 7 am, except on trip days</small></span><span class="toggle"><input type="checkbox" id="quiet" checked></span></label></div>`;
SET_EXTRA.blocked=()=>{const B=S.blocked||[]; return `<div class="card sec"><h2>Blocked people</h2><p class="hint">They can't see your profile, message you or join your trips. They aren't told they're blocked.</p>
  ${B.length?B.map((b,i)=>`<div class="person">${av(b[0].replace('@',''),i+4)}<div><b>${esc(b[0])}</b><small>${esc(b[1])}</small></div><button class="btn btn-soft btn-sm" data-unblk="${i}">Unblock</button></div>`).join(''):'<p class="hint"><i>You haven\'t blocked anyone.</i></p>'}
  <p class="hint">If you unblock someone, you won't be friends again automatically.</p></div>`};
SET_EXTRA.delete=()=>`<div class="card sec del-box"><span class="eyebrow" style="color:var(--bad-fg)">Delete account</span><h2>Are you sure you want to leave?</h2>
  <ul class="tips" style="color:var(--fg)"><li>Your profile, posts, friends and saved items are removed.</li><li>You'll leave the trips you've joined, and the groups are told.</li><li>Reviews you wrote stay, shown as "Former member".</li><li>Safety reports are kept for [period], as our Privacy Notice explains.</li><li>You have <b>30 days</b> to change your mind by logging back in.</li></ul>
  <fieldset class="rp-opts"><legend>Why are you leaving? (optional)</legend>${['I didn\'t find trips that fit me','I had a bad experience','Privacy concerns','Something else'].map((r,i)=>`<label class="rp-opt"><input type="radio" name="delr" value="${i}">${r}</label>`).join('')}</fieldset>
  <label class="in" for="del-in">Type DELETE to confirm<input id="del-in" autocomplete="off"></label>
  <div class="actions"><button class="btn btn-soft" data-dl>Download my data first</button><button class="btn btn-line" data-stab="account">Keep my account</button><button class="btn danger-btn" id="delgo" disabled>Delete account</button></div></div>`;
SET_CLICK.push((e,draw)=>{
  const a=e.target.closest('[data-acct]'); if(a){const k=a.dataset.acct;
    if(k==='pw'){location.hash='reset'; return}
    demoToast({phone:'no code was sent. In the real app we confirm on your old number first.',email:'no code was sent. In the real app we confirm on your old email first.',google:'Google isn\'t connected in the demo.',devices:'other devices logged out (demo, nothing changed).'}[k])}
  const u=e.target.closest('[data-unblk]'); if(u){const b=S.blocked.splice(+u.dataset.unblk,1)[0]; draw(); demoToast(b[0]+' unblocked on this page only.')}
  if(e.target.closest('#delgo')&&!e.target.closest('#delgo').disabled){AuthService.signOut(); store.del('consent'); location.hash='top'; demoToast('no account was deleted. You were logged out of the demo.')}
});
document.addEventListener('input',e=>{if(e.target.id==='del-in') $('#delgo').disabled=e.target.value.trim()!=='DELETE'});
document.addEventListener('change',e=>{if(e.target.dataset&&e.target.dataset.ntp) demoToast('setting changed on this page only')});

/* Help & support inside Settings (team change, 18 Nov): on phones there is no side menu,
   so Help is reached from Profile > Settings > Help & support. */
SET_EXTRA.help=()=>`<div class="card sec"><h2>Help &amp; support</h2>
  <div class="note bad">${I('phone')}<p style="flex:1"><b>Unsafe right now?</b> Call 112 first, then tell us.</p><a class="btn btn-sm danger-btn" href="tel:112">Call 112</a></div>
  ${[['#help','Help centre','Answers about trips, safety, your account and payments','Open'],['#support','Chat with support','Our team replies in the app','Chat'],['#help-share','Emergency contacts: how they work','What your family or friend gets, and when','Read']].map(([h,t,d,b])=>`<div class="setrow"><span><b>${t}</b><small>${d}</small></span><a class="btn btn-soft btn-sm" href="${h}">${b}</a></div>`).join('')}
  <div class="setrow"><span><b>Report a safety problem</b><small>Goes straight to our safety team</small></span><button class="btn btn-soft btn-sm" data-set-report>Report</button></div>
  <div class="setrow"><span><b>About Payana</b><small><a class="linkbtn" href="#legal-rules">Community rules</a> · <a class="linkbtn" href="#legal-privacy">Privacy</a> · <a class="linkbtn" href="#legal-terms">Terms</a></small></span><a class="btn btn-line btn-sm" href="#about">About</a></div></div>`;
SET_CLICK.push(e=>{if(e.target.closest('[data-set-report]')) openReport({what:'person',name:'a safety problem',block:false})});
