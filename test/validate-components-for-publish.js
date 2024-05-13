import pkg from "../package.json";
import pkgLock from "../package-lock.json";

// loop through all the @paypal dependencies and ensure their dependencies are included in package.json
const pkgDependencies = Object.keys(pkg.dependencies);

for (const dependencyName of pkgDependencies) {
  if (dependencyName.includes("@paypal")) {
    for (const subDependencyName of Object.keys(
      pkgLock.dependencies[dependencyName].requires
    )) {
      if (!pkgDependencies.includes(subDependencyName)) {
        throw new Error(
          `Expected package.json to include ${subDependencyName} because its a dependency of ${dependencyName}`
        );
      }
    }

    // eslint-disable-next-line no-console
    console.log(`Validated ${dependencyName}`);
  }
}
