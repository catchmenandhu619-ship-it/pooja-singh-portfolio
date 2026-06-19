# Pooja Singh Portfolio — Complete Handover Documentation

**Document Updated:** June 20, 2026
**Project:** Pooja Singh Creative Portfolio Website
**Status:** Live in Production ✅

---

## Table of Contents

1. [Important Links](#important-links)
2. [Project Overview](#project-overview)
3. [Technology Stack](#technology-stack)
4. [Project Structure](#project-structure)
5. [All Changes Made](#all-changes-made)
6. [Current Video Setup](#current-video-setup)
7. [Local Development](#local-development)
8. [Deployment](#deployment)
9. [Troubleshooting](#troubleshooting)
10. [Contact](#contact)

---

## Important Links

| Resource | URL |
|---|---|
| **Live Website** | https://pooja-singh-portfolio-11mc.vercel.app/ |
| **GitHub Repository** | https://github.com/catchmenandhu619-ship-it/pooja-singh-portfolio |
| **Vercel Dashboard** | https://vercel.com/dashboard (login with GitHub account) |
| **Local Dev Server** | http://localhost:5173 (run `npm run dev`) |

---

## Project Overview

Pooja Singh Portfolio is a modern, high-performance creative portfolio website showcasing video editing, motion graphics, thumbnail design, and AI-powered content creation work.

- **Framework:** React 18 + TypeScript + Vite
- **Hosting:** Vercel (auto-deploys on every GitHub push to `main`)
- **Branch:** `main`
- **Build command:** `npm run build` → runs `tsc && vite build`

---

## Technology Stack

| Layer | Library / Tool | Version |
|---|---|---|
| UI Framework | React | 18.3.1 |
| Language | TypeScript | 5.5.3 |
| Build Tool | Vite | 5.3.4 |
| Styling | Tailwind CSS | 3.4.6 |
| Animation | Framer Motion (`motion/react`) | 12.40.0 |
| Smooth Scroll | Lenis | 1.3.23 |
| Icons | Lucide React | 0.452.0 |
| Hosting | Vercel | — |
| Video Processing | FFmpeg 8.1.1 | (local, not in repo) |

---

## Project Structure

```
pooja-portfolio/
├── public/
│   └── assets/
│       ├── figurines/           PNG images for skills carousel
│       └── videos/
│           ├── Glass_T-rex_walking_white_backgr._202606172104.mp4  (9.4 MB) ← ACTIVE
│           ├── Flow_202606172104.mp4                                (9.1 MB) ← unused
│           └── Skeletal_T-rex_original_grainy.mp4                 (10.8 MB) ← backup
├── src/
│   ├── App.tsx          Main component (~1403 lines)
│   ├── main.tsx         Entry point
│   ├── index.css        Tailwind + custom styles
│   └── vite-env.d.ts
├── vite.config.ts
├── tailwind.config.js
├── tsconfig.json
├── package.json
└── HANDOVER.md          This file
```

---

## All Changes Made

### Session 1 — June 17–18, 2026

#### 1. Replaced NFT Animation with T-Rex Videos
- Removed the original cartoon NFT animation video from the "What I Do" section
- Added `Flow_202606172104.mp4` as the base layer
- Added `Skeletal_T-rex_walking_white_void_202606172101.mp4` as a top layer for a "3D" effect

#### 2. Fixed TypeScript Build Failure on Vercel
- Root cause: `tsc && vite build` runs with `noUnusedLocals: true`
- When video `src` was hardcoded as a string literal, the `DINO_VIDEO`/`TREX_VIDEO` constants became unused → TS6133 error → Vercel build failed silently, keeping the old video live
- Fix: wire constants back into JSX (`src={TREX_VIDEO}`)

#### 3. Fixed Wrong Preview Directory
- The local preview server was pointing to `Downloads/files/pooja-portfolio` (stale copy) instead of `Downloads/pooja-portfolio` (edited copy)
- Fixed `.claude/launch.json` to point to the correct path

#### 4. Fixed Double Exposure Issue
- Both `Flow` and `Skeletal_T-rex` videos turned out to be the same footage
- Stacking them at 0.95 opacity created ghosting/double-exposure
- Fix: removed the Flow video layer entirely — single T-rex video only

#### 5. Removed Dark Overlay / Made Video Bright
- Removed `<div className="absolute inset-0 bg-black/55 md:bg-black/45" />` overlay
- Updated heading color from `text-white` → `text-[#111]`
- Updated section label from `text-white` → `text-[#111]`
- Container background changed to `bg-white`

---

### Session 2 — June 20, 2026

#### 6. Grain Removal Experiments
- Attempted FFmpeg `hqdn3d=6:5:9:6.75` denoising on the original T-rex video
- Attempted `curves` filter to push gray background to pure white → caused visible tonal quality loss
- Attempted CSS `filter: brightness(1.1) contrast(2)` → too harsh, looked over-processed
- **Final decision:** Restored original untouched source video (no processing artifacts)

#### 7. Switched to High-Detail Bone-Colored T-Rex
- Replaced with `A_highly_detailed_skeletal_Tyr.mp4` — realistic bone texture, 720p, 2.8 MB
- Better quality appearance and naturally lighter background

#### 8. Switched to Glass Crystal T-Rex (Current)
- Replaced with `Glass_T-rex_walking_white_backgr._202606172104.mp4` — glass/crystal translucent skeleton, 1920×1080, 9.4 MB
- Near-white background, premium look, no processing needed

#### 9. Fixed Zoom Level & Hidden Gemini Watermark
- `object-cover` (default): too zoomed in, T-rex filled frame too close
- `object-contain object-top`: too zoomed out, Gemini watermark visible in bottom-right corner
- **Final solution:** 4:3 aspect ratio wrapper (`height: min(75vw, 100%)`) + `object-cover`
  - At all viewport widths, `object-cover` crops the right side enough to push the watermark off-screen
  - Zoom level sits between the two extremes — full skeleton visible, natural scale

---

## Current Video Setup

**File in use:** `Skeletal_T-rex_walking_white_void_202606172101.mp4`
*(This filename is kept for code compatibility — the actual content is the Glass T-rex video)*

**Source file:** `D:\Glass_T-rex_walking_white_backgr._202606172104.mp4`

**Code location:** `src/App.tsx`

```tsx
// Line ~80
const TREX_VIDEO = '/assets/videos/Skeletal_T-rex_walking_white_void_202606172101.mp4'

// "What I Do" section — video wrapper
<motion.div
  className="pointer-events-none absolute inset-x-0 top-0 z-0 overflow-hidden bg-white"
  style={{ height: 'min(75vw, 100%)' }}
>
  <video
    autoPlay loop muted playsInline preload="auto"
    className="absolute inset-0 h-full w-full object-cover"
    src={TREX_VIDEO}
  />
</motion.div>
```

**Why `height: min(75vw, 100%)`:**
The wrapper is capped to a 4:3 aspect ratio. Because this is taller than the video's native 16:9, `object-cover` must crop the left and right sides to fill the height. This right-side crop pushes the Gemini watermark (bottom-right corner of video) off-screen at every viewport width from mobile (375px) to desktop (1440px+).

---

## Local Development

### Prerequisites
- Node.js 18+
- npm 9+

### Setup

```bash
# Clone the repo
git clone https://github.com/catchmenandhu619-ship-it/pooja-singh-portfolio.git
cd pooja-singh-portfolio

# Install dependencies
npm install

# Start dev server (opens at http://localhost:5173)
npm run dev
```

### Build & Preview

```bash
# Production build
npm run build

# Preview production build locally
npm run preview
```

### Important: TypeScript Strictness
`tsconfig.json` has `"noUnusedLocals": true`. Any declared variable that is unused will **fail the build**. If you declare a video constant, it must be used in JSX.

---

## Deployment

### Auto-Deploy (Normal Workflow)

Every push to `main` triggers a Vercel deployment automatically:

```bash
git add .
git commit -m "Your change description"
git push origin main
# Vercel detects push, builds, and deploys in ~1-2 minutes
```

### Verify Deployment

1. Go to https://vercel.com/dashboard
2. Find `pooja-singh-portfolio` project
3. Check latest deployment status — should say **Ready**
4. Hard refresh the live site (Ctrl+Shift+R) to bypass browser cache

### If Vercel Build Fails

Vercel keeps the **last successful deployment** live. To diagnose:
1. Check Vercel dashboard → deployment → Build Logs
2. Most common cause: TypeScript error (`noUnusedLocals`)
3. Fix locally: `npm run build` — if it passes locally, it will pass on Vercel

---

## Complete Commit History (This Project)

| Commit | Description |
|---|---|
| `2fa6f35` | Sweet spot zoom: 4:3 wrapper + object-cover hides Gemini watermark ← **latest** |
| `6e780d8` | Zoom out: object-contain object-top |
| `ffeebaa` | Swap to glass crystal T-rex video |
| `af64df4` | Replace with high-detail bone skeleton video |
| `4121022` | Restore original video quality, remove CSS filter |
| `b9aece3` | HQ denoise + CSS brightness/contrast filter |
| `6b9b21a` | Curves filter for white background (later reverted) |
| `14fcdae` | FFmpeg hqdn3d grain removal |
| `18b6b40` | Fix: single T-rex, remove double exposure + dark overlay |
| `e952f74` | Fix TS6133 build failure (unused constants) |
| `33be2f4` | Add 3D layered video to What I Do section |
| `eb5d42e` | Work carousel palette matches hero |
| `a0fb5dd` | Coverflow scroll-driven work carousel |
| `792ae37` | Reveal animations on hero + project thumbnails |
| `aaa9b88` | Lenis smooth scroll + heading reveals |
| `967dc34` | Scroll-driven skills carousel |

---

## Troubleshooting

### Old video still showing on live site
1. Check Vercel build logs — the build may have failed silently
2. Most likely cause: unused TypeScript variable → run `npm run build` locally
3. Hard refresh browser (Ctrl+Shift+R) to bypass cache

### Video not playing
- All videos must be in `public/assets/videos/`
- Filename in `src={TREX_VIDEO}` constant must exactly match the file on disk (case-sensitive)
- Check browser console for 404 errors

### Gemini watermark reappears
- The watermark is hidden by cropping, not removing
- If you change the video wrapper CSS (especially height), recalculate whether the right-side crop still applies
- Rule: wrapper must be taller than 16:9 aspect ratio so `object-cover` crops horizontally

### Local dev server not reflecting changes
- Ensure `vite.config.ts` has `server: { watch: { usePolling: true } }` (required on Windows)
- Check that `.claude/launch.json` points to the correct project directory

---

## Video Assets on D: Drive (Source Files)

These are the original source files used during development. Keep these as backup.

| File | Size | Notes |
|---|---|---|
| `D:\Glass_T-rex_walking_white_backgr._202606172104.mp4` | 9.4 MB | **Current live video** |
| `D:\Glass_T-rex_walking_white_backgr._202606172103.mp4` | 11.5 MB | Close-up head pan (not used) |
| `D:\Glass_T-rex_walking_white_backgr._202606172102.mp4` | 10.7 MB | Alternative (not used) |
| `D:\Skeletal_T-rex_walking_white_void_202606172101.mp4` | 10.8 MB | Original black skeleton |
| `D:\Flow_202606172104.mp4` | 9.5 MB | Flow animation (not used) |
| `D:\A_highly_detailed_skeletal_Tyr.mp4` | 2.8 MB | Bone-colored skeleton (not used) |

---

## Contact

**Owner:** Pooja Singh
**Email:** Poojasingh10099@gmail.com
**Phone:** +91 62050 11981
**Location:** Delhi, Shahdara

---

**Document Version:** 2.0
**Last Updated:** June 20, 2026
**Latest Commit:** `2fa6f35`
