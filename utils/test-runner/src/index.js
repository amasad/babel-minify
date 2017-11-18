/* eslint-disable no-console */

const fs = require("./fs");
const path = require("path");
const babel = require("babel-core");
const parseArgs = require("./argParser");

function testRunner(dir) {
  const pkgDir = path.join(dir, "../");
  const packageJson = JSON.parse(
    fs.readFileSync(path.join(pkgDir, "package.json"))
  );
  const pkgName = packageJson.name;

  const fixturesDir = path.join(pkgDir, "__tests__/fixtures");

  const fixtures = fs
    .readdirSync(fixturesDir)
    .filter(dir => fs.isDirectorySync(path.join(fixturesDir, dir)));

  const flags = parseArgs(process.argv);
  const updateFixtures = Boolean(flags["update-fixtures"]);

  describe(pkgName, () => {
    for (const fixture of fixtures) {
      const actualFile = path.join(fixturesDir, fixture, "actual.js");
      const expectedFile = path.join(fixturesDir, fixture, "expected.js");
      const skipFile = path.join(fixturesDir, fixture, "skip");
      const optionsFile = path.join(fixturesDir, fixture, "options.json");

      if (fs.isFileSync(skipFile)) {
        test.skip(fixture, () => {});
        continue;
      }

      test(fixture, async () => {
        const actual = await fs.readFile(actualFile);

        let options = {};
        if (await fs.isFile(optionsFile)) {
          options = JSON.parse(await fs.readFile(optionsFile));
        }

        const pluginPath = path.join(pkgDir, "src/index.js");

        const actualTransformed = babel.transform(actual, {
          plugins: [[pluginPath, options]]
        }).code;

        if (!await fs.isFile(expectedFile)) {
          await fs.writeFile(expectedFile, actualTransformed);
          console.warn("Created fixture's expected file - " + expectedFile);
        } else if (updateFixtures) {
          const expected = await fs.readFile(expectedFile);
          if (expected !== actualTransformed) {
            await fs.writeFile(expectedFile, actualTransformed);
            console.warn("Updated fixture's expected file - " + expectedFile);
          }
        } else {
          const expected = await fs.readFile(expectedFile);
          expect(actualTransformed).toBe(expected);
        }
      });
    }
  });
}

module.exports = testRunner;
