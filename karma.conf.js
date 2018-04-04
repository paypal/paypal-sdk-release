/* @flow */

import { getKarmaConfig } from 'grumbler-scripts/config/karma.conf';
import { getWebpackConfig } from 'grumbler-scripts/config/webpack.config';

export default function configKarma(karma : Object) {

    let karmaConfig = getKarmaConfig(karma, {
        basePath: __dirname,
        webpack:  getWebpackConfig()
    });

    karma.set(karmaConfig);
}
