let fs = require('fs');
let path = require('path');
const PACKAGE_LOCK = path.join(__dirname, '../', 'package-lock.json');

if (!fs.existsSync(PACKAGE_LOCK)) {
    throw new Error('Expected package-lock.json to be present');
}

let pkgLock = require(PACKAGE_LOCK);

const flatten = (def) => {
    if (def.dependencies) {
        for (const depName of Object.keys(def.dependencies)) {
            const dep = def.dependencies[depName];
            if (dep.dev) {
                delete def.dependencies[depName];
            } else {
                flatten(def.dependencies[depName])
            }
        }
    }
}

flatten(pkgLock);

fs.writeFileSync(PACKAGE_LOCK, JSON.stringify(pkgLock, null, 2));
