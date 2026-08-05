# stp-landing-coming-soon

Coming-soon landing page for **STP — Santai Tapi Productive** (stp.web.id).

A single-file, dependency-light Three.js page featuring a rotating 3D word-cloud of the headline
**"Relax yet Productive"** in 28 languages, with Bahasa Indonesia ("Santai Tapi Productive")
highlighted.

## Stack

- [Three.js](https://threejs.org/) r160 via CDN (ESM import map)
- Vanilla JS + CSS — no build step, no bundler
- WebGL word cloud: canvas-generated text sprites on a Fibonacci sphere, drag + inertia rotation, hover highlight

## Run locally

```bash
# any static server works — e.g.
npx serve .
# or just open index.html
```

## Deploy

Push to GitHub, then point any static host (Hostinger, GitHub Pages, Cloudflare Pages) at this repo.
Serves behind Cloudflare proxy on stp.web.id (SSL Full/Strict).

## License

MIT
