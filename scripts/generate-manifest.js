const fs = require('fs');
const path = require('path');
const { globSync } = require('glob');

const PACKS_PATTERN = '[a-z][a-z]/**/*.json';
const MANIFEST_PATH = path.join(__dirname, '../manifest.json');

const COUNTRY_NAMES = {
  'AR': 'Argentina'
};

function generateManifest() {
  console.log('Generating manifest...');

  const files = globSync(PACKS_PATTERN, { cwd: path.join(__dirname, '..') })
    .filter(f => !f.startsWith('node_modules/') && !f.startsWith('schemas/'))
    .map(f => f.replace(/\\/g, '/'))
    .sort();

  const manifest = {
    last_updated: new Date().toISOString(),
    country_names: COUNTRY_NAMES,
    files: files
  };

  fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2) + '\n');
  console.log(`✅ Manifest generated with ${files.length} files.`);
}

try {
  generateManifest();
} catch (error) {
  console.error('❌ Error generating manifest:', error);
  process.exit(1);
}
