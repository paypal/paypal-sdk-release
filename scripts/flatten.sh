#!/bin/bash

set -e;

if ! git diff-files --quiet; then
    echo "Can not flatten with unstaged uncommited changes";
    exit 1;
fi;

if ! git diff-index --quiet --cached HEAD; then
    echo "Can not flatten with staged uncommited changes";
    exit 1;
fi;

node $(npm bin)/check-node-version --node='>=8' --npm='>=5';

cat << EOF | node

    let fs = require('fs');

    const PACKAGE = './package.json';
    const PACKAGE_LOCK = './package-lock.json';

    if (!fs.existsSync(PACKAGE)) {
        throw new Error('Expected package.json to be present');
    }

    if (!fs.existsSync(PACKAGE_LOCK)) {
        throw new Error('Expected package-lock.json to be present');
    }

    let pkg = require(PACKAGE);
    let pkgLock = require(PACKAGE_LOCK);

    let flattenedDependencies = {};
    
    for (let depName of Object.keys(pkgLock.dependencies)) {
        let dep = pkgLock.dependencies[depName];
        flattenedDependencies[depName] = dep.version;

        if (dep.dependencies) {
            throw new Error('Expected ' + depName +
                ' to not have any unflattened sub-dependencies - found ' +
                Object.keys(dep.dependencies).join(', '));
        }
    }

    pkg.dependencies = flattenedDependencies;

    fs.writeFileSync(PACKAGE, JSON.stringify(pkg, null, 2));

EOF