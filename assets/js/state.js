/* In-page UI state for the app screens. Content comes from the services
   (demo data today); the rest is view state like open tabs and filters. */
const S=Object.assign({liked:new Set(),saved:new Set(),joined:store.get('joined')||{},planTrip:store.get('planTrip')||'coorg',planTab:'plan',profTab:'posts',msgSel:0,
  f:{len:'all',max:10000,pace:'all',ints:new Set(),ver:false}},
  SocialService.load());
