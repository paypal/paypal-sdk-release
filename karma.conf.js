/* @flow */
/* eslint import/no-default-export: off */

import { getKarmaConfig } from "@krakenjs/karma-config-grumbler";
import { getWebpackConfig } from "@krakenjs/webpack-config-grumbler";

export default function configKarma(karma : Object) {

    const karmaConfig = getKarmaConfig(karma, {
        basePath: __dirname,
        webpack:  getWebpackConfig()
    });

    karma.set(karmaConfig);
}
