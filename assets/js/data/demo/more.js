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
  ,
  // v1.4 — comments by post id: [name, text, time, [replies]]
  comments:{
   1:[['Arjun J.','Count me in for the next one. Which dates are you thinking?','2d',[['Meera R.','Probably the long weekend. I\'ll post the trip soon!','2d']]],['Sana G.','Love this group!','1d',[]]],
   3:[['Rohit S.','Can confirm, 5:30 is the sweet spot. Carry a jacket.','1d',[]],['Divya V.','Is it okay for first-timers?','20h',[['Arjun J.','Yes, it\'s a steady climb. Go slow.','18h']]]],
   4:[['Pranav N.','Booked for December, thanks for the tip!','1d',[]]]
  },
  // v1.4 — other travellers' profiles (slug → profile). Reviews are always visible.
  people:{
   'rohit-s':{name:'Rohit S.',user:'rohit.roams',area:'Koramangala',v:'Phone, email & selfie verified',cover:6085,bio:'Weekend trekker, sunrise chaser, always the one with the snacks.',tags:['Balanced pace','Trekking','Photography'],posts:24,friends:86,trips:7,mutual:['Ananya K.','Arjun J.'],upcoming:'coorg',postsPrivate:true,
     reviews:[{who:'Meera R.',trip:'Chikkamagaluru sunrise trek',when:'Oct',stars:5,text:'Super punctual and kept the group laughing. Would host him again.'},{who:'Ananya K.',trip:'Skandagiri night trek',when:'Sep',stars:5,text:'Great host. Shared the plan early and made sure everyone got home.'},{who:'Vinay D.',trip:'Skandagiri night trek',when:'Sep',stars:4,text:'Good company. The drive back ran late, but he kept us updated.',reply:'Fair point! Traffic at Nandi Hills was bad. I now plan a buffer for the drive back.'}]},
   'ananya-k':{name:'Ananya K.',user:'ananya.k',area:'Indiranagar',v:'Phone, email, selfie & ID verified',cover:6046,bio:'Coffee-estate weekends and long walks. Host of the Coorg trips.',tags:['Relaxed pace','Coffee','Food'],posts:41,friends:132,trips:11,mutual:['Rohit S.','Meera R.','Sana G.'],upcoming:'coorg',postsPrivate:false,
     reviews:[{who:'Rohit S.',trip:'Coorg weekend',when:'Aug',stars:5,text:'Best host I\'ve travelled with. Everything was planned.'},{who:'Sana G.',trip:'Coorg weekend',when:'Jul',stars:5,text:'Kind, organised and fun.'}]}
  },
  // v1.4 — sample posts inside a community, by community index
  commPosts:{0:[{who:'Meera R.',time:'2 h',text:'Kudremukh permits for December open next week. Planning a trip on the 13th, 4 spots. Who\'s in?',trip:'chikkamagaluru',likes:18,com:6},{who:'Arjun J.',time:'Yesterday',tip:true,text:'Carry a light rain jacket even in December. Mullayanagiri got misty and cold by 5 pm.',likes:31,com:4}]},
  commRules:['Treks only, no paid tour ads.','Share real difficulty and costs.','No littering on trails.','Payana\'s Community Rules apply.']
  ,
  // v1.5 — sample blocked people (Settings → Blocked people)
  blocked:[['Vikram P.','Blocked 5 days ago · also reported'],['@weekend_deals','Blocked last month']],
  // v1.5 — admin: users, selfie checks, support tickets, reported reviews
  adminUsers:[
   {id:'U-20418',name:'Rohit S.',user:'rohit.roams',area:'Koramangala',status:'Active',joined:'3 months ago',phone:'+91 98XXX XXX07',verified:'Phone, email, selfie',consent:'Terms v1.0',trips:'7 done · 1 upcoming · 0 no-shows',reports:'0 against · 1 made',
    tripRows:[['Coorg coffee-estate weekend','Member','28–29 Nov','Upcoming'],['Chikkamagaluru sunrise trek','Member','Oct','Completed'],['Skandagiri night trek','Host','Sep','Completed']],
    history:[['2 weeks ago','Selfie verification approved','Moderator'],['1 month ago','Reported a user (R-0988, action taken)','Rohit'],['3 months ago','Account created, Terms v1.0 accepted','System']]},
   {id:'U-20577',name:'Kiran B.',user:'kiran_vibes',area:'Whitefield',status:'Active',joined:'2 days ago',phone:'+91 99XXX XXX42',verified:'Phone only',consent:'Terms v1.0',trips:'0 done',reports:'2 against (open)',
    tripRows:[],history:[['Today','Reported: fake profile (R-1041)','System'],['2 days ago','Account created, Terms v1.0 accepted','System']]}
  ],
  selfieQueue:[{name:'Kavya N.',user:'kavya.wanders',when:'25 min ago'},{name:'Sameer K.',user:'sameer.k',when:'1 hr ago'},{name:'Divya V.',user:'divya.v',when:'3 hr ago'}],
  tickets:[
   {id:'S-2291',title:'Change phone number',who:'Rohit S.',via:'chat',when:'12 min ago',status:'Waiting on user'},
   {id:'S-2290',title:'Host cancelled, want refund',who:'Divya M.',via:'email',when:'1 hr ago',status:'New'},
   {id:'S-2288',title:'Login code not arriving',who:'Sameer K.',via:'call back',when:'3 hr ago',status:'New'},
   {id:'S-2285',title:'How to split costs?',who:'Neha P.',via:'chat',when:'Yesterday',status:'Resolved'}],
  reportedReviews:[
   {id:'RV-0142',about:'Kavya N.',by:'Sameer K.',trip:'Gokarna beach camp (both went, confirmed)',stars:1,text:'Rude and fake person, don\'t trust her. Her number is 98XXX…',reason:'Shares my phone number and isn\'t true.',when:'2 hr ago',checks:[['Contains personal details','Yes'],['Abusive language','Partly'],['Travelled together','Yes']],status:'open'},
   {id:'RV-0139',about:'Rohit S.',by:'Vinay D.',trip:'Skandagiri night trek (both went, confirmed)',stars:4,text:'Good company. The drive back ran late, but he kept us updated.',reason:'Not fair, traffic wasn\'t my fault.',when:'1 day ago',checks:[['Contains personal details','No'],['Abusive language','No'],['Travelled together','Yes']],status:'open'}]
};
