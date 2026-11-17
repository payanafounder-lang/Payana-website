/* ---------- LEGAL: COMMUNITY RULES, SAFETY TERMS, TERMS, PRIVACY, GRIEVANCE (public, v1.2) ----------
   Wording comes from the team's "Safety Terms & Pre-Login Consent" draft. It is a working draft:
   it must be reviewed by an Indian lawyer before launch. [Square brackets] are placeholders. */
const LEGAL_TABS=[['rules','Community rules'],['safety','Safety terms'],['terms','Terms of use'],['privacy','Privacy notice'],['grievance','Grievance officer']];
const LEGAL={
  rules:{title:'Community rules',intro:'Payana is for adults who want to travel together with respect. Breaking these rules can get your account removed, and serious cases may be reported to the police.',
    body:()=>`<h3>You must not</h3><ol class="rulelist">${['Harass, threaten, stalk, bully or abuse anyone, online or offline.','Send unwanted sexual messages, images or advances, or pressure anyone for intimacy.','Post hateful content about religion, caste, gender, sexual orientation, ethnicity, disability or nationality.','Create fake profiles, pretend to be someone else, or lie about trip details or costs.','Use a trip as a cover for dating only, or offer escort or sexual services.','Ask for money, sell products or run paid tours without our written approval.','Share someone\'s personal details, photos, location or chats without their permission.','Use or encourage illegal drugs, weapons, trespassing or any illegal activity.','Bring anyone under 18 on a trip arranged through Payana.'].map(r=>`<li>${r}</li>`).join('')}</ol>
     <h3>Reviews</h3><p>Reviews from travel mates are always visible on every profile, so people can decide who to travel with. Keep reviews honest and about the trip. Reviews with false claims, abuse or personal details are removed.</p>
     <h3>What happens when someone breaks a rule</h3><p>Our safety team reviews reports and aims to act on safety reports within [24 hours]. We may warn, restrict, suspend or permanently remove an account. Sexual misconduct, violence, threats or fraud lead to permanent removal.</p>`},
  safety:{title:'Safety terms',intro:'These Safety Terms form part of the Payana Terms of Use. By creating an account or using Payana, you agree to them.',
    body:()=>[
     ['1. What Payana is, and is not','Payana helps adults discover travellers with similar plans, form groups and coordinate trips. Payana is <b>not</b> a travel agent, tour operator, transport or accommodation provider, or guide. Unless we clearly say otherwise, we do not organise, run, supervise or insure any trip. Trips are created and run by users.'],
     ['2. Who can use Payana','You must be at least 18. You must give accurate information, use only your own real photos and keep one personal account.'],
     ['3. Verification and its limits','We offer phone, email, selfie and government ID checks (through DigiLocker, or a PAN card, driving licence or passport). A badge only means a specific check was completed at a point in time. We do not run criminal background checks, and we do not guarantee any user\'s identity or behaviour. Reviews, badges and trip history are signals, not promises.'],
     ['4. Your safety responsibilities','Chat in the app first. Meet first in a busy public place. Share your itinerary with a trusted contact. Keep your own ID, money, phone charge and a way home. Never send money, OTPs, bank details or ID copies to another user. Leave any situation that feels unsafe.'],
     ['5. Community rules','See the Community rules tab.'],
     ['6. Trips, costs and cancellations','Trip creators must describe trips honestly. Users agree cost-sharing among themselves; Payana is not responsible for payments between users. A host who cancels must give the group a reason, and can hand the trip to another member instead. Repeated last-minute cancellations may limit your account.'],
     ['7. Reporting, blocking and emergencies','<b>In an emergency, call 112 first.</b> Payana cannot dispatch help. You can report or block any user, message, post, review or trip. We may share information with authorities when required by law or to prevent serious harm.'],
     ['8. Privacy','See the Privacy notice tab. Your exact location is never shown to other users.'],
     ['9. Limitation of responsibility','Payana is provided "as is". We work to keep the community safe but cannot guarantee that every user or trip is safe. Nothing here limits liability that cannot be limited under Indian law.'],
     ['10. Changes and governing law','For material changes we will ask you to accept again. These terms are governed by the laws of India; courts at [Bengaluru, Karnataka] have jurisdiction.']
    ].map(([h,t])=>`<h3>${h}</h3><p>${t}</p>`).join('')},
  terms:{title:'Terms of use',intro:'The full Terms of Use are being written with our lawyer. The Safety terms and Community rules already apply.',
    body:()=>`<div class="note warn"><b>Draft placeholder.</b> To be written by [law firm] before launch: accounts, acceptable use, content licence, termination, disclaimers, disputes.</div>`},
  privacy:{title:'Privacy notice',intro:'How Payana collects and uses your personal data, in line with the Digital Personal Data Protection Act, 2023 and its Rules.',
    body:()=>`<h3>What we collect</h3><p>Your name, phone or email, profile details you add, trips you create or join, messages, reviews, and verification results. From DigiLocker we keep only your name, date of birth and that the check passed. Selfies and ID photos are used only for the check, then [deleted / kept for X days].</p>
     <h3>What others can see</h3><p>Your profile, travel style and reviews from travel mates. Posts can be friends-only. Your exact location is never shown.</p>
     <h3>Your rights</h3><p>You can access, correct or delete your data and withdraw consent from Settings → Privacy, or by writing to our Grievance Officer. We keep safety reports for [period] after account deletion where the law requires it.</p>
     <div class="note warn"><b>Draft.</b> Itemised notice to be completed with our lawyer before launch.</div>`},
  grievance:{title:'Grievance officer',intro:'If you have a complaint about Payana or how we handled your data, contact our Grievance Officer.',
    body:()=>`<dl class="kv"><dt>Name</dt><dd>[Name]</dd><dt>Email</dt><dd>[grievance@withpayana.com]</dd><dt>Address</dt><dd>[Registered address], Bengaluru, Karnataka</dd></dl><p>We acknowledge complaints within [24 hours] and aim to resolve them within [15 days].</p>`}
};
function legal(tab){
  const k=LEGAL[tab]?tab:'rules', d=LEGAL[k];
  return `<section class="pub-hero"><span class="eyebrow">Trust &amp; safety</span><h1>Terms, privacy and community rules</h1><p>The rules everyone agrees to before joining a trip, in plain language.</p>
    <div class="tags"><span class="tag">Version [1.0] · Effective [date]</span><span class="pill p-warn">Draft: lawyer review before launch</span></div></section>
   <div class="legal-grid"><nav class="card legal-nav" aria-label="Legal pages">${LEGAL_TABS.map(([id,l])=>`<a href="#legal-${id}" ${id===k?'aria-current="page"':''}>${l}</a>`).join('')}</nav>
    <article class="card sec legal-body"><h2>${d.title}</h2><p class="lead">${d.intro}</p>
     ${k==='rules'||k==='safety'?`<div class="note bad">${I('phone')}<p><b>In an emergency, call 112 first.</b> Then report it in the app. Payana cannot send help to you.</p></div>`:''}
     ${d.body()}</article></div>`;
}
