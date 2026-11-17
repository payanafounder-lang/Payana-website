/* =====================================================================
   DEMO DATA — SAMPLE CONTENT FOR VERSIONS 1.2+ (not real people)
   Notifications, admin queues and other sample content for the newer
   screens. Merged with DEMO_SOCIAL by services/social.js.
   In live mode none of this loads; services read from the backend instead.
   ===================================================================== */
const DEMO_MORE={
  // type: join | friend | host | reminder | approved | plan | likes | safety
  notifs:[
   {id:1,type:'host',who:'Meera R.',trip:'coorg',text:'asked you to become the host of',quote:'Family emergency, I can\'t travel. You know the plan best, can you take over?',time:'5 min ago',read:false},
   {id:2,type:'join',who:'Neha P.',trip:'coorg',text:'wants to join your trip',quote:'Hi! Same dates and budget, I\'d love to come along.',time:'10 min ago',read:false},
   {id:3,type:'friend',who:'Arvind K.',text:'sent you a friend request. 3 mutual friends.',time:'1 hr ago',read:false},
   {id:4,type:'reminder',trip:'mysuru',text:'starts in 2 days. Share the plan with your trusted contact?',time:'3 hr ago',read:false},
   {id:5,type:'approved',who:'Sana G.',trip:'chikkamagaluru',text:'approved your request. Welcome to',time:'Yesterday',read:true},
   {id:6,type:'plan',who:'Rohit S.',trip:'coorg',text:'marked "Homestay check-in" as Booked in',time:'Yesterday',read:true},
   {id:7,type:'likes',who:'Ananya K.',text:'and 4 others liked your post from Coorg.',time:'2 days ago',read:true},
   {id:8,type:'safety',text:'We reviewed your report. Action has been taken on the account. Thank you for keeping Payana safe.',time:'5 days ago',read:true}
  ],
  // Admin: safety reports queue. sev: high | medium | low
  reports:[
   {id:'R-1042',kind:'Harassing messages',target:'User · @trip_rider',sev:'high',age:'40 min',owner:'You',status:'open',
    detail:'Reported by a member of the Coorg weekend group. Says the user kept messaging after being asked to stop.',
    facts:[['Account age','12 days'],['Verification','Phone only'],['Past reports','1 (closed, warning)'],['Upcoming trips','Coorg, Sat–Sun']]},
   {id:'R-1041',kind:'Fake profile',target:'User · @kiran_vibes',sev:'medium',age:'3 hr',owner:'Unassigned',status:'open',
    detail:'Profile photos appear to be of a model. No trips yet. Two people reported it.',
    facts:[['Account age','2 days'],['Verification','None'],['Past reports','0'],['Upcoming trips','None']]},
   {id:'R-1040',kind:'Misleading costs',target:'Trip · Gokarna beach camp',sev:'medium',age:'6 hr',owner:'Unassigned',status:'open',
    detail:'Members say the host asked for ₹2,000 more than the listed budget after they joined.',
    facts:[['Host','Verified, 3 trips'],['Members','5'],['Past reports','0'],['Trip date','Next weekend']]},
   {id:'R-1039',kind:'Spam post',target:'Post · #88213',sev:'low',age:'1 day',owner:'You',status:'open',
    detail:'Post advertises a paid tour package with a phone number.',
    facts:[['Account age','5 months'],['Verification','Phone, email'],['Past reports','0'],['Upcoming trips','None']]},
   {id:'R-1038',kind:'Selling tours',target:'User · @weekend_deals',sev:'low',age:'1 day',owner:'Unassigned',status:'open',
    detail:'Messages several members offering "discounted packages".',
    facts:[['Account age','3 weeks'],['Verification','Phone only'],['Past reports','1'],['Upcoming trips','None']]}
  ]
};
