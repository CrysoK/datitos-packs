const fs = require('fs');
const path = require('path');
const { globSync } = require('glob');

const PACKS_PATTERN = '[a-z][a-z]/**/*.json';
const MANIFEST_PATH = path.join(__dirname, '../manifest.json');

const countryDisplayNames = new Intl.DisplayNames(['es'], { type: 'region' });

const getCountryName = (code) => {
  try {
    return countryDisplayNames.of(code.toUpperCase()) || code;
  } catch {
    return code;
  }
};

function generateManifest() {
  console.log('Generating manifest...');

  const files = globSync(PACKS_PATTERN, { cwd: path.join(__dirname, '..') })
    .filter(f => !f.startsWith('node_modules/') && !f.startsWith('schemas/'))
    .map(f => f.replace(/\\/g, '/'))
    .sort();

  const countryNames = {};
  files.forEach(f => {
    const parts = f.split('/');
    if (parts.length > 0) {
      const code = parts[0].toUpperCase();
      if (!countryNames[code]) {
        countryNames[code] = getCountryName(code);
      }
    }
  });

  const manifest = {
    last_updated: new Date().toISOString(),
    country_names: countryNames,
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
