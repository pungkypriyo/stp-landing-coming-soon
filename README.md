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

Serves behind Cloudflare proxy on stp.web.id (SSL Full/Strict, origin 153.92.10.200).

### Hostinger shared hosting (Node.js — recommended)

The `app/` directory is the deployable build: Vite + TypeScript + three.js,
served by a small Express server (`app/server.js` → serves `dist/` on `$PORT`).

```bash
cd app
zip -r ../stp-src.zip . -x "node_modules/*" -x "dist/*"
```

Then in hPanel → Websites → **stp.web.id** → Node.js:
- enable Node.js and upload `stp-src.zip` (or use hPanel Git: clone this repo, root directory = `app/`)
- Node version **22** · App type **vite** · Entry file **server.js** · Package manager **npm**

The build pipeline runs `npm install && npm run build`, then starts `node server.js`.
Build state is visible in hPanel; DNS is already handled by Cloudflare.

### Static (alternative)

Any static host works with the single-file `index.html` (Three.js via CDN).

## License

MIT
