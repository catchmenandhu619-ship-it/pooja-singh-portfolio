const fetch = require('node-fetch');

(async () => {
  try {
    const response = await fetch('http://localhost:5173');
    const html = await response.text();
    
    // Check for pterodactyl image
    const pterodactylMatch = html.match(/ChatGPT_Image_May_23_2026/);
    console.log(`Pterodactyl URL in HTML: ${pterodactylMatch ? '✅ FOUND' : '❌ NOT FOUND'}`);
    
    // Check for dinosaur video
    const dinoVideoMatch = html.match(/magnific_use-img-2-as-the-exact-ba/);
    console.log(`Dinosaur video URL in HTML: ${dinoVideoMatch ? '✅ FOUND' : '❌ NOT FOUND'}`);
    
    // Count img tags
    const imgMatches = html.match(/<img/g);
    console.log(`Image tags found: ${imgMatches ? imgMatches.length : 0}`);
    
    // Count video tags
    const videoMatches = html.match(/<video/g);
    console.log(`Video tags found: ${videoMatches ? videoMatches.length : 0}`);
    
    // Check for SandTransitionImage component issues
    const sandFilterMatch = html.match(/sand-/);
    console.log(`Sand transition filters in HTML: ${sandFilterMatch ? '✅ FOUND' : '❌ NOT FOUND'}`);
    
  } catch (err) {
    console.error('Error:', err.message);
  }
})();
