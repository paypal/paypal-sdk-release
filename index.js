/* @flow */

import { setupSDK, type SetupComponent } from '@paypal/sdk-client/src';

export default (namespace : string, verison : string, components : $ReadOnlyArray<SetupComponent<mixed>>) => {
    return setupSDK(components);
};
