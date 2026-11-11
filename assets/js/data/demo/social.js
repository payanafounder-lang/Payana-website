/* =====================================================================
   DEMO DATA — SAMPLE SOCIAL CONTENT (not real people or conversations)
   Friends, requests, communities, posts, the sample Coorg planner, chats,
   the sample profile and other example content shown in the demo.
   In live mode none of this loads; services read from the backend instead.
   Image values are file names in img/ without ".webp".
   ===================================================================== */
const DEMO_SOCIAL={
  requests:[['Neha P.','4 mutual friends · Coorg trip'],['Arvind K.','Met on Mysuru trip']],
  suggest:[['Isha D.','Likes trekking · 3 mutual'],['Karthik V.','Bikers community'],['Zoya H.','Going to Ooty, 7 Nov']],
  friends:[['Ananya K.','Indiranagar'],['Rohit S.','Koramangala'],['Meera R.','HSR Layout'],['Arjun J.','Jayanagar'],['Sana G.','Whitefield'],['Pranav N.','Malleshwaram']],
  // [name, image, members label, joined]
  comms:[['Weekend Trekkers BLR',6086,'4.2k members',true],['Coffee Country',6046,'1.8k members',false],['Bikers of the South',6050,'3.1k members',false],['Rail Journeys India',6073,'960 members',true],['Water Sports Karnataka',6056,'1.1k members',false],['Slow Travel Kerala',6071,'2.4k members',false]],
  posts:[
   {id:1,who:'Meera R.',v:true,where:'Indiranagar',time:'2 h',type:'Trip story',img:6088,text:'Met these four on a Payana trip in August. Now we\'re a group that plans something every month. Coorg again next weekend, two seats left.',trip:'coorg',likes:128,com:24},
   {id:2,who:'Nikhil P.',v:true,where:'Koramangala',time:'5 h',type:'Looking for companions',lfc:'dandeli',text:'Looking for 3 more people for Kali river rafting in Dandeli. Beginners welcome, the guides are great.',likes:41,com:12},
   {id:3,who:'Arjun J.',v:true,where:'Jayanagar',time:'Yesterday',type:'Travel tip',img:6048,text:'Tip: start the Mullayanagiri climb by 5:30 am. You beat the crowd and the mist is still in the valley.',likes:342,com:51},
   {id:4,who:'Lakshmi R.',v:true,where:'Basavanagudi',time:'2 days',type:'Photo',img:6045,text:'The Nilgiri toy train is worth booking a month ahead. Window seat on the left side going up.',trip:'ooty',likes:219,com:18},
   {id:5,who:'Sana G.',v:true,where:'Whitefield',time:'3 days',type:'Trip story',img:6068,text:'Seven days, five strangers, one monastery at the end of the trail. Already planning the next one with the same group.',likes:506,com:63}
  ],
  // Sample planner for the Coorg trip: [day, time, activity, owner, status]
  plan:[['Sat','06:00','Meet at Mysuru Road metro','Ananya','Booked'],['Sat','09:30','Breakfast stop, Channapatna','Rohit','Planned'],['Sat','13:00','Check in at estate homestay','Ananya','Booked'],['Sat','16:00','Estate walk and coffee tasting','Meera','To confirm'],['Sun','06:30','Abbey Falls sunrise walk','You','Idea'],['Sun','17:30','Sunset at Raja\'s Seat','Varun','Planned']],
  chat:[['Ananya K.','Homestay confirmed for Sat! Sending the location here.','9:41'],['Rohit S.','I can drive, 3 seats free in my car.','9:52'],['Meera J.','Can someone share a packing list? First trek for me 😅','10:05']],
  // Budget estimates per person and who handles what (planner Budget tab)
  budget:[['Homestay (1 night)',1800],['Fuel and tolls',900],['Food',1100],['Entry tickets',400]],
  handling:[['Ananya','Homestay booking'],['Rohit','Car and fuel'],['Meera','Snacks and first aid'],['You','Abbey Falls entry']],
  albumExtra:[6084,6054,6064,6066],
  dms:[['Ananya K.','See you Saturday at 6!',[['Ananya K.','See you Saturday at 6!']]],['Nikhil P.','Rafting slots are filling up',[['Nikhil P.','Rafting slots are filling up, let me know by Wed.']]],['Neha P.','Hey! Saw you\'re going to Coorg too',[['Neha P.','Hey! Saw you\'re going to Coorg too. Mind if I send a friend request?']]]],
  myPosts:[6046,6047,6074,6058,6064,6071,6056,6045,6073],
  pastTrips:[6068,6058,6071],
  // Sample profile shown for whoever signs in to the demo
  profile:{cover:6074,tripsDone:7,
    bio:'Weekend trekker and coffee person. Happiest on a hill at sunrise. Looking for people who don\'t mind early starts.',
    tags:['Relaxed pace','₹3,000–6,000','Trekking','Coffee','Groups of 4–6'],
    upcoming:{trip:'coorg',img:6046,label:'Coorg · Sat 7 – Sun 8 Nov'},
    reviews:[['Ananya K.','Easy to travel with, always on time and great company on the trek.','Coorg, Aug'],['Sana G.','Kept the group going on the climb. Would travel together again.','Chikkamagaluru, Sep']],
    tagged:[6054,6062,6084]},
  // Cover photos offered when creating a trip
  covers:[6046,6048,6045,6047,6056,6075,6068,6071,6074,6085],
  // Sample join requests that arrive on a trip the demo user publishes
  hostRequests:[['Neha P.','4 trips · shared interests'],['Karthik V.','2 trips · same budget']]
};
