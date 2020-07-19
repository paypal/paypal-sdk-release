/* @flow */
/* eslint import/no-commonjs: off */

let fs = require('fs');
let path = require('path');

const PACKAGE_LOCK = path.join(__dirname, '../', 'package-lock.json');

// eslint-disable-next-line no-sync
if (!fs.existsSync(PACKAGE_LOCK)) {
    throw new Error('Expected package-lock.json to be present');
}

// $FlowFixMe
let pkgLock = require(PACKAGE_LOCK); // eslint-disable-line security/detect-non-literal-require

const flatten = (def) => {
    if (def.dependencies) {
        for (const depName of Object.keys(def.dependencies)) {
            const dep = def.dependencies[depName];
            if (dep.dev) {
                delete def.dependencies[depName];
            } else {
                flatten(def.dependencies[depName]);
            }
        }
    }
};

flatten(pkgLock);

// eslint-disable-next-line no-sync
fs.writeFileSync(PACKAGE_LOCK, JSON.stringify(pkgLock, null, 2));
