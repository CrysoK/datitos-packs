const fs = require('fs');
const path = require('path');
const Ajv = require('ajv');
const addFormats = require('ajv-formats');
const { globSync } = require('glob');

const ajv = new Ajv({ allErrors: true });
addFormats(ajv);

const SCHEMAS_DIR = path.join(__dirname, '../schemas');
const PACKS_PATTERN = '[a-z][a-z]/**/*.json';

// Cache for loaded schemas
const schemaCache = {};

function getSchema(version) {
  if (schemaCache[version]) return schemaCache[version];

  const schemaPath = path.join(SCHEMAS_DIR, `v${version}.json`);
  if (!fs.existsSync(schemaPath)) {
    throw new Error(`Schema version v${version} not found at ${schemaPath}`);
  }

  const schemaContent = JSON.parse(fs.readFileSync(schemaPath, 'utf8'));
  schemaCache[version] = ajv.compile(schemaContent);
  return schemaCache[version];
}

console.log('🔍 Starting multi-version pack validation...');

const files = globSync(PACKS_PATTERN, { cwd: path.join(__dirname, '..') });
let hasErrors = false;
let successCount = 0;

files.forEach((fileRelPath) => {
  const filePath = path.join(__dirname, '..', fileRelPath);
  
  // Skip if it's not a pack file (though glob pattern should handle it)
  if (fileRelPath.startsWith('schemas/') || fileRelPath.startsWith('node_modules/')) return;

  try {
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    const version = data.schema_version;

    if (version === undefined) {
      console.error(`❌ ${fileRelPath}: Missing "schema_version"`);
      hasErrors = true;
      return;
    }

    const validate = getSchema(version);
    const valid = validate(data);

    if (!valid) {
      console.error(`❌ ${fileRelPath} (v${version}): Validation errors:`);
      validate.errors.forEach((err) => {
        console.error(`   - ${err.instancePath} ${err.message}`);
      });
      hasErrors = true;
    } else {
      console.log(`✅ ${fileRelPath} (v${version}): Valid`);
      successCount++;
    }
  } catch (error) {
    console.error(`❌ ${fileRelPath}: ${error.message}`);
    hasErrors = true;
  }
});

console.log('\n----------------------------------------');
if (hasErrors) {
  console.error('💥 Validation failed.');
  process.exit(1);
} else {
  console.log(`✨ All ${successCount} packs validated successfully!`);
}
