/* @flow */
/* eslint import/no-default-export: off */

import { setupSDK, type SetupComponent } from '@paypal/sdk-client/src';

// $FlowFixMe
export default (namespace : string, verison : string, components : $ReadOnlyArray<SetupComponent<mixed>>) => {
    return setupSDK(components);
};
