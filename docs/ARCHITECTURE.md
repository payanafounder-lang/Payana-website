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

Addresses use the `#hash`: `#top` (landing), `#feed`, `#explore`, `#trip-<id>`, `#mytrips`, `#newtrip`, `#plan`, `#friends`, `#messages`, `#communities`, `#profile`, `#create`. App screens require a (demo) session, otherwise the log-in sheet opens.

## Adding a screen

1. Create `assets/js/views/<name>.js` with `function <name>(){ return '...html...' }` and optionally `bind.<name>=()=>{...}`.
2. Add `<name>` to `APP` and to the `R` map in `core/router.js`.
3. Add a `<script>` tag in `index.html` before `app.js`.
4. Add styles to `assets/css/app.css`.

## Demo safety rules

- Any action that only pretends to happen must call `demoToast()`, never `toast()`, so the message starts with "Demo:".
- Browser storage keys use the `payana-demo-` prefix (`core/store.js`). Real customer data must never be stored in the browser.
- No payment UI exists. `services/payments.js` is a stub that throws.

## Why plain scripts, not modules

The team opens `index.html` by double-clicking. Browsers block ES modules on `file://`, so the code uses ordered classic scripts that share top-level names. When the project moves to a real build (see the roadmap), these files map one-to-one onto modules.
