# Data model

The demo stores records as short arrays/objects (see `assets/js/data/demo/`). Below: the demo shape, then a suggested database table for production. Table designs are a starting proposal for the developers, not final.

## Trip (`DEMO_TRIPS`)

```js
{ id:'coorg', name:'Coorg', img:6046, km:265,
  dates:'Sat 7 – Sun 8 Nov', len:'day'|'weekend'|'long',
  budget:4200,               // ₹ per person, estimate
  pace:'Relaxed'|'Active', seats:'4 of 6', group:6,
  fit:'strong'|'good'|'partial',   // demo only: will be computed per viewer
  host:'Ananya K.', hv:true,       // host verified
  interests:['Coffee','Trekking'],
  why:['Your dates',...], miss:['Over budget by ₹500'],  // demo only: computed per viewer
  plan:[[day, title, [activities]]],
  people:[[name, subtitle, verified]] }
```

Suggested tables: `trips` (id, host_user_id, destination, start_date, end_date, budget_per_person_paise, pace, group_size, visibility, status, cover_image_id, created_at), `trip_interests`, `trip_plan_items` (trip_id, day, time, title, owner_user_id, status), `trip_members` (trip_id, user_id, role host/member, joined_at), `join_requests` (trip_id, user_id, message, status pending/approved/declined/cancelled, decided_by, timestamps). Store money as integer paise, dates as real dates, and compute `fit`, `why` and `miss` on the server per viewer.

## Social (`DEMO_SOCIAL`)

| Demo key | Demo shape | Suggested table(s) |
|---|---|---|
| `friends` | `[name, area]` | `friendships` (user_a, user_b, created_at), mutual only |
| `requests` / `suggest` | `[name, subtitle]` | `friend_requests` (from, to, status) |
| `posts` | `{id, who, v, where, time, type, img, text, trip, lfc, likes, com}` | `posts`, `post_media`, `post_likes`, `post_saves`, `comments` with `visibility` (everyone/friends/only me) and `hide_location_until` |
| `comms` | `[name, img, members, joined]` | `communities`, `community_members` |
| `chat`, `dms` | `[sender, text, time]` | `conversations`, `conversation_members`, `messages` (or a managed chat service) |
| `plan`, `budget`, `handling` | planner rows | `trip_plan_items`, `trip_budget_items`, `trip_tasks` |
| `profile` | bio, tags, reviews | `users`/`profiles` (name, city, bio, pace, budget band, verified_at), `reviews` (trip_id, from, to, rating, text) |

## Users and safety (not in the demo yet)

`users` (id, auth_provider_id, phone/email, date_of_birth or 18+ confirmation, created_at, deleted_at), `trusted_contacts`, `reports` (reporter, target type/id, reason, status, handled_by), `blocks`, `verifications`, `audit_log`.

## Payments (not in the demo)

`payments` (id, user_id, purpose, amount_paise, currency, razorpay_order_id, razorpay_payment_id, status created/authorized/captured/failed/refunded, created_at), `refunds`, `webhook_events` (raw payload, signature_valid, processed_at). Keep these separate from customer profile tables.
