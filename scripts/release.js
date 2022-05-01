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
      initial: 1,
      message: `What's the type of release? (Current version: ${currentVersion})`,
      choices: [
        { name: majorVersion, message: `Major (${majorVersion})` },
        { name: minorVersion, message: `Minor (${minorVersion})` },
        { name: patchVersion, message: `Patch (${patchVersion})` },
      ],
    },
  ]);
  updateVersion(releaseVersion);
  createZipFile(releaseVersion);
}

function updateVersion(newVersion) {
  updateVersionOfPackageJSON(newVersion);
  updateVersionOfManifestJSON(newVersion);
}

function updateVersionOfPackageJSON(newVersion) {
  const packageJSON = JSON.parse(
    fs.readFileSync(path.resolve(__dirname, '../package.json'), 'utf8')
  );
  packageJSON.version = newVersion;
  fs.writeFileSync(
    path.resolve(__dirname, '../package.json'),
    JSON.stringify(packageJSON, null, 2),
    'utf8'
  );
  console.info(`Updated package.json and manifest.json to ${newVersion}`);
}

function updateVersionOfManifestJSON(newVersion) {
  const manifestJSON = JSON.parse(
    fs.readFileSync(path.resolve(__dirname, '../src/manifest.json'), 'utf8')
  );
  manifestJSON.version = newVersion;
  fs.writeFileSync(
    path.resolve(__dirname, '../src/manifest.json'),
    JSON.stringify(manifestJSON, null, 2),
    'utf8'
  );
  console.info(`Updated manifest.json to ${newVersion}`);
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
  execSync(`zip -r ./releases/photo-maniac-${newVersion}.zip ./dist`);
}

main();
