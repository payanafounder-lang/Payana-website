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
8. **Edit profile and Settings separated.** Edit profile on the profile page opens its own page (`#editprofile`) with only what others see: name, username, city, languages, bio, gender, pace and interests. Settings no longer has an Edit profile section; it keeps Account & login, Privacy & safety (with emergency contacts), Notification settings, Blocked people and Delete account.
9. **Profile tabs: Trips replaced by Saved.** Profile tabs are Posts, Saved, Reviews and Tagged. Saved (posts and trips, only you can see it) moved here from the menu; old `#saved` links open this tab. "Trips done" now opens My trips.
10. **Communities under Explore.** Explore has two tabs, Trips and Communities. Communities is no longer its own menu item, and the menu says "Explore".
11. Fix: a stray bracket left after removing the Feedback styles meant some new styles only worked on phones. Closed it.
12. **Help & support in Settings** (phones have no side menu): Help centre, chat with support, how emergency contacts work, report a safety problem, Call 112, About and the rules/privacy/terms.
13. Emergency contacts help article rewritten for the family/friend side; the planner button now says "Share with family".
14. Fix: help article steps that start with bold text were broken into one word per line on phones. Fixed for every article.

## Team review round 3 — 18 November 2026

15. **Budget you can edit, with group approval.** In a trip's planner › Budget, anyone in the group can change an amount or name, add an item or remove one, until the last day of the trip (then it locks). The group total is shown too. A "Group approval" card shows who has approved the current total; any change resets approvals, and the Budget tab shows a dot until everyone approves again.
16. **Budget changes posted in the trip chat automatically**, e.g. "You changed Food: ₹1,100 → ₹1,300. New total ₹4,400 per person (was ₹4,200). Everyone needs to approve it again." Approvals and "Everyone approved" are posted too, with a "Check the budget" link.
17. **Posts open from profile grids.** Tapping a photo on your profile (Posts and Tagged) or on someone else's profile opens the full post with likes, comments and save. The post page's Back button returns to where you came from.
18. **"Who's handling what" removed** from the Budget tab (it was fixed sample text that nobody could change).
19. **Approve or Don't agree.** In Group approval, each person picks **Approve** or **Don't agree**. Don't agree asks for a short reason; the person shows as "Not agreed" with their reason, and it's posted in the trip chat. Anyone can change their answer. Any budget change resets everyone's answer.
20. Demo link "someone else changes the budget" shows the budget from a group member's side (your answer back on Waiting, with the two buttons).

## Full check — 18 November 2026

Every page (126) opened at 320, 360, 412, 768, 1024 and 1440 px, and every button on every page (about 600) clicked at phone and desktop size; sign-up, consent, onboarding, logout and login run end to end; dark mode checked. Fixed:

21. Replying to a comment on one post, then opening another post, crashed the page.
22. Links to profile-photo posts stopped working after a page reload. They now use stable addresses (for example `#post-g6046-asha-rao`).
23. Pop-up sheets (report, friends list) stayed open after pressing Back. They now close when the page changes.
24. The "Demo:" pop-up message turned into a large round bubble on phones and covered the page. It's now a wide rounded bar.
25. Opening the trip chat on a phone now shows the newest message; switching planner tabs keeps the tabs in view.
26. The dotted road line on the landing page ran slightly past the screen edge at tablet width.

## Fix — 21 November 2026

27. **Languages now show on profiles.** "Languages you speak" (from Edit profile or the welcome steps) was saved but never shown. It now appears below the bio as **Speaks** Kannada · English, on your own profile and on other travellers' profiles. If no languages are added, the line is hidden.

## Profile photo and banner — 23 November 2026

28. **Profile photo in Edit profile.** Tap the round photo (camera badge) or "Add profile photo" to pick a picture; it's cropped to a circle and previewed before saving. "Change photo" and "Remove" once one is set. The photo then shows on your profile and in the menu's name card. Tapping the photo on your profile opens Edit profile.
29. **Banner in Edit profile.** The top of Edit profile shows your banner; tap it or "Change banner" to pick a picture (cropped to the banner's wide 3:1 shape). "Reset" goes back to the default Payana banner. The new banner shows at the top of your profile.
30. Demo: photo and banner are kept on this device only (nothing is uploaded). Live: upload to storage and save the image address on the profile.

## Photo and video posts — 24 November 2026

31. **Photos and videos in Create post.** Videos can now be added as well as photos, up to 10 per post (choose them or drag them in). They show as a swipe carousel with a thumbnail strip; each item has ✎ edit and × remove. **Preview post** shows the finished post before **Publish**.
32. **Photo editor.** Crop (Original, Square, 4:5, 16:9) and drag to choose what stays in the frame; zoom (slider, pinch or scroll), straighten, rotate left/right, flip; brightness, contrast, saturation, warmth, fade, vignette; 8 filters; hold to compare with the original.
33. **Video editor.** Trim start and end, adjust brightness, contrast and saturation, keep or remove the sound.
34. **Carousel posts.** Posts with several photos swipe like Instagram in the feed and on the post page (counter, dots, arrows on desktop). Double-tap a photo to like it.
35. **No more cropped photos.** Profile grids (Posts, Tagged, other people's profiles) and the post page show the whole photo at its real shape; a blurred copy of the photo fills any space. A stacked-squares icon marks carousel posts.
36. **⋯ menu on posts** (feed and post page). Your posts: Edit post (caption, location, photos), Edit this photo / video, Copy link, Delete post (with a confirmation). Other people's posts: Report post (opens the report sheet), Not interested, Copy link. Edited posts show "Edited".
37. **Edit profile:** the profile photo and banner open in the photo editor so you choose the framing, instead of an automatic centre crop.
38. Code: `assets/js/components/media.js` and `assets/css/media.css`. Demo: uploads and edits stay on this page only and are never uploaded.

## Stories and sharing — 25 November 2026

39. **Stories.** The row at the top of Home is now real 24-hour stories (your story first, then unseen friends). Tap to watch: progress bars, tap left/right or arrows, hold to pause, reply to a friend's story, delete your own. Stories disappear after 24 hours and never appear in the feed or on profile grids. Profile shows **Add story** / **View story**.
40. **Story editor before sharing** (`#story`, also the **Story** tab next to **Post** in Create and the **+ Story** button on Home). After choosing photos or videos (up to 10), a full-screen editor opens, like Instagram:
    - **Text:** 7 fonts, 14 colours plus a colour picker, alignment, background styles (none, solid, see-through, outline), size slider.
    - **Stickers:** location, mention a friend, hashtag, time, date, "My trip" card, Payana phrases, emoji. Tap a selected sticker to change its style.
    - **Draw:** pen, marker, neon, eraser, undo. **Background:** photo blur, colours, gradients; fit or fill the photo.
    - Drag anything to move it (centre guides), pinch or use the ↻ handle to resize and rotate, drag to the bin to delete. **Edit photo / video** opens the existing editor. Everyone / Friends only before sharing.
41. **Tappable stickers in stories.** Location shows trips to that place and friends' stories from there; mention shows the friend with View profile, Message and View story; hashtag shows other stories with the tag and related trips; the trip card opens the trip; a shared post opens the post.
42. **Add posts and trips to your story.** From a post's Share button or ⋯ menu, and from any trip's Share button. The editor opens with the post or trip as a card you can design around.
43. **Share sheet for posts and trips:** Your story, WhatsApp (ready-made message and link), Instagram (on phones the system share sheet with the photo, where Instagram Stories/Feed/Messages appear; on laptops the link is copied and Instagram opens), Copy link, and More (phone share menu). Share buttons added on Explore trip cards, the trip page cover (next to Save), the host's trip box, and every trip in My trips.
44. Trip links point to the public preview page (`#t-<trip>`), so friends without an account can open them. Post links (`#post-<id>`) open the post after login. Copy link in the ⋯ menu now really copies.
45. Pop-up messages ("Link copied", "Demo: …") no longer block taps on buttons underneath them.
46. Code: `assets/js/components/stories.js`, `assets/js/views/story.js`, `assets/css/stories.css`. Demo: stories stay in this browser only (videos until the page is closed); nothing is uploaded.

## Pinterest-style profile grid — 25 November 2026
- Team change: photos on profiles (your Posts and Tagged tabs, and someone else's profile) are no longer an even Instagram-style grid. Each photo keeps its own height, so tall and wide photos fit together in columns like Pinterest. Newest posts still come first, left to right.
- 3 columns on bigger screens, 2 on phones. Rounded tiles with a small gap.
- Photos are still never cut off. Extremely tall or wide photos are limited to between 1:2 and 2:1, with the blurred copy filling the rest.
- Code: `postGrid` in `views/post.js` adds the `masonry` class; layout code at the end of `components/media.js`; styles in `assets/css/media.css`.

## Home refreshes the feed — 25 November 2026
- Team change: tapping Home (desktop menu, phone tab bar, or the Payana logo) always gives a fresh feed.
- From another page: opens the feed at the top.
- Already on the feed: scrolls back to the top, shows a small "Refreshing" spinner under the top bar, then draws the feed again (like Instagram).
- Demo: the same sample posts come back. Live: this is where the app will fetch new posts from the server.
- Code: `refreshFeed` at the end of `core/router.js`; styles at the end of `assets/css/app.css`.

## Search at the top of the desktop menu — 26 November 2026
- Team change: Search is easier to find on laptops and desktops. It is now a search bar at the top of the left menu, above "Create post", instead of a plain item in the middle of the list.
- Phones keep the search icon in the top bar; it now lights up while you're on the Search screen.
- Keyboard shortcut: press **/** (or Ctrl/Cmd+K) on any app screen to open Search. Shown as a "/" hint on the bar.
- Search results highlight the matching part of people's names and community names. The search box uses 16px text so iPhones don't zoom in when it's tapped; results are announced to screen readers.
- Code: `.sidesearch` in `index.html` and `assets/css/app.css`; shortcut and highlighting in `views/search.js`. Asset versions bumped to `?v=20261126a` so browsers pick up the change.

## Fix: search showed "No people" when trips or communities matched — 26 November 2026
- **Bug:** Search always opened on the People tab and stayed there. Searching "Coorg" (also one of the Recent searches) said *No people for "Coorg"* even though a Coorg trip exists; "trek" hid 3 trips and a community the same way.
- **Fix:** when you type or tap a recent search, and the open tab has no matches, Search now jumps to the first tab that has results (People → Trips → Communities). If you tap a tab yourself, it stays on that tab.
- Shorter search box hint ("People, trips or communities") so it isn't cut off on phones.
- Code: `searchDraw(auto)` in `views/search.js`. Asset versions bumped to `?v=20261126b`.

## Leave a trip group — 26 November 2026
- Team change: once a trip is planned, **every person in the group can leave it** from **My trips**. Each trip you're going on or hosting has a red **Leave** button next to **Share** (trips still waiting for approval don't). The **Coorg demo planner** has one too.
- The trip planner also has **Leave trip group** next to Get help, and a **Leave** button on your own row in the **People** tab.
- **Members** get the existing leave form: a reason is required, with an optional message to the group and a link to report someone privately.
- **Hosts can't just leave.** Leave opens a "You're the host" step: choose someone in the group to take over hosting (they have to accept), or cancel the trip for everyone with a reason if nobody else has joined.
- New **Trips you left** list on My trips. Demo: nobody is told, and the Coorg demo trip has **Undo (demo)** to bring it back. Live: the group sees the reason in the trip chat and the person is removed from the chat and planner.
- Code: `views/my-trips.js`, `views/manage.js` (address `#manage-<trip>-leave`), `views/plan.js`, `state.js` (`S.left`, kept in browser storage); styles at the end of `assets/css/pages.css`.
- Merged with the search fix; asset versions bumped to `?v=20261126c` so browsers pick up both changes.
