const fs = require('fs');
const path = require('path');

async function run() {
  const issueBody = process.env.ISSUE_BODY;
  const issueTitle = process.env.ISSUE_TITLE;

  if (!issueBody || !issueTitle) {
    console.error('Missing ISSUE_BODY or ISSUE_TITLE');
    process.exit(1);
  }

  // 1. Extraer JSON
  const jsonMatch = issueBody.match(/<!-- CONTRIBUTION_DATA_START -->\s*```json\s*([\s\S]*?)\s*```\s*<!-- CONTRIBUTION_DATA_END -->/);
  if (!jsonMatch) {
    console.error('No se encontró el bloque de datos JSON en el issue');
    process.exit(1);
  }

  const jsonData = JSON.parse(jsonMatch[1]);

  // 2. Determinar Path
  let targetPath = '';
  let country = '';
  let company = '';
  let companyLabel = '';

  // Intentar extraer del cuerpo (vía App)
  const pathMatch = issueBody.match(/-\s\*\*Archivo a modificar\*\*:\s`(.+?)`/);
  if (pathMatch) {
    targetPath = pathMatch[1];
    const parts = targetPath.split('/');
    country = parts[0].toUpperCase();
    company = parts[1]; // Mantener slug original del path
    companyLabel = company.charAt(0).toUpperCase() + company.slice(1);
  } else {
    console.error('❌ Error: No se encontró el path explícito ("Archivo a modificar") en el cuerpo del issue.');
    process.exit(1);
  }

  const targetDir = path.dirname(targetPath);

  console.log(`Procesando contribución para: ${targetPath}`);

  // 3. Asegurar que el directorio existe
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  // 4. Escribir archivo
  fs.writeFileSync(targetPath, JSON.stringify(jsonData, null, 2) + '\n');

  console.log(`Archivo escrito exitosamente en ${targetPath}`);
  
  // 5. Guardar outputs para el próximo paso del workflow
  const fileName = path.basename(targetPath);
  const listName = fileName.replace('.json', '');
  const listLabel = listName.charAt(0).toUpperCase() + listName.slice(1);

  fs.appendFileSync(process.env.GITHUB_OUTPUT, `target_path=${targetPath}\n`);
  fs.appendFileSync(process.env.GITHUB_OUTPUT, `country=${country.toUpperCase()}\n`);
  fs.appendFileSync(process.env.GITHUB_OUTPUT, `company=${companyLabel}\n`);
  fs.appendFileSync(process.env.GITHUB_OUTPUT, `list_name=${listLabel}\n`);
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
