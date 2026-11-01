# Payana website

Landing site for **Payana** — find compatible travel companions, plan trips together, and share the journey.

## Structure

- `index.html` — the whole site (markup, styles and scripts in one file)
- `img/` — photography used across the site (WebP)

## Run locally

It's a static site with no build step. Open `index.html` in a browser, or serve the folder:

```bash
python3 -m http.server 8000
```

then visit http://localhost:8000.

## Deploy

Any static host works (GitHub Pages, Netlify, Vercel, Cloudflare Pages). For GitHub Pages: Settings → Pages → deploy from the `main` branch, root folder.
