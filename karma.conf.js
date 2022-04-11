/* @flow */
/* eslint import/no-default-export: off */

import { getKarmaConfig } from '@krakenjs/grumbler-scripts/config/karma.conf';
import { getWebpackConfig } from '@krakenjs/grumbler-scripts/config/webpack.config';

export default function configKarma(karma : Object) {

    const karmaConfig = getKarmaConfig(karma, {
        basePath: __dirname,
        webpack:  getWebpackConfig()
    });

    karma.set(karmaConfig);
}
