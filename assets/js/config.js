/* =====================================================================
   PAYANA — APP CONFIG
   Loaded first. Everything else reads from PAYANA_CONFIG.

   mode: 'demo'  → sample data from assets/js/data/demo/, nothing leaves
                   the browser, every simulated action is labelled "Demo".
   mode: 'live'  → reserved for the production build. Services must be
                   connected to a real backend first (see docs/PRODUCTION-ROADMAP.md).
                   Switching this today makes services throw "not connected"
                   instead of silently showing fake data.
   ===================================================================== */
const PAYANA_CONFIG = Object.freeze({
  mode: 'demo',
  version: '0.1.0-demo',

  // Browser storage keys are prefixed so demo state can never mix with
  // real customer data. Production must not use localStorage for user data.
  storagePrefix: 'payana-demo-',

  // Base URL of the future backend API. Unused in demo mode.
  apiBaseUrl: '',

  // Feature switches. Anything not built yet stays false.
  features: Object.freeze({
    realAuth: false,      // Real sign-up / log-in (managed auth provider)
    database: false,      // Trips, posts, friends, messages from the backend
    payments: false,      // Razorpay. Not implemented — see services/payments.js
    bookings: false,      // In-app bookings. Not implemented
    uploads: false,       // Photo uploads to storage. Demo keeps them in the page only
  }),
});
const IS_DEMO = PAYANA_CONFIG.mode === 'demo';
