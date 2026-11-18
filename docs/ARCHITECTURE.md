# Architecture

## Layers (load order = dependency order)

| Layer | Files | Rule |
|---|---|---|
| Config | `assets/js/config.js` | `PAYANA_CONFIG.mode` is `'demo'` or `'live'`. Feature switches live here. |
| Core | `core/utils.js`, `core/store.js`, `core/router.js` | No knowledge of trips, posts or other business data. |
| Demo data | `data/demo/trips.js`, `data/demo/social.js` | Sample content only. Never edited at runtime (services hand out copies). |
| Services | `services/*.js` | **The only code that knows where data comes from.** Demo mode returns copies of demo data; live mode will call the backend. |
| State | `state.js` | In-page UI state (tabs, filters) plus the content loaded from services. |
| Components | `components/trip-card.js` | Reusable HTML builders. |
| Views | `views/*.js` | One per screen: a render function returning HTML, plus `bind.<name>` for events. |
| Start | `app.js` | Calls `route()`. |

The screens never read `DEMO_TRIPS` or `DEMO_SOCIAL` directly. They use `TRIPS`, `T(id)` and `S`, which the services fill. Swapping demo data for a real backend therefore happens in `services/`, not in the screens.

## Routing

Addresses use the `#hash`. Screens that take an argument use `#<screen>-<argument>` (see `PREFIXED` in `core/router.js`).

| Kind | Addresses | Sign-in |
|---|---|---|
| Landing | `#top` and its sections (`#how`, `#safety`…) | No |
| Public pages | `#legal-<rules\|safety\|terms\|privacy\|grievance>`, `#about`, `#about-contact`, `#reset`, `#help`, `#help-<id>`, `#t-<trip>` (shared trip preview), `#paused` | No |
| Member app | `#feed`, `#explore`, `#trip-<id>`, `#mytrips`, `#newtrip`, `#plan`, `#tripday-<id>`, `#manage-<id>`, `#review-<id>`, `#messages`, `#communities`, `#community-<n>`, `#post-<id>`, `#u-<name>`, `#profile`, `#create`, `#notifications`, `#search`, `#saved`, `#settings`, `#verify`, `#support`, `#appeal` | Yes |
| Full-width (no member menu) | `#consent`, `#welcome`, `#admin` | Yes |

Unknown addresses show the landing page when signed out, and "page not found" when signed in.
New members go `sign up → #consent → #welcome → where they were heading`.

Shared pieces in `components/`: `trip-card.js`, `report.js` (`openReport()`), `invite.js` (`openInvite()`), `feedback.js` (pilot Feedback tab).
Styles for screens added from version 1.2 live in `assets/css/pages.css`; their sample data in `assets/js/data/demo/more.js`.

## Adding a screen

1. Create `assets/js/views/<name>.js` with `function <name>(){ return '...html...' }` and optionally `bind.<name>=()=>{...}`.
2. Add `<name>` to `APP` (or `PUBLIC`) and to `screens()` in `core/router.js`; add it to `PREFIXED` if it takes an argument.
3. Add a `<script>` tag in `index.html` before `app.js`.
4. Add styles to `assets/css/pages.css`.

## Demo safety rules

- Any action that only pretends to happen must call `demoToast()`, never `toast()`, so the message starts with "Demo:".
- Browser storage keys use the `payana-demo-` prefix (`core/store.js`). Real customer data must never be stored in the browser.
- No payment UI exists. `services/payments.js` is a stub that throws.

## Why plain scripts, not modules

The team opens `index.html` by double-clicking. Browsers block ES modules on `file://`, so the code uses ordered classic scripts that share top-level names. When the project moves to a real build (see the roadmap), these files map one-to-one onto modules.
