/* @flow */

import pkgLock from '../package-lock.json';

for (let depName of Object.keys(pkgLock.dependencies)) {
    let dep = pkgLock.dependencies[depName];

    if (dep.dependencies) {
        throw new Error(`Expected ${  depName } to not have any unflattened sub-dependencies - found ${ Object.keys(dep.dependencies).join(', ') }`);
    }
}
