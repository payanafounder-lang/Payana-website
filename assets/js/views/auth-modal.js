/* ---------- AUTH MODAL (sign up / log in sheet) ----------
   UI only. Session handling lives in services/auth.js. */
let mode='signup', pending=null, lastFocus;
function setMode(m){mode=m; const su=m==='signup'; $('#t-signup').setAttribute('aria-selected',su); $('#t-login').setAttribute('aria-selected',!su); $('#name-wrap').hidden=!su; $('#age-wrap').hidden=!su; $('#forgot').hidden=su; $('#submit').textContent=su?'Create account':'Log in'; $('#err').hidden=true}
function openM(m){lastFocus=document.activeElement; setMode(m); $('#modal').hidden=false; $('#google').focus()}
function closeM(){$('#modal').hidden=true; lastFocus&&lastFocus.focus&&lastFocus.focus()}
$$('[data-open]').forEach(b=>b.addEventListener('click',()=>openM(b.dataset.open)));
$('#t-signup').onclick=()=>setMode('signup'); $('#t-login').onclick=()=>setMode('login');
$('#close').onclick=closeM; $('#modal').addEventListener('click',e=>{if(e.target.id==='modal')closeM()});
addEventListener('keydown',e=>{if(e.key==='Escape'&&!$('#modal').hidden)closeM()});
function signIn(name){const u=AuthService.startDemoSession(name); $('#modal').hidden=true; const to=pending||'feed'; pending=null; if(location.hash==='#'+to) route(); else location.hash=to; demoToast(mode==='signup'?`Welcome to Payana, ${u.name.split(' ')[0]}! No real account was created.`:'Logged in. No real account was checked.')}
// Demo: Google sign-in is not connected; this only starts a demo session.
$('#google').onclick=()=>signIn($('#f-name').value.trim()||'Traveller');
$('#forgot').onclick=()=>{const e=$('#err'); e.hidden=false; e.textContent='We\'ll send a reset link to your phone or email once accounts open.'};
$('#form').addEventListener('submit',e=>{e.preventDefault();
  const id=$('#f-id').value.trim(), pw=$('#f-pw').value, name=$('#f-name').value.trim(); let msg='';
  if(mode==='signup'&&!name) msg='Add your full name so travellers know who they\'re meeting.';
  else if(!/^\S+@\S+\.\S+$/.test(id)&&!/^\+?\d[\d\s]{8,}$/.test(id)) msg='Enter a valid email address or a 10-digit phone number.';
  else if(pw.length<8) msg='Use a password with at least 8 characters.';
  else if(mode==='signup'&&!$('#f-age').checked) msg='Payana is for travellers 18 and over. Tick the box to confirm.';
  if(msg){$('#err').textContent=msg; $('#err').hidden=false; return}
  signIn(mode==='signup'?name:(id.includes('@')?id.split('@')[0].replace(/[._]/g,' ').replace(/\b\w/g,c=>c.toUpperCase()):'Traveller'));
});
document.addEventListener('click',e=>{if(e.target.closest('[data-logout]')){AuthService.signOut(); location.hash='top'; toast('Logged out'); route()}});
