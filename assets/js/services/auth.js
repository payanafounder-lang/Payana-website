/* =====================================================================
   AUTH SERVICE — DEMO SESSION ONLY
   Demo: "signing in" just remembers a display name in this browser.
   No account is created, no password is checked or stored.
   Live: replace with a managed auth provider (e.g. Firebase Auth,
   Supabase Auth, Auth0, Clerk). The provider owns passwords, OTP and
   Google sign-in; this service then only exposes the signed-in user.
   ===================================================================== */
const AuthService={
  current(){return store.get('user')||window.__u||null},
  isSignedIn(){return !!store.get('user') || !!window.__u},
  // Demo only: name is the display name the visitor typed.
  startDemoSession(name){if(!IS_DEMO) notConnected('sign-in'); const u={name:name||'Traveller'}; window.__u=u; store.set('user',u); return u},
  signOut(){store.del('user'); window.__u=null},
};
// Shorthands used by the screens
const authed=()=>AuthService.isSignedIn();
function me(){return AuthService.current()||{name:'You'}}
