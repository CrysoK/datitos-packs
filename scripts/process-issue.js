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

  // 2. Determinar Path desde el título: [CONTRIBUCION] AR - Company (type)
  const titleMatch = issueTitle.match(/\[CONTRIBUCION\] ([A-Z]{2}) - (.+) \((.+)\)/);
  if (!titleMatch) {
    console.error('Título del issue no tiene el formato esperado');
    process.exit(1);
  }

  const country = titleMatch[1].toLowerCase();
  const company = titleMatch[2].toLowerCase().replace(/\s+/g, '-');
  const typeInternal = titleMatch[3]; // prepaid | postpaid

  const fileName = typeInternal === 'postpaid' ? 'abono.json' : 'prepago.json';
  const targetDir = path.join(country, company);
  const targetPath = path.join(targetDir, fileName);

  console.log(`Procesando contribución para: ${targetPath}`);

  // 3. Asegurar que el directorio existe
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  // 4. Escribir archivo
  fs.writeFileSync(targetPath, JSON.stringify(jsonData, null, 2) + '\n');

  console.log(`Archivo escrito exitosamente en ${targetPath}`);
  
  // Guardar path para el próximo paso del workflow
  fs.appendFileSync(process.env.GITHUB_OUTPUT, `target_path=${targetPath}\n`);
  fs.appendFileSync(process.env.GITHUB_OUTPUT, `country=${country.toUpperCase()}\n`);
  fs.appendFileSync(process.env.GITHUB_OUTPUT, `company=${titleMatch[2]}\n`);
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
