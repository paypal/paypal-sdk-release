const fetch = require("node-fetch");
const fs = require("fs");

const latest = JSON.parse(fs.readFileSync("./package.json", "utf-8")).version;
const prev = latest
  .split(".")
  .map((e, i) => (i === 2 ? --e : e))
  .join(".");

export const getDependencies = async (version) => {
  const url = `https://www.paypalobjects.com/js-sdk-release/${version}/paypal/sdk-release/info.json`;
  const response = await fetch(url);
  const data = await response.json();
  return data.versions[version].dependencies;
};

export const compareUrl = (dependency, previous, current) => {
  let githubPath = dependency.replace("@", "");
  if (dependency.match("paypal")) {
    githubPath = githubPath.replace("paypal/", "paypal/paypal-");
  }
  return {
    api: `https://api.github.com/repos/${githubPath}/compare/v${previous}...v${current}`,
    html: `https://github.com/${githubPath}/compare/v${previous}...v${current}`,
  };
};

export const getDiff = async (apiUrl) => {
  const response = await fetch(apiUrl);
  const data = await response.json();
  return data.commits
    .filter((commit) => commit.commit.message?.match(/\(#/))
    .map((commit) => ({
      message: commit.commit.message.split("\n")[0],
      author: commit.commit.author.name,
      htmlUrl: commit.html_url,
    }));
};

export const getDependencyDiffs = async (previousVersion, currentVersion) => {
  const currentDependencies = await getDependencies(currentVersion);
  const previousDependencies = await getDependencies(previousVersion);
  const diff = {};
  for (let dependency in currentDependencies) {
    const previous = previousDependencies[dependency];
    const current = currentDependencies[dependency];
    if (current !== previous) {
      diff[dependency] = compareUrl(dependency, previous, current);
    }
  }
  for (let dependency in diff) {
    diff[dependency].changes = await getDiff(diff[dependency].api);
  }
  return diff;
};

export const asciiDependencyDiff = (dependency, compareUrl) => {
  const [_, from, to] = compareUrl.match(/\/(v[0-9\.]+)\.\.\.(v[0-9\.]+)/);
  return `${dependency.padEnd(30, " ")}${from} -> ${to}`;
};

export const main = async () => {
  const diff = await getDependencyDiffs(prev, latest);
  console.log("\n");
  console.log("```");
  for (let dep in diff) {
    console.log(asciiDependencyDiff(dep, diff[dep].api));
  }
  console.log("```");
  console.log("");
  console.log(`<${compareUrl("@paypal/sdk-release", prev, latest).html}>`);
  console.log("\n**Contributors**\n");

  for (let dep in diff) {
    console.log(`<${diff[dep].html}>`);
    diff[dep].changes.forEach((change) => {
      console.log(` - [${change.message}](${change.htmlUrl}) ${change.author}`);
    });
    console.log("");
  }
  console.log("\n");
};

if (!module.parent) {
  main().catch((e) => {
    console.log("❌ Something went wrong!");
    console.log(
      "You'll need to manually create the changelog notes from the diff in package-lock.json"
    );
    console.log(e);
  });
}
