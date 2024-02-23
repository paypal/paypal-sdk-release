const fetch = require("node-fetch");
const fs = require("fs");
const { execSync } = require("child_process");

const latest = execSync("npm dist-tags @paypal/sdk-release")
  .toString()
  .match(/latest: (.*)/)[1];
const prev = latest
  .split(".")
  .map((e, i) => (i === 2 ? --e : e))
  .join(".");

const dependencies = async (version) => {
  const url = `https://www.paypalobjects.com/js-sdk-release/${version}/paypal/sdk-release/info.json`;
  const response = await fetch(url);
  const data = await response.json();
  return data.versions[version].dependencies;
};

const compareUrl = (dependency, previous, current) => {
  let githubPath = dependency.replace("@", "");
  if (dependency.match("paypal")) {
    githubPath = githubPath.replace("paypal/", "paypal/paypal-");
  }
  return {
    api: `https://api.github.com/repos/${githubPath}/compare/v${previous}...v${current}`,
    html: `https://github.com/${githubPath}/compare/v${previous}...v${current}`,
  };
};

const getDiff = async (apiUrl) => {
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

(async () => {
  const currentDependencies = await dependencies(latest);
  const previousDependencies = await dependencies(prev);
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

  console.log("```");
  for (let dep in diff) {
    const [_, from, to] = diff[dep].api.match(/\/(v[0-9\.]+)\.\.\.(v[0-9\.]+)/);
    console.log(`${dep.padEnd(30, " ")}${from} -> ${to}`);
  }
  console.log("```");
  console.log("");
  console.log(
    `<https://github.com/paypal/sdk-release/compare/${prev}...${latest}>`
  );
  console.log("");
  console.log("**Contributors**");
  console.log("");

  for (dep in diff) {
    console.log(`<${diff[dep].html}>`);
    diff[dep].changes.forEach((change) => {
      console.log(` - [${change.message}](${change.htmlUrl}) ${change.author}`);
    });
    console.log("");
  }
})();
