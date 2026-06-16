// Create placeholder dinosaur images using Canvas API simulation
const fs = require('fs');
const path = require('path');

// Create directory
const dir = path.join(process.cwd(), 'public/assets/dinosaurs');
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

// Create simple placeholder SVGs
const placeholders = [
  { name: 'chapter-01.jpg', text: '🦕 Age of Dinosaurs' },
  { name: 'chapter-02.jpg', text: '🦖 Fossils & Life' },
  { name: 'chapter-03.jpg', text: '🦕 Mesozoic Reptiles' },
  { name: 'chapter-04.jpg', text: '🦑 Marine Fossils' },
  { name: 'chapter-05.jpg', text: '🦖 Prehistoric Giants' },
];

placeholders.forEach(({ name, text }) => {
  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="800" height="600" viewBox="0 0 800 600" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#1a1a1a;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#333333;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="800" height="600" fill="url(#grad)"/>
  <text x="400" y="250" font-size="48" fill="#ffffff" text-anchor="middle" font-weight="bold">
    ${text}
  </text>
  <text x="400" y="350" font-size="24" fill="#888888" text-anchor="middle">
    [Replace with actual dinosaur image]
  </text>
  <text x="400" y="450" font-size="16" fill="#666666" text-anchor="middle">
    Place your image file: /public/assets/dinosaurs/${name}
  </text>
</svg>`;

  fs.writeFileSync(path.join(dir, name), svg);
  console.log(`✅ Created: ${name}`);
});

// Create pterodactyl placeholder
const pterodactylSvg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="1100" height="600" viewBox="0 0 1100 600" xmlns="http://www.w3.org/2000/svg">
  <rect width="1100" height="600" fill="#fcfcfc"/>
  <g opacity="0.15">
    <text x="550" y="300" font-size="72" fill="#000000" text-anchor="middle" font-weight="bold">
      🦖 PTERODACTYL
    </text>
    <text x="550" y="400" font-size="24" fill="#000000" text-anchor="middle">
      [Replace with actual pterodactyl image]
    </text>
  </g>
</svg>`;

fs.writeFileSync(path.join(dir, 'pterodactyl.png'), pterodactylSvg);
console.log('✅ Created: pterodactyl.png');

// Create dummy video file (1KB placeholder)
const videoPlaceholder = Buffer.from('DUMMY_VIDEO_PLACEHOLDER_FILE');
fs.writeFileSync(path.join(dir, 'walking-dino.mp4'), videoPlaceholder);
console.log('✅ Created: walking-dino.mp4 (placeholder)');

console.log('\n📋 NEXT STEPS:');
console.log('1. Replace placeholder files with actual dinosaur images');
console.log('2. Place files in: /public/assets/dinosaurs/');
console.log('3. Supported formats: .jpg, .png, .webp for images; .mp4, .webm for video');
console.log('\nOriginal Cloudinary URLs (for reference):');
console.log('- Chapter 1: chapter-01.jpg');
console.log('- Chapter 2: chapter-02.jpg');
console.log('- Chapter 3: chapter-03.jpg');
console.log('- Chapter 4: chapter-04.jpg');
console.log('- Chapter 5: chapter-05.jpg');
console.log('- Pterodactyl: pterodactyl.png');
console.log('- Video: walking-dino.mp4');
