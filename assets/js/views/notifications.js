/* ---------- NOTIFICATIONS (v1.2) ----------
   Includes the "become the host" request (team follow-up, 17 Nov): when a host hands a
   trip over, the chosen member must accept within 24 hours. */
const NT_FILTERS=[['all','All'],['trips','Trips'],['friends','Friends'],['posts','Posts'],['safety','Safety']];
const NT_GROUP={join:'trips',host:'trips',reminder:'trips',approved:'trips',plan:'trips',friend:'friends',likes:'posts',safety:'safety'};
function notifications(){
  if(!S.ntF) S.ntF='all';
  return `<div class="nt-page"><div class="ph"><div><h1>Notifications</h1><p>Requests, trip updates and safety messages</p></div><button class="btn btn-line btn-sm" data-ntall>Mark all as read</button></div>
   <div class="radios" role="group" aria-label="Filter">${NT_FILTERS.map(([k,l])=>`<button class="chip" data-ntf="${k}" aria-pressed="${S.ntF===k}">${l}</button>`).join('')}</div>
   <div id="ntlist">${ntList()}</div></div>`;
}
function ntList(){
  const L=S.notifs.filter(n=>S.ntF==='all'||NT_GROUP[n.type]===S.ntF);
  if(!L.length) return `<div class="card empty">Nothing here yet. Trip requests and updates will show up here.</div>`;
  const neu=L.filter(n=>!n.read), old=L.filter(n=>n.read);
  return (neu.length?`<h2 class="nt-h">New</h2><div class="nt-col">${neu.map(ntItem).join('')}</div>`:'')+(old.length?`<h2 class="nt-h">Earlier</h2><div class="nt-col">${old.map(ntItem).join('')}</div>`:'');
}
function ntItem(n){
  const t=n.trip&&T(n.trip), tn=t?`<b>${esc(t.name)}</b>`:'', ic={reminder:'clock',safety:'shield',host:'star'}[n.type];
  const lead=ic?`<span class="nt-ic ${n.type}">${I(ic)}</span>`:av(n.who||'P',n.id);
  let body='', acts='';
  if(n.type==='host'){body=`<b>${esc(n.who)}</b> ${n.text} ${tn}.`;
    acts=n.done?`<span class="pill ${n.done==='accepted'?'p-ok':'p-mut'}">${n.done==='accepted'?'You\'re now the host':'Declined'}</span>`:`<p class="nt-more">As host you approve requests, manage the plan and are the main contact. ${t?t.people.length:4} people are going. Reply within 24 hours, or ${esc(n.who.split(' ')[0])} can cancel the trip.</p><div class="btns"><button class="btn btn-primary btn-sm" data-ntact="accept" data-id="${n.id}">Accept and become host</button><a class="btn btn-soft btn-sm" href="#trip-${n.trip}">View trip</a><button class="btn btn-line btn-sm" data-ntact="decline" data-id="${n.id}">Decline</button></div>`}
  else if(n.type==='join'){body=`<b>${esc(n.who)}</b> ${n.text} ${tn}.`;
    acts=n.done?`<span class="pill ${n.done==='approved'?'p-ok':'p-mut'}">${n.done==='approved'?'Approved':'Declined'}</span>`:`<div class="btns"><button class="btn btn-primary btn-sm" data-ntact="approve" data-id="${n.id}">Approve</button><button class="btn btn-line btn-sm" data-ntact="decline" data-id="${n.id}">Decline</button></div>`}
  else if(n.type==='friend'){body=`<b>${esc(n.who)}</b> ${n.text}`;
    acts=n.done?`<span class="pill ${n.done==='accepted'?'p-ok':'p-mut'}">${n.done==='accepted'?'Friends now':'Declined'}</span>`:`<div class="btns"><button class="btn btn-primary btn-sm" data-ntact="accept" data-id="${n.id}">Accept</button><button class="btn btn-line btn-sm" data-ntact="decline" data-id="${n.id}">Decline</button></div>`}
  else if(n.type==='reminder'){body=`Your ${tn} trip ${n.text}`; acts=`<div class="btns"><button class="btn btn-soft btn-sm" data-ntact="share" data-id="${n.id}">Share itinerary</button><a class="btn btn-line btn-sm" href="#trip-${n.trip}">Open trip</a></div>`}
  else if(n.type==='approved'||n.type==='plan') body=`<b>${esc(n.who)}</b> ${n.text} ${tn}.`;
  else if(n.type==='likes') body=`<b>${esc(n.who)}</b> ${n.text}`;
  else body=n.text;
  return `<div class="nt-item ${n.read?'':'new'}">${lead}<div class="nt-txt"><p>${body}</p>${n.quote?`<p class="nt-q">"${esc(n.quote)}"</p>`:''}<small>${n.time}</small>${acts}</div></div>`;
}
bind.notifications=()=>{
  const draw=()=>{$('#ntlist').innerHTML=ntList(); updateBadges()};
  $('#view').addEventListener('click',e=>{
    const f=e.target.closest('[data-ntf]'); if(f){S.ntF=f.dataset.ntf; $$('[data-ntf]').forEach(x=>x.setAttribute('aria-pressed',x===f)); draw(); return}
    if(e.target.closest('[data-ntall]')){S.notifs.forEach(n=>n.read=true); draw(); return}
    const a=e.target.closest('[data-ntact]'); if(!a) return; const n=S.notifs.find(x=>x.id===+a.dataset.id), k=a.dataset.ntact; n.read=true;
    if(k==='share'){demoToast('nothing was sent. In the real app your trusted contact gets the plan and group list.'); draw(); return}
    if(n.type==='host'){n.done=k==='accept'?'accepted':'declined'; if(k==='accept'){S.joined[n.trip]='hosting'; store.set('joined',S.joined)} demoToast(k==='accept'?`you're now the host of ${T(n.trip).name} (this page only). ${n.who} was told.`:`declined. ${n.who} can pick someone else or cancel.`)}
    else if(n.type==='join'){n.done=k==='approve'?'approved':'declined'; demoToast(k==='approve'?`${n.who} approved (sample request, this page only)`:'sample request declined')}
    else if(n.type==='friend'){n.done=k==='accept'?'accepted':'declined'; if(k==='accept') S.friends.unshift([n.who,'New friend']); demoToast(k==='accept'?`you and ${n.who} are now friends (this page only)`:'request declined')}
    draw();
  });
};
