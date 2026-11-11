/* Trips service. Demo: a working copy of DEMO_TRIPS kept in memory
   (trips you create disappear on reload). Live: GET /trips, POST /trips,
   POST /trips/:id/requests, etc. — see docs/PRODUCTION-ROADMAP.md. */
const TripService={
  list(){return IS_DEMO?demoCopy(DEMO_TRIPS):notConnected('trips')},
};
const TRIPS=TripService.list();
const T=id=>TRIPS.find(t=>t.id===id);
