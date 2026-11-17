/* ---------- ABOUT, FAQ & CONTACT (public, v1.2) ----------
   [Square brackets] are placeholders the team fills in before launch. */
const FAQ=[
  ['Is Payana free?','Yes, joining and planning trips is free while we pilot in Bengaluru. You pay your own trip costs directly. Payana does not take payments yet.'],
  ['Does Payana organise the trips?','No. Trips are created and run by travellers. We provide the tools to find people, plan and stay in touch.'],
  ['How do you check who people are?','You can verify your phone, email, a selfie and a government ID through DigiLocker. A badge means that check was done. It is not a background check, so always meet in a public place first.'],
  ['Who can join my trip?','Only people you approve. You see their profile, reviews from past travel mates and their message before you decide.'],
  ['Can I hide where I am?','Yes. Your exact location is never shown, and you can hide post locations until you\'re back home.'],
  ['How do I delete my account?','Go to Settings, then Privacy, then Delete account. You can download your data first.'],
  ['What if something goes wrong on a trip?','Call 112 in an emergency. Then report it in the app and our safety team will follow up.']
];
function about(){
  return `<section class="ab-hero"><img src="${src(6086)}" alt=""><div class="ab-glass"><span class="eyebrow" style="color:var(--sun)">About Payana</span><h1>Trips are better with the right people.</h1><p>Payana means "journey". We help you find people with the same dates, budget and pace, then plan the trip together in one place.</p></div></section>
   <section class="ab-two"><div><h2>Why we started</h2><p>[Your story in two or three lines: for example, the weekend trip that never happened because friends were busy, and the idea that came from it.]</p><p>We're starting small, in Bengaluru, with weekend trips to places like Coorg, Mysuru and Chikkamagaluru. We'll grow when travellers tell us it's working.</p></div>
    <div class="card sec"><h3>The team</h3>${['F1','F2','F3'].map((x,i)=>`<div class="person">${av(x,i)}<div><b>[Founder name]</b><small>[Role]</small></div></div>`).join('')}</div></section>
   <section><h2 class="ab-h">What we believe</h2><div class="cgrid3">${[['Safety before growth','Friends need both people to agree. Every trip needs the host\'s approval. Report and block are always one tap away.'],['Real trips, not likes','We measure success by trips that actually happen, not by how long you scroll.'],['Honest about limits','Badges lower risk but don\'t remove it. We\'ll always tell you what we check and what we don\'t.']].map(([h,p])=>`<div class="card sec"><h3>${h}</h3><p class="hint">${p}</p></div>`).join('')}</div></section>
   <section class="faq" id="faq"><h2 class="ab-h">Questions people ask</h2>${FAQ.map(([q,a],i)=>`<details ${i===0?'open':''}><summary>${q}</summary><p>${a}</p></details>`).join('')}</section>
   <section class="ab-two" id="contact"><div><h2>Talk to us</h2><p class="hint">We read every message. Expect a reply within [1 working day].</p>
     <div class="card sec"><p><b>Email</b><br>[hello@withpayana.com]</p><p><b>Instagram</b><br>@withpayana</p><p><b>Grievance officer</b><br>[Name] · <a class="linkbtn" href="#legal-grievance">details</a></p></div></div>
    <form class="card sec fm" id="contactf"><label class="in" for="ct-n">Your name<input id="ct-n" autocomplete="name"></label><label class="in" for="ct-e">Email or phone<input id="ct-e"></label>
     <label class="in" for="ct-t">Topic<select id="ct-t"><option>General question</option><option>Problem with a trip</option><option>Safety concern</option><option>Partnership</option></select></label>
     <label class="in" for="ct-m">Message<textarea id="ct-m"></textarea></label><p class="err" id="cterr" hidden></p><button class="btn btn-primary">Send message</button></form></section>`;
}
bind.about=sec=>{if(sec){const el=document.getElementById(sec); el&&setTimeout(()=>el.scrollIntoView({block:'start'}),0)}
 $('#contactf').addEventListener('submit',e=>{e.preventDefault(); const er=$('#cterr');
  if(!$('#ct-n').value.trim()||!$('#ct-e').value.trim()||!$('#ct-m').value.trim()){er.textContent='Fill in your name, how to reach you and a message.'; er.hidden=false; return}
  e.target.reset(); er.hidden=true; demoToast('message not sent. In the real site this goes to the Payana team.')})};
