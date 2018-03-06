/* @flow */
/* eslint import/no-nodejs-modules: off */

import { getWebpackConfig } from 'grumbler-scripts/config/webpack.config';

import pkg from './package.json';

const MODULE_NAME = 'paypal';

export let WEBPACK_CONFIG = getWebpackConfig({
    options: {
        entry: Object.keys(pkg.dependencies).map(dependency => `${ dependency }/src/index`)
    },
    filename:   `${ MODULE_NAME }.js`,
    modulename: MODULE_NAME
});

export default [
    WEBPACK_CONFIG
];
