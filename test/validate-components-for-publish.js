/* @flow */

import pkg from '../package.json';
import pkgLock from '../package-lock.json';

async function validateComponents() : Promise<void> {
    // loop through all the @paypal dependencies and ensure their dependencies are included in package.json
    const pkgDependencies = Object.keys(pkg.dependencies);

    for (const dependencyName of pkgDependencies) {
        if (!dependencyName.includes('@paypal')) return;

        for (const subDependencyName of Object.keys(pkgLock.dependencies[dependencyName].requires)) {
            if (!pkgDependencies.includes(subDependencyName)) {
                throw new Error(`Expected package.json to include ${ subDependencyName } because its a dependency of ${ dependencyName }`);
            }
        }

        // eslint-disable-next-line no-console
        console.log(`Validated ${ dependencyName }`);
    }
}

validateComponents().catch(err => {
    // eslint-disable-next-line no-console
    console.error(err);
    // eslint-disable-next-line no-process-exit, unicorn/no-process-exit
    process.exit(1);
});
