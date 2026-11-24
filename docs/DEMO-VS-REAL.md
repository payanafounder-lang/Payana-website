# What is demo and what is real

Everything in this build runs only in the visitor's browser. Nothing is sent to a server.

| Feature | In this demo | Needed for real |
|---|---|---|
| Sign up / log in | Validates the form, then remembers the typed name in this browser. No account, no password stored or checked. | Managed auth provider; phone OTP / email; 18+ confirmation stored server-side |
| Continue with Google | Starts the same demo session. Google is not contacted. | OAuth through the auth provider |
| Forgot password | Shows a message only | Provider's reset flow |
| Trips, people, posts, friends, chats, communities, reviews | Sample content in `assets/js/data/demo/` | Backend database |
| Match labels (Strong / Good / Partial fit) and reasons | Written by hand in the sample data | Rule-based matching on the server from real preferences |
| Explore filters | Work, on sample trips | Same UI, server-side query |
| Request to join / approve / decline | State kept in this browser; "Demo: host approves" button simulates the host | Requests table, host notifications, approvals |
| Create a trip | Appears until the page reloads; two sample join requests are added | Saved trip, moderation, real requests |
| Planner: status, add activity, chat, budget | Works on the page; reset on reload. Budget is estimates only | Shared, real-time data; chat service |
| Share with trusted contact / Get help | Message only, labelled Demo | SMS/email to a trusted contact; support/incident process |
| Report trip / post, Block | Message only, labelled Demo | Reports queue, moderation dashboard, response times |
| Like, save, share, comments | Like/save on the page only; share and comments show a Demo message | Backend + share links |
| Photo uploads (trip cover, post, album) | Shown from your device on the page only, never uploaded | Storage with size/type checks, moderation |
| Post photo/video editing (crop, rotate, filters, trim), edit and delete post | Done in the browser on this page only; nothing is uploaded or changed for anyone else | Upload the edited file (and keep the original), video processing on the server, post edit history, deletes removed from storage |
| Messages, friend requests, communities | Page-only changes, labelled Demo | Backend |
| Verified badges | Decorative sample data | Real verification process |
| Forgot / reset password | 3 steps that only check the form; any 6 digits work | Provider's OTP reset flow |
| Safety consent | Version, time and ticked boxes stored in this browser only | Store with the user server-side; show again when terms change |
| Verification: selfie, DigiLocker, ID upload | Simulated; nothing is captured or uploaded. Aadhaar card photos are not accepted | Liveness vendor; DigiLocker via a registered requester or KYC partner; delete ID photos after review |
| Reviews (stars, travel again, written) | Page only; profile reviews are sample data | Reviews table; always public; report + one reply; moderation queue |
| Cancel trip / hand over hosting / leave trip | Page only; reason required; nobody is told | Notify the group; handover needs the new host to accept within 24 h |
| Women-only trips | Uses the optional gender field and the selfie check in this browser | Server-side rule; lawyer to review the wording |
| Notifications, search, saved, invite | Sample data; actions on the page only | Backend, push/email/SMS (see docs/MESSAGES.md) |
| Support chat, appeal, feedback | Automatic sample replies; nothing is sent | Support inbox / ticketing; appeals reviewed by a second person |
| Admin dashboard (`#admin`) | Inside the demo for review only, sample queues | Separate internal tool behind staff login and access control |
| Trip day | Statuses on the page only; no location tracking | Real-time statuses; in-app call that hides numbers |
| Payments, bookings | **Not present.** No payment screens. Budget says payments happen outside the app | Razorpay (server-side), see roadmap |

Statements on the landing page ("Our team reviews every report", "Optional ID and phone checks") describe planned features. Make sure they are true before launch.
