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
  execSync(`git commit -m "chore: release ${newVersion}"`);
  execSync(
    `git tag "Release ${newVersion} (${new Date()
      .toUTCString()
      .substring(5, 16)})"`
  );
  execSync(`git push`);
  execSync(`git push --tags`);
}

main();
