/* ---------- PILOT FEEDBACK (v1.6, shared) ----------
   A "Feedback" tab on every member screen during the pilot. Short form: ease 1–5,
   topic, comment, screenshot and contact permission. Safety problems go to Report.
   Demo: nothing is sent. Live: send to the team's feedback inbox with the page address. */
(function(){
  const tab=document.createElement('button'); tab.className='fb-tab'; tab.type='button'; tab.textContent='Feedback'; tab.hidden=true;
  document.body.appendChild(tab);
  const sync=()=>{tab.hidden=$('#app').hidden||$('#app').classList.contains('focus')};
  new MutationObserver(sync).observe($('#app'),{attributes:true,attributeFilter:['hidden','class']}); setTimeout(sync,0);
  tab.onclick=()=>openFeedback();
})();
function openFeedback(){
  const page=location.hash||'#top', st={ease:0,topic:''};
  const m=document.createElement('div'); m.className='modal fb-modal'; m.setAttribute('role','dialog'); m.setAttribute('aria-modal','true'); m.setAttribute('aria-labelledby','fb-t');
  m.innerHTML=`<form class="sheet fb-sheet" id="fbf"><div class="sheet-top"><h2 id="fb-t" style="font-size:22px">Help us improve Payana</h2><button type="button" class="x" aria-label="Close">×</button></div>
   <p class="hint">You're one of our first travellers. The founders read every note.</p>
   <fieldset class="rp-opts"><legend>How easy was this page to use?</legend><div class="fb-scale">${[1,2,3,4,5].map(n=>`<button type="button" data-ease="${n}" aria-pressed="false">${n}</button>`).join('')}</div><div class="fb-ends"><span>Very hard</span><span>Very easy</span></div></fieldset>
   <fieldset class="rp-opts"><legend>What's this about?</legend><div class="radios">${['Something\'s broken','Confusing','Idea','Finding people'].map(x=>`<button type="button" class="chip" data-topic="${x}" aria-pressed="false">${x}</button>`).join('')}</div></fieldset>
   <label class="in" for="fb-txt">Tell us more<textarea id="fb-txt"></textarea></label>
   <label class="check" for="fb-shot"><input type="checkbox" id="fb-shot" checked><span>Attach a screenshot of this page</span></label>
   <label class="check" for="fb-ok"><input type="checkbox" id="fb-ok" checked><span>You can contact me about this</span></label>
   <p class="err" id="fberr" hidden></p><button class="btn btn-primary">Send feedback</button>
   <p class="hint" style="text-align:center;font-size:12.5px">Safety problem? Use <button type="button" class="linkbtn" data-fbrep>Report</button> instead so our safety team sees it right away.</p></form>`;
  document.body.appendChild(m);
  const close=()=>{m.remove(); removeEventListener('keydown',k)}, k=e=>{if(e.key==='Escape') close()}; addEventListener('keydown',k);
  m.addEventListener('click',e=>{if(e.target===m||e.target.closest('.x')) return close();
    const ea=e.target.closest('[data-ease]'); if(ea){st.ease=+ea.dataset.ease; m.querySelectorAll('[data-ease]').forEach(b=>b.setAttribute('aria-pressed',b===ea))}
    const tp=e.target.closest('[data-topic]'); if(tp){st.topic=tp.dataset.topic; m.querySelectorAll('[data-topic]').forEach(b=>b.setAttribute('aria-pressed',b===tp))}
    if(e.target.closest('[data-fbrep]')){close(); openReport({what:'person',name:'a safety problem',block:false})}});
  m.addEventListener('submit',e=>{e.preventDefault(); const t=m.querySelector('#fb-txt').value.trim();
    if(!st.ease&&!t){const er=m.querySelector('#fberr'); er.textContent='Pick a number or write a note.'; er.hidden=false; return}
    close(); demoToast(`thanks! Feedback about ${page} was not sent in the demo.`)});
}
