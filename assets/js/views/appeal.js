/* ---------- APPEAL A PAUSED ACCOUNT (v1.5) ----------
   #appeal. A different person from the one who made the first decision reviews it.
   Demo: sample reason; nothing is sent. */
function appeal(){
  if(S.appealSent) return `<div class="ap-grid"><div class="card sec"><span class="big-ok">${I('check')}</span><h1 style="text-align:center">Appeal received</h1><p class="hint" style="text-align:center">We'd email you a confirmation and a decision within [3 working days]. <b>Demo:</b> nothing was sent.</p><a class="btn btn-primary" href="#feed" style="justify-self:center">Back to Payana</a></div>${apTimeline(1)}</div>`;
  return `<div class="ap-grid"><form class="card sec" id="apf"><h1>Appeal the pause on your account</h1><p class="hint">A different person from the one who made the first decision will review your appeal.</p>
    <div class="note bad"><p><b>Why it was paused</b><br>Reported for repeated unwanted messages in a trip chat (Community Rules, rule 1). Paused on [date]. <b>Demo:</b> sample reason.</p></div>
    <label class="in" for="ap-txt">Tell us what happened from your side<textarea id="ap-txt" placeholder="Explain in your own words. Include anything you think we missed."></textarea></label>
    <label class="in" for="ap-file">Add screenshots (optional)<input type="file" id="ap-file" accept="image/*" multiple></label>
    <label class="check" for="ap-ok"><input type="checkbox" id="ap-ok"><span>I confirm what I've written is true. I understand false appeals can lead to permanent removal.</span></label><p class="err" id="aperr" hidden></p>
    <div class="actions" style="justify-content:space-between"><a class="linkbtn" href="#legal-rules">Read the Community Rules</a><button class="btn btn-primary">Send appeal</button></div></form>${apTimeline(0)}</div>`;
}
function apTimeline(n){return `<aside class="card sec"><h2 style="font-size:19px">What happens next</h2><ol class="ap-tl">${[['Appeal received','You\'ll get an email confirmation'],['Review','Usually within [3 working days]'],['Decision','Account restored, or the pause stays with a reason']].map(([a,b],i)=>`<li class="${i<n?'done':i===n?'on':''}"><b>${a}</b><small>${b}</small></li>`).join('')}</ol>
  <p class="hint">Still not satisfied? Write to our Grievance Officer at [grievance@withpayana.com].</p></aside>`}
bind.appeal=()=>{const f=$('#apf'); f&&f.addEventListener('submit',e=>{e.preventDefault(); const er=$('#aperr');
  if($('#ap-txt').value.trim().length<20){er.textContent='Tell us a bit more (at least a couple of sentences).'; er.hidden=false; return}
  if(!$('#ap-ok').checked){er.textContent='Tick the box to confirm.'; er.hidden=false; return}
  S.appealSent=true; route()})};
