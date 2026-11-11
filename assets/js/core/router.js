/* Router: shows the landing page or an app screen based on the #hash in the address.
   Screens register a render function (by name) and an optional bind[name] for event wiring. */
/* ---------- ROUTER ---------- */
const APP=['newtrip','feed','explore','mytrips','friends','messages','communities','profile','create','plan'];
function route(){
  const h=location.hash.slice(1)||'top', base=h.startsWith('trip-')?'trip':h;
  const inApp=APP.includes(base)||base==='trip';
  if(inApp&&!authed()){pending=h; showLanding(); openM('login'); return}
  if(!inApp){showLanding(); return}
  $('#landing').hidden=true; $('#app').hidden=false; document.body.classList.add('in-app');
  const u=me(); $('#mename').textContent=u.name; $('#meav').textContent=u.name.split(' ').map(x=>x[0]).join('').slice(0,2).toUpperCase();
  $$('[data-nav]').forEach(a=>a.classList.toggle('on',a.dataset.nav===base||(base==='trip'&&a.dataset.nav==='explore')||((base==='plan'||base==='newtrip')&&a.dataset.nav==='mytrips')));
  const old=$('#view'), v=old.cloneNode(false); old.replaceWith(v);
  const R={newtrip,feed,explore,mytrips,friends,messages,communities,profile,create,plan,trip:()=>trip(h.slice(5))};
  v.innerHTML=`<div class="page">${R[base]()}</div>`; bind[base]&&bind[base](h.slice(5));
  scrollTo({top:0,behavior:'instant'});
}
function showLanding(){$('#app').hidden=true; $('#landing').hidden=false; document.body.classList.remove('in-app');
  $('#navcta').innerHTML=authed()?`<a class="btn btn-primary" href="#feed">Open Payana</a>`:`<button class="btn btn-glass login" data-open="login">Log in</button><button class="btn btn-primary" data-open="signup">Sign up free</button>`;
  $$('#navcta [data-open]').forEach(b=>b.addEventListener('click',()=>openM(b.dataset.open)));
}
addEventListener('hashchange',route);
const bind={};
