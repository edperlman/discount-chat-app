const fs = require('fs');
const path = require('path');

const braceExpansionPath = path.resolve(
  __dirname,
  '../node_modules/.pnpm/brace-expansion@2.0.1/node_modules/brace-expansion'
);

const packageJsonPath = path.join(braceExpansionPath, 'package.json');

if (fs.existsSync(packageJsonPath)) {
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
  packageJson.dependencies = packageJson.dependencies || {};
  packageJson.dependencies['balanced-match'] = '^3.0.1';

  fs.writeFileSync(
    packageJsonPath,
    JSON.stringify(packageJson, null, 2),
    'utf-8'
  );

  console.log('Successfully added balanced-match to brace-expansion dependencies.');
} else {
  console.error(
    `brace-expansion package.json not found at ${braceExpansionPath}`
  );
}
