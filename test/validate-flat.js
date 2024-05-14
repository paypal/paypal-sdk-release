import pkgLock from "../package-lock.json";

for (const depName of Object.keys(pkgLock.dependencies)) {
  const dep = pkgLock.dependencies[depName];

  if (dep.dev) {
    continue;
  }

  if (dep.dependencies) {
    throw new Error(
      `Expected ${depName} to not have any unflattened sub-dependencies - found ${Object.keys(
        dep.dependencies
      ).join(", ")}`
    );
  }
}
