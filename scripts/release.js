const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const { prompt } = require('enquirer');

const SemVer = require('semver/classes/semver');

async function main() {
  const currentVersion = new SemVer(
    require('../package.json').version
  ).toString();
  const majorVersion = new SemVer(currentVersion).inc('major').toString();
  const minorVersion = new SemVer(currentVersion).inc('minor').toString();
  const patchVersion = new SemVer(currentVersion).inc('patch').toString();
  const { releaseVersion } = await prompt([
    {
      name: 'releaseVersion',
      type: 'select',
      initial: 2,
      message: `What's the type of release? (Current version: ${currentVersion})`,
      choices: [
        { name: currentVersion, message: `Same  (${currentVersion})` },
        { name: patchVersion, message: `Patch (${patchVersion})` },
        { name: minorVersion, message: `Minor (${minorVersion})` },
        { name: majorVersion, message: `Major (${majorVersion})` },
      ],
    },
  ]);
  updateVersion(releaseVersion, '../package.json');
  updateVersion(releaseVersion, '../src/manifest.json');
  createZipFile(releaseVersion);
}

function updateVersion(newVersion, relPath) {
  const json = JSON.parse(
    fs.readFileSync(path.resolve(__dirname, relPath), 'utf8')
  );
  json.version = newVersion;
  fs.writeFileSync(
    path.resolve(__dirname, relPath),
    JSON.stringify(json, null, 2) + '\n',
    'utf8'
  );
}

function updateGit() {
  execSync(`git add package.json`);
  execSync(`git add ./src/manifest.json`);
  execSync(`git commit -m "Release v${newVersion}"`);
  execSync(`git tag v${newVersion}`);
  execSync(`git push`);
  execSync(`git push --tags`);
}

function createZipFile(newVersion) {
  if (!fs.existsSync(path.resolve(__dirname, '../releases'))) {
    fs.mkdirSync(path.resolve(__dirname, '../releases'));
  }
  const zipFile = `./releases/photo-maniac-${newVersion}.zip`;
  execSync(`zip -r ${zipFile} ./dist`);
  execSync(`open -R ${zipFile}`);
}

main();
