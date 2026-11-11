# Production roadmap (technical)

This is how to turn the demo into a real product. It is a suggested order, not a commitment, and the business plan still needs validating first.

## 0. Before any real users
- Decide the stack (the project brief suggests Flutter/React Native for the app, Node.js + TypeScript, PostgreSQL, a managed auth provider). Move this site to a build tool (e.g. Vite) at that point. The `views/`, `services/` and `data/` folders map directly onto modules.
- Turn off demo mode only after every service below is connected: `PAYANA_CONFIG.mode = 'live'`. Until then, live mode deliberately throws "not connected" rather than showing fake data.
- Get professional review of: privacy policy, terms, community rules, data protection obligations in India (including the Digital Personal Data Protection Act, 2023), age checks (18+), safety and incident handling, and payment and refund terms.

## 1. Authentication
- Use a managed provider (Firebase Auth, Supabase Auth, Auth0 or Clerk). Phone OTP is likely the main method in India; add Google sign-in.
- Replace the body of `services/auth.js` (`current`, `isSignedIn`, `signOut`, plus real sign-up/log-in) and remove `startDemoSession`.
- Record 18+ confirmation and acceptance of the Terms/Privacy/Rules (with version and timestamp) on the server.
- Sessions use secure, http-only cookies or the provider's SDK. Never put tokens in `localStorage`.

## 2. Backend and database
- A REST or GraphQL API in front of PostgreSQL (tables suggested in `DATA-MODEL.md`).
- Implement `services/trips.js` and `services/social.js` with `Api.request(...)`; the screens keep calling the same functions.
- Server-side validation for every form the demo already validates in the browser.
- Photo uploads go to object storage with type and size limits, image resizing, and EXIF/location stripping.

## 3. Trust and safety (before the city pilot)
- Reports and blocks write to the database; an admin dashboard for moderation; target response times.
- Trusted-contact sharing (SMS/email) and a "Get help" path that reaches a real person.
- Verification process behind the "Verified" badge.
- Rate limits and abuse checks on sign-up, messages and requests.

## 4. Customer management (admin)
- A separate, access-controlled admin tool: users, trips, reports, verifications, refunds, account deletion and data export requests.
- Role-based access and an audit log of admin actions.

## 5. Bookings (later)
- The brief recommends linking to external booking sites first. Only build in-app booking once demand is proven.

## 6. Payments with Razorpay (only when there is something to sell)
Nothing exists yet; `services/payments.js` is a stub. When needed:
1. **Server** creates an order with the Razorpay Orders API using the key secret (server only, from environment variables, see `.env.example`). Save it in `payments` with status `created`.
2. **Browser** opens Razorpay Checkout with the public key id and order id returned by the server.
3. On success, the browser sends `razorpay_order_id`, `razorpay_payment_id` and `razorpay_signature` to the server. The **server** verifies the signature (HMAC-SHA256 with the key secret) before marking anything paid.
4. Also handle Razorpay **webhooks** (e.g. `payment.captured`, `payment.failed`, `refund.processed`), verify the webhook signature, and make processing idempotent.
5. Use test mode keys until launch. Never commit keys. Show clear prices, GST and the refund/cancellation policy before payment.
Check Razorpay's current documentation when implementing; API details change.

## 7. Analytics
Track the funnel from the project brief: qualified sign-ups → completed profiles → join requests → confirmed trips → completed trips → repeat trips, plus safety reports. Use a consent-aware analytics tool.
