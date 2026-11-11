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
| Messages, friend requests, communities | Page-only changes, labelled Demo | Backend |
| Verified badges | Decorative sample data | Real verification process |
| Payments, bookings | **Not present.** No payment screens. Budget says payments happen outside the app | Razorpay (server-side), see roadmap |

Statements on the landing page ("Our team reviews every report", "Optional ID and phone checks") describe planned features. Make sure they are true before launch.
