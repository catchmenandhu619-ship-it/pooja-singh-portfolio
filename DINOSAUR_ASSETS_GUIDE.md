# Dinosaur Assets Setup Guide

## Problem Identified
All dinosaur images and video were hosted on Cloudinary and returning **HTTP 401 Unauthorized** errors, making them inaccessible on all devices (mobile, desktop, etc).

## Solution Implemented
Assets have been moved from Cloudinary to local `/public/assets/dinosaurs/` folder for better reliability and control.

## What You Need To Do

### Option A: Use Your Original Images (RECOMMENDED)
If you have the original dinosaur images/video files:

1. **Locate your original files** (check Downloads, Google Drive, Dropbox, etc.)
2. **Copy them to**: `/public/assets/dinosaurs/`
3. **Rename them** to match the required filenames below

### Option B: Download from Cloudinary
If you still have access to your Cloudinary account:

1. Log in to Cloudinary
2. Find and download these images:
   - `01_udnber.png` → rename to `chapter-01.jpg`
   - `02_pmvxxl.png` → rename to `chapter-02.jpg`
   - `03_hcp3jc.png` → rename to `chapter-03.jpg`
   - `04_get63z.png` → rename to `chapter-04.jpg`
   - `05_kz1tyu.png` → rename to `chapter-05.jpg`
   - `ChatGPT_Image_May_23_2026_12_24_44_PM_1_lv1dne.png` → rename to `pterodactyl.png`
   - `magnific_use-img-2-as-the-exact-ba_Piu3X0W42C_wnrc8f.mp4` → rename to `walking-dino.mp4`

3. Place all files in `/public/assets/dinosaurs/`

### Option C: Create New Dinosaur Images
If you don't have the original files, you can:

1. Use an AI image generator (Midjourney, DALL-E, Stable Diffusion) to create dinosaur images
2. Suggested prompts:
   - Chapter 1: "Realistic T-Rex dinosaur skeleton fossil"
   - Chapter 2: "Triceratops fossil display"
   - Chapter 3: "Stegosaurus prehistoric creature"
   - Chapter 4: "Ancient marine reptile fossil"
   - Chapter 5: "Large Brachiosaurus dinosaur"
   - Pterodactyl: "Pterodactyl skeleton flying silhouette"

3. Export as `.jpg` or `.png` and place in `/public/assets/dinosaurs/`

## Required File Structure

```
public/
└── assets/
    └── dinosaurs/
        ├── chapter-01.jpg          (800x600px minimum)
        ├── chapter-02.jpg
        ├── chapter-03.jpg
        ├── chapter-04.jpg
        ├── chapter-05.jpg
        ├── pterodactyl.png         (1100x600px minimum)
        └── walking-dino.mp4        (video file)
```

## Current Status

✅ **Placeholder files created** - Site will work with placeholders until you add real images  
✅ **Code updated** - All URLs point to local `/public/assets/dinosaurs/`  
✅ **Mobile compatible** - Local assets work on all devices (mobile, desktop, tablet)

## What Happens Now

- **Hero Section**: Walking dinosaur video will show placeholder
- **Section 2**: Chapter gallery will display placeholder images
- **Section 3**: Pterodactyl image will show placeholder

Once you replace the placeholder files with actual dinosaur images, they will:
- Display immediately on all devices
- Be much faster (no Cloudinary API calls)
- Work offline
- Be fully responsive

## File Format Guidelines

**Images:**
- Format: JPG, PNG, or WebP
- Recommended resolution:
  - Chapter images: 800px × 600px or higher
  - Pterodactyl: 1100px × 600px or higher
- File size: Keep under 500KB each for performance

**Video:**
- Format: MP4 (H.264 codec recommended)
- Resolution: 1920×1080px minimum
- Duration: 10-30 seconds ideal
- File size: Keep under 5MB for fast loading

## Quick Start

1. Download your original dinosaur images
2. Place them in `/public/assets/dinosaurs/`
3. Restart the dev server (npm run dev)
4. Images will display immediately on all devices ✅

## Support

If you need help:
- Check that file names match exactly (case-sensitive)
- Ensure files are in the correct folder: `/public/assets/dinosaurs/`
- Clear browser cache if old images still show (Ctrl+Shift+Delete)
- Test on mobile by scanning the QR code or visiting the Vercel deployment

---

**Status**: ✅ Ready to use - Just add your dinosaur images!
