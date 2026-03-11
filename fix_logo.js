const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

async function fixLogo() {
  // Source original uncropped logo (if available, else we just tighten the crop on the existing one)
  const inputPath = path.join(__dirname, 'public', 'auraiq-logo.png');
  const outputPath = path.join(__dirname, 'public', 'auraiq-logo.png');

  try {
    const metadata = await sharp(inputPath).metadata();
    
    // We will shrink the radius slightly to cut out those corner artifacts
    // and recreate a clean mask
    const size = Math.min(metadata.width, metadata.height);
    const radius = Math.floor(size * 0.45); // 90% of the size to avoid edges
    
    const circleSvg = `<svg width="${size}" height="${size}"><circle cx="${size / 2}" cy="${size / 2}" r="${radius}" fill="white"/></svg>`;

    const buffer = await sharp(inputPath)
      .resize(size, size)
      // First cut out the circle
      .composite([{
        input: Buffer.from(circleSvg),
        blend: 'dest-in'
      }])
      // Then trim the excess transparent space around the circle
      .trim()
      .png()
      .toBuffer();

    fs.writeFileSync(outputPath, buffer);
    console.log("Successfully fixed logo artifacts.");
    
    // Copy to extension paths
    const extIcons = [
      path.join(__dirname, '..', 'extension', 'icons', 'icon16.png'),
      path.join(__dirname, '..', 'extension', 'icons', 'icon48.png'),
      path.join(__dirname, '..', 'extension', 'icons', 'icon128.png'),
      path.join(__dirname, '..', 'extension', 'icons', 'auraiq-logo.png'),
      path.join(__dirname, '..', 'extension', 'dist', 'icons', 'icon16.png'),
      path.join(__dirname, '..', 'extension', 'dist', 'icons', 'icon48.png'),
      path.join(__dirname, '..', 'extension', 'dist', 'icons', 'icon128.png'),
      path.join(__dirname, '..', 'extension', 'dist', 'icons', 'auraiq-logo.png')
    ];
    
    for (const icon of extIcons) {
      if (fs.existsSync(path.dirname(icon))) {
         fs.writeFileSync(icon, buffer);
      }
    }
    console.log("Copied fixed image to all extension paths.");

  } catch (error) {
    console.error("Error processing image:", error);
  }
}

fixLogo();
