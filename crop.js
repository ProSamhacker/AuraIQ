const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

async function cropCircular() {
  const inputPath = path.join(__dirname, 'public', 'auraiq-logo.png');
  const outputPath = path.join(__dirname, 'public', 'auraiq-logo.png');

  try {
    const metadata = await sharp(inputPath).metadata();
    const size = Math.min(metadata.width, metadata.height);

    const circleSvg = `<svg width="${size}" height="${size}"><circle cx="${size / 2}" cy="${size / 2}" r="${size / 2}" fill="white"/></svg>`;

    const buffer = await sharp(inputPath)
      .resize(size, size)
      .composite([{
        input: Buffer.from(circleSvg),
        blend: 'dest-in'
      }])
      .png()
      .toBuffer();

    fs.writeFileSync(outputPath, buffer);
    console.log("Successfully cropped circular icon.");
    
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
    console.log("Copied to all extension paths.");

  } catch (error) {
    console.error("Error processing image:", error);
  }
}

cropCircular();
