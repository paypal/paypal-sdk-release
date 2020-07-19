/* @flow */
/* eslint import/no-commonjs: off */

const { join, extname } = require('path');

const fetch = require('node-fetch');
const { ensureDir, outputFile, exists, readFile } = require('fs-extra');
const download = require('download');

const REGISTRY = 'http://registry.npmjs.org';
const CDN_URL = 'https://www.paypalobjects.com';

const INFO_FILE_NAME = 'info.json';
const TARBALL_FOLDER_NAME = 'tarballs';

const PACKAGE = join(__dirname, '..', 'package.json');
const PACKAGE_LOCK = join(__dirname, '..', 'package-lock.json');
const NODE_OPS = join(__dirname, '..', '.nodeops');
const CDN_PATH = join(__dirname, '..', 'cdn');

type Package = {|
    name : string,
    version : string
|};

type PackageLock = {|
    dependencies : {|
        [string] : {|
            version : string
        |}
    |}
|};

type PackageInfo = {|
    versions : {|
        [string] : {|
            dist : {|
                tarball : string
            |}
        |}
    |}
|};

type NodeOps = {|
    web : {|
        staticNamespace : string
    |}
|};

const cdnify = async ({ cdnNamespace, name, version }) => {
    const infoRes = await fetch(`${ REGISTRY }/${ name }`);
    const info : PackageInfo = await infoRes.json();

    if (!version) {
        throw new Error(`Package lock for ${ name } has no version`);
    }

    if (!info.versions) {
        throw new Error(`NPM info for ${ name } has no versions`);
    }

    const versionInfo = info.versions[version];

    if (!versionInfo) {
        throw new Error(`NPM info for ${ name } has no version ${ version }`);
    }

    const tarball = versionInfo.dist && versionInfo.dist.tarball;

    if (!versionInfo) {
        throw new Error(`NPM info for ${ name }@${ version } has no tarball`);
    }

    const cdnModuleDir = join(CDN_PATH, name);
    const cdnModuleTarballDir = join(cdnModuleDir, TARBALL_FOLDER_NAME);
        
    const cdnModuleInfoFile = join(cdnModuleDir, INFO_FILE_NAME);
    const cdnModuleTarballFileName = `${ version }${ extname(tarball) }`;

    await ensureDir(cdnModuleDir);
    await ensureDir(cdnModuleTarballDir);

    await download(tarball, cdnModuleTarballDir, { filename: cdnModuleTarballFileName });

    const cdnInfo = JSON.parse(JSON.stringify(info));

    for (const [ moduleVersion, moduleVersionInfo ] of Object.entries(cdnInfo.versions)) {
        const moduleVersionTarballFileName = `${ moduleVersion }${ extname(tarball) }`;
        const moduleVersionTarballFile = join(cdnModuleTarballDir, moduleVersionTarballFileName);

        if (await exists(moduleVersionTarballFile)) {
            const relativeTarballDir = join('.', name, TARBALL_FOLDER_NAME, moduleVersionTarballFileName);
            const cdnTarballUrl = `${ CDN_URL }/${ cdnNamespace }/${ relativeTarballDir }`;

            // $FlowFixMe
            moduleVersionInfo.dist = moduleVersionInfo.dist || {};
            moduleVersionInfo.dist.tarball = cdnTarballUrl;
        }
    }

    await outputFile(cdnModuleInfoFile, JSON.stringify(cdnInfo, null, 4));
};

const cdnifyAll = async () => {
    const pkg : Package = JSON.parse(await readFile(PACKAGE));
    const packageLock : PackageLock = JSON.parse(await readFile(PACKAGE_LOCK));
    const nodeops : NodeOps = JSON.parse(await readFile(NODE_OPS));

    const cdnNamespace = nodeops.web.staticNamespace;

    await Promise.all(Object.entries(packageLock.dependencies).map(async ([ dependencyName, dependency ]) => {
        await cdnify({
            cdnNamespace,
            name:    dependencyName,
            // $FlowFixMe
            version: dependency.version
        });
    }));

    await cdnify({
        cdnNamespace,
        name:    pkg.name,
        version: pkg.version
    });
};

cdnifyAll().catch((err) => {
    // eslint-disable-next-line no-console
    console.error(err);
    // eslint-disable-next-line no-process-exit, unicorn/no-process-exit
    process.exit(1);
});
