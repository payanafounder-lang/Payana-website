/* Social service: friends, requests, posts, communities, chats, profile.
   Demo: a working copy of DEMO_SOCIAL kept in memory (changes reset on reload).
   Live: replace with backend calls (friends, posts, messages endpoints). */
const SocialService={
  load(){return IS_DEMO?demoCopy(DEMO_SOCIAL):notConnected('social data')},
};
