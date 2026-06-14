# Pooja Singh — Portfolio Landing Page

Fullscreen hero landing page built with **React + TypeScript + Tailwind CSS + Vite**, featuring a looping background video, animated hero content, and a fully responsive layout with a mobile menu overlay.

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:5173

## Build for production

```bash
npm run build
```

Output goes to `dist/` — deployable to any static host (Netlify, Vercel, GitHub Pages).

## Structure

- `src/App.tsx` — single-component page (navbar, mobile menu, hero, stats)
- `src/index.css` — Tailwind layers + fade-up/fade-in keyframe animations
- `index.html` — loads the PODIUM Sharp display font and Inter from Google Fonts
- `tailwind.config.js` — registers `font-podium` and `font-inter` families
