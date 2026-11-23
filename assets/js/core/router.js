/* Router: shows the landing page, a public page or an app screen based on the #hash in the address.
   Screens register a render function (by name) and an optional bind[name] for event wiring.
   Address forms: #feed (screen), #trip-coorg (screen + argument after the first "-"). */
/* ---------- ROUTER ---------- */
// App screens: need a (demo) session, otherwise the log-in sheet opens.
const APP=['newtrip','feed','explore','mytrips','messages','communities','profile','create','plan','settings','editprofile','notifications','admin',
  'consent','welcome','verify','review','manage','community','post','person','notfound','search','support','appeal','tripday'];
// Screens that take an argument after the first "-", e.g. #trip-coorg, #legal-privacy.
const PREFIXED=['trip','legal','about','review','manage','community','post','u','t','help','tripday'];
// Short address names → screen names (#u-rohit-s → person, #t-coorg → sharedTrip).
const ALIAS={u:'person',t:'sharedTrip'};
// Public pages: anyone can open them, signed in or not (rules, about, password reset).
const PUBLIC=['legal','about','reset','sharedTrip','help','paused'];
// App screens shown full width without the member menu (admin has its own menu).
const FOCUS=['admin','consent','welcome'];
function splitHash(h){const i=h.indexOf('-'); return i>0&&PREFIXED.includes(h.slice(0,i))?[h.slice(0,i),h.slice(i+1)]:[h,'']}
function screens(){return {newtrip,feed,explore,mytrips,messages,communities,profile,create,plan,settings,editprofile,notifications,admin,trip,legal,about,reset,
  consent,welcome,verify,review,manage,community,post,person,sharedTrip,help,paused,notfound,search,support,appeal,tripday}}
function route(){
  const h=location.hash.slice(1)||'top', [raw,arg]=splitHash(h); let base=ALIAS[raw]||raw;
  // Team change (18 Nov): no separate Friends page. Old #friends links open the friends list on the profile.
  if(base==='friends'){S.openFriends=true; location.replace('#profile'); return}
  if(base==='saved'){S.profTab='saved'; location.replace('#profile'); return}
  if(PUBLIC.includes(base)){showPublic(base,arg); return}
  const inApp=APP.includes(base)||base==='trip';
  if(inApp&&!authed()){pending=h; showLanding(); openM('login'); return}
  if(!inApp){const el=document.getElementById(h); if(authed()&&h!=='top'&&!(el&&el.closest('#landing'))) base='notfound'; else {showLanding(); return}}
  $('#landing').hidden=true; $('#public').hidden=true; $('#app').hidden=false; document.body.classList.add('in-app');
  $('#app').classList.toggle('focus',FOCUS.includes(base));
  const u=me(); $('#mename').textContent=u.name; const ma=$('#meav'); if(u.photo) ma.innerHTML=`<img src="${u.photo}" alt="">`; else ma.textContent=u.name.split(' ').map(x=>x[0]).join('').slice(0,2).toUpperCase();
  $$('[data-nav]').forEach(a=>a.classList.toggle('on',a.dataset.nav===base||((base==='trip'||base==='communities'||base==='community')&&a.dataset.nav==='explore')||((base==='plan'||base==='newtrip')&&a.dataset.nav==='mytrips')||((base==='settings'||base==='editprofile')&&a.dataset.nav==='profile')));
  const old=$('#view'), v=old.cloneNode(false); old.replaceWith(v);
  v.innerHTML=`<div class="page">${screens()[base](arg)}</div>`; bind[base]&&bind[base](arg);
  updateBadges();
  scrollTo({top:0,behavior:'instant'});
}
function showPublic(base,arg){
  $('#landing').hidden=true; $('#app').hidden=true; $('#public').hidden=false; document.body.classList.remove('in-app');
  $('#pubcta').innerHTML=authed()?`<a class="btn btn-primary btn-sm" href="#feed">Open Payana</a>`:`<button class="btn btn-line btn-sm" data-open="login">Log in</button><button class="btn btn-primary btn-sm" data-open="signup">Sign up free</button>`;
  $$('#pubcta [data-open]').forEach(b=>b.addEventListener('click',()=>openM(b.dataset.open)));
  const old=$('#pview'), v=old.cloneNode(false); old.replaceWith(v);
  v.innerHTML=screens()[base](arg); bind[base]&&bind[base](arg);
  scrollTo({top:0,behavior:'instant'});
}
function showLanding(){$('#app').hidden=true; $('#public').hidden=true; $('#landing').hidden=false; document.body.classList.remove('in-app');
  $('#navcta').innerHTML=authed()?`<a class="btn btn-primary" href="#feed">Open Payana</a>`:`<button class="btn btn-glass login" data-open="login">Log in</button><button class="btn btn-primary" data-open="signup">Sign up free</button>`;
  $$('#navcta [data-open]').forEach(b=>b.addEventListener('click',()=>openM(b.dataset.open)));
  const h=location.hash.slice(1); if(h&&h!=='top'){const el=document.getElementById(h); el&&el.closest('#landing')&&setTimeout(()=>el.scrollIntoView(),0)}
}
// Counters in the member menu (unread notifications, etc.)
function updateBadges(){const n=S.notifs.filter(x=>!x.read).length, b=$('#ntbadge'); if(b){b.textContent=n; b.hidden=!n}}
// Close any open sheet (report, friends list, feedback...) when the page changes, e.g. with the Back button.
addEventListener('hashchange',()=>document.querySelectorAll('.modal:not(#modal)').forEach(m=>m.remove()));
addEventListener('hashchange',route);
const bind={};
