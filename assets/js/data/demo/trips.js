/* =====================================================================
   DEMO DATA — SAMPLE TRIPS (not real people, trips or prices)
   Shape of each trip is documented in docs/DATA-MODEL.md. In live mode
   this file is not used; trips come from the backend via services/trips.js.
   ===================================================================== */
const DEMO_TRIPS=[
 {id:'coorg',name:'Coorg',img:6046,km:265,dates:'Sat 7 – Sun 8 Nov',len:'weekend',budget:4200,pace:'Relaxed',seats:'4 of 6',group:6,fit:'strong',host:'Ananya K.',hv:true,interests:['Coffee','Trekking','Food'],
  why:['Your dates','In budget','Relaxed pace','Coffee, trekking'],miss:[],
  plan:[['Sat','Drive out at 6 am',['Breakfast stop at Kamat, Channapatna','Check in at a coffee-estate homestay','Estate walk and coffee tasting','Bonfire dinner']],['Sun','Abbey Falls and Raja\'s Seat',['Sunrise walk to Abbey Falls','Lunch in Madikeri','Sunset at Raja\'s Seat','Drive back, home by 10 pm']]],
  people:[['Ananya K.','Host · 11 trips',true],['Rohit S.','6 trips',true],['Meera J.','First trip',false],['Varun D.','3 trips',true]]},
 {id:'mysuru',name:'Mysuru',img:6047,km:145,dates:'Sat 7 Nov · day trip',len:'day',budget:1800,pace:'Relaxed',seats:'3 of 5',group:5,fit:'good',host:'Pranav N.',hv:true,interests:['Food','Heritage'],
  why:['Your dates','In budget','Food, heritage'],miss:['Leaves at 6 am'],
  plan:[['Sat','Palace and food crawl',['Leave Bengaluru 6 am','Mysuru Palace when it opens','Mylari dosa for lunch','Devaraja market walk','Palace lights if it\'s a Sunday']]],
  people:[['Pranav N.','Host · 8 trips',true],['Divya V.','2 trips',true]]},
 {id:'chikkamagaluru',name:'Chikkamagaluru',img:6048,km:240,dates:'Fri 6 – Sun 8 Nov',len:'long',budget:6500,pace:'Active',seats:'2 of 6',group:6,fit:'partial',host:'Sana G.',hv:true,interests:['Trekking','Sunrise'],
  why:['Sunrise trek','Shared interests'],miss:['Over budget by ₹500','Fast pace'],
  plan:[['Fri','Night drive',['Leave 9 pm after work','Stay near Kaimara']],['Sat','Mullayanagiri sunrise',['Start climbing 5:30 am','Baba Budangiri after lunch']],['Sun','Hebbe Falls',['Jeep ride to the falls','Drive back after lunch']]],
  people:[['Sana G.','Host · 14 trips',true],['Tarun L.','5 trips',true],['Aisha R.','4 trips',true],['Kiran B.','1 trip',false]]},
 {id:'dandeli',name:'Dandeli',img:6056,km:460,dates:'Sat 14 – Sun 15 Nov',len:'weekend',budget:5800,pace:'Active',seats:'5 of 8',group:8,fit:'good',host:'Nikhil P.',hv:true,interests:['Rafting','Adventure'],
  why:['In budget','Adventure','Group size'],miss:['Next weekend'],
  plan:[['Sat','Kali river rafting',['Overnight bus arrives 6 am','Grade 2–3 rafting, 9 km','Jungle camp stay']],['Sun','Kayaking and back',['Morning kayak','Leave by 2 pm']]],
  people:[['Nikhil P.','Host · 9 trips',true],['Fatima Z.','3 trips',true],['Owen M.','2 trips',false]]},
 {id:'ooty',name:'Ooty',img:6045,km:270,dates:'Sat 7 – Sun 8 Nov',len:'weekend',budget:4800,pace:'Relaxed',seats:'3 of 4',group:4,fit:'strong',host:'Lakshmi R.',hv:true,interests:['Rail','Tea','Photography'],
  why:['Your dates','In budget','Relaxed pace','Photography'],miss:[],
  plan:[['Sat','Toy train to Coonoor',['Drive to Mettupalayam','Nilgiri toy train (book ahead)','Tea estate stay']],['Sun','Ooty lake and back',['Botanical garden','Drive home via Bandipur']]],
  people:[['Lakshmi R.','Host · 7 trips',true],['Joel A.','4 trips',true]]},
 {id:'wayanad',name:'Wayanad',img:6075,km:280,dates:'Sat 21 – Mon 23 Nov',len:'long',budget:7200,pace:'Relaxed',seats:'2 of 5',group:5,fit:'partial',host:'Rhea M.',hv:false,interests:['Rainforest','Wildlife'],
  why:['Relaxed pace','Nature'],miss:['Over budget by ₹1,200','Host not verified'],
  plan:[['Sat','Into the forest',['Drive via Mysuru','Treehouse stay']],['Sun','Edakkal caves',['Morning caves walk','Banasura lake']],['Mon','Back home',['Leave after breakfast']]],
  people:[['Rhea M.','Host · 2 trips',false],['Sam T.','1 trip',true]]}
];
