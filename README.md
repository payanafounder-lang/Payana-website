# Payana website — demo version

Landing site and clickable member-app prototype for **Payana**: find compatible travel companions, plan trips together, and share the journey.

> **This is a demo.** All people, trips, prices, posts and messages are sample content. Sign-up does not create an account, nothing is sent to anyone, and there are no payments. A "DEMO VERSION" tag shows in the corner, and every simulated action says "Demo:".

## Open it

No install or build step. Either:

- **Double-click `index.html`** (works straight from the folder), or
- serve the folder: `python3 -m http.server 8000`, then open http://localhost:8000

Keep the whole folder together. `index.html` needs `assets/` and `img/` beside it.

## Project structure

```
index.html                 Page markup only (landing, app shell, sign-in sheet)
assets/
  css/
    reset.css              Base reset
    base.css               Design tokens: colours, fonts, light/dark theme, buttons
    landing.css            Landing page sections
    auth.css               Sign up / log in sheet
    app.css                Member app screens and the toast
    demo.css               "DEMO VERSION" tag
  js/
    config.js              Demo/live mode, storage prefix, feature switches
    core/                  utils (helpers), store (browser storage), router
    data/demo/             ALL sample content: trips.js, social.js
    services/              The only layer that touches data: auth, trips, social,
                           payments (stub), api (future backend client)
    state.js               In-page UI state
    components/            Shared UI pieces (trip card)
    views/                 One file per screen
    app.js                 Starts the app
img/                       Photos (WebP)
docs/                      Architecture, data model, demo-vs-real list, production roadmap, image list
.env.example               Future server settings (placeholders only, no keys)
```

Scripts are plain `<script>` files loaded in a fixed order (see the bottom of `index.html`), so no server or bundler is needed.

## Docs

- [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md): how the pieces fit and how to add a screen
- [docs/DEMO-VS-REAL.md](docs/DEMO-VS-REAL.md): every simulated feature, listed
- [docs/DATA-MODEL.md](docs/DATA-MODEL.md): shape of trips, posts, users and so on
- [docs/PRODUCTION-ROADMAP.md](docs/PRODUCTION-ROADMAP.md): auth, database, bookings, Razorpay, customer admin
- [docs/IMAGES.md](docs/IMAGES.md): which photos are used where, and which are spare

## Deploy

**Not deployed yet. Do not publish until the team decides to.** When you do, any static host works (GitHub Pages, Netlify, Vercel, Cloudflare Pages). The page carries a `noindex` tag so search engines skip the demo.
