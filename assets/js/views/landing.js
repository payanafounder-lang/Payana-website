/* ---------- LANDING ---------- */
$('#landtrips').innerHTML=TRIPS.slice(0,3).map(t=>tripCard(t,false)).join('');
const slides=$$('.slide'), bars=$('#bars'); let cur=0, timer;
slides.forEach((s,i)=>{const b=document.createElement('button'); b.setAttribute('aria-label','Show photo '+(i+1)); b.innerHTML='<i></i>'; b.onclick=()=>go(i); bars.appendChild(b)});
function go(i){slides[cur].classList.remove('on'); bars.children[cur].classList.remove('on'); cur=i; slides[cur].classList.add('on'); const b=bars.children[cur]; void b.offsetWidth; b.classList.add('on'); $('#slide-cap').textContent=slides[cur].dataset.place+' · '+slides[cur].dataset.who; clearTimeout(timer); if(!reduce) timer=setTimeout(()=>go((cur+1)%slides.length),6000)}
go(0);
$('#ticker').innerHTML+=$('#ticker').innerHTML;
addEventListener('scroll',()=>$('#nav').classList.toggle('solid',scrollY>innerHeight*.6),{passive:true});
$('#search').addEventListener('submit',e=>{e.preventDefault(); const d=$('#q-dest').value.trim().toLowerCase(); const t=TRIPS.find(t=>d&&t.id.startsWith(d.slice(0,4))); pending=t?'trip-'+t.id:'explore'; if(authed()) location.hash=pending; else openM('signup')});
document.addEventListener('click',e=>{const j=e.target.closest('[data-trip]'); if(j){pending='trip-'+j.dataset.trip; if(authed()) location.hash=pending; else openM('signup')}});
