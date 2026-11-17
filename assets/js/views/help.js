/* ---------- HELP & SUPPORT (public, v1.4) ----------
   #help. Anyone can open it. Demo: search filters the sample questions only. */
const HELP_TOPICS=[['start','compass','Getting started','Sign up, profile, matching'],['trips','map','Trips & requests','Join, host, cancel'],['safety','shield','Safety','Meeting tips, reporting'],['account','lock','Account & privacy','Login, data, delete'],['verify','check','Verification','Badges and checks']];
const HELP_Q=[['costs','trips','How do we split costs on a trip?'],['noreply','trips','The host hasn\'t replied to my request. What now?'],['cancel','trips','Someone in my group cancelled last minute'],['share','safety','How do I share my trip with family?'],['message','start','Why can\'t I message someone?'],['code','account','I didn\'t get my login code'],['badge','verify','What does the verified badge mean?'],['review','safety','Someone left an unfair review about me']];
function help(a){if(a&&typeof helpArticle==='function') return helpArticle(a);
  return `<section class="hp-hero"><h1>How can we help?</h1><label class="hp-search">${I('search')}<span class="sr-only">Search help</span><input id="hp-q" type="search" placeholder='Try "cancel a trip" or "verify"' autocomplete="off"></label></section>
   <div class="note bad">${I('phone')}<p style="flex:1"><b>Unsafe right now?</b> Call 112 first. Then tell us, and our safety team will follow up.</p><button class="btn btn-sm danger-btn" data-hp-report>Report a safety issue</button></div>
   <section><h2 class="ab-h" style="font-size:22px">Browse by topic</h2><div class="hp-topics">${HELP_TOPICS.map(([k,ic,t,s])=>`<button class="card hp-topic" data-hptopic="${k}" aria-pressed="${S.hpTopic===k}"><span class="vf-ic accent">${I(ic)}</span><b>${t}</b><small>${s}</small></button>`).join('')}</div></section>
   <div class="hp-grid"><section class="card sec"><h2 style="font-size:20px" id="hp-title">Popular questions</h2><div id="hp-list">${helpList('')}</div></section>
    <aside style="display:grid;gap:16px;align-content:start"><section class="card sec"><h2 style="font-size:20px">Still stuck?</h2><p class="hint">Our team is here [9 am – 9 pm, every day].</p>
      <button class="btn btn-primary" data-hp-chat>Chat with support</button><button class="btn btn-soft" data-hp-call>Request a call back</button><a class="btn btn-line" href="#about-contact">Email us</a></section></aside></div>`;
}
function helpList(q){const L=HELP_Q.filter(([,t,x])=>(!S.hpTopic||t===S.hpTopic)&&(!q||x.toLowerCase().includes(q)));
  return L.length?L.map(([id,,x])=>`<a class="hp-q" href="#help-${id}">${x}</a>`).join(''):`<div class="empty" style="padding:24px">No answers for "${esc(q)}". Try other words, or chat with support.</div>`}
bind.help=()=>{const root=$('#pview');
  $('#hp-q').addEventListener('input',e=>{$('#hp-list').innerHTML=helpList(e.target.value.trim().toLowerCase()); $('#hp-title').textContent=e.target.value.trim()?'Results':'Popular questions'});
  root.addEventListener('click',e=>{
    const tp=e.target.closest('[data-hptopic]'); if(tp){S.hpTopic=S.hpTopic===tp.dataset.hptopic?null:tp.dataset.hptopic; $$('[data-hptopic]').forEach(b=>b.setAttribute('aria-pressed',b.dataset.hptopic===S.hpTopic)); $('#hp-list').innerHTML=helpList($('#hp-q').value.trim().toLowerCase())}
    if(e.target.closest('[data-hp-report]')) openReport({what:'person',name:'a safety issue',block:false});
    if(e.target.closest('[data-hp-chat]')){if(typeof support==='function'){if(authed()) location.hash='support'; else {pending='support'; openM('login')}} else demoToast('support chat comes in version 1.5. Use Email us for now.')}
    if(e.target.closest('[data-hp-call]')) demoToast('no call was booked. In the real app the team calls you back.');
  });
};
