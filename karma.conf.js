/* @flow */

import { getKarmaConfig } from 'grumbler-scripts/config/karma.conf';

import { WEBPACK_CONFIG } from './webpack.config';

export default function configKarma(karma : Object) {

    let karmaConfig = getKarmaConfig(karma, {
        basePath: __dirname,
        webpack:  WEBPACK_CONFIG
    });

    karma.set(karmaConfig);
}
