#!/usr/bin/env node
const inquirer = require("inquirer");
const chalk = require("chalk");

/**
 *
 * Ideas for future enhancement:
 * - Generate full change log (version changes)
 * - poll this url to detect when changes are in production: https://www.paypalobjects.com/js-sdk-release/paypal/sdk-release/info.json
 * - verify cdnx bundle version for the script runner (curl https://uideploy--staticcontent--${bundleId}--ghe.preview.dev.paypalinc.com/js-sdk-release/paypal/sdk-release/info.json),
 *   parse it, and verify version numbers match the right tags
 * - kick off GH actions from cli and monitor their progress before moving on
 * - use Slack API to automatically post messages
 * - display pre-reqs if user has never done a deploy
 * - save script progress, ask to continue or clear if script exits early
 */

/* Utilities */

const waitForEnter = () =>
  inquirer.prompt([{ message: "Press Enter to continue", name: "continue" }]);

const log = (input) => console.log(`${input}\n`);

const link = (input) => chalk.underline(chalk.blue(input));
const warning = (input) => chalk.yellow(input);

const getCdnxInfoJsonFile = (bundleId) =>
  `https://uideploy--staticcontent--${bundleId}--ghe.preview.dev.paypalinc.com/js-sdk-release/paypal/sdk-release/info.json`;

class Context {
  constructor() {
    this.values = {};
  }

  get(key) {
    return this.values[key];
  }

  set(key, value) {
    this.values[key] = value;
  }
}

/* Steps */

const notifyTeamOfDeploymentStart = () => {
  log(`
  Send the following message to the ${chalk.bold("#js-sdk-dev")} channel:\n
  :clapper: Starting prep for JS SDK release :soon: `);

  return waitForEnter();
};

const upgradeSdkDependencies = () => {
  log(`
  Upgrade dependencies for the SDK using the following Github Action:\n
  ${link(
    "https://github.com/paypal/paypal-sdk-release/actions/workflows/upgrade.yml\n"
  )}
  ${warning(
    "Wait for the Github Action to complete before moving to the next step"
  )}`);

  return waitForEnter();
};

// TODO:
// Enter the new sdk version in this step
const publishSdkToNpm = () => {
  log(`
  Publish the SDK to the npm registry using the following Github Action:\n
  ${link(
    "https://github.com/paypal/paypal-sdk-release/actions/workflows/publish.yml\n"
  )}
  ${warning(
    "Wait for the Github Action to complete before moving to the next step"
  )}`);

  return waitForEnter();
};

// TODO:
// Enter the bundle id during this step
const runJenkinsJobToGenerateFirstBundle = () => {
  log(`
  Build the following Jenkins job to create the first sdk bundle. Make sure GIT_REPOSITORY is set to https://github.com/paypal/paypal-sdk-release\n
  ${link(
    "https://ci.paypalcorp.com/HermesRelease/job/Stage-Assets-QA-CDN/build?delay=0sec\n"
  )}
  You should receive an email from assetdeploy-notifications@gcp.dev.paypalinc.com with a link to the bundles on CDNX.\n
  ${warning("Wait for this email before preceding.")}\n
  If you don't receive an email a few minutes after the Jenkins job finishes, check with other deployers.`);

  return waitForEnter();
};

const activateNpmDistTags = () => {
  log(`
  Activate the npm dist tags for the sdk using the following Github Action:\n
  ${link(
    "https://github.com/paypal/paypal-sdk-release/actions/workflows/activate.yml\n"
  )}
  ${warning(
    "Wait for the Github Action to complete before moving to the next step"
  )}`);

  return waitForEnter();
};

// TODO:
// Enter the bundle id during this step
const runJenkinsJobToGenerateSecondBundle = () => {
  log(`
  Build the following Jenkins job to create the second sdk bundle. Make sure GIT_REPOSITORY is set to https://github.com/paypal/paypal-sdk-release\n
  ${link(
    "https://ci.paypalcorp.com/HermesRelease/job/Stage-Assets-QA-CDN/build?delay=0sec\n"
  )}
  You should receive an email from assetdeploy-notifications@gcp.dev.paypalinc.com with a link to the bundles on CDNX.\n
  ${warning("Wait for this email before preceding.")}\n
  If you don't receive an email a few minutes after the Jenkins job finishes, check with other deployers.`);

  return waitForEnter();
};

const validateFirstBundleOnCdnx = async (context) => {
  const { firstBundleId } = await inquirer.prompt([
    { name: "firstBundleId", message: "Enter the first bundle id" },
  ]);

  context.set("firstBundleId", firstBundleId);

  log(`
  Navigate to the ${chalk.bold("first")} CDNX bundle link.\n
  ${link(getCdnxInfoJsonFile(firstBundleId))}\n
  Ensure the expected SDK version number in "dist-tags" is set for:\n
  "latest", "active-test", "active-local", and "active-stage"`);

  return waitForEnter();
};

const validateSecondBundleOnCdnx = async (context) => {
  const { secondBundleId } = await inquirer.prompt([
    { name: "secondBundleId", message: "Enter the second bundle id" },
  ]);

  context.set("secondBundleId", secondBundleId);

  log(`
  Navigate to the ${chalk.bold("second")} CDNX bundle link.\n
  ${link(getCdnxInfoJsonFile(secondBundleId))}\n
  Ensure the expected SDK version number in "dist-tags" is set for:\n
  "latest", "active-test", "active-local", "active-stage", "active-sandbox" and "active-production" `);

  return waitForEnter();
};

const validateJavascriptInBundles = () => {
  log(`
  Do the following steps to verify the JavaScript of ${chalk.bold(
    "both"
  )} bundles

  * Run clientsdknodeweb locally
  * Change BUNDLE_ID_GOES_HERE in the index.html file under /scripts/index.html to the bundle id to test
  * Serve it: cd ./scripts && ruby -run -e httpd . -p 2000
  * Make sure you can click the PayPal button, that the pop-up opens, and that there are no JS errors`);

  return waitForEnter();
};

const updateChangelog = async (context) => {
  const { newVersion, previousVersion } = await inquirer.prompt([
    {
      name: "previousVersion",
      message: "Enter the previous sdk version number",
    },
    { name: "newVersion", message: "Enter the new sdk version number" },
  ]);

  const firstBundleId = context.get("firstBundleId");
  const secondBundleId = context.get("secondBundleId");
  log(`
  The change log is located here:\n
  ${link(
    "https://engineering.paypalcorp.com/confluence/pages/viewpage.action?spaceKey=Checkout&title=JS+SDK+CDNX+Changelog"
  )}\n
  Create a new row in the table. It's easiest to copy the last row and paste it. Change the date to today's date and version to the current version.
  Use the following for CDNX Bundle IDs Column. Note that Confluence doesn't work well with pasting links, you'll have to build them yourself.\n
  1. [Bundle ID: ${firstBundleId}|https://cdnx-ui.qa.paypal.com/bundles/${firstBundleId}]
    a. when deployed to production this bundle will queue up the new release.
    b. Stage Environment for testing changes
      i. [JS SDK URL|https://www.msmaster.qa.paypal.com/sdk/js?client-id=alc_client1&debug=true&cdn-registry=https://uideploy--staticcontent--${firstBundleId}--ghe.preview.dev.paypalinc.com/js-sdk-release&version=${newVersion}]
      ii. [SDK Release Info.json|https://uideploy--staticcontent--${firstBundleId}--ghe.preview.dev.paypalinc.com/js-sdk-release/paypal/sdk-release/info.json]
  2. [Bundle ID: ${secondBundleId}|https://cdnx-ui.qa.paypal.com/bundles/${secondBundleId}]
    a. when deployed to production this bundle will activate the new release.
    b. Stage Environment for testing changes
      i. [JS SDK URL|https://www.msmaster.qa.paypal.com/sdk/js?client-id=alc_client1&debug=true&cdn-registry=https://uideploy--staticcontent--${secondBundleId}--ghe.preview.dev.paypalinc.com/js-sdk-release]
      ii. [SDK Release Info.json|https://uideploy--staticcontent--${secondBundleId}--ghe.preview.dev.paypalinc.com/js-sdk-release/paypal/sdk-release/info.json]
   
  To fill out the code changelog do the following:
  Go to the following url and find the package-lock.json file:\n
  ${link(
    `https://github.com/paypal/paypal-sdk-release/compare/v${previousVersion}...v${newVersion}`
  )}\n
  Make note of all the packages with changed versions and log them
  For every changed package, create a new row  in the App/Contributor table like this:
  App                                                                           Contributer
  ---                                                                           ---
  https://github.com/REPO_OWNER/REPO_NAME/compare/vOLD_VERSION...vNEW_VERSION | @ConfluenceName of anyone who commited (if possible)\n
  Once the changelog is complete, post the following message to ${chalk.bold(
    "#js-sdk-dev"
  )}:\n
:announcement: JS SDK Release candidate ${newVersion} is ready for testing in Stage. :announcement-r:
The cdnx bundle ids and stage testing urls are documented here: https://engineering.paypalcorp.com/confluence/display/Checkout/JS+SDK+CDNX+Changelog. As a reminder, we’d like all contributors to sign-off on these two bundle ids in the stage environment at the confluence link above.`);

  return waitForEnter();
};

const engageCommandCenter = () => {
  log("TODO: Implement this step");
};

const approveFirstBundle = () => {
  log("TODO: Implement this step");
};

const deployFirstBundle = () => {
  log("TODO: Implement this step");
};
const deployFirstBundle = () => {
  log("TODO: Implement this step");
};
const verifyFirstBundle = () => {
  log("TODO: Implement this step");
};
const approveSecondBundle = () => {
  log("TODO: Implement this step");
};
const deploySecondBundle = () => {
  log("TODO: Implement this step");
};
const verifySecondBundle = () => {
  log("TODO: Implement this step");
};

const steps = [
  notifyTeamOfDeploymentStart,
  upgradeSdkDependencies,
  publishSdkToNpm,
  runJenkinsJobToGenerateFirstBundle,
  activateNpmDistTags,
  runJenkinsJobToGenerateSecondBundle,
  validateFirstBundleOnCdnx,
  validateSecondBundleOnCdnx,
  validateJavascriptInBundles,
  updateChangelog,
  engageCommandCenter,
  approveFirstBundle,
  deployFirstBundle,
  deployFirstBundle,
  verifyFirstBundle,
  approveSecondBundle,
  deploySecondBundle,
  verifySecondBundle,
];

(async function () {
  const context = new Context();
  for (const step of steps) {
    await step(context);
  }
})();
