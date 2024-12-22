const fs = require('fs');
const path = require('path');

// Define the root project directory
const rootDir = path.resolve(__dirname);

// Scan for all dist/ or build/ directories
const buildDirs = [];
const scanDirectories = (dir) => {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory() && (entry.name === 'dist' || entry.name === 'build')) {
      buildDirs.push(fullPath.replace(`${rootDir}/`, '') + '/**');
    } else if (entry.isDirectory()) {
      scanDirectories(fullPath);
    }
  }
};

scanDirectories(rootDir);

// Prepare the turbo.json configuration
const turboConfig = {
  pipeline: {
    build: {
      outputs: buildDirs,
    },
  },
};

// Write to turbo.json
fs.writeFileSync(
  path.join(rootDir, 'turbo.json'),
  JSON.stringify(turboConfig, null, 2)
);

console.log('Turbo.json updated with outputs:', buildDirs);
