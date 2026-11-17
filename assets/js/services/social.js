/* Social service: friends, requests, posts, communities, chats, profile,
   notifications and (for the team) admin queues.
   Demo: a working copy of DEMO_SOCIAL + DEMO_MORE kept in memory (changes reset on reload).
   Live: replace with backend calls (friends, posts, messages endpoints). */
const SocialService={
  load(){return IS_DEMO?demoCopy(Object.assign({},DEMO_SOCIAL,DEMO_MORE)):notConnected('social data')},
};
