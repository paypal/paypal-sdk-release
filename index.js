/* eslint import/no-default-export: off */

import { setupSDK } from "@paypal/sdk-client/src";

export default (namespace, verison, components) => {
  return setupSDK(components);
};
