# Pooja Singh Portfolio — Complete Handover Documentation

**Document Updated:** June 21, 2026
**Project:** Pooja Singh Creative Portfolio Website
**Status:** Live in Production ✅ (Major VFX Section Redesigns Complete)

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
│       ├── figurines/           PNG images (legacy, removed from main flow)
│       └── videos/
│           ├── hero_main.mp4                              (14.9 MB) — Hero section
│           ├── dino_whatido.mp4                           (21.3 MB) — "What I Do" dinosaur
│           ├── char_running.mp4                           (18.7 MB) — Work chapter 1
│           ├── char_combat.mp4                            (10.6 MB) — Work chapter 2
│           ├── char_standing.mp4                          (11.1 MB) — Work chapter 3
│           ├── char_leaning.mp4                           (8.8 MB)  — Work chapter 4
│           ├── char_jumping.mp4                           (15.2 MB) — Work chapter 5
│           └── skills_hero.mp4                            (25.1 MB) — Skills section hero
├── src/
│   ├── App.tsx          Main component (~1620 lines, 2 major sections redesigned)
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

### Session 3 — June 21, 2026

#### 10. Extended "What I Do" Video to Cover Full Section
- Changed video wrapper from `inset-x-0 top-0` with `height: min(75vw, 100%)` to full `inset-0`
- Dinosaur background now covers entire section including career history cards
- Removed CSS `object-position` constraint, using `object-center` for balanced crop
- **Result:** Unified cinematic experience with dino playing behind heading, pills, and career cards

#### 11. Reimagined "Selected Work" Section as Hollywood VFX Showcase
- **Replaced coverflow carousel** (figurines-based) with **full-screen immersive cinematic layout**
- **5 character hero videos** instead of CloudFront edits — running, combat, standing, leaning, jumping poses
- **Aggressive VFX stack:**
  - Letterbox bars (top/bottom, black, 7vh) with progress dots and section counter
  - Horizontal cut-lines that sweep on chapter change (like film splice effect)
  - Accent color bloom glow (radial gradient behind character, per-chapter color)
  - Spotlight vignette + bottom gradient + left vignette
  - Film grain (0.28 opacity) + scanlines overlay
  - Ghost word (accent-tinted, 34vw, 9% opacity) sliding in/out with scale animation
  - **Giant chapter number** (50vw+, 11% opacity) positioned bottom-right as typographic backdrop
  - Vertical category name (rotated, ghostly) on right side

- **New bottom letterbox bar system:**
  - `↓ SCROLL TO EXPLORE` hint
  - Animated skills ticker showing chapter-specific tools (stagger-animated)
  - Accent-colored progress line (right side)

- **Content animations:**
  - Chapter number + rule + category with sequential reveals
  - Skill tags (4 per chapter) with scale + y stagger entrance
  - Title: word-by-word stagger reveal (70ms between words)
  - Description: fade-in on slight delay

- **Right-side vertical timeline:** bars that grow/shrink for active chapter (clickable to jump)

**New constant `CHAPTER_SKILLS`:** 4 editorial metadata items per work category
- YouTube Edits: Premiere Pro, Reels & Shorts, Color Grading, Retention Hooks
- Motion Graphics: After Effects, Kinetic Text, Lower Thirds, Motion Design
- Thumbnail Design: Photoshop, Canva Pro, CTR-First Design, Social Cards
- Brand Decks: Illustrator, Pitch Decks, Brand Guides, Visual Identity
- AI Content: Midjourney, HeyGen Avatar, Sora AI, Minimax

#### 12. Reimagined "Skills" Section — 3D Scroll-Driven Orbital Reveal
- **Completely new mechanic:** Character becomes the **central anchor**, skills **orbit around** as user scrolls
- **Hero character video:** Sai fighter with red bandana, **frozen center** (not playing, scrubbed via scroll progress)
- **Scroll-driven reveals:** 8 total skills per category, each appears at different position around character
  - Positions cycle: left (−35%, +60%) → right (+35%, +55%) → left-top → right-top → left-bottom → right-bottom → center-top → left-bottom
  - Stagger delays: 0ms to 1.05s between each skill reveal
  - Smooth scale + position animation (0.72s ease)

- **Skill cards:**
  - Pink/Blue/Green bordered boxes with accent-color fill (8% opacity)
  - Numbered badges (1-8, positioned top-right)
  - Glowing pulse animation (2.8s loop, box-shadow glow)
  - Hover scale: 1 → 1.08

- **Video scrubbing:** As user scrolls, `videoRef.currentTime` advances based on scroll progress
  - Video plays through ~70% of duration across entire section
  - Creates illusion of video playing while user scrolls through skills

- **VFX stack:**
  - Radial vignette (ellipse 50% × 55% centered)
  - Accent bloom glow (110px blur, 10% opacity, behind character)
  - Film grain (24% opacity) + scanlines
  - Letterbox bars (7vh, frosted glass: `rgba(0,0,0,0.85)` + blur)

- **Top letterbox bar:**
  - Left: `[ 04 ] MY SKILLSET`
  - Center: Animated category name (color = accentColor)
  - Right: Progress counter `02 / 04`

- **Bottom letterbox bar:**
  - Left: `↓ SCROLL TO REVEAL SKILLS AROUND THE CHARACTER` + scroll hint
  - Right: Animated pulse indicator (`•••` with bounce animation)
  - Bar background: `${accentColor}08` + blur, top border `${accentColor}22`

- **Color rotation per category:**
  - Technical Skills: #6EB5FF (blue)
  - AI Toolset: #E882B4 (pink)
  - Specializations: #6BBF7A (green)

- **Total scroll height:** 800svh (8 viewport heights) to accommodate all skills across all 4 categories

---

## Current Video Setup

### Section 2: "What I Do" (Dinosaur)
- **File in use:** `/assets/videos/dino_whatido.mp4` (21.3 MB)
- **Layout:** Full-screen background, covers entire section including career cards
- **Wrapper:** `absolute inset-0` (fills section edge-to-edge)
- **Video styling:** `object-cover object-center` with spotlight vignette + bottom gradient
- **Watermark hiding:** Gemini logo buried under bottom gradient (58% height fade-to-black)

### Section 3: "Selected Work" (5 Character Videos)
- **Files in use:**
  - `/assets/videos/char_running.mp4` (18.7 MB) — Chapter 1: YouTube Edits
  - `/assets/videos/char_combat.mp4` (10.6 MB) — Chapter 2: Motion Graphics
  - `/assets/videos/char_standing.mp4` (11.1 MB) — Chapter 3: Thumbnail Design
  - `/assets/videos/char_leaning.mp4` (8.8 MB) — Chapter 4: Brand Decks
  - `/assets/videos/char_jumping.mp4` (15.2 MB) — Chapter 5: AI Content
- **Layout:** Scroll-driven chapter progression (5 chapters × 100svh each)
- **Crossfade:** Videos fade in/out at 0.88s easing
- **Vignette:** Spotlight effect + bottom gradient + left vignette
- **Accent color:** Per-chapter crimson or warm gold, with bloom glow behind character
- **Watermark hiding:** Bottom gradient + vignette bury any Gemini watermarks

### Section 4: "Skills" (Character Hero)
- **File in use:** `/assets/videos/skills_hero.mp4` (25.1 MB) — Sai fighter with red bandana
- **Layout:** Scroll-driven 4-slide progression (1 intro + 3 category slides)
- **Video styling:** `object-cover object-center` with spotlight vignette
- **Accent colors:** Blue (#6EB5FF) for Tech → Pink (#E882B4) for AI → Green (#6BBF7A) for Craft
- **Watermark hiding:** Bottom gradient + side vignettes push watermark below fold

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
| `74f2a97` | Reimagine Skills: scroll-driven 3D orbital reveal with character as center anchor, skills orbit around ← **latest** |
| `945a10a` | Update HANDOVER.md: document Session 3 redesigns (work + skills sections), add latest video assets |
| `3c213d3` | Reimagine Skills section: full-screen character hero, skill card grid, letterbox bars, cut-lines, accent glow |
| `84f0f7f` | Enhance work section: letterbox bars, cut-lines, skill tags, ghost number, word-stagger reveal, skills ticker |
| `ebc4989` | Reimagine Selected Work as immersive cinematic chapter showcase with 5 character videos |
| `5717ddc` | Extend dino video to cover full What I Do section including career cards |
| `2fa6f35` | Sweet spot zoom: 4:3 wrapper + object-cover hides Gemini watermark |
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

### Section Videos (Now in Production)
| File | Size | Status |
|---|---|---|
| `D:\hf_20260606_154941_df1a96e1-a06f-450c-bd02-d863414cc1a0_202606210318.mp4` | — | **Hero section video (copied to assets)** |
| `D:\Character_running_forward_holdin…_202606210218.mp4` | 18.7 MB | **Work chapter 1 (copied to assets)** |
| `D:\Character_in_combat_stance_202606210205.mp4` | 10.6 MB | **Work chapter 2 (copied to assets)** |
| `D:\Character_standing_in_white_envi…_202606210213.mp4` | 11.1 MB | **Work chapter 3 (copied to assets)** |
| `D:\Character_leaning_against_wall_202606210217.mp4` | 8.8 MB | **Work chapter 4 (copied to assets)** |
| `D:\Character_jumping_and_landing_wi…_202606210209.mp4` | 15.2 MB | **Work chapter 5 (copied to assets)** |
| `D:\Character_with_red_bandana_sai_202606210450.mp4` | 25.1 MB | **Skills section hero (copied to assets, use up to 7.15sec)** |

### Legacy Videos (Dinosaur & Dinosaur Variants)
| File | Size | Notes |
|---|---|---|
| `D:\Glass_T-rex_walking_white_backgr._202606172104.mp4` | 9.4 MB | **"What I Do" dino video (current)** |
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

**Document Version:** 3.1
**Last Updated:** June 21, 2026 (Skills Section 3D Orbital Redesign)
**Latest Commit:** `74f2a97`
