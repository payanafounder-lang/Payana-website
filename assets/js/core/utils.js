/* Shared helpers used by every screen: DOM lookup, HTML escaping, icons,
   image paths, rupee formatting, avatars and the toast message. */
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const I=(n,st='')=>`<svg class="i" ${st}><use href="#i-${n}"/></svg>`;
// Image reference → URL. Numbers/names map to img/<name>.webp; data: and blob: URLs (user uploads) pass through.
const src=x=>/^(data|blob):/.test(String(x))?x:`img/${x}.webp`;
const rupee=n=>'₹'+n.toLocaleString('en-IN');
const COL=['#F2C14E','#CFE3DC','#F3B49A','#E8D7C3','#BFD8F2','#D9C8F0'];
const av=(n,i=0,size)=>`<span class="av" style="background:${COL[i%COL.length]}${size?`;width:${size}px;height:${size}px`:''}">${esc(n.split(' ').map(x=>x[0]).join('').slice(0,2))}</span>`;
function toast(t){const e=$('#toast'); e.textContent=t; e.hidden=false; clearTimeout(toast.t); toast.t=setTimeout(()=>e.hidden=true,2800)}
// Use for any action that is only simulated in the demo (nothing is sent, saved to a server, or charged).
function demoToast(t){toast(IS_DEMO?'Demo: '+t:t)}
