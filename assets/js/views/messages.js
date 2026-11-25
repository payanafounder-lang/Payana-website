/* ---------- MESSAGES ----------
   Inbox list + conversation pane. On phones the list fills the screen and a
   chat opens full-screen with a back button. Trip group chats share S.chat
   with the planner, so both stay in sync. */
S.dms.forEach(d=>{if(d.kind==='trip'&&!d.msgs) d.msgs=S.chat});
const wide=()=>matchMedia('(min-width:861px)').matches;
const isMe=w=>w==='me'||w===me().name;
const first=n=>n.split(' ')[0];
const SVG_BACK='<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 5l-7 7 7 7"/></svg>';
const SVG_MORE='<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><circle cx="5" cy="12" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="19" cy="12" r="2"/></svg>';
const SVG_SEND='<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h13M13 6l6 6-6 6"/></svg>';
function dmAv(d,i,cls){return d.kind==='trip'?`<img class="mthumb" src="${src(T(d.trip).img)}" alt="">`:av(d.name,i)}
function msgBadge(){const n=S.dms.reduce((s,d)=>s+(d.unread?1:0),0), b=$('#msgbadge'); if(b){b.textContent=n; b.hidden=!n}}
function rowsHTML(){
  const q=S.msgQ.trim().toLowerCase();
  const rows=S.dms.map((d,i)=>[d,i]).filter(([d])=>(S.msgF==='all'||(S.msgF==='unread'&&d.unread)||(S.msgF==='trip'&&d.kind==='trip')||(S.msgF==='req'&&d.req))&&(!q||d.name.toLowerCase().includes(q)||d.msgs.some(m=>m[1].toLowerCase().includes(q))));
  if(!rows.length) return `<p class="mempty">${q?`No chats match “${esc(S.msgQ)}”.`:'Nothing here right now.'}</p>`;
  return rows.map(([d,i])=>{const l=d.msgs[d.msgs.length-1], day=l[3]||'Today';
    const pre=isMe(l[0])?'You: ':d.kind==='trip'?first(l[0])+': ':'';
    return `<button class="mrow ${d.unread?'unread':''}" data-dm="${i}" aria-current="${i===S.msgSel}">${dmAv(d,i)}
      <div style="min-width:0"><div class="nm"><b>${esc(d.name)}</b>${d.v?'<span class="vf">✓</span>':''}${d.req?'<span class="mtag req">Request</span>':d.kind==='trip'?'<span class="mtag">Trip</span>':''}</div><p>${esc(pre+l[1])}</p></div>
      <div class="r"><time>${day==='Today'?l[2]:day}</time>${d.unread?`<span class="ubadge">${d.unread}</span>`:''}</div></button>`}).join('');
}
function bubbles(d){
  let out='', prevDay=null;
  d.msgs.forEach((m,k)=>{const day=m[3]||'Today', p=d.msgs[k-1], n=d.msgs[k+1];
    if(day!==prevDay){out+=`<div class="mday">${day}</div>`; prevDay=day}
    const same=x=>x&&x[0]===m[0]&&(x[3]||'Today')===day, ct=same(p), cb=same(n), mine=isMe(m[0]);
    out+=`<div class="bb ${mine?'me':''} ${ct?'ct':''} ${cb?'cb':''}">${!mine&&!ct&&d.kind==='trip'?`<span class="n">${esc(m[0])}</span>`:''}<div class="t">${esc(m[1])}</div>${cb?'':`<span class="tm">${m[2]||'now'}</span>`}</div>`});
  return out;
}
function paneHTML(){
  const d=S.dms[S.msgSel]; if(!d) return `<section class="mp"><p class="mempty" style="margin:auto">Pick a chat to start.</p></section>`;
  const t=d.trip&&T(d.trip), grp=d.kind==='trip';
  const menu=grp?[['plan','Open trip plan'],['mute','Mute notifications'],['report','Report a message','danger'],['leave','Leave group chat','danger']]:[['mute','Mute notifications'],['report',`Report ${first(d.name)}`,'danger'],['block',`Block ${first(d.name)}`,'danger']];
  return `<section class="mp" aria-label="Chat with ${esc(d.name)}">
    <header class="mp-h"><button class="ibtn mback" data-mback aria-label="Back to chats">${SVG_BACK}</button>${dmAv(d,S.msgSel)}
      <div class="who"><b>${esc(d.name)}${d.v?'<span class="vf">✓</span>':''}</b><small>${esc(d.sub)}</small></div>
      <details class="mmore"><summary class="ibtn" aria-label="More options">${SVG_MORE}</summary><div class="mmenu">${menu.map(x=>`<button data-mact="${x[0]}" class="${x[2]||''}">${x[1]}</button>`).join('')}</div></details></header>
    ${t?`<a class="mtrip" href="${grp?'#plan':'#trip-'+t.id}" data-plan="${t.id}"><img src="${src(t.img)}" alt=""><div><b>${grp?'Trip plan':'About the trip'} · ${t.name}</b><small>${t.dates} · ${rupee(t.budget)} / person</small></div><span>${grp?'Open plan':'View trip'} →</span></a>`:''}
    <div class="mbody" id="mbody" role="log" aria-live="polite">${IS_DEMO?'<p class="mdemo">Demo chat: sample messages, nothing is sent to anyone</p>':''}${bubbles(d)}</div>
    ${d.req?`<div class="mreq"><p><b>${esc(first(d.name))} isn't your friend yet.</b> Accept to reply. If you ignore this, they won't be told.</p><div><button class="btn btn-primary btn-sm" data-macc>Accept and reply</button><button class="btn btn-line btn-sm" data-mign>Ignore</button><button class="btn btn-line btn-sm" data-mact="report">Report</button></div></div>`
    :`<div class="mc"><form id="dmf"><button type="button" class="ibtn" data-mattach aria-label="Add a photo"><svg class="i"><use href="#i-photo"/></svg></button><textarea id="dmmsg" rows="1" placeholder="Message ${esc(grp?'the group':first(d.name))}" aria-label="Message"></textarea><button class="msend" aria-label="Send" disabled>${SVG_SEND}</button></form>
      <p class="msafe">Keep payments and phone numbers off chat until you've met. <button type="button" data-mact="report">Report a problem</button></p></div>`}
  </section>`;
}
function msgsView(){
  if(wide()&&S.dms[S.msgSel]) S.dms[S.msgSel].unread=0;
  return `<div class="card msgs ${S.msgOpen?'open':''}"><section class="ml" aria-label="Chats"><div class="ml-h"><h1>Messages</h1>
    <label class="msearch"><svg class="i"><use href="#i-search"/></svg><input id="mq" type="search" placeholder="Search chats" value="${esc(S.msgQ)}" aria-label="Search chats"></label>
    <div class="mfil">${[['all','All'],['unread','Unread'],['trip','Trip groups'],['req','Requests']].map(f=>`<button data-mf="${f[0]}" aria-pressed="${S.msgF===f[0]}">${f[1]}</button>`).join('')}</div></div>
    <div class="mrows" id="mrows">${rowsHTML()}</div></section>${paneHTML()}</div>`;
}
function messages(){S.msgOpen=!!S.msgJump; S.msgJump=false; return msgsView()}
bind.messages=()=>{
  const v=$('#view');
  const end=()=>{const b=$('#mbody'); if(b) b.scrollTop=b.scrollHeight};
  const draw=(focus)=>{v.querySelector('.page').innerHTML=msgsView(); msgBadge(); end(); if(focus&&wide()) $('#dmmsg')&&$('#dmmsg').focus()};
  msgBadge(); end();
  v.addEventListener('click',e=>{
    const r=e.target.closest('[data-dm]'); if(r){S.msgSel=+r.dataset.dm; S.msgOpen=true; S.dms[S.msgSel].unread=0; draw(true); return}
    const f=e.target.closest('[data-mf]'); if(f){S.msgF=f.dataset.mf; draw(); return}
    if(e.target.closest('[data-mback]')){S.msgOpen=false; draw(); return}
    const d=S.dms[S.msgSel];
    if(e.target.closest('[data-macc]')){d.req=false; d.sub='Friend · just now'; demoToast(`You and ${first(d.name)} are now friends`); draw(true); return}
    if(e.target.closest('[data-mign]')){S.dms.splice(S.msgSel,1); S.msgSel=0; S.msgOpen=false; demoToast('Request ignored'); draw(); return}
    if(e.target.closest('[data-mattach]')){demoToast('Photo sharing in chat is coming soon'); return}
    const pl=e.target.closest('[data-plan]'); if(pl){S.planTrip=pl.dataset.plan; store.set('planTrip',S.planTrip); return}
    const a=e.target.closest('[data-mact]'); if(a){const k=a.dataset.mact, dt=a.closest('details'); dt&&(dt.open=false);
      if(k==='plan'){S.planTrip=d.trip; store.set('planTrip',d.trip); location.hash='plan'; return}
      if(k==='mute') demoToast(`Muted ${d.kind==='trip'?'the group':first(d.name)}`);
      if(k==='report') openReport({what:'chat',name:d.kind==='trip'?'a message in '+d.name:d.name,block:d.kind!=='trip'});
      if(k==='block'||k==='leave'){demoToast(k==='block'?`${first(d.name)} is blocked and can't message you`:'You left the group chat'); S.dms.splice(S.msgSel,1); S.msgSel=0; S.msgOpen=false; draw()}
      return}
    if(!e.target.closest('details')) $$('.mmore[open]').forEach(x=>x.open=false);
  });
  v.addEventListener('input',e=>{
    if(e.target.id==='mq'){S.msgQ=e.target.value; $('#mrows').innerHTML=rowsHTML()}
    if(e.target.id==='dmmsg'){const t=e.target; t.style.height='46px'; t.style.height=Math.min(t.scrollHeight+2,130)+'px'; $('.msend').disabled=!t.value.trim()}
  });
  v.addEventListener('keydown',e=>{
    if(e.target.id==='dmmsg'&&e.key==='Enter'&&!e.shiftKey&&wide()){e.preventDefault(); $('#dmf').requestSubmit()}
    if(e.key==='Escape'&&S.msgOpen&&!wide()){S.msgOpen=false; draw()}
  });
  v.addEventListener('submit',e=>{if(e.target.id!=='dmf') return; e.preventDefault(); const t=$('#dmmsg').value.trim(); if(!t) return;
    S.dms[S.msgSel].msgs.push(['me',t,new Date().toTimeString().slice(0,5),'Today']); draw(true)});
};
