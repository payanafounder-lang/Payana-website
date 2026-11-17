/* ---------- REPORT & BLOCK SHEET (v1.3, shared) ----------
   openReport({what:'person'|'trip'|'post'|'review'|'chat', name:'Vikram P.', block:true, onSent:fn})
   Demo: nothing is sent; blocking is remembered on this page only.
   Live: POST /reports (goes to the admin Safety reports queue) and POST /blocks. */
const REPORT_REASONS={
  person:['Harassment or unwanted messages','Sexual content or pressure','Fake profile or pretending to be someone','Scam or asking for money','Hate or threats','Unsafe behaviour on a trip','Something else'],
  trip:['Misleading costs or details','Looks like a paid tour or scam','Unsafe plan','Hate or discrimination','Something else'],
  post:['Spam or advertising','Hate or harassment','Nudity or sexual content','Shares someone\'s private details','Something else'],
  review:['False: we didn\'t travel together, or it didn\'t happen','Abusive or hateful language','Shares personal details (phone, address)','Something else'],
  chat:['Harassment or unwanted messages','Sexual content or pressure','Scam or asking for money','Hate or threats','Something else']};
function openReport(o){
  const what=o.what||'person', reasons=REPORT_REASONS[what], first=(o.name||'').split(' ')[0];
  const canBlock=o.block!==false&&(what==='person'||what==='chat');
  const m=document.createElement('div'); m.className='modal'; m.setAttribute('role','dialog'); m.setAttribute('aria-modal','true'); m.setAttribute('aria-labelledby','rp-t');
  const form=()=>`<form class="sheet rp-sheet" id="rpf"><div class="sheet-top"><h2 id="rp-t" style="font-size:24px">Report ${esc(o.name||'this '+what)}</h2><button type="button" class="x" aria-label="Close">×</button></div>
    <p class="hint">${what==='review'?'Our team checks whether the review breaks the rules. It stays visible while we check.':'They won\'t know who reported them. Our safety team reviews every report.'}</p>
    <div class="note bad">${I('phone')}<p><b>In danger right now?</b> Call 112 first.</p><a class="linkbtn" href="tel:112" style="color:inherit;margin-left:auto">Call 112</a></div>
    <fieldset class="rp-opts"><legend>What's wrong?</legend>${reasons.map((r,i)=>`<label class="rp-opt"><input type="radio" name="rp" value="${i}">${r}</label>`).join('')}</fieldset>
    <label class="in" for="rp-more">Tell us more (optional)<textarea id="rp-more"></textarea></label>
    ${what==='chat'?'<p class="hint">The last 20 messages in this chat are attached so our team can check.</p>':''}
    ${canBlock?`<label class="check" for="rp-block"><input type="checkbox" id="rp-block" checked><span><b style="color:var(--fg)">Also block ${esc(first)}</b><br>They can't message you, see your profile or join your trips.</span></label>`:''}
    <p class="err" id="rperr" hidden></p><div class="actions"><button type="button" class="btn btn-line" data-x>Cancel</button><button class="btn btn-primary">Send report</button></div></form>`;
  const done=blocked=>`<div class="sheet rp-sheet" style="text-align:center"><span class="big-ok">${I('shield')}</span><h2 style="font-size:24px">Thanks for telling us</h2>
    <p class="hint">${blocked?esc(first)+' is blocked. ':''}We'll review your report within [24 hours] and let you know in Notifications.</p>
    <p class="hint"><b>Demo:</b> no report was sent${blocked?' and the block is on this page only':''}.</p>
    <div style="display:grid;gap:8px">${what==='chat'||what==='person'?'<a class="btn btn-soft" href="#mytrips" data-x>Leave a trip group</a>':''}<button class="btn btn-soft" data-x data-help>Talk to Payana support</button><button class="btn btn-line" data-x>Done</button></div></div>`;
  m.innerHTML=form(); document.body.appendChild(m);
  const close=()=>{m.remove(); removeEventListener('keydown',k)}, k=e=>{if(e.key==='Escape') close()};
  addEventListener('keydown',k);
  m.addEventListener('click',e=>{if(e.target===m||e.target.closest('.x')||e.target.closest('[data-x]')){if(e.target.closest('[data-help]')) location.hash=typeof support==='function'?'support':'about-contact'; close()}});
  m.addEventListener('submit',e=>{e.preventDefault(); const r=m.querySelector('input[name=rp]:checked');
    if(!r){const er=m.querySelector('#rperr'); er.textContent='Pick what\'s wrong so the right team sees it.'; er.hidden=false; return}
    const blocked=canBlock&&m.querySelector('#rp-block').checked; if(blocked){S.blocked=S.blocked||[]; if(!S.blocked.some(b=>b[0]===o.name)) S.blocked.unshift([o.name,'Blocked just now · also reported'])}
    m.innerHTML=done(blocked); o.onSent&&o.onSent(blocked)});
  m.querySelector('input[name=rp]').focus();
}
