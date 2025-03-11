import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Add new specs to be deployed to Bump here
const SPEC_MAPPING = [
  {
    doc: 'e58f5bdf-b5e2-43b8-93e3-0cd8372ec96a',
    file: 'openapi/v1-deprecated/v1.json',
    branch: 'main',
  },
];

function handleAdminAPIv2() {
  const docId = 'd56a90c4-0880-4495-83d8-04fad2429ad7';
  const directory = 'openapi/v2';
  const filePath = path.join(__dirname, `../../${directory}/versions.json`);
  const versions = JSON.parse(fs.readFileSync(filePath, 'utf8'));

  if (!versions || !Array.isArray(versions)) {
    return;
  }

  for (const [index, version] of versions.entries()) {
    const openapiFilename = `openapi-${version}.json`;
    const openapiFilePath = path.join(path.dirname(filePath), openapiFilename);

    if (!fs.existsSync(openapiFilePath)) {
      continue;
    }

    const file = `${directory}/${openapiFilename}`;
    SPEC_MAPPING.push({
      doc: docId,
      file,
      branch: version,
    });

    // We want the latest version to have its own version AND be the latest/default branch
    if (index === versions.length - 1) {
      SPEC_MAPPING.push({
        doc: docId,
        file,
        branch: 'latest',
      });
    }
  }
}

handleAdminAPIv2();
// Output to GH action
console.log(JSON.stringify(SPEC_MAPPING));
