const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

function main() {
  const json = JSON.parse(
    fs.readFileSync(path.resolve(__dirname, '../package.json'), 'utf8')
  );
  const newVersion = json.version;
  execSync(`git add package.json`);
  execSync(`git add ./src/manifest.json`);
  execSync(`git commit -m "chore: release v${newVersion}"`);
  execSync(`git tag v${newVersion}`);
  execSync(`git push`);
  execSync(`git push --tags`);
}

main();
