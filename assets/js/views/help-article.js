/* ---------- HELP ARTICLE (v1.5) ----------
   #help-<id>. One template for every help question. [Placeholders] need real details. */
const HELP_ART={
  costs:{t:'How do we split costs on a trip?',topic:'Trips & requests',intro:'Payana helps your group agree on costs before you go. Payments happen outside the app for now, by UPI or cash, between the people on the trip.',
    steps:['<b>Open your trip and go to the Budget tab.</b> The host adds the main costs: stay, fuel, food and entry tickets.','<b>Check the estimate per person.</b> Payana divides each cost by the number of people going.','<b>Agree in the trip chat</b> who books what and when to pay, before anyone sends money.','<b>Mark items as Booked</b> in the plan so everyone can see what\'s done.'],
    warn:'Never send money, OTPs or bank details to someone you haven\'t met or confirmed in the group chat. Payana staff will never ask for them.',rel:['cancel','noreply']},
  noreply:{t:'The host hasn\'t replied to my request. What now?',topic:'Trips & requests',intro:'Most hosts reply within a day. If they don\'t, your request stays open until the trip starts.',
    steps:['Check <b>My trips</b>: the trip shows "Waiting for approval".','You can <b>cancel the request</b> any time from the trip page.','Look for a similar trip in <b>Explore</b>, or create your own and let people come to you.'],rel:['cancel','message']},
  cancel:{t:'Someone in my group cancelled last minute',topic:'Trips & requests',intro:'Plans change. Here\'s how to keep the trip on track.',
    steps:['The person leaving has to give the group a reason, so you\'ll see why in the chat.','If it was the host, they can <b>hand over hosting</b> to someone in the group before cancelling.','Update the <b>Budget</b> tab so the cost per person is right.','Settle any money already shared directly. Payana doesn\'t hold payments.'],
    warn:'Repeated last-minute cancellations can limit an account. If someone cancels to avoid paying back money, report it.',rel:['costs','review']},
  share:{t:'How do I share my trip with family?',topic:'Safety',intro:'Share the plan and the group list with someone you trust, before you leave.',
    steps:['Add your emergency contacts (a main contact and an alternative number) in <b>Profile → Settings → Privacy & safety</b>.','On the trip planner, tap <b>Share with a trusted contact</b>.','On the trip day, use <b>I\'ve reached</b> so the group knows you arrived.'],rel:['review','badge']},
  message:{t:'Why can\'t I message someone?',topic:'Getting started',intro:'To keep things safe, you can message friends and people on the same trip. Others get a message request they can accept or ignore.',
    steps:['Send a friend request from their profile.','Or request to join a trip they\'re on, then use the trip chat.','If they blocked you, you won\'t be able to message them.'],rel:['badge','noreply']},
  code:{t:'I didn\'t get my login code',topic:'Account & privacy',intro:'Codes usually arrive within a minute.',
    steps:['Check the phone number or email is right.','Wait 60 seconds, then tap <b>Resend code</b>.','Still nothing? <b>Chat with support</b> and we\'ll help you log in.'],warn:'Payana will never call you to ask for your code. Don\'t share it with anyone.',rel:['message']},
  badge:{t:'What does the verified badge mean?',topic:'Verification',intro:'A badge means we checked something about the person at one point in time.',
    steps:['<b>Phone and email</b>: confirmed with a code.','<b>Selfie</b>: matched to their profile photos.','<b>ID</b>: checked through DigiLocker, or a PAN card, driving licence or passport. We don\'t accept Aadhaar card photos.'],warn:'A badge is not a background check. Always meet first in a public place.',rel:['share','review']},
  review:{t:'Someone left an unfair review about me',topic:'Safety',intro:'Reviews are always visible, so it matters that they\'re fair.',
    steps:['Open your profile and find the review.','Tap <b>Report review</b> if it\'s false, abusive or shares personal details. It stays visible while we check.','You can post <b>one reply</b> under any review to give your side.'],warn:'We remove reviews that break the rules, not reviews that are just negative.',rel:['badge','cancel']}
};
function helpArticle(id){
  const a=HELP_ART[id]; if(!a) return notfound();
  return `<div class="ha-grid"><article class="card sec ha-body"><nav class="hint" aria-label="Breadcrumb"><a class="linkbtn" href="#help">Help</a> › ${a.topic}</nav><h1>${a.t}</h1><p class="hint">Updated [date] · 2 min read</p><p class="lead">${a.intro}</p>
     <ol class="ha-steps">${a.steps.map(s=>`<li>${s}</li>`).join('')}</ol>${a.warn?`<div class="note warn"><p><b>Stay safe:</b> ${a.warn}</p></div>`:''}
     <div class="ha-fb" id="hafb"><b>Was this helpful?</b><button class="btn btn-soft btn-sm" data-ha="yes">Yes</button><button class="btn btn-soft btn-sm" data-ha="no">No</button></div></article>
    <aside style="display:grid;gap:16px;align-content:start"><section class="card sec"><h2 style="font-size:18px">Related</h2>${a.rel.map(r=>`<a class="hp-q" href="#help-${r}">${HELP_ART[r].t}</a>`).join('')}</section>
     <section class="card sec" style="background:var(--surface-2)"><h2 style="font-size:18px">Need a person?</h2><p class="hint">Our team replies in [under 1 hour] during support hours.</p><button class="btn btn-primary" data-hp-chat>Chat with support</button></section></aside></div>`;
}
document.addEventListener('click',e=>{const b=e.target.closest('[data-ha]'); if(!b) return; $('#hafb').innerHTML=b.dataset.ha==='yes'?'<span class="hint">Thanks! Glad it helped.</span>':'<span class="hint">Sorry about that. <a class="linkbtn" href="#support">Chat with support</a> and we\'ll help.</span>'});
