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
