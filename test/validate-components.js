import { join } from "path";

import { exists } from "fs-extra";

import pkg from "../package.json";

const SDK_JS = "__sdk__.js";
const NODE_MODULES = "node_modules";

const BABELRC_NAMES = [".babelrc", ".babelrc.json", ".babelrc.js"];

async function validateComponents() {
  for (const dependencyName of Object.keys(pkg.dependencies)) {
    const dependencyPath = join(NODE_MODULES, dependencyName);

    if (!(await exists(join(dependencyPath, SDK_JS)))) {
      throw new Error(`Expected ${dependencyName} to have ${SDK_JS}`);
    }

    if (!(await exists(join(dependencyPath, SDK_JS)))) {
      throw new Error(`Expected ${dependencyName} to have ${SDK_JS}`);
    }

    const componentMeta = require(join(dependencyName, SDK_JS)); // eslint-disable-line security/detect-non-literal-require

    const moduleNames = Object.keys(componentMeta);

    if (!moduleNames.length) {
      throw new Error(
        `Expected ${dependencyName} ${SDK_JS} to define a least one module`
      );
    }

    for (const moduleName of moduleNames) {
      const moduleMeta = componentMeta[moduleName];

      if (!moduleMeta.entry) {
        throw new Error(
          `Expected ${dependencyName} ${SDK_JS} ${moduleName} to contain entry key`
        );
      }
    }

    for (const babelrc of BABELRC_NAMES) {
      if (await exists(join(dependencyPath, babelrc))) {
        throw new Error(`Expected ${dependencyName} to not contain ${babelrc}`);
      }
    }

    // eslint-disable-next-line no-console
    console.log(`Validated ${dependencyName}`);
  }
}

validateComponents().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err);
  // eslint-disable-next-line no-process-exit, unicorn/no-process-exit
  process.exit(1);
});
