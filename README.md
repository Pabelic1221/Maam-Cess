# Happy Birthday – red carpet page

Static site (no build step).

```
index.html          page markup
css/styles.css      all styles
js/config.js        ★ edit the name & flash settings here
js/confetti.js      confetti canvas
js/flash-engine.js  paparazzi flash engine
js/main.js          gate, buttons, wiring
assets/img/         photos (figure.webp = cut-out model, crowd.jpg = photographers backdrop)
vercel.json         caching headers
```

## Deploy to Vercel
**Dashboard:** push this folder to GitHub → vercel.com → *Add New Project* → import the repo →
Framework Preset **Other**, leave Build Command and Output Directory empty → *Deploy*.

**CLI:** `npm i -g vercel`, then run `vercel --prod` inside this folder.

## Preview locally
`npx serve .` (or any static server) – open the printed address.
