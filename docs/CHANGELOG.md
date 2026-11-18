# Changelog

Screens are built from the team-approved sample designs (canvas "Payana — Version 1.2 to 1.6 sample pages").
Everything is still a **demo**: actions that would send, save or charge something show a "Demo:" message instead.

## 1.2 — Trust pages, settings, notifications, admin
- **Terms, privacy & community rules** (`#legal-rules`, `#legal-safety`, `#legal-terms`, `#legal-privacy`, `#legal-grievance`). Public page. Wording from the Safety Terms draft; marked "Draft: lawyer review before launch". Footer links now go here instead of the safety section.
- **About, FAQ & contact** (`#about`, `#about-contact`). Public page. Founder names and contact details are `[placeholders]`.
- **Forgot / reset password** (`#reset`). Public, 3 steps. "Forgot password?" in the log-in sheet opens it.
- **Settings** (`#settings`): Edit profile and Privacy & safety. Team change: budget per trip and group size removed from the profile (they are set on each trip). Profile "Edit profile" opens Settings.
- **Notifications** (`#notifications`) with filters and Approve / Accept / Decline. Includes the "become the host" request (team follow-up). New menu item with an unread counter.
- **Admin & safety dashboard** (`#admin`, team only, demo). Safety reports queue; every action needs a note for the action log.
- Router: public pages (no sign-in) and full-width "focus" screens. New styles in `assets/css/pages.css`, new sample data in `assets/js/data/demo/more.js`.

## 1.3 — Joining safely, verification, reviews, managing a trip
- **Safety consent** (`#consent`): shown after sign-up. Four required boxes; "Agree and continue" stays disabled until all are ticked. Demo stores the consent version and time in this browser only (live: store server-side).
- **Welcome steps** (`#welcome`): 4 steps (about you, travel style, places, photo & verification). Budget and group size are not asked (they belong to each trip).
- **Verification** (`#verify`): phone, email, selfie and government ID. Team change: **DigiLocker** is the main ID option; PAN card / driving licence / passport photo as a fallback, deleted after the check. **Aadhaar card photos are not accepted** (unlicensed private companies may not collect or keep Aadhaar copies).
- **Report & block** sheet (`components/report.js`): one form for people, trips, posts, chats and reviews; reason required; "also block" for people. Wired into trip pages and chats.
- **After-trip review** (`#review-<trip>`): team change: every travel mate gets stars, "travel again?" and a written review. Reviews are public; the "uncomfortable?" box is private to the safety team. Linked from My trips.
- **Manage a trip** (`#manage-<trip>`): edit details, approve/remove people, invite. Team change: **Cancel trip** first offers to hand the trip to a new host (they must accept), then needs a reason and a message to the group. Members get **Leave trip** with a reason.

## 1.4 — Social and sharing, help, error screens
- **Inside a community** (`#community-<n>`): cover, join/leave, Posts / Trips / Members / About & rules. Community names on the Communities page open it.
- **Post with comments** (`#post-<id>`): comments, replies, like, report. The comment button in the feed opens it.
- **Someone else's profile** (`#u-<name>`): Add friend, Message, ⋯ Report / Block. Team change: **reviews from travel mates are always visible**, even on private accounts. Team follow-up: each review has **Report review**, and the person reviewed can post **one reply**. Names in the feed, friends, trips and comments link here.
- **Shared trip link** (`#t-<trip>`): public preview for people without an account, with "Sign up to request a spot" that returns them to the trip after consent and welcome steps. Includes a WhatsApp link preview. "Share trip link" copies this address.
- **Help & support** (`#help`): search, topics, popular questions, safety banner, contact options. In the menu and footer.
- **Error & empty screens**: page not found for unknown app addresses, account paused (`#paused`), offline banner, and empty states for friends and Explore.

## 1.5 — Gaps found in the full link check
- **Saved** (`#saved`): saved trips and posts with filters and empty state. Trip pages now have a **Save** button. In the menu.
- **Search** (`#search`): people, trips and communities, with Add friend, recent searches and a no-results state. In the menu and phone top bar. Blocked people never show.
- **Help articles** (`#help-<id>`): one template for every help question, with "Was this helpful?" and related articles.
- **Support chat** (`#support`): quick topics; safety topics are routed to the safety team. Demo replies are automatic samples.
- **Appeal** (`#appeal`): for paused accounts; reason required, confirmation box, "what happens next" timeline.
- **Invite friends** sheet (`components/invite.js`): WhatsApp / Instagram / SMS / copy link, and invite Payana friends. Used on Manage trip.
- **Settings**: Account & login, Notification settings (in-app / email / SMS per type, quiet hours), Blocked people (unblock), Delete account (type DELETE, 30 days to change your mind).
- **Admin**: Users lookup, selfie Verification queue, Support tickets, and **Reported reviews** (team follow-up): remove / hide personal details only / keep; remove only reviews that break the rules.

## 1.6 — Phone, trip day, women-only trips, pilot feedback, messages
- **Phone check**: every screen tested at phone width (390 px) with no sideways scrolling. Two-column form rows stack on small phones. Search and Notifications added to the phone top bar.
- **Trip day** (`#tripday-<trip>`): meeting point, directions, call host, who has reached, "I've reached", share with family, a large **call 112** button, and today's timeline. No location tracking. Opened from the trip planner.
- **Women-only trips**: "Who can join?" when creating a trip (Everyone / Women-only / Friends of friends) plus selfie-verified-only and alcohol-free options; women-only badge on cards and trip pages; Explore filter. Only people whose profile says woman and who passed the selfie check can request. Optional gender field in Edit profile, used only for this. Sample trip: Gokarna. **Lawyer to review the wording.**
- **Pilot feedback**: Feedback tab on every member screen (ease 1–5, topic, note, screenshot, contact permission). Safety problems point to Report. "Pilot" label next to the logo.
- **Emails & text messages**: templates in `docs/MESSAGES.md` (welcome, approved, reminder, handover, cancelled, review; SMS for code, approved, trip morning, trusted contact, handover, cancelled).

## Team review round 2 — 18 November 2026

1. **Phone fit.** The bottom tab bar was wider than small phones (under ~386 px), so pages slid sideways. Fixed, and the page can no longer be pushed wider than the screen. Form fields are 16 px on phones so iPhones don't zoom in when you tap them. Long star ratings on reviews no longer run off the card. Checked at 320, 360, 375, 390 and 412 px.
2. **Feedback tab removed** from every page (`components/feedback.js` deleted).
3. **Friends page removed.** Its three parts already live elsewhere: your friends list (tap the Friends count on your profile), friend requests (now at the top of that list, and on the Home feed) and people you may know (Search). Old `#friends` links open the profile friends list.
4. **Emergency contacts.** Settings › Privacy & safety: a main contact plus an alternative number, each marked Family or Friend, with a 10-digit Indian mobile check. Both show as "Call" buttons on the trip-day screen. Replaces the single "trusted contact" field.
5. **Create post moved up.** First item in the desktop menu (it was at the bottom), and the Create a post page has Post and Cancel at the top as well as the bottom.
6. **Gender:** "Prefer not to say" removed (Not set, Woman, Man, Non-binary).
7. **Settings opens from the profile** (Settings button next to Edit profile, like Instagram). Removed from the menu and the phone top bar.
