/* ---------- SUPPORT CHAT (v1.5) ----------
   #support. Demo: the "agent" replies are canned and nothing reaches the team.
   Live: a support inbox / ticketing tool; safety topics route to the safety team. */
function supState(){if(!S.sup) S.sup={msgs:[['agent','Hi! I\'m [Agent name] from Payana. What can I help you with today?','now']],ticket:'S-'+(2300+Math.floor(Math.random()*90))}; return S.sup}
function support(){const st=supState();
  return `<div class="sup card"><div class="mp-h"><a class="ibtn" href="#help" aria-label="Back to help">←</a><svg width="40" height="40" aria-hidden="true"><use href="#mark"/></svg><div class="who"><b>Payana Support</b><small style="color:var(--ok-fg)">● Online · replies in [a few minutes]</small></div><button class="btn btn-soft btn-sm" data-sup-call>Call me back</button></div>
   <div class="mbody" id="supbody"><span class="mday">Ticket #${st.ticket}</span>${supMsgs()}</div>
   <div class="mc"><div class="radios" id="supquick" style="margin-bottom:8px">${st.msgs.length<2?['Change my phone number','Problem with a trip','Report a safety issue','Something else'].map(q=>`<button class="chip" data-supq="${q}">${q}</button>`).join(''):''}</div>
    <form id="supf"><textarea id="sup-in" rows="1" placeholder="Type your message…" aria-label="Message support"></textarea><button class="msend" aria-label="Send">${I('send')}</button></form>
    <p class="msafe">We'll never ask for your password or login code in chat.</p></div></div>`;
}
function supMsgs(){return S.sup.msgs.map(m=>`<div class="bb ${m[0]==='me'?'me':''}">${m[0]==='me'?'':'<span class="n">Payana Support</span>'}<div class="t ${m[0]==='warn'?'warn':''}">${esc(m[1])}</div><span class="tm">${m[2]}</span></div>`).join('')}
function supReply(t){
  if(/safety|unsafe|harass|danger/i.test(t)) return [['agent','I\'m sorry. If you\'re in danger right now, call 112 first. I\'m moving this to our safety team, who will reply here.'],['warn','Safety reports go straight to the safety team.']];
  if(/phone|number|sim/i.test(t)) return [['agent','Sure. For your safety we\'ll send a code to your email first, then to the new number. You can also do it yourself in Settings → Account & login.'],['warn','Reminder: we\'ll never ask for your password or the code itself in chat.']];
  return [['agent','Thanks, got it. A member of the team will reply here shortly.']];
}
bind.support=()=>{supState(); const body=$('#supbody'), send=t=>{t=t.trim(); if(!t) return; S.sup.msgs.push(['me',t,'now']); $('#supquick').innerHTML=''; body.innerHTML=`<span class="mday">Ticket #${S.sup.ticket}</span>`+supMsgs(); body.scrollTop=body.scrollHeight;
    setTimeout(()=>{supReply(t).forEach(([w,x])=>S.sup.msgs.push([w,x,'now'])); body.innerHTML=`<span class="mday">Ticket #${S.sup.ticket}</span>`+supMsgs()+'<p class="mdemo">Demo: automatic sample reply. Nothing was sent to the team.</p>'; body.scrollTop=body.scrollHeight},600)};
  $('#supf').addEventListener('submit',e=>{e.preventDefault(); send($('#sup-in').value); $('#sup-in').value=''});
  $('#sup-in').addEventListener('keydown',e=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault(); $('#supf').requestSubmit()}});
  $('#view').addEventListener('click',e=>{const q=e.target.closest('[data-supq]'); if(q) send(q.dataset.supq); if(e.target.closest('[data-sup-call]')) demoToast('no call was booked. In the real app the team calls you back.')});
};
